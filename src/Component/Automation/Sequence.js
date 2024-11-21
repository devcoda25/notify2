import React, { useState } from 'react'
import { Modal, ModalBody } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Autocomplete, TextField, Checkbox, Chip, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const styles = {
    autocompleteStyle: {
        border: '1px solid rgb(232, 234, 242)',
        borderRadius: '4px',
        height: '36px',
        paddingLeft: '10px',
        width: '100%',
        paddingBottom: '25px',
        backgroundColor: 'rgb(245, 246, 250)',
        '&:hover': {
            border: '1px solid green',
        },
        '&.Mui-focused': {
            border: '1px solid green',
            backgroundColor: 'white',
            outline: 'none',
        },
    },
    textField: {
        background: 'rgb(245, 246, 250)',
        border: '1px solid rgb(232, 234, 242)',
        borderRadius: '5px',
        height: '42px',
        padding: '8px',
    },
}
//initial default table data
const initialTableData = [
    { id: 1, name: 'finish', messages: 1, triggered: 0, completed: '0%' },
    { id: 2, name: 'test', messages: 1, triggered: 0, completed: "0%" },
    { id: 3, name: 'incomplete', messages: 0, triggered: 0, completed: "0%" },
    { id: 4, name: 'normal', messages: 0, triggered: 0, completed: "0%" },
]
//delete table data modal
const DeleteModal = ({ show, onClose, onConfirm, msg }) => {
    return (
        <>
            <Modal show={show} dialogClassName="keyword__delete__modal">
                <div className='keyword__delete__content'>
                    <Modal.Header className='keyword__delete__header'>
                        <Modal.Title >Confirm</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='keyword__body__deletecontent'>
                        <div class="delete__confirm__msg">{msg}</div>
                        <div class="keywordfooter__delete"><button target="_self" className='footer__cancel__btn delete__cancel__btn' onClick={onClose} >Cancel</button><button target="_self" className='delete__confirm__btn' onClick={onConfirm}>Yes</button></div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
//add sequence modal
const AddSequenceModal = ({ show, onClose, onSave, initialName, isEditing }) => {
    const [sequenceName, setSequenceName] = useState(initialName || '');

    const handleInputChange = (event) => {
        setSequenceName(event.target.value);
    };
    const handleSave = () => {
        onSave(sequenceName);
        setSequenceName('');
    };
    const isDisabled = !sequenceName;
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
                <div className='keyword__delete__content copymodal_content'>
                    <Modal.Header className='keyword__delete__header' closeButton>
                        <Modal.Title >{isEditing ? "Edit Sequence Name" : "Add New Sequence"}</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='keyword__body__deletecontent'>
                        <div class="delete__confirm__msg">Sequence Name</div>
                        <input type="text" placeholder="Sequence Name" className='edit__text__input copymodal_text_input'
                            value={sequenceName}
                            onChange={handleInputChange} />
                        <div class="keywordfooter__delete"><button target="_self" className={`btn copy_btn ${isDisabled ? 'copy_disabled' : 'btn-success'}`} disabled={isDisabled} onClick={handleSave} >Save</button></div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
//add message settings modal ( handling add and edit message settings)
const MessageSettingModal = ({ show, onClose, onSave, initialData }) => {

    const sectionOptions = {
        Sticker: ['01_Cuppy_smile.webp', '02_Cuppy_lol.webp', '03_Cuppy_rofl.webp'],
        Text: ['Offline_mess', 'confirmed order', 'Rating'],
        Template: ['wake_up', 'emergency_update', 'welcomenote'],
    };
    const allOptions = ['days', 'hours', 'minutes'];
    const timeOptions = ['Any time', 'send between'];
    const [content, setContent] = useState(initialData?.content || '');

    const [data, setData] = useState(initialData?.data || '');
    const [optionData, setOptionData] = useState(allOptions);
    const [timeCount, setTimeCount] = useState(initialData?.timeCount || '');
    const [timeData, setTimeData] = useState(initialData?.timeData || '');
    const [timeOptionData, setTimeOptionData] = useState(timeOptions);
    const [fromTime, setFromTime] = useState(initialData?.fromTime || '');
    const [toTime, setToTime] = useState(initialData?.toTime || '');
    const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [selectedDays, setSelectedDays] = useState(initialData?.selectedDays || []);
    const handleOptionChange = (event, newValue) => {
        setData(newValue);

        if (newValue) {
            const remainingOptions = allOptions.filter(option => option !== newValue);
            setOptionData(remainingOptions);
        } else {
            setOptionData(allOptions);
        }
    };
    const handleTimeOptionChange = (event, newValue) => {
        setTimeData(newValue);

        if (newValue) {
            const remainingOptions = timeOptions.filter(option => option !== newValue);
            setTimeOptionData(remainingOptions);
        } else {
            setTimeOptionData(allOptions);
        }
    };
    const handleSelect = (event, newValue) => {
        setSelectedDays(newValue);
    };

    // Handle removing a chip
    const handleDelete = (dayToDelete) => {
        setSelectedDays((prevSelected) =>
            prevSelected.filter((day) => day !== dayToDelete)
        );
    };
    const [expandedSections, setExpandedSections] = useState({
        Sticker: false,
        Text: false,
        Template: false,
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleToggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const handleSave = () => {

        const savedValues = {
            content,
            timeCount,
            data,
            timeData,
            fromTime,
            toTime,
            selectedDays
        };
        onSave(savedValues);
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
                <div className='chatbot_question_content'>
                    <Modal.Header className='edit_text_material_header' closeButton>
                        <Modal.Title className='edit_text_style'>Message Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='edittext__body__content'>

                        <div className='msgsettings_dropdown_textfield' style={{ backgroundColor: dropdownOpen ? 'white' : 'rgb(245, 246, 250)' }}>
                            <TextField
                                variant="standard"
                                value={content}
                                placeholder={dropdownOpen ? "Search..." : "Select action"}
                                InputProps={{
                                    startAdornment: dropdownOpen ? (<SearchIcon sx={{ marginRight: '8px', color: 'gray' }} />) : null,
                                    disableUnderline: true,
                                }}
                                fullWidth
                                sx={{ border: 'none', padding: '8px' }}
                            />
                            <IconButton onClick={handleToggleDropdown}>
                                {dropdownOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                        </div>
                        {dropdownOpen && (
                            <div className='msgsettings_dropdownopen_container'>
                                {Object.keys(sectionOptions).map((section) => (
                                    <div key={section}>
                                        <div
                                            className='msgsettings_dropdown_subdivision'
                                            onClick={() => handleToggleSection(section)}
                                        >
                                            <strong>{section}</strong>
                                            <IconButton size="small">
                                                {expandedSections[section] ? <RemoveIcon /> : <AddIcon />}
                                            </IconButton>
                                        </div>
                                        {expandedSections[section] && (
                                            <div>
                                                {sectionOptions[section].map((option) => (
                                                    <div
                                                        key={option}
                                                        className='msgsettings_dropdown_sectionoption'

                                                        onClick={() => setContent(option)}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className='time_message_settings_container'>
                            <div className='edit__text__label'>This message will be sent atleast</div>
                            <div className='time_delay_container'>

                                <input type="number" className='edit__text__input time_delay_inputbox time_msg_settings'
                                    value={timeCount}
                                    onChange={(e) => setTimeCount(e.target.value)} />

                                <Autocomplete
                                    options={optionData}
                                    value={data}
                                    disableClearable
                                    onChange={handleOptionChange}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            placeholder=''
                                            InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true,
                                                sx: {
                                                    ...styles.autocompleteStyle,
                                                    width: '170px',
                                                    marginRight: '-80px',
                                                },
                                            }}

                                        />
                                    )}

                                />

                            </div>
                        </div>
                        <div className='time_message_settings_container'>
                            <Autocomplete
                                options={timeOptionData}
                                value={timeData}
                                disableClearable
                                onChange={handleTimeOptionChange}

                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder=''
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                            sx: {
                                                ...styles.autocompleteStyle
                                            },
                                        }}

                                    />
                                )}

                            />
                            {timeData === 'send between' && (
                                <div className='msg_sendtime_between'>
                                    <div className='msg_sendtime_container'>
                                        <span className='msg_sendtime_container_title'>From</span>
                                        <TextField
                                            variant="standard"
                                            value={fromTime}
                                            onChange={(e) => setFromTime(e.target.value)}
                                            placeholder='00:00'
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <AccessTimeIcon />
                                                    </InputAdornment>
                                                ),
                                                sx: { ...styles.textField },
                                                disableUnderline: true,
                                            }}
                                            fullWidth

                                        />
                                    </div>
                                    <div className='msg_sendtime_container'>
                                        <span className='msg_sendtime_container_title'>to</span>
                                        <TextField
                                            variant="standard"
                                            value={toTime}
                                            onChange={(e) => setToTime(e.target.value)}
                                            placeholder='00:00'
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <AccessTimeIcon />
                                                    </InputAdornment>
                                                ),
                                                sx: { ...styles.textField },
                                                disableUnderline: true,
                                            }}
                                            fullWidth

                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='time_message_settings_container'>
                            <div className='edit__text__label'>Days</div>
                            <div className='time_delay_container'>
                                <Autocomplete
                                    multiple
                                    placeholder='All days'
                                    options={daysOptions}
                                    value={selectedDays}
                                    disableClearable
                                    onChange={handleSelect}
                                    getOptionLabel={(option) => option}
                                    isOptionEqualToValue={(option, value) => option === value}

                                    renderTags={(selected) =>
                                        selected.length > 0 ? <span>{selected[0]}</span> : null
                                    }

                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checked={selected}
                                                sx={{ marginRight: 1 }}
                                            />
                                            {option}
                                        </li>
                                    )}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            placeholder=''
                                            InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true,
                                                sx: {
                                                    ...styles.autocompleteStyle,
                                                    width: '190px',
                                                },
                                            }}

                                        />
                                    )}

                                />


                            </div>
                            <div className='message_settings_chip'>
                                {selectedDays.map((day) => (
                                    <Chip
                                        key={day}
                                        label={day}
                                        variant="outlined"
                                        onDelete={() => handleDelete(day)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='edit__text__save'>

                            <button className='btn btn-success condition__save' onClick={handleSave} >Save</button>
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}
//sequence Main Component 
const Sequence = () => {
    //sequence screen --> default table
    const [sequenceData, setSequenceData] = useState(initialTableData);
    const [searchSequence, setSearchSequence] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, SetRowsPerPage] = useState(5);
    const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
    const [rowIndexToDelete, setRowIndexToDelete] = useState(null);
    const [addsequenceModal, setAddSequenceModal] = useState(false);
    // sequence id state 
    const [sequenceId, setSequenceId] = useState(false);
    const [sequenceName, setSequenceName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    //message settings modal 
    const [messageSettingModal, setMessageSettingModal] = useState(false);
    const [savedMessages, setSavedMessages] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [isOpenDeleteAddmsgModal, setOpenDeleteAddmsgModal] = useState(false);
    const [rowIndexToDeleteAddmsg, setRowIndexToDeleteAddmsg] = useState(null);
    const [isActive, setIsActive] = useState(false); //toggle
    const [editSequenceIndex, setEditSequenceIndex] = useState(null);



    const handleToggle = () => {
        setIsActive(!isActive);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowPerPage = (event) => {
        SetRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1)
        }
    }
    const handleNextPage = () => {
        if (page < Math.ceil(sequenceData.length / rowsPerPage) - 1) {
            setPage(prev => prev + 1)
        }
    }
    // search 
    const filterSequence = sequenceData.filter(row =>
        row.name.toLowerCase().includes(searchSequence.toLowerCase())
    );
    //pagination
    const paginatedSequenceData = filterSequence.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // default table--> delete 
    const handleDeleteOpenModal = (index) => {
        setRowIndexToDelete(index)
        setOpenDeleteModal(true);
    }
    const handleDeleteConfirm = () => {
        if (rowIndexToDelete !== null) {
            setSequenceData(prev => prev.filter((_, index) => index !== rowIndexToDelete))
        }
        handleDeleteCloseModal();
    }
    const handleDeleteCloseModal = () => {
        setRowIndexToDelete(null);
        setOpenDeleteModal(false);
    }
    // add sequence Name
    const handleOpenAddSequenceModal = () => {
        setAddSequenceModal(true);
        setIsEditing(false);
    }
    //edit sequence Name
    const handleOpenEditSequenceModal = () => {
        setAddSequenceModal(true);
        setIsEditing(true);;
    }
    const handleCloseAddSequence = () => {
        setAddSequenceModal(false);
    }
    // save add and edit sequence Name
    const handleSaveAddSequence = (newName) => {
        setSequenceName(newName);
        setAddSequenceModal(false);
        setSequenceId(true);
    };

    //  edit (sequenceId)
    const handleEditOpenModal = (index) => {
        // setSequenceName(row.name);
        setSequenceName(sequenceData[index].name);
        setAddSequenceModal(false);
        setSequenceId(true);
        setEditSequenceIndex(index);
    };


    // message settings modal
    const handleOpenMessagesettingsModal = (messageIndex = null) => {
        if (messageIndex !== null) {
            setEditIndex(messageIndex);
        }
        setMessageSettingModal(true);
    }
    const handleCloseMssagesettingsModal = () => {
        setMessageSettingModal(false);
    }

    // save add and edit message settings modal
    const handleSaveMessagesettingsModal = (savedValues) => {

        setMessageSettingModal(false);
        if (editIndex !== null) {
            // Update existing message if editing
            const updatedMessages = [...savedMessages];
            updatedMessages[editIndex] = savedValues; // Replace the edited message
            setSavedMessages(updatedMessages);
            setEditIndex(null); // Reset edit index
        } else {
            // Add new message if creating
            setSavedMessages((prevMessages) => [...prevMessages, savedValues]);
        }
    }

    // delete data of  sequence id table
    const handleDeleteRow = (index) => {
        setOpenDeleteAddmsgModal(true)
        setRowIndexToDeleteAddmsg(index)
    }
    const handleDeleteAddmsgCloseModal = () => {
        setOpenDeleteAddmsgModal(false);
        setRowIndexToDeleteAddmsg(null);
    };
    const handleDeleteAddmsgConfirm = () => {
        if (rowIndexToDeleteAddmsg !== null) {
            setSavedMessages((prevMessages) =>
                prevMessages.filter((_, index) => index !== rowIndexToDeleteAddmsg)
            );
        }
        setOpenDeleteAddmsgModal(false);
        setRowIndexToDeleteAddmsg(null);
    };
    // back button
    const handleSequenceBackbutton = () => {
        setSequenceId(false)
        if (editSequenceIndex !== null) {
            // Update the existing sequence if editing
            const updatedData = sequenceData.map((row, index) =>
                index === editSequenceIndex
                    ? {
                        ...row,
                        name: sequenceName,
                        messages: savedMessages.length, // Update message count
                    }
                    : row
            );
            setSequenceData(updatedData);
        }
        else {
            // Add new sequence if not editing
            const newSequence = {
                id: sequenceData.length + 1,
                name: sequenceName,
                messages: savedMessages.length,
                triggered: 0,
                completed: '0%',
            };
            setSequenceData([newSequence, ...sequenceData]);
        }
        setSequenceName('');
        setEditSequenceIndex(null);


    }

    return (
        <>
            {
                isOpenDeleteModal && (<DeleteModal show={isOpenDeleteModal} onClose={handleDeleteCloseModal}
                    onConfirm={handleDeleteConfirm} msg='Do you want to remove this sequence?'
                />)
            }
            {
                isOpenDeleteAddmsgModal &&
                (<DeleteModal show={isOpenDeleteAddmsgModal} onClose={handleDeleteAddmsgCloseModal}
                    onConfirm={handleDeleteAddmsgConfirm} msg='Do you want to remove this sequence?' />)
            }
            {
                addsequenceModal &&
                <AddSequenceModal show={addsequenceModal} onClose={handleCloseAddSequence} onSave={handleSaveAddSequence}
                    initialName={isEditing ? sequenceName : ''}
                    isEditing={isEditing} />
            }
            {
                messageSettingModal &&
                <MessageSettingModal show={messageSettingModal} onClose={handleCloseMssagesettingsModal} onSave={handleSaveMessagesettingsModal}
                    initialData={editIndex !== null ? savedMessages[editIndex] : null} />

            }

            {
                sequenceId ? (
                    <>
                        <div className='sequence_container'>
                            <div className='sequence_header'>
                                <div className='header_name'>
                                    <a className='chatbotbackbtn' href='#' onClick={handleSequenceBackbutton}><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
                                    {sequenceName}
                                    <EditIcon onClick={handleOpenEditSequenceModal} />
                                </div>

                                <button className='btn btn-success sequence_header_btn' onClick={() => handleOpenMessagesettingsModal()} >Add Message</button>
                            </div>
                            <div className='sequence__body__content'>
                                <div className='sequence__list__table'>
                                    <Table className='sequence__table'>
                                        <TableHead className='sequence__head'>
                                            <TableRow className='sequence__row'>
                                                <TableCell className='sequencetable__cell alignleft firstcell' style={{ width: '15%' }}></TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '100px' }}>Active</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Schedule</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Action Name</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Sent</TableCell>
                                                <TableCell className='sequencetable__cell lastcell' style={{ width: '200px' }}>Edit/Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className='sequence__table__body'>
                                            {savedMessages.map((message, index) => (
                                                <TableRow key={index} className='keyword__body__row'>
                                                    <TableCell className='sequence__body__cell body_first_cell'>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 6L20 10L4 10L4 6L20 6Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20 14L20 18L4 18L4 14L20 14Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                                    </TableCell>
                                                    <TableCell className='sequence__body__cell centred_text'>
                                                        <button
                                                            type="button"
                                                            className={`toggle__control ${isActive ? 'active' : ''}`}
                                                            onClick={handleToggle}
                                                            aria-label="Toggle"

                                                        >
                                                            <div className='toggle-indicator'></div>
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className='sequence__body__cell centred_text'>{message.timeCount ? `after ${message.timeCount}` : ''}<span className='addmsg_table_schedlue'>{message.data}</span></TableCell>
                                                    <TableCell className='sequence__body__cell centred_text'>{message.content}</TableCell>
                                                    <TableCell className='sequence__body__cell centred_text'>0</TableCell>

                                                    <TableCell className='sequence__body__cell sequenceactions'>

                                                        <button aria-label="edit" className='cell__edit' onClick={() => handleOpenMessagesettingsModal(index)}><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                                        <button aria-label="delete" className='cell__delete' onClick={() => handleDeleteRow(index)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </TableBody>
                                    </Table>

                                </div>

                            </div>
                        </div>
                    </>)
                    :
                    (
                        <div className='sequence_container'>
                            <div className='sequence_header'>
                                <h3 class="header__title">Sequences</h3>
                                <div className='header__search'>
                                    <div className='search__input'>
                                        <div className='input__wrap'>
                                            <input placeholder="Search..." value={searchSequence} onChange={(e) => setSearchSequence(e.target.value)} />
                                            <div tabindex="0" class="header__search__icon"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                                        </div>
                                    </div>
                                </div>
                                <a href="https://www.youtube.com/watch?v=plhp--9B9b8" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>

                                <button className='btn btn-success sequence_header_btn' onClick={handleOpenAddSequenceModal}  >Add Sequence</button>
                            </div>
                            <div className='sequence__body__content'>
                                <div className='sequence__list__table'>
                                    <Table className='sequence__table'>
                                        <TableHead className='sequence__head'>
                                            <TableRow className='sequence__row'>
                                                <TableCell className='sequencetable__cell alignleft firstcell' style={{ width: '25%' }}>Name</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Message</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Triggered</TableCell>
                                                <TableCell className='sequencetable__cell' style={{ width: '200px' }}>Completed</TableCell>
                                                <TableCell className='sequencetable__cell lastcell' style={{ width: '200px' }}>Edit/Delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className='sequence__table__body'>
                                            {
                                                paginatedSequenceData.map((row, index) => (
                                                    <TableRow key={index} className='keyword__body__row'>
                                                        <TableCell className='sequence__body__cell body_first_cell'>{row.name}</TableCell>
                                                        <TableCell className='sequence__body__cell centred_text'>{row.messages}</TableCell>
                                                        <TableCell className='sequence__body__cell centred_text'>{row.triggered}</TableCell>
                                                        <TableCell className='sequence__body__cell centred_text'>{row.completed}</TableCell>

                                                        <TableCell className='sequence__body__cell sequenceactions'>

                                                            <button aria-label="edit" className='cell__edit' onClick={() => handleEditOpenModal(index)}><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                                            <button aria-label="delete" className='cell__delete' onClick={() => handleDeleteOpenModal(index)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                </div>
                                <div className='sequence__pagination'>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, 100]}
                                        component='div'
                                        count={filterSequence.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowPerPage}
                                        ActionsComponent={() => (
                                            <div className='tablepagination__action'>

                                                <div>
                                                    <p onClick={handlePreviousPage} aria-label="Go to previous page" title="Go to previous page">
                                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                        </svg>
                                                        <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                                    </p>
                                                </div>


                                                <div>
                                                    <p onClick={handleNextPage} aria-label="Go to next page" title="Go to next page">
                                                        <span className="pagination_previousnextcont" >Next</span>
                                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                                        </svg>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        sx={{
                                            '.MuiTablePagination-displayedRows': {
                                                fontSize: '1.2rem',
                                                margin: '0px',
                                                color: 'rgb(51, 51, 51)'
                                            },
                                            '.MuiSelect-nativeInput': {
                                                padding: '0px 1rem',
                                                height: '3rem',
                                                margin: '0 0 8px 0px',
                                            },
                                            '.MuiInputBase-root': {
                                                fontSize: '1.2rem',
                                                paddingRight: '0',
                                            },
                                            '.MuiTablePagination-selectLabel': {
                                                fontSize: '1.2rem',
                                                margin: '0px',
                                                color: 'rgb(51, 51, 51)',
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )
            }

        </>
    )

}
export default Sequence;