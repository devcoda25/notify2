// import React, { useState, useRef, useEffect } from "react";
// import { Grid,Chip } from "@mui/material";
// import ButtonComponent from "../Component/ButtonComponent";
// import TextfieldComponent from "../Component/TextfieldComponent";
// import CustomAccordion from "../Component/TeamInbox/CustomAccordion";
// import AutocompleteComponent from "../Component/AutocompleteComponent";
// import Accordion from "react-bootstrap/Accordion";
// import style from "../Component/MuiStyles/muiStyle";
// import ReporterType from "../Component/Reporter";
// import Editorbox from "../Component/TeamInbox/Editorbox";
// import Select from "react-select";
// import SearchboxComponent from "../Component/SearchboxComponent";
// import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";
// import {
//   AccessTimeOutlinedIcon,
//   ErrorOutlineOutlinedIcon,
//   ExpandLessOutlinedIcon,
//   DoNotDisturbOnOutlinedIcon,
//   ExpandCircleDownOutlinedIcon,
//   PestControlOutlinedIcon,
//   EmailOutlinedIcon,
//   RemoveRedEyeOutlinedIcon,
//   MoreHorizOutlinedIcon,
//   KeyboardArrowDownIcon,
//   ArrowForwardIcon,
//   CloseIcon,
//   KeyboardDoubleArrowRightRoundedIcon,
//   TodayOutlinedIcon,
//   AccountCircleOutlinedIcon,
//   AttachFileOutlinedIcon,
//   PeopleAltOutlinedIcon,
//   TranslateSharpIcon,
//   MailOutlineSharpIcon,
//   ArrowUpwardSharpIcon,
//   ThumbUpAltOutlinedIcon,
//   FolderOutlinedIcon,
//   CheckCircleOutlineOutlinedIcon,
//   SellOutlinedIcon,
//   WorkspacesOutlinedIcon,
//   AddOutlinedIcon,
//   CloseOutlinedIcon,
//   FormatBoldOutlinedIcon,
//   FormatItalicOutlinedIcon,
//   FormatUnderlinedOutlinedIcon,
//   StrikethroughSOutlinedIcon,
//   CodeOffOutlinedIcon,
//   FormatListNumberedOutlinedIcon,
//   FormatListBulletedOutlinedIcon,
//   InsertLinkOutlinedIcon,
//   PhotoSizeSelectActualIcon,
//   TagIcon,
//   AttachFileIcon,
//   RadioButtonCheckedIcon,
//   FormatColorTextIcon,
//   AutoFixHighIcon,
//   ExtensionIcon,
//   DashboardIcon,
//   HeadsetIcon,
//   MenuIcon
// } from "../Component/Icon";
// import ToggleSwitch from "../Component/ToggleSwitch";

// const ticketData = [
//   {
//     title: "soluta quam velit",
//     date: "Jun 2",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [
//       <AccessTimeOutlinedIcon />,
//       <ErrorOutlineOutlinedIcon sx={{ color: "red" }} />,
//     ],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//     ticketCount: 2,
//   },
//   {
//     title: "Laudantium neque veritatis",
//     date: "Jun 2",
//     subtitle: "OPS-102",
//     status: "To Do",
//     icons: [
//       <ExpandLessOutlinedIcon className="expandlessicon" />,
//       <ErrorOutlineOutlinedIcon sx={{ color: "red" }} />,
//     ],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//     ticketCount: 2,
//   },
//   {
//     title: "Moiestiae saape illum",
//     date: "Jun 1",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<DoNotDisturbOnOutlinedIcon style={{ color: "green" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Dignissimos maiores porro",
//     date: "May 31",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<DoNotDisturbOnOutlinedIcon style={{ color: "green" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Nihil porro repudiandae",
//     date: "May 31",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<DoNotDisturbOnOutlinedIcon style={{ color: "green" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Aspernatur cumque ipsum",
//     date: "May 30",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<DoNotDisturbOnOutlinedIcon style={{ color: "green" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Culpa quos aliquam",
//     date: "May 30",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<ExpandCircleDownOutlinedIcon sx={{ color: "#0069d9" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Atque incidunt autem",
//     date: "May 30",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<ExpandCircleDownOutlinedIcon sx={{ color: "#0069d9" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
//   {
//     title: "Atque incidunt autem",
//     date: "May 30",
//     subtitle: "APPS-216",
//     status: "To Do",
//     icons: [<ExpandCircleDownOutlinedIcon sx={{ color: "#0069d9" }} />],
//     avatar: "/assets/teaminbox/images/resource/friend-avatar.jpg",
//   },
// ];
// const filterData = [
//   {
//     icon: <AccountCircleOutlinedIcon />,
//     name: "Agent",
//   },
//   {
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         width="16"
//         height="16"
//       >
//         <path
//           stroke="currentcolor"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           stroke-width="2"
//           d="M10 16h6M4 8h2m-2 4h2m-2 4h2m5-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0m9-4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"
//         ></path>
//       </svg>
//     ),
//     name: "Assignment",
//   },
//   {
//     icon: <AttachFileOutlinedIcon />,
//     name: "Attachment",
//   },
//   {
//     icon: <TodayOutlinedIcon />,
//     name: "Creation Date",
//   },
//   {
//     icon: <PeopleAltOutlinedIcon />,
//     name: "Followers",
//   },
//   {
//     icon: <TranslateSharpIcon />,
//     name: "Language",
//   },
//   {
//     icon: <TodayOutlinedIcon />,
//     name: "Last activity",
//   },
//   {
//     icon: <MailOutlineSharpIcon />,
//     name: "Last Message",
//   },
//   {
//     icon: <ArrowUpwardSharpIcon />,
//     name: "Priority",
//   },
//   {
//     icon: <ThumbUpAltOutlinedIcon />,
//     name: "Rating",
//   },
//   {
//     icon: <FolderOutlinedIcon />,
//     name: "Source",
//   },
//   {
//     icon: <CheckCircleOutlineOutlinedIcon />,
//     name: "Status",
//   },
//   {
//     icon: <SellOutlinedIcon />,
//     name: "Tags",
//   },
//   {
//     icon: <WorkspacesOutlinedIcon />,
//     name: "Teams",
//   },
// ];
// //dropdown options
// const channelOptions = ["Email", "Push", "Platform", "SMS", "WhatsApp"]; //channel
// const priorityOptions = ["High", "Medium", "Low"]; //priority
// const assignedOptions = ["Allie Harmon", "Thameem", "Vinu"]; //assigned to
// const projectOptions = ["School", "Marketplace", "Wallet", "Chargstation"]; // project
// const ticketTypeOptions = ["Task1", "Task2", "Task3"]; //ticket type
// const reporterOptions = ["Allie Harmon", "Reporter1", "Reporter2"]; //reporter
// const fieldTypeOption = ["Simplex", "Duplex"]; //field type
// const templateTypeOption = ["Email", "SMS", "Platform", "Push", "WhatsApp"]; //template type
// const sidOptions = [
//   { value: "user 1", label: "user 1" },
//   { value: "user 2", label: "user 2" },
//   { value: "user 3", label: "user 3" },
// ];
// const teamOptions = ["Team1", "Team2", "Team3"]; //team
// const agentOptions = ["Assigned", "Unassigned"]; //agent
// const ticketsPriorityOptions = ["Low", "Medium", "High", "Urgent"]; //ticket priority
// const newticketsStatusOptions = [
//   "Open",
//   "Pending",
//   "On hold",
//   "Solved",
//   "Closed",
// ]; //new ticket status
// const tagOptions = ["complaint", "feedback", "request", "sales", "support"]; //tag

