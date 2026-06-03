import { ChangeEvent, useRef, useState } from "react";
import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TD, TH, THead } from "@/components/ui/table";
import { StatusPill } from "@/components/StatusPill";
import { useDashboard } from "@/hooks/useDashboard";

export function BorrowersPage() {
  const { data } = useDashboard();
  const [search, setSearch] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const borrowers = (data?.borrowers ?? []).filter((borrower) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return [borrower.borrower_name, borrower.phone, borrower.occupation, borrower.address]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus(`Queued ${file.name} for KYC import.`);
    event.target.value = "";
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Borrower Management</CardTitle>
        <div className="flex w-full gap-3 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted" />
            <Input className="pl-9" placeholder="Search borrowers" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
          <Button type="button" onClick={handleImportClick}>
            <Upload className="h-4 w-4" />
            Import KYC
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {importStatus && <div className="border-b border-border bg-surface px-4 py-3 text-sm font-semibold text-secondary">{importStatus}</div>}
        <Table>
          <THead><tr><TH>Name</TH><TH>Phone</TH><TH>Occupation</TH><TH>Address</TH><TH>Risk</TH><TH>Status</TH></tr></THead>
          <tbody>
            {borrowers.length ? borrowers.map((borrower) => (
              <tr key={borrower.id}>
                <TD className="font-semibold text-navy">{borrower.borrower_name}</TD>
                <TD>{borrower.phone}</TD>
                <TD>{borrower.occupation}</TD>
                <TD>{borrower.address}</TD>
                <TD><StatusPill value={borrower.risk_level} /></TD>
                <TD><StatusPill value={borrower.borrower_status} /></TD>
              </tr>
            )) : (
              <tr>
                <TD colSpan={6} className="py-10 text-center text-secondary">
                  No borrowers match your search.
                </TD>
              </tr>
            )}
          </tbody>
        </Table>
      </CardContent>
    </Card>
  );
}
