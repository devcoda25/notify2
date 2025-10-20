// Path: src/Component/templates/utils/ApprovalStatusChip.jsx

import React from "react";
import { Chip, Tooltip } from "@mui/material";
import { CheckCircle2, Clock3, XCircle, FileEdit, AlertTriangle } from "lucide-react";
import APPROVAL_STATES from "../constants/APPROVAL_STATES";

const ICONS = {
  [APPROVAL_STATES.APPROVED]: CheckCircle2,
  [APPROVAL_STATES.REJECTED]: XCircle,
  [APPROVAL_STATES.IN_REVIEW]: Clock3,
  [APPROVAL_STATES.SUBMITTED]: Clock3,
  [APPROVAL_STATES.DRAFT]: FileEdit,
};

const COLORS = {
  [APPROVAL_STATES.APPROVED]: "success",
  [APPROVAL_STATES.REJECTED]: "error",
  [APPROVAL_STATES.IN_REVIEW]: "warning",
  [APPROVAL_STATES.SUBMITTED]: "warning",
  [APPROVAL_STATES.DRAFT]: "default",
};

export default function ApprovalStatusChip({ status = APPROVAL_STATES.DRAFT, size = "small" }) {
  const Icon = ICONS[status] || AlertTriangle;
  const color = COLORS[status] || "default";
  return (
    <Tooltip title={`Status: ${status}`}>
      <Chip
        size={size}
        color={color}
        icon={<Icon size={14} />}
        label={status}
        variant={color === "default" ? "outlined" : "filled"}
      />
    </Tooltip>
  );
}
