// Wrapper so all phone normalization is in one place.
// Internally you can wire libphonenumber, or reuse your existing detect/format.
export function normalizePhone(s) {
  const v = String(s || "").trim();
  // If already E.164-ish, keep; else strip and best-effort '+'
  if (/^\+[1-9]\d{7,14}$/.test(v)) return v;
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  // Fallback: keep as-is to avoid data loss; UI will flag via validation
  return digits || v;
}
