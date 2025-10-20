// Path: /src/Component/Meetings/views/Systems/ConferencingNodesView.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Chip,
  Slider,
  Button,
  TableContainer,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Globe2, ServerCog } from "lucide-react";

/**
 * Mock SFU/MCU regions & capacity (client-only).
 * Each node has: region, capacity (max sessions), load (active sessions), status.
 */
const DEFAULT_NODES = [
  { id: "sfu-eu-west", region: "eu-west", capacity: 120, load: 32, status: "ok", latencyMs: 58 },
  { id: "sfu-us-east", region: "us-east", capacity: 160, load: 88, status: "ok", latencyMs: 92 },
  { id: "sfu-us-west", region: "us-west", capacity: 140, load: 66, status: "ok", latencyMs: 110 },
  { id: "sfu-africa-1", region: "af-south", capacity: 100, load: 24, status: "ok", latencyMs: 45 },
  { id: "sfu-ap-south", region: "ap-south", capacity: 130, load: 72, status: "degraded", latencyMs: 150 },
];

export default function ConferencingNodesView() {
  const theme = useTheme();
  const [nodes, setNodes] = useState(DEFAULT_NODES);

  // unified pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const pct = (n) => Math.min(100, Math.round((n.load / n.capacity) * 100));
  const color = (n) => (pct(n) < 70 ? "success" : pct(n) < 90 ? "warning" : "error");

  const totalCap = useMemo(() => nodes.reduce((acc, n) => acc + n.capacity, 0), [nodes]);
  const active = useMemo(() => nodes.reduce((acc, n) => acc + n.load, 0), [nodes]);

  const rebalance = () => {
    const okNodes = nodes.filter((n) => n.status === "ok");
    if (!okNodes.length) return;
    const avg = Math.floor(active / okNodes.length);
    const next = nodes.map((n) => (n.status === "ok" ? { ...n, load: Math.min(n.capacity, avg) } : n));
    setNodes(next);
  };

  const simulateSpike = (region, delta) => {
    setNodes((prev) =>
      prev.map((n) => (n.region === region ? { ...n, load: Math.min(n.capacity, Math.max(0, n.load + delta)) } : n))
    );
  };

  // footer math
  const total = nodes.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [5, 10];

  const pageRows = useMemo(() => nodes.slice(safePage * pageSize, safePage * pageSize + pageSize), [nodes, safePage, pageSize]);

  useEffect(() => setPage(0), [pageSize, total]); 

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Conferencing Nodes</Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          <Chip
            icon={<Globe2 size={14} />}
            label={`Capacity ${active}/${totalCap} sessions`}
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" }}
          />
          <Button startIcon={<ServerCog />} onClick={rebalance}>
            Rebalance (mock)
          </Button>
        </Stack>
      </Stack>
      <Divider />

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Height: add maxHeight if you want scroll, e.g. sx={{ maxHeight: 560 }} */}
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Region</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Latency</TableCell>
                <TableCell>Load</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Adjust</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((n) => (
                <TableRow key={n.id} hover>
                  <TableCell>{n.region}</TableCell>
                  <TableCell>
                    <Chip size="small" color={n.status === "ok" ? "success" : n.status === "degraded" ? "warning" : "error"} label={n.status} />
                  </TableCell>
                  <TableCell>{n.latencyMs} ms</TableCell>
                  <TableCell sx={{ minWidth: 240 }}>
                    <Stack direction="row" gap={1} alignItems="center">
                      <LinearProgress variant="determinate" value={pct(n)} sx={{ flex: 1, height: 8, borderRadius: 999 }} color={color(n)} />
                      <Chip size="small" label={`${n.load}/${n.capacity}`} />
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ width: 200 }}>
                    <Slider
                      value={n.capacity}
                      min={50}
                      max={300}
                      step={10}
                      onChange={(_, val) => setNodes((prev) => prev.map((x) => (x.id === n.id ? { ...x, capacity: Number(val) } : x)))}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={1}>
                      <Button size="small" onClick={() => simulateSpike(n.region, +10)}>
                        +10
                      </Button>
                      <Button size="small" onClick={() => simulateSpike(n.region, -10)}>
                        -10
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!pageRows.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No nodes
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
