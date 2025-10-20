import React, { useState, useRef } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import TicketsCard from "../../src/Component/TeamInbox/TicketsCard";
import SearchboxComponent from "../Component/SearchboxComponent";
import ButtonComponent from "../Component/ButtonComponent";
// import TextfieldComponent from "../Component/TextfieldComponent";
import style from "../Component/MuiStyles/muiStyle";
// import Select from "react-select";
import intiated from "../../src/Component/Assets/img/Intiated.png";
import broadcast from "../../src/Component/Assets/img/Broadcast.png";
import groups from "../../src/Component/Assets/img/Groups.png";
import chatbots from "../../src/Component/Assets/img/Chatbots.png";
import extracted from "../../src/Component/Assets/img/Extracted.png";
import call from "../../src/Component/Assets/img/Call Interaction.png";
import house from "../../src/Component/Assets/img/House.png";
import myteam from "../../src/Component/Assets/img/My Team.png";
import privateIcon from "../../src/Component/Assets/img/PrivateIcon.png";
import teamLeads from "../../src/Component/Assets/img/Team Leads.png";
import technical from "../../src/Component/Assets/img/Technical.png";
import IVR from "../../src/Component/Assets/img/TeamInbox/IVRImg.svg";
import PushToModule from "../../src/Component/Assets/img/TeamInbox/BellImg.svg";
import Custom from "../../src/Component/Assets/img/TeamInbox/NutImg.svg";
import AngleRight from "../../src/Component/Assets/img/TeamInbox/angle-right.svg";
import boy from "../../src/Component/Assets/img/boy.png";
import wp_logo from "../../src/Component/Assets/img/TeamInbox/Whatsapp_logo.svg";
import mail_logo from "../../src/Component/Assets/img/TeamInbox/Mail_logo.svg";
import "semantic-ui-css/semantic.min.css";
import { FilterAltIcon, MenuIcon } from "../Component/Icon";
import TicketsChat from "../Component/TeamInbox/TicketsChat";
import TicketSidePanel from "../Component/TeamInbox/TicketSidePanel";
import closeIconPath from "../Component/Assets/img/TeamInbox/times-circle.svg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Stack,
} from '@mui/material';
import SearchboxComponent2 from "../Component/SearchboxComponent2";
// import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 220;
const collapsedWidth = 60;



const ticketData = [
  { text: "Initiated", icon: intiated, count: "02" },
  { text: "Broadcast", icon: broadcast, count: "04", unreaded: true },
  { text: "Groups", icon: groups, count: "04" },
  { text: "Extracted", icon: extracted, count: "24", unreaded: true },
  { text: "Chatbots", icon: chatbots, count: "18", unreaded: true },
  { text: "Call Interactions", icon: call, count: "10", unreaded: true },
  { text: "IVR", icon: IVR, count: "18" },
  { text: "Push To Module", icon: PushToModule, count: "12" },
  { text: "Custom", icon: Custom, sideIcon: AngleRight },
];

const insiderData = [
  { text: "Private", icon: privateIcon, count: "04" },
  { text: "Team Leads", icon: teamLeads, count: "04" },
  { text: "My Team", icon: myteam, count: "24" },
  { text: "House", icon: house, count: "18" },
  { text: "Technical", icon: technical, count: "10" },
];