// const TeamInbox = () => {
//   const [state, setState] = useState({
//     isLeftContainerVisible: true,
//     isMyticketsVisible: true,
//     value: 0,
//     open: false,
//     openNewTicketsModal: false,
//     priorityContent: "Medium",
//     assignedContent: "Allie Harmon",
//     projectContent: projectOptions[0],
//     ticketTypeContent: "Task1",
//     reporterContent: "Allie Harmon",
//     ticketStatusContent: "Closed",
//     selectedTicket: null,
//     addFilterPopup: false,
//     isActive: false,
//     addpeopleContent: false,
//     addtagContent: false,
//     sidContent: [],
//     teamContent: "Team1",
//     agentContent: "Unassigned",
//     ticketsPriorityContent: "Medium",
//     newTicketsStatusContent: "Pending",
//     tagContent: null,
//     selectedTags: [],
//     channelContent: "Email",
//     fieldTypeContent: fieldTypeOption[0],
//     templateTypeContent: templateTypeOption[0],
//     selectedFileName: "",
//   });

//   const { authUser } = useParams();
//   const currentAuthUser = authUser || 0;
//   const popupRef = useRef(null);
//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const updateState = (key, value) => {
//     setState((prevState) => ({
//       ...prevState,
//       [key]: value,
//     }));
//   };
//   //new tickets add tags

//   const handleTagChange = (event, newValue) => {
//     if (newValue && !state.selectedTags.includes(newValue)) {
//       updateState("selectedTags", [...state.selectedTags, newValue]);
//     }
//     updateState("tagContent", null);
//   };

//   const handleDeleteTag = (tagToDelete) => {
//     updateState(
//       "selectedTags",
//       state.selectedTags.filter((tag) => tag !== tagToDelete)
//     );
//   };

//   //add people

//   const handleClickAddpeople = () => updateState("addpeopleContent", true);
//   const handleCloseAddpeople = () => updateState("addpeopleContent", false);

//   //tag
//   const handleClickAddtag = () => updateState("addtagContent", true);
//   const handleCloseAddtag = () => updateState("addtagContent", false);

//   const handleTogglePrivate = () => updateState("isActive", !state.isActive);

//   // Add filter popup
//   const handleAddFilterOpen = () => updateState("addFilterPopup", true);

//   const handleTicketClick = (index) => updateState("selectedTicket", index);
//   const handleToggle = () => updateState("open", !state.open);

//   const handleNewTicketToggle = () => updateState("openNewTicketsModal", true);
//   const handleCloseNewTicketsModal = () =>
//     updateState("openNewTicketsModal", false);

//   const handleChange = (event, newValue) => updateState("value", newValue);
//   const toggleLeftContainer = () =>
//     updateState("isLeftContainerVisible", !state.isLeftContainerVisible);

//   const toggleMyticketsContainer = () => {
//     updateState("isMyticketsVisible", !state.isMyticketsVisible);
//     updateState("isLeftContainerVisible", false);
//   };

//   const handleClickOutside = (event) => {
//     if (popupRef.current && !popupRef.current.contains(event.target)) {
//       updateState("addFilterPopup", false);
//     }
//   };

//   // const applyFormat = (tag) => {
//   //     const textarea = textareaRef.current;
//   //     const start = textarea.selectionStart;
//   //     const end = textarea.selectionEnd;
//   //     const selectedText = textarea.value.substring(start, end) || 'text';

//   //     let formatted = selectedText;

//   //     switch (tag) {
//   //         case 'bold':
//   //             formatted = `**${selectedText}**`;
//   //             break;
//   //         case 'italic':
//   //             formatted = `*${selectedText}*`;
//   //             break;
//   //         case 'underline':
//   //             formatted = `<u>${selectedText}</u>`;
//   //             break;
//   //         case 'strikethrough':
//   //             formatted = `~~${selectedText}~~`;
//   //             break;
//   //         case 'numbered':
//   //             formatted = `1. ${selectedText}`;
//   //             break;
//   //         case 'bulleted':
//   //             formatted = `- ${selectedText}`;
//   //             break;
//   //         case 'link':
//   //             formatted = `[${selectedText}](http://example.com)`;
//   //             break;
//   //         case 'image':
//   //             formatted = `![alt text](http://image-url.com/image.jpg)`;
//   //             break;
//   //         case 'tag':
//   //             formatted = `#${selectedText}`;
//   //             break;
//   //         case 'attach':
//   //             formatted = `[attachment.pdf]`;
//   //             break;
//   //         case 'radio':
//   //             formatted = `• ${selectedText}`;
//   //             break;
//   //         case 'color':
//   //             formatted = `<span style="color:red;">${selectedText}</span>`;
//   //             break;
//   //         case 'highlight':
//   //             formatted = `<mark>${selectedText}</mark>`;
//   //             break;
//   //         case 'mention':
//   //             formatted = `@${selectedText}`;
//   //             break;
//   //         default:
//   //             break;
//   //     }

