// Path: src/Component/templates/utils/TemplateRowActions.jsx

import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  MoreHorizontal,
  Eye,
  Copy,
  Archive,
  Send,
  RotateCcw,
  ListTree,
  Ban,
} from "lucide-react";

/**
 * Unified actions:
 * - onSubmitApproval (internal/provider handled by dialog)
 * - onResubmitProvider
 * - onWithdrawSubmission (shown only when context==='approvals' & in-flight)
 * - onOpenTimeline
 * - onOpenInApprovals
 */
export default function TemplateRowActions({
  template,
  onOpen,
  onClone,
  onArchive,
  onTest,

  onSubmitApproval,
  onResubmitProvider,
  onWithdrawSubmission,

  onOpenTimeline,
  onOpenInApprovals,

  context = "all",
}) {
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  const status = template?.status || template?.state || "Draft";
  const isApproved = status === "Approved";
  const isRejected = status === "Rejected";
  const isInFlight = ["Submitted", "In-Review", "Pending"].includes(status);

  const stop = (e) => {
    e.stopPropagation();
  };

  const items = [
    { key: "open", label: "Open", icon: <Eye size={16} />, onClick: () => onOpen?.(template), show: !!onOpen },
    { key: "test", label: "Send Test", icon: <Send size={16} />, onClick: () => onTest?.(template), show: !!onTest },
    { key: "clone", label: "Clone", icon: <Copy size={16} />, onClick: () => onClone?.(template), show: !!onClone },

    {
      key: "submitApproval",
      label: "Submit for approval",
      icon: <Send size={16} />,
      onClick: () => onSubmitApproval?.(template),
      show: !!onSubmitApproval && !isApproved,
    },
    {
      key: "resubmitProvider",
      label: "Resubmit to provider",
      icon: <RotateCcw size={16} />,
      onClick: () => onResubmitProvider?.(template),
      show: !!onResubmitProvider && isRejected,
    },
    {
      key: "withdraw",
      label: "Withdraw submission",
      icon: <Ban size={16} />,
      onClick: () => onWithdrawSubmission?.(template),
      show: !!onWithdrawSubmission && isInFlight && context === "approvals",
    },

    {
      key: "timeline",
      label: "View timeline",
      icon: <ListTree size={16} />,
      onClick: () => onOpenTimeline?.(template),
      show: !!onOpenTimeline,
    },
    {
      key: "openApprovals",
      label: "Open in Approvals Center",
      icon: <ListTree size={16} />,
      onClick: () => onOpenInApprovals?.(template),
      show: !!onOpenInApprovals && context !== "approvals",
    },

    { key: "archive", label: "Archive", icon: <Archive size={16} />, onClick: () => onArchive?.(template), show: !!onArchive && context !== "approvals" },
  ].filter((i) => i.show);

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={(e) => {
            stop(e);
            setAnchor(e.currentTarget);
          }}
          onMouseDown={stop}
          onKeyDown={stop}
        >
          <MoreHorizontal size={16} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={(e) => {
          setAnchor(null);
        }}
        // keep menu clicks from bubbling to CardActionArea
        onClick={stop}
      >
        {items.map((m) => (
          <MenuItem
            key={m.key}
            onClick={(e) => {
              stop(e);
              setAnchor(null);
              m.onClick?.();
            }}
          >
            <ListItemIcon>{m.icon}</ListItemIcon>
            <ListItemText primary={m.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
