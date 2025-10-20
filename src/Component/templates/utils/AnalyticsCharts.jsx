// Path: src/Component/templates/utils/AnalyticsCharts.jsx

import React from "react";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";

/**
 * Lightweight, dependency-free chart primitives (SVG-based).
 * Components:
 *  - <SeriesChart data xKey yKey />
 *  - <SparkBar data valueKey />
 *  - <DonutChart data [{label, value}] />
 */

function useBounds(data, xKey, yKey) {
  return React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
    }
    const xs = data.map((d) => d[xKey]);
    const ys = data.map((d) => Number(d[yKey] ?? 0));
    // Try parse date-like x values
    const parseX = (v) => (v instanceof Date ? v.getTime() : isNaN(+v) ? xs.indexOf(v) : +v);
    const xnums = xs.map(parseX);
    const xmin = Math.min(...xnums);
    const xmax = Math.max(...xnums);
    const ymin = Math.min(0, Math.min(...ys));
    const ymax = Math.max(...ys);
    return { xmin, xmax: xmin === xmax ? xmin + 1 : xmax, ymin, ymax: ymin === ymax ? ymax + 1 : ymax };
  }, [data, xKey, yKey]);
}

export function SeriesChart({
  data = [],
  xKey = "x",
  yKey = "y",
  height = 220,
  yTicks = 4,
  xLabelFormatter,
  yLabelFormatter = (v) => Intl.NumberFormat().format(v),
  strokeWidth = 2,
}) {
  const t = useTheme();
  const pad = 32;
  const w = 760;
  const h = height;

  const { xmin, xmax, ymin, ymax } = useBounds(data, xKey, yKey);

  const xScale = (v) => {
    const n = v instanceof Date ? v.getTime() : isNaN(+v) ? data.findIndex((d) => d[xKey] === v) : +v;
    return pad + ((n - xmin) / (xmax - xmin)) * (w - pad * 2);
  };
  const yScale = (v) => h - pad - ((v - ymin) / (ymax - ymin)) * (h - pad * 2);

  const pathD = React.useMemo(() => {
    if (!data.length) return "";
    const pts = data.map((d) => [xScale(d[xKey]), yScale(+d[yKey] || 0)]);
    return pts.reduce((acc, [x, y], i) => acc + (i ? ` L ${x} ${y}` : `M ${x} ${y}`), "");
  }, [data, xKey, yKey, xmin, xmax, ymin, ymax]);

  const grid = Array.from({ length: yTicks + 1 }, (_, i) => ymin + (i * (ymax - ymin)) / yTicks);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <svg width={w} height={h} role="img" aria-label="Series chart">
        {/* Bg */}
        <rect x="0" y="0" width={w} height={h} fill={alpha(t.palette.primary.main, 0.02)} />
        {/* Grid */}
        {grid.map((gy, i) => {
          const y = yScale(gy);
          return (
            <g key={i}>
              <line
                x1={pad}
                y1={y}
                x2={w - pad}
                y2={y}
                stroke={alpha(t.palette.divider, 0.7)}
                strokeDasharray="4,4"
              />
              <text
                x={8}
                y={y + 4}
                fontSize="10"
                fill={alpha(t.palette.text.secondary, 0.9)}
              >
                {yLabelFormatter(gy)}
              </text>
            </g>
          );
        })}
        {/* Axis */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={t.palette.divider} />
        {/* X labels (first, mid, last) */}
        {data.length > 0 &&
          [0, Math.floor(data.length / 2), data.length - 1].map((idx) => {
            const d = data[idx];
            const x = xScale(d[xKey]);
            const label =
              xLabelFormatter?.(d[xKey]) ??
              (d[xKey] instanceof Date
                ? d[xKey].toLocaleDateString()
                : String(d[xKey]));
            return (
              <text
                key={idx}
                x={x}
                y={h - pad + 14}
                textAnchor="middle"
                fontSize="10"
                fill={alpha(t.palette.text.secondary, 0.9)}
              >
                {label}
              </text>
            );
          })}
        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={t.palette.primary.main}
          strokeWidth={strokeWidth}
        />
        {/* Points */}
        {data.map((d, i) => {
          const x = xScale(d[xKey]);
          const y = yScale(+d[yKey] || 0);
          return <circle key={i} cx={x} cy={y} r={2.5} fill={t.palette.primary.main} />;
        })}
      </svg>
    </Box>
  );
}

export function SparkBar({ data = [], valueKey = "value", height = 36 }) {
  const t = useTheme();
  const w = 140;
  const pad = 4;
  const values = data.map((d) => Number(d[valueKey] || 0));
  const vmax = Math.max(1, ...values);
  const bw = (w - pad * 2) / (data.length || 1);
  return (
    <svg width={w} height={height} role="img" aria-label="Spark bars">
      <rect x="0" y="0" width={w} height={height} fill="transparent" />
      {data.map((d, i) => {
        const v = Number(d[valueKey] || 0);
        const bh = Math.max(2, ((height - pad * 2) * v) / vmax);
        const x = pad + i * bw;
        const y = height - pad - bh;
        return (
          <rect
            key={i}
            x={x + 1}
            y={y}
            width={bw - 2}
            height={bh}
            rx={2}
            fill={alpha(t.palette.primary.main, 0.6)}
          />
        );
      })}
    </svg>
  );
}

export function DonutChart({ data = [], size = 120, stroke = 14, formatter = (v) => v }) {
  const t = useTheme();
  const total = data.reduce((a, b) => a + (b.value || 0), 0) || 1;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;

  let acc = 0;
  const segs = data.map((d, i) => {
    const frac = (d.value || 0) / total;
    const val = frac * Math.PI * 2;
    const start = acc;
    const end = (acc += val);
    const largeArc = end - start > Math.PI ? 1 : 0;

    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);

    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    const hue = (i * 47) % 360;
    return { path, hue, frac, label: d.label, value: d.value };
  });

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha(t.palette.divider, 0.7)} strokeWidth={stroke} />
        {segs.map((s, i) => (
          <g key={i} transform={`translate(0,0)`}>
            <path
              d={s.path}
              fill="none"
              stroke={`hsl(${s.hue} 70% 45%)`}
              strokeWidth={stroke}
              strokeLinecap="butt"
            />
          </g>
        ))}
        <text x={cx} y={cy} dy="4" textAnchor="middle" fontSize="12" fill={t.palette.text.secondary}>
          {formatter(total)}
        </text>
      </svg>
      <Stack spacing={0.5}>
        {data.map((d, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: `hsl(${(i * 47) % 360} 70% 45%)` }} />
            <Typography variant="body2" sx={{ minWidth: 120 }}>{d.label}</Typography>
            <Typography variant="body2" color="text.secondary">{formatter(d.value)}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

const AnalyticsCharts = { SeriesChart, SparkBar, DonutChart };
export default AnalyticsCharts;