//   //     const before = textarea.value.substring(0, start);
//   //     const after = textarea.value.substring(end);

//   //     textarea.value = before + formatted + after;

//   //     const newPos = before.length + formatted.length;
//   //     textarea.setSelectionRange(newPos, newPos);
//   //     textarea.focus();
//   // };

//   const handleUploadExcelClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       updateState("selectedFileName", file.name);
//       console.log("Selected file:", file.name);
//     }
//   };

//   const applyFormat = (tag) => {
//     const editor = textareaRef.current;
//     editor.focus();

//     switch (tag) {
//       case "bold":
//         document.execCommand("bold");
//         break;
//       case "italic":
//         document.execCommand("italic");
//         break;
//       case "underline":
//         document.execCommand("underline");
//         break;
//       case "strikethrough":
//         document.execCommand("strikeThrough");
//         break;
//       case "numbered":
//         document.execCommand("insertOrderedList");
//         break;
//       case "bulleted":
//         document.execCommand("insertUnorderedList");
//         break;
//       case "radio":
//         document.execCommand("insertText", false, "• ");
//         break;
//       case "link": {
//         const url = prompt("Enter URL:", "https://");
//         if (url) {
//           document.execCommand("createLink", false, url);
//         }
//         break;
//       }
//       case "image": {
//         const input = document.createElement("input");
//         input.type = "file";
//         input.accept = "image/*";
//         input.style.display = "none";
//         document.body.appendChild(input);

//         input.onchange = () => {
//           const file = input.files[0];
//           if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//               const img = document.createElement("img");
//               img.src = e.target.result;
//               img.alt = file.name;
//               img.width = 36;
//               img.height = 36;
//               editor.appendChild(img);
//             };
//             reader.readAsDataURL(file);
//           }
//           document.body.removeChild(input);
//         };

//         input.click();
//         break;
//       }
//       case "tag":
//         document.execCommand("insertText", false, "#");
//         break;
//       case "attach": {
//         const input = document.createElement("input");
//         input.type = "file";
//         input.accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt";
//         input.style.display = "none";
//         document.body.appendChild(input);

//         input.onchange = () => {
//           const file = input.files[0];
//           if (file) {
//             const fileName = file.name;
//             const span = document.createElement("span");
//             span.textContent = `[${fileName}]`;
//             span.style.color = "blue";
//             span.style.textDecoration = "underline";
//             editor.appendChild(span);
//           }
//           document.body.removeChild(input);
//         };

//         input.click();
//         break;
//       }
//       case "color":
//         document.execCommand("foreColor", false, "red");
//         break;
//       case "highlight":
//         document.execCommand("backColor", false, "yellow");
//         break;
//       case "mention":
//         document.execCommand("insertText", false, "@");
//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     if (state.addFilterPopup) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [state.addFilterPopup]);
//   useEffect(() => {

//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//   return () => {
//       document.body.style.overflow = originalOverflow;
//     };
//   }, []);
//   return (
//     <>
//       <div id="outer-container" className="team_inbox_main-wrapper">
//         {state.openNewTicketsModal ? (
//           <div className="new_tickets_container">
//             <div className="new_tickets_header">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 onClick={handleCloseNewTicketsModal}
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//               >
//                 <path
//                   stroke="currentcolor"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                   stroke-width="2"
//                   d="M5 12h14M5 12l4 4m-4-4 4-4"
//                 ></path>
//               </svg>
//               <span className="new_tickets_title">New ticket</span>
//             </div>
//             <div className="new_tickets_main">
//               <div className="textbox_container">
//                 <label>Subject</label>
//                 <TextfieldComponent
//                   placeholder="Enter subject"
//                   customStyle="custom_textfield_box"
//                 />
//               </div>
//               <div className="requester_name_email">
//                 <div className="textbox_container" style={{ width: "50%" }}>
//                   <label>Requester name</label>
//                   <TextfieldComponent
//                     placeholder="Enter requester name"
//                     customStyle="custom_textfield_box"
//                   />
//                 </div>
//                 <div className="textbox_container" style={{ width: "50%" }}>
//                   <label>Requester email</label>
//                   <TextfieldComponent
//                     placeholder="Enter requester email"
//                     customStyle="custom_textfield_box"
//                   />
//                 </div>
//               </div>
//               <div className="textbox_container">
//                 <label>User SID</label>
//                 <Select
//                   isMulti
//                   options={sidOptions}
//                   placeholder="Select the SID"
//                 />

//                 {/* <TextfieldComponent placeholder='Enter SID' customStyle='custom_textfield_box' /> */}
//               </div>
//               <div className="upload_excelfile_container">
//                 {state.selectedFileName && <p> {state.selectedFileName}</p>}
//                 <input
//                   type="file"
//                   accept=".xls,.xlsx"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   style={{ display: "none" }}
//                 />
//                 <ButtonComponent
//                   label="upload Excel file"
//                   onClick={handleUploadExcelClick}
//                 />
//                 <ButtonComponent
//                   label="submit"
//                   onClick={handleCloseNewTicketsModal}
//                 />
//               </div>

