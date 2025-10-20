// Path: /src/Component/Meetings/utils/icsClient.js
/**
 * Tiny ICS builder for mocks (no external deps).
 *
 * Usage:
 *   const { buildICS } = require("./icsClient");
 *   const ics = buildICS({
 *     uid: "mtg_123@notify",
 *     title: "Notify Demo",
 *     description: "Walkthrough",
 *     start: "2025-09-25T09:30:00Z",
 *     end: "2025-09-25T10:00:00Z",
 *     organizer: { name: "Alpha", email: "alpha.evzone@gmail.com" },
 *     attendees: [{ name: "Jane", email: "jane@example.com" }],
 *     location: "Google Meet",
 *     url: "https://meet.google.com/abc-defg-hij",
 *   });
 *   // ics.filename, ics.text
 */

const CRLF = "\r\n";

function foldLine(s) {
  // RFC 5545 line folding at 75 octets; simple soft-wrap for mock purposes
  const max = 74;
  const parts = [];
  for (let i = 0; i < s.length; i += max) {
    parts.push(i === 0 ? s.slice(i, i + max) : " " + s.slice(i, i + max));
  }
  return parts.join(CRLF);
}

function fmtDate(isoUtc) {
  // UTC Zulu format: YYYYMMDDTHHMMSSZ
  const d = new Date(isoUtc);
  const y = d.getUTCFullYear();
  const M = String(d.getUTCMonth() + 1).padStart(2, "0");
  const D = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${M}${D}T${h}${m}${s}Z`;
}

function esc(v = "") {
  return String(v).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

/**
 * Build an ICS string.
 * @param {{
 *   uid?: string,
 *   title: string,
 *   description?: string,
 *   start: string,
 *   end: string,
 *   organizer?: {name?: string, email: string},
 *   attendees?: Array<{name?: string, email: string, role?: "REQ-PARTICIPANT"|"OPT-PARTICIPANT"}>,
 *   location?: string,
 *   url?: string,
 *   alarms?: Array<{ minutesBefore: number, description?: string }>
 * }} evt
 */
function buildICS(evt) {
  const uid = evt.uid || `notify-${Date.now()}@mock`;
  const dtstamp = fmtDate(new Date().toISOString());
  const dtstart = fmtDate(evt.start);
  const dtend = fmtDate(evt.end);

  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("PRODID:-//Notify//Calendly Mock//EN");
  lines.push("VERSION:2.0");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${esc(uid)}`);
  lines.push(`DTSTAMP:${dtstamp}`);
  lines.push(`DTSTART:${dtstart}`);
  lines.push(`DTEND:${dtend}`);
  if (evt.title) lines.push(foldLine(`SUMMARY:${esc(evt.title)}`));
  if (evt.description) lines.push(foldLine(`DESCRIPTION:${esc(evt.description)}`));
  if (evt.location) lines.push(foldLine(`LOCATION:${esc(evt.location)}`));
  if (evt.url) lines.push(foldLine(`URL:${esc(evt.url)}`));
  if (evt.organizer?.email) {
    const cn = evt.organizer.name ? `;CN=${esc(evt.organizer.name)}` : "";
    lines.push(`ORGANIZER${cn}:mailto:${esc(evt.organizer.email)}`);
  }
  (evt.attendees || []).forEach((a) => {
    const role = a.role || "REQ-PARTICIPANT";
    const cn = a.name ? `;CN=${esc(a.name)}` : "";
    lines.push(`ATTENDEE;ROLE=${role}${cn}:mailto:${esc(a.email)}`);
  });

  (evt.alarms || []).forEach((al) => {
    const mins = Math.max(1, Number(al.minutesBefore || 10));
    lines.push("BEGIN:VALARM");
    lines.push("ACTION:DISPLAY");
    lines.push(foldLine(`DESCRIPTION:${esc(al.description || evt.title || "Reminder")}`));
    lines.push(`TRIGGER:-PT${mins}M`);
    lines.push("END:VALARM");
  });

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  const text = lines.join(CRLF) + CRLF;
  const filename = (evt.title || "invite").replace(/\s+/g, "_").slice(0, 40) + ".ics";
  return { filename, text };
}

module.exports = { buildICS };
