import React from "react";
import { LinearProgress, Box } from "@mui/material";

export default function LoadingBar() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  );
}
