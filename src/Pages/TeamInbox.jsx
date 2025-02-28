import React, { useRef, useEffect, useState } from 'react'
import { Grid, Tabs, Tab } from '@mui/material';
// import TuneIcon from '@mui/icons-material/Tune';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
// import MuiAccordion from '@mui/material/Accordion';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
// import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
// import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
// import BurgerSidebar from '../Component/humburgerdiv';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import TeamBurgerLeftNav from '../Component/teamburgerMenu';
//import PriorityDropDown from '../Component/assigneddrop';
//import AssigneeDropDown from '../Component/AssigneeDrop';
//import TicketType from '../Component/TicketType';
import ReporterType from '../Component/Reporter';
// import TeaamInboxAccordion from '../Component/TeamInboxAccordin';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import MailOutlineSharpIcon from '@mui/icons-material/MailOutlineSharp';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicOutlinedIcon from '@mui/icons-material/FormatItalicOutlined';
import FormatUnderlinedOutlinedIcon from '@mui/icons-material/FormatUnderlinedOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import CodeOffOutlinedIcon from '@mui/icons-material/CodeOffOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import TagIcon from '@mui/icons-material/Tag';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Accordion from 'react-bootstrap/Accordion';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Chip } from '@mui/material';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

// import { Navbar } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import AutocompleteComponent from '../Component/AutocompleteComponent';
// import { Position } from 'react-flow-renderer';
// import zIndex from '@mui/material/styles/zIndex';
import ButtonComponent from '../Component/ButtonComponent';
import TextfieldComponent from '../Component/TextfieldComponent';
import CustomAccordion from '../Component/TeamInbox/CustomAccordion';

