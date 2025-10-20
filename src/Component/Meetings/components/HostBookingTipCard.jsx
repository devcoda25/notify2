// Path: src/Component/Meetings/components/HostBookingTipCard.jsx
import React from "react";
import { Paper, Stack, Typography, Box } from "@mui/material";
import { CalendarCheck2 } from "lucide-react";

/**
 * Compact tip card explaining the booking steps.
 *
 * Props:
 * - title?: string
 * - children?: ReactNode (renders instead of default steps)
 */
export default function HostBookingTipCard({ title = "How to book", children }) {
  const DefaultBody = (
    <Box component="ol" sx={{ pl: 2.25, m: 0 }}>
      <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Pick a day on the calendar.
      </Typography>
      <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Choose a time and tap <strong>Next</strong>.
      </Typography>
      <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Enter your details.
      </Typography>
      <Typography component="li" variant="body2" color="text.secondary">
        Review and click <strong>Confirm &amp; schedule</strong>. You’ll receive a calendar invite by email.
      </Typography>
    </Box>
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.25, sm: 1.75 },
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Stack gap={0.75}>
        <Stack direction="row" alignItems="center" gap={0.75}>
          <CalendarCheck2 size={16} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Stack>
        {children || DefaultBody}
      </Stack>
    </Paper>
  );
}
