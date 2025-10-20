// Path: /src/Component/Meetings/components/live/tiles.jsx
import React, { useEffect, useRef } from "react";
import { Box, Stack, Paper, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { Mic, MicOff, Video as Cam, VideoOff, Phone, User, Pin, PinOff } from "lucide-react";
import SpeakingAura from "./SpeakingAura";
import useAudioLevel from "./useAudioLevel";
import { genderTint } from "./core";


export function ParticipantTile({
  name,
  isYou = false,
  muted = false,
  camOff = false,
  gender = "o",
  variant = "grid",
  stream = null,
  status,
  pinned = false,
  onPin = () => {},
  onToggleMic,
  onToggleCam,
  canEject = false,
  onEject = () => {},
  enableVAD = true,     // 👈 new: enable voice animation
  audioLevel,           // 👈 optional external level 0..1 (overrides hook if provided)
  sx: sxProp,
}) {
  const theme = useTheme();
  const border = `1px solid ${theme.palette.divider}`;
  const videoRef = useRef(null);

  const showVideo = !!(stream && !camOff && stream.getVideoTracks?.().length);

  // 🔊 Audio level (0..1); use hook unless provided
  const hookLevel = useAudioLevel(enableVAD ? stream : null);
  const level = typeof audioLevel === "number" ? audioLevel : hookLevel;
  const isSpeaking = !muted && level > 0.18; // tweak threshold to taste

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (showVideo) {
      el.srcObject = stream;
      el.play?.().catch(() => {});
    } else if (el.srcObject) {
      el.srcObject = null;
    }
  }, [showVideo, stream]);

  const handleKeyDown = (e) => {
    if (!canEject || isYou) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onEject();
    }
  };

  const speakingRingColor = theme.palette.success.main; // or theme.palette.primary.main

  return (
    <Paper
      elevation={0}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      sx={{
        borderRadius: 2,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: showVideo ? theme.palette.grey[100] : genderTint(gender, theme),
        border,
        outline: "none",
        // 🔆 subtle tile glow when speaking (esp. on video)
        boxShadow: isSpeaking ? `inset 0 0 0 2px ${alpha(speakingRingColor, 0.9)}` : "none",
        "&:hover .overlayCtrls, &:focus-within .overlayCtrls": { opacity: 1, pointerEvents: "auto" },
        ...(pinned && { boxShadow: `0 0 0 2px ${theme.palette.primary.main} inset` }),
        ...sxProp,
      }}
    >
      {status && (
        <Chip
          size="small"
          label={status}
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
            zIndex: 3,
            borderRadius: 999,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
            border,
            backdropFilter: "blur(6px)",
            textTransform: "capitalize",
          }}
        />
      )}

      {showVideo ? (
        <Box sx={{ position: "absolute", inset: 0 }}>
          {/* video */}
          <video
            ref={videoRef}
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              backgroundColor: "transparent",
            }}
          />
          {/* Optional thin speaking border overlay for video */}
          <Box
            sx={{
              position: "absolute",
              inset: 6,
              borderRadius: 2,
              border: isSpeaking ? `2px solid ${alpha(speakingRingColor, 0.9)}` : "2px solid transparent",
              transition: "border-color .15s ease",
              pointerEvents: "none",
            }}
          />
        </Box>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", userSelect: "none", position: "relative" }}>
          <Box
            sx={{
              position: "relative",
              width: { xs: 64, sm: 72, md: 88 },
              height: { xs: 64, sm: 72, md: 88 },
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.common.white, 0.7),
              // Breathing scale when speaking (very subtle)
              transform: isSpeaking ? "scale(1.04)" : "scale(1)",
              transition: "transform .12s ease",
            }}
          >
            {/* Aura sits behind the avatar circle */}
            <SpeakingAura
              active={isSpeaking}
              level={level}
              ringColor={speakingRingColor}
              style={{ position: "absolute", inset: -4 }} // ripple slightly beyond the circle
            />
            <User size={48} color={theme.palette.action.disabled} />
          </Box>
        </Stack>
      )}

      {variant !== "featured" && (
        <Box
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            zIndex: 2,
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
            border,
            backdropFilter: "blur(6px)",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            maxWidth: "calc(100% - 16px)",
          }}
        >
          <Typography variant="caption" fontWeight={700} noWrap>
            {name}
            {isYou ? " (you)" : ""}
          </Typography>
        </Box>
      )}

      {/* Overlay controls */}
      <Box
        className="overlayCtrls"
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          opacity: 0,
          transition: "opacity .18s ease",
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <Stack
          direction="row"
          gap={1}
          sx={{
            p: 0.5,
            borderRadius: 999,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.65),
            border,
            backdropFilter: "blur(8px)",
            pointerEvents: "auto",
          }}
        >
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleMic?.(); }} aria-label={muted ? "Unmute mic" : "Mute mic"}>
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
          </IconButton>

          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleCam?.(); }} aria-label={camOff ? "Turn camera on" : "Turn camera off"}>
            {camOff ? <VideoOff size={16} /> : <Cam size={16} />}
          </IconButton>

          <Tooltip title={pinned ? "Unpin" : "Pin"}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onPin?.(); }} aria-label="Pin">
              {pinned ? <PinOff size={16} /> : <Pin size={16} />}
            </IconButton>
          </Tooltip>

          {canEject && !isYou && (
            <Tooltip title="Remove from meeting">
              <IconButton
                size="small"
                disableRipple
                onClick={(e) => { e.stopPropagation(); onEject(); }}
                aria-label="Remove from meeting"
                sx={{ color: (t) => t.palette.error.main, "&:hover": { bgcolor: "transparent" } }}
              >
                <Phone size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
