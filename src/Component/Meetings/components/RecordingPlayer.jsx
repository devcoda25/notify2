// Path: /src/Component/Meetings/components/RecordingPlayer.jsx
import React from "react";
import { Stack, Typography, Alert, Button, Card, CardContent, CardHeader, Divider } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { PlayCircle, Download, ExternalLink } from "lucide-react";

export default function RecordingPlayer({ url, onDownload }) {
  const theme = useTheme();

  if (!url) return <Alert severity="info">Recording not ready yet.</Alert>;
  const isEmbed = url.includes("youtube") || url.includes("vimeo");

  const handleDownload = () => onDownload?.(url);

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <CardHeader
        title="Recording"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: (t) => alpha(t.palette.primary.main, 0.03),
        }}
      />
      <CardContent>
        <Stack gap={2}>
          {isEmbed ? (
            <iframe
              title="Recording"
              src={url}
              style={{ width: "100%", height: 360, border: 0, borderRadius: 8 }}
              allow="autoplay; encrypted-media"
            />
          ) : (
            <video src={url} controls style={{ width: "100%", height: 360, borderRadius: 8 }} />
          )}

          <Stack direction="row" gap={1}>
            <Button startIcon={<PlayCircle />} variant="outlined" component="a" href={url} target="_blank" rel="noreferrer">
              Open
            </Button>
            <Button startIcon={<ExternalLink />} variant="text" component="a" href={url} target="_blank" rel="noreferrer">
              New tab
            </Button>
            <Button startIcon={<Download />} onClick={handleDownload} variant="contained">
              Download
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
