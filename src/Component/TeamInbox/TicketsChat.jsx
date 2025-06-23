import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChatInputToolbar from "./ChatInputToolbar";
import profile1 from "../Assets/img/TeamInbox/chatprofile1.png";
import profile2 from "../Assets/img/TeamInbox/chatprofile2.png";
import senderimg from "../Assets/img/TeamInbox/chatsender.png";
import evlogo from "../Assets/img/TeamInbox/Ev_Marketlogo.svg";
import carimg from "../Assets/img/TeamInbox/car.svg";
import flagimg from "../Assets/img/TeamInbox/flag-triangle.svg";
import smslogo from "../Assets/img/TeamInbox/SMS_Logo.svg";
import Wp_logo from "../Assets/img/TeamInbox/Whatsapp_logo.svg";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

export default function TicketsChat({ handleOpenSidePanel }) {

 const IOSSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
   ))(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& .MuiSwitch-thumb": {
        backgroundColor: "#fff",
        position: "relative",
        "&::before": {
          content: "'✔'",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "12px",
          color: "#02CD8D",
        },
      },
      "& + .MuiSwitch-track": {
        backgroundColor: "#02CD8D",
        opacity: 1,
        border: 0,
        ...theme.applyStyles?.("dark", {
          backgroundColor: "#02CD8D",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles?.("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles?.("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 16,
    backgroundColor: "#02CD8D",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles?.("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

  return (
    <Paper
      elevation={2}
      sx={{
        minWidth: "500px",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box sx={{ bgcolor: "#25314C", color: "#fff", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              sx={{ color: "white", fontSize: "16px", textWrap: "nowrap" }}
              variant="h6"
            >
              Application Approval
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <img src={Wp_logo} alt="logo" height={"20px"} width={"20px"} />
              <img src={evlogo} alt="logo" height={"20px"} width={"20px"} />
              <img src={carimg} alt="caricon" height={"24px"} width={"24px"} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton size="small" onClick={handleOpenSidePanel}>
              <MoreVertIcon
                sx={{
                  color: "#fff",
                  border: "2px solid white",
                  borderRadius: "50%",
                  height: "30px",
                  width: "30px",
                }}
              />
            </IconButton>
            <Avatar src={profile1} sx={{ width: 32, height: 32, border:"2px solid white", borderRadius:"50%" }} />
            <Avatar src={profile2} sx={{ width: 32, height: 32, border:"2px solid white", borderRadius:"50%" }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label="Active"
            size="small"
            sx={{ bgcolor: "#C4FFE4", color: "#03CD8C" }}
          />
          <Avatar
            sx={{ width: 24, height: 24, bgcolor: "#FFA397", color: "#F64C35" }}
          >
            <img src={flagimg} alt="flag" />
          </Avatar>
          <Chip
            label="Sent"
            size="small"
            sx={{ bgcolor: "#17CE7B", color: "#fff", fontWeight: "bold" }}
          />
          <Avatar src={profile2} sx={{ width: 32, height: 32 }} />
        </Box>
      </Box>
      <Divider />

      {/* MESSAGES */}
      <Box sx={{ p: 2, flexGrow: 1, bgcolor: "#F4F6FA", overflowY: "auto" }}>
        {/* Left message */}
        <Box sx={{ display: "flex", mb: 2 }}>
          <Avatar src={senderimg} sx={{ mr: 1, width: 32, height: 32 }} />
          <Box>
            <Paper sx={{ p: 1.5, maxWidth: 350, borderRadius: 2 }}>
              <Typography sx={{ color: "#1D2739" }} variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  16/06/2025 09.30AM
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <img src={smslogo} alt="smsimg" />
                  <img src={evlogo} alt="evlogo" />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Expired label */}
        <Typography
          variant="caption"
          sx={{
            color: "#E53935",
            textAlign: "center",
            display: "block",
            mb: 2,
          }}
        >
          Thursday, Jun 12 • 09.30 AM (Expired)
        </Typography>

        {/* Right message */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box sx={{ textAlign: "right", mr: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "#4CAF50", mb: 0.5, display: "block" }}
            >
              Thursday, Jun 12 • 09.30 AM
            </Typography>
            <Paper
              sx={{
                p: 1.5,
                maxWidth: 350,
                bgcolor: "#E8F5E9",
                borderRadius: 2,
              }}
            >
              <Typography sx={{ color: "#1D2739" }} variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  18/06/2025 01.00PM
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <img
                    src={Wp_logo}
                    alt="logo"
                    height={"16px"}
                    width={"16px"}
                  />
                  <img src={carimg} alt="logo" height={"20px"} width={"20px"} />
                </Box>
              </Box>
            </Paper>
          </Box>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#9747FF" }}>GK</Avatar>
        </Box>

        {/* Another left message */}
        <Box sx={{ display: "flex", mb: 2 }}>
          <Avatar src={senderimg} sx={{ mr: 1, width: 32, height: 32 }} />
          <Paper sx={{ p: 1.5, maxWidth: 350, borderRadius: 2 }}>
            <Typography sx={{ color: "#1D2739" }} variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                20/06/2025 09.30AM
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <img src={smslogo} alt="smsimg" />
                <img src={evlogo} alt="evlogo" />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Divider />

      {/* INPUT + TOOLBAR */}
      <Box sx={{ p: 2, bgcolor: "#fff" }}>
        <ChatInputToolbar />
      </Box>

      {/* FOOTER ACTIONS */}
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <FormControlLabel
           sx={{marginRight:"0px", marginLeft:"0px"}}
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label="Private"
            labelPlacement="bottom"
          />
          <FormControl size="small">
            <Select
              // value={age}
              // onChange={handleChange}
              sx={{
                m: 1,
                width: 60,
                fontsize: "8px",
                height: "30px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor:"#F3F3F3"
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              placeholder="Bots"
            >
              <MenuItem value="">
                <em>Bots</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              // value={age}
              // onChange={handleChange}
              sx={{
                m: 1,
                width: 60,
                fontsize: "8px",
                height: "30px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor:"#F3F3F3"
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              placeholder="Bots"
            >
              <MenuItem value="">
                <em>Quick Replies</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              // value={age}
              // onChange={handleChange}
              sx={{
                m: 1,
                width: 60,
                fontsize: "8px",
                height: "30px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor:"#F3F3F3"
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              placeholder="Bots"
            >
              <MenuItem value="">
                <em>Templates</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select
              // value={age}
              // onChange={handleChange}
              sx={{
                m: 1,
                width: 60,
                fontsize: "8px",
                height: "30px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor:"#F3F3F3"
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              placeholder="Bots"
            >
              <MenuItem value="">
                <em>Email</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{ textTransform: "none", bgcolor: "#9747FF", minWidth:"80px",marginBottom:"16px", marginRight:"4px" }}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
