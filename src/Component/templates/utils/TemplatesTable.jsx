// Path: src/Component/templates/utils/TemplatesTable.jsx

import React from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Chip,
  Checkbox,
  Toolbar,
  Typography,
  TableContainer,
  Stack,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Mail, MonitorSmartphone, Bell, MessageSquare, MessageCircle } from "lucide-react";
import TemplateRowActions from "./TemplateRowActions";
import ApprovalStatusChip from "./ApprovalStatusChip";
import EmptyState from "./EmptyState";

/* ---------- helpers ---------- */
const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

const ChannelIcon = ({ id, size = 14 }) => {
  const key = normalizeChannel(id);
  const map = {
    email: Mail,
    platform: MonitorSmartphone,
    push: Bell,
    sms: MessageSquare,
    whatsapp: MessageCircle,
  };
  const Icon = map[key] || MonitorSmartphone;
  return <Icon size={size} />;
};

export default function TemplatesTable({
  rows = [],
  onOpen,
  onClone,
  onArchive,
  onTest,
  dense = false,
  showChannel = true,
  showVariants = true,

  // pagination (0-based page)
  page = 0,
  pageSize = 25,
  total: totalProp,
  onPageChange,
  onPageSizeChange,

  // legacy props from views (we map them to unified submit)
  onSubmitInternal,
  onSendToProvider,
  onResubmitProvider,
  onWithdrawSubmission, // will be ignored by actions when context !== "approvals"
  onOpenTimeline,
  onOpenInApprovals,

  context = "all", // "all" | "channel" | "approvals"
}) {
  const t = useTheme();
  const [orderBy, setOrderBy] = React.useState("updatedAt");
  const [order, setOrder] = React.useState("desc");
  const [selected, setSelected] = React.useState([]);

  // ----- sorting -----
  const sorted = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const va = a?.[orderBy] ?? "";
      const vb = b?.[orderBy] ?? "";
      let cmp = 0;
      if (orderBy === "updatedAt" || orderBy === "createdAt") {
        cmp = new Date(va).getTime() - new Date(vb).getTime();
      } else if (typeof va === "number" && typeof vb === "number") {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb));
      }
      return order === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [rows, orderBy, order]);

  // ----- pagination math -----
  const total = typeof totalProp === "number" ? totalProp : rows.length;
  const pages = Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
  const safePage = Math.min(page, pages - 1);
  const from = total === 0 ? 0 : safePage * pageSize + 1;
  const to = Math.min(total, (safePage + 1) * pageSize);
  const rppOptions = [10, 25, 50, 100];

  // Slice to show the current page
  const start = safePage * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  // ----- selection (page only) -----
  const pageIds = pageRows.map((r) => r.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggleAllOnPage = () =>
    setSelected((sel) =>
      allChecked ? sel.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...sel, ...pageIds]))
    );
  const toggle = (id) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));

  const headerCell = (id, label) => (
    <TableCell sortDirection={orderBy === id ? order : false}>
      <TableSortLabel
        active={orderBy === id}
        direction={orderBy === id ? order : "asc"}
        onClick={() => {
          setOrderBy(id);
          setOrder(orderBy === id && order === "asc" ? "desc" : "asc");
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  const getVariantMeta = (r) => {
    const variants = r.variants || r.translations || [];
    const languages = Array.from(
      new Set(
        variants
          .map((v) => v?.lang || v?.language || v?.locale)
          .filter(Boolean)
          .map((s) => String(s).slice(0, 5))
      )
    );
    return { count: variants.length, languages };
  };

  const totalColumns =
    1 + // checkbox
    1 + // name
    (showChannel ? 1 : 0) +
    1 + // type
    (showVariants ? 1 : 0) +
    1 + // status
    1 + // usage
    1 + // updated
    1; // actions

  // Unified submit mapper: prefer provider path (dialog handles the toggle)
  const makeSubmitApproval = (row) => () => {
    if (onSendToProvider) return onSendToProvider(row);
    if (onSubmitInternal) return onSubmitInternal(row);
    return undefined;
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <Toolbar
        sx={{
          px: 2,
          py: 1,
          gap: 1,
          borderBottom: (th) => `1px solid ${th.palette.divider}`,
          bgcolor: selected.length ? alpha(t.palette.primary.main, 0.06) : "transparent",
        }}
      >
        {selected.length ? (
          <Typography variant="subtitle2">{selected.length} selected</Typography>
        ) : (
          <Typography variant="subtitle2">Templates ({total})</Typography>
        )}
      </Toolbar>

      <TableContainer
        sx={{
          "& .MuiTableCell-head": { backgroundColor: alpha(t.palette.primary.main, 0.04) },
        }}
      >
        <Table size={dense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allChecked}
                  indeterminate={pageIds.some((id) => selected.includes(id)) && !allChecked}
                  onChange={toggleAllOnPage}
                  inputProps={{ "aria-label": "Select all on page" }}
                />
              </TableCell>
              {headerCell("name", "Name")}
              {showChannel && headerCell("channel", "Channel")}
              {headerCell("type", "Type")}
              {showVariants && <TableCell>Variants</TableCell>}
              <TableCell>Status</TableCell>
              {headerCell("usageTotal", "Usage")}
              {headerCell("updatedAt", "Updated")}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((r) => {
              const usage = r.usage?.total ?? r.usageTotal ?? 0;
              const { count, languages } = getVariantMeta(r);
              const ch = normalizeChannel(r.channel);

              return (
                <TableRow key={r.id} hover selected={selected.includes(r.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
                  </TableCell>

                  <TableCell onClick={() => onOpen?.(r)} sx={{ cursor: "pointer", maxWidth: 320 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        title={r.name}
                      >
                        {r.name}
                      </Typography>
                    </Box>
                    {r.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        title={r.description}
                      >
                        {r.description}
                      </Typography>
                    )}
                  </TableCell>

                  {showChannel && (
                    <TableCell>
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                        <ChannelIcon id={ch} />
                        <Typography variant="body2">{ch}</Typography>
                      </Box>
                    </TableCell>
                  )}

                  <TableCell>
                    <Chip size="small" label={r.type} />
                  </TableCell>

                  {showVariants && (
                    <TableCell sx={{ minWidth: 220 }}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip size="small" label={`${count} var`} />
                        {languages.slice(0, 4).map((lng) => (
                          <Chip key={`${r.id}-${lng}`} size="small" variant="outlined" label={(lng || "").toUpperCase()} />
                        ))}
                        {languages.length > 4 && (
                          <Chip size="small" variant="outlined" label={`+${languages.length - 4}`} />
                        )}
                      </Stack>
                    </TableCell>
                  )}

                  <TableCell>
                    <ApprovalStatusChip status={r.status || r.state} />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{usage.toLocaleString()}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <TemplateRowActions
                      template={r}
                      onOpen={onOpen}
                      onClone={onClone}
                      onArchive={onArchive}
                      onTest={onTest}
                      onSubmitApproval={makeSubmitApproval(r)}
                      onResubmitProvider={onResubmitProvider ? () => onResubmitProvider(r) : undefined}
                      onWithdrawSubmission={onWithdrawSubmission ? () => onWithdrawSubmission(r) : undefined}
                      onOpenTimeline={onOpenTimeline ? () => onOpenTimeline(r) : undefined}
                      onOpenInApprovals={onOpenInApprovals ? () => onOpenInApprovals(r) : undefined}
                      context={context}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {!pageRows.length && (
              <TableRow>
                <TableCell colSpan={totalColumns} align="center">
                  <EmptyState
                    title="No templates match your filters"
                    description="Try adjusting search text, channel, type or timeframe."
                  />
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
          {total ? `Showing ${from}–${to} of ${total}` : "No results"}
          {selected.length ? ` • ${selected.length} selected` : ""}
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
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
              variant="standard"
              disableUnderline
              sx={{ minWidth: 76, "& .MuiSelect-select": { px: 0.5 } }}
            >
              {[10, 25, 50, 100].map((n) => (
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
            onChange={(_, v) => onPageChange?.(v - 1)}
            size="small"
            shape="rounded"
            showFirstButton
            showLastButton
            disabled={pages <= 1}
          />
        </Stack>
      </Box>
    </Paper>
  );
}
