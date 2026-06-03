import { useEffect, useMemo, useState } from "react";
import { CheckCheck, BellRing } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { getWorkspaceData, markAllNotificationsRead, markNotificationRead } from "@/services/workspaceService";
import type { WorkspaceNotification } from "@/types/domain";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void getWorkspaceData()
      .then((data) => {
        if (!mounted) return;
        setNotifications(data.notifications);
      })
      .catch((error) => {
        if (!mounted) return;
        setStatusMessage(error instanceof Error ? error.message : "Unable to load notifications.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read_status).length, [notifications]);

  async function handleMarkAllRead() {
    const unreadIds = notifications.filter((item) => !item.read_status).map((item) => item.id);
    if (!unreadIds.length) {
      setStatusMessage("All notifications are already read.");
      return;
    }

    setStatusMessage("");
    try {
      await markAllNotificationsRead(unreadIds);
      setNotifications((current) => current.map((item) => ({ ...item, read_status: true })));
      setStatusMessage("Marked all notifications as read.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update notifications.");
    }
  }

  async function toggleRead(notification: WorkspaceNotification) {
    const nextStatus = !notification.read_status;
    setStatusMessage("");
    try {
      await markNotificationRead(notification.id, nextStatus);
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, read_status: nextStatus } : item))
      );
      setStatusMessage(`${notification.title} marked ${nextStatus ? "read" : "unread"}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update notification.");
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Notifications</CardTitle>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-surface px-3 py-1 text-sm text-secondary">{unreadCount} unread</span>
            <Button variant="secondary" onClick={() => void handleMarkAllRead()}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          {statusMessage && <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
          {loading ? (
            <p className="text-sm text-secondary">Loading notifications...</p>
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>Title</TH>
                  <TH>Type</TH>
                  <TH>Message</TH>
                  <TH>Status</TH>
                  <TH>Action</TH>
                </tr>
              </THead>
              <tbody>
                {notifications.map((item) => (
                  <tr key={item.id}>
                    <TD className="font-semibold text-navy">{item.title}</TD>
                    <TD>{item.notification_type}</TD>
                    <TD className="max-w-xl">{item.message}</TD>
                    <TD>{item.read_status ? "read" : "unread"}</TD>
                    <TD>
                      <Button variant={item.read_status ? "secondary" : "primary"} size="sm" onClick={() => void toggleRead(item)}>
                        <BellRing className="h-4 w-4" />
                        {item.read_status ? "Mark unread" : "Mark read"}
                      </Button>
                    </TD>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
