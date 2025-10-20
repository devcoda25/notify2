import React from "react";
import {
  Box, Paper, Stack, Typography, Chip, IconButton, Tooltip, Divider,
} from "@mui/material";
import { ZoomIn, ZoomOut, Minimize2 } from "lucide-react";
import {
  STATUS_COLORS,
  buildGraphFromDemo,
  formatTick,
  seedForestData,
  timeTicks,
  txFactoryForTimeZoom,
  cubicPath,
} from "./graphModel";

/**
 * GraphTimeline (git-like tree, SELF-SERVE)
 * - Seeds its own heavy dataset (ignores incoming props)
 * - Trunk centered; languages split into top & bottom halves (NOT mirrored)
 * - Wheel = zoom time (down to 5-minute windows), Drag = pan time,
 *   Shift+drag = vertical pan. Starts centered on trunk.
 * - user-select: none (all browsers)
 * - Each node shows: name(id) on top (gray), then label, sub
 */
export default function GraphTimeline({
  height = 540,
  onSelectNode,
}) {
  // Seed for header labels (graph itself is rebuilt via buildGraphFromDemo)
  const { template, variants } = React.useMemo(
    () => seedForestData(Date.now(), { heavy: true }),
    []
  );

  const graph = React.useMemo(
    () => buildGraphFromDemo({ width: 1600, height, laneGap: 80 }),
    [height]
  );

  // --- time zoom/pan ---
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState(0.5);
  const { tx, visibleMin, visibleMax, maxZoom } = React.useMemo(
    () => txFactoryForTimeZoom(graph, { zoom, pan }),
    [graph, zoom, pan]
  );
  const ticks = React.useMemo(
    () => timeTicks(visibleMin, visibleMax, graph, 7),
    [visibleMin, visibleMax, graph]
  );

  // --- vertical pan + auto-center on trunk at first render ---
  const [vPan, setVPan] = React.useState(0); // pixels offset
  const vInit = React.useRef(false);
  React.useEffect(() => {
    if (graph?.laneY && !vInit.current) {
      // center trunk (lane 0) vertically within the viewport height
      const trunkY = graph.laneY(0);
      const center = graph.height / 2;
      setVPan(center - trunkY);
      vInit.current = true;
    }
  }, [graph]);

  // Compute vertical clamp (prevent getting lost)
  const totalGraphHeight = React.useMemo(() => {
    return graph.padding.top + graph.orderedLanes.length * graph.laneGap + graph.padding.bottom;
  }, [graph]);
  const maxOffsetDown = (graph.height - totalGraphHeight) / 2; // usually negative
  const maxOffsetUp   = -maxOffsetDown;
  const clampVPan = React.useCallback(
    (p) => Math.max(maxOffsetDown, Math.min(maxOffsetUp, p)),
    [maxOffsetDown, maxOffsetUp]
  );

  // wheel zoom around cursor time (restored behavior: no extra guards)
  const svgRef = React.useRef(null);
  const handleWheel = (e) => {
    e.preventDefault();
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const cursorT = tx.invert(x);

    const delta = Math.sign(e.deltaY);
    const zTargetUnclamped = delta > 0 ? zoom * 0.9 : zoom * 1.1;
    const zTarget = Math.max(1, Math.min(maxZoom, zTargetUnclamped));

    // anchor cursor time while zooming
    const [fullMin, fullMax] = graph.extent;
    const fullSpan = fullMax - fullMin;
    const vSpanOld = fullSpan / zoom;
    const vSpanNew = fullSpan / zTarget;
    const vMinOld = visibleMin;
    const rel = (cursorT - vMinOld) / vSpanOld;

    let vMinNew = cursorT - rel * vSpanNew;
    vMinNew = Math.max(fullMin, Math.min(fullMax - vSpanNew, vMinNew));
    const newPan = (vMinNew - fullMin) / (fullSpan - vSpanNew);

    setZoom(zTarget);
    setPan(newPan);
  };

  // drag: pan time (default) or vertical (Shift) — throttled with rAF
  const drag = React.useRef({ active: false, x0: 0, y0: 0, t0: 0, v0: 0, shift: false });
  const rafRef = React.useRef(null);
  const schedule = (fn) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(fn);
  };
  React.useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const onDown = (e) => {
    drag.current = {
      active: true,
      x0: e.clientX,
      y0: e.clientY,
      t0: visibleMin,
      v0: vPan,
      shift: e.shiftKey,
    };
  };
  const onMove = (e) => {
    if (!drag.current.active || !svgRef.current) return;
    schedule(() => {
      const dx = e.clientX - drag.current.x0;
      const dy = e.clientY - drag.current.y0;

      if (drag.current.shift) {
        setVPan(clampVPan(drag.current.v0 + dy));
        return;
      }

      // horizontal (time) pan
      const [fullMin, fullMax] = graph.extent;
      const fullSpan = fullMax - fullMin;
      const vSpan = fullSpan / zoom;

      // convert dx to time delta
      const dt = tx.invert(0) - tx.invert(dx);
      let vMin = drag.current.t0 + dt;
      vMin = Math.max(fullMin, Math.min(fullMax - vSpan, vMin));
      const newPan = (vMin - fullMin) / (fullSpan - vSpan);
      setPan(newPan);
    });
  };
  const onUp = () => (drag.current.active = false);

  const viewBox = `${0} ${0} ${graph.width} ${graph.height}`;
  const linkStroke = (type) => (type === "fork" ? "#64748b" : "#cbd5e1");

  // Pre-compute lane→label once (cheap map)
  const laneLang = React.useMemo(() => {
    const m = new Map();
    for (const n of graph.nodes) {
      if (n.lane === 0) continue;
      if (n.variantId && !m.has(n.lane)) {
        // find variant
        const v = variants.find(vv => vv.id === n.variantId);
        if (v) m.set(n.lane, (v.lang || v.id || `branch-${n.lane}`).toUpperCase());
      }
    }
    m.set(0, "TRUNK");
    return m;
  }, [graph.nodes, variants]);

  const laneLabel = (lane) => laneLang.get(lane) || (lane === 0 ? "TRUNK" : `BR-${lane}`);

  const DESTRUCTIVE_ACTIONS = new Set(["reject", "deprecate", "delete", "archive"]);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 0.75 }}>
        <Typography variant="subtitle2" noWrap title={template?.name || template?.id}>
          {template?.name || template?.id || "Timeline"} (demo tree)
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Legend */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1, display: { xs: "none", sm: "flex" } }}>
            {["Created","Edited","Submitted","In-Review","Approved","Rejected","Deprecated"].map((s) => (
              <Chip
                key={s}
                size="small"
                label={s}
                sx={{
                  bgcolor: `${STATUS_COLORS[s] || STATUS_COLORS.default}20`,
                  color: STATUS_COLORS[s] || STATUS_COLORS.default,
                  border: "1px solid currentColor",
                }}
                variant="outlined"
              />
            ))}
          </Stack>

          <Tooltip title="Zoom in (time)">
            <IconButton size="small" onClick={() =>
              setZoom((z) => Math.min(z * 1.15, maxZoom))
            }>
              <ZoomIn size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out (time)">
            <IconButton size="small" onClick={() =>
              setZoom((z) => Math.max(1, z / 1.15))
            }>
              <ZoomOut size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset view">
            <IconButton size="small" onClick={() => { setZoom(1); setPan(0.5); setVPan(0); }}>
              <Minimize2 size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider />

      {/* Graph */}
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          cursor: drag.current.active ? "grabbing" : "grab",
          // prevent accidental selection while dragging (all browsers)
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          "& *": {
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          },
        }}
        onWheel={handleWheel}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height={graph.height}
          viewBox={viewBox}
          style={{ display: "block" }}
        >
          {/* Lanes (truly centered trunk; apply vertical pan) */}
          {graph.orderedLanes.map((lane) => {
            const y = graph.laneY(lane) + vPan;
            return (
              <g key={`lane-${lane}`}>
                <line
                  x1={graph.padding.left}
                  x2={graph.width - graph.padding.right}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4 4"
                />
                <text x={8} y={y + 4} fontSize="10" fill="#6b7280">
                  {laneLabel(lane)}
                </text>
              </g>
            );
          })}

          {/* Time ticks */}
          {ticks.map((tk) => (
            <g key={tk.t}>
              <line
                x1={tx(tk.t)}
                x2={tx(tk.t)}
                y1={graph.padding.top / 2}
                y2={graph.height - graph.padding.bottom}
                stroke="#f3f4f6"
              />
              <text
                x={tx(tk.t) + 4}
                y={graph.padding.top / 2 - 4}
                fontSize="10"
                fill="#6b7280"
              >
                {formatTick(tk.t, tk.unit)}
              </text>
            </g>
          ))}

          {/* Edges */}
          {graph.links.map((e, i) => {
            const x1 = tx(e.t1);
            const x2 = tx(e.t2);
            const y1 = graph.laneY(e.l1) + vPan;
            const y2 = graph.laneY(e.l2) + vPan;
            const d = e.sameLane ? `M ${x1} ${y1} L ${x2} ${y2}` : cubicPath(x1, y1, x2, y2);
            return (
              <path
                key={`${e.source}->${e.target}-${i}`}
                d={d}
                fill="none"
                stroke={linkStroke(e.type)}
                strokeWidth={e.type === "progress" ? 2 : 2.5}
                opacity={e.type === "progress" ? 0.85 : 1}
              />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((n) => {
            const x = tx(n.at);
            const y = graph.laneY(n.lane) + vPan;

            const isDestructive =
              (n.action && ["reject","deprecate","delete","archive"].includes((n.action || "").toLowerCase())) ||
              ["Rejected","Deprecated"].includes(n.state);

            const fill = isDestructive
              ? (STATUS_COLORS[n.state] || "#dc2626")
              : (n.synthetic ? "#fff" : (STATUS_COLORS[n.state] || STATUS_COLORS.default));

            const stroke = n.synthetic ? STATUS_COLORS.Edited : "#fff";

            return (
              <g
                key={n.id}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectNode?.(n)}
              >
                {/* larger invisible hit target for easier clicking */}
                <circle r={12} fill="transparent" />
                <circle r={7} fill={fill} stroke={stroke} strokeWidth={2} />

                {/* TOP: name(id) in gray (replaces old tag/id line) */}
                <text x={10} y="-9" fontSize="10" fill="#6b7280">
                  {`${n.name}(${n.id})`}
                </text>

                {/* main label */}
                <text x={10} y="4" fontSize="11" fill="#111827">
                  {n.label}
                </text>

                {/* sub label */}
                <text x={10} y="18" fontSize="10" fill="#6b7280">
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Paper>
  );
}
