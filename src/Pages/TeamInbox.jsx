import React, { useRef, useEffect, useState } from 'react'
import { Grid, Chip } from '@mui/material';
import ButtonComponent from '../Component/ButtonComponent';
import TextfieldComponent from '../Component/TextfieldComponent';
import CustomAccordion from '../Component/TeamInbox/CustomAccordion';
import AutocompleteComponent from '../Component/AutocompleteComponent';
import Accordion from 'react-bootstrap/Accordion';
import style from '../Component/MuiStyles/muiStyle';
import ReporterType from '../Component/Reporter';
import Editorbox from '../Component/TeamInbox/Editorbox';
import SearchboxComponent from '../Component/SearchboxComponent';
import {
    AccessTimeOutlinedIcon, ErrorOutlineOutlinedIcon, ExpandLessOutlinedIcon, DoNotDisturbOnOutlinedIcon, ExpandCircleDownOutlinedIcon, PestControlOutlinedIcon,
    EmailOutlinedIcon, RemoveRedEyeOutlinedIcon, MoreHorizOutlinedIcon, KeyboardArrowDownIcon, ArrowForwardIcon, CloseIcon, KeyboardDoubleArrowRightRoundedIcon, TodayOutlinedIcon,
    AccountCircleOutlinedIcon, AttachFileOutlinedIcon, PeopleAltOutlinedIcon, TranslateSharpIcon, MailOutlineSharpIcon, ArrowUpwardSharpIcon, ThumbUpAltOutlinedIcon, FolderOutlinedIcon, CheckCircleOutlineOutlinedIcon, SellOutlinedIcon, WorkspacesOutlinedIcon,
AddOutlinedIcon, CloseOutlinedIcon
} from '../Component/Icon';


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


