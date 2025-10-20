// Path: src/Component/templates/views/TemplateDetailView.jsx

import React from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Paper,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Copy, Send, Archive, Pencil } from "lucide-react";

import useTemplatesStore from "../../store/templates/useTemplatesStore";
import useApprovalsStore from "../../store/templates/useApprovalsStore";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";
import CHANNELS from "../constants/CHANNELS";

import CloneTemplateModal from "../modals/CloneTemplateModal";
import TestSendModal from "../modals/TestSendModal";
import ArchiveDialog from "../modals/ArchiveDialog";

import ChannelVariantPanel from "../utils/ChannelVariantPanel";
import TemplatePreviewPane from "../utils/TemplatePreviewPane";
import ValidationPanel from "../utils/ValidationPanel";
import VariablesInspector from "../utils/VariablesInspector";

import { resolveVariablesInObject } from "../core/variableResolver";

function buildVariantFromTemplate(tpl, vars, selectedId) {
  const base =
    (Array.isArray(tpl?.variants) && tpl.variants.find((vv) => vv.id === (selectedId || "default"))) ||
    (Array.isArray(tpl?.variants) && tpl.variants[0]) ||
    { channel: tpl?.channel, content: {} };
  const content = resolveVariablesInObject(base.content || {}, vars || {});
  return {
    id: base.id || "default",
    channel: base.channel || tpl?.channel,
    themeId: base.themeId || tpl?.themeId || null,
    content,
  };
}

