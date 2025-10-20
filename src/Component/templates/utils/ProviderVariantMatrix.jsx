// Path: src/Component/templates/utils/approvals/ProviderVariantMatrix.jsx

import React from "react";
import {
  Box, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Typography,
} from "@mui/material";
import { RefreshCw, RotateCcw, ExternalLink, Send, Ban, MoreHorizontal } from "lucide-react";

/* Map state -> chip color */
const statusColor = (s) => {
  if (s === "Approved") return "success";
  if (s === "Rejected") return "error";
  if (["Submitted", "In-Review", "Pending"].includes(s)) return "warning";
  return "default";
};

/* Mutually exclusive action sets by state */
function actionsForState(state) {
  if (state === "Rejected") return ["resubmit", "sync", "portal"];
  if (state === "Approved") return ["sync", "portal"];
  if (state === "Submitted" || state === "In-Review") return ["withdraw", "sync", "portal"];
  if (state === "Pending" || state === "—") return ["submit", "sync", "portal"];
  return ["sync", "portal"];
}

export default function ProviderVariantMatrix({
  templateId,
  providers = [], // [{ name, state, ... }]
  variants = [],  // [{ id, name, lang, lastSubmittedAt, providerStates: { [prov]: state } }]
  onSyncProviderStatus,
  onResubmitProvider,
  onWithdrawSubmission,
  onOpenProviderPortal,
  onSubmitProvider, // optional
}) {
  // One shared anchor+context works fine; menu only opens for the clicked cell
  const [anchor, setAnchor] = React.useState(null);
  const [ctx, setCtx] = React.useState(null); // { provider, variantId, state }

  const openMenu = (e, provider, variantId, state) => {
    setAnchor(e.currentTarget);
    setCtx({ provider, variantId, state });
  };
  const closeMenu = () => { setAnchor(null); setCtx(null); };

  const handle = (type) => {
    if (!ctx) return;
    const payload = { templateId, provider: ctx.provider, variantId: ctx.variantId };
    if (type === "sync") onSyncProviderStatus?.(payload);
    if (type === "resubmit") onResubmitProvider?.(payload);
    if (type === "withdraw") onWithdrawSubmission?.(payload);
    if (type === "submit") onSubmitProvider?.(payload);
    if (type === "portal") onOpenProviderPortal?.(payload);
    closeMenu();
  };

  const providerNames = providers.map((p) => p.name);

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>Variant</TableCell>
            <TableCell>Lang</TableCell>
            {providerNames.map((p) => (
              <TableCell key={`ph-${p}`}>{p}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.map((v) => {
            const lang = (v.lang || v.language || v.locale || "").toUpperCase();
            const last = v.lastSubmittedAt ? new Date(v.lastSubmittedAt).toLocaleString() : null;
            return (
              <TableRow key={v.id}>
                <TableCell sx={{ whiteSpace: "nowrap", maxWidth: 340 }}>
                  <Typography variant="body2" noWrap title={v.name || v.id}>
                    {v.name || v.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {last ? `Last submitted: ${last}` : "—"}
                  </Typography>
                </TableCell>
                <TableCell>{lang || "—"}</TableCell>

                {providerNames.map((p) => {
                  const s = (v.providerStates || {})[p] || "—";
                  const allowed = actionsForState(s);
                  return (
                    <TableCell key={`${v.id}-${p}`}>
                      <Chip size="small" variant="outlined" color={statusColor(s)} label={s} />
                      <Tooltip title="Actions">
                        <IconButton size="small" onClick={(e) => openMenu(e, p, v.id, s)} sx={{ ml: 0.5 }}>
                          <MoreHorizontal size={14} />
                        </IconButton>
                      </Tooltip>

                      <Menu
                        anchorEl={anchor}
                        open={Boolean(anchor) && ctx && ctx.provider === p && ctx.variantId === v.id}
                        onClose={closeMenu}
                      >
                        {allowed.includes("submit") && (
                          <MenuItem onClick={() => handle("submit")}>
                            <ListItemIcon><Send size={16} /></ListItemIcon>
                            <ListItemText primary="Submit variant" />
                          </MenuItem>
                        )}
                        {allowed.includes("resubmit") && (
                          <MenuItem onClick={() => handle("resubmit")}>
                            <ListItemIcon><RotateCcw size={16} /></ListItemIcon>
                            <ListItemText primary="Resubmit" />
                          </MenuItem>
                        )}
                        {allowed.includes("withdraw") && (
                          <MenuItem onClick={() => handle("withdraw")}>
                            <ListItemIcon><Ban size={16} /></ListItemIcon>
                            <ListItemText primary="Withdraw" />
                          </MenuItem>
                        )}
                        {allowed.includes("sync") && (
                          <MenuItem onClick={() => handle("sync")}>
                            <ListItemIcon><RefreshCw size={16} /></ListItemIcon>
                            <ListItemText primary="Sync status" />
                          </MenuItem>
                        )}
                        {allowed.includes("portal") && (
                          <MenuItem onClick={() => handle("portal")}>
                            <ListItemIcon><ExternalLink size={16} /></ListItemIcon>
                            <ListItemText primary="Open provider portal" />
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
