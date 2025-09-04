// /src/Component/dailer/lead/LeadActivityPanel.jsx
import {
  Box, Typography, IconButton, Stack, Link, Avatar,
  Slider, LinearProgress, Divider, Chip, Pagination
} from "@mui/material";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Play, Pause, Download, Volume2, MicOff, PhoneIncoming, PhoneOutgoing, Users,
  Clock, CalendarClock, Tag as TagIcon
} from "lucide-react";

function humanDuration(sec = 0) {
  const s = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map(v => String(v).padStart(2, "0")).join(":");
}

// Build interactions: disposition-first + optional recording + meta
function buildInteractions(lead) {
  const notes = [...(lead?.notes || [])];
  const recs = [...(lead?.recordings || [])];

  const avatarByAgent = {};
  (lead?.lastAgents || []).forEach(a => { avatarByAgent[a.name] = a.avatar; });
  const getAvatar = (name) => (name && avatarByAgent[name]) || undefined;

  const unusedRecs = new Set(recs.map(r => r.id));
  const interactions = notes.map(n => {
    let rec = recs.find(r => r.noteId && r.noteId === n.id);
    if (rec) unusedRecs.delete(rec.id);

    if (!rec && n.at) {
      const ts = new Date(n.at).getTime();
      let best = null, bestDiff = Infinity;
      recs.forEach(r => {
        if (!unusedRecs.has(r.id) || !r.at) return;
        const diff = Math.abs(new Date(r.at).getTime() - ts);
        if (diff < bestDiff) { best = r; bestDiff = diff; }
      });
      if (best && bestDiff <= 30 * 60 * 1000) { rec = best; unusedRecs.delete(best.id); }
    }

    const agent = n.agent || rec?.agent || null;
    return {
      id: n.id,
      at: n.at || rec?.at || null,
      agent,
      avatar: getAvatar(agent),
      title: n.title,
      text: n.text,
      recording: rec || null,
      meta: {
        type: n.type || null,
        direction: n.direction || rec?.direction || null,
        durationSec: n.durationSec || rec?.durationSec || null,
        conference: n.conference ?? rec?.conference ?? false,
        participants: n.participants || rec?.participants || null,
        initiatedBy: n.initiatedBy || null,
        outcome: n.outcome || null,
        followUpAt: n.followUpAt || null,
        tags: n.tags || [],
      },
      customTags: Array.isArray(n.tags) ? n.tags : [],
    };
  });

  recs.forEach(r => {
    if (unusedRecs.has(r.id)) {
      const agent = r.agent || null;
      interactions.push({
        id: `rec_${r.id}`,
        at: r.at || null,
        agent,
        avatar: getAvatar(agent),
        title: agent || "Recording",
        text: null,
        recording: r,
        meta: {
          direction: r.direction || null,
          durationSec: r.durationSec || null,
          conference: r.conference ?? false,
          participants: r.participants || null,
          initiatedBy: null,
          outcome: null,
          followUpAt: null,
          tags: [],
        }
      });
    }
  });

  interactions.sort((a, b) => (new Date(b.at || 0) - new Date(a.at || 0)));
  return interactions;
}

