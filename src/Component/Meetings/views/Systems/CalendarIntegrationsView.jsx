// Path: /src/Component/Meetings/views/Systems/CalendarIntegrationsView.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
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
  LinearProgress,
  TableContainer,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Link as LinkIcon, RefreshCcw, CheckCircle2, XCircle, Clock, Activity, Webhook } from "lucide-react";
import usersFixtures from "../../mocks/fixtures/users.fixtures.json";
// import * as calendar from "../../mocks/adapters/calendar.mock";

export default function CalendarIntegrationsView() {
  const theme = useTheme();
  const users = usersFixtures;

  const [rowsAll, setRowsAll] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // unified pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const refresh = async () => {
    setErr(null);
    setLoading(true);
    try {
      // DUMMY IMPLEMENTATION
      await new Promise(resolve => setTimeout(resolve, 500));
      const results = await Promise.all(
        users.map(async (u) => {
          const provider = (u.integrations?.calendars?.[0] || "google").split(":")[0];
          const busyCount = Math.floor(Math.random() * 10); // Dummy busy count
          const ok = true; // mock
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            provider,
            scopes: ["calendar.read", "calendar.write"],
            webhookStatus: "subscribed",
            lastSync: new Date().toISOString(),
            upcomingBusy: busyCount,
            health: ok ? "ok" : "error",
          };
        })
      );
      setRowsAll(results);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // footer math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  const pageRows = useMemo(
    () => rowsAll.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [rowsAll, safePage, pageSize]
  );

  useEffect(() => setPage(0), [pageSize, total]);

  const okCount = useMemo(() => rowsAll.filter((r) => r.health === "ok").length, [rowsAll]);

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Calendar Integrations</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            icon={<Activity size={14} />}
            label={`${okCount}/${total} healthy`}
            sx={{ bgcolor: alpha(theme.palette.success.main, 0.08), color: theme.palette.success.main }}
          />
          <Button startIcon={<RefreshCcw />} onClick={refresh} disabled={loading}>
            {loading ? "Checking..." : "Refresh"}
          </Button>
        </Stack>
      </Stack>
      <Divider />

      {loading && <LinearProgress />}
      {err && <Alert severity="error">{err}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Height: tweak here */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Scopes</TableCell>
                <TableCell>Webhooks</TableCell>
                <TableCell>Upcoming Busy (7d)</TableCell>
                <TableCell>Last Sync</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    {r.name} <Chip size="small" label={r.email} sx={{ ml: 1 }} />
                  </TableCell>
                  <TableCell>{r.provider}</TableCell>
                  <TableCell>
                    {r.scopes.map((s) => (
                      <Chip key={s} size="small" label={s} sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" icon={<Webhook size={14} />} label={r.webhookStatus} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" icon={<Clock size={14} />} label={r.upcomingBusy} />
                  </TableCell>
                  <TableCell>{new Date(r.lastSync).toLocaleString()}</TableCell>
                  <TableCell>
                    {r.health === "ok" ? (
                      <Chip size="small" color="success" icon={<CheckCircle2 size={14} />} label="OK" />
                    ) : (
                      <Chip size="small" icon={<XCircle size={14} />} label="Error" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.75} justifyContent="flex-end">
                      <Tooltip title="Re-authorize (mock)">
                        <IconButton onClick={() => alert("Mock: OAuth flow would start.")}>
                          <LinkIcon size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!pageRows.length && !loading && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No connections
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Custom footer */}
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
