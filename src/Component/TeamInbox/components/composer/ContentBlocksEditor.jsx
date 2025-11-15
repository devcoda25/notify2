import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Type as TypeIcon, Code2 } from "lucide-react";

import VariablesInspector from "./VariablesInspector";

import {
  FieldStable,
  RichHtmlArea,
  VariableDialog,
  HeaderFooterRail,
  EditorAttachments,
  toolbarConfigForChannel,
  stripHtmlPreview,
} from "./EditorPieces";

/**
 * Props
 * - channel = "email" | "sms" | "whatsapp" | "push" | "platform"
 * - value = {
 *     subject, title, body, html,
 *     headerHtml, headerText, footerHtml, footerText,
 *     attachments: []
 *   }
 * - onChange: (patchObj) => void
 * - variables: { [key]: sample }
 * - variablesJSON, onChangeJSON
 * - title = "Content"
 */
export default function ContentBlocksEditor({
  channel = "email",
  value = {},
  onChange,
  variables = {},
  variablesJSON,
  onChangeJSON,
  title = "Content",
}) {
  const v = {
    subject: value.subject || "",
    title: value.title || "",
    body: value.body || "",
    html: value.html || "",
    headerHtml: value.headerHtml || "",
    headerText: value.headerText || "",
    footerHtml: value.footerHtml || "",
    footerText: value.footerText || "",
    attachments: value.attachments || [],
  };

  const [tab, setTab] = React.useState("rich"); // "rich" | "html"
  const [varDlgOpen, setVarDlgOpen] = React.useState(false);
  const editorRef = React.useRef(null);

  const tcfg = toolbarConfigForChannel(channel);

  // simple HTML sanitizer: trim risky tags (keep basic formatting)
  const sanitizeHtml = React.useCallback((html) => {
    if (!html) return "";
    // remove script/style plus on* handlers
    let s = String(html)
      .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
      .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "");
    return s;
  }, []);

  const handleVarInsert = (key, sample) => {
    const token = `{{${String(key || "").trim()}}}`;
    editorRef.current?.insertText?.(token);
    if (key) {
      onChange?.({
        variables: {
          ...(value.variables || {}),
          [key]: sample || variables?.[key] || "",
        },
      });
    }
    setVarDlgOpen(false);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1">{title}</Typography>

        {/* Subject/Title — email & platform often have both */}
        {["email", "platform"].includes(channel) && (
          <FieldStable
            label="Subject / Title"
            value={v.subject}
            onChange={(subject) => onChange?.({ subject })}
            helperText="Optional for platform; required for email."
          />
        )}

        {/* Title (optional generic) */}
        <FieldStable
          label="Internal Title (optional)"
          value={v.title}
          onChange={(title) => onChange?.({ title })}
          helperText="Not sent to recipients; used internally."
        />

        {/* Header rail */}
        <HeaderFooterRail
          label="Header"
          hasContent={Boolean(v.headerHtml || v.headerText)}
          previewText={
            v.headerHtml
              ? stripHtmlPreview(v.headerHtml)
              : (v.headerText || "")
          }
          onAdd={() =>
            onChange?.({
              headerHtml: "<p><em>Header...</em></p>",
              headerText: "",
            })
          }
          onEdit={() => {
            // simplistic toggle to open HTML editor for header (reuse main editor by swapping value temporarily if needed in future)
            const incoming =
              prompt("Edit Header (HTML preferred):", v.headerHtml || "") ?? v.headerHtml;
            if (incoming !== null) onChange?.({ headerHtml: incoming });
          }}
          onClear={() => onChange?.({ headerHtml: "", headerText: "" })}
        />

        {/* Main rich/html editor */}
        <RichHtmlArea
          ref={editorRef}
          value={v.html}
          tab={tab}
          onChangeTab={setTab}
          onChangeHtml={(html) => onChange?.({ html, body: html })}
          sanitizeHtml={sanitizeHtml}
          inlineToolbar
          toolbarConfig={tcfg}
          // Hook variable button to open dialog
          onVars={() => setVarDlgOpen(true)}
          label={
            ["email", "platform"].includes(channel)
              ? "Body (Rich)"
              : "Message (Rich)"
          }
          htmlLabel="HTML Source"
        />

        {/* Footer rail */}
        <HeaderFooterRail
          label="Footer"
          hasContent={Boolean(v.footerHtml || v.footerText)}
          previewText={
            v.footerHtml
              ? stripHtmlPreview(v.footerHtml)
              : (v.footerText || "")
          }
          onAdd={() =>
            onChange?.({
              footerHtml: "<p><small>Footer…</small></p>",
              footerText: "",
            })
          }
          onEdit={() => {
            const incoming =
              prompt("Edit Footer (HTML preferred):", v.footerHtml || "") ?? v.footerHtml;
            if (incoming !== null) onChange?.({ footerHtml: incoming });
          }}
          onClear={() => onChange?.({ footerHtml: "", footerText: "" })}
        />

        {/* Attachments (shared manager) */}
        {["email", "platform"].includes(channel) && (
          <EditorAttachments
            attachments={v.attachments}
            setAttachments={(attachments) => onChange?.({ attachments })}
            title="Attachments (optional)"
          />
        )}

        {/* Variables inspector (read-only view of current variables) */}
        <VariablesInspector variables={variables || {}} variablesJSON={variablesJSON} onChangeJSON={onChangeJSON} />
      </Stack>

      {/* Variable dialog */}
      <VariableDialog
        open={varDlgOpen}
        onClose={() => setVarDlgOpen(false)}
        onSave={handleVarInsert}
        variableKeys={Object.keys(variables || {})}
      />
    </Paper>
  );
}
