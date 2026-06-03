import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { useAppStore } from "@/store/appStore";
import { getWorkspaceData, updateUserAccountStatus } from "@/services/workspaceService";
import type { AppUser } from "@/types/domain";

export function UsersPage() {
  const role = useAppStore((state) => state.role);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const roleCounts = useMemo(
    () => users.reduce<Record<string, number>>((counts, user) => {
      counts[user.role] = (counts[user.role] ?? 0) + 1;
      return counts;
    }, {}),
    [users]
  );

  useEffect(() => {
    let mounted = true;
    void getWorkspaceData()
      .then((data) => {
        if (!mounted) return;
        setUsers(data.users);
      })
      .catch((error) => {
        if (!mounted) return;
        setStatusMessage(error instanceof Error ? error.message : "Unable to load users.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function toggleUserStatus(user: AppUser) {
    const nextStatus = user.account_status === "suspended" ? "active" : "suspended";
    setStatusMessage("");
    try {
      await updateUserAccountStatus(user.id, nextStatus);
      setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, account_status: nextStatus } : item)));
      setStatusMessage(`${user.full_name} is now ${nextStatus}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update user status.");
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-secondary">
            <span className="rounded-full bg-surface px-3 py-1">{role}</span>
            <span className="rounded-full bg-surface px-3 py-1">{roleCounts.super_admin ?? 0} admins</span>
            <span className="rounded-full bg-surface px-3 py-1">{roleCounts.recovery_manager ?? 0} managers</span>
            <span className="rounded-full bg-surface px-3 py-1">{roleCounts.recovery_agent ?? 0} agents</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {statusMessage && <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
          {loading ? (
            <p className="text-sm text-secondary">Loading users...</p>
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>User</TH>
                  <TH>Role</TH>
                  <TH>Phone</TH>
                  <TH>Status</TH>
                  <TH>Last Login</TH>
                  <TH>Actions</TH>
                </tr>
              </THead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <TD className="font-semibold text-navy">{user.full_name}</TD>
                    <TD>{user.role.replaceAll("_", " ")}</TD>
                    <TD>{user.phone ?? "n/a"}</TD>
                    <TD>{user.account_status}</TD>
                    <TD>{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</TD>
                    <TD>
                      <Button
                        variant={user.account_status === "suspended" ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => void toggleUserStatus(user)}
                        disabled={role === "borrower"}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {user.account_status === "suspended" ? "Activate" : "Suspend"}
                      </Button>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invite workflow</CardTitle>
          <Button variant="secondary">
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-secondary">
            The invite action is wired to the workspace table and can be extended to create Supabase Auth invites when you connect your production admin flows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
