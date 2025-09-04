// /src/Component/dailer/dialingPlan/EscalationDetailsDialog.jsx
import React, { useMemo } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, Typography, Chip, Button, Divider, Box, Tooltip
} from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/** -------- helpers: formatting ---------- */
const toDate = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};
const fmtDateTime = (v) => {
    const d = toDate(v);
    return d
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d)
        : String(v ?? "—");
};
const fmtValue = (field, raw) => {
    const v = raw ?? "";
    const t = (field?.type || "").toLowerCase();

    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "boolean") return v ? "Yes" : "No";

    // date/datetime friendly guesses
    if (t.includes("date") || String(field?.name || "").match(/(date|time|eta|due|by)$/i)) {
        return fmtDateTime(v);
    }

    // uploads: show filename if it looks like a path/url
    if (t.includes("upload")) {
        const s = String(v);
        if (!s) return "—";
        const name = s.split(/[\\/]/).pop();
        return name || s;
    }

    return String(v || "—");
};

/** -------- grouping rules (name-based fuzzies) ---------- */
const SECTION_RULES = [
    { title: "Case", match: (n) => /(ticket|case|id|priority|status|queue|assignment)/i.test(n) },
    {
        title: "Customer & Contact",
        match: (n) =>
            /(customer|client|account|msisdn|phone|mobile|alt|email|channel|preferred|language|callback|consent)/i.test(n),
    },
    {
        title: "Issue Details",
        match: (n) =>
            /(issue|summary|reason|category|sub[_-]?category|impact|severity|service|product|affected|context|source)/i.test(n),
    },
    { title: "Troubleshooting", match: (n) => /(steps|attempt|repro|logs|evidence)/i.test(n) },
    { title: "Resolution Plan", match: (n) => /(next|action|owner|assignee|eta|promise|ptcb|resolve|disposition)/i.test(n) },
    { title: "Attachments", match: (n) => /(upload|attachment|file|image|document)/i.test(n) },
];

/** -------- make sections from schema+values ---------- */
function buildSections(formSchema, formValues) {
    const fields = Array.isArray(formSchema?.fields) ? formSchema.fields : [];
    const rows = fields.map((f) => {
        const name = String(f.name || "").trim();
        const label = f.label || name || "(unnamed)";
        const helper = f.helperText || f.description || "";
        const value = fmtValue(f, formValues?.[name]);
        return { name, label, value, helper, field: f };
    });

    const sections = SECTION_RULES.map((r) => ({ title: r.title, rows: [] }));
    const other = { title: "Other", rows: [] };

    for (const r of rows) {
        const sect = SECTION_RULES.find((S) => S.match(r.name));
        (sect ? sections.find((s) => s.title === sect.title).rows : other.rows).push(r);
    }

    const out = sections.filter((s) => s.rows.length > 0);
    if (other.rows.length) out.push(other);
    return out;
}

/** -------- compact label→value grid ---------- */
function LabeledGrid({ rows }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "0.6fr 1fr" },
                gap: 1,
            }}
        >
            {rows.map((r) => (
                <React.Fragment key={r.name}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {r.label}
                        </Typography>
                        {r.helper && (
                            <Tooltip title={r.helper}>
                                <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "help" }} />
                            </Tooltip>
                        )}
                    </Stack>
                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                        {r.value}
                    </Typography>
                </React.Fragment>
            ))}
        </Box>
    );
}

/** -------- main dialog (hooks at top; no conditional returns) ---------- */
export default function EscalationDetailsDialog({ open, onClose, item, onCall }) {
    // Always compute with safe fallbacks so hooks aren't conditional
    const safeItem = item || {};
    const schema = safeItem.formSchema;
    const values = safeItem.formValues || {};
    const sections = useMemo(() => buildSections(schema, values), [schema, values]);

    const status = safeItem.status || values.status || "Open";
    const priority = safeItem.priority || values.priority || "P3";
    const tagsArr = Array.isArray(safeItem.tags || values.tags)
        ? (safeItem.tags || values.tags)
        : String(safeItem.tags || values.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

    const opened = safeItem.openedAt || values.openedAt;
    const updated = safeItem.updatedAt || values.updatedAt;
    const slaDue = safeItem.slaDue || values.slaDue;

    const phoneNumber = safeItem.phone || values.phone || values.callback_number || "";
    const canCall = !!phoneNumber;

    const dialogOpen = Boolean(open && item); // don't render early-return; just keep dialog closed

    return (
        <Dialog open={dialogOpen} onClose={onClose} maxWidth="md" fullWidth>
            {/* Only render body if item exists */}
            {item ? (
                <>
                    <DialogTitle sx={{ pb: 1 }}>
                        {safeItem.id || values.ticket_id || values.case_id || "Case"}
                        {" — "}
                        {safeItem.customerName || values.customer_name || "Customer"}
                        {phoneNumber ? ` (${phoneNumber})` : ""}
                    </DialogTitle>

                    <DialogContent dividers>
                        <Stack spacing={1.5}>
                            {/* top meta chips */}
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip size="small" variant="outlined" label={`Priority: ${priority}`} />
                                <Chip size="small" color="primary" label={status} />
                                {tagsArr.slice(0, 8).map((t) => (
                                    <Chip key={t} size="small" label={t} />
                                ))}
                            </Stack>

                            {/* sections from CRM payload */}
                            {sections.length > 0 ? (
                                sections.map((sec, i) => (
                                    <Stack key={sec.title} spacing={1.25}>
                                        {i > 0 && <Divider />}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            {sec.title}
                                        </Typography>
                                        <LabeledGrid rows={sec.rows} />
                                    </Stack>
                                ))
                            ) : (
                                // fallback when no form data available
                                <Stack spacing={1.25}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        Summary
                                    </Typography>
                                    <LabeledGrid
                                        rows={[
                                            { name: "category", label: "Category", value: safeItem.category || "—" },
                                            { name: "subCategory", label: "Sub-category", value: safeItem.subCategory || "—" },
                                            { name: "reason", label: "Reason", value: safeItem.reason || "—" },
                                            { name: "notes", label: "Notes", value: safeItem.notes || "—" },
                                        ]}
                                    />
                                </Stack>
                            )}

                            {/* audit trail */}
                            <Divider />
                            <Stack direction="row" spacing={4} flexWrap="wrap">
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Opened:</strong> {fmtDateTime(opened)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Updated:</strong> {fmtDateTime(updated)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>SLA due:</strong> {fmtDateTime(slaDue)}
                                </Typography>
                            </Stack>
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            variant="contained"
                            startIcon={<LocalPhoneOutlinedIcon />}
                            disabled={!canCall}
                            onClick={() => onCall?.(safeItem, phoneNumber)}
                            sx={{ borderRadius: 1 }}
                        >
                            Call Back
                        </Button>
                        <Button variant="text" color="inherit" onClick={onClose} sx={{ borderRadius: 1 }}>
                            Close
                        </Button>
                    </DialogActions>
                </>
            ) : null}
        </Dialog>
    );
}
