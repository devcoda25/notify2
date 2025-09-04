// Lightweight, safe helpers around libphonenumber-js

import { parsePhoneNumberFromString, getCountryCallingCode } from 'libphonenumber-js/min';

// cache last parse to avoid repeated heavy work while typing
let _last = { raw: null, iso: null, out: null };

export function sanitizeDialInput(v) {
  if (!v) return '';
  // keep leading +; strip all but digits
  const hasPlus = v.trim().startsWith('+');
  const digits = v.replace(/[^\d]/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export function detectAndFormat(raw, isoHint = 'UG') {
  if (raw === _last.raw && isoHint === _last.iso && _last.out) return _last.out;

  const cleaned = (raw || '').trim();
  let out = {
    valid: false,
    e164: null,
    national: null,
    formatted: cleaned,
    iso: isoHint || null,
  };

  // If there are no digits, bail early
  if (!/\d/.test(cleaned)) {
    _last = { raw, iso: isoHint, out };
    return out;
  }

  try {
    // Prefer parsing with default country for non-plus numbers
    const phone = cleaned.startsWith('+')
      ? parsePhoneNumberFromString(cleaned)
      : parsePhoneNumberFromString(cleaned, isoHint);

    if (phone) {
      const iso = phone.country || isoHint || null;
      const e164 = phone.number; // already in E.164
      const national = phone.nationalNumber || phone.formatNational?.() || '';
      const formatted =
        phone.formatInternational?.() ||
        (e164 ?? cleaned);

      out = {
        valid: phone.isValid?.() ?? false,
        e164,
        national,
        formatted,
        iso,
      };
    } else {
      // No parse result, leave formatted as sanitized
      out.formatted = sanitizeDialInput(cleaned);
    }
  } catch {
    out.formatted = sanitizeDialInput(cleaned);
  }

  _last = { raw, iso: isoHint, out };
  return out;
}

// Flag helper (ISO2 -> emoji flag)
export function flagFromISO(iso = '') {
  const cc = String(iso).toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return '🏳️';
  const A = 0x1f1e6;
  return String.fromCodePoint(...cc.split('').map(ch => A + (ch.charCodeAt(0) - 65)));
}

// Expose calling code for a given ISO (used by picker)
export function callingCode(iso) {
  try {
    return getCountryCallingCode(iso);
  } catch {
    return '';
  }
}


// --- duration formatter used by SoftphoneCard recent calls ---
export function fmtDuration(ms) {
  if (ms == null || isNaN(ms)) return '00:00';
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