//               {/* {
//                                     state.addpeopleContent ? (
//                                         <div className='textbox_container'>
//                                             <label>People in the loop<span className='close_btn'><CloseOutlinedIcon onClick={handleCloseAddpeople} /></span></label>
//                                             <TextfieldComponent placeholder='Enter email address and confrim with enter' customStyle='custom_textfield_box' />
//                                         </div>
//                                     ) : (
//                                         <div className='add_peeple_container' onClick={handleClickAddpeople}>
//                                             <AddOutlinedIcon />Add People to the loop
//                                         </div>
//                                     )
//                                 }
//                                 <div className='textbox_container'>
//                                     <label>Team</label>
//                                     <AutocompleteComponent
//                                         options={teamOptions}
//                                         value={state.teamContent}
//                                         onChange={(event, newValue) => updateState({ teamContent: newValue })}
//                                         customStyles={style.newticketsAutocomplete}
//                                     />
//                                 </div>
//                                 <div className='textbox_container'>
//                                     <label>Agent<span className='assgined_text'>Assign me</span></label>
//                                     <AutocompleteComponent
//                                         options={agentOptions}
//                                         value={state.agentContent}
//                                         onChange={(event, newValue) => updateState({ agentContent: newValue })}
//                                         customStyles={style.newticketsAutocomplete}
//                                     />
//                                 </div>
//                                 <div className='textbox_container'>
//                                     <label>Priority</label>
//                                     <AutocompleteComponent
//                                         options={ticketsPriorityOptions}
//                                         value={state.ticketsPriorityContent}
//                                         onChange={(event, newValue) => updateState({ ticketsPriorityContent: newValue })}
//                                         customStyles={style.newticketsAutocomplete}
//                                     />
//                                 </div>
//                                 <div className='textbox_container'>
//                                     <label>Status</label>
//                                     <AutocompleteComponent
//                                         options={newticketsStatusOptions}
//                                         value={state.newTicketsStatusContent}
//                                         onChange={(event, newValue) => updateState({ newTicketsStatusContent: newValue })}
//                                         customStyles={style.newticketsAutocomplete}
//                                     />
//                                 </div>
//                                 <div className="tag_container">
//                                     {
//                                         state.addtagContent ? (
//                                             <>
//                                                 <div className='tag_dropdown_container'>
//                                                     <AutocompleteComponent
//                                                         placeholder='Search tag...'
//                                                         options={tagOptions}
//                                                         value={state.tagContent}
//                                                         onChange={handleTagChange}
//                                                         customStyles={style.newticketsAutocomplete}
//                                                     />

//                                                 </div>
//                                                 <span className='add_tag_dropdown_close'><CloseOutlinedIcon onClick={handleCloseAddtag} /></span>
//                                             </>
//                                         ) : (
//                                             <div className='add_peeple_container' onClick={handleClickAddtag} >
//                                                 <AddOutlinedIcon />Add tag
//                                             </div>
//                                         )

//                                     }
//                                     <div className='chip_container'>
//                                         {state.selectedTags.map((tag, index) => (
//                                             <Chip
//                                                 key={index}
//                                                 label={tag}
//                                                 onDelete={() => handleDeleteTag(tag)}
//                                                 sx={style.chipStyles}
//                                             />
//                                         ))}
//                                     </div>

//                                 </div> */}
//               {/* <Editorbox
//                                     isActive={state.isActive}
//                                     ticketStatusOptions={ticketStatusOptions}
//                                     onTogglePrivate={handleTogglePrivate}
//                                     ticketStatusContent={state.ticketStatusContent}
//                                     onChange={(event, newValue) => updateState({ ticketStatusContent: newValue })}
//                                     showTicketStatus={false}
//                                 /> */}
//             </div>
//           </div>
//         ) : (
//           <div className="teaminbox_container">
//             <div
//               className="teaminbox_left_container"
//               style={{
//                 marginLeft: state.isLeftContainerVisible ? "0" : "-225px",
//                 opacity: state.isLeftContainerVisible ? 1 : 0,
//                 visibility: state.isLeftContainerVisible ? "visible" : "hidden",
//                 transition:
//                   "margin-left 0.3s ease, opacity 0.3s ease, visibility 0.3s ease",
//               }}
//             >
//               <div className="ticket-view-accordin">
//                 <Accordion defaultActiveKey="0">
//                   <Accordion.Item eventKey="0">
//                     <Accordion.Header>Ticket Views</Accordion.Header>
//                     <Accordion.Body>
//                       <ul className="ticket-view-dropdown">
//                         <li>
//                           My Tickets <span>9</span>
//                         </li>
//                         <li>
//                           Past Due <span>4</span>
//                         </li>
//                         <li>
//                           High Priority<span>90</span>
//                         </li>
//                         <li>
//                           Unassigned<span>512</span>
//                         </li>
//                         <li>
//                           All Tickets<span>2,451</span>
//                         </li>
//                       </ul>
//                     </Accordion.Body>
//                     <ul>
//                       <li className="tic-view-chat">
//                         <span className="acc-icon-text">
//                           {/* <i
//                             className="fa fa-headphones"
//                             aria-hidden="true"
//                           ></i>{" "} */}
//                           <HeadsetIcon />
//                           Live Chat
//                         </span>
//                       </li>
//                       <li className="tic-view-chat">
//                         <span className="acc-icon-text">
//                           {/* <i className="fa fa-th-large" aria-hidden="true"></i>{" "} */}
//                           <DashboardIcon />
//                           Boards
//                         </span>
//                       </li>
//                       <Link to="/extended">
//                         <li className="tic-view-chat">
//                           <span className="acc-icon-text">
//                             <ExtensionIcon />
//                             Extended
//                           </span>
//                         </li>
//                       </Link>
//                       <Link to="/chatbot">
//                         <li className="tic-view-chat">
//                           <span className="acc-icon-text">
//                             <svg
//                               width="20"
//                               height="20"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 36 36"
//                             >
//                               <g id="_5_Chatbots" data-name="5_Chatbots">
//                                 <path
//                                   d="M20,35H16A15,15,0,0,1,1,20V16A15,15,0,0,1,16,1h4A15,15,0,0,1,35,16v4A15,15,0,0,1,20,35ZM16,3A13,13,0,0,0,3,16v4A13,13,0,0,0,16,33h4A13,13,0,0,0,33,20V16A13,13,0,0,0,20,3Z"
//                                   fill="#777"
//                                 />
//                                 <path
//                                   d="M12.3,26a1,1,0,0,1-1-1V15.71a1,1,0,0,1,2,0V25A1,1,0,0,1,12.3,26Z"
//                                   fill="#777"
//                                 />
//                                 <path
//                                   d="M18,21.29a1,1,0,0,1-1-1V11a1,1,0,1,1,2,0v9.28A1,1,0,0,1,18,21.29Z"
//                                   fill="#777"
//                                 />
//                                 <path
//                                   d="M23.7,26a1,1,0,0,1-1-1V15.71a1,1,0,1,1,2,0V25A1,1,0,0,1,23.7,26Z"
//                                   fill="#777"
//                                 />
//                               </g>
//                             </svg>
//                             Chatbots
//                           </span>
//                         </li>
//                       </Link>
//                     </ul>
//                   </Accordion.Item>
//                 </Accordion>
//               </div>
//             </div>
//             {!state.isMyticketsVisible && (
//               <div>
//                 <KeyboardDoubleArrowRightRoundedIcon
//                   className="toggle_btn"
//                   onClick={toggleMyticketsContainer}
//                 />
//                 <div className="toggle_mytickets_content"></div>
//               </div>
//             )}
//             <div
//               className="first_container"
//               style={{
//                 marginLeft: state.isMyticketsVisible ? "0" : "-230px",
//                 opacity: state.isMyticketsVisible ? 1 : 0,
//                 visibility: state.isMyticketsVisible ? "visible" : "hidden",
//                 transition:
//                   "margin-left 0.3s ease, opacity 0.3s ease, visibility 0.3s ease",
//                 width: state.selectedTicket !== null ? "260px" : "100%",
//               }}
//             >
//               <div
//                 className="vertical-line"
//                 onClick={toggleMyticketsContainer}
//               ></div>

