// Lightweight, UI-friendly validators shared by Add/Edit/Import
export const isNonEmpty = (s) => String(s ?? "").trim().length > 0;
export const isEmail    = (s) => !s || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(s).trim());
export const isE164     = (s) => !s || /^\+[1-9]\d{7,14}$/.test(String(s).trim());

/** @returns {{[k:string]:string}} error map */
export function validateContact(c) {
  const errors = {};
  if (!isNonEmpty(c?.name))  errors.name  = "Name is required";
  if (!isEmail(c?.email))    errors.email = "Invalid email";
  if (!isE164(c?.phone))     errors.phone = "Phone must be E.164 like +256700000000";
  if (Array.isArray(c?.attributes)) {
    c.attributes.forEach((a, i) => {
      const hasK = !!String(a?.key||"").trim();
      const hasV = !!String(a?.value||"").trim();
      if (hasK !== hasV) errors[`attr_${i}`] = "Attribute needs both key and value";
    });
  }
  return errors;
}

/** True if object has no validation errors */
export const isValid = (errs) => !errs || Object.keys(errs).length === 0;
