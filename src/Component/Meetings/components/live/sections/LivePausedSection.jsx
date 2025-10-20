// Path: /src/Component/Meetings/components/live/sections/LivePausedSection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stack, Box, Button, Typography, Chip, Avatar, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Play, PhoneOff, CircleDot } from "lucide-react";
import { ParticipantTile } from "../tiles";

/* ===========================================
   Draggable self PiP — default bottom-right
   =========================================== */
export function DraggableSelfTile({
  self,
  containerRef,
  hidden = false,
  initialCorner = "br", // tl | tr | bl | br
  margin = 18,
  size = { w: 176, h: 110 },
}) {
  const [pos, setPos] = useState(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const pending = useRef({ dx: 0, dy: 0 });
  const inited = useRef(false);

  const clamp = (x, y) => {
    const el = containerRef?.current;
    const cw = el?.clientWidth ?? window.innerWidth;
    const ch = el?.clientHeight ?? window.innerHeight;
    const maxX = Math.max(margin, cw - size.w - margin);
    const maxY = Math.max(margin, ch - size.h - margin);
    return { x: Math.min(Math.max(margin, x), maxX), y: Math.min(Math.max(margin, y), maxY) };
  };

  // Initial placement -> bottom-right by default
  useEffect(() => {
    if (inited.current || hidden || !containerRef?.current) return;
    const el = containerRef.current;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    let x = margin, y = margin;
    const right = initialCorner.includes("r");
    const bottom = initialCorner.includes("b");
    if (right) x = Math.max(margin, cw - size.w - margin);
    if (bottom) y = Math.max(margin, ch - size.h - margin);
    setPos({ x, y });
    inited.current = true;
  }, [containerRef, hidden, initialCorner, margin, size.w, size.h]);

  // Re-clamp on container resize
  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setPos((p) => (p ? clamp(p.x, p.y) : p));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, size.w, size.h, margin]);

  const pump = () => {
    raf.current = 0;
    const { dx, dy } = pending.current;
    pending.current = { dx: 0, dy: 0 };
    if (!dx && !dy) return;
    setPos((p) => clamp(p.x + dx, p.y + dy));
  };

  const onPointerDown = (e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    pending.current.dx += e.clientX - last.current.x;
    pending.current.dy += e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    if (!raf.current) raf.current = requestAnimationFrame(pump);
  };
  const onPointerUp = (e) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
    pending.current = { dx: 0, dy: 0 };
  };

  if (!self || hidden || !pos) return null;

  return (
    <Box
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size.w,
        height: size.h,
        zIndex: 5,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        willChange: "transform",
      }}
      aria-label="Your video (drag to move)"
    >
      <ParticipantTile {...self} variant="grid" />
    </Box>
  );
}

