// Path: src/Component/templates/views/TemplateParts.jsx
import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Box,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Plus, Pencil, Trash2, Hammer, Languages as LanguagesIcon } from "lucide-react";

import LocaleTabs from "../utils/LocaleTabs";
import ContentBlocksEditor from "../utils/ContentBlocksEditor";
import ButtonsDesigner from "../utils/ButtonsDesigner";
import ValidationPanel from "../utils/ValidationPanel";

/**
 * VariantManager
 * Props:
 * - variants, setVariants
 * - addVariantSeed(idData)  // or newVariantId helper from parent (we use addVariantSeed prop in parent)
 * - updateVariant(id, patch)
 * - deleteVariant(id)
 * - buildVariant(id) -> caller usually sets activeVariantId and step
 * - activeVariantId, setActiveVariantId
 * - setVariantDrafts, setSnack
 */
export function VariantManager({
  variants,
  setVariants,
  addVariantSeed,
  updateVariant,
  deleteVariant,
  buildVariant,
  activeVariantId,
  setActiveVariantId,
  setVariantDrafts,
  setSnack,
}) {
  const [variantDialogOpen, setVariantDialogOpen] = React.useState(false);
  const [variantDialogEditingId, setVariantDialogEditingId] = React.useState(null);
  const [vdName, setVdName] = React.useState("");
  const [vdDesc, setVdDesc] = React.useState("");
  const [vdTags, setVdTags] = React.useState([]);
  const [vdTagInput, setVdTagInput] = React.useState("");
  const [vdLocale, setVdLocale] = React.useState("en");

  const openAddVariantDialog = () => {
    setVariantDialogEditingId(null);
    setVdName("");
    setVdDesc("");
    setVdTags([]);
    setVdTagInput("");
    setVdLocale("en");
    setVariantDialogOpen(true);
  };

  const openEditVariantDialog = (id) => {
    const v = variants.find((x) => x.id === id);
    if (!v) return;
    setVariantDialogEditingId(id);
    setVdName(v.name || "");
    setVdDesc(v.description || "");
    setVdTags(v.tags || []);
    setVdTagInput("");
    setVdLocale(v.locale || "en");
    setVariantDialogOpen(true);
  };

  const closeVariantDialog = () => setVariantDialogOpen(false);

  const addVdTag = () => {
    const v = (vdTagInput || "").trim();
    if (!v) return;
    if (!vdTags.includes(v)) setVdTags((prev) => [...prev, v]);
    setVdTagInput("");
  };

  const saveVariantDialog = () => {
    const nm = (vdName || "").trim();
    if (!nm) {
      setSnack?.({ open: true, severity: "warning", message: "Variant name is required." });
      return;
    }
    if (variantDialogEditingId) {
      updateVariant?.(variantDialogEditingId, {
        name: nm,
        description: vdDesc.trim(),
        tags: vdTags.slice(),
        locale: vdLocale || "en",
      });
      setSnack?.({ open: true, severity: "success", message: "Variant updated." });
    } else {
      // Parent provides addVariantSeed which returns the created id
      const id = addVariantSeed
        ? addVariantSeed({ name: nm, description: vdDesc.trim(), tags: vdTags.slice(), locale: vdLocale || "en" })
        : null;
      // If parent didn't return id, still ensure UI is updated locally (best-effort)
      if (!id) {
        const fallbackId = "v_" + Math.random().toString(36).slice(2, 8);
        setVariants((prev) => [
          ...prev,
          { id: fallbackId, name: nm, description: vdDesc.trim(), tags: vdTags.slice(), locale: vdLocale || "en", steps: {} },
        ]);
        setVariantDrafts?.((prev) => ({
          ...prev,
          [fallbackId]: {
            content: {
              subject: "",
              title: "",
              body: "",
              html: "",
              headerText: "",
              headerHtml: "",
              footerText: "",
              footerHtml: "",
              buttons: [],
              links: [],
              media: [],
            },
          },
        }));
      }
      setSnack?.({ open: true, severity: "success", message: "Variant added." });
    }
    setVariantDialogOpen(false);
  };

  const handleDelete = (id) => {
    deleteVariant?.(id);
    setSnack?.({ open: true, severity: "info", message: "Variant deleted." });
  };

  const handleBuild = (id) => {
    buildVariant?.(id);
  };

  return (
    <Stack spacing={2} sx={{ height: "100%", minHeight: 0, flex: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <LanguagesIcon size={16} />
        <Typography variant="subtitle1">Language Variants</Typography>
        <Box flexGrow={1} />
        <Button variant="outlined" startIcon={<Plus size={16} />} onClick={openAddVariantDialog}>
          Add Variant
        </Button>
      </Stack>

      <Divider />

      {variants.length === 0 ? (
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 360 }}>
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center", borderRadius: 2, borderStyle: "dashed", maxWidth: 520, width: "100%" }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add your first variant. Each variant is a language-specific version of this template.
            </Typography>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={openAddVariantDialog}>
              Add first variant
            </Button>
          </Paper>
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Variant name</TableCell>
                <TableCell>Locale</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
                <TableCell align="right">Build</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {variants.map((v) => {
                const remainingLabels = (v.steps && (v.steps.build ? [] : ["Build"])) || ["Build", "Validation"];
                const done = remainingLabels.length === 0;
                return (
                  <TableRow key={v.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{v.name || "—"}</Typography>
                      <Typography variant="caption" color="text.secondary">{v.description || "No description"}</Typography>
                    </TableCell>
                    <TableCell><Chip size="small" label={v.locale} /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        {(v.tags || []).map((tg, i) => (<Chip key={`${tg}-${i}`} size="small" label={tg} variant="outlined" />))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {done ? (<Chip size="small" color="success" label="Completed" />) : (<Chip size="small" color="warning" variant="outlined" label={`Remaining: ${remainingLabels.join(", ")}`} />)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEditVariantDialog(v.id)}><Pencil size={16} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(v.id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" variant="outlined" startIcon={<Hammer size={14} />} onClick={() => handleBuild(v.id)}>Build Variant</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={variantDialogOpen} onClose={closeVariantDialog} fullWidth maxWidth="sm">
        <DialogTitle>{variantDialogEditingId ? "Edit Variant" : "Add Variant"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Variant name" value={vdName} onChange={(e) => setVdName(e.target.value)} fullWidth />
            <LocaleTabs inline label="Locale" value={vdLocale} onChange={setVdLocale} />
            <TextField label="Description" value={vdDesc} onChange={(e) => setVdDesc(e.target.value)} fullWidth multiline minRows={2} />
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField label="Add tag" value={vdTagInput} onChange={(e) => setVdTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVdTag(); } }} sx={{ minWidth: 220 }} />
              <Button onClick={addVdTag} startIcon={<Plus size={16} />}>Add</Button>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {vdTags.map((tg) => (<Chip key={tg} label={tg} onDelete={() => setVdTags((prev) => prev.filter((x) => x !== tg))} />))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVariantDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveVariantDialog}>Save</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

/**
 * BuildPane
 * Props:
 * - channel
 * - activeVariant, activeVariantId
 * - variantDrafts
 * - updateActiveDraft( patch )   // parent should merge for activeVariantId
 * - variablesJSON, setVariablesJSON
 * - vars
 * - markVariantStepDone(id, key)
 * - setSnack
 */
export function BuildPane({
  channel,
  activeVariant,
  activeVariantId,
  variantDrafts,
  updateActiveDraft,
  variablesJSON,
  setVariablesJSON,
  vars,
  markVariantStepDone,
  setSnack,
}) {
  const activeDraft = activeVariantId ? variantDrafts[activeVariantId] : null;

  const onContentChange = (next) => {
    if (!activeVariantId) return;
    updateActiveDraft({ content: next });
  };

  const onButtonsChange = (buttons) => {
    if (!activeVariantId) return;
    const prev = variantDrafts[activeVariantId] || { content: {} };
    updateActiveDraft({ content: { ...(prev.content || {}), buttons } });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">
        Build Variant {activeVariant ? `— ${activeVariant.name} (${activeVariant.locale})` : ""}
      </Typography>
      <Divider />

      <ContentBlocksEditor
        channel={channel}
        value={activeDraft?.content || {}}
        onChange={(next) => onContentChange(next)}
        variables={vars || {}}
        variablesJSON={variablesJSON}
        onChangeJSON={setVariablesJSON}
        title="Content"
      />

      <ButtonsDesigner
        channel={channel}
        value={(activeDraft?.content?.buttons) || []}
        onChange={(buttons) => onButtonsChange(buttons)}
      />
    </Stack>
  );
}

export default {
  VariantManager,
  BuildPane,
};
