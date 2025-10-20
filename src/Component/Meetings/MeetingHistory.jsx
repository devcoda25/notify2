import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Modal, Avatar, AvatarGroup, Tabs, Tab, Paper, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Link,
    Popover
} from '@mui/material';
import style from '../MuiStyles/muiStyle';
import CustomButton from './CustomButton';
import AutocompleteComponent from '../AutocompleteComponent';
import CheckboxComponent from '../CheckboxComponent';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    FormatQuoteIcon, AccessTimeIcon, CalendarMonthIcon, GroupIcon, LinkIcon, VideocamIcon, HeadphonesIcon, EditIcon, DownloadIcon, SettingsIcon,
    SendIcon, CloseIcon, ThumbUpIcon, ReplyIcon, CommentIcon, DeleteIcon, PersonIcon, FavoriteIcon, PictureAsPdfIcon, ImageIcon, FolderIcon, DescriptionIcon,
    NoteAltIcon, FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon, StrikethroughSIcon, InsertLinkIcon, FormatListBulletedIcon, FormatListNumberedIcon
} from '../Icon';
import { Pointer } from 'highcharts';


const participants = [
    { name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=1', joined: '10:00 AM', left: '11:00 AM' },
    { name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?img=2', joined: '10:05 AM', left: '11:10 AM' },
    { name: 'Carol Lee', avatar: 'https://i.pravatar.cc/150?img=3', joined: '10:10 AM', left: '11:05 AM' },
    { name: 'David Kim', avatar: 'https://i.pravatar.cc/150?img=4', joined: '10:15 AM', left: '11:15 AM' },
    { name: 'Emma Wang', avatar: 'https://i.pravatar.cc/150?img=5', joined: '10:20 AM', left: '11:20 AM' },
];
const playbackOptions = ['0.5x', '0.75xx', '1x', '1.25x', '1.75x', '2x']

const comments = [
    {
        name: "Alice Johnson",
        text: "I think we should prioritize the UI redesign for next sprint.",
        time: "15:34",
        avatar: "https://i.pravatar.cc/40?img=1",
        likes: 3,
        hearts: 5
    },
    {
        name: "Bob Smith",
        text: "Good idea!",
        time: "15:40",
        avatar: "https://i.pravatar.cc/40?img=2",
        likes: 2,
        hearts: 1
    },
    {
        name: "Carol Lee",
        text: "Don't forget we also need to fix the accessibility issues.",
        time: "15:42",
        avatar: "https://i.pravatar.cc/40?img=3",
        likes: 4,
        hearts: 3
    },
    {
        name: "David Kim",
        text: "Let's schedule a review meeting by tomorrow EOD.",
        time: "15:45",
        avatar: "https://i.pravatar.cc/40?img=4",
        likes: 1,
        hearts: 0
    },
    {
        name: "Emma Wang",
        text: "I've started working on the mobile responsiveness fixes.",
        time: "15:47",
        avatar: "https://i.pravatar.cc/40?img=5",
        likes: 5,
        hearts: 2
    }
];

const files = [
    { name: 'Project Plan.pdf', icon: <PictureAsPdfIcon sx={{ color: '#e53935' }} /> },
    { name: 'design.png', icon: <ImageIcon sx={{ color: '#1e88e5' }} /> },
    { name: 'requirements.txt', icon: <DescriptionIcon sx={{ color: '#6d4c41' }} /> },
    { name: 'notes.docx', icon: <DescriptionIcon sx={{ color: '#6d4c41' }} /> },
];

const MeetingHistory = () => {
    const [tabIndex, setTabIndex] = useState(0);
    // const [commentText, setCommentText] = useState("");
    const [playbackData, setPlaybackData] = useState(playbackOptions[2]);
    // const [showOptions, setShowOptions] = useState(false);
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState('');
    const [content, setContent] = useState('');
    const [participantsModal, setParticipantsModal] = useState(null);
    const editorRef = useRef(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const [CheckboxState, setCheckboxState] = useState({
        timestamp: false,
        enableComment: false,
        enableLink: false
    })
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSave = () => {
        console.log('Saved Note:', note);
        handleClose();
    };
    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    // const handleToggle = () => {
    //     setShowOptions(prev => !prev);
    // };
    const handleCheckboxChange = (checkboxName, checked) => {
        setCheckboxState(prev => ({
            ...prev,
            [checkboxName]: checked,
        }));
    };


    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleInput = () => {
        setContent(editorRef.current.innerHTML);
    };

    const handleFormat = (cmd) => {
        document.execCommand(cmd, false, null);


        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.collapse(false); // move cursor to end
        }


        editorRef.current?.focus();
    };



    const handleLink = () => {
        const url = prompt('Enter a URL:');
        if (url) {
            document.execCommand('createLink', false, url);

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(false);
            }

            editorRef.current?.focus();
        }
    };


    const insertMedia = (file, type) => {
        const reader = new FileReader();
        reader.onload = () => {
            const tag = type === 'image'
                ? `<img src="${reader.result}" alt="Uploaded" style="max-width: 100%;height:233px"/>`
                : `<video controls style="max-width: 100%;"><source src="${reader.result}"></video>`;
            editorRef.current.focus();
            document.execCommand('insertHTML', false, tag);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            insertMedia(file, 'image');
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("video/")) {
            insertMedia(file, 'video');
        }
    };
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
    }, []);


    const handleParticipantsModal = (event) => {
        setParticipantsModal(event.currentTarget);
    };

    const handleCloseParticipantsModal = () => {
        setParticipantsModal(null);
    };

    const participantsOpen = Boolean(participantsModal);
   
    return (
        <div className='meeting_history_container'>
            <Box sx={style.meetinghistory_content}>
                <Modal open={open} onClose={handleClose}>
                    <Box sx={style.meetinghistoryModalStyle}>
                        <Box sx={style.meetinghistory_editheader}>
                            <Typography variant="h6">Edit Note</Typography>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box>
                            <Box sx={{ border: '1px solid #ccc', p: 1, display: 'flex', gap: 1 }}>
                                <IconButton onClick={() => handleFormat('bold')}>
                                    <FormatBoldIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFormat('italic')}>
                                    <FormatItalicIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFormat('underline')}>
                                    <FormatUnderlinedIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFormat('strikeThrough')}>
                                    <StrikethroughSIcon />
                                </IconButton>
                                <IconButton onClick={handleLink}>
                                    <InsertLinkIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFormat('insertUnorderedList')}>
                                    <FormatListBulletedIcon />
                                </IconButton>
                                <IconButton onClick={() => handleFormat('insertOrderedList')}>
                                    <FormatListNumberedIcon />
                                </IconButton>
                                <IconButton onClick={() => imageInputRef.current.click()}>
                                    <ImageIcon />
                                </IconButton>
                                <IconButton onClick={() => videoInputRef.current.click()}>
                                    <VideocamIcon />
                                </IconButton>
                            </Box>
                            <Box
                                ref={editorRef}
                                contentEditable
                                onInput={handleInput}
                                className='meetinghistory_editorbox'
                            />
                            <input
                                type="file"
                                accept="image/*"
                                ref={imageInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <input
                                type="file"
                                accept="video/*"
                                ref={videoInputRef}
                                onChange={handleVideoChange}
                                style={{ display: 'none' }}
                            />
                        </Box>


                        <Box sx={style.meetinghistory_editfooter}>
                            <CustomButton variant='outlined' sx={{ width: '100px' }} onClick={handleClose}>Cancel</CustomButton>
                            <CustomButton variant='contained' sx={{ ml: 0 }} onClick={handleSave}>Save</CustomButton>

                        </Box>
                    </Box>
                </Modal>
                {/* Left Section */}
                <Box sx={style.meetinghistory_leftcontent}>
                    {/* Header */}
                    <Box sx={style.meetinghistory_header}>
                        <Typography variant="h6">Meeting History - April 20, 2024</Typography>
                    </Box>

                    {/* Info Row */}
                    <Paper
                        elevation={3}
                        sx={style.meetinghistory_paper}
                    >
                        <Box
                            sx={style.meetinghistory_headercontent}
                        >
                            {/* DATE */}
                            <Box sx={style.meetingheader_date}>
                                <CalendarMonthIcon sx={{ color: '#1976d2', mr: 1 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">DATE</Typography>
                                    <Typography variant="body2">April 20, 2024</Typography>
                                </Box>
                            </Box>

                            {/* DURATION */}
                            <Box sx={style.meetingheader_date}>
                                <AccessTimeIcon sx={{ color: '#1976d2', mr: 1 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">DURATION</Typography>
                                    <Typography variant="body2">1 hour 15 min</Typography>
                                </Box>
                            </Box>

                            {/* HOST */}
                            <Box sx={style.meetingheader_date}>
                                <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
                                <Box>
                                    <Typography variant="caption" color="textSecondary">HOST</Typography>
                                    <Typography variant="body2">Alice Johnson</Typography>
                                </Box>
                            </Box>

                            {/* PARTICIPANTS */}
                            <Box sx={{ ...style.meetingheader_date, minWidth: 150, cursor: 'pointer' }}
                                onClick={handleParticipantsModal}>
                                <GroupIcon sx={{ color: '#1976d2', mr: 1 }} />
                                <AvatarGroup max={4}>
                                    {participants.map((p, i) => (
                                        <Avatar key={i} alt={p.name} src={p.avatar} />
                                    ))}
                                </AvatarGroup>
                            </Box>
                            <Popover
                                open={participantsOpen}
                                anchorEl={participantsModal}
                                onClose={handleCloseParticipantsModal}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <Box sx={{ p: 2, minWidth: 250 }}>

                                    {participants.map((p, i) => (
                                        <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Avatar src={p.avatar} alt={p.name} sx={{ width: 40, height: 40, mr: 1 }} />
                                            <Box>
                                                <Typography variant="subtitle2">{p.name}</Typography>
                                                <Typography variant="caption">Joined: {p.joined}</Typography><br />
                                                <Typography variant="caption">Left: {p.left}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Popover>
                        </Box>
                    </Paper>

                    {/* Tabs */}
                    <Box>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab icon={<VideocamIcon />} label="Video" />
                            <Tab icon={<HeadphonesIcon />} label="Audio" />
                        </Tabs>
                    </Box>

                    {/* Video Recording */}
                    <Paper elevation={2} sx={style.meetinghistory_paper}>
                        {tabIndex === 0 && (
                            <div>
                                <Box sx={style.meetinghistory_video}>
                                    <h3>
                                        <VideocamIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                        Video Recording
                                    </h3>
                                    <Box>
                                        <IconButton><DownloadIcon /></IconButton>
                                        <IconButton><LinkIcon /></IconButton>
                                    </Box>
                                </Box>
                                <video width="100%" height="300" controls>
                                    <source src="#" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        {tabIndex === 1 && (
                            <Box>
                                <Box sx={style.meetinghistory_video} >
                                    <h3>
                                        <HeadphonesIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
                                        Audio Recording
                                    </h3>
                                    <Box>
                                        <IconButton><DownloadIcon /></IconButton>

                                    </Box>
                                </Box>

                                <audio controls style={{ width: '100%' }}>
                                    <source src="your-audio-file.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <Box mt={2}>

                                    {/* <div style={{ height: '40px', background: '#ccc', position: 'relative' }}>

                                        {Array.from({ length: 210 }).map((_, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'inline-block',
                                                    width: '2px',
                                                    height: `${10 + (i % 3) * 10}px`,
                                                    backgroundColor: 'blue',
                                                    marginLeft: '2px',
                                                }}
                                            />
                                        ))}
                                    </div> */}
                                    <Box mt={1} display="flex" justifyContent="space-between">
                                        <div className='playbackspeed_content'>
                                            <span>Playback Speed:</span>
                                            <AutocompleteComponent
                                                options={playbackOptions}
                                                value={playbackData}
                                                onChange={(event, newValue) => setPlaybackData(newValue)} />

                                        </div>
                                        <span>00:00 / 00:00</span>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Paper>

                    {/* Meeting Notes */}
                    <Paper elevation={2} sx={style.meetinghistory_paper}>
                        <Box display="flex" justifyContent="space-between">
                            <Box display="flex" alignItems="center" mb={1} gap={1}>
                                <NoteAltIcon sx={{ color: '#2979ff' }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Meeting Notes
                                </Typography>
                            </Box>
                            <CustomButton variant='contained' icon={<EditIcon />} onClick={handleOpen}>Edit Notes</CustomButton>

                        </Box>
                        <ul style={{ marginTop: 10 }}>
                            <li>Discussed project milestones and deadlines.</li>
                            <li>Assigned tasks to team members.</li>
                            <li>Reviewed design mockups and feedback.</li>
                            <li>Planned next sprint and backlog prioritization.</li>
                            <li>Addressed blockers and resource needs.</li>
                        </ul>

                    </Paper>

                </Box>

                {/* Right Section */}
                <Box sx={style.meetinghistory_rightcontent}>
                    {/* Comments */}

                    <Paper elevation={2} sx={{ ...style.meetinghistory_paper, height: 550, display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" mb={1} gap={1}>
                            <CommentIcon sx={{ color: '#2979ff' }} />
                            <Typography variant="h6" fontWeight="bold">
                                Comments
                            </Typography>
                        </Box>

                        {/* Comment List Scrollable */}
                        <Box
                            sx={style.meetinghistory_comment}
                        >
                            {comments.map((comment, index) => (
                                <Box
                                    key={index}
                                    sx={style.meetingcomment_list}
                                >
                                    <Box display="flex" alignItems="flex-start" gap={1}>
                                        <Avatar alt={comment.name} src={comment.avatar} />
                                        <Box flexGrow={1}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography fontWeight="bold">{comment.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    @{comment.time}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" mt={0.5}>{comment.text}</Typography>

                                            <Box display="flex" justifyContent='space-between' alignItems="center" gap={1} mt={1}>
                                                <Box display='flex' gap={1}>
                                                    <Button size="small" startIcon={<ReplyIcon fontSize="small" />} sx={{ textTransform: 'none' }}>
                                                        Reply
                                                    </Button>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <FavoriteIcon fontSize="small" sx={{ color: 'gray' }} />
                                                        <Typography variant="caption">{comment.hearts}</Typography>
                                                    </Box>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <ThumbUpIcon fontSize="small" sx={{ color: 'gray' }} />
                                                        <Typography variant="caption">{comment.likes}</Typography>
                                                    </Box>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <FormatQuoteIcon fontSize="small" sx={{ color: 'gray' }} />

                                                    </Box>
                                                </Box>
                                                {/* Hover actions */}
                                                <Box className="actions" sx={{ visibility: 'hidden', ml: 1 }}>
                                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                                    <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                                                </Box>
                                            </Box>
                                        </Box>



                                    </Box>

                                </Box>
                            ))}
                        </Box>

                        {/* Comment Input */}
                        <Box mt={2} position="relative">
                            <textarea placeholder='Write a comment...' className='comment_input'></textarea>
                            <Box

                                display="flex"
                                alignItems="center"
                                gap={1}
                                mt={1}
                            >
                                <CheckboxComponent
                                    checked={CheckboxState.timestamp}
                                    onToggle={(checked) => handleCheckboxChange('timestamp', checked)} />
                                <Typography variant="body2">Attach to timestamp</Typography>
                                <Box ml="auto">
                                    <CustomButton variant='contained' icon={<SendIcon />}>Send</CustomButton>

                                </Box>

                            </Box>
                        </Box>
                    </Paper>



                    <Paper elevation={2} sx={{...style.meetinghistory_paper,height:'250px'}}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FolderIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight="bold">Attachments & Resources</Typography>
                            </Box>
                            <CustomButton variant='contained' icon={<DownloadIcon />}>Download All</CustomButton>

                        </Box>

                        {/* Scrollable List */}
                        <List dense sx={style.meetinghistory_filesupload}>
                            {files.map((file, i) => (
                                <ListItem
                                    key={i}
                                    disableGutters
                                    secondaryAction={
                                        <IconButton edge="end" size="small">
                                            <DownloadIcon />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar variant="rounded" sx={{ bgcolor: 'transparent' }}>
                                            {file.icon}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Link href="#" underline="hover" fontSize="small">
                                                {file.name}
                                            </Link>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    {/* <Paper elevation={2} sx={style.meetinghistory_paper}>
                        <Box sx={style.meetinghistory_options}>

                            <Box display="flex" alignItems="center" gap={1}>
                                <SettingsIcon color="primary" />
                                <Typography variant="subtitle1" fontWeight="bold">Options</Typography>
                            </Box>


                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary"> Restrict Access (by role/email)</Typography>
                            <TextfieldComponent type='text' placeholder="Enter roles or emails" />
                            <p>Separate multiple entries with commas.</p>

                            <Box>
                                <CheckboxComponent
                                    checked={CheckboxState.enableComment}
                                    onToggle={(checked) => handleCheckboxChange('enableComment', checked)} />
                                <label>Attach to timestamp</label>
                            </Box>
                            <Box>

                                <CheckboxComponent
                                    checked={CheckboxState.enableLink}
                                    onToggle={(checked) => handleCheckboxChange('enableLink', checked)} />
                                <label>Enable Public Sharing Link</label>
                            </Box>
                            <CustomButton variant='conatined' sx={style.archivemeetbtn} >  Archive Meeting</CustomButton>


                        </Box>
                    </Paper> */}
                    <Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
export default MeetingHistory;
