// Path: src/Component/templates/views/ChannelTemplatesView.jsx

import React from "react";
import { Box, Grid, Stack, Typography, Paper, Select, MenuItem, Pagination } from "@mui/material";
import { alpha } from "@mui/material/styles";

import TemplatesTopNav from "../layout/TemplatesTopNav";
import TemplateCard from "../utils/TemplateCard";
import TemplatesTable from "../utils/TemplatesTable";
import ProviderSubmissionDialog from "../utils/ProviderSubmissionDialog";
import ProviderDetailsDialog from "../utils/ProviderDetailsDialog";

import useTemplatesStore from "../../store/templates/useTemplatesStore";
import useApprovalsStore from "../../store/templates/useApprovalsStore";

import PROVIDERS_BY_CHANNEL from "../constants/PROVIDERS_BY_CHANNEL";

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
  const status = approvals?.[t.id]?.state || t.status || t.state || "Draft";
  return { ...t, status, usageTotal: t.usage?.total ?? t.usageTotal ?? 0 };
}

const toProviderStatuses = (tpl, approvals) => {
  const ch = normalizeChannel(tpl?.channel);
  const providers = PROVIDERS_BY_CHANNEL[ch] || [];
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

const toVariants = (tpl, approvals) => {
  const raw = tpl?.variants || tpl?.translations || tpl?.locales || tpl?.languages || tpl?.i18n || [];
  const fromTemplate = Array.isArray(raw) ? raw : [];
  const vp = approvals?.[tpl.id]?.variantProviders || {};
  const variantIdsFromApprovals = Object.keys(vp || {});
  const norm = (v) => {
    const id = v?.id || v?.variantId || v?.key || `${tpl.id}-${(v?.lang || v?.language || v?.locale || "base").toLowerCase()}`;
    const lang = (v?.lang || v?.language || v?.locale || "").toLowerCase();
    return { id, name: v?.name || tpl?.name || id, lang, lastSubmittedAt: v?.lastSubmittedAt || null, providerStates: {} };
  };

  const base = fromTemplate.map(norm);
  for (const vid of variantIdsFromApprovals) {
    if (!base.find((x) => x.id === vid)) {
      const langGuess = String(vid).includes("-") ? String(vid).split("-")[0] : String(vid);
      base.push({ id: vid, name: `${tpl?.name || "Variant"} (${vid})`, lang: (langGuess || "").toLowerCase(), lastSubmittedAt: vp?.[vid]?.lastSubmittedAt || null, providerStates: {} });
    }
  }

  const variants = base.length ? base : [{ id: `${tpl.id}-base`, name: tpl?.name || `${tpl.id}-base`, lang: "", lastSubmittedAt: null, providerStates: {} }];
  const ch = normalizeChannel(tpl?.channel);
  const providers = PROVIDERS_BY_CHANNEL[ch] || [];
  return variants.map((v) => {
    const variantStates = vp?.[v.id] || {};
    const providerStates = {};
    const provList = providers.length ? providers : Object.keys(variantStates || {});
    provList.forEach((p) => { providerStates[p] = variantStates?.[p]?.state || "—"; });
    return { ...v, providerStates };
  });
};

export default function ChannelTemplatesView({ channel = "email", onOpenTemplate, onOpenApprovals }) {
  const listForChannel = useTemplatesStore((s) => s.listForChannel);
  const resetToBigDemo = useTemplatesStore((s) => s.resetToBigDemo);
  const templatesCount = useTemplatesStore((s) => (s.templates || []).length);

  const query = useTemplatesStore((s) => s.query || "");
  const setQuery = useTemplatesStore((s) => s.setQuery);
  const filters = useTemplatesStore((s) => s.filters || { type: "all", status: "all" });
  const setFilter = useTemplatesStore((s) => s.setFilter);

  const approvals = useApprovalsStore((s) => s.approvals) || {};

  const deriveHistory = useApprovalsStore((s) => s.deriveHistory);
  const selectGraph = useApprovalsStore((s) => s.selectGraph);

  const [mode, setMode] = React.useState("table");
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);

  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [submitDetails, setSubmitDetails] = React.useState(null);
  const [submitInitialTab, setSubmitInitialTab] = React.useState("overview");

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsData, setDetailsData] = React.useState(null);

  React.useEffect(() => {
    if ((templatesCount || 0) < 100) resetToBigDemo(300);
  }, [templatesCount, resetToBigDemo]);

  const chKey = normalizeChannel(channel);
  const allForCh = React.useMemo(() => (listForChannel ? listForChannel(chKey) : []), [listForChannel, chKey]);

  const statusOf = (t) => approvals?.[t.id]?.state || t.status || t.state || "Draft";

  const inDateWindow = (iso) => {
    if (!dateFrom && !dateTo) return true;
    if (!iso) return false;
    const ts = new Date(iso).getTime();
    if (dateFrom && ts < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
    if (dateTo && ts > new Date(`${dateTo}T23:59:59`).getTime()) return false;
    return true;
  };

  const rows = React.useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const desiredStatus = filters.status === "all" ? "Approved" : filters.status;

    return (allForCh || [])
      .filter((t) => {
        const hit = !q || t.name?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || (t.tags || []).some((tg) => tg.toLowerCase().includes(q));
        if (!hit) return false;
        if (filters.type !== "all" && t.type !== filters.type) return false;
        if (statusOf(t) !== desiredStatus) return false;
        if (!inDateWindow(t.updatedAt)) return false;
        return true;
      })
      .map((t) => enrich(t, approvals))
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  }, [allForCh, query, filters, approvals, dateFrom, dateTo]);

  const onOpen = (tpl) => onOpenTemplate?.(tpl.id);

  React.useEffect(() => { setPage(0); }, [chKey, query, filters, dateFrom, dateTo]);

  const getDetails = React.useCallback(
    (templateId) => {
      const tpl = rows.find((t) => t.id === templateId) || allForCh.find((t) => t.id === templateId);
      if (!tpl) return null;
      const graph = selectGraph(templateId);
      const history = deriveHistory(templateId, "trunk");
      return {
        template: tpl,
        providerStatuses: toProviderStatuses(tpl, approvals),
        variants: toVariants(tpl, approvals),
        history,
        graph,
      };
    },
    [rows, allForCh, approvals, selectGraph, deriveHistory]
  );

  const openSubmitApproval = (tpl) => {
    const details = getDetails(tpl.id);
    const hasProviders = (PROVIDERS_BY_CHANNEL[normalizeChannel(tpl.channel)] || []).length > 0;
    setSubmitDetails(details);
    setSubmitInitialTab(hasProviders ? "submit-provider" : "submit-internal");
    setSubmitOpen(true);
  };
  const openProviderResubmit = openSubmitApproval;

  const openTimeline = (tpl) => {
    const data = getDetails(tpl.id);
    setDetailsData(data);
    setDetailsOpen(true);
  };
  const openInApprovals = (tpl) => onOpenApprovals?.(tpl);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);

  return (
    <Stack spacing={1.5}>
      <TemplatesTopNav
        showTabs={false}
        query={query}
        onQueryChange={setQuery}
        typeValue={filters.type}
        onTypeChange={(val) => setFilter("type", val)}
        statusValue={filters.status}
        onStatusChange={(val) => setFilter("status", val)}
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
          showChannel={false}
          showVariants
          page={clampedPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onOpen={onOpen}
          onSendToProvider={openSubmitApproval}
          onResubmitProvider={openProviderResubmit}
          onOpenTimeline={openTimeline}
          onOpenInApprovals={openInApprovals}
          context="channel"
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
                  context="channel"
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
      )}

      <ProviderDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        details={detailsData || { template: {} }}
        onOpenTimeline={() => {}}
        onResubmitProvider={({ templateId }) => {
          const tpl = rows.find((x) => x.id === templateId) || allForCh.find((x) => x.id === templateId);
          if (tpl) openProviderResubmit(tpl);
        }}
        onSubmitProvider={({ templateId }) => {
          const tpl = rows.find((x) => x.id === templateId) || allForCh.find((x) => x.id === templateId);
          if (tpl) openSubmitApproval(tpl);
        }}
        onOpenProviderPortal={(arg) => console.debug("open provider portal", arg)}
      />

      <ProviderSubmissionDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        details={submitDetails || { template: {}, providerStatuses: [], variants: [], history: [] }}
        graph={submitDetails?.graph}
        initialTab={submitInitialTab}
        onOpenTimeline={({ templateId }) => {
          const data = getDetails(templateId);
          setDetailsData(data);
          setDetailsOpen(true);
        }}
        onSubmitProvider={({ templateId, provider, selectedVariantIds, providerConfig, note }) => {
          console.debug("provider submit/resubmit", { templateId, provider, selectedVariantIds, providerConfig, note });
          setSubmitOpen(false);
        }}
      />
    </Stack>
  );
}
