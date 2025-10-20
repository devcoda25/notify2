// /src/Component/crm/CRMPanel.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box, Grid, Stack, LinearProgress, Typography, Paper,
  Button, Divider, Tooltip, IconButton, List, ListItem, ListItemText
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";

import { useDialerStore } from "../../store/useDialerStore";
import InteractionForm from "./InteractionForm";

/* === Resize logs panel height here === */
const LOGS_PANEL_MINHEIGHT = { xs: 520, md: 440 };

/* -------------------- tiny sparkline (right side) -------------------- */
function Sparkline({ data = [], width = 90, height = 20 }) {
  const t = useTheme();
  if (!data.length) return null;
  const pad = 2;
  const n = Math.max(1, data.length);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = (max - min) || 1;
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

/* -------------------- thin stat with LEFT info, RIGHT graph -------------------- */
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
            {hasTrend && (
              <Stack direction="row" alignItems="center" spacing={0} sx={{ color }}>
                {dir === "up" && <ArrowDropUpIcon fontSize="small" />}
                {dir === "down" && <ArrowDropDownIcon fontSize="small" />}
                {dir === "flat" && <RemoveIcon fontSize="small" />}
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </Typography>
              </Stack>
            )}
            {!hasTrend && hint && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }} noWrap>{hint}</Typography>
            )}
          </Stack>
        </Box>
        <Box sx={{ flexShrink: 0 }}>{hasTrend && <Sparkline data={series} />}</Box>
      </Box>
    </Paper>
  );
}

