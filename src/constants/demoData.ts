import type { AppUser, AuditLogEntry, Borrower, Communication, KpiMetric, Loan, Payment, WorkspaceNotification } from "@/types/domain";

export const kpiMetrics: KpiMetric[] = [
  { label: "Recovered this month", value: "INR 2.84Cr", change: "+18.2%", tone: "success" },
  { label: "Active overdue", value: "428", change: "-7.4%", tone: "warning" },
  { label: "AI response rate", value: "64.8%", change: "+11.9%", tone: "info" },
  { label: "Escalations open", value: "39", change: "-12.0%", tone: "success" }
];

export const borrowers: Borrower[] = [
  {
    id: "b-101",
    company_id: "c-1",
    user_id: null,
    borrower_name: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    phone: "+91 98765 43210",
    address: "Andheri East, Mumbai",
    occupation: "Retail owner",
    kyc_document_url: null,
    risk_level: "medium",
    borrower_status: "overdue",
    created_at: "2026-04-01T08:00:00Z"
  },
  {
    id: "b-102",
    company_id: "c-1",
    user_id: null,
    borrower_name: "Nisha Rao",
    email: "nisha.rao@example.com",
    phone: "+91 99887 76655",
    address: "Koramangala, Bengaluru",
    occupation: "Consultant",
    kyc_document_url: null,
    risk_level: "low",
    borrower_status: "current",
    created_at: "2026-03-20T08:00:00Z"
  },
  {
    id: "b-103",
    company_id: "c-1",
    user_id: null,
    borrower_name: "Imran Khan",
    email: "imran.khan@example.com",
    phone: "+91 91234 56789",
    address: "Park Street, Kolkata",
    occupation: "Fleet operator",
    kyc_document_url: null,
    risk_level: "high",
    borrower_status: "in_escalation",
    created_at: "2026-02-14T08:00:00Z"
  }
];

export const loans: Loan[] = [
  {
    id: "l-201",
    borrower_id: "b-101",
    loan_amount: 850000,
    emi_amount: 28500,
    interest_rate: 12.5,
    due_date: "2026-05-15",
    next_payment_date: "2026-06-15",
    overdue_days: 13,
    loan_status: "overdue",
    created_at: "2026-01-10T08:00:00Z",
    borrower: borrowers[0]
  },
  {
    id: "l-202",
    borrower_id: "b-102",
    loan_amount: 420000,
    emi_amount: 16200,
    interest_rate: 10.2,
    due_date: "2026-06-03",
    next_payment_date: "2026-06-03",
    overdue_days: 0,
    loan_status: "active",
    created_at: "2026-02-18T08:00:00Z",
    borrower: borrowers[1]
  },
  {
    id: "l-203",
    borrower_id: "b-103",
    loan_amount: 1240000,
    emi_amount: 47200,
    interest_rate: 14.1,
    due_date: "2026-04-28",
    next_payment_date: "2026-05-28",
    overdue_days: 30,
    loan_status: "overdue",
    created_at: "2025-12-02T08:00:00Z",
    borrower: borrowers[2]
  }
];

export const payments: Payment[] = [
  {
    id: "p-301",
    loan_id: "l-201",
    payment_amount: 12000,
    payment_method: "razorpay_upi",
    payment_status: "pending",
    razorpay_payment_id: null,
    payment_proof_url: null,
    paid_at: null
  },
  {
    id: "p-302",
    loan_id: "l-202",
    payment_amount: 16200,
    payment_method: "razorpay_card",
    payment_status: "paid",
    razorpay_payment_id: "pay_demo_302",
    payment_proof_url: null,
    paid_at: "2026-05-03T09:30:00Z"
  }
];

export const communications: Communication[] = [
  {
    id: "cm-401",
    borrower_id: "b-101",
    communication_channel: "whatsapp",
    communication_type: "overdue_follow_up",
    ai_generated: true,
    message_content: "Personalized reminder sent with payment link and partial payment option.",
    communication_status: "delivered",
    created_at: "2026-05-28T06:45:00Z"
  },
  {
    id: "cm-402",
    borrower_id: "b-103",
    communication_channel: "voice",
    communication_type: "agent_callback",
    ai_generated: true,
    message_content: "Call summary flagged income disruption and suggested settlement review.",
    communication_status: "sent",
    created_at: "2026-05-28T05:15:00Z"
  }
];

export const users: AppUser[] = [
  {
    id: "u-401",
    company_id: "c-1",
    full_name: "Priya Sharma",
    email: "priya.sharma@settlie.ai",
    phone: "+91 90000 10001",
    role: "super_admin",
    profile_image: null,
    account_status: "active",
    last_login: "2026-05-31T12:20:00Z",
    created_at: "2026-01-05T08:00:00Z"
  },
  {
    id: "u-402",
    company_id: "c-1",
    full_name: "Rahul Iyer",
    email: "rahul.iyer@settlie.ai",
    phone: "+91 90000 10002",
    role: "recovery_manager",
    profile_image: null,
    account_status: "active",
    last_login: "2026-05-31T09:50:00Z",
    created_at: "2026-01-08T08:00:00Z"
  },
  {
    id: "u-403",
    company_id: "c-1",
    full_name: "Meera Nair",
    email: "meera.nair@settlie.ai",
    phone: "+91 90000 10003",
    role: "recovery_agent",
    profile_image: null,
    account_status: "invited",
    last_login: null,
    created_at: "2026-03-11T08:00:00Z"
  }
];

export const notifications: WorkspaceNotification[] = [
  {
    id: "n-501",
    user_id: "u-401",
    title: "New escalation requires review",
    message: "Imran Khan crossed the escalation threshold and needs manager review.",
    notification_type: "escalation",
    read_status: false,
    created_at: "2026-05-31T09:15:00Z"
  },
  {
    id: "n-502",
    user_id: "u-401",
    title: "Payment captured",
    message: "Razorpay webhook confirmed EMI payment for loan l-202.",
    notification_type: "payment",
    read_status: false,
    created_at: "2026-05-31T08:05:00Z"
  },
  {
    id: "n-503",
    user_id: "u-402",
    title: "Daily report sent",
    message: "Collection summary has been emailed to leadership.",
    notification_type: "report",
    read_status: true,
    created_at: "2026-05-30T18:30:00Z"
  }
];

export const auditLogs: AuditLogEntry[] = [
  {
    id: "a-601",
    user_id: "u-401",
    action_type: "ai_recovery_message_generated",
    metadata: { borrowerId: "b-101", channel: "whatsapp", tone: "empathetic" },
    ip_address: "10.0.0.12",
    created_at: "2026-05-31T07:45:00Z"
  },
  {
    id: "a-602",
    user_id: "u-402",
    action_type: "razorpay_order_created",
    metadata: { loanId: "l-201", amount: 28500, orderId: "order_demo_l-201" },
    ip_address: "10.0.0.21",
    created_at: "2026-05-31T08:02:00Z"
  }
];

export const recoveryTrend = [
  { name: "Jan", recovered: 178, overdue: 68 },
  { name: "Feb", recovered: 204, overdue: 61 },
  { name: "Mar", recovered: 229, overdue: 55 },
  { name: "Apr", recovered: 246, overdue: 49 },
  { name: "May", recovered: 284, overdue: 43 }
];
