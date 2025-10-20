// Path: /src/Component/Meetings/components/PersonalLinkCard.jsx
import React, { useState } from "react";
import {
  Card, CardContent, CardHeader,
  Stack, Typography, Button, Chip, Snackbar, Alert, Divider, TextField
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Link as LinkIcon, Copy, ExternalLink, CalendarDays, Clock, Users, User
} from "lucide-react";

/**
 * “Schedule or share” card (refined chrome):
 * - Fewer borders, consistent tint
 * - Personal & pool booking links with Book / Copy / Open
 * - Schedule button uses same style as Book buttons (consistency)
 *
 * Extra prop:
 * - sxOverrides?: object  // allow parent to unify chrome with siblings
 */
export default function PersonalLinkCard({
  title = "Schedule or share",
  ownerLabel,
  personalUrl,
  personalOwner = { ownerType: "user", ownerId: "usr_alpha" },
  poolLinks = [],
  onSchedule,
  onScheduleOwner,
  durationLabel = "30-min default",
  buffersLabel = "buffers 5/5",
  sxOverrides = {},
}) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url); } finally { setCopied(true); }
  };

  const doSchedule = (owner) => {
    if (typeof onScheduleOwner === "function") return onScheduleOwner(owner);
    if (typeof onSchedule === "function") return onSchedule();
  };

  const LinkRow = ({ icon, label, url, onBook }) => (
    <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ sm: "center" }}>
      <TextField
        size="small"
        label={label}
        value={url}
        fullWidth
        InputProps={{ readOnly: true, startAdornment: icon }}
      />
      <Stack direction="row" gap={1} sx={{ minWidth: 320, flexShrink: 0 }}>
        {onBook && (
          <Button variant="contained" onClick={onBook}>
            Book
          </Button>
        )}
        <Button variant="outlined" startIcon={<Copy size={16} />} onClick={() => copy(url)}>
          Copy
        </Button>
        <Button variant="outlined" startIcon={<ExternalLink size={16} />}
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
          Open
        </Button>
      </Stack>
    </Stack>
  );

  const cardBorder = `1px solid ${alpha(theme.palette.divider, 0.8)}`;

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          border: cardBorder,
          overflow: "hidden",
          background: theme.palette.background.paper,
          ...sxOverrides, // allow parent to align visuals with sibling boxes
        }}
      >
        <CardHeader
          title={title}
          action={ownerLabel ? <Chip size="small" label={ownerLabel} /> : null}
          sx={{
            // lighter, no heavy separation line
            background: alpha(theme.palette.primary.main, 0.03),
          }}
        />

        <CardContent>
          <Stack gap={1.5}>
            {/* Intro + Schedule */}
            <Stack gap={0.75}>
              <Stack direction="row" alignItems="center" gap={1}>
                <CalendarDays size={16} />
                <Typography variant="subtitle2" fontWeight={700}>
                  Schedule a time or share your booking page
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Book on behalf of your client, or send a link so they pick a time that suits both of you.
                We’ll apply your defaults.
              </Typography>
              {/* Consistent primary action style with “Book” buttons */}
              <Stack direction="row" gap={1} sx={{ mt: 0.5 }}>
                <Button variant="contained" onClick={() => doSchedule(personalOwner)}>
                  Schedule a time
                </Button>
                <Chip size="small" icon={<Clock size={14} />} label={`${durationLabel} • ${buffersLabel}`} />
              </Stack>
            </Stack>

            <Divider sx={{ my: 1 }} />

            {/* Share booking links */}
            <Stack gap={0.75}>
              <Typography variant="caption" color="text.secondary">
                Share booking links
              </Typography>

              {/* Personal booking link with Book/Copy/Open */}
              <LinkRow
                icon={<User size={14} style={{ marginRight: 6 }} />}
                label="Your booking page"
                url={personalUrl}
                onBook={() => doSchedule(personalOwner)}
              />

              {/* Pool booking links, each with Book/Copy/Open */}
              {poolLinks.length > 0 && (
                <Stack gap={0.75}>
                  {poolLinks.map((p) => {
                    const owner = { ownerType: p.ownerType || "pool", ownerId: p.ownerId || p.id };
                    return (
                      <LinkRow
                        key={p.id}
                        icon={<Users size={14} style={{ marginRight: 6 }} />}
                        label={`Pool booking: ${p.name}`}
                        url={p.url}
                        onBook={() => doSchedule(owner)}
                      />
                    );
                  })}
                </Stack>
              )}

              <Alert
                severity="success"
                variant="outlined"
                sx={{ mt: 0.5 }}
                icon={<LinkIcon size={16} />}
              >
                Tip: Sharing your booking link is best when the invitee needs flexibility. If you already agreed on a
                time, click <strong>Book</strong> (or <strong>Schedule a time</strong>) to lock it in.
              </Alert>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={copied}
        autoHideDuration={1600}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setCopied(false)}>
          Link copied to clipboard
        </Alert>
      </Snackbar>
    </>
  );
}
