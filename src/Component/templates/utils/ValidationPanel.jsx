// Path: src/Component/templates/utils/ValidationPanel.jsx

import React from "react";
import { Stack, Alert, Typography } from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { validateTemplate } from "../core/validators";

/**
 * Normalize payload for validator:
 * - Ensure payload is an object
 * - Ensure `variants` is always an array (accept arrays, maps, or missing)
 */
function normalizeForValidation(payload) {
  const p = payload && typeof payload === "object" ? { ...payload } : {};
  const v = p.variants;

  // Accept arrays, or any iterable object map of variants
  p.variants = Array.isArray(v)
    ? v
    : v
    ? Object.values(v)
    : [];

  return p;
}

/** Safe wrapper to prevent runtime crashes from unexpected shapes */
function validateTemplateSafe(payload, opts) {
  try {
    const normalized = normalizeForValidation(payload);
    const result = validateTemplate(normalized, opts);
    return Array.isArray(result) ? result : [];
  } catch (err) {
    // Never crash the UI; surface a single warning row.
    return [{ message: err?.message || "Validation error" }];
  }
}

export default function ValidationPanel({ payload, channel }) {
  const errors = React.useMemo(
    () => validateTemplateSafe(payload, { channel }),
    [payload, channel]
  );

  if (!errors?.length) {
    return (
      <Alert severity="success" icon={<CheckCircle2 size={16} />}>
        Looks good! No validation errors found.
      </Alert>
    );
  }

  return (
    <Stack spacing={1.25}>
      <Typography variant="subtitle2">Validation issues</Typography>
      {errors.map((e, i) => (
        <Alert key={i} severity="warning">
          {e?.message || String(e)}
        </Alert>
      ))}
    </Stack>
  );
}
