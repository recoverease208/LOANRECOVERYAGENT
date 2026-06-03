import type { AppUser, Borrower, Communication, Company, Loan, Payment } from "@/types/domain";

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      companies: Table<Company>;
      users: Table<AppUser>;
      borrowers: Table<Borrower>;
      loans: Table<Loan>;
      payments: Table<Payment>;
      communications: Table<Communication>;
      audit_logs: Table<Record<string, unknown>>;
      reminders: Table<Record<string, unknown>>;
      escalations: Table<Record<string, unknown>>;
      settlements: Table<Record<string, unknown>>;
      notifications: Table<Record<string, unknown>>;
      settings: Table<Record<string, unknown>>;
      workflow_runs: Table<Record<string, unknown>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
