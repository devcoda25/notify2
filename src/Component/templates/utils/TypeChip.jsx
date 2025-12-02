// Path: src/Component/templates/utils/TypeChip.jsx

import React from "react";
import { Chip } from "@mui/material";

export default function TypeChip({ type }) {
  const typeStr = String(type || "").toUpperCase();
  const color =
    typeStr === "GREEN" ? "success" :
    typeStr === "YELLOW" ? "warning" :
    typeStr === "RED" ? "error" :
    typeStr === "BLUE" ? "info" :
    "default";
  
  return <Chip size="small" color={color} label={type || "—"} />;
}
