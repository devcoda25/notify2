// Path: src/Component/Meetings/components/BookingHeaderRow.jsx
import React from "react";
import { Stack, Chip, Typography, Box } from "@mui/material";
import { CalendarPlus, Clock } from "lucide-react";

/** Compact header above the stepper. */
export default function BookingHeaderRow({ eventType }) {
  if (!eventType) return null;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={1}
      sx={{ maxWidth: 760, mx: "auto", width: "100%" }}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <CalendarPlus size={18} />
        <Typography variant="h6">{eventType.name}</Typography>
        <Chip size="small" icon={<Clock size={14} />} label={`${eventType.durationMinutes} min`} />
      </Stack>
      <Box sx={{ height: 36 }} />
    </Stack>
  );
}
