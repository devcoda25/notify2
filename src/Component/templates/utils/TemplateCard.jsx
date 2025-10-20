// Path: src/Component/templates/utils/TemplateCard.jsx

import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import { Mail, MonitorSmartphone, Bell, MessageSquare, MessageCircle } from "lucide-react";
import TemplateRowActions from "./TemplateRowActions";

const normalizeChannel = (val) => {
  const s = String(val || "").toLowerCase().trim();
  if (["email", "mail"].includes(s)) return "email";
  if (["sms", "text"].includes(s)) return "sms";
  if (["whatsapp", "wa"].includes(s)) return "whatsapp";
  if (["push", "push-notification", "notification"].includes(s)) return "push";
  if (["platform", "inapp", "in-app", "web"].includes(s)) return "platform";
  return s || "platform";
};

const ChannelIcon = ({ id, size = 14 }) => {
  const key = normalizeChannel(id);
  const map = { email: Mail, platform: MonitorSmartphone, push: Bell, sms: MessageSquare, whatsapp: MessageCircle };
  const Icon = map[key] || MonitorSmartphone;
  return <Icon size={size} />;
};

function StatusChip({ status }) {
  const color =
    status === "Approved" ? "success" :
    status === "Rejected" ? "error" :
    ["In-Review", "Submitted", "Pending"].includes(status) ? "warning" :
    "default";
  return <Chip size="small" color={color} label={status || "Draft"} />;
}

/**
 * Unified actions forwarded to TemplateRowActions:
 * - onSubmitApproval
 * - onResubmitProvider
 * - onWithdrawSubmission (ignored outside approvals)
 * - onOpenTimeline
 * - onOpenInApprovals
 */
export default function TemplateCard({
  template,
  onOpen,
  onClone,
  onArchive,
  onTest,

  onSubmitApproval,
  onResubmitProvider,
  onWithdrawSubmission,
  onOpenTimeline,
  onOpenInApprovals,

  context = "all",
  providerStatuses, // optional strip in approvals
}) {
  const t = useTheme();
  const updatedAt = template?.updatedAt ? new Date(template.updatedAt).toLocaleString() : "—";
  const usage = template?.usage?.total ?? template?.usageTotal ?? 0;

  const variants = template?.variants || template?.translations || [];
  const languages = Array.from(
    new Set(variants.map((v) => v?.lang || v?.language || v?.locale).filter(Boolean).map((s) => String(s).slice(0, 5).toUpperCase()))
  );
  const ch = normalizeChannel(template?.channel);

  const showProviderStrip = context === "approvals" && Array.isArray(providerStatuses) && providerStatuses.length;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", position: "relative" }}>
      <CardActionArea onClick={() => onOpen?.(template)} sx={{ height: "100%" }}>
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ChannelIcon id={ch} />
              <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 700 }} noWrap title={template?.name}>
                {template?.name}
              </Typography>
              <StatusChip status={template?.status || template?.state} />
            </Stack>

            {template?.description && (
              <Typography variant="body2" color="text.secondary" noWrap title={template.description}>
                {template.description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <Chip size="small" variant="outlined" label={ch} />
              <Chip size="small" variant="outlined" label={template?.type || "—"} />
              <Chip size="small" label={`${variants.length} variants`} />
              {languages.slice(0, 3).map((lng) => (
                <Chip key={`${template?.id}-lng-${lng}`} size="small" variant="outlined" label={lng} />
              ))}
              {languages.length > 3 && <Chip size="small" variant="outlined" label={`+${languages.length - 3}`} />}
            </Stack>

            {showProviderStrip && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: alpha(t.palette.primary.main, 0.04),
                  border: `1px dashed ${alpha(t.palette.primary.main, 0.25)}`,
                }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexWrap: "wrap" }}>
                  {providerStatuses.slice(0, 6).map((p) => (
                    <Chip
                      key={`${template?.id}-${p.name}`}
                      size="small"
                      variant="outlined"
                      color={
                        p.state === "Approved" ? "success" :
                        p.state === "Rejected" ? "error" :
                        ["Submitted", "In-Review", "Pending"].includes(p.state) ? "warning" : "default"
                      }
                      label={`${p.name}: ${p.state || "—"}`}
                    />
                  ))}
                  {providerStatuses.length > 6 && <Chip size="small" variant="outlined" label={`+${providerStatuses.length - 6}`} />}
                </Stack>
              </Box>
            )}

            <Divider />

            <Stack direction="row" spacing={2} alignItems="center" sx={{ opacity: 0.85 }}>
              <Typography variant="caption">Usage: {usage.toLocaleString()}</Typography>
              <Typography variant="caption">Updated: {updatedAt}</Typography>
            </Stack>

            {Array.isArray(template?.tags) && template.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                {template.tags.slice(0, 3).map((tg) => (
                  <Chip key={tg} size="small" variant="outlined" label={tg} />
                ))}
                {template.tags.length > 3 && <Chip size="small" variant="outlined" label={`+${template.tags.length - 3}`} />}
              </Stack>
            )}

            {/* Ensure actions don't bubble to CardActionArea */}
            <Box
              sx={{ display: "flex", justifyContent: "flex-end" }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <TemplateRowActions
                template={template}
                onOpen={onOpen}
                onClone={onClone}
                onArchive={onArchive}
                onTest={onTest}
                onSubmitApproval={onSubmitApproval}
                onResubmitProvider={onResubmitProvider}
                onWithdrawSubmission={onWithdrawSubmission}
                onOpenTimeline={onOpenTimeline}
                onOpenInApprovals={onOpenInApprovals}
                context={context}
              />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
