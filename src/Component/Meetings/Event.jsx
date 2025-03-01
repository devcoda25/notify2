import React, { useState } from "react";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Grid, Card, CardContent } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from "@mui/material";
import AutocompleteComponent from "../AutocompleteComponent";
const styles = {
    tooltipStyle: {
        position: "fixed",
        bottom: 20,
        right: '33%',
        boxShadow: 3,
        borderRadius: 2,
        border: '1px solid rgb(0 105 255 / 50%)',
        background: 'rgb(242, 248, 255)',
        padding: 2,
        maxWidth: 300,
        zIndex: 1000,
        "&::before": {
            content: '""',
            position: "absolute",
            top: "20px",
            left: "-10px",
            width: "0",
            height: "0",
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: "10px solid rgb(0 105 255 / 50%)",
            filter: "drop-shadow(-2px 2px 2px rgba(0,0,0,0.1))",
        },
    },
    tooltipContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    tooltipButton: {
        mt: 2,
        textTransform: "none",
        backgroundColor: "#007bff",
        boxShadow: 'none',
        borderRadius: '15px',
        float: 'right'
    },
    tooltipMessage: {
        fontSize: '15px'
    },
    neweventGrid: {
        maxWidth: 600,
        margin: "auto",
        marginLeft: '0px',
        paddingTop: '25px'
    },
    cardStyle: {
        display: "flex",
        alignItems: "center",
        p: 2,
        cursor: 'pointer',
        "&:hover": {
            borderColor: "blue",
        },
    },
    forwardArrow: {
        color: "gray",
        "&:hover": { color: "blue" }
    },
    title: {
        color: 'black',
        fontWeight: 600,
    },
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        width: '100%',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },


    },
    hostheading: {
        fontWeight: 600,
        color: 'black'
    },
    hostsubtitle: {
        marginTop: "20px",
        fontStyle: "italic",
        fontSize: "14px",
    },
    nextbutton: {
        borderRadius: '13px',
        boxShadow: 'none',
        textTransform: 'capitalize'
    },
    cancelButton: {
        textTransform: 'capitalize'
    },
    select_host: {
        color: 'black'
    },
    inviteUser: {
        "& .MuiDialog-paper": {
            width: "388px",
        },
    },
    invitecancelbtn: {
        color: 'black',
        marginRight: 'auto',
        border: '1px solid #476788',
        borderRadius: '10px',
        marginLeft: '15px',
        textTransform: 'capitalize',
        borderRadius: '40px',
    },
    inviteuserbtn: {
        boxShadow: 'none',
        textTransform: 'capitalize',
        borderRadius: '40px',
        background: '#006bff'
    }
};
const newEventOptions = [
    { id: 1, title: 'One-on-One', subTitle: 'One host with one invitee', description: "Good for: coffee chats, 1:1 interviews, etc.", icon: "/assets/images/one_on_one.svg", popupType: 'hostSelection' },
    { id: 2, title: 'Group', subTitle: 'One host with group of invitees', description: 'Good for: webinars, online classes, etc.', icon: "assets/images/group.svg", popupType: 'hostSelection' },
    { id: 3, title: 'Collective', subTitle: 'More than one host with one invitee', description: 'Good for: panel interviews, group sales calls, etc.', icon: 'assets/images/collective.svg', popupType: "inviteUsers" },
    { id: 4, title: 'Round Robin', subTitle: 'One rotating host with one invitee', description: 'Good for destributing incoming sales leads', icon: 'assets/images/round_robin.svg', popupType: "inviteUsers" }

]
const Event = () => {
    const hostOptions = ['hepto(me)'];
    const [open, setOpen] = useState(true);
    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [openHostModal, setOpenHostModal] = useState(false);
    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedHost, setSelectedHost] = useState(hostOptions[0]);

    const handleOpen = (option) => {
        setSelectedOption(option)
        if (option.popupType === 'hostSelection') {
            setOpenHostModal(true);
        }
        else if (option.popupType === 'inviteUsers') {
            setOpenInviteModal(true);
        }
    }
    const handleClose = () => {
        setOpenHostModal(false);
        setOpenInviteModal(false);
    };

    return (
        <>
            <div className="calendar_Eventtype">
                {
                    createNewEvent ? (
                        <>
                            <div className="back_button" onClick={() => setCreateNewEvent(false)}><ChevronLeftOutlinedIcon />Back</div>
                            <h1>Create New Event Type</h1>
                            <Grid container spacing={2} sx={{ ...styles.neweventGrid }}>
                                {newEventOptions.map((option, index) => (
                                    <Grid item xs={12} key={index} sx={{ paddingTop: '0px !important' }}>
                                        <Card variant="outlined" sx={{ ...styles.cardStyle }}>
                                            <Box sx={{ mr: 2 }}><img src={option.icon} /></Box>
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ ...styles.title }}>{option.title}</Typography>
                                                <Typography variant="subtitle1" color="textSecondary" sx={{ ...styles.title }}>
                                                    {option.subTitle}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {option.description}
                                                </Typography>
                                            </CardContent>
                                            <ArrowForwardIosIcon fontSize="small" color="disabled" sx={{ ...styles.forwardArrow }}
                                                onClick={() => handleOpen(option)} />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Dialog open={openHostModal} onClose={handleClose} >
                                <DialogTitle sx={{ ...styles.hostheading }}>
                                    Who will host this {selectedOption?.title.toLowerCase()} event type?
                                </DialogTitle>
                                <DialogContent>
                                    <Typography sx={{ mb: 2 }}>
                                        Create a {selectedOption?.title.toLowerCase()} event type for
                                        yourself or on behalf of another user.
                                    </Typography>
                                    <Typography className="select_host">Choose a host</Typography>
                                    <AutocompleteComponent
                                        options={hostOptions}
                                        value={selectedHost}
                                        onChange={(event, newValue) => setSelectedHost(newValue)}
                                        customStyles={styles.newticketsAutocomplete}
                                    />
                                    <Typography sx={{ ...styles.hostsubtitle }}>
                                        You'll be the owner of this event type so you'll be able to edit it.
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="inherit" sx={{ ...styles.cancelButton }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleClose} variant="contained" sx={{ ...styles.nextbutton }}>
                                        Next
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={openInviteModal} onClose={handleClose} sx={{ ...styles.inviteUser }}>
                                <DialogTitle sx={{ ...styles.hostheading }}>Invite people to your account</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Get started with Round Robin and other shared event types by
                                        inviting people to join your Calendly account.
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} variant="outlined" sx={{ ...styles.invitecancelbtn }} >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleClose} variant="contained" sx={{ ...styles.inviteuserbtn }} >
                                        Invite users
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <div className="event_create_meeting_card">
                                <p className="heading">More ways to meet</p>
                                <div className="card_content">
                                    <div className="create_meet">
                                        <p className="card_title">One-off meeting</p>
                                        <p>Invite someone to pick a time with you without creating an Event Type.</p>
                                        <a className="create_button">Create</a>
                                    </div>
                                    <div className="create_meet">
                                        <p className="card_title">Meeting pool</p>
                                        <p>Let your group of invitees vote on a time that works for everyone.</p>
                                        <a className="create_button">Create</a>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : (
                        <>
                            <h1>Event types</h1>

                            <div>
                                <div className="mail_account_container">
                                    <div className="mail_acc">
                                        <button className="user_logo">H</button>
                                        <div className="user_name"><p>hepto</p>
                                            <a>https://calendly.com/hepto</a>
                                        </div>
                                    </div>
                                    <div className="new_event_content">
                                        <button className="new_event_btn" onClick={() => setCreateNewEvent(true)} >+ New Event Type</button>
                                        <SettingsOutlinedIcon />
                                    </div>
                                </div>
                                <div className="event_type_card_list">
                                    <div className="meeting_card">
                                        <div className="event_type_card_cap"></div>
                                        <div className="selected_card">
                                            <input type="checkbox" />
                                            <SettingsOutlinedIcon />
                                        </div>
                                        <div className="selected_meeting_time">
                                            <h2>30 Minute Meeting</h2>
                                            <p>30 min, One-on-One</p>
                                            <a>View booking page</a>
                                        </div>
                                        <div className="meeting_card_button">
                                            <button className="copy_link"><ContentCopyOutlinedIcon className="copy_icon" />Copy link</button>
                                            <button className="share_button">Share</button>
                                        </div>
                                        <Box sx={{ ...styles.tooltipStyle }}  >
                                            <Box sx={{ ...styles.tooltipContainer }} >
                                                <Typography fontWeight="bold">Get your first meeting booked!</Typography>
                                                <IconButton size="small" onClick={() => setOpen(false)}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="body2" mt={1} sx={{ ...styles.tooltipMessage }}>
                                                You've successfully set up your first event. Preview your page, copy your link, or share your availability from here.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ ...styles.tooltipButton }}
                                                onClick={() => setOpen(false)}
                                            >
                                                Got it
                                            </Button>
                                        </Box>
                                    </div>

                                </div>
                            </div>

                        </>
                    )
                }

            </div >
        </>
    )
}
export default Event;