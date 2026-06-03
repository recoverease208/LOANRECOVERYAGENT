import { useEffect, useState } from "react";
import { Save, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getWorkspaceData, updateProfileDetails } from "@/services/workspaceService";
import type { AppUser } from "@/types/domain";

export function ProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void getWorkspaceData()
      .then((data) => {
        if (!mounted) return;
        setUser(data.currentUser);
        setFullName(data.currentUser?.full_name ?? "");
        setPhone(data.currentUser?.phone ?? "");
      })
      .catch((error) => {
        if (!mounted) return;
        setStatusMessage(error instanceof Error ? error.message : "Unable to load profile.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave() {
    if (!user) return;
    setStatusMessage("");

    try {
      const updated = await updateProfileDetails(user.id, {
        full_name: fullName.trim() || user.full_name,
        phone: phone.trim() || user.phone
      });
      setUser((current) =>
        current
          ? {
              ...current,
              full_name: updated.full_name ?? current.full_name,
              phone: updated.phone ?? current.phone
            }
          : current
      );
      setStatusMessage("Profile updated successfully.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to update profile.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <CardHeader>
          <CardTitle>Workspace profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {statusMessage && <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{statusMessage}</div>}
          {loading ? (
            <p className="text-sm text-secondary">Loading profile...</p>
          ) : user ? (
            <>
              <div className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-mint">
                    <UserCog className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy">{user.full_name}</p>
                    <p className="text-sm text-secondary">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-secondary">
                  <p>Role: {user.role.replaceAll("_", " ")}</p>
                  <p>Status: {user.account_status}</p>
                  <p>Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</p>
                </div>
              </div>
              <div className="grid gap-3">
                <label className="text-sm font-semibold text-secondary">Display name</label>
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
                <label className="text-sm font-semibold text-secondary">Phone</label>
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
              </div>
              <Button onClick={() => void handleSave()}>
                <Save className="h-4 w-4" />
                Save profile
              </Button>
            </>
          ) : (
            <p className="text-sm text-secondary">No profile record found for the current session.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-secondary">
          <p>This screen now reads and updates the logged-in workspace user, instead of showing a generic placeholder shell.</p>
          <p>In demo mode, changes stay local. With Supabase connected, the same save action updates the `users` table.</p>
        </CardContent>
      </Card>
    </div>
  );
}
