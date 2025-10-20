import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Alert,
  TableContainer,
  Box,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Link as LinkIcon, RefreshCcw, CheckCircle2, XCircle, Clock } from "lucide-react";
import usersFixtures from "../../mocks/fixtures/users.fixtures.json";
import * as calendar from "../../mocks/adapters/calendar.mock";

export default function CalendarConnectionsView() {
  const theme = useTheme();
  const users = usersFixtures; // demo: show all fixture users as connectable accounts

  const [health, setHealth] = useState(() =>
    Object.fromEntries(
      users.map((u) => [
        u.id,
        {
          provider: (u.integrations?.calendars?.[0] || "google").split(":")[0],
          status: "unknown",
          lastSync: null,
          scopes: ["calendar.read", "calendar.write"],
          webhooks: "subscribed",
        },
      ])
    )
  );
  const [busyCounts, setBusyCounts] = useState({}); // id -> count in next 7d
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // TemplatesTable-style pagination
  const [page, setPage] = useState(0);       // 0-based
  const [pageSize, setPageSize] = useState(25);
  const rppOptions = [10, 25, 50, 100];

  const refresh = async () => {
    setLoading(true);
    setErr(null);
    try {
      const rangeStart = new Date().toISOString();
      const rangeEnd = new Date(Date.now() + 7 * 864e5).toISOString();

      const entries = await Promise.all(
        users.map(async (u) => {
          const provider = (u.integrations?.calendars?.[0] || "google").split(":")[0];
          const busy = await calendar.getBusyBlocks({
            ownerType: "user",
            ownerId: u.id,
            start: rangeStart,
            end: rangeEnd,
          });
          return { u, provider, busyCount: busy.length };
        })
      );

      const bc = {};
      const newHealth = {};
      entries.forEach(({ u, provider, busyCount }) => {
        bc[u.id] = busyCount;
        newHealth[u.id] = {
          provider,
          status: "ok",
          lastSync: new Date().toISOString(),
          scopes: ["calendar.read", "calendar.write"],
          webhooks: "subscribed",
        };
      });

      setBusyCounts(bc);
      setHealth((prev) => ({ ...prev, ...newHealth }));
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh(); // on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // stats + pagination math (TemplatesTable style)
  const stats = useMemo(() => {
    const vals = Object.values(health || {});
    const connected = vals.filter((h) => h.status === "ok").length;
    const unknown = vals.filter((h) => h.status !== "ok").length;
    return { total: users.length, connected, unknown };
  }, [health, users.length]);

  const total = users.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);

  const start = safePage * pageSize;
  const pageRows = useMemo(() => users.slice(start, start + pageSize), [users, start, pageSize]);

  // reset when list or pageSize changes
  useEffect(() => setPage(0), [users.length, pageSize]);

  return (
    <Stack gap={2}>
      {err && <Alert severity="error">{err}</Alert>}

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header (toolbar style) */}
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
            Calendar Connections ({stats.total})
          </Typography>

          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={`Total: ${stats.total}`}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
            />
            <Chip
              size="small"
              color="success"
              icon={<CheckCircle2 size={14} />}
              label={`Connected: ${stats.connected}`}
            />
            <Chip size="small" icon={<XCircle size={14} />} label={`Unknown: ${stats.unknown}`} />
            <Button startIcon={<RefreshCcw />} onClick={refresh} disabled={loading} variant="outlined">
              {loading ? "Checking..." : "Refresh"}
            </Button>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer
          sx={{
            maxHeight: 560, // 🔧 adjust table height here
            "& .MuiTableCell-head": { backgroundColor: alpha(theme.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Scopes</TableCell>
                <TableCell>Webhooks</TableCell>
                <TableCell>Next 7d Busy</TableCell>
                <TableCell>Last Sync</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((u) => {
                const h = health[u.id] || {};
                const ok = h.status === "ok";
                return (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      {u.name}{" "}
                      <Chip
                        size="small"
                        label={u.email}
                        sx={{ ml: 1, "& .MuiChip-label": { fontFamily: "monospace" } }}
                      />
                    </TableCell>
                    <TableCell>{h.provider || "google"}</TableCell>
                    <TableCell>
                      {ok ? (
                        <Chip size="small" color="success" icon={<CheckCircle2 size={14} />} label="Connected" />
                      ) : (
                        <Chip size="small" icon={<XCircle size={14} />} label={h.status || "Unknown"} />
                      )}
                    </TableCell>
                    <TableCell>
                      {(h.scopes || []).map((s) => (
                        <Tooltip key={s} title="Granted scope">
                          <Chip size="small" label={s} sx={{ mr: 0.5, mb: 0.5 }} />
                        </Tooltip>
                      ))}
                    </TableCell>
                    <TableCell>{h.webhooks}</TableCell>
                    <TableCell>
                      <Chip size="small" icon={<Clock size={14} />} label={busyCounts[u.id] ?? 0} />
                    </TableCell>
                    <TableCell>{h.lastSync ? new Date(h.lastSync).toLocaleString() : "—"}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Re-authorize">
                        <IconButton onClick={() => alert("Mock: OAuth flow would start.")}>
                          <LinkIcon size={16} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!users.length && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography align="center" sx={{ py: 4, color: "text.secondary" }}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer (TemplatesTable style) */}
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
    </Stack>
  );
}