//               {/* <div className="mytickets_header">
//                 <span className="ticketview-open" onClick={toggleLeftContainer}>
//                  <MenuIcon />
//                 </span>
//                 <span className="mytickets_title">My Tickets</span>
//                 <div className="ticket-filter-btn ticket-popupbtn">
//                   <ButtonComponent
//                     label="+ New Ticket"
//                     customBtn="new_ticket_button"
//                     onClick={handleNewTicketToggle}
//                   />
//                 </div>
//               </div> */}

//               <div className="mynewtickets_header_content">
//                 <div><MenuIcon onClick={toggleLeftContainer} />
//                   <span className="mytickets_title">My Tickets</span>
//                 </div>
//                 <ButtonComponent
//                   label="+ New Ticket"
//                   customBtn="new_ticket_button"
//                   onClick={handleNewTicketToggle}
//                 />
//               </div>

//               <div className="mytickets_filter_search_container">
//                 <ButtonComponent
//                   label="+ Add Filter"
//                   customBtn="teaminbox_add_filter"
//                   onClick={handleAddFilterOpen}
//                 />
//                 {state.addFilterPopup && (
//                   <div className="AddFilter_container" ref={popupRef}>
//                     <ul className="ul_filter">
//                       {filterData.map((data, index) => (
//                         <>
//                           <li key={index} className="li_filter">
//                             {data.icon}
//                             <span className="filter_item_text">
//                               {data.name}
//                             </span>
//                           </li>
//                         </>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <SearchboxComponent placeholder="Search Tickets" />
//               </div>

//               <div className="mytickets_content">
//                 <ul>
//                   {ticketData.map((ticket, index) => (
//                     <li
//                       key={index}
//                       className="list_container"
//                       onClick={() => handleTicketClick(index)}
//                     >
//                       <div className="mytickets_listheader">
//                         <div className="listtitle">{ticket.title}</div>
//                         <div className="listdate">{ticket.date}</div>
//                       </div>
//                       <div className="mytickets_list_content">
//                         <div className="list_left_content">
//                           <input type="checkbox" className="checkall" />
//                           <div className="mytickets_list_subtitle">
//                             {ticket.subtitle}
//                           </div>
//                         </div>
//                         <div className="list_right_content">
//                           <a title="" className="inbox-msg">
//                             <span className="blue-bg">{ticket.status}</span>
//                           </a>
//                           {ticket.icons.map((icon, i) => (
//                             <React.Fragment key={i}>{icon}</React.Fragment>
//                           ))}
//                           <span className="hum-avator">
//                             <img src={ticket.avatar} alt="" />
//                           </span>
//                           {ticket.ticketCount && (
//                             <span className="tickets_count">
//                               {ticket.ticketCount}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             {state.selectedTicket !== null && (
//               <div className="teaminbox_right_container">
//                 <div className="teaminboxmain_content">
//                   <Grid container spacing={2}>
//                     <Grid item xs={9}>
//                       <div className="ticketsgridbox">
//                         <div>
//                           <div className="ticketsgrid_header">
//                             <div className="ticketsgrid_title">
//                               {ticketData[state.selectedTicket]?.title}
//                             </div>

//                             <div className="ticketsgrid_subheader">
//                               <div className="ticketsgrid_left_side">
//                                 <PestControlOutlinedIcon
//                                   sx={{ color: "#0069d9" }}
//                                 />
//                                 <span className="ticketsgrid_subtitle">
//                                   OPS-102(100669518)| created 11/14/22 12:32 PST
//                                 </span>
//                               </div>
//                               <div className="ticketsgrid_right_side">
//                                 {/* <span className='ticketsgrid_span'><EmailOutlinedIcon /></span>
//                                                                 <span className='ticketsgrid_span'><RemoveRedEyeOutlinedIcon sx={{ marginRight: '3px' }} /><span >2</span></span> */}
//                                 <span className='ticketsgrid_span'><MoreHorizOutlinedIcon /></span>
//                                 <span className='hum-avator'>
//                                   <img src="/assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
//                                 </span>
//                                 <span className='hum-avator'>
//                                   <img src="/assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
//                                 </span>
//                                 <span className='oktext'>ok</span></div>
//                             </div>
//                           </div>
//                           <div className='chat_wrapper'>
//                             <div className='chat_section'>
//                               <div className='tickets_timeline'>
//                                 <div className='user_tickets_timeline'>
//                                   <div className="userline_right">
//                                     <div className="tickets_userdate">
//                                       20/5/2025
//                                     </div>
//                                     {/* <KeyboardArrowDownIcon className='tickets_arrowbtn' /> */}
//                                   </div>
//                                   <div className='chatmessage receiver_side'>
//                                     <img src="/assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' />
//                                     <div className="userline">
//                                       <div className="userline_left">
//                                         <div>Allie Harmon</div>
//                                         <div className='tickets_usersubname'>To Name Name@gmail.com</div>
//                                       </div>

