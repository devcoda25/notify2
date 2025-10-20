
import React, { useState, useRef } from "react";

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
import profile3 from "../Assets/img/TeamInbox/membersImg.svg";
import senderimg from "../Assets/img/TeamInbox/chatsender.png";
import evlogo from "../Assets/img/TeamInbox/Ev_Marketlogo.svg";
import carimg from "../Assets/img/TeamInbox/car.svg";
import flagimg from "../Assets/img/TeamInbox/flag-triangle.svg";
import smslogo from "../Assets/img/TeamInbox/SMS_Logo.svg";
import Wp_logo from "../Assets/img/TeamInbox/Whatsapp_logo.svg";
import arrowImg from "../Assets/img/TeamInbox/angle-down-small.svg";
import UploadImgIcon from "../Assets/img/TeamInbox/Rectangle 34625680.svg";
import downloadIcon from "../Assets/img/TeamInbox/arrow-down-to-line.svg";
import mailIcon from "../Assets/img/TeamInbox/mailIcon.svg";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import { SearchOutlinedIcon } from '../Icon';
import AvatarGroup from '@mui/material/AvatarGroup';

// New Component to display a message bubble
const MessageBubble = ({ message }) => {
  const isSender = message.type === 'sent';
  return (
    <Box sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', mb: 2 }}>
      {!isSender && (
        <Avatar src={message.avatar} sx={{ mr: 1, width: 32, height: 32 }} />
      )}
      <Paper
        sx={{
          p: 1.5,
          maxWidth: 400,
          bgcolor: isSender ? '#DCF8C6' : '#FFFFFF',
          borderRadius: 1,
          ml: isSender ? 'auto' : 0,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: message.html }} />
        {message.attachments?.length > 0 && (
          <Box mt={1} pt={1} sx={{ borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {message.attachments.map((att) => (
                <Box
                  key={att.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    border: "1px solid #E5E7EB",
                    borderRadius: 1,
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Box component="img" src={att.previewUrl || UploadImgIcon} alt={att.name} sx={{ width: 40, height: 40, mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{att.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>{Math.round(att.size / 1024)} KB</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
      {isSender && (
        <Avatar src={message.avatar} sx={{ ml: 1, width: 32, height: 32 }} />
      )}
    </Box>
  );
};


export default function TicketsChat({ handleOpenSidePanel }) {
  const [messages, setMessages] = useState([]);
  const chatInputRef = useRef(null); // Key change: create a ref for the ChatInputToolbar

  const handleMessageSubmit = (html, attachments) => {
    if (html.trim() === '' && attachments.length === 0) return;

    const newMessage = {
      id: Date.now(),
      html: html,
      attachments: attachments,
      type: 'sent', // Or 'received', depending on the source
      avatar: profile1, // Your sender's avatar
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  
  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    // ... (Your existing IOSSwitch styling code)
    width: 34,
    height: 16,
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
      width: 14,
      height: 12,
      backgroundColor: "#02CD8D",
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
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
        minHeight: { xs: "100vh", sm: "100vh", md: "100vh" },
        minWidth: { xs: '100%', sm: '270px', md: '270px', lg: '270px', xl: '270px' },
        maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '100%' },
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box sx={{ bgcolor: "#25314C", color: "#fff", p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, flexWrap: { xs: "wrap", sm: "nowrap" }, gap: { xs: 1, sm: 0 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
            {/* <Typography sx={{ color: "white", fontSize: { xs: "14px", sm: "16px" }, textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} variant="h6">
              Application Approval</Typography> */}
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: 1 }}>
              <img src={Wp_logo} alt="logo" height={"20px"} width={"20px"} />
              <img src={evlogo} alt="logo" height={"20px"} width={"20px"} />
              <img src={carimg} alt="caricon" height={"24px"} width={"24px"} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            
            <Chip label="Active" size="small" sx={{ bgcolor: "#C4FFE4", color: "#03CD8C", fontSize: { xs: "0.7rem", sm: "0.75rem" } }} />
            <Avatar sx={{ width: { xs: 20, sm: 24 }, height: { xs: 20, sm: 24 }, bgcolor: "#FFA397", color: "#F64C35" }}><img src={flagimg} alt="flag" /></Avatar>
            <Chip label="Sent" size="small" sx={{ bgcolor: "#17CE7B", color: "#fff", fontWeight: "bold", fontSize: { xs: "0.7rem", sm: "0.75rem" } }} />
            <Avatar src={profile1} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, border: "2px solid white", borderRadius: "50%" }} />
            <Avatar src={profile2} sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, border: "2px solid white", borderRadius: "50%", display: { xs: "none", sm: "flex" } }} />
            <IconButton size="small" onClick={handleOpenSidePanel} sx={{ display: { xs: "block", sm: "block" } }}>
              <MoreVertIcon sx={{ color: "#fff", border: "2px solid white", borderRadius: "50%", height: { xs: "24px", sm: "30px" }, width: { xs: "24px", sm: "30px" } }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            
            <AvatarGroup spacing={2}>
              <Avatar sx={{ width: 24, height: 24 }} alt="Remy Sharp" src={profile1} />
              <Avatar sx={{ width: 24, height: 24 }} alt="Travis Howard" src={profile2} />
              <Avatar sx={{ width: 24, height: 24 }} alt="Cindy Baker" src={profile3} />
            </AvatarGroup>
            <Typography sx={{ color: "white", fontSize: { xs: "10px", sm: "10px" }, textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} variant="h6">+2 Others</Typography>
          </Box>
          <div className="searchbox_teaminbox new_teaminbox_chatbox_search">
            <span className="search_icon"><SearchOutlinedIcon sx={{
              

            }} /></span>
            <input  className="w-100" type="text" placeholder="Search Message" />
          </div>
        </Box>
      </Box>
      <Divider />

      {/* MESSAGES */}
      <Box sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1, bgcolor: "#F4F6FA", overflowY: "auto", maxHeight: { xs: "calc(100vh - 370px)" } }}>
        <Typography variant="caption" sx={{ color: "#E53935", textAlign: "center", display: "block", mb: 2, fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>Thursday, Jun 12 • 09.30 AM (Expired)</Typography>
        <Box sx={{ borderBottom: "1px solid #E5E7EB", my: 1.2 }} />
        <Typography variant="caption" sx={{ color: "#4CAF50", textAlign: "center", mb: 0.5, display: "block", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>Thursday, Jun 12 • 09.30 AM</Typography>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Avatar src={senderimg} sx={{ mr: 1, width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }} />
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: { xs: 1, sm: 1.5 }, maxWidth: { xs: "calc(100% - 40px)", sm: 400 }, borderRadius: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ color: "#1D2739", fontWeight: 600 }} variant="body2">Shane Watson</Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: "0.75rem" }}>Jun 20, 14:20</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <img src={smslogo} alt="sms" width={20} />
                  <img src={evlogo} alt="event" width={20} />
                </Box>
              </Box>
              <Box sx={{ borderBottom: "1px solid #E5E7EB", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", fontWeight: 600, mb: 0.5 }}>Charging Issues</Typography>
              <Typography sx={{ color: "#1D2739" }} variant="body2">I am experiencing repeated issues with your EV charging app, including failed session starts, incorrect station availability status, and frequent crashes. These problems are affecting my ability to charge reliably and efficiently during travel.</Typography>
              <Box sx={{ borderBottom: "1px solid #E5E7EB", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", mb: 1 }}>Attachments</Typography>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, flexWrap: "wrap" }}>
                {[1, 2].map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, border: "1px solid #E5E7EB", borderRadius: 1, backgroundColor: "#F9FAFB", minWidth: { sm: "48%", md: "45%" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box component="img" src={UploadImgIcon} alt="thumbnail" sx={{ width: 40, height: 40, borderRadius: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Charging Port{i + 1}</Typography>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>1.2 MB</Typography>
                      </Box>
                    </Box>
                    <Box component="img" src={downloadIcon} alt="upload" sx={{ width: 20, height: 20 }} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Box sx={{ textAlign: "right", mr: 1, flex: 1 }}>
            <Paper sx={{ p: { xs: 1, sm: 1.5 }, maxWidth: { xs: "calc(100% - 40px)", sm: 400 }, bgcolor: "#FFFFFF", borderRadius: 1, marginLeft: "auto" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ color: "#1D2739", fontWeight: 600 }} variant="body2">Max Tennison</Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: "0.75rem" }}>Jun 18, 01:00 PM</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <img src={mailIcon} alt="wp" width={18} />
                  <img src={carimg} alt="car" width={22} />
                </Box>
              </Box>
              <Box sx={{ borderBottom: "1px solid #C8E6C9", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", fontWeight: 600, mb: 0.5 }}>Charging Issues</Typography>
              <Typography sx={{ color: "#1D2739" }} variant="body2">I am experiencing repeated issues with your EV charging app, including failed session starts, incorrect station availability status, and frequent crashes. These problems are affecting my ability to charge reliably and efficiently during travel.</Typography>
              <Box sx={{ borderBottom: "1px solid #C8E6C9", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", mb: 1 }}>Attachments</Typography>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, flexWrap: "wrap" }}>
                {[1, 2].map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, border: "1px solid #C8E6C9", borderRadius: 1, backgroundColor: "#F2F2F2", minWidth: { sm: "48%", md: "45%" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box component="img" src={UploadImgIcon} alt="thumbnail" sx={{ width: 40, height: 40, borderRadius: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Document{i + 1}</Typography>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>2.3 MB</Typography>
                      </Box>
                    </Box>
                    <Box component="img" src={downloadIcon} alt="upload" sx={{ width: 20, height: 20 }} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
          <Avatar src={profile1} sx={{ mr: 1, width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }} />
        </Box>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Avatar src={senderimg} sx={{ mr: 1, width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }} />
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: { xs: 1, sm: 1.5 }, maxWidth: { xs: "calc(100% - 40px)", sm: 400 }, borderRadius: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography sx={{ color: "#1D2739", fontWeight: 600 }} variant="body2">Shane Watson</Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: "0.75rem" }}>Jun 20, 14:20</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <img src={smslogo} alt="sms" width={20} />
                  <img src={evlogo} alt="event" width={20} />
                </Box>
              </Box>
              <Box sx={{ borderBottom: "1px solid #E5E7EB", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", fontWeight: 600, mb: 0.5 }}>Charging Issues</Typography>
              <Typography sx={{ color: "#1D2739" }} variant="body2">I am experiencing repeated issues with your EV charging app, including failed session starts, incorrect station availability status, and frequent crashes. These problems are affecting my ability to charge reliably and efficiently during travel.</Typography>
              <Box sx={{ borderBottom: "1px solid #E5E7EB", my: 1.2 }} />
              <Typography variant="subtitle2" sx={{ color: "#1D2739", mb: 1 }}>Attachments</Typography>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, flexWrap: "wrap" }}>
                {[1, 2].map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, border: "1px solid #E5E7EB", borderRadius: 1, backgroundColor: "#F9FAFB", minWidth: { sm: "48%", md: "45%" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box component="img" src={UploadImgIcon} alt="thumbnail" sx={{ width: 40, height: 40, borderRadius: 1 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>Charging Port{i + 1}</Typography>
                        <Typography variant="caption" sx={{ color: "#6B7280" }}>1.2 MB</Typography>
                      </Box>
                    </Box>
                    <Box component="img" src={downloadIcon} alt="upload" sx={{ width: 20, height: 20 }} />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
        {/* Render dynamically created messages here */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </Box>

      <Divider />

      {/* INPUT + TOOLBAR */}
      <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: "#fff" }}>
        {/* Key change: Pass the ref to the ChatInputToolbar component */}
        <ChatInputToolbar ref={chatInputRef} onSubmit={handleMessageSubmit} />
      </Box>

      {/* FOOTER ACTIONS */}
      <Box sx={{ p: { xs: 0.5, sm: 0.5 }, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#fff", flexWrap: { xs: "wrap", sm: "nowrap" }, gap: { xs: 1, sm: 0 } }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0.5, sm: 0 }, alignItems: { xs: "flex-start", sm: "center" }, flex: 1, overflowX: { xs: "auto", sm: "visible" } }}>
          <FormControlLabel sx={{ marginRight: "0px", marginLeft: "0px", minWidth: "30px", "& .MuiFormControlLabel-label": { fontSize: "10px" } }} control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label="Private" labelPlacement="bottom" />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "4px", overflowX: { xs: "auto", sm: "visible" }, alignItems: "center", "&::-webkit-scrollbar": { height: "4px" }, "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#c1c1c1", borderRadius: "2px" } }}>
          {["Bots", "Quick Replies", "Templates", "Email"].map((label) => (
            <FormControl key={label} size="small" variant="standard">
              <Select value="" displayEmpty disableUnderline IconComponent={() => null} inputProps={{ "aria-label": "Without label" }} sx={{ position: "relative", m: 0.5, minWidth: { xs: "40px", sm: "40px", md: "40px", lg: "50px", xl: "80px" }, width: { xs: "auto", sm: "auto" }, maxWidth: { xs: "100px", sm: "150px", md: "200px" }, borderRadius: "1%", fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" }, height: "30px", backgroundColor: "#F3F3F3", "& .MuiSelect-select.MuiInputBase-input.MuiInput-input": { padding: "4px 4px !important", minWidth: "10px !important", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, "&::after": { content: '""', position: "absolute", top: "60%", right: "4px", transform: "translateY(-50%)", width: "8px", height: "8px", backgroundImage: `url(${arrowImg})`, backgroundRepeat: "no-repeat", backgroundSize: "contain", pointerEvents: "none" } }}>
                <MenuItem value=""><em>{label}</em></MenuItem>
                <MenuItem value={10}>{label === "Email" ? "Whatsapp" : "option1"}</MenuItem>
                <MenuItem value={20}>{label === "Email" ? "SMS" : "option2"}</MenuItem>
                <MenuItem value={30}>{label === "Email" ? "Email" : "option3"}</MenuItem>
              </Select>
            </FormControl>
          ))}
          <Button 
            variant="contained" 
            endIcon={<KeyboardArrowDownIcon />} 
            sx={{ 
              textTransform: "none", 
              bgcolor: "#5D3FD3", 
              minWidth: "70px", 
              width: "70px", 
              fontSize: "10px", 
              borderRadius: "1%",
              padding: "6px 6px", 
              marginBottom: {
                xs: "0px",
                sm: "10px"
              }, 
              marginRight: "8px",
              marginTop: "14px",
              alignSelf: {
                xs: "flex-end",
                sm: "flex-start"
              }
            }}
            // Key change: Call the handleSubmit function on the ref
            onClick={() => {
              if (chatInputRef.current) {
                chatInputRef.current.handleSubmit();
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
