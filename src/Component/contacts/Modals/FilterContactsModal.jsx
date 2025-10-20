import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Stack, TextField, Chip, Typography, Divider, Grid,
  Checkbox, FormControlLabel, MenuItem
} from "@mui/material";
import { Filter as FilterIcon, X as CloseIcon } from "lucide-react";


const PREF_CHANNEL_OPTS = ["Email", "SMS", "WhatsApp", "Calls"];

export default function FilterContactsModal({ open, onClose, initialFilters = {}, onApply }) {
  // Basics
  const [source, setSource] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  // Contact & preferences
  const [languagesStr, setLanguagesStr] = useState("");
  const [preferredChannel, setPreferredChannel] = useState("");
  const [optEmail, setOptEmail] = useState(false);
  const [optSms, setOptSms] = useState(false);
  const [optWhatsapp, setOptWhatsapp] = useState(false);
  const [optCalls, setOptCalls] = useState(false);

  // Location & time
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [joinedFrom, setJoinedFrom] = useState("");
  const [joinedTo, setJoinedTo] = useState("");
  const [lastActiveFrom, setLastActiveFrom] = useState("");
  const [lastActiveTo, setLastActiveTo] = useState("");

  // Devices & services
  const [deviceMostUsed, setDeviceMostUsed] = useState("");
  const [devicesStr, setDevicesStr] = useState("");
  const [serviceMostUsed, setServiceMostUsed] = useState("");
  const [servicesStr, setServicesStr] = useState("");



  // Metrics / engagement
  const [csatMin, setCsatMin] = useState("");
  const [npsMin, setNpsMin] = useState("");
  const [engagementScoreMin, setEngagementScoreMin] = useState("");
  const [appointmentsMissedMin, setAppointmentsMissedMin] = useState("");
  const [casesCountMin, setCasesCountMin] = useState("");

  // Attributes key/value contains
  const [attrKey, setAttrKey] = useState("");
  const [attrVal, setAttrVal] = useState("");

  // Hydrate from initialFilters when opened
  useEffect(() => {
    if (!open) return;

    setSource(initialFilters.source || initialFilters.acquisition || "");
    setTagsStr(Array.isArray(initialFilters.tags) ? initialFilters.tags.join(", ") : "");

    setLanguagesStr(
      Array.isArray(initialFilters.languages) ? initialFilters.languages.join(", ") : ""
    );
    setPreferredChannel(initialFilters.preferredChannel || "");

    setOptEmail(!!initialFilters?.optIn?.email);
    setOptSms(!!initialFilters?.optIn?.sms);
    setOptWhatsapp(!!initialFilters?.optIn?.whatsapp);
    setOptCalls(!!initialFilters?.optIn?.calls);

    setRegion(initialFilters?.location?.region || "");
    setCountry(initialFilters?.location?.country || "");

    setJoinedFrom(initialFilters?.joinedAt?.from || "");
    setJoinedTo(initialFilters?.joinedAt?.to || "");
    setLastActiveFrom(initialFilters?.lastActiveAt?.from || "");
    setLastActiveTo(initialFilters?.lastActiveAt?.to || "");

    setDeviceMostUsed(initialFilters?.devices?.mostUsed || "");
    setDevicesStr(
      Array.isArray(initialFilters?.devices?.includes)
        ? initialFilters.devices.includes.join(", ")
        : ""
    );

    setServiceMostUsed(initialFilters?.services?.mostUsed || "");
    setServicesStr(
      Array.isArray(initialFilters?.services?.includes)
        ? initialFilters.services.includes.join(", ")
        : ""
    );



    setCsatMin(initialFilters?.csatMin ?? "");
    setNpsMin(initialFilters?.npsMin ?? "");
    setEngagementScoreMin(initialFilters?.engagementScoreMin ?? "");
    setAppointmentsMissedMin(initialFilters?.appointmentsMissedMin ?? "");
    setCasesCountMin(initialFilters?.casesCountMin ?? "");

    setAttrKey(initialFilters?.attributes?.key || "");
    setAttrVal(initialFilters?.attributes?.value || "");
  }, [open, initialFilters]);

  // Helpers
  const toList = (s) => s.split(",").map(v => v.trim()).filter(Boolean);
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  const tagChips = useMemo(() => toList(tagsStr), [tagsStr]);
  const langChips = useMemo(() => toList(languagesStr), [languagesStr]);
  const deviceChips = useMemo(() => toList(devicesStr), [devicesStr]);
  const serviceChips = useMemo(() => toList(servicesStr), [servicesStr]);

  const handleApply = () => {
    const filters = {};

    if (source.trim()) {
      filters.source = source.trim();          // backward-compat with earlier "source"
      filters.acquisition = source.trim();     // explicit name matching drawer
    }

    const tags = toList(tagsStr);
    if (tags.length) filters.tags = tags;

    const langs = toList(languagesStr);
    if (langs.length) filters.languages = langs;

    if (preferredChannel.trim()) filters.preferredChannel = preferredChannel.trim();

    const optIn = {};
    if (optEmail) optIn.email = true;
    if (optSms) optIn.sms = true;
    if (optWhatsapp) optIn.whatsapp = true;
    if (optCalls) optIn.calls = true;
    if (Object.keys(optIn).length) filters.optIn = optIn;

    const loc = {};
    if (region.trim()) loc.region = region.trim();
    if (country.trim()) loc.country = country.trim();
    if (Object.keys(loc).length) filters.location = loc;


    const devIncludes = toList(devicesStr);
    const dev = {};
    if (devIncludes.length) dev.includes = devIncludes;
    if (deviceMostUsed.trim()) dev.mostUsed = deviceMostUsed.trim();
    if (Object.keys(dev).length) filters.devices = dev;

    const svcIncludes = toList(servicesStr);
    const svc = {};
    if (svcIncludes.length) svc.includes = svcIncludes;
    if (serviceMostUsed.trim()) svc.mostUsed = serviceMostUsed.trim();
    if (Object.keys(svc).length) filters.services = svc;





    const joined = {};
    if (joinedFrom) joined.from = joinedFrom;
    if (joinedTo) joined.to = joinedTo;
    if (Object.keys(joined).length) filters.joinedAt = joined;

    const lastAct = {};
    if (lastActiveFrom) lastAct.from = lastActiveFrom;
    if (lastActiveTo) lastAct.to = lastActiveTo;
    if (Object.keys(lastAct).length) filters.lastActiveAt = lastAct;


    if (attrKey.trim() || attrVal.trim()) {
      filters.attributes = {};
      if (attrKey.trim()) filters.attributes.key = attrKey.trim();
      if (attrVal.trim()) filters.attributes.value = attrVal.trim();
    }

    const apMin = toNum(appointmentsMissedMin);
    if (apMin != null) filters.appointmentsMissedMin = apMin;
    const ccMin = toNum(casesCountMin);
    if (ccMin != null) filters.casesCountMin = ccMin;

    onApply?.(filters);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Filter contacts</DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Filters apply to both DB and uploaded tabs. Add more rules as needed.
        </Typography>

        {/* 1) Basic */}
        <Stack spacing={1.25} sx={{ mb: 2 }}>
          <Grid container spacing={1.25}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                fullWidth
                label="Acquisition source equals"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Referral"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                fullWidth
                label="Tags include (comma-separated)"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="VIP, Gold"
              />
            </Grid>
            {tagChips.length ? (
              <Grid item xs={12}>
                <Stack direction="row" flexWrap="wrap" className="gap-1">
                  {tagChips.map((t, i) => (
                    <Chip key={`tag-${t}-${i}`} size="small" label={t} variant="outlined" />
                  ))}
                </Stack>
              </Grid>
            ) : null}
          </Grid>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* 2) Contact & Preferences */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Contact & Preferences</Typography>
        <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              fullWidth
              label="Languages (comma-separated)"
              value={languagesStr}
              onChange={(e) => setLanguagesStr(e.target.value)}
              placeholder="English, Swahili"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              select
              fullWidth
              label="Preferred channel"
              value={preferredChannel}
              onChange={(e) => setPreferredChannel(e.target.value)}
            >
              <MenuItem value=""><em>Any</em></MenuItem>
              {PREF_CHANNEL_OPTS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </Grid>
          {langChips.length ? (
            <Grid item xs={12}>
              <Stack direction="row" flexWrap="wrap" className="gap-1">
                {langChips.map((t, i) => (
                  <Chip key={`lang-${t}-${i}`} size="small" label={t} variant="outlined" />
                ))}
              </Stack>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Checkbox checked={optEmail} onChange={(e) => setOptEmail(e.target.checked)} />} label="Require Email opt-in" />
              <FormControlLabel control={<Checkbox checked={optSms} onChange={(e) => setOptSms(e.target.checked)} />} label="Require SMS opt-in" />
              <FormControlLabel control={<Checkbox checked={optWhatsapp} onChange={(e) => setOptWhatsapp(e.target.checked)} />} label="Require WhatsApp opt-in" />
              <FormControlLabel control={<Checkbox checked={optCalls} onChange={(e) => setOptCalls(e.target.checked)} />} label="Require Calls opt-in" />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 3) Location & Time */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Location & Time</Typography>
        <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={4}><TextField size="small" fullWidth label="Region/State/City" value={region} onChange={(e) => setRegion(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}><TextField size="small" fullWidth label="Country" value={country} onChange={(e) => setCountry(e.target.value)} /></Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Joined from"
              type="date"
              value={joinedFrom}
              onChange={(e) => setJoinedFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Joined to"
              type="date"
              value={joinedTo}
              onChange={(e) => setJoinedTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Last active from"
              type="date"
              value={lastActiveFrom}
              onChange={(e) => setLastActiveFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              size="small"
              fullWidth
              label="Last active to"
              type="date"
              value={lastActiveTo}
              onChange={(e) => setLastActiveTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 4) Devices & Services */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Devices & Services</Typography>
        <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Devices include (comma-separated)" value={devicesStr} onChange={(e) => setDevicesStr(e.target.value)} placeholder="iPhone, Android" /></Grid>
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Most used device" value={deviceMostUsed} onChange={(e) => setDeviceMostUsed(e.target.value)} placeholder="Android" /></Grid>
          {deviceChips.length ? (
            <Grid item xs={12}>
              <Stack direction="row" flexWrap="wrap" className="gap-1">
                {deviceChips.map((t, i) => <Chip key={`dev-${t}-${i}`} size="small" label={t} variant="outlined" />)}
              </Stack>
            </Grid>
          ) : null}
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Services include (comma-separated)" value={servicesStr} onChange={(e) => setServicesStr(e.target.value)} placeholder="Billing, Support" /></Grid>
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Most used service" value={serviceMostUsed} onChange={(e) => setServiceMostUsed(e.target.value)} placeholder="Support" /></Grid>
          {serviceChips.length ? (
            <Grid item xs={12}>
              <Stack direction="row" flexWrap="wrap" className="gap-1">
                {serviceChips.map((t, i) => <Chip key={`svc-${t}-${i}`} size="small" label={t} variant="outlined" />)}
              </Stack>
            </Grid>
          ) : null}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 6) Metrics & Engagement */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Metrics & Engagement</Typography>
        <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
          <Grid item xs={6} md={3}><TextField size="small" fullWidth label="CSAT min" type="number" value={csatMin} onChange={(e) => setCsatMin(e.target.value)} inputProps={{ min: 0, max: 5, step: 0.1 }} /></Grid>
          <Grid item xs={6} md={3}><TextField size="small" fullWidth label="NPS min" type="number" value={npsMin} onChange={(e) => setNpsMin(e.target.value)} inputProps={{ min: -100, max: 100 }} /></Grid>
          <Grid item xs={6} md={3}><TextField size="small" fullWidth label="Engagement score min" type="number" value={engagementScoreMin} onChange={(e) => setEngagementScoreMin(e.target.value)} inputProps={{ min: 0, max: 100 }} /></Grid>
          <Grid item xs={6} md={3}><TextField size="small" fullWidth label="Appointments missed ≥" type="number" value={appointmentsMissedMin} onChange={(e) => setAppointmentsMissedMin(e.target.value)} inputProps={{ min: 0 }} /></Grid>
          <Grid item xs={6} md={3}><TextField size="small" fullWidth label="Cases count ≥" type="number" value={casesCountMin} onChange={(e) => setCasesCountMin(e.target.value)} inputProps={{ min: 0 }} /></Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* 7) Attributes contains */}
        <Typography variant="overline" sx={{ letterSpacing: 0.4 }}>Attributes</Typography>
        <Grid container spacing={1.25} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Attribute key contains" value={attrKey} onChange={(e) => setAttrKey(e.target.value)} placeholder="e.g., plan" /></Grid>
          <Grid item xs={12} md={6}><TextField size="small" fullWidth label="Attribute value contains" value={attrVal} onChange={(e) => setAttrVal(e.target.value)} placeholder="e.g., Pro" /></Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button startIcon={<CloseIcon size={16} />} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" startIcon={<FilterIcon size={16} />} onClick={handleApply}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