const cardData = [
  {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Active",
    subStatus: "Sent",
    statusBgColor: "#BCFFE9",
    statusColor: "#17CE7B",
    subStatusColor: "#17CE7B",
    flagColor: "#F64C35",
    flagBgColor: "#FFA397",
    avatars: [{ src: boy, name: "Josh" }],
    logo: [{ src: wp_logo, logo_name: "WhatsApp" }],
    count: 2,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
  {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Ended",
    subStatus: "Failed",
    statusBgColor: "#FFB6B6",
    statusColor: "#F64C35",
    subStatusColor: "#F64C35",
    flagColor: "#FFF157",
    flagBgColor: "#FEFFE0",
    avatars: [
      { src: boy, name: "Joshua" },
      { src: boy, name: "Carol lee" },
      { src: boy, name: "Bob Smith" },
    ],
    logo: [{ src: mail_logo, logo_name: "Email" }],
    count: 2,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
  {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Pending",
    subStatus: "Received",
    statusBgColor: "#A0D8FF",
    statusColor: "#1976d2",
    subStatusColor: "#1976d2",
    flagColor: "#2EEAAE",
    flagBgColor: "#BCFFE9",
    avatars: [
      { src: boy, name: "Jonny" },
      { src: boy, name: "Emma" },
      { src: boy, name: "Michael" },
    ],
    logo: [{ src: mail_logo, logo_name: "Email" }],
    count: 5,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
  {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Initiated",
    subStatus: "Read",
    statusBgColor: "#FFF0DF",
    statusColor: "#F7941F",
    subStatusColor: "#F7941F",
    flagColor: "#0897FF",
    flagBgColor: "#84CBFF",
    avatars: [
      { src: boy, name: "Josh" },
      { src: boy, name: "Alice" },
      { src: boy, name: "Michael" },
    ],
    logo: [{ src: wp_logo, logo_name: "WhatsApp" }],
    count: 5,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
   {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Initiated",
    subStatus: "Read",
    statusBgColor: "#FFF0DF",
    statusColor: "#F7941F",
    subStatusColor: "#F7941F",
    flagColor: "#0897FF",
    flagBgColor: "#84CBFF",
    avatars: [
      { src: boy, name: "Josh" },
      { src: boy, name: "Alice" },
      { src: boy, name: "Michael" },
    ],
    logo: [{ src: wp_logo, logo_name: "WhatsApp" }],
    count: 5,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
   {
    title: "Application Approval Is Pending",
    checkboxLabel: "APPS-120",
    status: "Initiated",
    subStatus: "Read",
    statusBgColor: "#FFF0DF",
    statusColor: "#F7941F",
    subStatusColor: "#F7941F",
    flagColor: "#0897FF",
    flagBgColor: "#84CBFF",
    avatars: [
      { src: boy, name: "Josh" },
      { src: boy, name: "Alice" },
      { src: boy, name: "Michael" },
    ],
    logo: [{ src: wp_logo, logo_name: "WhatsApp" }],
    count: 5,
    description:
      "Charging Stations Are Often Installed In Remote, Poorly Lit, Or Hard-To-Access Areas, Making Users Feel Unsafe—Especially At Night. Inconvenient Placement Also Disrupts Travel Plans, Adding Unnecessary Detours Or Long Walks From Key Destinations.",
    createdDate: "31 May 2025",
    updatedDate: "06 June 2025",
    createdAgo: "6 Days Ago",
    updatedAgo: "2 Days Ago",
    users: [
      { name: "Joshua", role: "Evzone", avatar: boy },
      { name: "John", role: "Handler", avatar: boy },
    ],
  },
];

const TeamInbox = () => {


  const [isButtonVisible, setIsButtonVisible] = useState(true);


  const [state, setState] = useState({
    open: true,
    activeTicketId: null,
    openSidePanel: false,
    openNewTicketsModal: false,
    selectedFileName: "",
  });
  
  const toggleDrawer = () => {
    setState((prev) => ({ ...prev, open: !prev.open }));
  };

  const handleOpenChat = (ticketId) => {
    setState((prev) => {
      const newActiveTicketId =
        prev.activeTicketId === ticketId ? null : ticketId;
      if (newActiveTicketId === null) {
        setIsButtonVisible(true);
      } else {
        setIsButtonVisible(false);
      }
      return {
        ...prev,
        activeTicketId: newActiveTicketId,
      };
    });
  };
  const handleOpenSidePanel = () => {
    setState((prev) => ({ ...prev, openSidePanel: true }));
  };

  
  //  NewTicket modalbox

  const [openRecipientModal, setOpenRecipientModal] = useState(false);
  const [tempRecipient, setTempRecipient] = useState({ sid: "", mobile: "", whatsapp: "" });
  const [subject, setSubject] = useState('');
  const [module, setModule] = useState('');
  const [channel, setChannel] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

    const handleUploadClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    };

    const handleCloseRecipient =()=>{
      setOpenRecipientModal(false);
    }

    const handleRemoveFile = (index) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };
  
  const handleOpenNewTicketsModal = () => {
    setState((prev) => ({ ...prev, openNewTicketsModal: true }));
  };

  const handleCloseNewTicketsModal = () => {
    setRecipients([]);
    setSelectedFiles([]);
    setState((prev) => ({ ...prev, openNewTicketsModal: false }));
  };


  return (
    <>
      <Box sx={{ ...style.new_teaminbox_container ,color: "#000"}}>
        {state.openNewTicketsModal && (
          <div className="modal-overlay">
            <div className="new-ticket-container">
              <div className="new-ticket-header">
                <div>
                  <h2 className="new-ticket-title">New Chat</h2>
                </div>
                <div>
                  <button className="close-btn" onClick={handleCloseNewTicketsModal}>
                    <img src={closeIconPath} alt="close" width="20" height="20" />
                  </button>
                </div>
              </div>

              <div className="new-ticket-content" style={{ overflowY: 'auto', maxHeight: '425px', paddingRight: 16 }}>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="Enter Subject"
                    className="form-input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

              <div className="form-group">
                <label>Target Module</label>
                <select className="form-select" value={module} onChange={(e) => setModule(e.target.value)}>
                  <option value="">Select Target Module</option>
                  <option value="billing">Billing</option>
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                </select>
                {/* <div className="horizontal-line"></div> */}
              </div>

              <div className="form-group">
                <label>Channel</label>
                <select className="form-select" value={channel} onChange={(e) => setChannel(e.target.value)}>
                  <option value="">Select Channel</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="chat">Chat</option>
                </select>
                {/* <div className="horizontal-line"></div> */}
              </div>

              <div className="recipient-section">
                <div className="recipient-header">
                  <label>Recipient</label>
                </div>

              <div className="recipient-input-row">
              <input
                type="text"
                placeholder="Add Recipient"
                className="recipient-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <button className="add-btn" onClick={() => setOpenRecipientModal(true)}>
                Add
              </button>
            </div>


           

            <div className="divider-section">
              <span className="divider-text">Or</span>
            </div>

          <div className="file-upload-section">
                <label className="file-upload-label">Upload csv/excel file</label>
                <div className="file-upload-input-row">
                  <button className="select-files-btn" onClick={handleUploadClick}>
                    Select Files
                  </button>
                  <input
                    type="text"
                    className="selectFiles-input"
                    // placeholder="Enter file description (optional)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }}
                />
              </div>

        {selectedFiles.length > 0 && (
            <div className="uploaded-files" style={{ marginTop: 12 }}>
              <ul style={{ maxHeight: 100, overflowY: 'auto', marginTop: 6 }}>
                {selectedFiles.map((file, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 12 }}>{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                      title="Remove"
                    >
                      <img src="/icons/delete-icon.svg" alt="Delete" width="16" height="16" />
                    </button>


                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>

        <div className="action-buttons" style={{ padding: '10px 44px' }}>
          <button className="cancel-button" onClick={handleCloseNewTicketsModal}>
            Cancel
          </button>
          <button className="submit-btn">
            Submit
          </button>
        </div>
      </div>
          </div>
        )}
        <Drawer
          variant="permanent"
          sx={{
            width: state.open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            color: "#000",
            zIndex: "50",
            boxSizing: "border-box",
            height: "100vh", 
            transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            "& .MuiDrawer-paper": {
              width: state.open ? drawerWidth : collapsedWidth,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              overflowX: "hidden",
              overflowY: "auto", 
              top: "60px",
              height: "calc(100vh - 60px)",
              // Hide sidebar on mobile when chat is open
              display: {
                xs: state.activeTicketId !== null ? "none" : "block",
                sm: "block",
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: state.open ? "space-between" : "center",
              padding: "4px",
              marginLeft: state.open ? "12px" : "0px",
              position: "sticky", 
              top: 0,
              backgroundColor: "white", 
              zIndex: 1,
              color: "#000",
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>

          {state.open && (
            <Box sx={{ ...style.teaminbox_search_container, 
            
            }}>
              <SearchboxComponent
                placeholder="Search..."
                customSearch="new_teaminbox_search"
              />
            </Box>
          )}

          <List
            sx={{
              flex: 1, 
              paddingBottom: 2, 
            }}
          >
            <Box
              sx={{
                borderBottom: state.open ? "1px solid #ccc" : "none",
                mb: "5px",
                pb: "5px",
              }}
            >
              {state.open && (
                <Typography
                  variant="caption"
                  sx={style.teaminbox_sidebar_header}
                >
                  TICKETS
                </Typography>
              )}
              {ticketData.map(({ text, icon, count, sideIcon, unreaded }) => (
                <Tooltip
                  key={text}
                  title={
                    !state.open ? (
                      <Typography sx={{ fontSize: 11, color: "#fff" }}>
                        {text}
                      </Typography>
                    ) : (
                      ""
                    )
                  }
                  placement="right"
                  arrow
                  disableHoverListener={state.open}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#5D3FD3",
                        borderRadius: 1,
                        px: 1,
                      },
                    },
                  }}
                >
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: state.open ? "space-between" : "center",
                      pt: state.open ? "4px" : "10px",
                      pb: state.open ? "4px" : "10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      "&:hover, &:focus": {
                        backgroundColor: "#f0f0f0",
                        "& .MuiTypography-root": {
                          color: "#5D3FD3",
                        },
                        "& .MuiChip-root": {
                          backgroundColor: "#5D3FD3",
                          color: "#fff",
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon
                        sx={{ minWidth: 0, mr: state.open ? 1 : 0 }}
                      >
                        <img
                          src={icon}
                          alt={text}
                          style={{ width: 20, height: 20 }}
                        />
                      </ListItemIcon>
                      {state.open && (
                        <ListItemText
                          primary={<Typography>{text}</Typography>}
                        />
                      )}
                    </Box>
                    {state.open &&
                      (sideIcon ? (
                        <img
                          style={{ marginRight: "10px" }}
                          src={AngleRight}
                          alt="AngleRight"
                        />
                      ) : (
                        <Chip
                          label={count}
                          size="small"
                          sx={{
                            fontSize: "12px",
                            width: "30px",
                            height: "28px",
                            borderRadius: "6px",
                            display: "flex",
                            border: unreaded ? "1px solid #5D3FD3" : "",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            "& .MuiChip-label": {
                              overflow: "visible",
                              textOverflow: "unset",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      ))}
                  </ListItem>
                </Tooltip>
              ))}
            </Box>
            <Box>
              {state.open && (
                <Typography
                  variant="caption"
                  sx={style.teaminbox_sidebar_header}
                >
                  INSIDER
                </Typography>
              )}
              {insiderData.map(({ text, icon, count }) => (
                <Tooltip
                  key={text}
                  title={
                    !state.open ? (
                      <Typography sx={{ fontSize: 11, color: "#fff" }}>
                        {text}
                      </Typography>
                    ) : (
                      ""
                    )
                  }
                  placement="right"
                  arrow
                  disableHoverListener={state.open}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "#5D3FD3",
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                      },
                    },
                  }}
                >
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: state.open ? "space-between" : "center",
                      pt: state.open ? "4px" : "10px",
                      pb: state.open ? "4px" : "10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      "&:hover, &:focus": {
                        backgroundColor: "#f0f0f0",
                        "& .MuiTypography-root": {
                          color: "#5D3FD3",
                        },
                        "& .MuiChip-root": {
                          backgroundColor: "#5D3FD3",
                          color: "#fff",
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemIcon
                        sx={{ minWidth: 0, mr: state.open ? 1 : 0 }}
                      >
                        <img
                          src={icon}
                          alt={text}
                          style={{ width: 20, height: 20 }}
                        />
                      </ListItemIcon>
                      {state.open && (
                        <ListItemText
                          primary={<Typography>{text}</Typography>}
                        />
                      )}
                    </Box>
                    {state.open && (
                      <Chip
                        label={count}
                        size="small"
                        sx={{
                          fontSize: "12px",
                          width: "30px",
                          height: "28px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0,
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              ))}
            </Box>
          </List>
        </Drawer>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // marginLeft: state.open ? `${drawerWidth}px` : `${collapsedWidth}px`,
            transition: "margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            width: state.open
              ? `calc(100vw - ${drawerWidth}px)`
              : `calc(100vw - ${collapsedWidth}px)`,
            minHeight: "100vh",
          }}
        >
          
         

          {/* Main Content Area */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              
              gap: 2,
              padding: "0 24px 24px",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* Left Panel - Tickets List */}
            <Box
              sx={{
                width: state.activeTicketId !== null
                  ? state.openSidePanel
                    ? "310px"
                    : "350px"
                  : "100%",
                flexShrink: 0,
                height: "100vh",
                transition: "width 0.4s ease-in-out",
                display: {
                  xs: state.activeTicketId !== null && state.openSidePanel ? "none" : "block",
                  sm: "block",
                },
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Tickets Header */}
                <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: state.activeTicketId !== null ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: "left",
                    }}
                  >
                    <Typography
                      sx={{ textAlign: "left", marginBottom: "10px" }}
                      variant="h6"
                      fontWeight="bold"
                    >
                    Messages
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1,
                      
                     }}>
                      <SearchboxComponent2
                        placeholder="search tickets"
                        customSearch="new_teaminbox_search"
                      
                      />
                      <IconButton sx={{...style.new_teaminbox_filter ,
                     
                        
                      }}>
                        <FilterAltIcon   sx={{
                          height: '30px',
                          width: '30px',
                          padding: '2px',
                        }}  />
                      </IconButton>
                    </Box>
                                        {isButtonVisible && <ButtonComponent sx={{ color:"#FFF"}}
              label="+ New Message"
              onClick={handleOpenNewTicketsModal}
              customBtn="new_teaminbox_button"
            />}
                  </Box>
                </Box>

                {/* Tickets List - Scrollable */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 1,
                  }}
                >
                  {cardData.map((data, idx) => (
                    <TicketsCard
                      key={idx}
                      id={idx} // Pass the id
                      {...data}
                      handleOpenChat={handleOpenChat}
                      isActive={state.activeTicketId === idx} // Pass isActive
                    />
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Middle Panel - Chat */}
            {state.activeTicketId !== null && (
              <Box
                sx={{
                  flex: 1,
                  minWidth: "400px",
                  display: {
                    xs: state.openSidePanel ? "none" : "block",
                    sm: "block",
                  },
                  transition: "all 0.4s ease-in-out",
                }}
              >
                {/* <Paper elevation={1} sx={{ height: "100%" }}> */}
                <TicketsChat handleOpenSidePanel={handleOpenSidePanel} />
                {/* </Paper> */}
              </Box>
            )}

            {/* Right Panel - Side Panel */}
            {state.openSidePanel && (
              <Box
                sx={{
                  height: "100vh",
                  width: "200px",
                  flexShrink: 0,
                  transition: "all 0.4s ease-in-out",
                }}
              >
                <TicketSidePanel
                  onClose={() => setState({ ...state, openSidePanel: false })}
                />
              </Box>
            )}
          </Box>

          {/* Mobile Navigation - Same as your existing code */}
          {state.activeTicketId !== null && (
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white",
                borderTop: "1px solid #e0e0e0",
                padding: "8px 16px",
                justifyContent: "space-around",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              {/* Your existing mobile nav buttons */}
            </Box>
          )}
        </div>
      </Box> 

      <Dialog
      open={openRecipientModal}
      onClose={() => setOpenRecipientModal(false)}
      sx={{
        zIndex: 99999,
        '& .MuiDialog-paper': {
          width: '580px', 
          maxWidth: '580px',
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6">Add Recipient</Typography>
        <IconButton onClick={() => setOpenRecipientModal(false)} size="small">
          <img
            src={closeIconPath}
            alt="close"
            width="20"
            height="20"
          />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              SID
            </Typography>
            <Input
              fullWidth
              disableUnderline
              value={tempRecipient.sid}
              onChange={(e) => setTempRecipient({ ...tempRecipient, sid: e.target.value })}
              placeholder="Enter SID"
              sx={{
                backgroundColor: '#f5f5f5',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            />
          </div>

          <div>
            <Typography variant="subtitle2" gutterBottom>
              Mobile Number
            </Typography>
            <Input
              fullWidth
              disableUnderline
              value={tempRecipient.mobile}
              onChange={(e) => setTempRecipient({ ...tempRecipient, mobile: e.target.value })}
              placeholder="Enter Mobile Number"
              sx={{
                backgroundColor: '#f5f5f5',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            />
          </div>

          <div>
            <Typography variant="subtitle2" gutterBottom>
              WhatsApp Number
            </Typography>
            <Input
              fullWidth
              value={tempRecipient.whatsapp}
              onChange={(e) => setTempRecipient({ ...tempRecipient, whatsapp: e.target.value })}
              disableUnderline
              placeholder="Enter WhatsApp Number"
              sx={{
                backgroundColor: '#f5f5f5',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            />
          </div>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button sx={{color:"#868686", borderColor:"#868686"}} onClick={handleCloseRecipient} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#1A54AB" }}
          onClick={() => {
            setRecipients([...recipients, tempRecipient]);
            setTempRecipient({ sid: "", mobile: "", whatsapp: "" });
            setOpenRecipientModal(false);
          }}
          >
        Add
        </Button>

      </DialogActions>
       </Dialog>


    </>
  );
};

export default TeamInbox;
