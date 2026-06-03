import { supabase } from "@/integrations/supabase";
import { auditLogs, notifications, users as demoUsers } from "@/constants/demoData";
import { env } from "@/lib/env";
import type { AppUser, AuditLogEntry, WorkspaceNotification } from "@/types/domain";

export interface WorkspaceData {
  users: AppUser[];
  notifications: WorkspaceNotification[];
  auditLogs: AuditLogEntry[];
  currentUser: AppUser | null;
}

const isDemoMode = !supabase || env.enableDemoData;

function getLiveClient() {
  if (!supabase) {
    throw new Error("Supabase client is not configured");
  }
  return supabase as NonNullable<typeof supabase>;
}

export async function getWorkspaceData(): Promise<WorkspaceData> {
  if (isDemoMode) {
    return {
      users: demoUsers,
      notifications,
      auditLogs,
      currentUser: demoUsers[0] ?? null
    };
  }

  const client = getLiveClient();

  const [{ data: authData }, usersResult, notificationsResult, auditLogsResult] = await Promise.all([
    client.auth.getUser(),
    client.from("users").select("*").order("created_at", { ascending: false }).limit(20),
    client.from("notifications").select("*").order("created_at", { ascending: false }).limit(20),
    client.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  for (const result of [usersResult, notificationsResult, auditLogsResult]) {
    if (result.error) throw result.error;
  }

  const currentUserId = authData.user?.id ?? null;
  const currentUser = currentUserId
    ? (usersResult.data ?? []).find((user: AppUser) => user.id === currentUserId) ?? null
    : null;

  return {
    users: (usersResult.data ?? []) as AppUser[],
    notifications: (notificationsResult.data ?? []) as WorkspaceNotification[],
    auditLogs: (auditLogsResult.data ?? []) as AuditLogEntry[],
    currentUser
  };
}

export async function updateUserAccountStatus(userId: string, accountStatus: AppUser["account_status"]): Promise<Partial<AppUser> & { demo?: boolean }> {
  if (isDemoMode) return { id: userId, account_status: accountStatus, demo: true };

  const client = getLiveClient();
  const { data, error } = await client.from("users").update({ account_status: accountStatus } as never).eq("id", userId).select("*").single();
  if (error) throw error;
  return data as AppUser;
}

export async function updateProfileDetails(userId: string, updates: Pick<AppUser, "full_name" | "phone">): Promise<Partial<AppUser> & { demo?: boolean }> {
  if (isDemoMode) return { id: userId, ...updates, demo: true };

  const client = getLiveClient();
  const { data, error } = await client
    .from("users")
    .update({ full_name: updates.full_name, phone: updates.phone } as never)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data as AppUser;
}

export async function markNotificationRead(notificationId: string, readStatus: boolean): Promise<Partial<WorkspaceNotification> & { demo?: boolean }> {
  if (isDemoMode) return { id: notificationId, read_status: readStatus, demo: true };

  const client = getLiveClient();
  const { data, error } = await client
    .from("notifications")
    .update({ read_status: readStatus } as never)
    .eq("id", notificationId)
    .select("*")
    .single();
  if (error) throw error;
  return data as WorkspaceNotification;
}

export async function markAllNotificationsRead(notificationIds: string[]): Promise<WorkspaceNotification[] | { ids: string[]; demo?: boolean }> {
  if (isDemoMode) return { ids: notificationIds, demo: true };

  if (!notificationIds.length) return { ids: [] };

  const client = getLiveClient();
  const { data, error } = await client
    .from("notifications")
    .update({ read_status: true } as never)
    .in("id", notificationIds)
    .select("*");
  if (error) throw error;
  return data as WorkspaceNotification[];
}
