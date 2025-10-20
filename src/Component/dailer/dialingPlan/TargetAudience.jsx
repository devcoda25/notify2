import React from "react";
import { Box, Grid, Stack, Chip, Typography } from "@mui/material";

export default function TargetAudience({ data = {} }) {
  const {
    source,
    segments,
    locations,
    callWindow,
    cadence,
    tags,
    size,
    timezone,
  } = data;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Lead Source</Typography>
            <Typography variant="body2" color="text.secondary">{source || "—"}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Segments</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(segments || []).map((s, i) => <Chip size="small" key={i} label={s} />)}
              {!segments?.length && <Typography variant="body2" color="text.secondary">—</Typography>}
            </Stack>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Locations</Typography>
            <Typography variant="body2" color="text.secondary">{locations || "—"}</Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Call Window</Typography>
            <Typography variant="body2" color="text.secondary">{callWindow || "—"}</Typography>
            <Typography variant="subtitle2">Cadence</Typography>
            <Typography variant="body2" color="text.secondary">{cadence || "—"}</Typography>
            <Typography variant="subtitle2">Audience Size</Typography>
            <Typography variant="body2" color="text.secondary">{size ?? "—"}</Typography>
            <Typography variant="subtitle2">Timezone</Typography>
            <Typography variant="body2" color="text.secondary">{timezone || "—"}</Typography>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>Tags</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {(tags || []).map((t, i) => <Chip size="small" key={i} label={t} />)}
              {!tags?.length && <Typography variant="body2" color="text.secondary">—</Typography>}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
