import React from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
// import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
// import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
// import LinkIcon from "@mui/icons-material/Link";
// import SubjectIcon from "@mui/icons-material/Subject";
// import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
// import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
// import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import TagIcon from '@mui/icons-material/Tag';
import AttachmentIcon from '@mui/icons-material/Attachment';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
// import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import scanImg from "../Assets/img/TeamInbox/scanImg.svg";
import orderImg from "../Assets/img/TeamInbox/orderImg.svg";
import unOrderImg from "../Assets/img/TeamInbox/unorderImg.svg";
import alignLeftImg from "../Assets/img/TeamInbox/menu-left.svg";
import alignRightImg from "../Assets/img/TeamInbox/menu-right.svg";
import alignCenterImg from "../Assets/img/TeamInbox/centerImg.svg";
import centerImg1 from "../Assets/img/TeamInbox/center.svg";
import boldImg from "../Assets/img/TeamInbox/boldImg.svg"
import italicImg from "../Assets/img/TeamInbox/italicImg.svg"
import underImg from "../Assets/img/TeamInbox/underImg.svg"
import hashImg from "../Assets/img/TeamInbox/hashImg.svg"
import recorderImg from "../Assets/img/TeamInbox/recorderImg.svg"
import textImg from "../Assets/img/TeamInbox/textImg.svg"
import atImg from "../Assets/img/TeamInbox/atImg.svg"
import attachImg from "../Assets/img/TeamInbox/attachImg.svg"

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

      <Box sx={{ borderTop: "1px solid #C4C4C4" }} />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent:"space-around" }}>
        <Box sx={{borderRight:"1px solid #E4E4E4", justifyContent:"between", paddingRight:"15px"}}>

        <IconButton size="small"><img alt="icon" src={boldImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={italicImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={underImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={hashImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={attachImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={recorderImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={textImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={atImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={scanImg} height={"12px"} width={"12px"} /></IconButton>
        </Box>

        {/* <IconButton size="small"><FormatAlignLeftIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignCenterIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignRightIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignRightIcon fontSize="small" /></IconButton>
        <IconButton size="small"><FormatAlignRightIcon fontSize="small" /></IconButton> */}
        <Box sx={{marginRight:"20px"}}>
        <IconButton size="small"><img alt="icon" src={orderImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={unOrderImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={alignCenterImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={alignLeftImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={alignRightImg} height={"12px"} width={"12px"} /></IconButton>
        <IconButton size="small"><img alt="icon" src={centerImg1} height={"12px"} width={"12px"} /></IconButton>
        </Box>

      </Box>
    </Paper>
  );
}
