import { normalizePhone } from "./phone";
import { FIELD_META } from "./schema";

/**
 * Normalize a Contact-like object into our UI shape.
 * - trims strings
 * - normalizes phone to E.164 where possible
 * - ensures attributes[]
 */
export function normalizeContact(input, opts = {}) {
    const c = { ...(input || {}) };
    if (c.name) c.name = String(c.name).trim();
    if (c.email) c.email = String(c.email).trim();
    if (c.phone) c.phone = normalizePhone(String(c.phone));
    c.attributes = Array.isArray(c.attributes) ? c.attributes.map(a => ({
        key: String(a?.key || "").trim(),
        value: String(a?.value || "").trim(),
    })).filter(a => a.key && a.value) : [];
    if (opts.origin === "upload") c._origin = "upload";
    if (opts.origin === "db") c._origin = "db";
    if (opts.sheet) c._sheet = opts.sheet;
    return c;
}

/** Map a parsed CSV/XLSX row object -> Contact (best-effort headers) */
export function rowToContact(row = {}, origin = "upload", sheet = undefined) {
    const get = (keys) => {
        for (const k of keys) {
            if (row[k] != null && String(row[k]).trim() !== "") return row[k];
        }
        return "";
    };
    const contact = {
        name: get(["name", "full_name", "FullName", "Name"]),
        email: get(["email", "Email"]),
        phone: get(["phone", "Phone", "mobile", "Mobile", "whatsapp", "WhatsApp"]),
        title: get(["title", "Title", "role", "Role"]),
        source: get(["source", "Source"]),
    };
    return normalizeContact(contact, { origin, sheet });
}

/** Flatten a Contact for export (CSV) */
export function contactToFlat(c = {}) {
    const attrs = Array.isArray(c.attributes) ? c.attributes.map(a => `${a.key}:${a.value}`).join("|") : "";
    return {
        id: c.id || "",
        name: c.name || "",
        email: c.email || "",
        phone: c.phone || "",
        title: c.title || "",
        source: c.source || "",
        preferredChannel: c.preferredChannel || "",
        attributes: attrs,
        createdAt: c.createdAt || c.created_at || "",
        updatedAt: c.updatedAt || c.updated_at || "",
    };
}

/** Basic column model for table building (labels from FIELD_META) */
export const DEFAULT_COLUMNS = [
    { key: "name", label: FIELD_META.name.label, width: 260 },
    { key: "phone", label: FIELD_META.phone.label, width: 180 },
    { key: "email", label: FIELD_META.email.label, width: 220 },
    { key: "source", label: FIELD_META.source.label, width: 140 },
];
