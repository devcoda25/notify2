// Path: /src/Component/Meetings/views/Focus/SpecialMeetingsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Star } from "lucide-react";
import MeetingTable from "../../components/MeetingTable";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

/**
 * Heuristics for "special" meetings:
 *  - Event type name/slug contains "VIP" or "Executive" (case-insensitive), OR
 *  - Invitee email domain is on a VIP allowlist, OR
 *  - Notes contains "[VIP]" or "[PRIORITY]"
 */
const VIP_DOMAINS = ["bigco.com", "fortune100.example", "gov.ug"];

function isSpecial(m) {
  const name = String(m.eventTypeId || "").toLowerCase();
  const notes = String(m.notes || "").toLowerCase();
  const email = String(m.invitee?.email || "").toLowerCase();
  const domain = email.split("@")[1] || "";
  return (
    name.includes("vip") ||
    name.includes("executive") ||
    notes.includes("[vip]") ||
    notes.includes("[priority]") ||
    VIP_DOMAINS.includes(domain)
  );
}

export default function SpecialMeetingsView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const [scope, setScope] = useState("upcoming"); // upcoming | past | all
  const [onlyHighDuration, setOnlyHighDuration] = useState(false);

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures();
  }, [mtg]);

  const rows = useMemo(() => {
    const now = Date.now();
    const filtered = (mtg.meetings || []).filter((m) => {
      const t = new Date(m.start).getTime();
      if (scope === "upcoming" && t < now) return false;
      if (scope === "past" && t >= now) return false;
      return isSpecial(m);
    });
    if (!onlyHighDuration) return filtered;
    const withDur = filtered.filter((m) => {
      const dur = (new Date(m.end).getTime() - new Date(m.start).getTime()) / 60000;
      return dur >= 45;
    });
    return withDur;
  }, [mtg.meetings, scope, onlyHighDuration]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Stack direction="row" gap={1} alignItems="center">
          <Star size={16} />
          <Typography variant="h6">Special Meetings</Typography>
          <Chip
            size="small"
            label={`${rows.length} item${rows.length === 1 ? "" : "s"}`}
            sx={{ ml: 1, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main" }}
          />
        </Stack>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <TextField
            select
            size="small"
            label="Scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="past">Past</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Filter"
            value={onlyHighDuration ? "long" : "any"}
            onChange={(e) => setOnlyHighDuration(e.target.value === "long")}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="any">Any length</MenuItem>
            <MenuItem value="long">≥ 45 min</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Divider />

      <Paper
        variant="outlined"
        sx={{
          p: 1,
          borderRadius: 2,
          borderColor: (t) => alpha(t.palette.primary.main, 0.25),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
        }}
      >
        <MeetingTable
          meetings={rows}
          onJoin={(m) => window.open(m.location?.link || "#", "_blank")}
          onCancel={() => {}}
          onOpen={(m) => console.info("Open special meeting", m)}
        />
      </Paper>
    </Stack>
  );
}
