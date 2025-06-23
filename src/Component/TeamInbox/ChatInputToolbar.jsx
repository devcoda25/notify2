import React from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LinkIcon from "@mui/icons-material/Link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SubjectIcon from "@mui/icons-material/Subject";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";

export default function ChatInputToolbar() {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #C4C4C4",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {/* Text Input */}
      <Box sx={{ px: 2, pt: 1 }}>
        <InputBase
          multiline
          rows={3}
          fullWidth
          placeholder="Compose new message"
          sx={{
            fontSize: 14,
          }}
        />
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: "1px solid #C4C4C4" }} />

      {/* Toolbar */}
      <Box sx={{ display: "flex", alignItems: "center", px: 1, py: 0.5 }}>
        <IconButton size="small"><FormatBoldIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatItalicIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatUnderlinedIcon fontSize="small" /></IconButton>
        <IconButton size="small"><StrikethroughSIcon fontSize="small" /></IconButton>
        <IconButton size="small"><EmojiEmotionsIcon fontSize="small" /></IconButton>
        <IconButton size="small"><AttachFileIcon fontSize="small" /></IconButton>
        <IconButton size="small"><AlternateEmailIcon fontSize="small" /></IconButton>
        <IconButton size="small"><LinkIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatListBulletedIcon fontSize="small" /></IconButton>
        <IconButton size="small"><SubjectIcon fontSize="small" /></IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small"><FormatAlignLeftIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignCenterIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignRightIcon fontSize="small" /></IconButton>
      </Box>
    </Paper>
  );
}
