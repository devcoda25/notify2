import React from "react";
import { Box, Grid, Stack, Chip, Typography, Paper, Divider } from "@mui/material";

function Section({ title, children }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

export default function EngagementOverview({ campaign = {}, offer = {}, audience = {} }) {
  const {
    name: campName, status, startDate, endDate, targetVolume, team, description,
    demography, geography,
  } = campaign;

  const {
    name: offerName, qualifiers, description: offerDesc, incentive, termsShort, validFrom, validTo,
  } = offer;

  const {
    source, segments, locations, callWindow, cadence, tags, size, timezone,
  } = audience;

  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* Campaign */}
        <Grid item xs={12} md={6}>
          <Section title="Campaign">
            <Stack spacing={1}>
              <Typography variant="h6">{campName || "Untitled Campaign"}</Typography>
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
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Demography</Typography>
              <Typography variant="body2" color="text.secondary">{demography || "—"}</Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Geography</Typography>
              <Typography variant="body2" color="text.secondary">{geography || "—"}</Typography>
            </Stack>
          </Section>
        </Grid>

        {/* Offer */}
        <Grid item xs={12} md={6}>
          <Section title="Offer">
            <Stack spacing={1}>
              <Typography variant="h6">{offerName || "No Offer"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {offerDesc || "—"}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {incentive && <Chip size="small" label={`Incentive: ${incentive}`} />}
                {validFrom && <Chip size="small" label={`From: ${validFrom}`} />}
                {validTo && <Chip size="small" label={`To: ${validTo}`} />}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">Qualifiers</Typography>
              <Typography variant="body2" color="text.secondary">{qualifiers || "—"}</Typography>
              {termsShort && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Terms</Typography>
                  <Typography variant="body2" color="text.secondary">{termsShort}</Typography>
                </>
              )}
            </Stack>
          </Section>
        </Grid>

        {/* Audience */}
        <Grid item xs={12}>
          <Section title="Target Audience">
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Lead Source</Typography>
                  <Typography variant="body2" color="text.secondary">{source || "—"}</Typography>

                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Locations</Typography>
                  <Typography variant="body2" color="text.secondary">{locations || "—"}</Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Segments</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(segments || []).map((s, i) => <Chip size="small" key={i} label={s} />)}
                    {!segments?.length && <Typography variant="body2" color="text.secondary">—</Typography>}
                  </Stack>

                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Tags</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {(tags || []).map((t, i) => <Chip size="small" key={i} label={t} />)}
                    {!tags?.length && <Typography variant="body2" color="text.secondary">—</Typography>}
                  </Stack>
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
                </Stack>
              </Grid>
            </Grid>
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
}