//                                     </div>
//                                     <div className='timeline_content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
//                                     <button className='imagebtn'>Screen_shot.png <div className='imagedate'>16 jun 2022,1:30 PM</div></button>
//                                     <button className='imagebtn'>Screen_shot.png<div className='imagedate'>16 jun 2022,1:30 PM</div></button>
//                                     <p className="chat-timestamp-sender">
//                                       2:30 PM
//                                     </p>
//                                   </div>
//                                   <div className='chatmessage sender_side'>
//                                     <div className="userline">
//                                       <div>
//                                         <div className='user_information'><span>Allie Harmon</span><img src="/assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' /></div>
//                                         <div className='timeline_content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div>
//                                         <p className="chat-timestamp-receiver">
//                                           2:35 PM
//                                         </p>
//                                       </div>
//                                     </div>
//                                     {/* <img src="/assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' /> */}
//                                     {/* <div className="userline">
//                                                                             <div className="userline_left">
//                                                                                 <div>Allie Harmon</div>
//                                                                                 <div className='tickets_usersubname'>To Name Name@gmail.com</div>
//                                                                             </div>
//                                                                             <div className="userline_right">
//                                                                                 <div className='tickets_userdate'>Feb 9, 2022 10:40AM</div>

//                                                                             </div> */}

//                                     {/* </div> */}
//                                     {/* <div className='timeline_content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </div> */}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="tickets_timeline">
//                                 <div className="user_tickets_timeline">
//                                   <div className="userline_right">
//                                     <div className="tickets_userdate">
//                                       25/5/2025
//                                     </div>
//                                     {/* <KeyboardArrowDownIcon className='tickets_arrowbtn' /> */}
//                                   </div>
//                                   <div className="chatmessage receiver_side">

//                                     <img
//                                       src="/assets/teaminbox/images/resource/user1.jpg"
//                                       alt=""
//                                       className="tickets_timeline_user_image"
//                                     />
//                                     <div className="userline">
//                                       <div className="userline_left">
//                                         <div>Allie Harmon</div>
//                                         <div className="tickets_usersubname">
//                                           To Name Name@gmail.com
//                                         </div>
//                                       </div>

//                                     </div>
//                                     <div className="timeline_content">
//                                       Dolorem similique et aliquid illum dolor.vel
//                                       quo magnam.{" "}
//                                       <p className="chat-timestamp-sender">
//                                         2:30 PM
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="chatmessage sender_side">
//                                     {/* <img src="/assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' /> */}
//                                     <div className="userline">
//                                       <div>
//                                         <div className="user_information">
//                                           <span>Allie Harmon</span>
//                                           <img
//                                             src="/assets/teaminbox/images/resource/user1.jpg"
//                                             alt=""
//                                             className="tickets_timeline_user_image"
//                                           />
//                                         </div>
//                                         <div className="timeline_content">
//                                           Dolorem similique et aliquid illum
//                                           dolor.vel quo magnam.{" "}
//                                           <p
//                                             className="chat-timestamp-receiver"
//                                           >
//                                             2:35 PM
//                                           </p>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="editorbox_container">
//                               <div className="support_tickets">
//                                 {/* <textarea
//                                                 ref={textareaRef}
//                                                 placeholder={state.isActive ? 'Enter private note visible only to agents' : 'Enter Message'}
//                                                 className='tab_reply_content'
//                                             ></textarea>

//                                             */}
//                                 <div
//                                   ref={textareaRef}
//                                   contentEditable
//                                   spellCheck={false}
//                                   placeholder={
//                                     state.isActive
//                                       ? "Enter private note visible only to agents"
//                                       : "Enter Message"
//                                   }
//                                   className="tab_reply_content"
//                                 ></div>

//                                 {/* Formatting Toolbar */}
//                                 <div className="reply_text_container">
//                                   <div className="reply_text_style">
//                                     <FormatBoldOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("bold")}
//                                     />
//                                     <FormatItalicOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("italic")}
//                                     />
//                                     <FormatUnderlinedOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("underline")}
//                                     />
//                                     <StrikethroughSOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("strikethrough")}
//                                     />
//                                     <CodeOffOutlinedIcon className="reply_text_container_icons" />
//                                     <FormatListNumberedOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("numbered")}
//                                     />
//                                     <FormatListBulletedOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("bulleted")}
//                                     />
//                                     <InsertLinkOutlinedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("link")}
//                                     />
//                                     <PhotoSizeSelectActualIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("image")}
//                                     />
//                                   </div>
//                                 </div>

//                                 {/* Second Toolbar */}
//                                 <div className="reply_text_second_container">
//                                   <div className="reply_text_style">
//                                     <ToggleSwitch
//                                       leftLabel="Private"
//                                       isActive={state.isActive}
//                                       onToggle={handleTogglePrivate}
//                                     />

//                                     <TagIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("tag")}
//                                     />
//                                     <AttachFileIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("attach")}
//                                     />
//                                     <RadioButtonCheckedIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("radio")}
//                                     />
//                                     <FormatColorTextIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("color")}
//                                     />
//                                     <AutoFixHighIcon
//                                       className="reply_text_container_icons"
//                                       onClick={() => applyFormat("highlight")}
//                                     />
//                                     <div
//                                       onClick={() => applyFormat("mention")}
//                                       className="reply_text_container_icons"
//                                     >
//                                       @
//                                     </div>
//                                   </div>

