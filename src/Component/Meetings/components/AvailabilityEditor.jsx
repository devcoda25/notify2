// Path: /src/Component/Meetings/components/AvailabilityEditor.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Plus, Trash2, Clock3, Info } from "lucide-react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useAvailabilityStore } from "../../store/scheduling/useAvailabilityStore";

const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

// JS weekday map (Sun=0 … Sat=6)
const DAY_TO_JS = { sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6 };
const JS_TO_DAY = { 0:"sunday",1:"monday",2:"tuesday",3:"wednesday",4:"thursday",5:"friday",6:"saturday" };

// ISO weekday map (Mon=1 … Sun=7)
const DAY_TO_ISO = { monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6,sunday:7 };

// accept both ISO(1–7) and JS(0–6), normalize -> JS(0–6)
const normalizeWeekday = (w) => {
  const n = Number(w);
  if (n >= 0 && n <= 6) return n;     // already JS
  if (n >= 1 && n <= 7) return n % 7; // ISO -> JS (7 -> 0)
  return null;
};

// helpers
const pad2 = (n) => String(n).padStart(2, "0");
const toMins = (hhmm) => {
  if (!hhmm) return 0;
  const [h, m] = hhmm.split(":").map((n) => parseInt(n || "0", 10));
  return h * 60 + m;
};
const fromMins = (m) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
const hhmmToDate = (hhmm) => {
  const [h, m] = (hhmm || "09:00").split(":").map((x) => parseInt(x, 10));
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};
const dateToHHMM = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const totalMinutes = (intervals = []) =>
  intervals.reduce((acc, iv) => acc + Math.max(0, toMins(iv.end) - toMins(iv.start)), 0);

function validateDay(intervals = []) {
  const errors = [];
  const sorted = [...intervals].sort((a, b) => toMins(a.start) - toMins(b.start));
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    if (!cur.start || !cur.end) {
      errors.push(`Missing start/end on interval ${i + 1}`);
      continue;
    }
    if (toMins(cur.end) <= toMins(cur.start)) errors.push(`Interval ${i + 1} has end ≤ start`);
    if (i > 0) {
      const prev = sorted[i - 1];
      if (toMins(cur.start) < toMins(prev.end)) errors.push(`Interval ${i + 1} overlaps with interval ${i}`);
    }
  }
  return errors;
}

/** Map store.rules -> editor.weeklyHours (accept ISO or JS weekday) */
function rulesToWeeklyHours(rules = []) {
  const wh = Object.fromEntries(DAYS.map((d) => [d, []]));
  for (const r of rules) {
    const js = r.weekdayJS != null ? Number(r.weekdayJS) : normalizeWeekday(r.weekday);
    const day = js != null ? JS_TO_DAY[js] : null;
    if (!day) continue;
    wh[day] = (r.intervals || []).map((iv) => ({ start: iv.start, end: iv.end }));
  }
  return wh;
}

/** Map editor.weeklyHours -> store.rules (ISO + JS mirror) */
function weeklyHoursToRules(weeklyHours = {}) {
  const rules = [];
  for (const day of DAYS) {
    const intervals = weeklyHours[day] || [];
    if (!intervals.length) continue;
    rules.push({
      weekday: DAY_TO_ISO[day],   // ISO (Mon=1…Sun=7)
      weekdayJS: DAY_TO_JS[day],  // JS  (Sun=0…Sat=6)
      intervals: intervals.map((iv) => ({ start: iv.start, end: iv.end })),
    });
  }
  rules.sort((a, b) => a.weekday - b.weekday);
  return rules;
}

