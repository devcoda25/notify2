// Path: /src/Component/Meetings/views/Systems/ReminderPoliciesView.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Tooltip,
  TableContainer,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Plus, Pencil, Trash2 } from "lucide-react";

import ReminderPolicyEditor from "../../components/ReminderPolicyEditor";
import { useReminderPoliciesStore } from "../../../store/scheduling/useReminderPoliciesStore";

export default function ReminderPoliciesView() {
  const theme = useTheme();
  const store = useReminderPoliciesStore();
  const [dialog, setDialog] = useState({ open: false, id: null });

  // unified pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    store.loaded || store.loadFixtures();
  }, [store]);

  const rowsAll = useMemo(() => store.policies || [], [store.policies]);

  // footer math
  const total = rowsAll.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  const slice = useMemo(
    () => rowsAll.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [rowsAll, safePage, pageSize]
  );

  useEffect(() => setPage(0), [pageSize, total]);

  const open = (id = null) => setDialog({ open: true, id });
  const close = () => setDialog({ open: false, id: null });

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography variant="h6">Reminder Policies</Typography>
        <Button startIcon={<Plus />} variant="contained" onClick={() => open(null)}>
          New Policy
        </Button>
      </Stack>
      <Divider />

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Height: tweak here */}
        <TableContainer sx={{ maxHeight: 560 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Channels</TableCell>
                <TableCell>Steps</TableCell>
                <TableCell>Applies To</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slice.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{(p.channels || []).join(", ")}</TableCell>
                  <TableCell>
                    {(p.steps || []).map((s, i) => (
                      <Chip
                        key={i}
                        size="small"
                        label={`${s.offsetMinutes}m • ${s.channel}`}
                        sx={{ mr: 0.5, mb: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>{(p.appliesTo?.eventTypeIds || []).join(", ") || "—"}</TableCell>
                  <TableCell>{new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.75} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => open(p.id)}>
                          <Pencil size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => store.deletePolicy(p.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {!slice.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" sx={{ py: 3, color: "text.secondary" }}>
                      No policies
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

      <Dialog open={dialog.open} onClose={close} maxWidth="md" fullWidth>
        <DialogTitle>{dialog.id ? "Edit Policy" : "New Policy"}</DialogTitle>
        <DialogContent dividers>
          <ReminderPolicyEditor policyId={dialog.id || undefined} onSaved={close} />
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
