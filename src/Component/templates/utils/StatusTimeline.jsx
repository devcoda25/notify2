// Path: src/Component/templates/utils/StatusTimeline.jsx

import React from "react";
import {
  Box,
  Paper,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  CheckCircle2,
  Clock4,
  AlertTriangle,
  XCircle,
  GitCommit,
  Eye,
  ListTree,
} from "lucide-react";

/**
 * StatusTimeline (template-level)
 *
 * Props:
 * - current: string ("Draft" | "Submitted" | "In-Review" | "Approved" | "Rejected")
 * - history: Array<{ state, at, by, note, commitId? }>
 * - compact: boolean => stepper is vertical & smaller
 * - mini: boolean => show a minimal summary (few events + CTA to open full timeline)
 * - maxEvents: number => limits number of events shown (default: mini ? 3 : all)
 * - onOpenDiff?: (commitId: string) => void
 * - onOpenTimeline?: () => void  // opens the full graph timeline
 *
 * Behavior:
 * - Shows the stepper of high-level states
 * - Below it, shows an "Event feed" with entries (trimmed in mini mode)
 * - Always renders a small "Open full timeline" button if onOpenTimeline is provided
 */
const STEP_ORDER = ["Submitted", "In-Review", "Approved", "Rejected"];

const iconFor = (state) => {
  if (state === "Approved") return <CheckCircle2 size={16} />;
  if (state === "Rejected") return <XCircle size={16} />;
  if (state === "In-Review") return <AlertTriangle size={16} />;
  if (state === "Submitted") return <Clock4 size={16} />;
  return <Clock4 size={16} />;
};

const colorFor = (state) => {
  if (state === "Approved") return "success";
  if (state === "Rejected") return "error";
  if (state === "In-Review" || state === "Submitted" || state === "Pending") return "warning";
  return "default";
};

export default function StatusTimeline({
  current = "Draft",
  history = [], // [{ state, at, by, note, commitId? }]
  compact = false,
  mini = false,
  maxEvents,
  onOpenDiff,
  onOpenTimeline,
}) {
  const t = useTheme();

  // Build steps sequence based on current
  const path =
    current === "Rejected"
      ? ["Submitted", "In-Review", "Rejected"]
      : current === "Approved"
      ? ["Submitted", "In-Review", "Approved"]
      : current === "In-Review"
      ? ["Submitted", "In-Review"]
      : current === "Submitted"
      ? ["Submitted"]
      : [];

  const activeIdx = path.length ? path.length - 1 : -1;

  // Sort history chronologically ascending for feed
  const eventsAsc = [...(history || [])].sort((a, b) => {
    const ta = a?.at ? new Date(a.at).getTime() : 0;
    const tb = b?.at ? new Date(b.at).getTime() : 0;
    return ta - tb;
  });

  // Decide how many to show
  const limit = Number.isFinite(maxEvents) ? maxEvents : (mini ? 3 : Number.POSITIVE_INFINITY);
  const events = eventsAsc.slice(-limit); // take last N (most recent N, but keep ascending order)

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        ...(mini && { p: 0, "& .MuiStepper-root": { px: 1, pt: 1 } }),
      }}
    >
      <Stack spacing={1.25} sx={{ p: mini ? 1 : 1.25 }}>
        {!mini && <Typography variant="subtitle2">Approval Status</Typography>}

        {path.length ? (
          <Stepper
            activeStep={activeIdx}
            alternativeLabel={!compact && !mini}
            orientation={compact || mini ? "vertical" : "horizontal"}
            sx={mini ? { "& .MuiStepConnector-root": { display: "none" } } : undefined}
          >
            {path.map((s, i) => (
              <Step key={s} completed={i < activeIdx}>
                <StepLabel icon={iconFor(s)}>{mini ? null : s}</StepLabel>
              </Step>
            ))}
          </Stepper>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Not submitted for review.
          </Typography>
        )}

        {/* Event Feed (trimmed in mini mode) */}
        {!!events.length && (
          <>
            {!mini && <Divider sx={{ my: 0.5 }} />}
            {!mini && <Typography variant="subtitle2">Event Feed</Typography>}
            <Box sx={{ position: "relative", pl: 2 }}>
              {/* Vertical line */}
              <Box
                sx={{
                  position: "absolute",
                  left: 7,
                  top: 0.5,
                  bottom: 0.5,
                  width: 2,
                  bgcolor: (th) => alpha(th.palette.text.primary, 0.12),
                  borderRadius: 1,
                }}
              />
              <Stack spacing={0.75} sx={{ mt: 0.5 }}>
                {events.map((e, i) => {
                  const color = colorFor(e.state);
                  const when = e.at ? new Date(e.at).toLocaleString() : "—";
                  return (
                    <Stack key={`${e.at || i}-${e.state}`} direction="row" spacing={1.25} alignItems="flex-start">
                      {/* Dot */}
                      <Box
                        sx={{
                          mt: 0.6,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor:
                            color === "success"
                              ? t.palette.success.main
                              : color === "error"
                              ? t.palette.error.main
                              : color === "warning"
                              ? t.palette.warning.main
                              : t.palette.text.disabled,
                          boxShadow: (th) => `0 0 0 2px ${th.palette.background.paper}`,
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                          <Chip size="small" color={color} label={e.state || "—"} />
                          <Typography variant="caption" color="text.secondary">
                            {when}
                          </Typography>
                          {!mini && e.by && (
                            <Typography variant="caption" color="text.secondary">
                              • by {e.by}
                            </Typography>
                          )}
                          {e.commitId && !mini && (
                            <Stack direction="row" spacing={0.25} alignItems="center" sx={{ ml: 0.75 }}>
                              <GitCommit size={14} />
                              <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                                {e.commitId.slice(0, 10)}
                              </Typography>
                              {onOpenDiff && (
                                <Tooltip title="View changes">
                                  <IconButton size="small" onClick={() => onOpenDiff?.(e.commitId)}>
                                    <Eye size={14} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          )}
                        </Stack>
                        {!mini && e.note && (
                          <Typography variant="body2" sx={{ mt: 0.25 }}>
                            “{e.note}”
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          </>
        )}

        {/* CTA: Open full timeline */}
        {onOpenTimeline && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: mini ? 0.5 : 0 }}>
            <Button
              size="small"
              startIcon={<ListTree size={16} />}
              onClick={onOpenTimeline}
            >
              Open full timeline
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
