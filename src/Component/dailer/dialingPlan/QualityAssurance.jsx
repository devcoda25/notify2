import React from "react";
import { Box, Grid, Stack, Typography, Paper } from "@mui/material";

function KPI({ title, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Typography variant="caption" color="text.secondary">{title}</Typography>
      <Typography variant="h6">{value ?? "—"}</Typography>
    </Paper>
  );
}

export default function QualityAssurance({ data = {} }) {
  const {
    uptakeRate,          // %
    declineRate,         // %
    contactSuccess,      // %
    projection,          // text or %
    scriptAdherence,     // %
    csat,                // 1..5 or %
    flaggedCalls,        // number
  } = data;

  return (
    <Box>
      <Grid container spacing={1.25}>
        <Grid item xs={6} md={3}><KPI title="Uptake" value={uptakeRate != null ? `${uptakeRate}%` : "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="Decline" value={declineRate != null ? `${declineRate}%` : "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="Contact Success" value={contactSuccess != null ? `${contactSuccess}%` : "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="Projection" value={projection ?? "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="Script Adherence" value={scriptAdherence != null ? `${scriptAdherence}%` : "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="CSAT" value={csat ?? "—"} /></Grid>
        <Grid item xs={6} md={3}><KPI title="Flagged Calls" value={flaggedCalls ?? "—"} /></Grid>
      </Grid>

      <Stack sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Notes</Typography>
        <Typography variant="body2" color="text.secondary">
          QA reviewers can annotate calls here (future: link to recordings & transcripts).
        </Typography>
      </Stack>
    </Box>
  );
}
