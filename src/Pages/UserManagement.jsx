import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Checkbox, Autocomplete, TextField, Chip, Tooltip } from '@mui/material';
import boy from '../Component/Assets/img/boy.png';
import { Modal, ModalBody } from 'react-bootstrap';
const initialTableData = [
    { id: 1, img: boy, firstName: "Thameem", lastName: "Hameed", status: 'Online', email: 'thameem@heptotechnologies.org', role: 'ADMINISTRATOR', teams: 'All Teams', ip: "61.2.127.142", logindate: "2024-11-27T12:02:58.085Z", statusData: "Email" },
    { id: 2, img: boy, firstName: "EV", lastName: "ZONE", status: 'Offline', email: 'info@evzoneafrica.com', role: 'ADMINISTRATOR', teams: 'All Teams', ip: "102.222.234.171", logindate: "2024-11-13T04:41:58.316Z", statusData: "Email" },
    { id: 3, img: boy, firstName: "juliet", lastName: "_1", status: 'Offline', email: 'juliet_1@evzoneafrica.com', role: 'TEMPLATE MANAGER; OPERATOR;', teams: 'Ev_zone_everyone', ip: '102.68.173.170', logindate: "2022-09-02T08:05:52.735Z", statusData: "Email" }
]
const initialTeamData = [
    { id: 1, teamName: 'EV_Zone_everyone', defaultTeam: 'Yes', teamSize: '3' },
    { id: 2, teamName: 'call_center_kampala', defaultTeam: 'No', teamSize: '2' },
    { id: 3, teamName: 'Driver_Liaison_officers', defaultTeam: 'No', teamSize: '2' },
    { id: 4, teamName: 'Ride_Agents_officers', defaultTeam: 'No', teamSize: '2' },
    { id: 5, teamName: 'Corporate_Liaison_officers', defaultTeam: 'No', teamSize: '2' }
]
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
const AddUserModal = ({ show, onClose }) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [content, setContent] = useState(["Administrator"]);
    const [emailConfirmed, setEmailConfirmed] = useState("No");
    const [phoneConfirmed, setPhoneConfirmed] = useState("No");
    const options = ["Broadcast manager", "Template manager", "contact manager", "operator", "Developer", "Dashboard viewer", "Billing manager", "Automation manager", "Administrator"];
    const teamOptions = ["EV_Zone_Everyone", "call_center_kampala", "Driver_Liasion_officers"];
    const handleAddUser = (newValue) => {
        if (newValue && !content.includes(newValue)) {
            setContent((prev) => [...prev, newValue]);
        }
    };

    const handleDelete = (userToDelete) => {
        setContent((prev) => prev.filter(user => user !== userToDelete));
    };

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="user__modal">
                <div className='userrule_main_content'>
                    <Modal.Header className='userrule_header' closeButton>
                        <Modal.Title >Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='userrule_modal_bodycontent'>
                        <div >
                            <div className='edit__text__label'>First Name</div>
                            <input type="text" placeholder="First Name" className='edit__text__input'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />

                            <div className='edit__text__label'>Last Name</div>
                            <input type="text" placeholder="Last Name" className='edit__text__input'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <div className='edit__text__label'>Email</div>
                            <input type="text" placeholder="Email" className='edit__text__input'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div class="usercheckbox-container">
                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox"
                                    checked={emailConfirmed === "Yes"}
                                    onChange={(e) =>
                                        setEmailConfirmed(e.target.checked ? "Yes" : "No")} />
                                <span className='edit__text__label'>Email Confirmed</span>
                            </div>

                            <div className='edit__text__label'>Phone Number</div>
                            <input type="text" placeholder="Phone Number" className='edit__text__input'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <div class="usercheckbox-container">
                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox"
                                    checked={phoneConfirmed === "Yes"}
                                    onChange={(e) =>
                                        setPhoneConfirmed(e.target.checked ? "Yes" : "No")
                                    } />
                                <span className='edit__text__label'>Phone Confirmed</span>
                            </div>

                            <div className='edit__text__label'>Roles</div>
                            <Autocomplete
                                options={options.filter(option => !content.includes(option))}
                                disableClearable
                                onChange={(event, newValue) => handleAddUser(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Select Roles"
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                            sx: {
                                                border: '1px solid rgb(232, 234, 242)',
                                                borderRadius: '4px',
                                                height: '3rem',
                                                paddingLeft: '10px',
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
                                        }}
                                    />
                                )}
                            />
                            {content.map((user) => (
                                <Chip
                                    key={user}
                                    label={user}
                                    variant="outlined"
                                    onDelete={() => handleDelete(user)}
                                    sx={{ marginTop: 2, marginRight: 1 }}
                                />
                            ))}
                            {!content.includes("Administrator") && (
                                <>
                                    <div className='edit__text__label'>Teams</div>
                                    <Autocomplete
                                        options={teamOptions}
                                        disableClearable
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                placeholder="Select Teams"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    disableUnderline: true,
                                                    sx: {
                                                        border: '1px solid rgb(232, 234, 242)',
                                                        borderRadius: '4px',
                                                        height: '3rem',
                                                        paddingLeft: '10px',
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
                                                }}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <div className='savebtn'>
                            <button className='btn btn-success' onClick={onClose}>Save</button></div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
const AddTeamModal = ({ show, onClose, onAddTeam, initialData }) => {
    const [teamName, setTeamName] = useState(initialData?.teamName || '');
    const [isDefaultTeam, setIsDefaultTeam] = useState(initialData?.defaultTeam === 'Yes');
    const handleSaveTeam = () => {
        if (teamName.trim()) {
            const teamData = {
                id: initialData?.id || Date.now(),
                teamName,
                defaultTeam: isDefaultTeam ? 'Yes' : 'No',
                teamSize: initialData?.teamSize || 0
            };
            onAddTeam(teamData);
            setTeamName('');
            setIsDefaultTeam(false);
            onClose();
        }
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="user__modal">
                <div className='userrule_main_content'>
                    <Modal.Header className='userrule_header' closeButton>
                        <Modal.Title >Add User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='userrule_modal_bodycontent'>
                        <div >
                            <input type="text" placeholder="Team Name" className='edit__text__input'
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)} />
                            <div class="usercheckbox-container">
                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox"
                                    checked={isDefaultTeam}
                                    onChange={(e) => setIsDefaultTeam(e.target.checked)} />

                                <span className='edit__text__label'>Default Team</span>
                            </div>
                        </div>
                        <div className='savebtn'>
                            <button className='btn btn-success' onClick={handleSaveTeam}>Add Team</button></div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
const UserManagement = () => {
    const [selectedOption, setSelectedOption] = useState('user');
    const [usermanagementData, setUsermanagementData] = useState(initialTableData); //user 
    const [teamsData, setTeamsData] = useState(initialTeamData)//teams
    const [searchUsermanagement, setSearchUsermanagement] = useState(''); //search 
    const [isModalUserOpen, setIsModalUserOpen] = useState(false); //add  and edit user modal
    const [isModalTeamOpen, setIsModalTeamOpen] = useState(false);//add and edit  team modal
    //pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, SetRowsPerPage] = useState(5);
    //edit team table
    const [editingTeam, setEditingTeam] = useState(null);
    //expanded arrow
    const [expandedRowId, setExpandedRowId] = useState(null);
    //moreicon modal
    const [ShowMoreIconContainer, setShowMoreIconContainer] = useState(null)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);//delete teams data
    //selected user and teams button
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    //pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowPerPage = (event) => {
        SetRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    //expanded toggle 
    const handleToggleRow = (id) => {
        setExpandedRowId((prevId) => (prevId === id ? null : id));
    };
    //user table more icon
    const handleOpenMoreIcon = (id) => {
        setShowMoreIconContainer((prevId) => (prevId === id ? null : id));
    }
    // const handlePreviousPage = () => {
    //     if (page > 0) {
    //         setPage(prev => prev - 1)
    //     }
    // }
    // const handleNextPage = () => {
    //     if (page < Math.ceil(usermanagementData.length / rowsPerPage) - 1) {
    //         setPage(prev => prev + 1)
    //     }
    // }
    // search 
    //user
    const filterUsermanagement = usermanagementData.filter(row =>
        row.firstName.toLowerCase().includes(searchUsermanagement.toLowerCase())
    );
    //teams
    const filterTeamData = teamsData.filter(row => row.teamName.toLowerCase().includes(searchUsermanagement.toLowerCase()))
    //pagination
    // const paginatedUsermanagementData = filterUsermanagement.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    //checkbox logic --> user table 
    const [checkedUserBody, setCheckedUserBody] = useState(
        filterUsermanagement.map(() => false))
    const [UserHeaderChecked, setUserHeaderChecked] = useState(false);
    // update all bodycheckbox
    const handleUserHeaderCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setUserHeaderChecked(isChecked);
        setCheckedUserBody(checkedUserBody.map(() => isChecked));
    };
    const handleUserBodyCheckboxChange = (index, event) => {
        const updatedCheckedBody = [...checkedUserBody];
        updatedCheckedBody[index] = event.target.checked;
        setCheckedUserBody(updatedCheckedBody);

        // Check if all body checkboxes are checked
        const allChecked = updatedCheckedBody.every((isChecked) => isChecked);
        setUserHeaderChecked(allChecked); // Update header checkbox 
    };
    //show and hide the delete icon in the header(user table)
    const isAnyUserCheckboxChecked = checkedUserBody.some((isChecked) => isChecked); //show the delete icon


    //checkbox logic -->Teams
    const [checkedTeamBody, setCheckedTeamBody] = useState(
        filterTeamData.map(() => false))
    const [TeamHeaderChecked, setTeamHeaderChecked] = useState(false);
    // update all bodycheckbox
    const handleTeamHeaderCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setTeamHeaderChecked(isChecked);
        setCheckedTeamBody(checkedTeamBody.map(() => isChecked));
    };
    const handleTeamBodyCheckboxChange = (index, event) => {
        const updatedCheckedBody = [...checkedTeamBody];
        updatedCheckedBody[index] = event.target.checked;
        setCheckedTeamBody(updatedCheckedBody);

        // Check if all body checkboxes are checked
        const allChecked = updatedCheckedBody.every((isChecked) => isChecked);
        setTeamHeaderChecked(allChecked); // Update header checkbox 
    };
    //show and hide the delete icon in the header(teams table)
    const isAnyTeamCheckboxChecked = checkedTeamBody.some((isChecked) => isChecked);


    //open and close user modal
    const handleOpenUserModal = () => {
        setIsModalUserOpen(true);
    };
    const handleCloseUserModal = () => {
        setIsModalUserOpen(false);
    };
    //open and close team modal
    const handleOpenTeamModal = () => {
        setIsModalTeamOpen(true)
    }
    const handleCloseTeamModal = () => {
        setIsModalTeamOpen(false)
    }
    // add and edit teams table data
    const handleAddTeam = (team) => {
        setTeamsData((prevData) => {
            const existingIndex = prevData.findIndex((t) => t.id === team.id);
            if (existingIndex !== -1) {
                // Update the existing team
                const updatedData = [...prevData];
                updatedData[existingIndex] = team;
                return updatedData;
            }
            // Add new team
            return [...prevData, team];
        });
    };

    const handleEditTeam = (team) => {
        setEditingTeam(team);
        setIsModalTeamOpen(true);
    };



    //delete modal (teams table)
    const handleOpenDeleteModal = () => {
        setIsOpenDeleteModal(true);
    }
    const handleCloseDeleteModal = () => {
        setIsOpenDeleteModal(false);
    }

    return (
        <>{
            isOpenDeleteModal &&
            <DeleteModal show={isOpenDeleteModal} onClose={handleCloseDeleteModal} onConfirm={handleCloseDeleteModal}
                msg='Do you want to remove this UserTeam?' />
        }

            {
                isModalUserOpen && (
                    <AddUserModal show={isModalUserOpen} onClose={handleCloseUserModal} />
                )
            }
            {
                isModalTeamOpen &&
                <AddTeamModal show={isModalTeamOpen} onClose={handleCloseTeamModal} onAddTeam={handleAddTeam}
                    initialData={editingTeam || ''} />
            }
            <div className="maincontent">
                <div className="usermanagement_container">
                    <div className="usermanagement_header">
                        <div className="left_container">
                            {/* User Radio Button */}
                            <input
                                type="radio"
                                className="radiobtn"
                                name="user-team"
                                id="user"
                                value="user"
                                checked={selectedOption === 'user'}
                                onChange={handleChange}
                            />
                            <label className="radiobtn_label" htmlFor="user">

                                <span className={`radiobtn_span ${selectedOption === 'user' ? 'checked' : ''}`} >
                                    User
                                </span>
                            </label>

                            {/* Teams Radio Button */}
                            <input
                                type="radio"
                                className="radiobtn"
                                name="user-team"
                                id="teams"
                                value="teams"
                                checked={selectedOption === 'teams'}
                                onChange={handleChange}
                            />
                            <label className="radiobtn_label" htmlFor="teams">

                                <span className={`radiobtn_span ${selectedOption === 'teams' ? 'checked' : ''}`}>
                                    Teams
                                </span>
                            </label>
                        </div>
                        <div className='right_container'>
                            <div className='action_wrap'>
                                <a href="https://www.youtube.com/watch?v=kAvFc_59RpU" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>
                                <div className='header__search'>
                                    <div className='search__input'>
                                        <div className='input__wrap'>
                                            <input placeholder="Search..." value={searchUsermanagement} onChange={(e) => setSearchUsermanagement(e.target.value)} />
                                            <div tabindex="0" class="header__search__icon"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    selectedOption === 'teams' ? (
                                        <button className='btn btn-success adduserbtn' onClick={handleOpenTeamModal} >Add Team</button>
                                    ) : (
                                        <button className='btn btn-success adduserbtn' onClick={handleOpenUserModal}>Add User</button>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div className='main_content'>
                        {
                            selectedOption === 'user' ? (
                                <Table className='usermanagement_table'>
                                    <TableHead className='usermanagement_head'>
                                        <TableRow className='usermanagement__row'>
                                            <TableCell className='usermanagement__cell alignleft firstcell' style={{ width: '100px' }} >
                                                <div class="usercheckbox-container">
                                                    <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                        checked={UserHeaderChecked}
                                                        onChange={handleUserHeaderCheckboxChange} />

                                                </div>

                                            </TableCell>
                                            <TableCell className='usermanagement__cell' style={{ width: '250px' }}>User</TableCell>
                                            <TableCell className='usermanagement__cell' style={{ width: '150px' }}>Online Status</TableCell>
                                            <TableCell className='usermanagement__cell' style={{ width: '200px' }}>Email/Phone</TableCell>
                                            <TableCell className='usermanagement__cell' style={{ width: '250px' }}>Role</TableCell>
                                            <TableCell className='usermanagement__cell' style={{ width: '200px' }}>Teams</TableCell>
                                            <TableCell className='usermanagement__cell lastcell' style={{ width: '110px' }}>
                                                {isAnyUserCheckboxChecked ? (
                                                    <button aria-label="delete" className='user_delete_icon'  ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                ) : (
                                                    'Actions'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='usermanagement__table__body'>
                                        {filterUsermanagement.map((data, index) => (
                                            <>
                                                <TableRow key={index} className='body_row'>
                                                    <TableCell className='body__cell body_first_cell'>
                                                        <div class="usercheckbox-container">
                                                            <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                                onChange={(event) => handleUserBodyCheckboxChange(index, event)} />

                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='body__cell' ><div className='flex_item'>
                                                        <img src={data.img} className='agent_image' /><div className='info_container'><p>{data.firstName}{data.lastName}</p></div></div> </TableCell>
                                                    <TableCell className='body__cell'><div style={{
                                                        color: data.status === 'Online' ? 'rgb(35, 164, 85)' : 'rgb(255, 14, 14)',
                                                        background: data.status === 'Online' ? 'rgb(233, 246, 238)' : 'rgb(255, 231, 231)'
                                                    }} className='status_content'>{data.status}</div></TableCell>
                                                    <TableCell className='body__cell'>{data.email}</TableCell>
                                                    <TableCell className='body__cell' >{data.role}</TableCell>
                                                    <TableCell className='body__cell'>{data.teams}</TableCell>
                                                    <TableCell>
                                                        <button className='cell__arrow' onClick={() => handleToggleRow(data.id)}><svg className='arrowsvg' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button>
                                                        <button className='cell__moreicon' onClick={() => handleOpenMoreIcon(data.id)} ><svg className='moreiconsvg' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg></button>
                                                    </TableCell>

                                                </TableRow>
                                                {expandedRowId === data.id && (
                                                    <TableRow className="body_row operator">
                                                        <TableCell colSpan={7}>
                                                            <div className='operator_attributes'>
                                                                <div className='attribute__name'>Last Login Ip</div>
                                                                <div className='attribute__value'>{data.ip}</div>
                                                            </div>
                                                            <div className='operator_attributes'>
                                                                <div className='attribute__name'>Last Login Date:</div>
                                                                <div className='attribute__value'>{data.logindate}</div>
                                                            </div>
                                                            <div className='operator_attributes'>
                                                                <div className='attribute__name'>Status:</div>
                                                                <div className='attribute__value'>{data.statusData}</div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                                {
                                                    ShowMoreIconContainer === data.id && (

                                                        <div key={`moreicon-${data.id}`} className='moreicon_container'>
                                                            <div className='moreicon_main_content'>
                                                                <div className='menu__item' onClick={handleOpenUserModal}>
                                                                    <span>Edit User</span>
                                                                </div>
                                                                <div className='menu__item'>
                                                                    <span>Reset password</span>
                                                                </div>
                                                                <div className='menu__item'>
                                                                    <span>Logout from output sessions</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    )
                                                }

                                            </>
                                        ))}

                                    </TableBody>
                                </Table>
                            ) : (
                                <>
                                    <Table className='usermanagement_table'>
                                        <TableHead className='usermanagement_head'>
                                            <TableRow className='usermanagement__row'>
                                                <TableCell className='usermanagement__cell alignleft firstcell' style={{ width: '100px' }} >

                                                    <div class="usercheckbox-container">
                                                        <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                            checked={TeamHeaderChecked}
                                                            onChange={handleTeamHeaderCheckboxChange} />

                                                    </div>

                                                </TableCell>
                                                <TableCell className='usermanagement__cell' style={{ width: '250px' }}>Team Name</TableCell>
                                                <TableCell className='usermanagement__cell' style={{ width: '150px' }}>Default Name
                                                    <Tooltip
                                                        title={
                                                            <ul >
                                                                <li className='defaultteam_tooltip'>* The Default Team can see all messages</li>
                                                                <li className='defaultteam_tooltip'>* The non-default team(s) can see only messages assigned to their team</li>
                                                            </ul>
                                                        }
                                                        placement="right"
                                                        arrow
                                                    >
                                                        <svg className="teamswarningicon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"></path></svg>
                                                    </Tooltip></TableCell>

                                                <TableCell className='usermanagement__cell' style={{ width: '200px' }}>Team Size</TableCell>
                                                <TableCell className='usermanagement__cell lastcell' style={{ width: '110px' }}>
                                                    {isAnyTeamCheckboxChecked ? (
                                                        <button aria-label="delete" className='user_delete_icon'  ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                    ) : (
                                                        'Actions'
                                                    )}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className='usermanagement__table__body'>
                                            {filterTeamData.map((data, index) => (
                                                <TableRow key={index} className='body_row'>
                                                    <TableCell className='body__cell body_first_cell'>
                                                        <div class="usercheckbox-container">
                                                            <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                                checked={checkedTeamBody[index]}
                                                                onChange={(event) => handleTeamBodyCheckboxChange(index, event)} />

                                                        </div>
                                                    </TableCell>
                                                    <TableCell className='body__cell' >{data.teamName}</TableCell>
                                                    <TableCell className='body__cell'>{data.defaultTeam}</TableCell>
                                                    <TableCell className='body__cell'>{data.teamSize}</TableCell>
                                                    <TableCell className='body__cell'>
                                                        <button aria-label="edit" className='cell__edit' onClick={() => handleEditTeam(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                                        <button aria-label="delete" className='cell__delete' onClick={handleOpenDeleteModal}  ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                    </TableCell>
                                                </TableRow>

                                            ))}

                                        </TableBody>
                                    </Table>
                                </>
                            )
                        }

                        <div className='usermanagement__pagination'>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component='div'
                                count={filterUsermanagement.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowPerPage}
                                ActionsComponent={() => (
                                    <div className='tablepagination__action'>

                                        <div>
                                            <p aria-label="Go to previous page" title="Go to previous page">
                                                <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                </svg>
                                                <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                            </p>
                                        </div>


                                        <div>
                                            <p aria-label="Go to next page" title="Go to next page">
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
            </div>
        </>
    );
};

export default UserManagement;
