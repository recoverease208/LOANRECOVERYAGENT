export type UserRole = "super_admin" | "recovery_manager" | "recovery_agent" | "borrower";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type LoanStatus = "active" | "overdue" | "settled" | "closed" | "written_off";
export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "refunded";

export interface Company {
  id: string;
  company_name: string;
  company_email: string;
  company_logo: string | null;
  created_at: string;
}

export interface AppUser {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  profile_image: string | null;
  account_status: "active" | "invited" | "suspended";
  last_login: string | null;
  created_at: string;
}

export interface Borrower {
  id: string;
  company_id: string;
  user_id: string | null;
  borrower_name: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  kyc_document_url: string | null;
  risk_level: RiskLevel;
  borrower_status: "current" | "overdue" | "in_escalation" | "settled";
  created_at: string;
}

export interface Loan {
  id: string;
  borrower_id: string;
  loan_amount: number;
  emi_amount: number;
  interest_rate: number;
  due_date: string;
  next_payment_date: string;
  overdue_days: number;
  loan_status: LoanStatus;
  created_at: string;
  borrower?: Borrower;
}

export interface Payment {
  id: string;
  loan_id: string;
  payment_amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  razorpay_payment_id: string | null;
  payment_proof_url: string | null;
  paid_at: string | null;
}

export interface Communication {
  id: string;
  borrower_id: string;
  communication_channel: "sms" | "whatsapp" | "email" | "voice";
  communication_type: string;
  ai_generated: boolean;
  message_content: string;
  communication_status: "queued" | "sent" | "delivered" | "failed";
  created_at: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  change: string;
  tone: "success" | "warning" | "error" | "info";
}

export interface WorkspaceNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  read_status: boolean;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action_type: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}
