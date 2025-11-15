import React from "react";
import { Box, Typography } from "@mui/material";

export default function FallbackPreview({ part }) {
  return (
    <Box sx={{ border: (th) => `1px dashed ${th.palette.divider}`, borderRadius: 8, px: 1, py: 0.75 }}>
      <Typography variant="caption" color="text.secondary">
        {part?.kind ? `Unsupported preview: ${part.kind}` : "Unsupported preview"}
      </Typography>
    </Box>
  );
}
