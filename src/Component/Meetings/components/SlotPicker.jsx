// Path: src/Component/Meetings/components/SlotPicker.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Tooltip,
} from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import { useAvailabilityStore } from "../../store/scheduling/useAvailabilityStore";
import { fmtTime } from "../utils/datetime";

/**
 * Calendly-like Slot Picker (single day) with synchronized split & reveal.
 * - Selected row: time 50% + gap 2% + Next 48% = 100%
 * - Minimal vertical spacing between rows
 * - Scrollbar hidden by default, shown on hover/focus
 * - Filters out past slots for "today" in the selected timezone
 */
export default function SlotPicker({
  owner = { ownerType: "user", ownerId: "usr_alpha" },
  dayISO,
  timezone,
  slotSizeMinutes = 30,
  bufferBeforeMinutes = 5,
  bufferAfterMinutes = 5,
  value,
  onPick,
  onConfirm,
}) {
  const { computeSlots, loadFixtures, loaded } = useAvailabilityStore();
  const [loading, setLoading] = useState(false);
  const [slotsForDay, setSlotsForDay] = useState([]);

  // Animation tuning
  const ANIM_MS = 220;
  const EASE = "cubic-bezier(0.2, 0.0, 0.0, 1)";
  const GAP_PCT = 2; // % gap between time & Next when selected

  // Live "now" for filtering + header chip (tick every second since we show seconds)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const nowLabel = useMemo(() => formatTimeWithSeconds(now, timezone), [now, timezone]);

  // Helpers to compute local (timezone) date and minutes since midnight
  const getLocalParts = (dateish, tz) => {
    const d = typeof dateish === "string" ? new Date(dateish) : dateish;
    const parts = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).formatToParts(d);
    const get = (t) => parts.find((p) => p.type === t)?.value || "";
    const y = get("year");
    const m = get("month");
    const da = get("day");
    const hh = get("hour");
    const mm = get("minute");
    return {
      isoDate: `${y}-${m}-${da}`,
      minutes: Number(hh) * 60 + Number(mm),
    };
  };

  // Today in selected timezone (ISO date + minutes since midnight)
  const todayLocal = useMemo(() => getLocalParts(now, timezone), [now, timezone]);

  useEffect(() => {
    if (!loaded) loadFixtures?.();
  }, [loaded, loadFixtures]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!dayISO) { setSlotsForDay([]); return; }
      setLoading(true);
      try {
        const merged = await computeSlots?.(
          owner,
          { startDate: dayISO, endDate: dayISO },
          { slotSizeMinutes, bufferBeforeMinutes, bufferAfterMinutes }
        );
        let arr = (merged?.days?.[dayISO] || []).slice();

        // Filter out past slots if selected day is "today" in tz
        const dayIsTodayInTz = dayISO === todayLocal.isoDate;
        if (dayIsTodayInTz) {
          arr = arr.filter((s) => {
            const slotLocal = getLocalParts(s.start, timezone);
            return slotLocal.minutes >= todayLocal.minutes - 1; // small tolerance
          });
        }

        if (!cancelled) setSlotsForDay(arr);
      } catch {
        if (!cancelled) setSlotsForDay([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [
    owner,
    dayISO,
    slotSizeMinutes,
    bufferBeforeMinutes,
    bufferAfterMinutes,
    computeSlots,
    timezone,
    todayLocal.isoDate,
    todayLocal.minutes,
  ]);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        overflowX: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="subtitle2">Pick a Slot</Typography>
        <Chip
          size="small"
          label={`${nowLabel}• ${timezone}`}   // e.g., "12:45:00 PM• Africa/Kampala"
          title={`Current time in ${timezone}`}
        />
      </Stack>

      {(!dayISO || loading) && (
        <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, py: 3 }}>
          {dayISO ? <CircularProgress /> : <Typography color="text.secondary">Select a day</Typography>}
        </Stack>
      )}

      {!loading && dayISO && (
        <>
          {slotsForDay.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1, py: 3, textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>All Slots booked</Typography>
              <Typography variant="body2" color="text.secondary">Try another date or timezone.</Typography>
            </Stack>
          ) : (
            <Stack
              role="list"
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                // Hide scrollbar by default
                scrollbarWidth: "none",                 // Firefox
                "&::-webkit-scrollbar": { width: 0 },   // WebKit
                // Reveal on hover/focus
                "&:hover": { scrollbarWidth: "thin" },
                "&:hover::-webkit-scrollbar": { width: 6 },
                "&:hover::-webkit-scrollbar-thumb": {
                  backgroundColor: (t) => t.palette.action.hover,
                  borderRadius: 6,
                },
              }}
              tabIndex={0}
            >
              {slotsForDay.map((s) => {
                const isSel = value?.start === s.start && value?.end === s.end;
                const label = fmtTime(s.start, timezone);

                return (
                  <Box
                    key={s.start}
                    role="listitem"
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    {/* Time button column */}
                    <Box
                      sx={{
                        flexBasis: isSel ? "50%" : "100%",
                        flexGrow: 0,
                        flexShrink: 0,
                        transition: `flex-basis ${ANIM_MS}ms ${EASE}`,
                      }}
                    >
                      <Tooltip title={`${fmtTime(s.start, timezone)} – ${fmtTime(s.end, timezone)}`}>
                        <Button
                          size="small"
                          variant={isSel ? "contained" : "outlined"}
                          onClick={() => onPick?.(s)}
                          sx={{
                            justifyContent: "center",
                            py: 0.8,
                            borderRadius: 3,
                            fontSize: "0.95rem",
                            width: "100%",
                            minWidth: 0,
                          }}
                          aria-pressed={isSel}
                          aria-controls={`slot-confirm-${s.start}`}
                        >
                          {label}
                        </Button>
                      </Tooltip>
                    </Box>

                    {/* Confirm column: 48% + 2% left margin = 100% with the 50% time column */}
                    <Box
                      id={`slot-confirm-${s.start}`}
                      sx={{
                        flexBasis: isSel ? "48%" : 0,
                        flexGrow: 0,
                        flexShrink: 0,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "flex-end",
                        ml: isSel ? `${GAP_PCT}%` : 0,
                        transition: `
                          flex-basis ${ANIM_MS}ms ${EASE},
                          margin-left ${ANIM_MS}ms ${EASE}
                        `,
                      }}
                    >
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => onConfirm?.()}
                        startIcon={<CheckCircle2 size={16} />}
                        sx={{
                          py: 0.8,
                          borderRadius: 3,
                          width: "100%",
                          minWidth: 0,
                          opacity: isSel ? 1 : 0,
                          transform: `translateX(${isSel ? "0" : "8px"})`,
                          transition: `opacity ${ANIM_MS}ms ${EASE}, transform ${ANIM_MS}ms ${EASE}`,
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
}

/* --- tiny local util --- */
function formatTimeWithSeconds(dateObj, tz) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: tz,
      // Intentionally no timeZoneName to avoid GMT/EAT suffixes
    }).format(dateObj);
  } catch {
    return "";
  }
}
