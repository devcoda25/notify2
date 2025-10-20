// Path: src/Component/templates/views/ApprovalsCenterView.jsx

import React from "react";
import { Grid, Stack, Paper, Box, Select, MenuItem, Pagination, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import TemplatesTopNav from "../layout/TemplatesTopNav";
import ProviderApprovalsTable from "../utils/ProviderApprovalsTable";
import ProviderDetailsDialog from "../utils/ProviderDetailsDialog";
import ProviderSubmissionDialog from "../utils/ProviderSubmissionDialog";
import TemplateCard from "../utils/TemplateCard";

import useTemplatesStore from "../../store/templates/useTemplatesStore";
import useApprovalsStore from "../../store/templates/useApprovalsStore";

import PROVIDERS_BY_CHANNEL from "../constants/PROVIDERS_BY_CHANNEL";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";

/* helpers */
const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

const toProviderStatuses = (tpl, approvals) => {
  const ch = normalizeChannel(tpl?.channel);
  const providers = (PROVIDERS_BY_CHANNEL[ch] || []).length ? PROVIDERS_BY_CHANNEL[ch] : ["Internal Review"];
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
  const raw = tpl?.variants || tpl?.translations || [];
  const fromTemplate = Array.isArray(raw) ? raw : [];
  const vp = approvals?.[tpl.id]?.variantProviders || {};
  const providers = PROVIDERS_BY_CHANNEL[normalizeChannel(tpl?.channel)] || [];

  return (fromTemplate.length ? fromTemplate : [{ id: `${tpl.id}-base`, name: tpl?.name || `${tpl.id}-base`, lang: "" }]).map((v) => {
    const id = v.id || `${tpl.id}-${(v.lang || v.language || v.locale || "base").toLowerCase()}`;
    const lang = (v.lang || v.language || v.locale || "").toLowerCase();
    const variantStates = vp?.[id] || {};
    const providerStates = {};
    (providers.length ? providers : Object.keys(variantStates)).forEach((p) => {
      providerStates[p] = variantStates?.[p]?.state || "—";
    });
    return { id, name: v.name || tpl.name, lang, lastSubmittedAt: variantStates?.lastSubmittedAt || null, providerStates };
  });
};

export default function ApprovalsCenterView({
  onOpenTemplate,
  initialTab = "all",
  initialState = APPROVAL_STATES.SUBMITTED,
  onCreateTemplate,
}) {
  const theme = useTheme();

  const templates = useTemplatesStore((s) => s.templates) || [];
  const seedDemoIfSparse = useTemplatesStore((s) => s.seedDemoIfSparse);
  const query = useTemplatesStore((s) => s.query || "");
  const setQuery = useTemplatesStore((s) => s.setQuery);

  const approvals = useApprovalsStore((s) => s.approvals) || {};
  const ensureForTemplates = useApprovalsStore((s) => s.ensureForTemplates);
  const seedDemoForTemplates = useApprovalsStore((s) => s.seedDemoForTemplates);

  const deriveHistory = useApprovalsStore((s) => s.deriveHistory);
  const selectGraph = useApprovalsStore((s) => s.selectGraph);

  const [tab, setTab] = React.useState(initialTab);
  const [mode, setMode] = React.useState("table");
  const [statusFilter, setStatusFilter] = React.useState(initialState);
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(25);

  // details dialog
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsData, setDetailsData] = React.useState(null);

  // submission dialog
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [submitDetails, setSubmitDetails] = React.useState(null);
  const [submitInitialTab, setSubmitInitialTab] = React.useState("overview");

  React.useEffect(() => { seedDemoIfSparse(); }, [seedDemoIfSparse]);
  React.useEffect(() => { ensureForTemplates(templates); }, [templates, ensureForTemplates]);
  React.useEffect(() => { seedDemoForTemplates(templates); }, [templates, seedDemoForTemplates]);

  React.useEffect(() => setTab(initialTab), [initialTab]);
  React.useEffect(() => setStatusFilter(initialState), [initialState]);

  const statusOf = (t) => approvals?.[t.id]?.state || t.status || t.state || "Draft";

  const inDateWindow = (iso) => {
    if (!iso) return !(dateFrom || dateTo);
    const ts = new Date(iso).getTime();
    if (dateFrom && ts < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
    if (dateTo && ts > new Date(`${dateTo}T23:59:59`).getTime()) return false;
    return true;
  };

  const filtered = React.useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const base = templates.filter((t) => (statusFilter === "all" ? true : statusOf(t) === statusFilter));
    const byChannel = tab === "all" ? base : base.filter((t) => normalizeChannel(t.channel) === normalizeChannel(tab));
    return byChannel
      .filter((t) => {
        if (q) {
          const hit = t.name?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || (t.tags || []).some((tg) => tg.toLowerCase().includes(q));
          if (!hit) return false;
        }
        if (typeFilter !== "all" && t.type !== typeFilter) return false;
        if (!inDateWindow(t.updatedAt)) return false;
        return true;
      })
      .map((t) => ({ ...t, status: statusOf(t) }))
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
  }, [templates, approvals, query, statusFilter, typeFilter, tab, dateFrom, dateTo]);

  const rows = React.useMemo(() => {
    return filtered.map((t) => {
      const rec = approvals?.[t.id] || {};
      const submittedAt = rec.submittedAt || null;
      const providerMeta = rec.providers || rec.providerStates || {};
      const lastSyncAt = Object.values(providerMeta || {}).reduce((acc, p) => {
        const ts = p?.lastSyncAt ? new Date(p.lastSyncAt).getTime() : 0;
        return Math.max(acc, ts);
      }, 0);
      return {
        id: t.id,
        templateId: t.id,
        templateName: t.name,
        channel: normalizeChannel(t.channel),
        submittedAt,
        lastSyncAt: lastSyncAt ? new Date(lastSyncAt).toISOString() : null,
        status: statusOf(t),
      };
    });
  }, [filtered, approvals]);

  const getDetails = React.useCallback(
    (templateId) => {
      const tpl = filtered.find((t) => t.id === templateId) || templates.find((t) => t.id === templateId);
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
    [filtered, templates, approvals, selectGraph, deriveHistory]
  );

  const handleOpenDetails = (row) => {
    const data = getDetails(row.templateId);
    setDetailsData(data);
    setDetailsOpen(true);
  };

  // unified submit for approvals center
  const openSubmitApproval = (tpl) => {
    const data = getDetails(tpl.id);
    const ch = normalizeChannel(tpl.channel);
    const hasProviders = (PROVIDERS_BY_CHANNEL[ch] || []).length > 0;
    setSubmitDetails(data);
    setSubmitInitialTab(hasProviders ? "submit-provider" : "submit-internal");
    setSubmitOpen(true);
  };
  const openProviderResubmit = openSubmitApproval;
  const openWithdraw = (tpl) => {
    const data = getDetails(tpl.id);
    setSubmitDetails(data);
    setSubmitInitialTab("withdraw");
    setSubmitOpen(true);
  };

  const onOpenTimeline = (arg) => {
    const data = getDetails(arg.templateId || arg.id);
    setDetailsData(data);
    setDetailsOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const clampedPage = Math.min(page, totalPages - 1);

  return (
    <Stack spacing={1.5}>
      <TemplatesTopNav
        tabValue={tab}
        onTabChange={(v) => { setTab(v); setPage(0); }}
        showAllTabs
        onCreateTemplate={onCreateTemplate}
        query={query}
        onQueryChange={setQuery}
        typeValue={typeFilter}
        onTypeChange={setTypeFilter}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        mode={mode}
        onModeChange={setMode}
      />

      {mode === "table" ? (
        <ProviderApprovalsTable
          rows={rows}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onOpenTemplate={(id) => onOpenTemplate?.(id)}
          onOpenDetails={handleOpenDetails}
          onResubmitProvider={(row) => openProviderResubmit({ id: row.templateId })}
          onWithdrawSubmission={(row) => openWithdraw({ id: row.templateId })}
          onOpenTimeline={onOpenTimeline}
          onOpenProviderPortal={(arg) => console.debug("open provider portal", arg)}
          getDetails={getDetails}
          onOpenProviderSubmit={(row) => openSubmitApproval({ id: row.templateId })}
        />
      ) : (
        <>
          <Grid container spacing={1.5}>
            {filtered.slice(clampedPage * pageSize, clampedPage * pageSize + pageSize).map((t) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
                <TemplateCard
                  template={t}
                  onOpen={(tpl) => onOpenTemplate?.(tpl.id)}
                  onSubmitApproval={openSubmitApproval}
                  onResubmitProvider={openProviderResubmit}
                  onWithdrawSubmission={openWithdraw}
                  onOpenTimeline={(tpl) => onOpenTimeline(tpl)}
                  onOpenInApprovals={() => {}}
                  providerStatuses={toProviderStatuses(t, approvals)}
                  context="approvals"
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
        onOpenTimeline={onOpenTimeline}
        onResubmitProvider={({ templateId }) => openProviderResubmit({ id: templateId })}
        onSubmitProvider={({ templateId }) => openSubmitApproval({ id: templateId })}
        onWithdrawSubmission={({ templateId }) => openWithdraw({ id: templateId })}
        onOpenProviderPortal={(arg) => console.debug("open provider portal", arg)}
      />

      <ProviderSubmissionDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        details={submitDetails || { template: {}, providerStatuses: [], variants: [], history: [] }}
        graph={submitDetails?.graph}
        initialTab={submitInitialTab}
        onOpenTimeline={({ templateId }) => onOpenTimeline({ templateId })}
        onSubmitInternal={({ templateId, approver, note }) => {
          console.debug("submit internal", { templateId, approver, note });
          setSubmitOpen(false);
        }}
        onSubmitProvider={({ templateId, provider, selectedVariantIds, providerConfig, note }) => {
          console.debug("submit provider", { templateId, provider, selectedVariantIds, providerConfig, note });
          setSubmitOpen(false);
        }}
        onWithdrawSubmission={({ templateId }) => {
          console.debug("withdraw", { templateId });
          setSubmitOpen(false);
        }}
      />
    </Stack>
  );
}