export default function LeadActivityPanel({ lead, embedded = false, pageSize = 4 }) {
  const interactions = useMemo(() => buildInteractions(lead), [lead]);

  // --- Audio ---
  const audioRef = useRef({});
  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState({}); // {recId: {current, duration}}

  // --- Pagination ---
  const [page, setPage] = useState(1);
  const PER_PAGE = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(interactions.length / PER_PAGE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return interactions.slice(start, start + PER_PAGE);
  }, [interactions, page, PER_PAGE]);

  useEffect(() => {
    // reset to first page and stop audio when the data set changes
    setPage(1);
    Object.values(audioRef.current).forEach(a => { try { a.pause(); } catch { } });
    setPlaying(null);
  }, [lead]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    Object.values(audioRef.current).forEach(a => { try { a.pause(); } catch { } });
    audioRef.current = {};
  }, []);

  const ensureAudio = (rec) => {
    if (!rec?.url) return null;
    if (!audioRef.current[rec.id]) {
      const a = new Audio(rec.url);
      a.preload = "metadata";
      a.addEventListener("timeupdate", () => {
        setProgress(prev => ({
          ...prev,
          [rec.id]: { current: a.currentTime, duration: a.duration || rec.durationSec || 0 }
        }));
      });
      a.addEventListener("ended", () => setPlaying(null));
      a.addEventListener("loadedmetadata", () => {
        setProgress(prev => ({
          ...prev,
          [rec.id]: { current: 0, duration: a.duration || rec.durationSec || 0 }
        }));
      });
      audioRef.current[rec.id] = a;
    }
    return audioRef.current[rec.id];
  };

  const togglePlay = (rec) => {
    const a = ensureAudio(rec);
    if (!a) return;
    Object.entries(audioRef.current).forEach(([id, au]) => { if (id !== rec.id) { try { au.pause(); } catch { } } });
    if (playing === rec.id && !a.paused) { a.pause(); setPlaying(null); }
    else { a.play().then(() => setPlaying(rec.id)).catch(() => { }); }
  };

  const seek = (rec, val) => {
    const a = ensureAudio(rec);
    if (!a) return;
    const dur = progress[rec.id]?.duration || rec.durationSec || 0;
    const t = Math.max(0, Math.min(dur || 0, Array.isArray(val) ? val[0] : val));
    try { a.currentTime = t; } catch { }
    setProgress(p => ({ ...p, [rec.id]: { current: t, duration: dur } }));
  };

  const Wrapper = ({ children }) => embedded ? <Box>{children}</Box> : <Box sx={{ p: 2 }}>{children}</Box>;

  const handlePageChange = (_e, value) => {
    // pause any playing audio when changing pages
    Object.values(audioRef.current).forEach(a => { try { a.pause(); } catch { } });
    setPlaying(null);
    setPage(value);
  };

  return (
    <Wrapper>
      {interactions.length === 0 && (
        <Typography variant="body2" color="text.secondary">No interactions yet.</Typography>
      )}

      <Stack spacing={1.5}>
        {pageItems.map(it => {
          const rec = it.recording;
          const prog = rec ? (progress[rec.id] || { current: 0, duration: rec.durationSec || 0 }) : null;
          const isPlaying = rec ? (playing === rec.id && !(audioRef.current[rec.id]?.paused)) : false;
          const m = it.meta || {};

          return (
            <Box
              key={it.id}
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: (t) => `1px solid ${t.palette.divider}`,
                backgroundColor: (t) => t.palette.background.paper,
              }}
            >
              {/* HEADER ROW: title/desc left, agent block top-right */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                  columnGap: 2,
                  rowGap: 1,
                }}
              >
                {/* Left: disposition title + description */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {it.title || "Untitled disposition"}
                  </Typography>
                  {it.text && (
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {it.text}
                    </Typography>
                  )}
                </Box>

                {/* Right: agent (top-right) */}
                <Stack direction="row" alignItems="start" spacing={1.25} sx={{ justifySelf: "end" }}>
                  <Stack alignItems="flex-end" spacing={0} sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      {it.at ? new Date(it.at).toLocaleString() : ""}
                    </Typography>
                    <Typography variant="body2">{it.agent || "—"}</Typography>
                  </Stack>
                  <Avatar src={it.avatar} alt={it.agent || "Agent"} sx={{ width: 28, height: 28 }} />
                </Stack>
              </Box>

              <Divider sx={{ my: 1 }} />

              {/* Recording (full width) */}
              {rec ? (
                <>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => togglePlay(rec)}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </IconButton>
                    <Slider
                      size="small"
                      value={prog?.current || 0}
                      min={0}
                      max={(prog?.duration || rec.durationSec || 1)}
                      onChange={(_, v) => seek(rec, v)}
                      sx={{ flex: 1 }}
                      aria-label="Seek"
                    />
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ minWidth: 110, justifyContent: "flex-end" }}>
                      <Typography variant="caption">{humanDuration(prog?.current || 0)}</Typography>
                      <Volume2 size={14} />
                      <Typography variant="caption">/ {humanDuration(prog?.duration || rec.durationSec || 0)}</Typography>
                    </Stack>
                    {rec?.url && (
                      <IconButton size="small" component={Link} href={rec.url} target="_blank" rel="noreferrer" aria-label="Download">
                        <Download size={16} />
                      </IconButton>
                    )}
                  </Stack>
                  {!rec.durationSec && !(prog?.duration) && <LinearProgress sx={{ mt: 0.75 }} />}
                </>
              ) : (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.85 }}>
                  <MicOff size={16} />
                  <Typography variant="body2">Recording not available</Typography>
                </Stack>
              )}

              {/* Meta chips row: system (left) | custom (right) */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 0.75,
                  mt: 1,
                }}
              >
                {/* LEFT: system chips */}
                <Stack direction="row" flexWrap="wrap" sx={{ columnGap: 0.75, rowGap: 0.75 }}>
                  {m.type && (
                    <Chip
                      size="small"
                      label={String(m.type).charAt(0).toUpperCase() + String(m.type).slice(1)}
                      variant={/conference/i.test(m.type) ? "filled" : "outlined"}
                      color={
                        /escalated/i.test(m.type) ? "warning"
                          : /dropped|hangup/i.test(m.type) ? "error"
                            : /conference/i.test(m.type) ? "primary"
                              : "default"
                      }
                    />
                  )}
                  {m.direction && (
                    <Chip
                      size="small"
                      icon={m.direction === "inbound" ? <PhoneIncoming size={14} /> : <PhoneOutgoing size={14} />}
                      label={m.direction === "inbound" ? "Inbound" : "Outbound"}
                      color={m.direction === "inbound" ? "info" : "secondary"}
                      variant="outlined"
                    />
                  )}
                  {m.durationSec != null && (
                    <Chip size="small" icon={<Clock size={14} />} label={humanDuration(m.durationSec)} variant="outlined" />
                  )}
                  <Chip
                    size="small"
                    icon={<Users size={14} />}
                    label={m.conference ? `${m.participants?.length || 3}-way conference` : "1:1 call"}
                    variant={m.conference ? "filled" : "outlined"}
                    color={m.conference ? "primary" : "default"}
                  />
                  {m.followUpAt && (
                    <Chip
                      size="small"
                      icon={<CalendarClock size={14} />}
                      label={`Follow-up ${new Date(m.followUpAt).toLocaleString()}`}
                      variant="outlined"
                      color="info"
                    />
                  )}
                  {m.outcome && (
                    <Chip
                      size="small"
                      label={m.outcome}
                      color={
                        /resolved|verified|updated|payment/i.test(m.outcome) ? "success"
                          : /follow[- ]?up/i.test(m.outcome) ? "warning"
                            : /transfer/i.test(m.outcome) ? "info"
                              : /dropped|hangup|not interested/i.test(m.outcome) ? "error"
                                : "default"
                      }
                      variant="filled"
                    />
                  )}
                </Stack>

                {/* RIGHT: custom tags */}
                <Stack direction="row" flexWrap="wrap" sx={{ justifyContent: "flex-end", columnGap: 0.75, rowGap: 0.75 }}>
                  {Array.isArray(it.customTags) && it.customTags.map((t) => (
                    <Chip key={t} size="small" icon={<TagIcon size={14} />} label={t} variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Box>
          );
        })}

        {/* Pagination control */}
        {interactions.length > PER_PAGE && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 0.5 }}>
            <Pagination
              count={pageCount}
              page={page}
              size="small"
              onChange={handlePageChange}
              siblingCount={0}
            />
          </Box>
        )}
      </Stack>
    </Wrapper>
  );
}