const styles = {
    accordion: {
        marginBottom: '0px',
    },
    // accordionSummary: {
    //     fontSize: '12px',
    //     fontWeight: 700,
    //     color: 'black',
    // },
    autocompleteStyle: {
        margin: '7px 0px 5px',
        paddingLeft: '67px',
    },
    ticketsStatusAutocomplete: {
        minWidth: '100px',
        height: '32px',
    },
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },

    },

    moreicon: {
        marginRight: '5px',
    },
    chipStyles: {
        background: '#ffe9bc',
        color: '#755b00',
        borderRadius: '3px',
        padding: '0px 6px',
        fontSize: '14px',
        ml: '9px',
    }

}
const ticketData = [
    {
        title: 'soluta quam velit',
        date: 'Jun 2',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<AccessTimeOutlinedIcon />, <ErrorOutlineOutlinedIcon sx={{ color: 'red' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
        ticketCount: 2,
    },
    {
        title: 'Laudantium neque veritatis',
        date: 'Jun 2',
        subtitle: 'OPS-102',
        status: 'To Do',
        icons: [<ExpandLessOutlinedIcon className="expandlessicon" />, <ErrorOutlineOutlinedIcon sx={{ color: 'red' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
        ticketCount: 2,
    },
    {
        title: 'Moiestiae saape illum',
        date: 'Jun 1',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Dignissimos maiores porro',
        date: 'May 31',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Nihil porro repudiandae',
        date: 'May 31',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Aspernatur cumque ipsum',
        date: 'May 30',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Culpa quos aliquam',
        date: 'May 30',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Atque incidunt autem',
        date: 'May 30',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
    {
        title: 'Atque incidunt autem',
        date: 'May 30',
        subtitle: 'APPS-216',
        status: 'To Do',
        icons: [<ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />],
        avatar: 'assets/teaminbox/images/resource/friend-avatar.jpg',
    },
];
const filterData = [
    {
        icon: <AccountCircleOutlinedIcon />,
        name: 'Agent',
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 16h6M4 8h2m-2 4h2m-2 4h2m5-6a2 2 0 1 0 4 0 2 2 0 0 0-4 0m9-4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"></path></svg>,
        name: 'Assignment',
    },
    {
        icon: <AttachFileOutlinedIcon />,
        name: 'Attachment',
    },
    {
        icon: <TodayOutlinedIcon />,
        name: 'Creation Date',
    },
    {
        icon: <PeopleAltOutlinedIcon />,
        name: 'Followers',
    },
    {
        icon: <TranslateSharpIcon />,
        name: 'Language',
    },
    {
        icon: <TodayOutlinedIcon />,
        name: 'Last activity',
    },
    {
        icon: <MailOutlineSharpIcon />,
        name: 'Last Message',
    },
    {
        icon: <ArrowUpwardSharpIcon />,
        name: 'Priority',
    },
    {
        icon: <ThumbUpAltOutlinedIcon />,
        name: 'Rating',
    },
    {
        icon: <FolderOutlinedIcon />,
        name: 'Source',
    },
    {
        icon: <CheckCircleOutlineOutlinedIcon />,
        name: 'Status',
    },
    {
        icon: <SellOutlinedIcon />,
        name: 'Tags',
    },
    {
        icon: <WorkspacesOutlinedIcon />,
        name: 'Teams',
    },

]
//dropdown options
const channelOptions = ['Email', 'Push', 'Platform', 'SMS', 'WhatsApp']//channel
const priorityOptions = ['High', 'Medium', 'Low']; //priority
const assignedOptions = ['Allie Harmon', 'Thameem', 'Vinu']; //assigned to 
const projectOptions = ['Administrative', 'Project1', 'Project2']; // project
const ticketTypeOptions = ['Task1', 'Task2', 'Task3']; //ticket type
const reporterOptions = ['Allie Harmon', 'Reporter1', 'Reporter2']; //reporter
const ticketStatusOptions = ['Open', 'Pending', 'On hold', 'Solved', 'Closed']; // ticket status 
const teamOptions = ['Team1', 'Team2', 'Team3'];//team 
const agentOptions = ['Assigned', 'Unassigned'];//agent
const ticketsPriorityOptions = ['Low', 'Medium', 'High', 'Urgent']; //ticket priority
const newticketsStatusOptions = ['Open', 'Pending', 'On hold', 'Solved', 'Closed']; //new ticket status
const tagOptions = ['complaint', 'feedback', 'request', 'sales', 'support'];//tag

// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <div>{children}</div>}
//         </div>
//     );
// }


const TeamInbox = () => {
    // const [isFullWidth, setIsFullWidth] = useState(true);

    // useEffect(() => {
    //     const outerContainer = document.getElementById('outer-container');

    //     const checkStyle = () => {
    //         if (outerContainer.style.width === '100%' && outerContainer.style.overflow === 'hidden') {
    //             setIsFullWidth(false);
    //         } else {
    //             setIsFullWidth(true);
    //         }
    //     };

    //     checkStyle();

    //     // Observe changes to the outerContainer style
    //     const observer = new MutationObserver(checkStyle);
    //     observer.observe(outerContainer, { attributes: true, attributeFilter: ['style'] });

    //     return () => observer.disconnect();
    // }, []);
    // const [ticketView, setTicketView] = useState(true)
    // const [isClose, setIsClose] = useState(false)
    // function ticketOpen() {
    //     setTicketView(false);
    //     setIsClose((prev) => !prev)
    //     let bm_menu_wrap = document.querySelector(".bm-menu-wrap")
    //     bm_menu_wrap.style.left = 0
    //     document.querySelector('#react-burger-cross-btn').click()
    // }

    // const filterProjectOptions = ['All', 'One', 'Two', 'Three'];
    // const filterTypeOptions = ['All', 'One', 'Two', 'Three'];
    // const filterStatusOptions = ['All', 'One', 'Two', 'Three'];
    // const filterAssigneeOptions = ['All', 'One', 'Two', 'Three'];


    const [isLeftContainerVisible, setIsLeftContainerVisible] = useState(true); 
    const [isMyticketsVisible, setIsMyticketsVisible] = useState(true);
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [openNewTicketsModal, setOpenNewTicketsModal] = useState(false);
    const [priorityContent, setPriorityContent] = useState('Medium');
    const [assignedContent, setAssignedContent] = useState('Allie Harmon');
    const [projectContent, setProjectContent] = useState('Administrative');
    const [ticketTypeContent, setTicketTypeContent] = useState('Task1');
    const [reporterContent, setReporterContent] = useState('Allie Harmon');
    // const [filterProjectContent, setFilterProjectContent] = useState('All');
    // const [filterTypeContent, setFilterTypeContent] = useState('All');
    // const [filterStatusContent, setFilterStatusContent] = useState('All');
    // const [filterAssigneeContent, setFilterAssigneeContent] = useState('All');
    const [ticketStatusContent, setTicketStatusContent] = useState('Closed');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [addFilterPopup, setAddFilterPopup] = useState(false);
    const [isActive, setIsActive] = useState(false); //toggle
    const [addpeoppleContent, setAddpeopleContent] = useState(false);
    const [addtagContent, setAddtagContent] = useState(false);
    const [teamContent, setTeamContent] = useState('Team1');
    const [agentContent, setAgentContent] = useState('Unassigned');
    const [ticketsPriorityContent, setTicketsPriorityContent] = useState('Medium');
    const [newTicketsStatusContent, setNewTicketsStatusContent] = useState('Pending');
    const [tagContent, setTagContent] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]); // Array to hold selected tags
    const [channelContent, setChannelContent] = useState('Email');
    const popupRef = useRef(null);


    //new tickets add tags
    const handleTagChange = (event, newValue) => {

        if (newValue && !selectedTags.includes(newValue)) {
            setSelectedTags([...selectedTags, newValue]);
        }
        setTagContent(null);
    };
    const handleDeleteTag = (tagToDelete) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToDelete));
    };

    //add people
    const handleClickAddpeople = () => {
        setAddpeopleContent(true);
    }
    const handleCloseAddpeople = () => {
        setAddpeopleContent(false);
    }

    //tag
    const handleClickAddtag = () => {
        setAddtagContent(true);
    }
    const handleCloseAddtag = () => {
        setAddtagContent(false);
    }
  
    const handleTogglePrivate = () => {
        setIsActive(!isActive)
    }
      // Add filter popup 
    const handleAddFilterOpen = () => {
        setAddFilterPopup(true);
    };

    const handleTicketClick = (index) => {
        setSelectedTicket(index);
    };
    const handleToggle = () => {
        setOpen(!open);
    }
    const handleNewTicketToggle = () => {
        setOpenNewTicketsModal(true);
    }
    const handleCloseNewTicketsModal = () => {
        setOpenNewTicketsModal(false);
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const toggleLeftContainer = () => {
        console.log('Button')
        setIsLeftContainerVisible((prevState) => !prevState);
    };
    const toggleMyticketsContainer = () => {
        console.log('My tickets');
        setIsMyticketsVisible((prevState) => !prevState);
        setIsLeftContainerVisible(false);
    }
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setAddFilterPopup(false);
        }
    };

    useEffect(() => {
        if (addFilterPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [addFilterPopup]);
    return (
        <>


            <div id="outer-container" className='team_inbox_main-wrapper'>
                {
                    openNewTicketsModal ? (
                        <div className='new_tickets_container'>
                            <div className='new_tickets_header'>
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={handleCloseNewTicketsModal} fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4 4m-4-4 4-4"></path></svg>
                                <span className='new_tickets_title'>New ticket</span>
                            </div>
                            <div className='new_tickets_main'>
                                <div className='textbox_container'>
                                    <label>Subject</label>
                                    <TextfieldComponent placeholder='Enter subject' customStyle='new_tickets_textbox' />
                                </div>
                                <div className='requester_name_email'>
                                    <div className='textbox_container' style={{ width: '50%' }}>
                                        <label>Requester name</label>
                                        <TextfieldComponent placeholder='Enter requester name' customStyle='new_tickets_textbox' />
                                    </div>
                                    <div className='textbox_container' style={{ width: '50%' }}>
                                        <label>Requester email</label>
                                        <TextfieldComponent placeholder='Enter requester email' customStyle='new_tickets_textbox' />
                                    </div>
                                </div>
                                <div className='textbox_container'>
                                    <label>User SID</label>
                                    <TextfieldComponent placeholder='Enter SID' customStyle='new_tickets_textbox' />
                                </div>

                                {
                                    addpeoppleContent ? (
                                        <div className='textbox_container'>
                                            <label>People in the loop<span className='close_btn'><CloseOutlinedIcon onClick={handleCloseAddpeople} /></span></label>
                                            <TextfieldComponent placeholder='Enter email address and confrim with enter' customStyle='new_tickets_textbox' />
                                        </div>
                                    ) : (
                                        <div className='add_peeple_container' onClick={handleClickAddpeople}>
                                            <AddOutlinedIcon />Add People to the loop
                                        </div>
                                    )
                                }
                                <div className='textbox_container'>
                                    <label>Team</label>
                                    <AutocompleteComponent
                                        options={teamOptions}
                                        value={teamContent}
                                        onChange={(event, newValue) => setTeamContent(newValue)}
                                        customStyles={styles.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Agent<span className='assgined_text'>Assign me</span></label>
                                    <AutocompleteComponent
                                        options={agentOptions}
                                        value={agentContent}
                                        onChange={(event, newValue) => setAgentContent(newValue)}
                                        customStyles={styles.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Priority</label>
                                    <AutocompleteComponent
                                        options={ticketsPriorityOptions}
                                        value={ticketsPriorityContent}
                                        onChange={(event, newValue) => setTicketsPriorityContent(newValue)}
                                        customStyles={styles.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Status</label>
                                    <AutocompleteComponent
                                        options={newticketsStatusOptions}
                                        value={newTicketsStatusContent}
                                        onChange={(event, newValue) => setNewTicketsStatusContent(newValue)}
                                        customStyles={styles.newticketsAutocomplete}
                                    />
                                </div>
                                <div className="tag_container">
                                    {
                                        addtagContent ? (
                                            <>
                                                <div className='tag_dropdown_container'>
                                                    <AutocompleteComponent
                                                        placeholder='Search tag...'
                                                        options={tagOptions}
                                                        value={tagContent}
                                                        onChange={handleTagChange}
                                                        customStyles={styles.newticketsAutocomplete}
                                                    />

                                                </div>
                                                <span className='add_tag_dropdown_close'><CloseOutlinedIcon onClick={handleCloseAddtag} /></span>
                                            </>
                                        ) : (
                                            <div className='add_peeple_container' onClick={handleClickAddtag} >
                                                <AddOutlinedIcon />Add tag
                                            </div>
                                        )

                                    }
                                    <div className='chip_container'>
                                        {selectedTags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => handleDeleteTag(tag)}
                                                sx={styles.chipStyles}
                                            />
                                        ))}
                                    </div>

                                </div>

                                <div className='support_tickets'>

                                    <textarea placeholder={isActive ? 'Enter private note visible only to agents' : 'Enter Message'} className='tab_reply_content'></textarea>
                                    <div className='reply_text_container'>
                                        <div className='reply_text_style'>

                                            <FormatBoldOutlinedIcon className='reply_text_container_icons' />
                                            <FormatItalicOutlinedIcon className='reply_text_container_icons' />
                                            <FormatUnderlinedOutlinedIcon className='reply_text_container_icons' />
                                            <StrikethroughSOutlinedIcon className='reply_text_container_icons' />
                                            <CodeOffOutlinedIcon className='reply_text_container_icons' />
                                            <FormatListNumberedOutlinedIcon className='reply_text_container_icons' />
                                            <FormatListBulletedOutlinedIcon className='reply_text_container_icons' />
                                            <InsertLinkOutlinedIcon className='reply_text_container_icons' />
                                            <PhotoSizeSelectActualIcon className='reply_text_container_icons' />
                                        </div>

                                    </div>
                                    <div className='reply_text_second_container'>
                                        <div className='reply_text_style'>
                                            <div className='holidaytoggle'>

                                                <button
                                                    type="button"
                                                    className={`toggle__control ${isActive ? 'active' : ''}`}
                                                    onClick={handleTogglePrivate}
                                                    aria-label="Toggle"

                                                >
                                                    <div className='toggle-indicator'></div>
                                                </button>
                                                <label className="toggle-label">Private</label>
                                            </div>
                                            <TagIcon className='reply_text_container_icons' />
                                            <AttachFileIcon className='reply_text_container_icons' />
                                            <RadioButtonCheckedIcon className='reply_text_container_icons' />
                                            <FormatColorTextIcon className='reply_text_container_icons' />
                                            <AutoFixHighIcon className='reply_text_container_icons' />
                                            <div className='reply_text_container_icons'>@</div>
                                        </div>
                                        <div className='mail_send_btn'>
                                            <ButtonComponent label='submit' customBtn='submit_btn' />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='teaminbox_container'>
                            <div
                                className="teaminbox_left_container"
                                style={{
                                    marginLeft: isLeftContainerVisible ? '0' : '-225px',
                                    opacity: isLeftContainerVisible ? 1 : 0,
                                    visibility: isLeftContainerVisible ? 'visible' : 'hidden',
                                    transition: 'margin-left 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
                                }}
                            >
                                <div className='ticket-view-accordin'>
                                    <Accordion defaultActiveKey="0" >
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>
                                                Ticket Views
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <ul className='ticket-view-dropdown'>
                                                    <li>My Tickets <span>9</span></li>
                                                    <li>Past Due <span>4</span></li>
                                                    <li>High Priority<span>90</span></li>
                                                    <li>Unassigned<span>512</span></li>
                                                    <li>All Tickets<span>2,451</span></li>
                                                </ul>
                                            </Accordion.Body>
                                            <ul>
                                                <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-headphones" aria-hidden="true"></i> Live Chat</span></li>                                     <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-th-large" aria-hidden="true"></i> Boards</span></li>
                                            </ul>
                                        </Accordion.Item>

                                    </Accordion>
                                </div>
                            </div>
                            {!isMyticketsVisible && (
                                <div >
                                    <KeyboardDoubleArrowRightRoundedIcon className='toggle_btn' onClick={toggleMyticketsContainer} />
                                    <div className='toggle_mytickets_content'>
                                    </div>
                                </div>
                            )}
                            <div className="first_container"
                                style={{
                                    marginLeft: isMyticketsVisible ? '0' : '-230px',
                                    opacity: isMyticketsVisible ? 1 : 0,
                                    visibility: isMyticketsVisible ? 'visible' : 'hidden',
                                    transition: 'margin-left 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
                                    width: selectedTicket !== null ? '260px' : '100%',
                                }}
                            >
                                <div className="vertical-line" onClick={toggleMyticketsContainer}></div>

                                <div className="mytickets_header" >
                                    <span className='ticketview-open' onClick={toggleLeftContainer} ><i className="fa fa-bars" aria-hidden="true"></i></span>
                                    <span className='mytickets_title'>My Tickets</span>
                                    <div className="ticket-filter-btn ticket-popupbtn">
                                        {/* <TuneIcon onClick={handleFilterToggle} /> */}
                                        <ButtonComponent label='+ New Ticket' customBtn='new_ticket_button' onClick={handleNewTicketToggle} />
                                    </div>
                                    {/* {
                                openFilterModal && (
                                    <>
                                        <div className='filter_modal'>
                                            <div className='filter_header'><FilterListSharpIcon color='blue' />Ticket Filters
                                                <span className='tickets_reset_btn'><RefreshRoundedIcon />Reset</span>
                                            </div>
                                            <div className='fitler_tickets_main'>
                                                <div className='filter_tickets_dropdown_container'>
                                                    <label className='filter_tickets_dropdown_label'>Project: </label>
                                                    <AutocompleteComponent
                                                        options={filterProjectOptions}
                                                        value={filterProjectContent}
                                                        onChange={(event, newValue) => setFilterProjectContent(newValue)}
                                                        customStyles={styles.autocompleteStyle}
                                                    />
                                                </div>
                                                <div className='filter_tickets_dropdown_container'>
                                                    <label className='filter_tickets_dropdown_label'>Type: </label>
                                                    <AutocompleteComponent
                                                        options={filterTypeOptions}
                                                        value={filterTypeContent}
                                                        onChange={(event, newValue) => setFilterTypeContent(newValue)}
                                                        customStyles={styles.autocompleteStyle} />
                                                </div>
                                                <div className='filter_tickets_dropdown_container'>
                                                    <label className='filter_tickets_dropdown_label'>Status: </label>
                                                    <AutocompleteComponent
                                                        options={filterStatusOptions}
                                                        value={filterStatusContent}
                                                        onChange={(event, newValue) => setFilterStatusContent(newValue)}
                                                        customStyles={styles.autocompleteStyle} />
                                                </div>
                                                <div className='filter_tickets_dropdown_container'>
                                                    <label className='filter_tickets_dropdown_label'>Assignee: </label>
                                                    <AutocompleteComponent
                                                        options={filterAssigneeOptions}
                                                        value={filterAssigneeContent}
                                                        onChange={(event, newValue) => setFilterAssigneeContent(newValue)}
                                                        customStyles={styles.autocompleteStyle} />
                                                </div>
                                                <div className='filter_tickets_moreicon'><AddCircleOutlineRoundedIcon sx={styles.moreicon} />More</div>
                                            </div>
                                            <div className='filter_tickets_footer'>
                                                <input type='text' placeholder='Name this View...' className='filter_tickets_footer_input' />
                                                <button className='filter_tickets_footer_button'>Save new view</button>
                                            </div>

                                        </div>
                                    </>
                                )
                            } */}


                                </div>
                                <div className='mytickets_filter_search_container'>
                                    <ButtonComponent label='+ Add Filter' customBtn='teaminbox_add_filter' onClick={handleAddFilterOpen} />
                                    {
                                        addFilterPopup && (
                                            <div className='AddFilter_container' ref={popupRef}>
                                                <ul className='ul_filter'>
                                                    {
                                                        filterData.map((data, index) => (
                                                            <>
                                                                <li key={index} className='li_filter'>{data.icon}<span className='filter_item_text'>{data.name}</span></li>
                                                            </>
                                                        ))
                                                    }

                                                </ul>
                                            </div>
                                        )
                                    }

                                    <div class="search-container">
                                        <i class="fa fa-search"></i>
                                        <input type="text" placeholder="Search Tickets" />
                                    </div>
                                </div>
                                <div className='mytickets_content'>
                                    <ul>
                                        {/* <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>soluta quam velit</div>
                                        <div className='listdate'>Jun 2</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <AccessTimeOutlinedIcon />
                                            <ErrorOutlineOutlinedIcon sx={{ color: 'red' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>
                                            <span className='tickets_count'>2</span>
                                        </div>
                                    </div>

                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Laudantium neque veritatis </div>
                                        <div className='listdate'>Jun 2</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>OPS-102</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <ExpandLessOutlinedIcon className='expandlessicon' />
                                            <ErrorOutlineOutlinedIcon sx={{ color: 'red' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>
                                            <span className='tickets_count'>2</span>
                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Moiestiae saape illum</div>
                                        <div className='listdate'>Jun 1</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Dignissimos maiores porro</div>
                                        <div className='listdate'>May 31</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Nihil porro repudiandae</div>
                                        <div className='listdate'>May 31</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Aspernatur cumque ipsum</div>
                                        <div className='listdate'>May 30</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <DoNotDisturbOnOutlinedIcon style={{ color: 'green' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>

                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Culpa quos aliquam</div>
                                        <div className='listdate'>May 30</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Atque incidunt autem</div>
                                        <div className='listdate'>May 30</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li>
                                <li className='list_container'>
                                    <div className='mytickets_listheader'>
                                        <div className='listtitle'>Atque incidunt autem</div>
                                        <div className='listdate'>May 30</div>
                                    </div>
                                    <div className='mytickets_list_content'>
                                        <div className='list_left_content'>
                                            <input type="checkbox" className="checkall" />
                                            <div className='mytickets_list_subtitle'>APPS-216</div>
                                        </div>
                                        <div className='list_right_content'>
                                            <a title="" className="inbox-msg">
                                                <span className="blue-bg">To Do</span>
                                            </a>
                                            <ExpandCircleDownOutlinedIcon sx={{ color: '#0069d9' }} />
                                            <span className='hum-avator'>
                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                            </span>

                                        </div>
                                    </div>


                                </li> */}
                                        {ticketData.map((ticket, index) => (
                                            <li key={index} className="list_container" onClick={() => handleTicketClick(index)}>
                                                <div className="mytickets_listheader">
                                                    <div className="listtitle">{ticket.title}</div>
                                                    <div className="listdate">{ticket.date}</div>
                                                </div>
                                                <div className="mytickets_list_content">
                                                    <div className="list_left_content">
                                                        <input type="checkbox" className="checkall" />
                                                        <div className="mytickets_list_subtitle">{ticket.subtitle}</div>
                                                    </div>
                                                    <div className="list_right_content">
                                                        <a title="" className="inbox-msg">
                                                            <span className="blue-bg">{ticket.status}</span>
                                                        </a>
                                                        {ticket.icons.map((icon, i) => (
                                                            <React.Fragment key={i}>{icon}</React.Fragment>
                                                        ))}
                                                        <span className="hum-avator">
                                                            <img src={ticket.avatar} alt="" />
                                                        </span>
                                                        {ticket.ticketCount && <span className="tickets_count">{ticket.ticketCount}</span>}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                </div>

                            </div>
                            {selectedTicket !== null && (
                                <div className='teaminbox_right_container'>

                                    <div className='teaminboxmain_content'>
                                        <Grid container spacing={2}>

                                            <Grid item xs={9}>
                                                <div className="ticketsgridbox">
                                                    <div className='ticketsgrid_header'>
                                                        <div className='ticketsgrid_title'>{ticketData[selectedTicket]?.title}</div>

                                                        <div className='ticketsgrid_subheader'>
                                                            <div className='ticketsgrid_left_side'><PestControlOutlinedIcon sx={{ color: '#0069d9' }} />
                                                                <span className='ticketsgrid_subtitle'>OPS-102(100669518)| created 11/14/22 12:32 PST</span></div>
                                                            <div className='ticketsgrid_right_side'>
                                                                <span className='ticketsgrid_span'><EmailOutlinedIcon /></span>
                                                                <span className='ticketsgrid_span'><RemoveRedEyeOutlinedIcon sx={{ marginRight: '3px' }} /><span >2</span></span>
                                                                <span className='ticketsgrid_span'><MoreHorizOutlinedIcon /></span>
                                                                <span className='hum-avator'>
                                                                    <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                                                </span>
                                                                <span className='hum-avator'>
                                                                    <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                                                </span>
                                                                <span className='oktext'>ok</span></div>
                                                        </div>
                                                    </div>


                                                    <div className='tickets_timeline'>
                                                        <div className='user_tickets_timeline'>
                                                            <img src="assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' />
                                                            <div className="userline">
                                                                <div className="userline_left">
                                                                    <div>Allie Harmon</div>
                                                                    <div className='tickets_usersubname'>To Name Name@gmail.com</div>
                                                                </div>
                                                                <div className="userline_right">
                                                                    <div className='tickets_userdate'>Feb 9, 2022 10:31 AM</div>
                                                                    <KeyboardArrowDownIcon className='tickets_arrowbtn' />
                                                                </div>
                                                            </div>
                                                            <div className='timeline_content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </div>
                                                            <button className='imagebtn'>Screen_shot.png <div className='imagedate'>16 jun 2022,1:30 PM</div></button>
                                                            <button className='imagebtn'>Screen_shot.png<div className='imagedate'>16 jun 2022,1:30 PM</div></button>

                                                        </div>
                                                    </div>
                                                    <div className='tickets_timeline'>
                                                        <div className='user_tickets_timeline'>
                                                            <img src="assets/teaminbox/images/resource/user1.jpg" alt="" className='tickets_timeline_user_image' />
                                                            <div className="userline">
                                                                <div className="userline_left">
                                                                    <div>Allie Harmon</div>
                                                                    <div className='tickets_usersubname'>To Name Name@gmail.com</div>
                                                                </div>
                                                                <div className="userline_right">
                                                                    <div className='tickets_userdate'>Feb 9, 2022 10:31 AM</div>
                                                                    <KeyboardArrowDownIcon className='tickets_arrowbtn' />
                                                                </div>
                                                            </div>
                                                            <div className='timeline_content'>Dolorem similique et aliquid illum dolor.vel quo magnam. </div>
                                                        </div>
                                                    </div>
                                                    <div className='support_tickets'>
                                                        {/* <Tabs value={value} onChange={handleChange} className="tabs_container" >
                                                    <Tab label="Public Reply" />
                                                    <Tab label="Private Comment" />

                                                </Tabs> */}
                                                        {/* <CustomTabPanel value={value} index={0}> */}

                                                        {/* <div className="tab_input_container">
                                                        <span className="tab_to_text">To:</span>
                                                        <input type="text" className="tab_input_field" />
                                                        <span className="cc_text">Cc</span>
                                                    </div> */}
                                                        <textarea placeholder={isActive ? 'Enter private note visible only to agents' : 'Enter Message'} className='tab_reply_content'></textarea>
                                                        <div className='reply_text_container'>
                                                            <div className='reply_text_style'>
                                                                {/* <i className="fa fa-bold reply_text_design"></i>
                                                            <i className="fa fa-italic reply_text_design"></i>
                                                            <i className="fa fa-underline reply_text_design"></i>
                                                            <img src="assets/teaminbox/images/resource/img-attach.png" alt="" className='reply_text_image_design' />
                                                            <img src="assets/teaminbox/images/resource/img-attach01.png" alt="" className='reply_text_image_design' />
                                                            <img src="assets/teaminbox/images/resource/img-file-attach.png" alt="" className='reply_text_image_design' />
                                                            <img src="assets/teaminbox/images/resource/img-add-comment.png" alt="" className='reply_text_image_design' />
                                                            <img src="assets/teaminbox/images/resource/img-exit-folder.png" alt="" className='reply_text_image_design' /> */}
                                                                <FormatBoldOutlinedIcon className='reply_text_container_icons' />
                                                                <FormatItalicOutlinedIcon className='reply_text_container_icons' />
                                                                <FormatUnderlinedOutlinedIcon className='reply_text_container_icons' />
                                                                <StrikethroughSOutlinedIcon className='reply_text_container_icons' />
                                                                <CodeOffOutlinedIcon className='reply_text_container_icons' />
                                                                <FormatListNumberedOutlinedIcon className='reply_text_container_icons' />
                                                                <FormatListBulletedOutlinedIcon className='reply_text_container_icons' />
                                                                <InsertLinkOutlinedIcon className='reply_text_container_icons' />
                                                                <PhotoSizeSelectActualIcon className='reply_text_container_icons' />
                                                            </div>
                                                            {/* <div className='mail_send_btn'>
                                                            <label>Ask to KB <input type='checkbox' /></label>
                                                            <button className='send_button'><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                                        </div> */}
                                                        </div>
                                                        <div className='reply_text_second_container'>
                                                            <div className='reply_text_style'>
                                                                <div className='holidaytoggle'>

                                                                    <button
                                                                        type="button"
                                                                        className={`toggle__control ${isActive ? 'active' : ''}`}
                                                                        onClick={handleTogglePrivate}
                                                                        aria-label="Toggle"

                                                                    >
                                                                        <div className='toggle-indicator'></div>
                                                                    </button>
                                                                    <label className="toggle-label">Private</label>
                                                                </div>
                                                                <TagIcon className='reply_text_container_icons' />
                                                                <AttachFileIcon className='reply_text_container_icons' />
                                                                <RadioButtonCheckedIcon className='reply_text_container_icons' />
                                                                <FormatColorTextIcon className='reply_text_container_icons' />
                                                                <AutoFixHighIcon className='reply_text_container_icons' />
                                                                <div className='reply_text_container_icons'>@</div>
                                                            </div>
                                                            <div className='mail_send_btn'>
                                                                {
                                                                    !isActive ? (
                                                                        <>
                                                                            <p className='ticket_status_text'>Ticket status</p>
                                                                            <AutocompleteComponent
                                                                                options={ticketStatusOptions}
                                                                                value={ticketStatusContent}
                                                                                onChange={(event, newValue) => setTicketStatusContent(newValue)}
                                                                                customStyles={styles.ticketsStatusAutocomplete} /></>
                                                                    ) :
                                                                        null
                                                                }

                                                                <ButtonComponent label='submit' customBtn='submit_btn' />
                                                            </div>
                                                        </div>
                                                        {/* </CustomTabPanel> */}
                                                        {/* <CustomTabPanel value={value} index={1}>
                                                    private comment content
                                                </CustomTabPanel> */}
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={3} className='todo_container'>
                                                <div className="todogridbox">
                                                    <div className='todo_header'>
                                                        <button className='todo_button' onClick={handleToggle}>To Do<span className='todobtn_arrow'><KeyboardArrowDownIcon /></span></button>
                                                        <CloseIcon className='todo_close_icon' />
                                                    </div>
                                                    {
                                                        open && (
                                                            <>
                                                                <div className='todo_modal_container'>
                                                                    <ul>
                                                                        <li>
                                                                            <div><ArrowForwardIcon /><span className='todo_status'>Work in Progress</span> </div>
                                                                            <div className='todo_status_detail'>In Progress</div>
                                                                        </li>
                                                                        <li>
                                                                            <div><ArrowForwardIcon /><span className='todo_status'>Needs Review</span></div>
                                                                            <div className='todo_status_detail'>In Progress</div>
                                                                        </li>
                                                                        <li>
                                                                            <div><ArrowForwardIcon /><span className='todo_status'>Completed</span></div>
                                                                            <div className='todo_status_detail'>Done</div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    <div className='todo_main_content'>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Channel</label>
                                                            <AutocompleteComponent
                                                                options={channelOptions}
                                                                value={channelContent}
                                                                onChange={(event, newValue) => setChannelContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Priority</label>
                                                            <AutocompleteComponent
                                                                options={priorityOptions}
                                                                value={priorityContent}
                                                                onChange={(event, newValue) => setPriorityContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Assigned To <span className='assignme_span'>Assign to me</span></label>
                                                            <AutocompleteComponent
                                                                options={assignedOptions}
                                                                value={assignedContent}
                                                                onChange={(event, newValue) => setAssignedContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Project</label>
                                                            <AutocompleteComponent
                                                                options={projectOptions}
                                                                value={projectContent}
                                                                onChange={(event, newValue) => setProjectContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Ticket Type</label>
                                                            <AutocompleteComponent
                                                                options={ticketTypeOptions}
                                                                value={ticketTypeContent}
                                                                onChange={(event, newValue) => setTicketTypeContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Due Date</label>
                                                            <input type="date" className='todo_due_date' />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Reporter</label>
                                                            <AutocompleteComponent
                                                                options={reporterOptions}
                                                                value={reporterContent}
                                                                onChange={(event, newValue) => setReporterContent(newValue)} />
                                                        </div>
                                                        <div className='todo_dropdown_container addtags_style'>
                                                            <label className='todo_dropdown_label'>Tags</label>
                                                            <button className='addtag_btn'>Agg Tag+</button>
                                                        </div>
                                                        <div className='todo_accordion_container'>
                                                            <CustomAccordion label='TASKS' />
                                                            <CustomAccordion label='COLLECTED FIELDS' />
                                                            <CustomAccordion label='LINKED TICKETS 2' />
                                                            <CustomAccordion label='HISTORY' />

                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }



                {/* 1st code */}
                {/* {ticketView &&
                    <div className='ticket-view-accordin'>
                        <Accordion defaultActiveKey="0" >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Ticket Views</Accordion.Header>
                                <Accordion.Body>
                                    <ul className='ticket-view-dropdown'>
                                        <li>My Tickets <span>9</span></li>
                                        <li>Past Due <span>4</span></li>
                                        <li>High Priority<span>90</span></li>
                                        <li>Unassigned<span>512</span></li>
                                        <li>All Tickets<span>2,451</span></li>
                                    </ul>
                                </Accordion.Body>
                                <ul>
                                    <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-headphones" aria-hidden="true"></i> Live Chat</span></li>
                                    <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-th-large" aria-hidden="true"></i> Boards</span></li>
                                </ul>
                            </Accordion.Item>

                        </Accordion>
                    </div>}
                <BurgerSidebar setTicketView={setTicketView} setIsClose={setIsClose} isClose={isClose} />
                <main id="page-wrap" className={`${isClose ? "allleftnavclose" : ""} main-content ${ticketView ? "ticketview" : ""}`}>
                    <div>
                        <div className="panel-content">
                            {isClose &&
                                <div className='all-close-arrow-btn' onClick={ticketOpen}><i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                </div>}
                            <div className="row m-0">
                                <div className="col-lg-9 col-md-9 col=sm-12 p-0">
                                    <div className="widget mt-0">
                                        <div className="widget-title white-bg float-none">
                                            <h3 className='w-100'>Tickets Title</h3>
                                            <div className='mail-create-date'><span><i className="fa fa-bug" aria-hidden="true"></i></span><span>TKT-02 NOFg000000000</span><span className='mail-time'>Created 31/08/24 10:57 PST</span></div>
                                            <div className="widget-controls inbox-control"> <span className="close-content mr-3"><i className="fa fa-envelope-o"></i></span> <span className="expand-content mr-3"><i className="fa fa-eye"></i> 5</span> <span className="refresh-content mr-3"><i className="fa fa-ellipsis-h"></i></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar2.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/ok.jpg" alt="" /></span></div>
                                        </div>


                                        <div className="support-ticket-sec">
                                            <Tabs
                                                defaultActiveKey="puplic"
                                                transition={false}
                                                id="tab-example"
                                                className="custom-nav-tab mb-0 pl-2 pb-0"
                                            >
                                                <Tab eventKey="puplic" title="Puplic Reply">
                                                    <div className="status-upload">
                                                        <form>
                                                            <div className="inline-form">
                                                                <label className="c-label">CC</label>
                                                                <input className="input-style" type="text" placeholder="To" />
                                                            </div>
                                                            <textarea className='teaminbox_textarea'
                                                             placeholder="What are you doing right now?"></textarea>
                                                            <ul>
                                                                <li><a title="Audio" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-bold"></i></a></li>
                                                                <li><a title="Video" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-italic"></i></a></li>
                                                                <li><a title="Sound Record" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-underline"></i></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-attach.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-attach01.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-file-attach.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-add-comment.png" alt="" /></a></li>
                                                                <li><a className='tooltip-attach' title="Picture" data-toggle="tooltip" data-placement="bottom"><img src="assets/teaminbox/images/resource/img-exit-folder.png" alt="" /></a></li>
                                                            </ul>
                                                            <div className='mail-send-btn'><span><label>Ask to KB <input className='ask-kb' type='checkbox' /></label></span>
                                                                <button type="submit" className="light-grey-bg"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </Tab>
                                                <Tab eventKey="private" title="Private Comment">
                                                    Tab content for Private Comments
                                                </Tab>
                                            </Tabs>


                                        </div>

                                    </div>
                                    <div className="widget no-padding blank">
                                        <div className="timeline-sec">
                                            <ul>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'><span>Jonathan Gardel<br /> <i className='small-txt'>To Name Name@gmail.com</i></span> <span className='txt-11'>Aug/31/24 14:30 PM</span></h3>
                                                                <div className="social-share p-0"> <a className='cmd-down-arrow' title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>
                                                            <div className='attach-img-btn'><button className='mr-2'>Snap-short.png<br /><span className='small-txt'>01 Sep 2024 4:30 PM</span></button><button>Snap-short.png<br /><span className='small-txt'>01 Sep 2024 4:30 PM</span></button></div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'><span>Jonathan Gardel<br /> <i className='small-txt'>To Name Name@gmail.com</i></span> <span className='txt-11'>Aug/31/24 14:30 PM</span></h3>
                                                                <div className="social-share p-0"> <a className='cmd-down-arrow' title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 pl-0 pr-0">
                                    <div className="widget mt-0 btrr-20 border-left white-bg">
                                        <div className="widget-title ptb20">
                                            <div className="btn-group border-radius-5">
                                                <Dropdown data-bs-theme="default" size='md'>
                                                    <Dropdown.Toggle>To Do <span className='todo-line'>|</span></Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Work In Progress</h4>
                                                                    <p>In Progress</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Needs review</h4>
                                                                    <p>In Progress</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#">
                                                            <div className='todoinprogress-contain'>
                                                                <div className='todoicons'><i className="fa fa-arrow-right todoarrow-right" aria-hidden="true"></i></div>
                                                                <div className='todo-text'>
                                                                    <h4>Completed</h4>
                                                                    <p>Done</p>
                                                                </div>
                                                            </div>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                            <div className="widget-controls"> <span className="close-content"><i className="fa fa-times"></i></span></div>
                                        </div>
                                        <div className="w-90">
                                            <div id="contact">
                                                <div className="contact-form">
                                                    <div className="row">
                                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                                            <div className='dropdownsection'>
                                                                <h6>Priority</h6>
                                                                <PriorityDropDown />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6><span>Assigned To</span> <span>Assign to me</span></h6>
                                                                <AssigneeDropDown />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Administarative</h6>
                                                                <Form.Select aria-label="Default select example">
                                                                    <option>Medium</option>
                                                                    <option value="1">High</option>
                                                                    <option value="2">Low</option>
                                                                </Form.Select>
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Ticket Type</h6>
                                                                <TicketType />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Due Date</h6>
                                                                <input className='form-control' type='date' />
                                                            </div>
                                                            <div className='dropdownsection'>
                                                                <h6>Reporter</h6>
                                                                <ReporterType />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='add-tags mb-3'>
                                            <div className="widget-title"><h6>Tags</h6></div>
                                            <div className='tag'><button className='btn btn-default'>Add Tag +</button></div>
                                        </div>
                                        <TeaamInboxAccordion />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main> */}
            </div>
        </>
    );
}
export default TeamInbox;

// const TeamInbox = () => {
//     const [isLeftContainerVisible, setIsLeftContainerVisible] = useState(true);

//     const toggleLeftContainer = () => {
//         console.log('Button')
//         setIsLeftContainerVisible((prevState) => !prevState);
//     };
//     return (
//         <>
//              <div id="outer-container" className='main-wrapper'>
//                 <div className='teaminbox_container'>
//                 <div
//                     className="teaminbox_left_container"
//                     style={{
//                         marginLeft: isLeftContainerVisible ? '0' : '-225px',
//                         transition: 'margin-left 0.3s ease',
//                     }}
//                 >
//                         <div className='ticket-view-accordin'>
//                             <Accordion defaultActiveKey="0" >
//                                 <Accordion.Item eventKey="0">
//                                     <Accordion.Header>
//                                         Ticket Views
//                                     </Accordion.Header>
//                                     <Accordion.Body>
//                                         <ul className='ticket-view-dropdown'>
//                                             <li>My Tickets <span>9</span></li>
//                                             <li>Past Due <span>4</span></li>
//                                             <li>High Priority<span>90</span></li>
//                                             <li>Unassigned<span>512</span></li>
//                                             <li>All Tickets<span>2,451</span></li>
//                                         </ul>
//                                     </Accordion.Body>
//                                     <ul>
//                                         <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-headphones" aria-hidden="true"></i> Live Chat</span></li>                                     <li className='tic-view-chat'><span className='acc-icon-text'><i className="fa fa-th-large" aria-hidden="true"></i> Boards</span></li>
//                                     </ul>
//                                 </Accordion.Item>

//                             </Accordion>
//                         </div>
//                     </div>
//                     <div className='teaminbox_right_container'>
//                         <div className="first_container">
//                             <div className="widget-title p-20">
//                                 <span className='ticketview-open'><i className="fa fa-bars" aria-hidden="true"></i></span>
//                                 <h3>My Tickets</h3>
//                                 <div className="ticket-filter-btn ticket-popupbtn">
//                                     <TuneIcon  onClick={toggleLeftContainer} />
//                                 </div>
//                             </div>
//                             <div class="search-container">
//                                 <i class="fa fa-search"></i>
//                                 <input type="text" placeholder="Search Tickets" />
//                             </div>

//                         </div>
//                         <div className='teaminboxmain_content'>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={9}>
//                                     <div className="ticketsgridbox">
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                     </div>
//                                 </Grid>
//                                 <Grid item xs={3}>
//                                     <div className="todogridbox">
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>
//                                         <h1>Team</h1>

//                                     </div>
//                                 </Grid>
//                             </Grid>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </>
//     )
// }
// export default TeamInbox;