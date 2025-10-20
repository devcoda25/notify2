import React from "react";
import { Box, Grid, Stack, Chip, Typography } from "@mui/material";

export default function OfferDetails({ data = {} }) {
  const {
    name,
    qualifiers,
    description,
    incentive,
    termsShort,
    validFrom,
    validTo,
  } = data;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Stack spacing={1}>
            <Typography variant="h6">{name || "No Offer"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description || "—"}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {incentive && <Chip size="small" label={`Incentive: ${incentive}`} />}
              {validFrom && <Chip size="small" label={`From: ${validFrom}`} />}
              {validTo && <Chip size="small" label={`To: ${validTo}`} />}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2">Qualifiers</Typography>
          <Typography variant="body2" color="text.secondary">
            {qualifiers || "—"}
          </Typography>
          {termsShort && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>Terms</Typography>
              <Typography variant="body2" color="text.secondary">{termsShort}</Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
