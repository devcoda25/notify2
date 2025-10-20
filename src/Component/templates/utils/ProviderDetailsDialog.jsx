// Path: src/Component/templates/utils/approvals/ProviderDetailsDialog.jsx
// Update: remove mini timeline; add top-right "Open full timeline" button

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ExternalLink,
  RefreshCw,
  Send,
  RotateCcw,
  ListTree,
} from "lucide-react";

// Graph timeline + store
import GraphTimeline from "./GraphTimeline";
import useApprovalsStore from "../../store/templates/useApprovalsStore";

/* ---------------- helpers ---------------- */
const statusColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  if (["Submitted", "In-Review", "Pending"].includes(s)) return "warning";
  return "default";
};

function Section({ title, children, dense = false }) {
  return (
    <Box sx={{ mb: dense ? 1.25 : 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/**
 * Expected `details` shape:
 * {
 *   template,
 *   providerStatuses: [{ name, state, updatedAt, reason, externalId, lastSyncAt }],
 *   variants: [{
 *     id, name, lang, lastSubmittedAt,
 *     providerStates: { [providerName]: state }
 *   }],
 *   history: [{ state, at, by, note, commitId }]
 * }
 *
 * Callbacks (optional):
 * - onOpenProviderPortal({ templateId, provider })
 * - onSyncProviderStatus({ templateId, provider })
 * - onResubmitProvider({ templateId, provider, variantIds? })
 * - onSubmitProvider({ templateId, provider, variantIds? })
 * - onOpenTimeline({ templateId })
 * - onWithdrawSubmission({ templateId })
 */
export default function ProviderDetailsDialog({
  open,
  onClose,
  details = { template: {}, providerStatuses: [], variants: [], history: [] },

  onOpenProviderPortal,
  onSyncProviderStatus,
  onResubmitProvider,
  onSubmitProvider,
  onOpenTimeline, // optional parent listener
}) {
  const t = useTheme();
  const tpl = details.template || {};
  const providerMeta = details.providerStatuses || [];
  const providers = providerMeta.map((p) => p.name);
  const variants = details.variants || [];

  // Graph state + data
  const [graphOpen, setGraphOpen] = React.useState(false);
  const selectGraph = useApprovalsStore((s) => s.selectGraph);
  const graph = React.useMemo(() => (tpl?.id ? selectGraph?.(tpl.id) : null), [selectGraph, tpl?.id]);

  const variantLang = (v) => (v.lang || v.locale || "").toUpperCase();

  const providerToVariants = React.useMemo(() => {
    const idx = {};
    providers.forEach((p) => (idx[p] = []));
    for (const v of variants) {
      for (const [prov, st] of Object.entries(v.providerStates || {})) {
        if (!idx[prov]) idx[prov] = [];
        idx[prov].push({ id: v.id, name: v.name, lang: variantLang(v), state: st || "—" });
      }
    }
    return idx;
  }, [providers, variants]);

  const anyProviders = providers.length > 0;

  const handleSubmitProvider = (provider, variantIds) =>
    onSubmitProvider?.({ templateId: tpl.id, provider, variantIds });

  const handleResubmitProvider = (provider, variantIds) =>
    onResubmitProvider?.({ templateId: tpl.id, provider, variantIds });

  const cellActions = (provider, variantId, isSubmitted) => (
    <Stack direction="row" spacing={0.5}>
      {!isSubmitted ? (
        <Tooltip title="Submit this variant to provider">
          <IconButton size="small" onClick={() => handleSubmitProvider(provider, [variantId])}>
            <Send size={16} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Resubmit this variant to provider">
          <IconButton size="small" onClick={() => handleResubmitProvider(provider, [variantId])}>
            <RotateCcw size={16} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        {/* Title bar with right-aligned CTA */}
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Typography variant="h6" noWrap title={tpl.name || "Template"}>
                {tpl.name || "Template"}
              </Typography>
              {tpl.channel && <Chip size="small" sx={{ ml: 0.5 }} variant="outlined" label={tpl.channel} />}
              {tpl.type && <Chip size="small" sx={{ ml: 0.5 }} variant="outlined" label={tpl.type} />}
            </Stack>

            <Button
              size="small"
              startIcon={<ListTree size={16} />}
              onClick={() => {
                setGraphOpen(true);
                onOpenTimeline?.({ templateId: tpl.id });
              }}
            >
              Open full timeline
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            {/* Providers summary */}
            <Section title="Providers">
              <Stack spacing={1}>
                {anyProviders ? (
                  providerMeta.map((p) => {
                    const list = (providerToVariants[p.name] || []);
                    const submittedCount = list.filter((x) =>
                      ["Submitted", "In-Review", "Approved", "Rejected"].includes(x.state)
                    ).length;

                    return (
                      <Paper key={p.name} variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ rowGap: 1, flexWrap: "wrap" }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                            <Chip size="small" color={statusColor(p.state)} label={p.state || "—"} />
                            {p.externalId && <Chip size="small" variant="outlined" label={`ID: ${p.externalId}`} />}
                            <Chip size="small" variant="outlined" label={`${submittedCount}/${list.length || 0} variants touched`} />
                          </Stack>

                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Open provider portal">
                              <IconButton size="small" onClick={() => onOpenProviderPortal?.({ templateId: tpl.id, provider: p.name })}>
                                <ExternalLink size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sync statuses">
                              <IconButton size="small" onClick={() => onSyncProviderStatus?.({ templateId: tpl.id, provider: p.name })}>
                                <RefreshCw size={16} />
                              </IconButton>
                            </Tooltip>

                            {/* Bulk submit/resubmit */}
                            <Tooltip title="Submit all variants to this provider">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleSubmitProvider(p.name, variants.map((v) => v.id))}
                                >
                                  <Send size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Resubmit all previously submitted variants">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleResubmitProvider(
                                      p.name,
                                      variants
                                        .filter((v) =>
                                          ["Submitted", "In-Review", "Approved", "Rejected"].includes(v.providerStates?.[p.name])
                                        )
                                        .map((v) => v.id)
                                    )
                                  }
                                >
                                  <RotateCcw size={16} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                          {p.updatedAt ? `Updated: ${new Date(p.updatedAt).toLocaleString()}` : "Updated: —"}
                          {p.lastSyncAt ? ` • Last sync: ${new Date(p.lastSyncAt).toLocaleString()}` : ""}
                        </Typography>
                        {p.reason && <Typography variant="body2" sx={{ mt: 0.5 }}>{p.reason}</Typography>}
                      </Paper>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary">No provider data.</Typography>
                )}
              </Stack>
            </Section>

            <Divider />

            {/* Variants × Providers matrix */}
            <Section title="Variants × Providers">
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, width: 260 }}>Variant</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 140 }}>Variant ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 100 }}>Lang</TableCell>
                      {providers.map((p) => (
                        <TableCell key={`h-${p}`} sx={{ fontWeight: 600 }}>
                          {p}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variants.length ? (
                      variants.map((v) => (
                        <TableRow key={v.id} hover>
                          <TableCell sx={{ maxWidth: 280 }}>
                            <Stack spacing={0.25}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap title={v.name || v.id}>
                                {v.name || v.id}
                              </Typography>
                              {v.lastSubmittedAt && (
                                <Typography variant="caption" color="text.secondary">
                                  Last submitted: {new Date(v.lastSubmittedAt).toLocaleString()}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: "monospace" }}>{v.id}</Typography>
                          </TableCell>

                          <TableCell>
                            <Chip size="small" variant="outlined" label={variantLang(v) || "—"} />
                          </TableCell>

                          {providers.map((p) => {
                            const st = v.providerStates?.[p] || "—";
                            const isSubmitted = ["Submitted", "In-Review", "Approved", "Rejected"].includes(st);
                            return (
                              <TableCell key={`${v.id}-${p}`}>
                                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap" }}>
                                  <Chip size="small" color={statusColor(st)} label={st} />
                                  {cellActions(p, v.id, isSubmitted)}
                                </Stack>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3 + providers.length} align="center">
                          <Typography variant="body2" color="text.secondary">No variants.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Section>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Full Graph Timeline dialog */}
      <Dialog open={graphOpen} onClose={() => setGraphOpen(false)} fullWidth maxWidth="xl">
        <DialogTitle>{tpl?.name || tpl?.id} — Full Timeline</DialogTitle>
        <DialogContent dividers>
          <GraphTimeline templateId={tpl?.id} graph={graph} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGraphOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
