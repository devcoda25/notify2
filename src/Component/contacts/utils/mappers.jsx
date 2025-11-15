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

    // Extract primary contact info from contactInfos array
    const primaryContactInfo = c.contactInfos?.find(info => info.label === 'Primary') || c.contactInfos?.[0] || {};

    c.name = String(c.fullName || c.name || '').trim();
    c.email = String(primaryContactInfo.email || '').trim();
    c.phone = normalizePhone(String(primaryContactInfo.phoneNumber || ''));

    // Process devices array
    const devicesAll = Array.isArray(c.devices) ? c.devices.map(d => d.deviceType).filter(Boolean) : [];
    const deviceMostUsed = Array.isArray(c.devices) ? c.devices.find(d => d.isMostUsed)?.deviceType || "" : "";
    c.devices = {
        all: devicesAll,
        mostUsed: deviceMostUsed,
    };

    // Process services array
    const servicesConsumed = Array.isArray(c.services) ? c.services.map(s => s.serviceType).filter(Boolean) : [];
    const serviceMostUsed = Array.isArray(c.services) ? c.services.find(s => s.isMostUsed)?.serviceType || "" : "";
    c.services = {
        consumed: servicesConsumed,
        mostUsed: serviceMostUsed,
    };

    // Process preferences array into preferredChannel and optIn
    let preferredChannel = "";
    const optIn = { email: false, sms: false, whatsapp: false, calls: false }; // Default all to false

    if (Array.isArray(c.preferences) && c.preferences.length > 0) {
        // Assuming the first preference in the array is the primary one for preferredChannel
        preferredChannel = c.preferences[0].preferenceChannel || "";

        // Build optIn based on preferenceChannel values
        c.preferences.forEach(pref => {
            if (pref.preferenceChannel) {
                optIn[pref.preferenceChannel.toLowerCase()] = true;
            }
        });
    }
    c.preferredChannel = preferredChannel;
    c.optIn = optIn;

    // Process attributes array
    c.attributes = Array.isArray(c.attribute) ? c.attribute.map(a => ({ // Note: using c.attribute here as per your response
        key: String(a?.key || "").trim(),
        value: String(a?.value || "").trim(),
    })).filter(a => a.key && a.value) : [];

    // Process languages array (assuming it's directly on the contact object or within preferences)
    c.languages = Array.isArray(c.languages) ? c.languages : (c.preferences?.[0]?.languages || []); // Take from first preference if available

    // Add party details if available
    c.party = c.party || {};

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