//                                   {/* Ticket Status & Submit Button */}
//                                   <div className="mail_send_btn">
//                                     <div>
//                                       <AutocompleteComponent
//                                         options={fieldTypeOption}
//                                         value={state.fieldTypeContent}
//                                         onChange={(event, newValue) =>
//                                           updateState({
//                                             fieldTypeContent: newValue,
//                                           })
//                                         }
//                                         customStyles={
//                                           style.ticketsStatusAutocomplete
//                                         }
//                                       />
//                                     </div>
//                                     <div>
//                                       <AutocompleteComponent
//                                         options={templateTypeOption}
//                                         value={state.templateTypeContent}
//                                         onChange={(event, newValue) =>
//                                           updateState({
//                                             templateTypeContent: newValue,
//                                           })
//                                         }
//                                         customStyles={
//                                           style.ticketsStatusAutocomplete
//                                         }
//                                       />
//                                     </div>
//                                     <ButtonComponent
//                                       label="Submit"
//                                       customBtn="submit_btn"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </Grid>
//                     <Grid item xs={3} className="todo_container">
//                       <div className="todogridbox">
//                         <div className="todo_header">
//                           <button
//                             className="todo_button"
//                             onClick={handleToggle}
//                           >
//                             To Do
//                             <span className="todobtn_arrow">
//                               <KeyboardArrowDownIcon />
//                             </span>
//                           </button>
//                           <CloseIcon className="todo_close_icon" />
//                         </div>
//                         {state.open && (
//                           <>
//                             <div className="todo_modal_container">
//                               <ul>
//                                 <li>
//                                   <div>
//                                     <ArrowForwardIcon />
//                                     <span className="todo_status">
//                                       Work in Progress
//                                     </span>{" "}
//                                   </div>
//                                   <div className="todo_status_detail">
//                                     In Progress
//                                   </div>
//                                 </li>
//                                 <li>
//                                   <div>
//                                     <ArrowForwardIcon />
//                                     <span className="todo_status">
//                                       Needs Review
//                                     </span>
//                                   </div>
//                                   <div className="todo_status_detail">
//                                     In Progress
//                                   </div>
//                                 </li>
//                                 <li>
//                                   <div>
//                                     <ArrowForwardIcon />
//                                     <span className="todo_status">
//                                       Completed
//                                     </span>
//                                   </div>
//                                   <div className="todo_status_detail">Done</div>
//                                 </li>
//                               </ul>
//                             </div>
//                           </>
//                         )}
//                         <div className="todo_main_content">
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Channel
//                             </label>
//                             <AutocompleteComponent
//                               options={channelOptions}
//                               value={state.channelContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ channelContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Priority
//                             </label>
//                             <AutocompleteComponent
//                               options={priorityOptions}
//                               value={state.priorityContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ priorityContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Assigned To{" "}
//                               <span className="assignme_span">
//                                 Assign to me
//                               </span>
//                             </label>
//                             <AutocompleteComponent
//                               options={assignedOptions}
//                               value={state.assignedContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ assignedContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Modules
//                             </label>
//                             <AutocompleteComponent
//                               options={projectOptions}
//                               value={state.projectContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ projectContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Ticket Type
//                             </label>
//                             <AutocompleteComponent
//                               options={ticketTypeOptions}
//                               value={state.ticketTypeContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ ticketTypeContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Due Date
//                             </label>
//                             <input type="date" className="todo_due_date" />
//                           </div>
//                           <div className="todo_dropdown_container">
//                             <label className="todo_dropdown_label">
//                               Reporter
//                             </label>
//                             <AutocompleteComponent
//                               options={reporterOptions}
//                               value={state.reporterContent}
//                               onChange={(event, newValue) =>
//                                 updateState({ reporterContent: newValue })
//                               }
//                               customStyles={style.newticketsAutocomplete}
//                             />
//                           </div>
//                           <div className="todo_dropdown_container addtags_style">
//                             <label className="todo_dropdown_label">Tags</label>
//                             <button className="addtag_btn">Agg Tag+</button>
//                           </div>
//                           <div className="todo_accordion_container">
//                             <CustomAccordion label="TASKS" />
//                             <CustomAccordion label="COLLECTED FIELDS" />
//                             <CustomAccordion label="LINKED TICKETS 2" />
//                             <CustomAccordion label="HISTORY" />
//                           </div>
//                         </div>
//                       </div>
//                     </Grid>
//                   </Grid>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };
// export default TeamInbox;

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
import TextfieldComponent from "../Component/TextfieldComponent";
import style from "../Component/MuiStyles/muiStyle";
import Select from "react-select";
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

const drawerWidth = 220;
const collapsedWidth = 60;

const ticketData = [
  { text: "Initiated", icon: intiated, count: "02" },
  { text: "Broadcast", icon: broadcast, count: "04", unreaded: true },
  { text: "Groups", icon: groups, count: "04" },
  { text: "Extracted", icon: extracted, count: "24", unreaded : true },
  { text: "Chatbots", icon: chatbots, count: "18", unreaded : true },
  { text: "Call Interactions", icon: call, count: "10", unreaded : true },
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
    statusBgColor: "#2EEAAE",
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
];
const sidOptions = [
  { value: "user 1", label: "user 1" },
  { value: "user 2", label: "user 2" },
  { value: "user 3", label: "user 3" },
];

