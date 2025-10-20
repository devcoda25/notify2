// Path: /src/Component/Meetings/components/MeetingCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  Tooltip,
  Box,
} from "@mui/material";
import { CalendarDays, ExternalLink, Video, Clock3, MapPin } from "lucide-react";

const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "scheduled":
      return "success";
    case "canceled":
    case "cancelled":
      return "error";
    case "rescheduled":
      return "warning";
    case "completed":
    case "past":
      return "default";
    default:
      return "default";
  }
};

export default function MeetingCard({ meeting, onJoin, onCancel, onOpen }) {
  if (!meeting) return null;

  const title =
    meeting.title ||
    meeting.eventTypeName ||
    meeting.eventTypeId ||
    "Meeting";

  const time = `${meeting.start} → ${meeting.end}`;
  const where =
    meeting.location?.link ||
    meeting.location?.address ||
    meeting.location?.type ||
    "Online";
  const tz = meeting.timezone || "UTC";
  const inviteeName = meeting.invitee?.name || "Invitee";
  const inviteeEmail = meeting.invitee?.email;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "box-shadow .2s ease",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
            {title?.[0]?.toUpperCase() || "M"}
          </Avatar>
        }
        title={
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
            {meeting.eventTypeName && (
              <Chip size="small" variant="outlined" label={meeting.eventTypeName} />
            )}
          </Stack>
        }
        subheader={
          <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Clock3 size={14} />
              <Typography variant="body2">{time}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <CalendarDays size={14} />
              <Typography variant="body2">{tz}</Typography>
            </Stack>
          </Stack>
        }
        action={
          <Chip
            size="small"
            label={meeting.status || "scheduled"}
            color={statusColor(meeting.status)}
          />
        }
      />

      <CardContent>
        <Stack gap={1.25}>
          <Stack direction="row" alignItems="center" gap={1.25}>
            <Avatar
              sx={{ width: 28, height: 28, bgcolor: "secondary.main", color: "secondary.contrastText" }}
            >
              {inviteeName?.[0]?.toUpperCase() || "I"}
            </Avatar>
            <Stack>
              <Typography variant="body2">{inviteeName}</Typography>
              {inviteeEmail && (
                <Typography variant="caption" color="text.secondary">
                  {inviteeEmail}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" gap={0.75}>
            <MapPin size={14} />
            <Typography variant="body2">
              Where:{" "}
              <Typography component="span" variant="body2" color="text.secondary">
                {where}
              </Typography>
            </Typography>
          </Stack>

          {meeting.notes && (
            <Typography variant="body2" color="text.secondary">
              {meeting.notes}
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Tooltip title="Open join link in a new tab (if available)">
          <span>
            <Button
              startIcon={<Video />}
              onClick={() => onJoin?.(meeting)}
              disabled={!meeting?.location?.link}
            >
              Join
            </Button>
          </span>
        </Tooltip>

        <Button
          startIcon={<ExternalLink />}
          onClick={() => onOpen?.(meeting)}
          variant="outlined"
        >
          Open
        </Button>

        <Box sx={{ flex: 1 }} />

        <Tooltip title="Cancel this meeting">
          <Button onClick={() => onCancel?.(meeting)} color="error">
            Cancel
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
