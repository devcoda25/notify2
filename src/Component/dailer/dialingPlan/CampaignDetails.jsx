import React from "react";
import { Box, Grid, Stack, Chip, Typography } from "@mui/material";

export default function CampaignDetails({ data = {} }) {
  const {
    name,
    status,
    startDate,
    endDate,
    demography,
    geography,
    targetVolume,
    team,
    description,
  } = data;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Stack spacing={1}>
            <Typography variant="h6">{name || "Untitled Campaign"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description || "No description provided."}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {status && <Chip size="small" label={`Status: ${status}`} />}
              {startDate && <Chip size="small" label={`Start: ${startDate}`} />}
              {endDate && <Chip size="small" label={`End: ${endDate}`} />}
              {targetVolume && <Chip size="small" label={`Target: ${targetVolume}`} />}
              {team && <Chip size="small" label={`Team: ${team}`} />}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Demography</Typography>
            <Typography variant="body2" color="text.secondary">
              {demography || "—"}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Geography</Typography>
            <Typography variant="body2" color="text.secondary">
              {geography || "—"}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
