import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Grid, Stack, Paper, Typography, LinearProgress,
  Tooltip, Button, IconButton
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import { useDialerStore } from "../store/useDialerStore";

/* --------- soft import the script runner (with upload button) --------- */
let CallScript = null;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  CallScript = require("./CallScript.jsx").default || require("./CallScript.jsx");
} catch { }

/* -------------------- tiny sparkline (right side) -------------------- */
function Sparkline({ data = [], width = 90, height = 20 }) {
  const t = useTheme();
  if (!data.length) return null;
  const pad = 2;
  const n = Math.max(1, data.length);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const x = (i) => pad + ((width - 2 * pad) * i) / Math.max(1, n - 1);
  const y = (v) => height - pad - ((v - min) / span) * (height - 2 * pad);

  let d = "";
  data.forEach((v, i) => { d += (i === 0 ? `M ${x(i)} ${y(v)}` : ` L ${x(i)} ${y(v)}`); });

  const last = data[n - 1] ?? 0;
  const prev = data[n - 2] ?? last;
  const dir = last > prev ? "up" : last < prev ? "down" : "flat";
  const stroke =
    dir === "up" ? t.palette.success.main :
      dir === "down" ? t.palette.error.main :
        t.palette.text.secondary;

  return (
    <svg width={width} height={height} style={{ display: "block" }} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

/* -------------------- compact stat with trend -------------------- */
function Stat({ label, value, series, hint }) {
  const t = useTheme();
  const hasTrend = Array.isArray(series) && series.length > 1;
  const last = hasTrend ? series[series.length - 1] : null;
  const prev = hasTrend ? series[series.length - 2] : last;
  const delta = hasTrend ? (last - prev) : 0;
  const pct = hasTrend ? Math.round((delta / (prev === 0 ? 1 : prev)) * 100) : 0;
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const color =
    dir === "up" ? t.palette.success.main :
      dir === "down" ? t.palette.error.main :
        t.palette.text.secondary;

  return (
    <Paper variant="outlined" sx={{ p: 1, borderRadius: 1, minHeight: 52 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0, pr: 1.25 }}>
          <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }} noWrap>{value ?? "—"}</Typography>
            {hasTrend ? (
              <Stack direction="row" alignItems="center" spacing={0} sx={{ color }}>
                {dir === "up" && <ArrowDropUpIcon fontSize="small" />}
                {dir === "down" && <ArrowDropDownIcon fontSize="small" />}
                {dir === "flat" && <RemoveIcon fontSize="small" />}
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </Typography>
              </Stack>
            ) : hint ? (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }} noWrap>{hint}</Typography>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ flexShrink: 0 }}>{hasTrend && <Sparkline data={series} />}</Box>
      </Box>
    </Paper>
  );
}

/* -------------------- main -------------------- */
export default function ScriptPanel({ data }) {
  const {
    currentLead, callsMade, dailyTarget, metrics, loginAt,
  } = useDialerStore((s) => ({
    currentLead: s.currentLead,
    callsMade: s.callsMade,
    dailyTarget: s.dailyTarget,
    metrics: s.metrics,
    loginAt: s.loginAt,
  }));

  const client = useMemo(() => {
    const L = currentLead || {};
    const phone = L.dialedNumber || L.phone || L.msisdn || L.mobile || L.contact || "—";
    return {
      name: L.name || L.fullName || L.displayName || "Unknown",
      dialedNumber: phone,
    };
  }, [currentLead]);

  // simple session pacing / per-hour (like CRMPanel but lighter)
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const hoursOnShift = useMemo(() => {
    const start = loginAt ? new Date(loginAt).getTime() : Date.now();
    const hrs = (now - start) / 3_600_000;
    return Math.max(hrs, 1 / 12);
  }, [now, loginAt]);
  const callsPerHour = useMemo(() => Number(callsMade || 0) / hoursOnShift, [callsMade, hoursOnShift]);

  // rolling series for sparkline
  const callsPerHourSeries = (function useMiniSeriesInline(value, sampleMs = 60_000) {
    const [series, setSeries] = useState([Number(value || 0)]);
    useEffect(() => { setSeries([Number(value || 0)]); }, [client.dialedNumber]);
    useEffect(() => {
      setSeries((s) => {
        const v = Number(value || 0);
        if (s.length && s[s.length - 1] === v) return s;
        const next = [...s, v];
        return next.slice(-20);
      });
    }, [value]);
    useEffect(() => {
      const id = setInterval(() => setSeries((s) => [...s.slice(-19), Number(value || 0)]), sampleMs);
      return () => clearInterval(id);
    }, [sampleMs, value]);
    return series;
  })(callsPerHour);

  const target = Math.max(1, Number(dailyTarget || 100));
  const made = Number(callsMade || 0);
  const progressPct = Math.min(100, Math.round((made / target) * 100));
  const conversions = Number(metrics?.conversions ?? 0);

  return (
    <Box sx={{ height: "100%", minHeight: 0 }}>
      <Grid container spacing={2} sx={{ height: "100%", minHeight: 0 }}>
        {/* LEFT: compact counters column */}
        <Grid item xs={12} md={4} lg={3.6}>
          <Stack spacing={1}>
            <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
              <Stack spacing={0.75}>
                <Typography variant="caption" color="text.secondary">Caller</Typography>
                <Typography variant="subtitle2" noWrap>{client.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{client.dialedNumber}</Typography>

                <Box sx={{ pt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Daily Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(progressPct) || 0}
                    sx={{ height: 6, borderRadius: 1, mt: 0.5 }}
                  />
                  <Typography variant="caption" color="text.secondary">{progressPct}% of target</Typography>
                </Box>
              </Stack>
            </Paper>

            <Stat
              label="Calls / hr"
              value={callsPerHour.toFixed(1)}
              series={callsPerHourSeries}
              hint="Session pace"
            />
            <Stat
              label="Conversions"
              value={conversions}
              series={callsPerHourSeries}
              hint="Session conversions trend"
            />

            {/* Optional: quick utilities area for QA/Coach toggles etc. */}
            <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined">Coach Notes</Button>
                <Button size="small" variant="outlined">Open CRM</Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* RIGHT: the script runner (dialogue) */}
        <Grid
          item
          xs={12}
          md={8}
          lg={8.4}
          sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          <Box sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            // Ensure the inner CallScript card manages its own overflow gracefully
          }}>
            {CallScript ? (
              <CallScript scriptData={data} />
            ) : (
              <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Call Script</Typography>
                <Typography variant="body2" color="text.secondary">
                  CallScript module not found. Wire it later or keep this placeholder.
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
