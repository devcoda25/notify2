import React, { useEffect, useState } from 'react'
import { Grid, Tabs, Tab } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
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
import MuiAccordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterListSharpIcon from '@mui/icons-material/FilterListSharp';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import BurgerSidebar from '../Component/humburgerdiv';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import TeamBurgerLeftNav from '../Component/teamburgerMenu';
import PriorityDropDown from '../Component/assigneddrop';
import AssigneeDropDown from '../Component/AssigneeDrop';
import TicketType from '../Component/TicketType';
import ReporterType from '../Component/Reporter';
import TeaamInboxAccordion from '../Component/TeamInboxAccordin';
import Accordion from 'react-bootstrap/Accordion';
// import Tab from 'react-bootstrap/Tab';
// import Tabs from 'react-bootstrap/Tabs';

import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AutocompleteComponent from '../Component/AutocompleteComponent';
import { Position } from 'react-flow-renderer';
import zIndex from '@mui/material/styles/zIndex';


const styles = {
    accordion: {
        marginBottom: '0px',
    },
    accordionSummary: {
        fontSize: '12px',
        fontWeight: 700,
        color: 'black',
    },
    autocompleteStyle: {
        margin: '7px 0px 5px',
        paddingLeft: '67px',
    },
    moreicon: {
        marginRight: '5px',
    },

}
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children}</div>}
        </div>
    );
}
const CustomAccordion = ({ label }) => {
    return (
        <>
            <MuiAccordion>
                <AccordionSummary sx={{ ...styles.accordionSummary }}
                    expandIcon={<ArrowForwardIosIcon sx={{ fontSize: '13px' }} />}>
                    {label}
                </AccordionSummary>
                <AccordionDetails>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                </AccordionDetails>
            </MuiAccordion>
        </>
    )
}


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
    const priorityOptions = ['High', 'Medium', 'Low'];
    const assignedOptions = ['Allie Harmon', 'Thameem', 'Vinu'];
    const projectOptions = ['Administrative', 'Project1', 'Project2'];
    const ticketTypeOptions = ['Task1', 'Task2', 'Task3'];
    const reporterOptions = ['Allie Harmon', 'Reporter1', 'Reporter2'];
    const filterProjectOptions = ['All', 'One', 'Two', 'Three'];
    const filterTypeOptions = ['All', 'One', 'Two', 'Three'];
    const filterStatusOptions = ['All', 'One', 'Two', 'Three'];
    const filterAssigneeOptions = ['All', 'One', 'Two', 'Three'];
    const [isLeftContainerVisible, setIsLeftContainerVisible] = useState(true);
    const [isMyticketsVisible, setIsMyticketsVisible] = useState(true);
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [priorityContent, setPriorityContent] = useState('Medium');
    const [assignedContent, setAssignedContent] = useState('Allie Harmon');
    const [projectContent, setProjectContent] = useState('Administrative');
    const [ticketTypeContent, setTicketTypeContent] = useState('Task1');
    const [reporterContent, setReporterContent] = useState('Allie Harmon');
    const [filterProjectContent, setFilterProjectContent] = useState('All');
    const [filterTypeContent, setFilterTypeContent] = useState('All');
    const [filterStatusContent, setFilterStatusContent] = useState('All');
    const [filterAssigneeContent, setFilterAssigneeContent] = useState('All');
    const handleToggle = () => {
        setOpen(!open);
    }
    const handleFilterToggle = () => {
        setOpenFilterModal(!openFilterModal);
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


    return (
        <>

            <div id="outer-container" className='team_inbox_main-wrapper'>
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
                        }}
                    >
                        <div className="vertical-line" onClick={toggleMyticketsContainer}></div>

                        <div className="mytickets_header" >
                            <span className='ticketview-open' onClick={toggleLeftContainer} ><i className="fa fa-bars" aria-hidden="true"></i></span>
                            <span className='mytickets_title'>My Tickets</span>
                            <div className="ticket-filter-btn ticket-popupbtn">
                                <TuneIcon onClick={handleFilterToggle} />
                            </div>
                            {
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
                            }


                        </div>
                        <div class="search-container">
                            <i class="fa fa-search"></i>
                            <input type="text" placeholder="Search Tickets" />
                        </div>
                        <div className='mytickets_content'>
                            <ul>
                                <li className='list_container'>
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


                                </li>
                            </ul>
                        </div>

                    </div>
                    <div className='teaminbox_right_container'>

                        <div className='teaminboxmain_content'>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <div className="ticketsgridbox">
                                        <div className='ticketsgrid_header'>
                                            <div className='ticketsgrid_title'>Laudantium neque veritatis</div>

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
                                        <div className='support_tickets'>
                                            <Tabs value={value} onChange={handleChange} className="tabs_container" >
                                                <Tab label="Public Reply" />
                                                <Tab label="Private Comment" />

                                            </Tabs>
                                            <CustomTabPanel value={value} index={0}>

                                                <div className="tab_input_container">
                                                    <span className="tab_to_text">To:</span>
                                                    <input type="text" className="tab_input_field" />
                                                    <span className="cc_text">Cc</span>
                                                </div>
                                                <textarea placeholder='Add a reply...' className='tab_reply_content'></textarea>
                                                <div className='reply_text_container'>
                                                    <div className='reply_text_style'>
                                                        <i className="fa fa-bold reply_text_design"></i>
                                                        <i className="fa fa-italic reply_text_design"></i>
                                                        <i className="fa fa-underline reply_text_design"></i>
                                                        <img src="assets/teaminbox/images/resource/img-attach.png" alt="" className='reply_text_image_design' />
                                                        <img src="assets/teaminbox/images/resource/img-attach01.png" alt="" className='reply_text_image_design' />
                                                        <img src="assets/teaminbox/images/resource/img-file-attach.png" alt="" className='reply_text_image_design' />
                                                        <img src="assets/teaminbox/images/resource/img-add-comment.png" alt="" className='reply_text_image_design' />
                                                        <img src="assets/teaminbox/images/resource/img-exit-folder.png" alt="" className='reply_text_image_design' />
                                                    </div>
                                                    <div className='mail_send_btn'>
                                                        <label>Ask to KB <input type='checkbox' /></label>
                                                        <button className='send_button'><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                                    </div>
                                                </div>

                                            </CustomTabPanel>
                                            <CustomTabPanel value={value} index={1}>
                                                private comment content
                                            </CustomTabPanel>
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
                </div>


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