/* ------------ Paused banner (standalone if you want to mount it separately) ------------ */
export function LivePausedSection({ state, togglePause }) {
  if (state === "paused" || state === "PAUSED") {
    return (
      <Stack sx={{ height: "100%", justifyContent: "center", alignItems: "center", textAlign: "center", px: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          Live Paused
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 560, mt: 1 }}>
          The genius behind the scenes will be right back—probably brewing coffee or solving world problems!
        </Typography>
        <Stack direction="row" gap={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={togglePause} startIcon={<Play />}>
            Resume
          </Button>
          <Button variant="outlined" onClick={() => {}} startIcon={<PhoneOff />}>
            Leave
          </Button>
        </Stack>
      </Stack>
    );
  }
  return null;
}

/* ==========================================================
   Stage view — featured or screen-share + bottom-left strip
   ========================================================== */
export function StageView({
  participants = [],
  recording,
  cardBorder,
  screenStream = null,
  self,
  pinned = null,
  containerRef,
  canEject = false,
  onEject,
  onOpenAll = () => {},
  onToggleMic,
  onToggleCam,
}) {
  const screenRef = useRef(null);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    if (screenStream) {
      el.srcObject = screenStream;
      el.play?.().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [screenStream]);

  const showScreen = !!screenStream;
  const featured = showScreen ? null : pinned || participants[0] || null;
  const featuredIdx = featured ? participants.findIndex((x) => x?.name === featured.name) : -1;

  const others = useMemo(() => {
    const skip = new Set([featured?.name]);
    return participants.filter((p) => !skip.has(p.name));
  }, [participants, featured]);

  const strip = others.slice(0, 4);
  const extra = Math.max(0, others.length - strip.length);

  return (
    <Stack sx={{ position: "relative", height: "100%", minHeight: 0 }}>
      <Box sx={{ height: "100%", p: { xs: 1.25, md: 2 } }}>
        <Box sx={{ height: "100%", position: "relative", borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ position: "absolute", inset: 0 }}>
            {showScreen ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: (t) => `1px solid ${t.palette.divider}`,
                  bgcolor: (t) => t.palette.grey[100],
                }}
              >
                <video ref={screenRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              </Box>
            ) : (
              featured && (
                <Box sx={{ position: "absolute", inset: 0 }}>
                  <ParticipantTile
                    {...featured}
                    variant="featured"
                    pinned
                    sx={{ width: "100%", height: "100%" }}
                    canEject={canEject && !featured?.isYou}
                    onEject={() => onEject?.(featured)}
                    onToggleMic={() => onToggleMic?.(featured, featuredIdx)}
                    onToggleCam={() => onToggleCam?.(featured, featuredIdx)}
                  />
                </Box>
              )
            )}
          </Box>

          <TitlePill
            left
            label={showScreen ? "Screen share" : featured?.name || "—"}
            initial={showScreen ? "S" : (featured?.name?.[0] || "?").toUpperCase()}
            cardBorder={cardBorder}
          />

          {recording && (
            <Stack direction="row" gap={1} alignItems="center" sx={{ position: "absolute", right: 18, top: 18, zIndex: 3 }}>
              <Chip size="small" icon={<CircleDot size={14} />} label="REC" color="error" />
            </Stack>
          )}

          <DraggableSelfTile self={self} containerRef={containerRef} hidden={!self} />

          {strip.length > 0 && (
            <StripBottomLeft
              tiles={strip}
              extra={extra}
              cardBorder={cardBorder}
              onOpenAll={onOpenAll}
              canEject={canEject}
              onEject={onEject}
              onToggleMic={onToggleMic}
              onToggleCam={onToggleCam}
              participantsAll={participants}
            />
          )}
        </Box>
      </Box>
    </Stack>
  );
}

function TitlePill({ left, label, initial, cardBorder }) {
  return (
    <Stack
      direction="row"
      gap={0.75}
      alignItems="center"
      sx={{
        position: "absolute",
        left: left ? 18 : "auto",
        right: !left ? 18 : "auto",
        top: 18,
        zIndex: 3,
        px: 1,
        py: 0.5,
        borderRadius: 999,
        border: cardBorder,
        bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
        backdropFilter: "blur(6px)",
      }}
    >
      <Avatar sx={{ width: 20, height: 20, fontSize: 12 }}>{initial}</Avatar>
      <Typography variant="caption" fontWeight={700} noWrap>
        {label}
      </Typography>
    </Stack>
  );
}

function StripBottomLeft({
  tiles = [],
  extra = 0,
  onOpenAll,
  cardBorder,
  canEject = false,
  onEject,
  onToggleMic,
  onToggleCam,
  participantsAll,
}) {
  return (
    <Stack
      direction="row"
      gap={1}
      sx={{
        position: "absolute",
        left: 18,
        bottom: 18,
        zIndex: 3,
        px: 0.5,
        py: 0.5,
        borderRadius: 2,
        backdropFilter: "blur(6px)",
      }}
    >
      {tiles.map((p, i) => {
        const idxGlobal = participantsAll?.findIndex?.((x) => x?.name === p?.name) ?? -1;
        return (
          <Box key={`${p.name}-${i}`} sx={{ width: { xs: 110, md: 150 }, height: { xs: 68, md: 92 }, borderRadius: 2, overflow: "hidden", border: cardBorder }}>
            <ParticipantTile
              {...p}
              variant="grid"
              canEject={canEject && !p?.isYou}
              onEject={() => onEject?.(p)}
              onToggleMic={() => onToggleMic?.(p, idxGlobal)}
              onToggleCam={() => onToggleCam?.(p, idxGlobal)}
            />
          </Box>
        );
      })}
      {extra > 0 && (
        <Box
          onClick={onOpenAll}
          role="button"
          tabIndex={0}
          sx={{
            width: { xs: 110, md: 150 },
            height: { xs: 68, md: 92 },
            borderRadius: 2,
            border: cardBorder,
            display: "grid",
            placeItems: "center",
            px: 1.25,
            cursor: "pointer",
            bgcolor: (t) => alpha(t.palette.background.paper, 0.6),
          }}
        >
          <Typography fontWeight={800}>+{extra}</Typography>
        </Box>
      )}
    </Stack>
  );
}

