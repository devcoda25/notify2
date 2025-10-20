import React from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Tab,
  Button,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  Search,
  Plus,
  Mail,
  MonitorSmartphone,
  Bell,
  MessageSquare,
  MessageCircle,
  LayoutGrid,
} from "lucide-react";

import CHANNELS from "../constants/CHANNELS";
import TEMPLATE_TYPES from "../constants/TEMPLATE_TYPES";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

/* ---------------- helpers for YYYY-MM-DD <-> Date ---------------- */
function toDateOrNull(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function fmtYmd(date) {
  if (!date || isNaN(date.getTime?.())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* ---------------- inline Channel Tabs (no import) ---------------- */
const TAB_ICONS = {
  email: Mail,
  platform: MonitorSmartphone,
  push: Bell,
  sms: MessageSquare,
  whatsapp: MessageCircle,
  all: LayoutGrid,
};

/**
 * Reusable Top Nav for template views.
 * Adds optional props to tailor Status filter label and menu options.
 */
export default function TemplatesTopNav({
  /* Tabs row */
  showTabs = true,
  tabValue = "all",
  onTabChange,
  showAllTabs = true,
  onCreateTemplate,
  createLabel = "Create Template",
  hideCreateButton = false,

  /* Filters */
  query,
  onQueryChange,
  typeValue = "all",
  onTypeChange,
  statusValue = "all",
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,

  /* View mode */
  mode = "table",
  onModeChange,

  /* NEW: provider-centric customization */
  statusLabel = "Status",
  statusMenuItems, // optional array of values; when absent we use APPROVAL_STATES
}) {
  const theme = useTheme();

  const tabs = React.useMemo(
    () => (showAllTabs ? [{ id: "all", label: "All" }, ...CHANNELS] : CHANNELS),
    [showAllTabs]
  );
  const tabIndex = Math.max(0, tabs.findIndex((c) => c.id === tabValue));

  const fromDate = React.useMemo(() => toDateOrNull(dateFrom), [dateFrom]);
  const toDateObj = React.useMemo(() => toDateOrNull(dateTo), [dateTo]);

  // Build status options
  const defaultStatuses = React.useMemo(() => Object.values(APPROVAL_STATES), []);
  const options = statusMenuItems && Array.isArray(statusMenuItems) && statusMenuItems.length
    ? statusMenuItems
    : ["all", ...defaultStatuses];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {showTabs && (
        <Box
          sx={{
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Tabs
              value={tabIndex}
              onChange={(_, i) => onTabChange?.(tabs[i]?.id)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40 } }}
            >
              {tabs.map((c) => {
                const Icon = TAB_ICONS[c.id] || MonitorSmartphone;
                return (
                  <Tab
                    key={c.id}
                    icon={<Icon size={15} />}
                    iconPosition="start"
                    label={c.label}
                    disableRipple
                  />
                );
              })}
            </Tabs>
          </Box>

          {!hideCreateButton && (
            <Tooltip title="Create a new template draft">
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => onCreateTemplate?.()}
                >
                  {createLabel}
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Filters bar */}
      <Paper
        variant="outlined"
        sx={{ p: 1.5, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search templates by name or ID…"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          sx={{
            minWidth: { xs: "100%", md: 300 },
            flexGrow: 1,
            "& .MuiOutlinedInput-root": { backgroundColor: alpha(theme.palette.primary.main, 0.03) },
          }}
          InputProps={{
            startAdornment: (
              <Box component="span" sx={{ mr: 1, display: "inline-flex" }}>
                <Search size={16} />
              </Box>
            ),
            autoComplete: "off",
          }}
        />

        {/* Type */}
        <TextField
          size="small"
          select
          label="Type"
          value={typeValue}
          onChange={(e) => onTypeChange?.(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          {Object.values(TEMPLATE_TYPES).map((tt) => (
            <MenuItem key={tt.id} value={tt.id}>{tt.label}</MenuItem>
          ))}
        </TextField>

        {/* Status (supports custom label and menu) */}
        <TextField
          size="small"
          select
          label={statusLabel}
          value={statusValue}
          onChange={(e) => onStatusChange?.(e.target.value)}
          sx={{ minWidth: 170 }}
        >
          {options.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        {/* Dates */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Updated from"
            value={fromDate}
            onChange={(v) => onDateFromChange?.(v ? fmtYmd(v) : "")}
            slotProps={{ textField: { size: "small", sx: { minWidth: 170 } } }}
            disableFuture
            views={["year", "month", "day"]}
          />
          <DatePicker
            label="to"
            value={toDateObj}
            onChange={(v) => onDateToChange?.(v ? fmtYmd(v) : "")}
            slotProps={{ textField: { size: "small", sx: { minWidth: 150 } } }}
            disableFuture
            views={["year", "month", "day"]}
          />
        </LocalizationProvider>

        <Box sx={{ flexGrow: 1 }} />

        {/* Mode toggle */}
        <ToggleButtonGroup
          size="small"
          value={mode}
          exclusive
          onChange={(_, v) => v && onModeChange?.(v)}
        >
          <ToggleButton value="table">Table</ToggleButton>
          <ToggleButton value="cards">Cards</ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </Box>
  );
}
