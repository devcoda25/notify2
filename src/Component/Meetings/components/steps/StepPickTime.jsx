// Path: src/Component/Meetings/components/steps/StepPickTime.jsx
import React from "react";
import { Box, Stack, Paper, Typography, Divider, Chip } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Clock, CalendarPlus } from "lucide-react";

import HostCard from "../HostCard";
import HostBookingTipCard from "../HostBookingTipCard";
import TimeZoneMenu from "../../TimeZoneMenu";
import SlotPicker from "../SlotPicker";
import { toISODate, humanDayISO } from "../../utils/datetime";

/**
 * Props:
 * - eventType, hostProfile, owner
 * - pickedDay, setPickedDay
 * - timezone, setTimezone
 * - slot, setSlot
 * - onNext
 * - calendarSwipe
 */
export default function StepPickTime({
  eventType,
  hostProfile,
  owner = { ownerType: "user", ownerId: "usr_alpha" },
  pickedDay,
  setPickedDay,
  timezone,
  setTimezone,
  slot,
  setSlot,
  onNext,
  calendarSwipe,
}) {
  const { durationMinutes = 30, bufferBeforeMinutes = 5, bufferAfterMinutes = 5 } = eventType || {};
  const dayISO = pickedDay ? toISODate(pickedDay) : null;

  return (
    <Box sx={{ mt: 1.5 }}>
      {/* MOBILE FIRST: Host + Tips on top */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 1.25 }}>
        <Stack gap={1}>
          <HostCard
            profile={hostProfile}
            eventName={eventType?.name}
            durationMinutes={durationMinutes}
            showBookingTip={false}
          />
          <HostBookingTipCard />
        </Stack>
      </Box>

      <Box
        sx={{
          mx: "auto",
          width: "100%",
          maxWidth: 1040,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 360px 1fr" },
          columnGap: { xs: 0, md: 2 },
          alignItems: "start",
        }}
      >
        {/* LEFT: Host (sticky on desktop only) */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 12,
          }}
        >
          <Stack gap={1}>
            <HostCard
              profile={hostProfile}
              eventName={eventType?.name}
              durationMinutes={durationMinutes}
              showBookingTip={false}
            />
            <HostBookingTipCard />
          </Stack>
        </Box>

        {/* MIDDLE: Calendar + Timezone */}
        <Box
          onTouchStart={calendarSwipe?.onTouchStart}
          onTouchEnd={calendarSwipe?.onTouchEnd}
          sx={{ touchAction: "pan-x pan-y", overflow: "hidden" }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Paper variant="outlined" sx={{ p: { xs: 1, sm: 1.25 }, borderRadius: 1, overflow: "hidden" }}>
              <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1 }}>
                <CalendarPlus size={18} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Pick a day
                </Typography>
                {pickedDay && (
                  <Chip size="small" label={humanDayISO(dayISO)} sx={{ ml: "auto" }} />
                )}
              </Stack>

              <DateCalendar
                value={pickedDay}
                onChange={(d) => {
                  if (d instanceof Date && !isNaN(d)) setPickedDay(d);
                }}
                defaultCalendarMonth={calendarSwipe?.month}
                disablePast
                reduceAnimations={false}
                sx={{
                  borderRadius: 1,
                  width: "100%",
                  maxWidth: 360,
                  mx: "auto",
                  "& .MuiPickersDay-root": { mx: 0.25, fontSize: "0.95rem" },
                  "& .MuiPickersDay-today": {
                    position: "relative",
                    outline: "0.5px solid",
                    outlineColor: "primary.main",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 6,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                    },
                  },
                }}
              />

              <TimeZoneMenu label="Timezone" value={timezone} onChange={setTimezone} fullWidth />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                <Clock size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />
                Times shown on the right will be formatted in <strong>{timezone}</strong>.
              </Typography>
            </Paper>
          </LocalizationProvider>
        </Box>

        {/* RIGHT: Slots (single-day, Calendly style) */}
        <Box sx={{ width: "100%", maxWidth: { md: 400 }, justifySelf: { md: "end" }, mt: { xs: 1.25, md: 0 } }}>
          <SlotPicker
            owner={owner}
            dayISO={dayISO}
            timezone={timezone}
            slotSizeMinutes={durationMinutes}
            bufferBeforeMinutes={bufferBeforeMinutes}
            bufferAfterMinutes={bufferAfterMinutes}
            value={slot}
            onPick={(s) => setSlot?.(s)}
            onConfirm={() => onNext?.()}
          />
        </Box>
      </Box>
    </Box>
  );
}
