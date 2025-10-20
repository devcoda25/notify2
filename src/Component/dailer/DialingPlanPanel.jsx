// /src/Component/DialingPlanPanel.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box, Tabs, Tab, Divider, Stack, Typography, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItemButton, ListItemText, ListItemSecondaryAction, Switch, Chip
} from "@mui/material";
import EngagementOverview from "./dialingPlan/EngagementOverview";
import CRMPanel from "./dialingPlan/CRMPanel";
import ScriptPanel from "./dialingPlan/ScriptPanel";
import QualityAssurance from "./dialingPlan/QualityAssurance";
import EscalationPanel from "./dialingPlan/EscalationPanel";

let useDialerStoreSafe = () => ({ dialingPlan: null });
try {
  // optional import – won’t crash if path changes during early wiring
  // eslint-disable-next-line global-require, import/no-unresolved
  const { useDialerStore } = require("./store/useDialerStore");
  useDialerStoreSafe = useDialerStore;
} catch { }

/* ---------------- helpers ---------------- */
function formatDuration(ms = 0) {
  const sTotal = Math.floor(ms / 1000);
  const h = String(Math.floor(sTotal / 3600)).padStart(2, "0");
  const m = String(Math.floor((sTotal % 3600) / 60)).padStart(2, "0");
  const s = String(sTotal % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* default list (10) — can be overridden by props.campaigns */
const DEFAULT_CAMPAIGNS = [
  { id: "cmp-100", name: "Spring Promo", active: true },
  { id: "cmp-101", name: "Fiber Upgrade", active: false },
  { id: "cmp-102", name: "Winback 2025", active: false },
  { id: "cmp-103", name: "SME Onboarding", active: true },
  { id: "cmp-104", name: "Churn Save Pilot", active: false },
  { id: "cmp-105", name: "Device Trade-in", active: true },
  { id: "cmp-106", name: "Premium Upsell", active: false },
  { id: "cmp-107", name: "NPS Follow-up", active: true },
  { id: "cmp-108", name: "Holiday Bundles", active: false },
  { id: "cmp-109", name: "Reactivation Push", active: false },
];

function TabPanel({ value, index, children }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 2 }}>
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function DialingPlanPanel(props) {
  const [tab, setTab] = useState(0);
  const storePlan = useDialerStoreSafe((s) => s?.dialingPlan);
  const plan = useMemo(() => ({ ...storePlan, ...props }), [storePlan, props]);

  /* ---- Campaigns state ---- */
  const campaigns = useMemo(
    () =>
      (Array.isArray(props.campaigns) && props.campaigns.length
        ? props.campaigns
        : DEFAULT_CAMPAIGNS
      ).map((c) => ({ ...c, active: !!c.active })),
    [props.campaigns]
  );

  const [selectedId, setSelectedId] = useState(() => plan?.campaign?.id || null);
  const [activeById, setActiveById] = useState(() => {
    const init = {};
    for (const c of campaigns) init[c.id] = !!c.active;
    if (plan?.campaign?.id) init[plan.campaign.id] = !!plan.campaign.active;
    return init;
  });
  const [durations, setDurations] = useState({}); // { [id]: ms }
  const startedAtRef = useRef(null);              // timestamp when current started ticking

  const selected = useMemo(
    () => campaigns.find((c) => c.id === selectedId) || null,
    [campaigns, selectedId]
  );
  const isActive = !!(selected && activeById[selected.id]);
  const currentDuration = useMemo(
    () =>
      (durations[selected?.id || ""] || 0) +
      (isActive && startedAtRef.current ? Date.now() - startedAtRef.current : 0),
    [durations, selected?.id, isActive]
  );

  // start/stop timer when selection or active state changes
  useEffect(() => {
    // stop previous
    if (startedAtRef.current && (!selected || !isActive)) {
      setDurations((d) => {
        const id = selectedId;
        if (!id) return d;
        const prev = d[id] || 0;
        const add = Date.now() - startedAtRef.current;
        return { ...d, [id]: prev + add };
      });
      startedAtRef.current = null;
    }

    // start new if active
    if (selected && isActive && !startedAtRef.current) {
      startedAtRef.current = Date.now();
    }
    // cleanup flush on unmount
    return () => {
      if (startedAtRef.current) {
        const id = selectedId;
        setDurations((d) => {
          const prev = d[id] || 0;
          const add = Date.now() - startedAtRef.current;
          return { ...d, [id]: prev + add };
        });
        startedAtRef.current = null;
      }
    };
  }, [selectedId, selected, isActive]);

  // tick every second so UI updates HH:MM:SS
  useEffect(() => {
    const t = setInterval(() => {
      if (startedAtRef.current && selectedId && isActive) {
        // trigger re-render by touching durations (no-op mutate pattern avoided)
        setDurations((d) => ({ ...d }));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [selectedId, isActive]);

  /* ---- Picker dialog ---- */
  const [pickerOpen, setPickerOpen] = useState(false);
  const openPicker = () => setPickerOpen(true);
  const closePicker = () => setPickerOpen(false);

  const handlePick = (id) => {
    if (id === selectedId) return;
    // flush time on old selection
    if (startedAtRef.current && selectedId) {
      setDurations((d) => {
        const prev = d[selectedId] || 0;
        const add = Date.now() - startedAtRef.current;
        return { ...d, [selectedId]: prev + add };
      });
      startedAtRef.current = null;
    }
    setSelectedId(id);
    // if new is active, start ticking immediately
    if (activeById[id]) {
      startedAtRef.current = Date.now();
    }
  };

  const handleToggleActive = (id) => {
    setActiveById((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <Box sx={{ mt: 1, borderRadius: 1, border: (t) => `1px solid ${t.palette.divider}`, overflow: "hidden" }}>
      {/* Sticky header */}
      <Box sx={{ position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>CRM Portal</Typography>

          {/* ---- Campaign status block ---- */}
          {selected ? (
            <Stack direction="row" spacing={1.25} alignItems="center">
              {/* 1) Active indicator */}
              <Box
                sx={{
                  width: 10, height: 10, borderRadius: "50%",
                  bgcolor: isActive ? "success.main" : "text.disabled",
                }}
              />
              {/* 2) Live duration */}
              <Chip
                size="small"
                label={formatDuration(currentDuration)}
                sx={{ borderRadius: 1 }}
              />
              {/* 3) Clickable name (opens picker) */}
              <Button onClick={openPicker} size="small" sx={{ textTransform: "none", borderRadius: 1 }}>
                {selected.name}
              </Button>
            </Stack>
          ) : (
            // 4) No campaign selected
            <Button onClick={openPicker} size="small" variant="outlined" sx={{ borderRadius: 1 }}>
              No Campaign Selected
            </Button>
          )}
        </Stack>

        <Divider />
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1, "& .MuiTab-root": { textTransform: "none", minHeight: 44 } }}
        >

          <Tab label="Script" />
          <Tab label="Interactions" />
          <Tab label="Escalation" />
        </Tabs>
        <Divider />
      </Box>

      {/* Panels */}
      <Box sx={{ p: 2 }}>

        <TabPanel value={tab} index={0}>
          <ScriptPanel data={plan?.script} />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <CRMPanel data={plan?.Interactions || plan?.contribution} />
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <EscalationPanel data={plan?.escalation} />
        </TabPanel>
      </Box>

      {/* ---- Campaign Picker Dialog ---- */}
      <Dialog open={pickerOpen} onClose={closePicker} maxWidth="sm" fullWidth>
        <DialogTitle>Select Campaign</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {campaigns.map((c) => {
              const active = !!activeById[c.id];
              const dur = durations[c.id] || 0;
              const isSel = c.id === selectedId;
              return (
                <ListItemButton
                  key={c.id}
                  selected={isSel}
                  onClick={() => handlePick(c.id)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: "50%",
                            bgcolor: active ? "success.main" : "text.disabled",
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: isSel ? 700 : 500 }}>
                          {c.name}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Time on campaign: {formatDuration(dur + (isSel && active && startedAtRef.current ? Date.now() - startedAtRef.current : 0))}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary">Active</Typography>
                      <Switch
                        edge="end"
                        size="small"
                        checked={active}
                        onChange={() => handleToggleActive(c.id)}
                      />
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePicker} variant="contained" sx={{ borderRadius: 1 }}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
