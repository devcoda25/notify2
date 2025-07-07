import React from "react";
import { Box, IconButton, InputBase, Paper } from "@mui/material";
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
import addImg from "../Assets/img/TeamInbox/add-circle.svg"

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

      {/* <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        py: 0.5,
        minHeight: "40px",
        position: "relative"
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          pr: 2,
          
        }}>
          <IconButton size="small">
            <img alt="bold" src={boldImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="italic" src={italicImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="underline" src={underImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="hash" src={hashImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="attach" src={attachImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="recorder" src={recorderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="text" src={textImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="at" src={atImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="scan" src={scanImg} height={"12px"} width={"12px"} />
          </IconButton>
        </Box>

        <Box sx={{
          position: "absolute",
          left: "55%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "100%",
          backgroundColor: "#E4E4E4",
          top: 0,
          bottom: 0
        }} />

        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          pr: 1
        }}>
          <IconButton size="small">
            <img alt="ordered list" src={orderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="unordered list" src={unOrderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align center" src={alignCenterImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align left" src={alignLeftImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align right" src={alignRightImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="center" src={centerImg1} height={"12px"} width={"12px"} />
          </IconButton>
        </Box>
      </Box> */}

      <Box sx={{ 
        display: "flex", 
        alignItems: "center",
        // paddingY:"2px",
        minHeight: "40px",
        gap: 2
      }}>
        {/* Text Formatting Tools - Fixed Width */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0, // Prevent shrinking
          minWidth: "fit-content" // Ensure it takes only needed space
        }}>
          <IconButton size="small">
            <img alt="bold" src={boldImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="italic" src={italicImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="underline" src={underImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="hash" src={hashImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="attach" src={attachImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="recorder" src={recorderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="text" src={textImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="at" src={atImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="scan" src={scanImg} height={"12px"} width={"12px"} />
          </IconButton>
        </Box>

        {/* Vertical Divider */}
        <Box sx={{
          width: "0.5px",
          alignSelf: "stretch", // Stretch to full height of parent
          backgroundColor: "#C4C4C4",
          flexShrink: 0
        }} />

        {/* Alignment Tools - Flexible Width with Left Alignment */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flex: 1, // Take remaining space
          justifyContent: "flex-start" // Left align the alignment tools
        }}>
          <IconButton size="small">
            <img alt="ordered list" src={orderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="unordered list" src={unOrderImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align center" src={alignCenterImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align left" src={alignLeftImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="align right" src={alignRightImg} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="center" src={centerImg1} height={"12px"} width={"12px"} />
          </IconButton>
          <IconButton size="small">
            <img alt="center" src={addImg} height={"16px"} width={"16px"} />
          </IconButton>
        </Box>
      </Box>
      
    </Paper>
  );
}