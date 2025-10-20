import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Box,
  Select,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { PlayCircle, Download, RefreshCcw, ExternalLink } from "lucide-react";

import RecordingPlayer from "../../components/RecordingPlayer";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";

const TABLE_MAX_HEIGHT = 560; // 🔧 tweak scrollable table height here

export default function RecordingsView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();
  const [scope, setScope] = useState("last_30d"); // last_7d | last_30d | all
  const [q, setQ] = useState("");
  const [playing, setPlaying] = useState(null); // meetingId

  // pagination (TemplatesTable style)
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  useEffect(() => { mtg.loaded || mtg.loadFixtures(); }, [mtg]);

  const rowsAll = useMemo(() => {
    const recMap = mtg.recordings || {};
    const list = (mtg.meetings || [])
      .filter((m) => recMap[m.id]?.url)
      .map((m) => ({ m, rec: recMap[m.id] }));
    const now = Date.now();
    const minTime = scope === "last_7d" ? now - 7 * 864e5 : scope === "last_30d" ? now - 30 * 864e5 : 0;
    const filtered = list.filter(({ m }) => new Date(m.end).getTime() >= minTime);
    const qq = q.trim().toLowerCase();
    if (!qq) return filtered;
    return filtered.filter(({ m }) =>
      [m.invitee?.name, m.invitee?.email, m.eventTypeId, m.id].join(" ").toLowerCase().includes(qq)
    );
  }, [mtg.meetings, mtg.recordings, scope, q]);

  // pagination math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, rpp)));
  const safePage = Math.min(page, pages - 1);
  const start = safePage * rpp;
  const rows = rowsAll.slice(start, start + rpp);
  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(total, start + rpp);

  useEffect(() => setPage(0), [scope, q, rpp, total]);

  const download = (url) => {
    window.open(url, "_blank", "noopener,noreferrer"); // mock
  };

  const refresh = () => {
    // placeholder for provider status refresh
  };

  const currentUrl = playing ? mtg.recordings?.[playing]?.url : "";

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Recordings</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            size="small"
            label={`Items: ${rowsAll.length}`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
          />
          <TextField size="small" label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <TextField size="small" select label="Scope" value={scope} onChange={(e) => setScope(e.target.value)}>
            <MenuItem value="last_7d">Last 7 days</MenuItem>
            <MenuItem value="last_30d">Last 30 days</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </TextField>
          <Button startIcon={<RefreshCcw />} onClick={refresh}>
            Refresh
          </Button>
        </Stack>
      </Stack>
      <Divider />

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          borderColor: (t) => alpha(t.palette.primary.main, 0.25),
          bgcolor: (t) => alpha(t.palette.primary.main, 0.02),
        }}
      >
        <TableContainer
          sx={{
            maxHeight: TABLE_MAX_HEIGHT,
            "& .MuiTableCell-head": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>When (UTC)</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Recording</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ m, rec }) => (
                <TableRow key={m.id} hover selected={playing === m.id}>
                  <TableCell>{m.start} → {m.end}</TableCell>
                  <TableCell>
                    {m.invitee?.name}{" "}
                    <Chip size="small" label={m.invitee?.email} sx={{ ml: 0.5 }} />
                  </TableCell>
                  <TableCell>{m.eventTypeId}</TableCell>
                  <TableCell>
                    <Chip size="small" color="success" label="Ready" />
                    <Chip size="small" label={new Date(rec.readyAt).toLocaleString()} sx={{ ml: 0.5 }} />
                  </TableCell>
                  <TableCell align="right" sx={{ minWidth: 180 }}>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={0.75} useFlexGap>
                      <Tooltip title="Play">
                        <IconButton size="small" onClick={() => setPlaying(m.id)}>
                          <PlayCircle size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open">
                        <IconButton size="small" onClick={() => window.open(rec.url, "_blank", "noopener,noreferrer")}>
                          <ExternalLink size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small" onClick={() => download(rec.url)}>
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!total && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography align="center">No recordings</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer (TemplatesTable-style) */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1,
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.015),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {total ? `Showing ${from}–${to} of ${total}` : "No results"}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={rpp}
                onChange={(e) => setRpp(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {rppOptions.map((n) => (
                  <MenuItem key={n} value={n}>{n} / page</MenuItem>
                ))}
              </Select>
            </Box>

            <Pagination
              color="primary"
              count={pages}
              page={Math.min(safePage + 1, pages)}
              onChange={(_, v) => setPage(v - 1)}
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
              disabled={pages <= 1}
            />
          </Stack>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <RecordingPlayer url={currentUrl} onDownload={download} />
      </Paper>
    </Stack>
  );
}
