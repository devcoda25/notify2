// Path: src/Component/templates/views/AllTemplatesView.jsx

import React from "react";
import { Box, Grid, Stack, Select, MenuItem, Pagination, Paper, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import TemplateCard from "../utils/TemplateCard";
import TemplatesTable from "../utils/TemplatesTable";
import ProviderSubmissionDialog from "../utils/ProviderSubmissionDialog";
import ProviderDetailsDialog from "../utils/ProviderDetailsDialog";

import TemplatesTopNav from "../layout/TemplatesTopNav";

import useTemplatesStore from "../../store/templates/useTemplatesStore";
import useApprovalsStore from "../../store/templates/useApprovalsStore";

import PROVIDERS_BY_CHANNEL from "../constants/PROVIDERS_BY_CHANNEL";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";

const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

function enrich(t, approvals) {
  const status = approvals?.[t.id]?.state || t.status || t.state || APPROVAL_STATES.DRAFT;
  return { ...t, status, usageTotal: t.usage?.total ?? t.usageTotal ?? 0 };
}

const toVariants = (tpl, approvals) => {
  const variants = tpl?.variants || tpl?.translations || [];
  const providers = PROVIDERS_BY_CHANNEL[normalizeChannel(tpl?.channel)] || [];
  return variants.map((v) => {
    const variantStates = approvals?.[tpl.id]?.variantProviders?.[v.id] || {};
    const providerStates = providers.reduce((acc, p) => {
      acc[p] = variantStates?.[p]?.state || "—";
      return acc;
    }, {});
    return {
      id: v.id || `${tpl.id}-${v.lang || v.language || v.locale || "base"}`,
      name: v.name || tpl.name,
      lang: v.lang || v.language || v.locale || "",
      lastSubmittedAt: variantStates?.lastSubmittedAt || v.lastSubmittedAt || null,
      providerStates,
    };
  });
};

const toProviderStatuses = (tpl, approvals) => {
  const providers = PROVIDERS_BY_CHANNEL[normalizeChannel(tpl?.channel)] || [];
  const meta = approvals?.[tpl.id]?.providers || approvals?.[tpl.id]?.providerStates || {};
  return providers.map((p) => ({
    name: p,
    state: meta?.[p]?.state || "Pending",
    updatedAt: meta?.[p]?.updatedAt || null,
    reason: meta?.[p]?.reason || "",
    externalId: meta?.[p]?.externalId || "",
    lastSyncAt: meta?.[p]?.lastSyncAt || null,
  }));
};

const toHistory = (tpl, approvals) => {
  const h = approvals?.[tpl.id]?.history || tpl?.history || [];
  return h.map((e) => ({
    state: e.state,
    at: e.at || e.date || e.timestamp,
    by: e.by || e.actor || e.user,
    note: e.note || e.comment || "",
    commitId: e.commitId || e.sha || undefined,
  }));
};

export default function AllTemplatesView({ onOpenTemplate, onOpenApprovals, onCreateTemplate }) {
  const theme = useTheme();

  const templates = useTemplatesStore((s) => s.templates) || [];
  const setFilter = useTemplatesStore((s) => s.setFilter);
  const query = useTemplatesStore((s) => s.query || "");
  const setQuery = useTemplatesStore((s) => s.setQuery);
  const filters = useTemplatesStore((s) => s.filters || { type: "all", status: "all" });
  const seedDemoIfSparse = useTemplatesStore((s) => s.seedDemoIfSparse);
  const approvals = useApprovalsStore((s) => s.approvals) || {};

  const selectGraph = useApprovalsStore((s) => s.selectGraph);

  const [tab, setTab] = React.useState("all");
  const [mode, setMode] = React.useState("table");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  // submit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDetails, setDialogDetails] = React.useState(null);
  const [dialogInitialTab, setDialogInitialTab] = React.useState("overview");

  // details dialog
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsData, setDetailsData] = React.useState(null);

  React.useEffect(() => { seedDemoIfSparse(); }, [seedDemoIfSparse]);

  const statusOf = (t) => approvals?.[t.id]?.state || t.status || t.state || APPROVAL_STATES.DRAFT;

  const inDateWindow = (iso) => {
    if (!iso) return !(dateFrom || dateTo);
    const ts = new Date(iso).getTime();
    if (dateFrom && ts < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
    if (dateTo && ts > new Date(`${dateTo}T23:59:59`).getTime()) return false;
    return true;
  };

  const rowsAll = React.useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const matchesQuery = (t) =>
      !q || t.name?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || (t.tags || []).some((tg) => tg.toLowerCase().includes(q));

    return (templates || [])
      .filter((t) => {
        if (!matchesQuery(t)) return false;
        if (filters.type !== "all" && t.type !== filters.type) return false;
        if (filters.status !== "all" && statusOf(t) !== filters.status) return false;
        if (!inDateWindow(t.updatedAt)) return false;
        return true;
      })
      .map((t) => enrich(t, approvals))
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  }, [templates, query, filters, approvals, dateFrom, dateTo]);

  const rows = React.useMemo(() => {
    if (tab === "all") return rowsAll;
    const key = normalizeChannel(tab);
    return rowsAll.filter((t) => normalizeChannel(t.channel) === key);
  }, [rowsAll, tab]);

  React.useEffect(() => { setPage(0); }, [tab, query, filters, dateFrom, dateTo]);

  const onOpen = (tpl) => onOpenTemplate?.(tpl.id);
  const showChannel = tab === "all";

  const packDetails = (tpl) => !tpl ? null : ({
    template: tpl,
    providerStatuses: toProviderStatuses(tpl, approvals),
    variants: toVariants(tpl, approvals),
    history: toHistory(tpl, approvals),
    graph: selectGraph?.(tpl.id),
  });

  const openSubmitApproval = (tpl) => {
    const details = packDetails(tpl);
    const ch = normalizeChannel(tpl.channel);
    const hasProviders = (PROVIDERS_BY_CHANNEL[ch] || []).length > 0;
    setDialogDetails(details);
    setDialogInitialTab(hasProviders ? "submit-provider" : "submit-internal");
    setDialogOpen(true);
  };
  const openProviderResubmit = openSubmitApproval;

  const openTimeline = (tpl) => {
    const details = packDetails(tpl);
    setDetailsData(details);
    setDetailsOpen(true);
  };
  const openInApprovals = (tpl) => onOpenApprovals?.(tpl);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);

  return (
    <Stack spacing={1.5}>
      <TemplatesTopNav
        tabValue={tab}
        onTabChange={setTab}
        showAllTabs
        onCreateTemplate={onCreateTemplate}
        query={query}
        onQueryChange={setQuery}
        typeValue={filters.type}
        onTypeChange={(v) => setFilter("type", v)}
        statusValue={filters.status}
        onStatusChange={(v) => setFilter("status", v)}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        mode={mode}
        onModeChange={setMode}
      />

      {mode === "table" ? (
        <TemplatesTable
          rows={rows}
          showChannel={showChannel}
          showVariants
          page={clampedPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onOpen={onOpen}
          onSubmitInternal={openSubmitApproval}
          onSendToProvider={openSubmitApproval}
          onResubmitProvider={openProviderResubmit}
          onOpenTimeline={openTimeline}
          onOpenInApprovals={openInApprovals}
          context="all"
        />
      ) : (
        <>
          <Grid container spacing={1.5}>
            {rows.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize).map((t) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
                <TemplateCard
                  template={t}
                  onOpen={onOpen}
                  onSubmitApproval={openSubmitApproval}
                  onResubmitProvider={openProviderResubmit}
                  onOpenTimeline={openTimeline}
                  onOpenInApprovals={openInApprovals}
                  context="all"
                />
              </Grid>
            ))}
          </Grid>

          <Paper
            variant="outlined"
            sx={{ mt: 1, px: 1.5, py: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, borderRadius: 2 }}
          >
            <Box
              sx={{
                px: 1, py: 0.25,
                border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.4)}`,
                borderRadius: 2,
                display: "inline-flex", alignItems: "center", gap: 0.5,
              }}
            >
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                variant="standard"
                disableUnderline
                sx={{ minWidth: 64, "& .MuiSelect-select": { px: 0.5 } }}
              >
                {[10, 25, 30, 50, 100].map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>/ page</Typography>
            </Box>

            <Pagination
              page={clampedPage + 1}
              count={Math.max(1, Math.ceil(rows.length / pageSize))}
              onChange={(_, p) => setPage(p - 1)}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
            />
          </Paper>
        </>
      )}

      <ProviderDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        details={detailsData || { template: {} }}
        onOpenTimeline={() => {}}
        onResubmitProvider={({ templateId }) => {
          const tpl = rows.find((x) => x.id === templateId) || templates.find((x) => x.id === templateId);
          if (tpl) openProviderResubmit(tpl);
        }}
        onSubmitProvider={({ templateId }) => {
          const tpl = rows.find((x) => x.id === templateId) || templates.find((x) => x.id === templateId);
          if (tpl) openSubmitApproval(tpl);
        }}
        onOpenProviderPortal={(arg) => console.debug("open provider portal", arg)}
      />

      <ProviderSubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        details={dialogDetails || { template: {}, providerStatuses: [], variants: [], history: [] }}
        graph={dialogDetails?.graph}
        initialTab={dialogInitialTab}
        onOpenTimeline={({ templateId }) => {
          const tpl = rows.find((x) => x.id === templateId) || templates.find((x) => x.id === templateId);
          if (tpl) openTimeline(tpl);
        }}
        onSubmitInternal={({ templateId, approver, note }) => {
          console.debug("submit internal", { templateId, approver, note });
          setDialogOpen(false);
        }}
        onSubmitProvider={({ templateId, provider, selectedVariantIds, providerConfig, note }) => {
          console.debug("submit provider", { templateId, provider, selectedVariantIds, providerConfig, note });
          setDialogOpen(false);
        }}
      />
    </Stack>
  );
}