/* -------------------- main -------------------- */
export default function CRMPanel({ reasonMatrix, fetchAdminForm, onLogInteraction }) {
  const {
    callStatus, currentLead, callsMade, dailyTarget, metrics,
    engagementStartedAt, loginAt, lastMissed,
  } = useDialerStore((s) => ({
    callStatus: s.callStatus,
    currentLead: s.currentLead,
    callsMade: s.callsMade,
    dailyTarget: s.dailyTarget,
    metrics: s.metrics,
    engagementStartedAt: s.engagementStartedAt,
    loginAt: s.loginAt,
    lastMissed: s.lastMissed,
  }));

  // derive client
  const client = useMemo(() => {
    const L = currentLead || {};
    const phone = L.dialedNumber || L.phone || L.msisdn || L.mobile || L.contact || "—";
    return {
      name: L.name || L.fullName || L.displayName || "Unknown",
      photoUrl: L.photoUrl || L.avatarUrl || "",
      dialedNumber: phone,
      language: L.language || L.lang || "—",
      accountId: L.accountId || L.id || L.leadId,
      tags: L.tags || L.labels || [],
    };
  }, [currentLead]);

  // callKey (per call session)
  const callKey = useMemo(
    () => (engagementStartedAt ? String(new Date(engagementStartedAt).getTime()) : null),
    [engagementStartedAt]
  );

  // metrics
  const [metricsLocal, setMetricsLocal] = useState(() => ({
    dailyTarget: Number(dailyTarget ?? 100),
    weeklyTarget: Number(metrics?.weeklyTarget ?? 500),
    callsDone: Number(callsMade ?? 0),
    conversions: Number(metrics?.conversions ?? 0),
  }));
  useEffect(() => {
    setMetricsLocal((m) => ({
      ...m,
      dailyTarget: Number(dailyTarget ?? m.dailyTarget),
      callsDone: Number(callsMade ?? m.callsDone),
      conversions: Number(metrics?.conversions ?? m.conversions),
      weeklyTarget: Number(metrics?.weeklyTarget ?? m.weeklyTarget),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyTarget, callsMade, metrics?.conversions, metrics?.weeklyTarget]);

  const [mode, setMode] = useState("dashboard"); // "dashboard" | "log" | "edit"
  const [editing, setEditing] = useState(null);

  const [lastInteractions, setLastInteractions] = useState([]);
  const [callKeysHistory, setCallKeysHistory] = useState([]);
  const [callMeta, setCallMeta] = useState({});

  useEffect(() => {
    if (!callKey) return;
    setCallMeta((prev) =>
      prev[callKey] ? prev : { ...prev, [callKey]: { name: client.name, dialedNumber: client.dialedNumber } }
    );
  }, [callKey, client.name, client.dialedNumber]);

  useEffect(() => {
    if (!callKey) return;
    setCallKeysHistory((prev) => {
      const without = prev.filter((k) => k !== callKey);
      return [callKey, ...without].slice(0, 24);
    });
  }, [callKey]);

  useEffect(() => {
    if (callStatus !== "in-call" && callStatus !== "acw") setMode("dashboard");
  }, [callStatus]);

  useEffect(() => {
    setLastInteractions([]);
    setEditing(null);
    setMode("dashboard");
    setCallKeysHistory([]);
  }, [client.accountId, client.dialedNumber]);

  const addOrUpdateInteraction = (ixn) => {
    setLastInteractions((prev) => {
      const i = prev.findIndex((p) => p.id === ixn.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...prev[i], ...ixn, updatedAt: new Date().toISOString() };
        return copy;
      }
      return [{ ...ixn }, ...prev];
    });
  };

  const handleSubmitInteraction = async (payload) => {
    const id = payload.id || `ixn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const record = {
      id,
      callKey,
      category: payload.category,
      subCategory: payload.subCategory,
      reason: payload.reason,
      formValues: payload.formValues || {},
      formSchemaTitle: payload.formSchema?.title,
      createdAt: payload.id ? undefined : new Date().toISOString(),
    };
    try { await onLogInteraction?.(record); } catch { }
    addOrUpdateInteraction(record);
    setEditing(null);
    setMode("dashboard");
  };

  const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); } catch { } };
  const acwFromMissed = callStatus === "acw" && !!lastMissed;
  const canLog = callStatus === "in-call" || (callStatus === "acw" && !acwFromMissed);

  const uniqueCallsWithLogs = useMemo(() => {
    const s = new Set();
    for (const ixn of lastInteractions) s.add(ixn.callKey || "no-call");
    return s.size;
  }, [lastInteractions]);

  const lastSixCalls = useMemo(() => callKeysHistory.slice(0, 6), [callKeysHistory]);
  const recentSummaries = useMemo(
    () =>
      lastSixCalls.map((k) => {
        const ixns = lastInteractions.filter((i) => (i.callKey || "no-call") === (k || "no-call"));
        const latest = ixns
          .slice()
          .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))[0];
        const count = ixns.length;
        const startedAt = k ? new Date(Number(k)) : null;
        return { callKey: k, latest, count, startedAt };
      }),
    [lastSixCalls, lastInteractions]
  );

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
  const callsPerHour = useMemo(() => uniqueCallsWithLogs / hoursOnShift, [uniqueCallsWithLogs, hoursOnShift]);

  const callsPerHourSeries = (function useMiniSeriesInline(value, sampleMs = 60_000) {
    const [series, setSeries] = useState([Number(value || 0)]);
    useEffect(() => { setSeries([Number(value || 0)]); }, [client.accountId, client.dialedNumber]);
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

  const target = Math.max(1, Number(metricsLocal.dailyTarget || 0));
  const made = uniqueCallsWithLogs;
  const progressPct = Math.min(100, Math.round((made / target) * 100));
  const remaining = Math.max(0, target - made);

  return (
    <Box>
      {mode === "dashboard" ? (
        <Grid container spacing={2} sx={{ height: "100%", minHeight: 0 }}>
          {/* LEFT: compact counters column */}
          <Grid item xs={12} md={3}>
            <Stack spacing={1}>
              <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                <Grid container spacing={0.75}>
                  <Grid item xs={6}><Box sx={{ height: 68, display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>Weekly Target</Typography>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.15 }} noWrap>{metricsLocal.weeklyTarget ?? "—"}</Typography>
                  </Box></Grid>
                  <Grid item xs={6}><Box sx={{ height: 68, display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>Daily Target</Typography>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.15 }} noWrap>{metricsLocal.dailyTarget ?? "—"}</Typography>
                  </Box></Grid>
                  <Grid item xs={6}><Box sx={{ height: 68, display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>Remaining</Typography>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.15 }} noWrap>{remaining}</Typography>
                  </Box></Grid>
                  <Grid item xs={6}><Box sx={{ height: 68, display: "flex", flexDirection: "column", justifyContent: "flex-end", pb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" noWrap>Deficit</Typography>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.15 }} noWrap>{remaining}</Typography>
                  </Box></Grid>
                </Grid>
              </Paper>

              <Stat label="Calls Logged / hr" value={callsPerHour.toFixed(1)} series={callsPerHourSeries} hint="Unique calls with ≥1 interaction per hour" />
              <Stat label="Conversions" value={metricsLocal.conversions} series={callsPerHourSeries} hint="Session conversions trend" />

              <Paper variant="outlined" sx={{ p: 1, borderRadius: 1 }}>
                <Stack spacing={0.75}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Progress</Typography>
                    <Tooltip title={canLog ? "Start logging an interaction" : "Waiting for eligible call…"}>
                      <span>
                        <Button size="small" variant="contained" onClick={() => setMode("log")} disabled={!canLog} sx={{ borderRadius: 1 }}>
                          Log Interaction
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                  <Box sx={{ maxWidth: 220 }}>
                    <LinearProgress variant="determinate" value={Number(progressPct) || 0} sx={{ height: 6, borderRadius: 1 }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{progressPct}% of daily target</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT: last 6 calls */}
          <Grid item xs={12} md={9} sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
            <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1, flex: 1, display: "flex", flexDirection: "column", minHeight: LOGS_PANEL_MINHEIGHT, overflow: "hidden" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Last 6 Calls — Latest Interaction per Call</Typography>
                <Typography variant="caption" color="text.secondary">{recentSummaries.length} shown</Typography>
              </Stack>

              {recentSummaries.length > 0 ? (
                <List dense sx={{ py: 0, flex: 1, overflow: "hidden" }}>
                  {recentSummaries.map(({ callKey: k, latest, count, startedAt }, idx) => {
                    const meta = callMeta[k] || {};
                    return (
                      <ListItem
                        key={k || `call-${idx}`}
                        secondaryAction={
                          latest ? (
                            <Stack direction="row" spacing={0.5}>
                              <Tooltip title="Copy Interaction ID">
                                <IconButton edge="end" onClick={() => copyToClipboard(latest.id)} size="small" sx={{ borderRadius: 1 }}>
                                  <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Interaction">
                                <IconButton edge="end" size="small" onClick={() => { setEditing(latest); setMode("edit"); }} sx={{ borderRadius: 1 }}>
                                  <EditIcon fontSize="inherit" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          ) : null
                        }
                        sx={{ px: 0.5, borderRadius: 1 }}
                      >
                        <ListItemText
                          primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>{`#${idx + 1} — ${meta.name || "Unknown"} (${meta.dialedNumber || "—"})`}</Typography>}
                          secondary={
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {startedAt ? `Call: ${startedAt.toLocaleString()}` : "Call time unavailable"}
                              {` • Call ID: ${k || "—"}`}
                              {latest?.id ? ` • Interaction ID: ${latest.id}` : " • No interaction yet"}
                              {` • Logged: ${count || 0}`}
                              {latest?.formSchemaTitle ? ` • Form: ${latest.formSchemaTitle}` : ""}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" color="text.secondary">No recent calls tracked yet.</Typography>
                </Box>
              )}


            </Paper>
          </Grid> 
        </Grid>
      ) : (
        <Box>
          {/* InteractionForm now owns the contact card & action buttons */}
          <InteractionForm
            contact={client}
            priorCount={lastInteractions.filter((i) => (i.callKey || "no-call") === (callKey || "no-call")).length}
           
            fetchAdminForm={fetchAdminForm}
            onCancel={() => { setEditing(null); setMode("dashboard"); }}
            onSubmit={(payload) => {
              const id = payload.id || `ixn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
              const record = { id, callKey, ...payload, createdAt: payload.id ? undefined : new Date().toISOString() };
              try { onLogInteraction?.(record); } catch { }
              addOrUpdateInteraction(record);
              setEditing(null);
              setMode("dashboard");
            }}
            initial={mode === "edit" ? editing : undefined}
          />
        </Box>
      )}
    </Box>
  );
}