/* ==========================================================
   Grid view — stable columns; odd ⇒ tall-left spanning rows
   ========================================================== */
export function GridView({
  participants = [],
  self,
  pinned = null,
  onPinParticipant = () => {},
  containerRef,
  onOpenAll = () => {},
  canEject = false,
  onEject,
  onToggleMic,
  onToggleCam,
}) {
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const update = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // unique by name & remove self (self only appears as PiP)
  const uniqByName = (arr) => Array.from(new Map(arr.map((p) => [p?.name ?? Math.random(), p])).values());
  const othersRaw = useMemo(
    () => uniqByName(participants).filter((p) => p?.name !== self?.name && !p?.isSelf && !p?.isYou),
    [participants, self]
  );

  const ASP = 16 / 9;
  const MIN_W = 140;
  const PAD = 32; // inner padding
  const GAP = 12;

  function chooseLayout(N, W, H, g, hasPinned) {
    const W2 = Math.max(0, W - PAD);
    const H2 = Math.max(0, H - PAD);
    if (N <= 0 || W2 <= 0 || H2 <= 0)
      return { cols: 1, rows: 1, visible: 0, tallLeft: false, pinnedCellSpan: null };

    let best = null;
    const MAXC = Math.min(8, Math.max(1, N));
    for (let cols = 1; cols <= MAXC; cols++) {
      const rows = Math.ceil(N / cols);
      const cellW = (W2 - g * (cols - 1)) / cols;
      const cellH = (H2 - g * (rows - 1)) / rows;

      const widthLimitedH = cellW / ASP;
      const heightLimitedW = cellH * ASP;

      const tileW = heightLimitedW <= cellW ? heightLimitedW : cellW;
      const tileH = heightLimitedW <= cellW ? cellH : widthLimitedH;

      if (tileW < MIN_W) continue;

      const usedW = tileW * cols + g * (cols - 1);
      const usedH = tileH * rows + g * (rows - 1);
      const coverage = (usedW * usedH) / (W2 * H2);
      const score = tileH + coverage * 0.25;

      if (!best || score > best.score) best = { score, rows, cols, tileH };
    }
    if (!best)
      return {
        cols: 1,
        rows: Math.max(1, Math.floor(H2 / ((W2 / ASP) + g))),
        visible: Math.min(N, 1),
        tallLeft: false,
        pinnedCellSpan: null,
      };

    const capacity = best.cols * best.rows;
    const visible = Math.min(N, capacity);

    // NEVER stretch the last row
    // If N is odd and we have at least 2 rows and 3 cols, make a tall-left column (unless pinned)
    const tallLeft = N % 2 === 1 && best.rows >= 2 && best.cols >= 3 && !hasPinned;

    const pinnedCellSpan = hasPinned && visible > 1 && best.cols >= 2 && best.rows >= 2 ? { col: 2, row: 2 } : null;

    return { ...best, visible, tallLeft, pinnedCellSpan };
  }

  const layout = useMemo(
    () => chooseLayout(othersRaw.length, dims.w, dims.h, GAP, !!pinned),
    [othersRaw.length, dims.w, dims.h, pinned]
  );

  // For tall-left, move the last item to the front so it reserves column 1 across all rows.
  const visibleList0 = othersRaw.slice(0, layout.visible);
 
  const tallIdx = layout.tallLeft ? visibleList0.length - 1 : -1;
  const visibleList = layout.tallLeft ? [visibleList0[tallIdx], ...visibleList0.slice(0, -1)] : visibleList0;

  const overflow = othersRaw.slice(layout.visible);

  // compute row height to fill exactly
  const totalGaps = GAP * Math.max(0, layout.rows - 1);
  const usableH = Math.max(0, dims.h - PAD - totalGaps);
  const rowPx = Math.max(120, Math.floor(usableH / Math.max(1, layout.rows)));

  return (
    <Stack
      sx={{
        height: "100%",
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        scrollbarGutter: "stable both-edges",
        contain: "layout paint size",
      }}
    >
      <Box sx={{ height: "100%", p: 2, boxSizing: "border-box" }}>
        <Box
          sx={{
            height: "100%",
            display: "grid",
            gap: `${GAP}px`,
            gridTemplateColumns: `repeat(${layout.cols || 1}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${layout.rows || 1}, minmax(${rowPx}px, 1fr))`,
            alignContent: "stretch",
            alignItems: "stretch",
            gridAutoFlow: "dense",
            userSelect: "none",
            minWidth: 0,
            minHeight: 0,
          }}
        >
          {visibleList.map((p, idx) => {
            const isTall = layout.tallLeft && idx === 0;
            const isPinned = pinned && p.name === pinned.name;
            const pinColSpan = isPinned && layout.pinnedCellSpan ? layout.pinnedCellSpan.col : 1;
            const pinRowSpan = isPinned && layout.pinnedCellSpan ? layout.pinnedCellSpan.row : 1;
            const idxGlobal = participants.findIndex((x) => x?.name === p?.name);

            return (
              <Box
                key={`${p.name}-${idx}`}
                sx={{
                  gridColumn: isTall ? `1 / span 1` : `span ${isPinned ? pinColSpan : 1}`,
                  gridRow: isTall ? `1 / span ${layout.rows}` : `span ${isPinned ? pinRowSpan : 1}`,
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <ParticipantTile
                  {...p}
                  variant={isPinned || isTall ? "featured" : "grid"}
                  pinned={isPinned}
                  onPin={() => onPinParticipant(isPinned ? null : p)}
                  canEject={canEject && !p?.isYou}
                  onEject={() => onEject?.(p)}
                  onToggleMic={() => onToggleMic?.(p, idxGlobal)}
                  onToggleCam={() => onToggleCam?.(p, idxGlobal)}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* PiP self bottom-right by default */}
      <DraggableSelfTile self={self} containerRef={containerRef} hidden={!self} />

      {/* local overflow strip */}
      {overflow.length > 0 && (
        <StripBottomLeft
          tiles={overflow.slice(0, 4)}
          extra={Math.max(0, overflow.length - 4)}
          cardBorder={(t) => `1px solid ${t.palette.divider}`}
          onOpenAll={onOpenAll}
          canEject={canEject}
          onEject={onEject}
          onToggleMic={onToggleMic}
          onToggleCam={onToggleCam}
          participantsAll={participants}
        />
      )}
    </Stack>
  );
}

/* ------------ All members dialog ------------ */
export function AllMembersDialog({
  open,
  onClose,
  participants = [],
  onToggleMic = () => {},
  onToggleCam = () => {},
  onEject,
  canEject = true,
}) {
  const all = useMemo(() => participants, [participants]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        All participants
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
          Toggle mic, camera, pin, or hang-up from here.
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gap: 1.25,
            gridTemplateColumns: {
              xs: "repeat(2, minmax(120px, 1fr))",
              sm: "repeat(3, minmax(140px, 1fr))",
              md: "repeat(4, minmax(140px, 1fr))",
            },
          }}
        >
          {all.map((p, idx) => (
            <Box key={`${p.name}-${idx}`} sx={{ height: 140 }}>
              <ParticipantTile
                {...p}
                variant="grid"
                onToggleMic={() => onToggleMic(p, idx)}
                onToggleCam={() => onToggleCam(p, idx)}
                canEject={canEject}
                onEject={onEject ? () => onEject(p, idx) : undefined}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