function Row({ label, value }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2" sx={{ width: 100, color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function TemplateDetailView({ templateId }) {
  // Data
  const templates = useTemplatesStore((s) => s.templates) || [];
  const seedDemoIfSparse = useTemplatesStore((s) => s.seedDemoIfSparse);
  const tpl = templates.find((t) => t.id === templateId);
  const approvals = useApprovalsStore((s) => s.approvals) || {};

  // Ensure we have data even on fresh storage
  React.useEffect(() => {
    seedDemoIfSparse();
  }, [seedDemoIfSparse]);

  // Preview state
  const [device, setDevice] = React.useState("mobile");
  const [orientation, setOrientation] = React.useState("portrait");
  const [varsJSON, setVarsJSON] = React.useState('{"user_name":"Ada"}');
  const [selectedVariantId, setSelectedVariantId] = React.useState("default");

  const [cloneOpen, setCloneOpen] = React.useState(false);
  const [testOpen, setTestOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);

  const missing = !tpl;
  const safeTpl = React.useMemo(
    () =>
      tpl || {
        id: templateId || "missing",
        name: "Template not found",
        channel: "email",
        type: "utility",
        tags: [],
        usage: { total: 0 },
        variants: [
          {
            id: "default",
            channel: "email",
            content: { subject: "", title: "", body: "", html: "", buttons: [] },
          },
        ],
      },
    [tpl, templateId]
  );

  const varsMap = React.useMemo(() => {
    try {
      const raw = JSON.parse(varsJSON || "{}");
      const out = {};
      for (const k of Object.keys(raw)) out[k] = raw[k] == null ? "" : String(raw[k]);
      return out;
    } catch {
      return {};
    }
  }, [varsJSON]);

  const variant = React.useMemo(
    () => buildVariantFromTemplate(safeTpl, varsMap, selectedVariantId),
    [safeTpl, varsMap, selectedVariantId]
  );

  const status =
    approvals?.[safeTpl?.id]?.state || safeTpl?.status || APPROVAL_STATES.DRAFT;
  const chLabel =
    CHANNELS.find((c) => c.id === (safeTpl.channel || variant.channel))?.label ||
    safeTpl.channel ||
    variant.channel;

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {missing && (
        <Alert severity="error" sx={{ mb: 0 }}>
          The requested template could not be found. Showing a fallback preview.
        </Alert>
      )}

      {/* Header */}
      <Paper variant="outlined" sx={{ p: 1.25 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ pr: 0.5 }}>
            {safeTpl.name}
          </Typography>
          <Chip size="small" label={chLabel} />
          <Chip
            size="small"
            color={
              status === APPROVAL_STATES.APPROVED
                ? "success"
                : status === APPROVAL_STATES.REJECTED
                ? "error"
                : "warning"
            }
            label={status}
          />
          <Box flexGrow={1} />
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Pencil size={16} />} disabled>
              Edit
            </Button>
            <Button startIcon={<Copy size={16} />} onClick={() => setCloneOpen(true)}>
              Clone
            </Button>
            <Button startIcon={<Send size={16} />} variant="outlined" onClick={() => setTestOpen(true)}>
              Test
            </Button>
            <Button startIcon={<Archive size={16} />} color="warning" onClick={() => setArchiveOpen(true)}>
              Archive
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Content */}
      <Stack direction={{ xs: "column", xl: "row-reverse" }} spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Preview */}
        <Paper
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Box sx={{ p: 1.5, flex: 1, minHeight: 0 }}>
            <TemplatePreviewPane
              variant={variant}
              device={device}
              onDeviceChange={setDevice}
              orientation={orientation}
              onOrientationChange={setOrientation}
              showToolbar
              height={640}
              title="Preview"
            />
          </Box>
        </Paper>

        {/* Left column */}
        <Stack spacing={2} sx={{ width: { xs: "100%", xl: 520 }, minWidth: 0 }}>
          {/* Variants */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <ChannelVariantPanel
              variants={safeTpl.variants || []}
              channel={safeTpl.channel}
              availableLocales={[
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "es", label: "Español" },
              ]}
              selectedId={selectedVariantId}
              onSelect={setSelectedVariantId}
              onChange={(next) => {
                if (!next.find((v) => v.id === selectedVariantId)) {
                  setSelectedVariantId(next[0]?.id || "default");
                }
              }}
            />
          </Paper>

          {/* Details */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Details
            </Typography>
            <Stack spacing={1.25}>
              <Row label="ID" value={safeTpl.id} />
              <Row label="Owner" value={safeTpl.owner || "—"} />
              <Row label="Category" value={safeTpl.type || "—"} />
              <Row
                label="Created"
                value={safeTpl.createdAt ? new Date(safeTpl.createdAt).toLocaleString() : "—"}
              />
              <Row
                label="Updated"
                value={safeTpl.updatedAt ? new Date(safeTpl.updatedAt).toLocaleString() : "—"}
              />
              <Row label="Usage" value={(safeTpl.usage?.total || 0).toLocaleString()} />
              <Row label="Tags" value={(safeTpl.tags || []).join(", ") || "—"} />
            </Stack>
          </Paper>

          {/* Variables */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Variables (JSON)
            </Typography>
            <Box
              component="textarea"
              value={varsJSON}
              onChange={(e) => setVarsJSON(e.target.value)}
              rows={10}
              style={{
                width: "100%",
                resize: "vertical",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                fontSize: 12,
                lineHeight: 1.5,
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${alpha("#000", 0.1)}`,
              }}
            />
            <Box sx={{ mt: 1 }}>
              <VariablesInspector snapshot={variant?.content || {}} vars={varsMap} />
            </Box>
          </Paper>

          {/* Validation */}
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Validation
            </Typography>
            <ValidationPanel
              payload={{
                id: safeTpl.id,
                channel: safeTpl.channel || variant.channel,
                variants: Array.isArray(safeTpl.variants) ? safeTpl.variants : [],
                themeId: safeTpl.themeId,
                type: safeTpl.type,
              }}
              channel={safeTpl.channel || variant.channel}
            />
          </Paper>
        </Stack>
      </Stack>

      {/* Modals */}
      <CloneTemplateModal
        open={cloneOpen}
        sourceTemplate={tpl || undefined}
        onClose={() => setCloneOpen(false)}
        onConfirm={() => setCloneOpen(false)}
      />
      <TestSendModal
        open={testOpen}
        template={tpl || undefined}
        defaultChannel={safeTpl.channel || "email"}
        onClose={() => setTestOpen(false)}
        onSendTest={() => setTestOpen(false)}
      />
      <ArchiveDialog
        open={archiveOpen}
        template={tpl || undefined}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => setArchiveOpen(false)}
      />
    </Box>
  );
}