const TeamInbox = () => {
  const [state, setState] = useState({
    open: true,
    openChat: false,
    openSidePanel: false,
    openNewTicketsModal: false,
    selectedFileName: "",
  });

  const fileInputRef = useRef(null);
  const toggleDrawer = () => {
    setState((prev) => ({ ...prev, open: !prev.open }));
  };
  const handleOpenNewTicketsModal = () => {
    setState((prev) => ({ ...prev, openNewTicketsModal: true }));
  };
  const handleCloseNewTicketsModal = () => {
    setState((prev) => ({ ...prev, openNewTicketsModal: false }));
  };
  const handleUploadExcelClick = () => {
    fileInputRef.current.click();
  };

  const handleOpenChat = () => {
    setState((prev) => ({ ...prev, openChat: true }));
  };
  const handleOpenSidePanel = () => {
    setState((prev) => ({ ...prev, openSidePanel: true }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setState((prev) => ({
        ...prev,
        selectedFileName: file.name,
      }));
      console.log("Selected file:", file.name);
    }
  };

  // for teaminbox modalbox

  const [selectedFile, setSelectedFile] = useState(null);
  const [recipient, setRecipient] = useState("");
  // const fileInputRef = useRef(null);

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    // if (onClose) {
    //   onClose();
    // }
    console.log("closed");
  };

  return (
    <>
      {state.openNewTicketsModal ? (
        //  <div className="modal_overlay">
        // <div className="new_tickets_container">
        //   <div
        //     className="new_tickets_header"
        //     onClick={handleCloseNewTicketsModal}
        //   >
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       fill="none"
        //       viewBox="0 0 24 24"
        //       width="20"
        //       height="20"
        //     >
        //       <path
        //         stroke="currentcolor"
        //         stroke-linecap="round"
        //         stroke-linejoin="round"
        //         stroke-width="2"
        //         d="M5 12h14M5 12l4 4m-4-4 4-4"
        //       ></path>
        //     </svg>
        //     <span className="new_tickets_title">New ticket</span>
        //   </div>
        //   <div className="new_tickets_main">
        //     <div className="textbox_container">
        //       <label>Subject</label>
        //       <TextfieldComponent
        //         placeholder="Enter subject"
        //         customStyle="custom_textfield_box"
        //       />
        //     </div>
        //     <div className="requester_name_email">
        //       <div className="textbox_container" style={{ width: "50%" }}>
        //         <label>Requester name</label>
        //         <TextfieldComponent
        //           placeholder="Enter requester name"
        //           customStyle="custom_textfield_box"
        //         />
        //       </div>
        //       <div className="textbox_container" style={{ width: "50%" }}>
        //         <label>Requester email</label>
        //         <TextfieldComponent
        //           placeholder="Enter requester email"
        //           customStyle="custom_textfield_box"
        //         />
        //       </div>
        //     </div>
        //     <div className="textbox_container">
        //       <label>User SID</label>
        //       <Select
        //         isMulti
        //         options={sidOptions}
        //         placeholder="Select the SID"
        //       />
        //     </div>
        //     <div className="upload_excelfile_container">
        //       {state.selectedFileName && <p> {state.selectedFileName}</p>}
        //       <input
        //         type="file"
        //         accept=".xls,.xlsx"
        //         ref={fileInputRef}
        //         onChange={handleFileChange}
        //         style={{ display: "none" }}
        //       />
        //       <ButtonComponent
        //         label="upload Excel file"
        //         onClick={handleUploadExcelClick}
        //         customBtn="new_teaminbox_button"
        //       />
        //       <ButtonComponent
        //         label="submit"
        //         onClick={handleCloseNewTicketsModal}
        //         customBtn="new_teaminbox_button"
        //       />
        //     </div>
        //   </div>
        // </div>
        // </div>

        <div className="modal-overlay">
          <div className="new-ticket-container">
            {/* Header */}
            <div className="new-ticket-header">
              <div>
                <h2 className="new-ticket-title">New ticket</h2>
              </div>
              <div>
                <button
                  className="close-btn"
                  onClick={handleCloseNewTicketsModal}
                >
                  <img src={closeIconPath} alt="close" width="20" height="20" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="new-ticket-content">
              {/* Subject */}
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Enter Subject"
                  className="form-input"
                />
              </div>

              {/* Target Module */}
              <div className="form-group ">
                <label>Target Module</label>
                <select className="form-select">
                  <option value="">Select Target Module</option>
                  <option value="billing">Billing</option>
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                </select>
                <div className="horizontal-line"></div>
              </div>

              {/* Channel */}
              <div className="form-group">
                <label>Channel</label>
                <select className="form-select">
                  <option value="">Select Channel</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="chat">Chat</option>
                </select>
                 <div className="horizontal-line"></div>
              </div>

              {/* Recipient Section */}
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
                  <button className="add-btn">Add</button>
                </div>

                <div className="divider-section">
                  <span className="divider-text">Or</span>
                </div>

                <div className="file-upload-section">
                  <label className="file-upload-label">
                    Upload csv/excel file
                  </label>
                  <input
                    type="text"
                    className="selectFiles-input"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    style={{ display: "none" }}
                  />
                  <button
                    className="select-files-btn"
                    onClick={handleUploadClick}
                  >
                    Select Files
                  </button>
                  {selectedFile && (
                    <span className="selected-file">{selectedFile.name}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="cancel-button"
                  onClick={handleCloseNewTicketsModal}
                >
                  Cancel
                </button>
                <button className="submit-btn">Submit</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Box sx={style.new_teaminbox_container}>
          <Drawer
            variant="permanent"
            sx={{
              width: state.open ? drawerWidth : collapsedWidth,
              flexShrink: 0,
              whiteSpace: "nowrap",
              boxSizing: "border-box",
              overflow: "hidden",
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              "& .MuiDrawer-paper": {
                width: state.open ? drawerWidth : collapsedWidth,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                overflowX: "hidden",
                top: "60px",
                // Hide sidebar on mobile when chat is open
                display: {
                  xs: state.openChat ? "none" : "block",
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
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            </Box>

            {state.open && (
              <Box sx={style.teaminbox_search_container}>
                <SearchboxComponent
                  placeholder="Search..."
                  customSearch="new_teaminbox_search"
                />
              </Box>
            )}

            <List>
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
                        border: unreaded ? "1px solid #5D3FD3":"",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 0,
                        '& .MuiChip-label': {
                          overflow: 'visible',
                          textOverflow: 'unset',
                          whiteSpace: 'nowrap', 
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
            {/* Header - Full width */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                width: "100%",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                My Tickets
              </Typography>
              <ButtonComponent
                label="+ New Ticket"
                onClick={handleOpenNewTicketsModal}
                customBtn="new_teaminbox_button"
              />
            </Box>

            {/* Main Content Area - Full width */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                gap: 2,
                padding: "0 24px 24px",
                height: "calc(100vh - 140px)",
                overflow: "hidden",
              }}
            >
              {/* Left Panel - Tickets List */}
              <Box
                sx={{
                  width: state.openChat
                    ? state.openSidePanel
                      ? "310px"
                      : "350px"
                    : "100%",
                  flexShrink: 0,
                  height: "calc(100vh - 100px)",
                  transition: "width 0.4s ease-in-out",
                  display: {
                    xs:
                      state.openChat && state.openSidePanel ? "none" : "block",
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
                        flexDirection: state.openChat ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "left",
                      }}
                    >
                      <Typography
                        sx={{ textAlign: "left", marginBottom: "10px" }}
                        variant="h6"
                        fontWeight="bold"
                      >
                        Tickets
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <SearchboxComponent
                          placeholder="search tickets"
                          customSearch="new_teaminbox_search"
                        />
                        <IconButton sx={style.new_teaminbox_filter}>
                          <FilterAltIcon />
                        </IconButton>
                      </Box>
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
                        {...data}
                        handleOpenChat={handleOpenChat}
                      />
                    ))}
                  </Box>
                </Paper>
              </Box>

              {/* Middle Panel - Chat */}
              {state.openChat && (
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
            {state.openChat && (
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
      )}
    </>
  );
};

export default TeamInbox;
