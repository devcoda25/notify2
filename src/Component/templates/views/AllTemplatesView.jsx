// Path: src/Component/templates/views/AllTemplatesView.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Stack, Select, MenuItem, Pagination, Paper, Typography, CircularProgress } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import TemplateCard from "../utils/TemplateCard";
import TemplatesTable from "../utils/TemplatesTable";
import ProviderSubmissionDialog from "../utils/ProviderSubmissionDialog";
import ProviderDetailsDialog from "../utils/ProviderDetailsDialog";

import TemplatesTopNav from "../layout/TemplatesTopNav";

import useTemplatesStore from "../store/useTemplatesStore";
import useApprovalsStore from "../store/useApprovalsStore";
import useTemplatesApi from "../hooks/useTemplatesApi";

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
  const api = useTemplatesApi();

  // Store selectors (following Zustand best practices)
  const templates = useTemplatesStore((s) => s.templates);
  const totalCount = useTemplatesStore((s) => s.totalCount);
  const loading = useTemplatesStore((s) => s.loading);
  const error = useTemplatesStore((s) => s.error);
  const query = useTemplatesStore((s) => s.query);
  const filters = useTemplatesStore((s) => s.filters);
  const setQuery = useTemplatesStore((s) => s.setQuery);
  const setFilter = useTemplatesStore((s) => s.setFilter);

  const approvals = useApprovalsStore((s) => s.approvals) || {};

  // Component state
  const [tab, setTab] = React.useState("all");
  const [mode, setMode] = React.useState("table");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDetails, setDialogDetails] = React.useState(null);
  const [dialogInitialTab, setDialogInitialTab] = React.useState("overview");
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsData, setDetailsData] = React.useState(null);

  // The API hook is now the single source of truth for all filtering and pagination.
  // This useEffect will re-run whenever any filter, search, or page change occurs.
  React.useEffect(() => {
    const apiFilters = {
      q: query,
      page: page + 1,
      pageSize: pageSize,
      status: filters.status === 'all' ? undefined : filters.status,
      type: filters.type === 'all' ? undefined : filters.type,
      channel: tab === 'all' ? undefined : tab,
    };
    api.fetchTemplates(apiFilters);
  }, [api, query, page, pageSize, filters, tab]);

  const statusOf = (t) => t.status || t.state || "Draft";

  const inDateWindow = (iso) => {
    if (!dateFrom && !dateTo) return true;
    if (!iso) return false;
    const ts = new Date(iso).getTime();
    if (dateFrom && ts < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
    if (dateTo && ts > new Date(`${dateTo}T23:59:59`).getTime()) return false;
    return true;
  };

  // Client-side filtering is re-introduced as requested, now acting on the paginated data from the API.
  const rows = React.useMemo(() => {
    return (templates || [])
      .filter((t) => {
        // The API handles q, page, pageSize, status, and type.
        // We only need to apply filters the API doesn't handle, like date.
        if (!inDateWindow(t.updatedAt)) return false;
        // Also, apply channel filter for the tabs
        if (tab !== 'all' && normalizeChannel(t.channel) !== tab) return false;
        return true;
      })
      .map((t) => enrich(t, approvals))
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  }, [templates, approvals, tab, dateFrom, dateTo]);


  // Reset page to 0 when filters change
  React.useEffect(() => { setPage(0); }, [query, filters.status, filters.type, dateFrom, dateTo, tab]);

  const onOpen = (tpl) => onOpenTemplate?.(tpl.id);
  const showChannel = tab === "all";

  const packDetails = (tpl) => !tpl ? null : ({
    template: tpl,
    providerStatuses: toProviderStatuses(tpl, approvals),
    variants: toVariants(tpl, approvals),
    history: [], // History is no longer available from mock store
    graph: null, // Graph is no longer available from mock store
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

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);

  console.log("[AllTemplatesView] Rendering with page:", page);
  console.log("[AllTemplatesView] Templates from store:", templates);
  console.log("[AllTemplatesView] Final rows for render:", rows);

  const renderContent = () => {
    if (loading && !templates.length) { // Show loading only on initial fetch
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography color="error">Failed to load templates: {error.message || "Unknown error"}</Typography>
        </Box>
      );
    }

    if (mode === "table") {
      return (
        <TemplatesTable
          rows={rows}
          total={totalCount}
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
          onOpenInApprovals={onOpenApprovals}
          context="all"
        />
      );
    }

    return (
      <>
        <Grid container spacing={1.5}>
          {rows.map((t) => ( // Note: table handles its own pagination, card view does not yet fully
            <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
              <TemplateCard
                template={t}
                onOpen={onOpen}
                onSubmitApproval={openSubmitApproval}
                onResubmitProvider={openProviderResubmit}
                onOpenTimeline={openTimeline}
                onOpenInApprovals={onOpenApprovals}
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
            count={totalPages}
            onChange={(_, p) => setPage(p - 1)}
            variant="outlined"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
        </Paper>
      </>
    );
  };

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

      {renderContent()}

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