const TeamInbox = () => {

    const [state, setState] = useState({
        isLeftContainerVisible: true,
        isMyticketsVisible: true,
        value: 0,
        open: false,
        openNewTicketsModal: false,
        priorityContent: 'Medium',
        assignedContent: 'Allie Harmon',
        projectContent: 'Administrative',
        ticketTypeContent: 'Task1',
        reporterContent: 'Allie Harmon',
        ticketStatusContent: 'Closed',
        selectedTicket: null,
        addFilterPopup: false,
        isActive: false,
        addpeopleContent: false,
        addtagContent: false,
        teamContent: 'Team1',
        agentContent: 'Unassigned',
        ticketsPriorityContent: 'Medium',
        newTicketsStatusContent: 'Pending',
        tagContent: null,
        selectedTags: [],
        channelContent: 'Email',
    });

    const popupRef = useRef(null);

    const updateState = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    //new tickets add tags

    const handleTagChange = (event, newValue) => {
        if (newValue && !state.selectedTags.includes(newValue)) {
            updateState("selectedTags", [...state.selectedTags, newValue]);
        }
        updateState("tagContent", null);
    };

    const handleDeleteTag = (tagToDelete) => {
        updateState("selectedTags", state.selectedTags.filter(tag => tag !== tagToDelete));
    };

    //add people

    const handleClickAddpeople = () => updateState("addpeopleContent", true);
    const handleCloseAddpeople = () => updateState("addpeopleContent", false);

    //tag
    const handleClickAddtag = () => updateState("addtagContent", true);
    const handleCloseAddtag = () => updateState("addtagContent", false);

    const handleTogglePrivate = () => updateState("isActive", !state.isActive);

    // Add filter popup 
    const handleAddFilterOpen = () => updateState("addFilterPopup", true);

    const handleTicketClick = (index) => updateState("selectedTicket", index);
    const handleToggle = () => updateState("open", !state.open);

    const handleNewTicketToggle = () => updateState("openNewTicketsModal", true);
    const handleCloseNewTicketsModal = () => updateState("openNewTicketsModal", false);

    const handleChange = (event, newValue) => updateState("value", newValue);
    const toggleLeftContainer = () => updateState("isLeftContainerVisible", !state.isLeftContainerVisible);

    const toggleMyticketsContainer = () => {
        updateState("isMyticketsVisible", !state.isMyticketsVisible);
        updateState("isLeftContainerVisible", false);
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            updateState("addFilterPopup", false);
        }
    };
    useEffect(() => {
        if (state.addFilterPopup) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [state.addFilterPopup]);


    return (
        <>


            <div id="outer-container" className='team_inbox_main-wrapper'>
                {
                    state.openNewTicketsModal ? (
                        <div className='new_tickets_container'>
                            <div className='new_tickets_header'>
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={handleCloseNewTicketsModal} fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4 4m-4-4 4-4"></path></svg>
                                <span className='new_tickets_title'>New ticket</span>
                            </div>
                            <div className='new_tickets_main'>
                                <div className='textbox_container'>
                                    <label>Subject</label>
                                    <TextfieldComponent placeholder='Enter subject' customStyle='custom_textfield_box' />
                                </div>
                                <div className='requester_name_email'>
                                    <div className='textbox_container' style={{ width: '50%' }}>
                                        <label>Requester name</label>
                                        <TextfieldComponent placeholder='Enter requester name' customStyle='custom_textfield_box' />
                                    </div>
                                    <div className='textbox_container' style={{ width: '50%' }}>
                                        <label>Requester email</label>
                                        <TextfieldComponent placeholder='Enter requester email' customStyle='custom_textfield_box' />
                                    </div>
                                </div>
                                <div className='textbox_container'>
                                    <label>User SID</label>
                                    <TextfieldComponent placeholder='Enter SID' customStyle='custom_textfield_box' />
                                </div>

                                {
                                    state.addpeopleContent ? (
                                        <div className='textbox_container'>
                                            <label>People in the loop<span className='close_btn'><CloseOutlinedIcon onClick={handleCloseAddpeople} /></span></label>
                                            <TextfieldComponent placeholder='Enter email address and confrim with enter' customStyle='custom_textfield_box' />
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
                                        value={state.teamContent}
                                        onChange={(event, newValue) => updateState({ teamContent: newValue })}
                                        customStyles={style.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Agent<span className='assgined_text'>Assign me</span></label>
                                    <AutocompleteComponent
                                        options={agentOptions}
                                        value={state.agentContent}
                                        onChange={(event, newValue) => updateState({ agentContent: newValue })}
                                        customStyles={style.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Priority</label>
                                    <AutocompleteComponent
                                        options={ticketsPriorityOptions}
                                        value={state.ticketsPriorityContent}
                                        onChange={(event, newValue) => updateState({ ticketsPriorityContent: newValue })}
                                        customStyles={style.newticketsAutocomplete}
                                    />
                                </div>
                                <div className='textbox_container'>
                                    <label>Status</label>
                                    <AutocompleteComponent
                                        options={newticketsStatusOptions}
                                        value={state.newTicketsStatusContent}
                                        onChange={(event, newValue) => updateState({ newTicketsStatusContent: newValue })}
                                        customStyles={style.newticketsAutocomplete}
                                    />
                                </div>
                                <div className="tag_container">
                                    {
                                        state.addtagContent ? (
                                            <>
                                                <div className='tag_dropdown_container'>
                                                    <AutocompleteComponent
                                                        placeholder='Search tag...'
                                                        options={tagOptions}
                                                        value={state.tagContent}
                                                        onChange={handleTagChange}
                                                        customStyles={style.newticketsAutocomplete}
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
                                        {state.selectedTags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                onDelete={() => handleDeleteTag(tag)}
                                                sx={style.chipStyles}
                                            />
                                        ))}
                                    </div>

                                </div>
                                <Editorbox
                                    isActive={state.isActive}
                                    ticketStatusOptions={ticketStatusOptions}
                                    onTogglePrivate={handleTogglePrivate}
                                    ticketStatusContent={state.ticketStatusContent}
                                    onChange={(event, newValue) => updateState({ ticketStatusContent: newValue })}
                                    showTicketStatus={false}
                                />
                            
                            </div>
                        </div>
                    ) : (
                        <div className='teaminbox_container'>
                            <div
                                className="teaminbox_left_container"
                                style={{
                                    marginLeft: state.isLeftContainerVisible ? '0' : '-225px',
                                    opacity: state.isLeftContainerVisible ? 1 : 0,
                                    visibility: state.isLeftContainerVisible ? 'visible' : 'hidden',
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
                            {!state.isMyticketsVisible && (
                                <div >
                                    <KeyboardDoubleArrowRightRoundedIcon className='toggle_btn' onClick={toggleMyticketsContainer} />
                                    <div className='toggle_mytickets_content'>
                                    </div>
                                </div>
                            )}
                            <div className="first_container"
                                style={{
                                    marginLeft: state.isMyticketsVisible ? '0' : '-230px',
                                    opacity: state.isMyticketsVisible ? 1 : 0,
                                    visibility: state.isMyticketsVisible ? 'visible' : 'hidden',
                                    transition: 'margin-left 0.3s ease, opacity 0.3s ease, visibility 0.3s ease',
                                    width: state.selectedTicket !== null ? '260px' : '100%',
                                }}
                            >
                                <div className="vertical-line" onClick={toggleMyticketsContainer}></div>

                                <div className="mytickets_header" >
                                    <span className='ticketview-open' onClick={toggleLeftContainer} ><i className="fa fa-bars" aria-hidden="true"></i></span>
                                    <span className='mytickets_title'>My Tickets</span>
                                    <div className="ticket-filter-btn ticket-popupbtn">

                                        <ButtonComponent label='+ New Ticket' customBtn='new_ticket_button' onClick={handleNewTicketToggle} />
                                    </div>

                                </div>
                                <div className='mytickets_filter_search_container'>
                                    <ButtonComponent label='+ Add Filter' customBtn='teaminbox_add_filter' onClick={handleAddFilterOpen} />
                                    {
                                        state.addFilterPopup && (
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



                                    <SearchboxComponent placeholder='Search Tickets' />
                                </div>

                                <div className='mytickets_content'>
                                    <ul>

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
                            {state.selectedTicket !== null && (
                                <div className='teaminbox_right_container'>

                                    <div className='teaminboxmain_content'>
                                        <Grid container spacing={2}>

                                            <Grid item xs={9}>
                                                <div className="ticketsgridbox">
                                                    <div className='ticketsgrid_header'>
                                                        <div className='ticketsgrid_title'>{ticketData[state.selectedTicket]?.title}</div>

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
                                                    <Editorbox
                                                        isActive={state.isActive}
                                                        ticketStatusOptions={ticketStatusOptions}
                                                        onTogglePrivate={handleTogglePrivate}
                                                        ticketStatusContent={state.ticketStatusContent}
                                                        onChange={(event, newValue) => updateState({ ticketStatusContent: newValue })}
                                                        showTicketStatus={true} />
                                                 
                                                </div>
                                            </Grid>
                                            <Grid item xs={3} className='todo_container'>
                                                <div className="todogridbox">
                                                    <div className='todo_header'>
                                                        <button className='todo_button' onClick={handleToggle}>To Do<span className='todobtn_arrow'><KeyboardArrowDownIcon /></span></button>
                                                        <CloseIcon className='todo_close_icon' />
                                                    </div>
                                                    {
                                                        state.open && (
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
                                                                value={state.channelContent}
                                                                onChange={(event, newValue) => updateState({ channelContent: newValue })} 
                                                                customStyles={style.newticketsAutocomplete}/>
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Priority</label>
                                                            <AutocompleteComponent
                                                                options={priorityOptions}
                                                                value={state.priorityContent}
                                                                onChange={(event, newValue) => updateState({ priorityContent: newValue })}
                                                                customStyles={style.newticketsAutocomplete} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Assigned To <span className='assignme_span'>Assign to me</span></label>
                                                            <AutocompleteComponent
                                                                options={assignedOptions}
                                                                value={state.assignedContent}
                                                                onChange={(event, newValue) => updateState({ assignedContent: newValue })}
                                                                customStyles={style.newticketsAutocomplete} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Project</label>
                                                            <AutocompleteComponent
                                                                options={projectOptions}
                                                                value={state.projectContent}
                                                                onChange={(event, newValue) => updateState({ projectContent: newValue })}
                                                                customStyles={style.newticketsAutocomplete} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Ticket Type</label>
                                                            <AutocompleteComponent
                                                                options={ticketTypeOptions}
                                                                value={state.ticketTypeContent}
                                                                onChange={(event, newValue) => updateState({ ticketTypeContent: newValue })}
                                                                customStyles={style.newticketsAutocomplete} />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Due Date</label>
                                                            <input type="date" className='todo_due_date' />
                                                        </div>
                                                        <div className='todo_dropdown_container'>
                                                            <label className='todo_dropdown_label'>Reporter</label>
                                                            <AutocompleteComponent
                                                                options={reporterOptions}
                                                                value={state.reporterContent}
                                                                onChange={(event, newValue) => updateState({ reporterContent: newValue })}
                                                                customStyles={style.newticketsAutocomplete} />
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



            </div>
        </>
    );
}
export default TeamInbox;