// remove number spinners (consistent styling)
const numberInputSx = {
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

function IntervalRow({ value, onChange, onRemove }) {
  return (
    <Stack direction="row" gap={1} alignItems="center" sx={{ width: "100%" }}>
      <TimePicker
        ampm={false}
        minutesStep={5}
        label="Start"
        value={hhmmToDate(value.start)}
        onChange={(val) => {
          if (!val) return;
          onChange({ ...value, start: dateToHHMM(val) });
        }}
        slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
      />
      <TimePicker
        ampm={false}
        minutesStep={5}
        label="End"
        value={hhmmToDate(value.end)}
        onChange={(val) => {
          if (!val) return;
          onChange({ ...value, end: dateToHHMM(val) });
        }}
        slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
      />
      <Tooltip title="Remove interval">
        <IconButton onClick={onRemove} color="error" size="small">
          <Trash2 size={16} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default function AvailabilityEditor({
  ownerType = "user",
  ownerId = "usr_alpha",
  onSaved,
  onDirtyChange, // optional
}) {
  const av = useAvailabilityStore();
  const loadFixtures = useAvailabilityStore((s) => s.loadFixtures);
  const loaded = useAvailabilityStore((s) => s.loaded);
  const upsertProfile = useAvailabilityStore((s) => s.upsertProfile);
  const getProfileByOwner = useAvailabilityStore((s) => s.getProfileByOwner);

  useEffect(() => {
    if (!loaded) loadFixtures?.();
  }, [loaded, loadFixtures]);

  const backingProfile = useMemo(
    () => (loaded ? getProfileByOwner?.(ownerType, ownerId) : null),
    [loaded, getProfileByOwner, ownerType, ownerId]
  );

  // timezones from store (fallback to a few)
  const storeTZs = av.timezones || av.getTimezones?.() || ["Africa/Kampala", "Africa/Nairobi", "UTC"];

  const initialEditorState = useMemo(
    () =>
      backingProfile
        ? {
            id: backingProfile.id,
            ownerType: backingProfile.ownerType,
            ownerId: backingProfile.ownerId,
            timezone: backingProfile.timezone || storeTZs[0] || "Africa/Kampala",
            weeklyHours: rulesToWeeklyHours(backingProfile.rules || []),
            overrides: backingProfile.overrides || [],
            minSlotIncrementMinutes: backingProfile.minSlotIncrementMinutes || 15,
          }
        : {
            id: `av_${ownerId}`,
            ownerType,
            ownerId,
            timezone: storeTZs[0] || "Africa/Kampala",
            weeklyHours: Object.fromEntries(DAYS.map((d) => [d, []])),
            overrides: [],
            minSlotIncrementMinutes: 15,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backingProfile, ownerId, ownerType, storeTZs.join("|")]
  );

  const [v, setV] = useState(initialEditorState);

  // separate text state so the field can be cleared and edited freely
  const [minIncInput, setMinIncInput] = useState(String(initialEditorState.minSlotIncrementMinutes));

  // ---- validity for min slot increment ----
  const minIncValid = useMemo(() => {
    if (typeof minIncInput !== "string") return false;
    const s = minIncInput.trim();
    if (s === "") return false;
    const n = Number(s);
    return Number.isInteger(n) && n >= 5;
  }, [minIncInput]);

  // ---- Dirty tracking ----
  const [dirty, setDirty] = useState(false);
  const markDirty = () => {
    if (!dirty) {
      setDirty(true);
      onDirtyChange?.(true);
    }
  };

  // reset when profile/owner changes
  useEffect(() => {
    setV(initialEditorState);
    setMinIncInput(String(initialEditorState.minSlotIncrementMinutes));
    setDirty(false);
    onDirtyChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEditorState]);

  // Smart “next interval” for a given day
  const suggestNextForDay = (day) => {
    const intervals = v.weeklyHours?.[day] || [];
    const DEFAULT = { start: "09:30", end: "17:30", label: "09:30–17:30" };
    if (!intervals.length) return DEFAULT;

    const latestEnd = intervals.map((iv) => iv.end).sort().at(-1);
    const WORK_START = 5 * 60;    // 05:00
    const WORK_END = 21 * 60;     // 21:00 hard stop
    const MIN_BLOCK = 30;
    const MAX_BLOCK = 8 * 60;

    let startM = Math.max(toMins(latestEnd) + 30, WORK_START);
    if (startM > WORK_END - MIN_BLOCK) return DEFAULT;

    const endM = Math.min(startM + MAX_BLOCK, WORK_END);
    if (endM - startM < MIN_BLOCK) return DEFAULT;

    const start = fromMins(startM);
    const end = fromMins(endM);
    return { start, end, label: `${start}–${end}` };
  };

  const addInterval = (day, start, end) => {
    const wh = { ...v.weeklyHours };
    const s = start ?? "09:00";
    const e = end ?? "17:00";
    wh[day] = [...(wh[day] || []), { start: s, end: e }];
    setV({ ...v, weeklyHours: wh });
    markDirty();
  };

  const clearDay = (day) => {
    const wh = { ...v.weeklyHours };
    wh[day] = [];
    setV({ ...v, weeklyHours: wh });
    markDirty();
  };

  const perDayErrors = useMemo(() => {
    const map = {};
    for (const d of DAYS) map[d] = validateDay(v.weeklyHours?.[d] || []);
    return map;
  }, [v.weeklyHours]);

  const hasAnyError = useMemo(() => DAYS.some((d) => perDayErrors[d]?.length), [perDayErrors]);

  const weeklyTotalMins = useMemo(
    () => DAYS.reduce((acc, d) => acc + totalMinutes(v.weeklyHours?.[d] || []), 0),
    [v.weeklyHours]
  );

  const save = async () => {
    // Block save if invalid/empty
    if (!minIncValid) return;

    let parsed = parseInt(minIncInput, 10);
    const sanitizedMinInc = Math.max(5, parsed);

    const nextProfile = {
      id: v.id,
      ownerType: v.ownerType,
      ownerId: v.ownerId,
      timezone: v.timezone,
      rules: weeklyHoursToRules(v.weeklyHours),
      overrides: v.overrides || [],
      minSlotIncrementMinutes: sanitizedMinInc,
      updatedAt: new Date().toISOString(),
    };

    await Promise.resolve(upsertProfile?.(nextProfile));

    setV((cur) => ({ ...cur, minSlotIncrementMinutes: sanitizedMinInc }));
    setMinIncInput(String(sanitizedMinInc));
    setDirty(false);
    onDirtyChange?.(false);
    onSaved?.(nextProfile);
  };

  if (!loaded) {
    return <Typography>Loading availability data…</Typography>;
  }

  return (
    <Box
      sx={{
        height: { xs: "72vh", md: "76vh" },
        minHeight: 520,
        maxHeight: "86vh",
        overflow: "hidden",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        bgcolor: (t) => t.palette.background.paper,
      }}
    >
      {/* Frozen header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" gap={1} alignItems="center">
            <Clock3 size={18} />
            <Typography variant="h6" fontWeight={700}>
              Availability
            </Typography>
          </Stack>
          <Chip
            size="small"
            color="primary"
            label={`Weekly total: ${Math.floor(weeklyTotalMins / 60)}h ${weeklyTotalMins % 60}m`}
          />
        </Stack>
      </Box>

      {/* Scrollable body */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", px: 2, py: 2 }}>
        <Stack gap={2}>
          {/* Global options */}
          <Stack direction={{ xs: "column", md: "row" }} gap={2}>
            <TextField
              select
              size="small"
              label="Timezone"
              value={v.timezone}
              onChange={(e) => {
                setV({ ...v, timezone: e.target.value });
                markDirty();
              }}
              sx={{ minWidth: 260 }}
            >
              {(storeTZs || []).map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              label="Minimum slot increment (minutes)"
              type="number"
              value={minIncInput}
              onChange={(e) => {
                setMinIncInput(e.target.value); // allow empty while typing
                markDirty();
              }}
              onBlur={() => {
                // only commit to v when valid; otherwise leave as-is (shows error)
                if (minIncValid) {
                  const sanitized = Math.max(5, parseInt(minIncInput, 10));
                  if (sanitized !== v.minSlotIncrementMinutes) {
                    setV({ ...v, minSlotIncrementMinutes: sanitized });
                  }
                }
              }}
              error={!minIncValid}
              helperText={minIncValid ? "Controls grid granularity for generated slots" : "Enter an integer ≥ 5"}
              sx={{ width: { xs: "100%", md: 260 }, ...numberInputSx }}
            />
          </Stack>

          {/* Weekly grid */}
          <Stack gap={2}>
            {DAYS.map((day) => {
              const intervals = v.weeklyHours?.[day] || [];
              const dayErrors = perDayErrors[day] || [];
              const title = day.charAt(0).toUpperCase() + day.slice(1);
              const suggestion = suggestNextForDay(day);

              return (
                <Box
                  key={day}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: (t) => `1px solid ${dayErrors.length ? t.palette.error.light : t.palette.divider}`,
                    bgcolor: (t) => (dayErrors.length ? t.palette.error[50] || "#fff5f5" : "background.paper"),
                  }}
                >
                  <Stack gap={1.25}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ textTransform: "capitalize", fontWeight: 700 }}>
                          {title}
                        </Typography>
                        <Chip
                          size="small"
                          variant={intervals.length ? "filled" : "outlined"}
                          color={intervals.length ? "success" : "default"}
                          label={
                            intervals.length
                              ? `${intervals.length} interval${intervals.length > 1 ? "s" : ""} • ${Math.floor(
                                  totalMinutes(intervals) / 60
                                )}h ${totalMinutes(intervals) % 60}m`
                              : "Off"
                          }
                        />
                      </Stack>

                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addInterval(day)}
                          startIcon={<Plus size={16} />}
                        >
                          Add interval
                        </Button>

                        {/* Dynamic “Suggest next” */}
                        <Button
                          size="small"
                          onClick={() => addInterval(day, suggestion.start, suggestion.end)}
                          title="Suggest the next sensible interval after your latest end time"
                        >
                          {suggestion.label}
                        </Button>

                        {/* Hide Clear day when already empty */}
                        {intervals.length > 0 && (
                          <Button size="small" color="error" onClick={() => clearDay(day)}>
                            Clear day
                          </Button>
                        )}
                      </Stack>
                    </Stack>

                    {dayErrors.length > 0 && (
                      <Alert severity="error" variant="outlined">
                        {dayErrors.map((e, i) => (
                          <Box key={i}>{e}</Box>
                        ))}
                      </Alert>
                    )}

                    <Stack gap={1}>
                      {intervals.map((iv, i) => (
                        <IntervalRow
                          key={`${day}-${i}`}
                          value={iv}
                          onChange={(next) => {
                            const wh = { ...v.weeklyHours };
                            const arr = [...(wh[day] || [])];
                            arr[i] = next;
                            wh[day] = arr;
                            setV({ ...v, weeklyHours: wh });
                            markDirty();
                          }}
                          onRemove={() => {
                            const wh = { ...v.weeklyHours };
                            const arr = [...(wh[day] || [])];
                            arr.splice(i, 1);
                            wh[day] = arr;
                            setV({ ...v, weeklyHours: wh });
                            markDirty();
                          }}
                        />
                      ))}
                      {intervals.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No working hours set for {title}.
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      {/* Frozen footer */}
      <Box sx={{ px: 2, py: 1.25, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} flexWrap="wrap">
          {/* Compact, inline warnings */}
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
            {dirty && (
              <Alert
                severity="warning"
                icon={<Info size={16} style={{ display: "block" }} />}
                sx={{
                  p: "2px 8px",
                  m: 0,
                  lineHeight: 1.5,
                  "& .MuiAlert-message": { p: 0, fontSize: 13, display: "flex", alignItems: "center" },
                  "& .MuiAlert-icon": { display: "flex", alignItems: "center", mr: 0.75, p: 0 },
                }}
              >
                Unsaved changes
              </Alert>
            )}
            {hasAnyError && (
              <Alert
                severity="error"
                variant="outlined"
                sx={{ p: "2px 8px", m: 0, "& .MuiAlert-message": { p: 0, fontSize: 13 } }}
              >
                Fix overlapping/invalid intervals
              </Alert>
            )}
          </Stack>

          <Button
            size="small"
            variant="outlined"
            disabled={hasAnyError || !minIncValid}
            onClick={save}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
