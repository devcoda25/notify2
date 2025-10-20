// Path: src/Component/templates/utils/DiffViewer.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

/** Simple LCS-based line diff (unified/split) to avoid extra deps */
function diffLines(a = "", b = "") {
  const A = String(a).split("\n");
  const B = String(b).split("\n");
  const n = A.length, m = B.length;

  // LCS DP
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = A[i] === B[j] ? 1 + dp[i + 1][j + 1] : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  // Backtrack to build diff
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      out.push({ type: "same", a: A[i], b: B[j] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "del", a: A[i] });
      i++;
    } else {
      out.push({ type: "add", b: B[j] });
      j++;
    }
  }
  while (i < n) out.push({ type: "del", a: A[i++] });
  while (j < m) out.push({ type: "add", b: B[j++] });

  return out;
}

export default function DiffViewer({ before = "", after = "", initialMode = "unified", title = "Changes" }) {
  const t = useTheme();
  const [mode, setMode] = React.useState(initialMode); // 'unified' | 'split'
  const chunks = React.useMemo(() => diffLines(before, after), [before, after]);

  const Line = ({ kind, text, side }) => {
    const isAdd = kind === "add";
    const isDel = kind === "del";
    return (
      <Box
        sx={{
          px: 1,
          py: 0.25,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          whiteSpace: "pre-wrap",
          borderLeft: isAdd ? `3px solid ${t.palette.success.main}` : isDel ? `3px solid ${t.palette.error.main}` : `3px solid transparent`,
          bgcolor: isAdd
            ? alpha(t.palette.success.main, 0.06)
            : isDel
            ? alpha(t.palette.error.main, 0.06)
            : "transparent",
          color: side === "right" && isDel ? "text.disabled" : "inherit",
        }}
      >
        {text || "\u00A0"}
      </Box>
    );
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1.25 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Box flexGrow={1} />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode}
          onChange={(_, v) => v && setMode(v)}
        >
          <ToggleButton value="unified">Unified</ToggleButton>
          <ToggleButton value="split">Split</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {mode === "unified" ? (
        <Box sx={{ p: 1.25 }}>
          {chunks.map((c, i) => (
            <Line
              key={i}
              kind={c.type}
              text={c.type === "add" ? c.b : c.type === "del" ? c.a : c.a}
            />
          ))}
        </Box>
      ) : (
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ p: 1.25 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Before
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {chunks.map((c, i) => (
                <Line key={i} kind={c.type === "add" ? "same" : c.type} text={c.a ?? ""} side="left" />
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              After
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {chunks.map((c, i) => (
                <Line key={i} kind={c.type === "del" ? "same" : c.type} text={c.b ?? ""} side="right" />
              ))}
            </Box>
          </Box>
        </Stack>
      )}
    </Paper>
  );
}
