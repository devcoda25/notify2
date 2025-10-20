// Path: /src/Component/Meetings/views/Focus/FollowUpsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  TableContainer,
  Box,
  Select,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { RotateCcw, UserX, MessageSquare } from "lucide-react";

import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";
import * as notify from "../../mocks/adapters/notifications.mock";

/**
 * Follow-ups surface:
 *  - No-shows: meetings that ended but no `attendance[meetingId]?.joinedAt`.
 *  - Rebooks: meetings cancelled or explicitly flagged (status === 'cancelled').
 *  - Post-call: meetings that ended and where we want to send recap (always eligible).
 */
function classify(m, attendance) {
  const now = Date.now();
  const en = new Date(m.end).getTime();
  const att = attendance?.[m.id];
  const ended = en < now;
  if (!ended) return null;
  const joined = !!att?.joinedAt;
  if (!joined && m.status !== "cancelled") return "no_show";
  if (m.status === "cancelled") return "rebook";
  return "post_call";
}

export default function FollowUpsView() {
  const theme = useTheme();
  const mtg = useMeetingsStore();

  const [scope, setScope] = useState("last_30d"); // last_7d | last_30d | all
  const [toast, setToast] = useState(null);

  // pagination (TemplatesTable style)
  const [page, setPage] = useState(0);     // 0-based
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    mtg.loaded || mtg.loadFixtures();
  }, [mtg]);

  const rowsAll = useMemo(() => {
    const meetings = mtg.meetings || [];
    const now = Date.now();
    const startCut =
      scope === "last_7d" ? now - 7 * 864e5 : scope === "last_30d" ? now - 30 * 864e5 : 0;

    return meetings
      .filter((m) => new Date(m.end).getTime() >= startCut)
      .map((m) => ({ m, cls: classify(m, mtg.attendance || {}) }))
      .filter((x) => !!x.cls)
      .sort((a, b) => new Date(b.m.end) - new Date(a.m.end));
  }, [mtg.meetings, mtg.attendance, scope]);

  const counts = useMemo(() => {
    return rowsAll.reduce(
      (acc, r) => {
        acc.total += 1;
        acc[r.cls] += 1;
        return acc;
      },
      { total: 0, no_show: 0, rebook: 0, post_call: 0 }
    );
  }, [rowsAll]);

  // ----- pagination math (same pattern as TemplatesTable) -----
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  const start = safePage * pageSize;
  const pageRows = useMemo(() => rowsAll.slice(start, start + pageSize), [rowsAll, start, pageSize]);

  // Reset to first page if dataset or page size changes
  useEffect(() => setPage(0), [rowsAll.length, pageSize]);

  const sendFollowUp = async (m, type) => {
    const invitee = m.invitee?.email;
    if (!invitee) return;
    const res = await notify.sendEmail({
      to: invitee,
      subject:
        type === "no_show"
          ? "We missed you — reschedule?"
          : type === "rebook"
          ? "Let's find a new time"
          : "Thanks for the call — recap",
      text:
        type === "no_show"
          ? `We noticed you couldn't make it. Pick another time: ${m.rescheduleUrl}`
          : type === "rebook"
          ? `Your meeting was cancelled. Book a new slot here: ${m.rescheduleUrl}`
          : `Thanks for meeting! If you'd like to revisit anything, reply to this email.`,
      templateId: `followup_${type}`,
      vars: { meetingId: m.id },
    });
    setToast({ sev: "success", msg: `Follow-up sent (id ${res.providerMessageId})` });
  };

  const totalColumns = 5; // When, Invitee, Type, Reason, Actions

  return (
    <Stack gap={2}>
      {/* ---- Card ---- */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header (toolbar style, like TemplatesTable) */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: (t) => alpha(t.palette.primary.main, 0.03),
          }}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Follow-ups ({counts.total})
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
            <TextField
              select
              size="small"
              label="Scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="last_7d">Last 7 days</MenuItem>
              <MenuItem value="last_30d">Last 30 days</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </TextField>

            <Chip
              size="small"
              label={`Total: ${counts.total}`}
              sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: "primary.main" }}
            />
            <Chip size="small" color="error" label={`No-show: ${counts.no_show}`} />
            <Chip size="small" color="warning" label={`Rebook: ${counts.rebook}`} />
            <Chip size="small" label={`Post-call: ${counts.post_call}`} />
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer
          sx={{
            maxHeight: 560, // 🔧 adjust the scrollable viewport height here
            "& .MuiTableCell-head": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 260 }}>When (UTC)</TableCell>
                <TableCell sx={{ width: 320 }}>Invitee</TableCell>
                <TableCell sx={{ width: 140 }}>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell align="right" sx={{ width: 220 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map(({ m, cls }) => (
                <TableRow key={m.id} hover>
                  <TableCell>
                    {m.start} → {m.end}
                  </TableCell>
                  <TableCell>
                    {m.invitee?.name}{" "}
                    <Chip
                      size="small"
                      label={m.invitee?.email}
                      sx={{ ml: 0.5, "& .MuiChip-label": { fontFamily: "monospace" } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={cls === "post_call" ? "default" : cls === "rebook" ? "warning" : "error"}
                      label={cls.replace("_", " ")}
                    />
                  </TableCell>
                  <TableCell>
                    {cls === "no_show" && "No join detected"}
                    {cls === "rebook" && "Meeting cancelled"}
                    {cls === "post_call" && "Send recap"}
                  </TableCell>
                  <TableCell align="right">
                    {cls === "no_show" && (
                      <Button
                        size="small"
                        startIcon={<UserX size={16} />}
                        onClick={() => sendFollowUp(m, "no_show")}
                      >
                        Nudge
                      </Button>
                    )}
                    {cls === "rebook" && (
                      <Button
                        size="small"
                        startIcon={<RotateCcw size={16} />}
                        onClick={() => sendFollowUp(m, "rebook")}
                      >
                        Rebook
                      </Button>
                    )}
                    {cls === "post_call" && (
                      <Button
                        size="small"
                        startIcon={<MessageSquare size={16} />}
                        onClick={() => sendFollowUp(m, "post_call")}
                      >
                        Recap
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {!total && (
                <TableRow>
                  <TableCell colSpan={totalColumns}>
                    <Typography align="center" sx={{ py: 4, color: "text.secondary" }}>
                      Nothing to follow up
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer (like TemplatesTable) */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1,
            borderTop: (th) => `1px solid ${th.palette.divider}`,
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
                border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {rppOptions.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n} / page
                  </MenuItem>
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

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={2200}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? <Alert severity={toast.sev}>{toast.msg}</Alert> : null}
      </Snackbar>
    </Stack>
  );
}
