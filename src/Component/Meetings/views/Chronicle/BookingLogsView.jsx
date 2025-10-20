import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TextField,
  MenuItem,
  Button,
  TableContainer,
  Toolbar,
  Checkbox,
  Select,
  Pagination,
  Box,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Filter, Trash2 } from "lucide-react";
import { useMeetingsStore } from "../../../store/scheduling/useMeetingsStore";
import * as notify from "../../mocks/adapters/notifications.mock";

export default function BookingLogsView() {
  const t = useTheme();
  const mtg = useMeetingsStore();

  const [channel, setChannel] = useState("all");
  const [notif, setNotif] = useState([]);

  // pagination (history)
  const [histPage, setHistPage] = useState(0);
  const [histPageSize, setHistPageSize] = useState(25);

  // pagination (notifications)
  const [nPage, setNPage] = useState(0);
  const [nPageSize, setNPageSize] = useState(25);

  const rppOptions = [10, 25, 50, 100];

  // selection (page-scoped)
  const [histSel, setHistSel] = useState([]);
  const [notifSel, setNotifSel] = useState([]);

  useEffect(() => {
    if (!mtg.loaded) mtg.loadFixtures();
    setNotif(notify.getLog({}));
  }, [mtg]);

  const applyFilter = () => setNotif(notify.getLog({ channel: channel === "all" ? undefined : channel }));

  const historyAll = useMemo(() => mtg.history || [], [mtg.history]);

  // Sort newest-first
  const historySorted = useMemo(() => [...historyAll].sort((a, b) => new Date(b.at) - new Date(a.at)), [historyAll]);
  const notifSorted = useMemo(() => [...(notif || [])].sort((a, b) => new Date(b.ts) - new Date(a.ts)), [notif]);

  // pagination math + slices
  const histTotal = historySorted.length;
  const histPages = Math.max(1, Math.ceil(Math.max(0, histTotal) / Math.max(1, histPageSize)));
  const histSafePage = Math.min(histPage, histPages - 1);
  const histStart = histSafePage * histPageSize;
  const historyVisible = useMemo(
    () => historySorted.slice(histStart, histStart + histPageSize),
    [historySorted, histStart, histPageSize]
  );

  const notifTotal = notifSorted.length;
  const notifPages = Math.max(1, Math.ceil(Math.max(0, notifTotal) / Math.max(1, nPageSize)));
  const notifSafePage = Math.min(nPage, notifPages - 1);
  const notifStart = notifSafePage * nPageSize;
  const notifVisible = useMemo(() => notifSorted.slice(notifStart, notifStart + nPageSize), [notifSorted, notifStart, nPageSize]);

  // reset pages when data / page size changes
  useEffect(() => setHistPage(0), [histTotal, histPageSize]);
  useEffect(() => setNPage(0), [notifTotal, nPageSize]);
  // reset selections when page changes
  useEffect(() => setHistSel([]), [histSafePage, histPageSize]);
  useEffect(() => setNotifSel([]), [notifSafePage, nPageSize]);

  // selection helpers
  const histIds = historyVisible.map((r) => r.id);
  const notifIds = notifVisible.map((r) => r.id);
  const histAllChecked = histIds.length > 0 && histIds.every((id) => histSel.includes(id));
  const notifAllChecked = notifIds.length > 0 && notifIds.every((id) => notifSel.includes(id));

  const toggleAllHist = () =>
    setHistSel((sel) => (histAllChecked ? sel.filter((id) => !histIds.includes(id)) : Array.from(new Set([...sel, ...histIds]))));
  const toggleHist = (id) => setHistSel((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const toggleAllNotif = () =>
    setNotifSel((sel) =>
      notifAllChecked ? sel.filter((id) => !notifIds.includes(id)) : Array.from(new Set([...sel, ...notifIds]))
    );
  const toggleNotif = (id) => setNotifSel((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const histFrom = histTotal === 0 ? 0 : histSafePage * histPageSize + 1;
  const histTo = Math.min(histTotal, (histSafePage + 1) * histPageSize);
  const nFrom = notifTotal === 0 ? 0 : notifSafePage * nPageSize + 1;
  const nTo = Math.min(notifTotal, (notifSafePage + 1) * nPageSize);

  return (
    <Stack gap={2}>
      <Typography variant="h6">Booking Logs</Typography>
      <Divider />

      {/* Controls */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: (th) => alpha(th.palette.primary.main, 0.02),
          borderColor: (th) => alpha(th.palette.primary.main, 0.25),
        }}
      >
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <Filter size={16} />
          <TextField
            select
            size="small"
            label="Channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="sms">SMS</MenuItem>
            <MenuItem value="whatsapp">WhatsApp</MenuItem>
          </TextField>
          <Button onClick={applyFilter} variant="contained">
            Apply
          </Button>
          <Button
            color="error"
            startIcon={<Trash2 />}
            onClick={() => {
              notify.clearLog();
              setNotif([]);
            }}
            variant="outlined"
          >
            Clear
          </Button>
          <Chip
            size="small"
            label={`${notifSorted.length} deliveries`}
            sx={{ bgcolor: (th) => alpha(th.palette.primary.main, 0.08), color: "primary.main" }}
          />
        </Stack>
      </Paper>

      {/* Booking History */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Toolbar
          sx={{
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: (th) => `1px solid ${th.palette.divider}`,
            bgcolor: histSel.length ? alpha(t.palette.primary.main, 0.06) : "transparent",
          }}
        >
          {histSel.length ? (
            <Typography variant="subtitle2">{histSel.length} selected</Typography>
          ) : (
            <Typography variant="subtitle2">Booking History ({histTotal})</Typography>
          )}
        </Toolbar>

        <TableContainer
          sx={{
            maxHeight: 420,
            "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small" aria-label="booking history">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={histAllChecked}
                    indeterminate={histIds.some((id) => histSel.includes(id)) && !histAllChecked}
                    onChange={toggleAllHist}
                    inputProps={{ "aria-label": "Select all on page" }}
                  />
                </TableCell>
                <TableCell sx={{ width: 240 }}>When</TableCell>
                <TableCell sx={{ width: 200 }}>Type</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyVisible.map((h) => {
                const selectedRow = histSel.includes(h.id);
                return (
                  <TableRow key={h.id} hover selected={selectedRow}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRow} onChange={() => toggleHist(h.id)} />
                    </TableCell>
                    <TableCell>{new Date(h.at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={h.type}
                        sx={{
                          "& .MuiChip-label": { fontWeight: 600 },
                          bgcolor: (th) => alpha(th.palette.primary.main, 0.06),
                          color: "primary.main",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <code style={{ fontSize: 12 }}>
                        {JSON.stringify(
                          h.data && { eventTypeId: h.data.eventTypeId, host: h.data.host, invitee: h.data.invitee },
                          null,
                          2
                        )}
                      </code>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!histTotal && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No history
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
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
            backgroundColor: alpha(t.palette.primary.main, 0.015),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {histTotal ? `Showing ${histFrom}–${histTo} of ${histTotal}` : "No results"}
            {histSel.length ? ` • ${histSel.length} selected` : ""}
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
                backgroundColor: t.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={histPageSize}
                onChange={(e) => setHistPageSize(parseInt(String(e.target.value), 10))}
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
              count={histPages}
              page={Math.min(histSafePage + 1, histPages)}
              onChange={(_, v) => setHistPage(v - 1)}
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
              disabled={histPages <= 1}
            />
          </Stack>
        </Box>
      </Paper>

      {/* Notification Deliveries */}
      <Paper variant="outlined" sx={{ borderRadius: 2 }}>
        <Toolbar
          sx={{
            px: 2,
            py: 1,
            gap: 1,
            borderBottom: (th) => `1px solid ${th.palette.divider}`,
            bgcolor: notifSel.length ? alpha(t.palette.primary.main, 0.06) : "transparent",
          }}
        >
          {notifSel.length ? (
            <Typography variant="subtitle2">{notifSel.length} selected</Typography>
          ) : (
            <Typography variant="subtitle2">Notification Deliveries ({notifTotal})</Typography>
          )}
        </Toolbar>

        <TableContainer
          sx={{
            maxHeight: 420,
            "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
          }}
        >
          <Table stickyHeader size="small" aria-label="notification deliveries">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={notifAllChecked}
                    indeterminate={notifIds.some((id) => notifSel.includes(id)) && !notifAllChecked}
                    onChange={toggleAllNotif}
                    inputProps={{ "aria-label": "Select all on page" }}
                  />
                </TableCell>
                <TableCell sx={{ width: 220 }}>Time</TableCell>
                <TableCell sx={{ width: 140 }}>Channel</TableCell>
                <TableCell>To</TableCell>
                <TableCell sx={{ width: 160 }}>Status</TableCell>
                <TableCell sx={{ width: 260 }}>Provider ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifVisible.map((n) => {
                const selectedRow = notifSel.includes(n.id);
                return (
                  <TableRow key={n.id} hover selected={selectedRow}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedRow} onChange={() => toggleNotif(n.id)} />
                    </TableCell>
                    <TableCell>{new Date(n.ts).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip size="small" label={n.channel} />
                    </TableCell>
                    <TableCell>{n.to}</TableCell>
                    <TableCell>{n.status}</TableCell>
                    <TableCell>
                      <code>{n.providerMessageId}</code>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!notifTotal && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      No notifications
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
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
            backgroundColor: alpha(t.palette.primary.main, 0.015),
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {notifTotal ? `Showing ${nFrom}–${nTo} of ${notifTotal}` : "No results"}
            {notifSel.length ? ` • ${notifSel.length} selected` : ""}
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
                backgroundColor: t.palette.background.paper,
              }}
            >
              <Select
                size="small"
                value={nPageSize}
                onChange={(e) => setNPageSize(parseInt(String(e.target.value), 10))}
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
              count={notifPages}
              page={Math.min(notifSafePage + 1, notifPages)}
              onChange={(_, v) => setNPage(v - 1)}
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
              disabled={notifPages <= 1}
            />
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
