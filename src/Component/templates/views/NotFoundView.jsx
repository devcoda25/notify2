// Path: src/Component/templates/views/NotFoundView.jsx

import React from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFoundView({ message = "We couldn’t find what you’re looking for.", onBack }) {
  return (
    <Box sx={{ height: "100%", display: "grid", placeItems: "center", p: 2 }}>
      <Paper variant="outlined" sx={{ p: 4, maxWidth: 520, textAlign: "center" }}>
        <Stack spacing={1.5} alignItems="center">
          <Ghost size={40} />
          <Typography variant="h6">Not found</Typography>
          <Typography color="text.secondary">{message}</Typography>
          {onBack && (
            <Button startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ mt: 1 }}>
              Go back
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
