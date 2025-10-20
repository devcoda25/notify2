// Path: src/Component/templates/channel-previews/EmailPreview.jsx
import React from "react";
import { Box, Stack, Typography, Divider, Button, Chip, IconButton, Avatar, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeviceFrame from "./DeviceFrame";
import { ExternalLink, MoreVertical, Reply, Star, Printer } from "lucide-react";

/**
 * Props:
 * - variant: {
 *     channel:'email',
 *     content:{ subject,title,body,html, headerHtml?,headerText?, footerHtml?,footerText?, buttons?,links?,media? },
 *     from?: { name?: string, email?: string },
 *     to?: string | string[],
 *     date?: string
 *   }
 * - device: 'mobile' | 'tablet' | 'desktop'
 * - orientation: 'portrait' | 'landscape'
 * - radius?: number              // inner card radius (default 2 for Gmail-ish)
 * - frameBorder?: number         // outer device border thickness
 * - frameRadius?: number         // outer device corner radius
 */
export default function EmailPreview({
  variant,
  device = "desktop",
  orientation = "portrait",
  radius = 2,
  frameBorder = 10,
  frameRadius = 4,
}) {
  const t = useTheme();
  const c = variant?.content || {};
  const subject = c.subject || "Subject";
  const title = c.title || "";
  const text = c.body || "";
  const html = c.html || "";
  const headerHtml = c.headerHtml || "";
  const headerText = c.headerText || "";
  const footerHtml = c.footerHtml || "";
  const footerText = c.footerText || "";
  const buttons = Array.isArray(c.buttons) ? c.buttons : [];
  const links = Array.isArray(c.links) ? c.links : [];

  const from = variant?.from || { name: "Acme Inc.", email: "notifications@acme.com" };
  const to = variant?.to || "me";
  const date = variant?.date || "Now";

  const wrapperMax = device === "mobile" ? 420 : device === "tablet" ? 680 : 860;
  const hasHeader = !!(headerHtml || headerText);
  const hasFooter = !!(footerHtml || footerText);
  const PrimaryCTA = buttons?.[0];

  // Softer, flatter Gmail-ish container surfaces
  const surfaceBorder = `1px solid ${alpha(t.palette.text.primary, 0.12)}`;
  const paneBg = t.palette.mode === "dark"
    ? alpha(t.palette.common.white, 0.02)
    : alpha(t.palette.common.black, 0.02);

  const initials = (from?.name || from?.email || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join("");

  return (
    <DeviceFrame
      device={device}
      orientation={orientation}
      frameBorder={frameBorder}
      frameRadius={frameRadius}
      addressBarText="Gmail preview"
      fitPadding={4}
      scaleBias={0.12}
    >
      <Box sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: paneBg, minHeight: "100%" }}>
        {/* Subject “strip” (very light, low radius) */}
        <Stack
          spacing={1}
          sx={{
            p: { xs: 1.25, sm: 1.75 },
            borderRadius: radius,
            border: surfaceBorder,
            bgcolor: "background.paper",
            maxWidth: wrapperMax,
            mx: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
            {subject}
          </Typography>
          {PrimaryCTA && (
            <Chip size="small" label="Includes CTA" sx={{ width: "fit-content" }} />
          )}
        </Stack>

        {/* Message card (flatter look, tiny radius) */}
        <Box
          sx={{
            p: { xs: 1.25, sm: 0 },
            mt: 1,
            borderRadius: radius,
            border: surfaceBorder,
            bgcolor: "background.paper",
            maxWidth: wrapperMax,
            mx: "auto",
          }}
        >
          {/* Gmail-ish header row */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ px: { xs: 1.25, sm: 2 }, pt: { xs: 1.25, sm: 1.5 } }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{initials || "@"}</Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="baseline" spacing={1} sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {from?.name || from?.email || "Sender"}
                </Typography>
                {from?.email && (
                  <Typography variant="caption" color="text.secondary">
                    &lt;{from.email}&gt;
                  </Typography>
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                to {Array.isArray(to) ? to.join(", ") : to}
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              {date}
            </Typography>

            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Reply">
                <IconButton size="small"><Reply size={16} /></IconButton>
              </Tooltip>
              <Tooltip title="Star">
                <IconButton size="small"><Star size={16} /></IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton size="small"><Printer size={16} /></IconButton>
              </Tooltip>
              <Tooltip title="More">
                <IconButton size="small"><MoreVertical size={16} /></IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Divider sx={{ mt: 1, mb: 0 }} />

          {/* Message body */}
          <Box sx={{ px: { xs: 1.25, sm: 2 }, py: { xs: 1.25, sm: 2 } }}>
            {hasHeader && (
              <Box sx={{ mb: 1.5 }}>
                {headerHtml ? (
                  <Box
                    sx={{
                      "& h1, & h2, & h3": { mt: 1, mb: 1, fontWeight: 700 },
                      "& p": { my: 1 },
                      "& a": { color: "primary.main" },
                    }}
                    dangerouslySetInnerHTML={{ __html: headerHtml }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                    {headerText}
                  </Typography>
                )}
                <Divider sx={{ mt: 1, mb: 2 }} />
              </Box>
            )}

            {title && (
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {title}
              </Typography>
            )}

            {html ? (
              <Box
                sx={{
                  "& h1, & h2, & h3": { mt: 1, mb: 1, fontWeight: 700 },
                  "& p": { my: 1 },
                  "& a": { color: "primary.main" },
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{text}</Typography>
            )}

            {buttons.length > 0 && (
              <Stack direction="row" spacing={1.25} sx={{ mt: 2 }} useFlexGap flexWrap="wrap">
                {buttons.map((b) => {
                  const type = b?.action?.type || "link";
                  const href = type === "call"
                    ? (b?.action?.phone ? `tel:${b.action.phone}` : "#")
                    : (b?.action?.url || "#");
                  const isDisabled =
                    !href || ["webhook", "copy", "share", "navigate", "open_app", "none", "reply"].includes(type);
                  return (
                    <Button
                      key={b.id}
                      variant="contained"
                      size="small"
                      href={isDisabled ? undefined : href}
                      target={isDisabled ? undefined : "_blank"}
                      rel={isDisabled ? undefined : "noreferrer"}
                      endIcon={<ExternalLink size={14} />}
                      disabled={isDisabled}
                    >
                      {b.label || "Button"}
                    </Button>
                  );
                })}
              </Stack>
            )}

            {links.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                  {links.map((lnk, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      component="a"
                      href={lnk.href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      sx={{ color: "primary.main" }}
                    >
                      {lnk.label || lnk.href}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}

            {hasFooter && (
              <>
                <Divider sx={{ my: 2 }} />
                {footerHtml ? (
                  <Box
                    sx={{
                      "& h1, & h2, & h3": { mt: 1, mb: 1, fontWeight: 700 },
                      "& p": { my: 1 },
                      "& a": { color: "primary.main" },
                    }}
                    dangerouslySetInnerHTML={{ __html: footerHtml }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}>
                    {footerText}
                  </Typography>
                )}
              </>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2 }}>
              Preview rendering only — real email clients may differ.
            </Typography>
          </Box>
        </Box>
      </Box>
    </DeviceFrame>
  );
}
