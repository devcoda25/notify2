// src/Component/contacts/Modals/EditContactDrawer.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Drawer, IconButton, Box, Stack, TextField, Typography, Divider,
  Autocomplete, Button, Chip, Tooltip
} from "@mui/material";
import { X, Save, Trash2, Tags } from "lucide-react";
import { COUNTRIES } from "../data/countries";
import { toE164 } from "../utils/phone";

const KEY_OPTIONS = [
  "+ ADD NEW",
  "actual_fare",
  "actual_estimate",
  "additional_items",
];

export default function EditContactDrawer({ open, onClose, contact, onSave }) {
  const [draft, setDraft] = useState(contact || null);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [keyDraftOverride, setKeyDraftOverride] = useState({});

  useEffect(() => {
    setDraft(contact || null);
    // naive guess by dial code
    if (contact?.phone?.startsWith?.("+1")) setCountry(COUNTRIES.find(c => c.shortname === "US") || COUNTRIES[0]);
  }, [contact]);

  const canSave = useMemo(() => {
    if (!draft) return false;
    const hasName = (draft.name || "").trim().length > 0;
    const hasPhone = (draft.phone || "").trim().length > 0;
    const attrs = Array.isArray(draft.attributes) ? draft.attributes : [];
    const attrsValid = attrs.every(a => a.key && a.value);
    return hasName && hasPhone && attrsValid;
  }, [draft]);

  const attributes = Array.isArray(draft?.attributes) ? draft.attributes : [];

  const setAttributeField = (i, f, v) =>
    setDraft(p => {
      const next = [...(p?.attributes || [])];
      next[i] = { ...(next[i] || {}), [f]: v };
      return { ...p, attributes: next };
    });

  const addAttributeRow = () =>
    setDraft(p => ({ ...p, attributes: [...(p?.attributes || []), { key: "", value: "" }] }));

  const removeAttributeRow = (index) =>
    setDraft(p => ({ ...p, attributes: (p?.attributes || []).filter((_, i) => i !== index) }));

  const handleKeySelect = (index, option) => {
    if (option === "+ ADD NEW") {
      setKeyDraftOverride(prev => ({ ...prev, [index]: "" }));
      setAttributeField(index, "key", "");
      return;
    }
    setKeyDraftOverride(prev => {
      const { [index]: _, ...rest } = prev;
      return rest;
    });
    setAttributeField(index, "key", option);
  };

  const handleSave = () => {
    if (!draft) return;
    const patch = {
      ...draft,
      phone: toE164(country?.dial || "", draft.phone) || draft.phone,
      attributes: attributes.filter(a => a.key && a.value),
    };
    onSave?.(draft.id, patch);
    onClose?.();
  };

  return (
    <Drawer anchor="right" open={!!open} onClose={onClose} PaperProps={{ sx: { width: { xs: 360, sm: 480 } } }}>
      <Box className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h6">Edit Contact</Typography>
          <IconButton onClick={onClose}><X size={18} /></IconButton>
        </div>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          Update basic details and attributes. Changes apply after you save.
        </Typography>

        {draft ? (
          <>
            <Stack spacing={2}>
              <TextField
                label="Full name"
                value={draft.name || ""}
                onChange={(e) => setDraft(p => ({ ...p, name: e.target.value }))}
              />
              <TextField
                label="Email"
                type="email"
                value={draft.email || ""}
                onChange={(e) => setDraft(p => ({ ...p, email: e.target.value }))}
              />

              <Stack direction="row" spacing={2}>
                <Autocomplete
                  sx={{ minWidth: 220 }}
                  options={COUNTRIES}
                  getOptionLabel={(opt) => `${opt.name} (${opt.dial})`}
                  value={country}
                  onChange={(_, val) => setCountry(val || COUNTRIES[0])}
                  renderInput={(params) => <TextField {...params} label="Country / Dial code" />}
                />
                <TextField
                  fullWidth
                  label="Phone number"
                  value={draft.phone || ""}
                  onChange={(e) => setDraft(p => ({ ...p, phone: e.target.value }))}
                />
              </Stack>
            </Stack>

            <Divider className="my-4" />

            <div className="flex items-center gap-2 mb-2">
              <Tags size={16} className="opacity-70" />
              <Typography variant="subtitle2">Custom attributes</Typography>
              <Chip size="small" label="Optional" />
            </div>

            <Stack spacing={1.5}>
              {attributes.map((attr, index) => {
                const customKeyMode = keyDraftOverride.hasOwnProperty(index);
                return (
                  <Stack key={index} direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                    {customKeyMode ? (
                      <TextField
                        sx={{ minWidth: 220 }}
                        label="Attribute key"
                        value={attr.key || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setKeyDraftOverride(prev => ({ ...prev, [index]: v }));
                          setAttributeField(index, "key", v);
                        }}
                        error={!attr.key}
                        helperText={!attr.key ? "Required" : ""}
                      />
                    ) : (
                      <Autocomplete
                        sx={{ minWidth: 240 }}
                        options={KEY_OPTIONS}
                        value={attr.key || null}
                        onChange={(_, opt) => handleKeySelect(index, opt)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Attribute key"
                            error={!attr.key}
                            helperText={!attr.key ? "Required" : ""}
                          />
                        )}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Value"
                      value={attr.value || ""}
                      onChange={(e) => setAttributeField(index, "value", e.target.value)}
                      error={!attr.value}
                      helperText={!attr.value ? "Required" : ""}
                    />

                    <Tooltip title="Remove attribute">
                      <IconButton onClick={() => removeAttributeRow(index)} size="small">
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                );
              })}

              <Button variant="outlined" onClick={addAttributeRow}>Add attribute</Button>
            </Stack>

            <div className="mt-auto pt-4 flex justify-end gap-2">
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={!canSave} variant="contained" startIcon={<Save size={16} />} color="secondary">
                Save changes
              </Button>
            </div>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">No contact selected.</Typography>
        )}
      </Box>
    </Drawer>
  );
}
