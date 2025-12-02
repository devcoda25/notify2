// Path: src/Component/templates/views/TemplateDetailView.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Chip,
  Paper,
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Copy, Send, Archive, Pencil, Plus } from "lucide-react";

import useTemplatesStore from "../store/useTemplatesStore";
import { useUserStore } from "../../../auth/user.store";
import useApprovalsStore from "../store/useApprovalsStore";
import useTemplatesApi from "../hooks/useTemplatesApi";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";
import CHANNELS from "../constants/CHANNELS";

import CloneTemplateModal from "../modals/CloneTemplateModal";
import TestSendModal from "../modals/TestSendModal";
import ArchiveDialog from "../modals/ArchiveDialog";

import ChannelVariantPanel from "../utils/ChannelVariantPanel";
import TemplatePreviewPane from "../utils/TemplatePreviewPane";
import ValidationPanel from "../utils/ValidationPanel";
import VariablesInspector from "../utils/VariablesInspector";
import LocaleTabs from "../utils/LocaleTabs";

import { resolveVariablesInObject } from "../core/variableResolver";

function buildVariantFromTemplate(tpl, vars, selectedId) {
  const variants = tpl?.versions?.[0]?.variants || [];
  const base =
    (Array.isArray(variants) && variants.find((vv) => vv.id === selectedId)) ||
    (Array.isArray(variants) && variants[0]) ||
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

export default function TemplateDetailView({ templateId, onOpenTemplate }) {
  const api = useTemplatesApi();
  const partyId = useUserStore((s) => s.currentUser.id);

  // Data
  const { tpl, loading, error } = useTemplatesStore((s) => ({
    tpl: s.templates.find((t) => t.id === templateId),
    loading: s.loading,
    error: s.error,
  }));

  // Fetch data if it's not in the store
  React.useEffect(() => {
    if (!tpl && templateId && api.getTemplate) {
      api.getTemplate(templateId);
    }
  }, [api, tpl, templateId]);

  // Preview state
  const [device, setDevice] = React.useState("mobile");
  const [orientation, setOrientation] = React.useState("portrait");
  const [varsJSON, setVarsJSON] = React.useState('{"user_name":"Ada"}');
  const [selectedVariantId, setSelectedVariantId] = React.useState(null);

  // Default to the first variant when template data loads
  React.useEffect(() => {
    if (tpl && !selectedVariantId && tpl.versions?.[0]?.variants?.[0]) {
      setSelectedVariantId(tpl.versions[0].variants[0].id);
    }
  }, [tpl, selectedVariantId]);

  const [cloneOpen, setCloneOpen] = React.useState(false);
  const [testOpen, setTestOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  
  const [addVariantOpen, setAddVariantOpen] = React.useState(false);
  const [newVariantLocale, setNewVariantLocale] = React.useState("en");
  const [newVariantName, setNewVariantName] = React.useState("");
  const [newVariantDesc, setNewVariantDesc] = React.useState("");
  const [newVariantTags, setNewVariantTags] = React.useState([]);
  const [newVariantTagInput, setNewVariantTagInput] = React.useState("");

  const [editVariantOpen, setEditVariantOpen] = React.useState(false);
  const [editingVariant, setEditingVariant] = React.useState(null);

  const handleArchive = async ({ action }) => {
    if (action === 'archive' && tpl) {
      try {
        await api.archiveTemplate(tpl.id);
        setArchiveOpen(false);
        onOpenTemplate?.(null);
      } catch (e) {
        console.error("Failed to archive template", e);
      }
    } else {
      setArchiveOpen(false);
    }
  };

  const handleClone = async ({ name }) => {
    if (tpl) {
      try {
        const newTemplate = await api.duplicateTemplate(tpl.id, { name });
        setCloneOpen(false);
        onOpenTemplate?.(newTemplate.id);
      } catch (e) {
        console.error("Failed to clone template", e);
      }
    }
  };

  const handleTestSend = async (payload) => {
    if (tpl) {
      // Ensure we have a valid variantId to send.
      // Default to the currently selected one, or fall back to the first one available.
      const variantIdToSend = selectedVariantId || tpl.versions?.[0]?.variants?.[0]?.id;

      if (!variantIdToSend) {
        console.error("Failed to send test: No valid variant could be found for this template.");
        // Here you could show an error message to the user with a snackbar
        return;
      }

      try {
        await api.sendTest(tpl.id, {
          recipient: payload.destination,
          variables: payload.variables,
          variantId: variantIdToSend,
        });
        setTestOpen(false);
      } catch (e) {
        console.error("Failed to send test", e);
      }
    }
  };

  const handleAddVariant = async () => {
    if (tpl && newVariantLocale && newVariantName) {
      try {
        const existingVariants = tpl.versions?.[0]?.variants?.map(v => ({ locale: v.locale, name: v.name })) || [];
        const newVariant = { locale: newVariantLocale, name: newVariantName };
        
        const payload = {
          notes: `Added new variant: ${newVariantName} (${newVariantLocale})`,
          variants: [...existingVariants, newVariant],
        };

        await api.createTemplateVersion(tpl.id, payload);
        setAddVariantOpen(false);
        setNewVariantLocale("en");
        setNewVariantName("");
        setNewVariantDesc("");
        setNewVariantTags([]);
        setNewVariantTagInput("");
        api.getTemplate(tpl.id);
      } catch (e) {
        console.error("Failed to add variant", e);
      }
    }
  };

  const handleOpenEditVariant = (variantId) => {
    const variant = tpl?.versions?.[0]?.variants?.find(v => v.id === variantId);
    if (variant) {
      setEditingVariant(variant);
      setEditVariantOpen(true);
    }
  };

  const handleUpdateVariant = async () => {
    if (editingVariant) {
      try {
        await api.updateVariant(editingVariant.id, { name: editingVariant.name });
        setEditVariantOpen(false);
        api.getTemplate(tpl.id);
      } catch (e) {
        console.error("Failed to update variant", e);
      }
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (tpl) {
      try {
        await api.deleteVariant(variantId);
        api.getTemplate(tpl.id); 
      } catch (e) {
        console.error("Failed to delete variant", e);
      }
    }
  };

  const addNewVariantTag = () => {
    const v = (newVariantTagInput || "").trim();
    if (!v) return;
    if (!newVariantTags.includes(v)) setNewVariantTags((prev) => [...prev, v]);
    setNewVariantTagInput("");
  };
      
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
        versions: [{ variants: [] }],
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

  const status = safeTpl?.status || APPROVAL_STATES.DRAFT;
  const chLabel =
    CHANNELS.find((c) => c.id === (safeTpl.channel || variant.channel))?.label ||
    safeTpl.channel ||
    variant.channel;

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {missing && !loading && (
        <Alert severity="error" sx={{ mb: 0 }}>
          The requested template could not be found.
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
              variants={safeTpl.versions?.[0]?.variants || []}
              channel={safeTpl.channel}
              onAdd={() => setAddVariantOpen(true)}
              onDelete={handleDeleteVariant}
              onView={setSelectedVariantId}
              onEdit={handleOpenEditVariant}
              availableLocales={[
                { code: "en", label: "English" },
                { code: "fr", label: "Français" },
                { code: "es", label: "Español" },
              ]}
              selectedId={selectedVariantId}
              onSelect={setSelectedVariantId}
              onChange={(next) => {
                if (!next.find((v) => v.id === selectedVariantId)) {
                  setSelectedVariantId(next[0]?.id || null);
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
              <Row label="Tags" value={(safeTpl.tags || []).map(t => t.tag.name).join(", ") || "—"} />
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
                variants: Array.isArray(safeTpl.versions?.[0]?.variants) ? safeTpl.versions?.[0]?.variants : [],
                themeId: safeTpl.themeId,
                type: safeTpl.type,
              }}
              channel={safeTpl.channel || variant.channel}
            />
          </Paper>
        </Stack>
      </Stack>

      {/* Modals */}
      <Dialog open={addVariantOpen} onClose={() => setAddVariantOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Variant</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{pt: 1}}>
            <TextField label="Variant Name" value={newVariantName} onChange={(e) => setNewVariantName(e.target.value)} fullWidth autoFocus />
            <LocaleTabs inline label="Locale" value={newVariantLocale} onChange={setNewVariantLocale} />
            <TextField label="Description" value={newVariantDesc} onChange={(e) => setNewVariantDesc(e.target.value)} fullWidth multiline minRows={2} />
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField label="Add tag" value={newVariantTagInput} onChange={(e) => setNewVariantTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewVariantTag(); } }} sx={{ minWidth: 220 }} />
              <Button onClick={addNewVariantTag} startIcon={<Plus size={16} />}>Add</Button>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {newVariantTags.map((tg) => (<Chip key={tg} label={tg} onDelete={() => setNewVariantTags((prev) => prev.filter((x) => x !== tg))} />))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVariantOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVariant} variant="contained">Add Variant</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editVariantOpen} onClose={() => setEditVariantOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Variant</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{pt: 1}}>
            <TextField
              autoFocus
              label="Variant Name"
              type="text"
              fullWidth
              value={editingVariant?.name || ""}
              onChange={(e) => setEditingVariant(v => v ? ({ ...v, name: e.target.value }) : null)}
            />
            <LocaleTabs 
              inline 
              label="Locale" 
              value={editingVariant?.locale || ""} 
              onChange={() => {}} // Disabled
              disabled={true}
            />
            <TextField 
              label="Description" 
              value={editingVariant?.description || ""} 
              fullWidth 
              multiline 
              minRows={2} 
              disabled={true}
            />
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {(editingVariant?.tags || []).map((tg) => (<Chip key={tg} label={tg} />))}
            </Stack>
            <Alert severity="info">Only the variant name can be edited. To change other properties, please delete and re-create the variant.</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditVariantOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateVariant} variant="contained">Save Name</Button>
        </DialogActions>
      </Dialog>

      <CloneTemplateModal
        open={cloneOpen}
        sourceTemplate={tpl || undefined}
        onClose={() => setCloneOpen(false)}
        onConfirm={handleClone}
      />
      <TestSendModal
        open={testOpen}
        template={tpl || undefined}
        defaultChannel={safeTpl.channel || "email"}
        onClose={() => setTestOpen(false)}
        onSendTest={handleTestSend}
      />
      <ArchiveDialog
        open={archiveOpen}
        template={tpl || undefined}
        onClose={() => setArchiveOpen(false)}
        onConfirm={handleArchive}
      />
    </Box>
  );
}
