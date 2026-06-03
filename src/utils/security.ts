export function sanitizePlainText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function requireRole(userRole: string, allowed: string[]) {
  if (!allowed.includes(userRole)) {
    throw new Error("You do not have permission to perform this action.");
  }
}
