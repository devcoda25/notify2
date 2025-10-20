import React from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { SearchX } from "lucide-react";

export default function EmptyState({ title = "No data", hint = "", action = null }) {
  return (
    <Box sx={{ py: 6 }}>
      <Stack alignItems="center" spacing={1.5}>
        <SearchX size={28} />
        <Typography variant="subtitle1">{title}</Typography>
        {hint ? (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560, textAlign: "center" }}>
            {hint}
          </Typography>
        ) : null}
        {action ? <Button variant="contained" size="small" onClick={action.onClick}>{action.label}</Button> : null}
      </Stack>
    </Box>
  );
}
