// Path: src/Component/templates/utils/VariablesInspector.jsx

import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Box,
  Alert,
  Button,
  TextField,
} from "@mui/material";
import { Braces, AlertTriangle, Plus } from "lucide-react";
import { extractPlaceholders, resolveAndReport } from "../core/variableResolver";

/**
 * VariablesInspector
 *
 * Merged "resolver + inspector":
 *  - If `variablesJSON` and `onChangeJSON` are provided → Editor mode (JSON input).
 *  - Else falls back to read-only mode using `vars`.
 *
 * Props:
 *  - snapshot: any (content object used to detect placeholders)
 *  - variablesJSON?: string          (editor mode)
 *  - onChangeJSON?: (string) => void (editor mode)
 *  - vars?: object                   (read-only fallback if editor props not provided)
 *  - title?: string
 */
export default function VariablesInspector({
  snapshot,
  variablesJSON,
  onChangeJSON,
  vars,
  title = "Variables",
}) {
  const editorMode = typeof onChangeJSON === "function";

  // Parse variables (editor mode parses from variablesJSON; read-only uses vars)
  const { parsed, error } = React.useMemo(() => {
    if (editorMode) {
      try {
        const text = typeof variablesJSON === "string" ? variablesJSON : "{}";
        const obj = JSON.parse(text || "{}");
        return { parsed: obj && typeof obj === "object" ? obj : {}, error: null };
      } catch (e) {
        return { parsed: {}, error: e?.message || "Invalid JSON" };
      }
    }
    return { parsed: (vars && typeof vars === "object" ? vars : {}), error: null };
  }, [editorMode, variablesJSON, vars]);

  // Detect placeholders + resolution stats
  const placeholders = React.useMemo(() => extractPlaceholders(snapshot || {}), [snapshot]);
  const { missing, resolved } = React.useMemo(
    () => resolveAndReport(snapshot || {}, parsed || {}),
    [snapshot, parsed]
  );

  // Actions
  const addMissingKeys = () => {
    if (!editorMode) return;
    try {
      const base = JSON.parse(variablesJSON || "{}") || {};
      let changed = false;
      (missing || []).forEach((k) => {
        if (!(k in base)) {
          base[k] = ""; // seed with empty string
          changed = true;
        }
      });
      if (changed) onChangeJSON(JSON.stringify(base, null, 2));
    } catch {
      // ignore; parse error already surfaced
    }
  };

  const prettyPlaceholders = [...(placeholders || [])];

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Braces size={16} />
        <Typography variant="subtitle2">
          {title} {editorMode && <Chip size="small" color="primary" label="Required for preview" sx={{ ml: 1 }} />}
        </Typography>
      </Stack>

      {editorMode && (
        <Alert severity="info" sx={{ mb: 1 }}>
          These values are for <strong>demo/preview during creation</strong> and will be used to resolve
          <code> {" {{variables}} "}</code>. You’ll reuse this template by changing variables at send time.
        </Alert>
      )}

      {/* Editor mode: JSON input */}
      {editorMode && (
        <>
          <TextField
            value={typeof variablesJSON === "string" ? variablesJSON : "{}"}
            onChange={(e) => onChangeJSON?.(e.target.value)}
            multiline
            minRows={6}
            fullWidth
            error={Boolean(error)}
            helperText={error ? `JSON error: ${error}` : "Provide key/value JSON. Example: { \"user_name\": \"Ada\" }"}
            sx={{ mb: 1 }}
          />
          {!!missing.length && (
            <Button size="small" startIcon={<Plus size={14} />} onClick={addMissingKeys} sx={{ mb: 1 }}>
              Add missing keys
            </Button>
          )}
          <Divider sx={{ my: 1 }} />
        </>
      )}

      {/* Inspector */}
      <Typography variant="caption" color="text.secondary">
        Detected placeholders
      </Typography>
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", my: 1 }}>
        {prettyPlaceholders.length ? (
          prettyPlaceholders.map((k) => {
            const isMissing = (missing || []).includes(k);
            return (
              <Chip
                key={k}
                size="small"
                label={k}
                variant={isMissing ? "outlined" : "filled"}
                color={isMissing ? "warning" : "default"}
              />
            );
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            None
          </Typography>
        )}
      </Box>

      {!!missing.length && (
        <>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" alignItems="center" spacing={1}>
            <AlertTriangle size={14} />
            <Typography variant="body2">Missing values</Typography>
          </Stack>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", my: 1 }}>
            {missing.map((k) => (
              <Chip key={k} size="small" color="warning" label={k} />
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary">
        Resolved preview (sample)
      </Typography>
      <Box
        sx={{
          mt: 1,
          p: 1.25,
          borderRadius: 1.5,
          bgcolor: (t) => t.palette.action.hover,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize: 12,
          whiteSpace: "pre-wrap",
        }}
      >
        {JSON.stringify(resolved, null, 2)}
      </Box>
    </Paper>
  );
}
