import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Autocomplete, TextField, Chip, Tooltip, Box } from '@mui/material';
import boy from '../Component/Assets/img/boy.png';
import { Modal, ModalBody } from 'react-bootstrap';
import SearchboxComponent from '../Component/SearchboxComponent';
import ButtonComponent from '../Component/ButtonComponent';
import CustomPagination from '../Component/CustomPagination';
import { DeleteOutlineIcon } from '../Component/Icon';
import style from '../Component/MuiStyles/muiStyle';
import TableComponent from '../Component/TableComponent';
import DeleteModal from '../Component/DeleteModal';
import AddUserModal from '../Component/UserManagement/PopupModal/AddUserModal';
import AddTeamModal from '../Component/UserManagement/PopupModal/AddTeamModal';

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

const styles = {
    autocompleteStyle: {
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
    tablePaginationStyle: {
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
    }


}


const UserManagement = () => {
    const [state, setState] = useState({
        selectedOption: 'user',
        usermanagementData: initialTableData, //user
        isModalUserOpen: false, ////add  and edit user modal
        expandedRowId: null, //expanded arrow
        teamsData: initialTeamData, //teams
        isModalTeamOpen: false, //add and edit teams modal
        editingTeam: null, //edit team modal
        searchUsermanagement: '', //search
        page: 0, //pagination
        rowsPerPage: 5,
        ShowMoreIconContainer: null, //moreiconmodal
        isOpenDeleteModal: false,
        checkedUserBody: initialTableData.map(() => false),
        UserHeaderChecked: false,
        checkedTeamBody: initialTeamData.map(() => false),
        TeamHeaderChecked: false,
    });
    const updateState = (newValues) => {
        setState((prevState) => ({
            ...prevState,
            ...newValues,
        }));
    };
    //selected user and teams button
    const handleChange = (event) => {
        updateState({ selectedOption: event.target.value });
    };
    //pagination
    const handleChangePage = (event, newPage) => {
        updateState({ page: newPage });
    };

    const handleChangeRowPerPage = (event) => {
        updateState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        });
    };
    //expanded toggle 
    const handleToggleRow = (id) => {
        updateState({
            expandedRowId: state.expandedRowId === id ? null : id,
        });
    };
    //user table more icon
    const handleOpenMoreIcon = (id) => {
        updateState({
            ShowMoreIconContainer: state.ShowMoreIconContainer === id ? null : id,
        });
    };
    // Search filters
    // const filterUsermanagement = state.usermanagementData.filter(row =>
    //     row.firstName.toLowerCase().includes(state.searchUsermanagement.toLowerCase())
    // );
    // const filterTeamData = state.teamsData.filter(row =>
    //     row.teamName.toLowerCase().includes(state.searchUsermanagement.toLowerCase())
    // );
    // Checkbox logic --> user table
    const handleUserHeaderCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        updateState({
            UserHeaderChecked: isChecked,
            checkedUserBody: state.usermanagementData.map(() => isChecked),
        });
    };

    const handleUserBodyCheckboxChange = (index, event) => {
        const updatedCheckedBody = [...state.checkedUserBody];
        updatedCheckedBody[index] = event.target.checked;
        updateState({
            checkedUserBody: updatedCheckedBody,
            UserHeaderChecked: updatedCheckedBody.every((isChecked) => isChecked),
        });
    };
    //show and hide the delete icon in the header(user table)
    const isAnyUserCheckboxChecked = state.checkedUserBody.some((isChecked) => isChecked);  //show the delete icon

    //checkbox logic --> teams table
    const handleTeamHeaderCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        updateState({
            TeamHeaderChecked: isChecked,
            checkedTeamBody: state.teamsData.map(() => isChecked),
        });
    };

    const handleTeamBodyCheckboxChange = (index, event) => {
        const updatedCheckedBody = [...state.checkedTeamBody];
        updatedCheckedBody[index] = event.target.checked;
        updateState({
            checkedTeamBody: updatedCheckedBody,
            TeamHeaderChecked: updatedCheckedBody.every((isChecked) => isChecked),
        });
    };

    //show and hide the delete icon in the header(teams table)
    const isAnyTeamCheckboxChecked = state.checkedTeamBody.some((isChecked) => isChecked);
    //open and close user modal
    const handleOpenUserModal = () => updateState({ isModalUserOpen: true });
    const handleCloseUserModal = () => updateState({ isModalUserOpen: false });
    //open and close team modal
    const handleOpenTeamModal = () => updateState({ isModalTeamOpen: true });
    const handleCloseTeamModal = () => updateState({ isModalTeamOpen: false });

    // add and edit teams table data
    const handleAddTeam = (team) => {
        updateState((prevState) => {
            const existingIndex = prevState.teamsData.findIndex((t) => t.id === team.id);
            const updatedTeams = [...prevState.teamsData];
            if (existingIndex !== -1) {
                updatedTeams[existingIndex] = team;
            } else {
                updatedTeams.push(team);
            }
            return { teamsData: updatedTeams };
        });
    };

    const handleEditTeam = (team) => {
        updateState({
            editingTeam: team,
            isModalTeamOpen: true,
        });
    };
    //delete modal (teams table)
    const handleOpenDeleteModal = () => updateState({ isOpenDeleteModal: true });
    const handleCloseDeleteModal = () => updateState({ isOpenDeleteModal: false });

    const userColumn = [
        {
            id: "checkbox",
            label: (

                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                    checked={state.UserHeaderChecked}
                    onChange={handleUserHeaderCheckboxChange} />

            )
        },
        { id: "user", label: "User" },
        { id: "status", label: "Online Status" },
        { id: "contact", label: "Email/Phone" },
        { id: "role", label: "Role" },
        { id: "teams", label: "Teams" },
        {
            id: "actions",
            label: isAnyUserCheckboxChecked ? (
                <DeleteOutlineIcon sx={{ ...style.tableIconBtn, color: 'red' }} />


            ) : (
                "Actions"
            ),
        },

    ]
    const transformedUserData = state.usermanagementData.map((user, index) => ({
        originalData: user,
        checkbox: (

            <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                checked={state.checkedUserBody[user.id]}
                onChange={(event) => handleUserBodyCheckboxChange(user.id, event)} />
        ),
        user: (
            <div className="user_flex_item">
                <img src={user.img} className="user_agent_image" alt="user avatar" />
                <div className="user_info_container">
                    <p>{user.firstName} {user.lastName}</p>
                </div>
            </div>
        ),
        status: (
            <div className='user_status_content' style={{
                color: user.status === 'Online' ? 'rgb(35, 164, 85)' : 'rgb(255, 14, 14)',
                background: user.status === 'Online' ? 'rgb(233, 246, 238)' : 'rgb(255, 231, 231)'
            }}>
                {user.status}
            </div>
        ),
        contact: user.email || user.phone,
        role: user.role,
        teams: user.teams,
        actions: (
            <>
                <div>
                    <button
                        className="user_cell__arrow"
                        onClick={() => handleToggleRow(user.id)}
                        aria-label="Toggle Row Details"
                    >
                        <svg
                            className="user_arrowsvg"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <button
                        className="user_cell__moreicon"
                        onClick={() => handleOpenMoreIcon(user.id)}
                        aria-label="Open More Options"
                    >
                        <svg
                            className="user_moreiconsvg"
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 16 16"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path>
                        </svg>
                    </button>
                </div>

                {state.expandedRowId === user.id && (
                    <tr className="body_row user_operator">
                        <td>
                            <div className="user_operator_attributes">
                                <div className="user_attribute__name">Last Login Ip</div>
                                <div className="user_attribute__value">{user.ip}</div>
                            </div>
                            <div className="user_operator_attributes">
                                <div className="user_attribute__name">Last Login Date:</div>
                                <div className="user_attribute__value">{user.logindate}</div>
                            </div>
                            <div className="user_operator_attributes">
                                <div className="user_attribute__name">Status:</div>
                                <div className="user_attribute__value">{user.statusData}</div>
                            </div>
                        </td>
                    </tr>
                )}


                {state.ShowMoreIconContainer === user.id && (
                    <div key={`moreicon-${user.id}`} className="user_moreicon_container">
                        <div className="user_moreicon_main_content">
                            <div className="user_menu__item" onClick={handleOpenUserModal}>
                                <span>Edit User</span>
                            </div>
                            <div className="user_menu__item">
                                <span>Reset password</span>
                            </div>
                            <div className="user_menu__item">
                                <span>Logout from output sessions</span>
                            </div>
                        </div>
                    </div>
                )}
            </>
        ),

    }));


    const teamColumns = [
        {
            id: "checkbox",
            label: (

                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                    checked={state.TeamHeaderChecked}
                    onChange={handleTeamHeaderCheckboxChange} />
            )
        },
        { id: "teamName", label: "Team Name" },
        {
            id: "defaultTeam",
            label: (
                <Box display="flex" alignItems="center" gap={0.5}>
                    Default Name
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
                        <svg className="userandteamswarningicon" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"></path></svg>
                    </Tooltip>
                </Box>
            ),
        },
        { id: "teamSize", label: "Team Size" },
    ];

    const customRenderCell = (row, column) => {
        if (column.id === "checkbox") {
            return (


                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                    checked={state.checkedTeamBody[row.id]}
                    onChange={(event) => handleTeamBodyCheckboxChange(row.id, event)} />

            );
        }

        return row[column.id];
    };
    return (
        <>{
            state.isOpenDeleteModal &&
            <DeleteModal show={state.isOpenDeleteModal} onClose={handleCloseDeleteModal} onConfirm={handleCloseDeleteModal}
                msg='Do you want to remove this UserTeam?' />
        }

            {
                state.isModalUserOpen && (
                    <AddUserModal show={state.isModalUserOpen} onClose={handleCloseUserModal} />
                )
            }
            {
                state.isModalTeamOpen &&
                <AddTeamModal show={state.isModalTeamOpen} onClose={handleCloseTeamModal} onAddTeam={handleAddTeam}
                    initialData={state.editingTeam || ''} />
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
                                checked={state.selectedOption === 'user'}
                                onChange={handleChange}
                            />
                            <label className="radiobtn_label" htmlFor="user">

                                <span className={`radiobtn_span ${state.selectedOption === 'user' ? 'checked' : ''}`} >
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
                                checked={state.selectedOption === 'teams'}
                                onChange={handleChange}
                            />
                            <label className="radiobtn_label" htmlFor="teams">

                                <span className={`radiobtn_span ${state.selectedOption === 'teams' ? 'checked' : ''}`}>
                                    Teams
                                </span>
                            </label>
                        </div>
                        <div className='right_container'>
                            <div className='action_wrap'>
                                <a href="https://www.youtube.com/watch?v=kAvFc_59RpU" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>

                                <div className='header__search'>
                                    <div className='search__input'>
                                        <SearchboxComponent value={state.searchUsermanagement} onChange={(e) => setState((prev) => ({ ...prev, searchUsermanagement: e.target.value }))} customSearch='custom__search_box' placeholder='Search...' />
                                    </div>
                                </div>
                                {
                                    state.selectedOption === 'teams' ? (
                                        <ButtonComponent label='Add Team' onClick={handleOpenTeamModal} />

                                    ) : (
                                        <ButtonComponent label='Add User' onClick={handleOpenUserModal} />

                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div className='main_content'>
                        {
                            state.selectedOption === 'user' ? (
                                <>
                                    <Table className='usermanagement_table'>
                                        <TableHead className='usermanagement_head'>
                                            <TableRow className='usermanagement__row'>
                                                <TableCell className='usermanagement__cell alignleft firstcell' style={{ width: '100px' }} >
                                                    <div class="usercheckbox-container">
                                                        <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                            checked={state.UserHeaderChecked}
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
                                            {state.usermanagementData.map((data, index) => (
                                                <>
                                                    <TableRow key={index} className='body_row'>
                                                        <TableCell className='body__cell body_first_cell'>
                                                            <div class="usercheckbox-container">
                                                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox"
                                                                    onChange={(event) => handleUserBodyCheckboxChange(index, event)} />

                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='body__cell' ><div className='user_flex_item'>
                                                            <img src={data.img} className='user_agent_image' /><div className='user_info_container'><p>{data.firstName}{data.lastName}</p></div></div> </TableCell>
                                                        <TableCell className='body__cell'><div style={{
                                                            color: data.status === 'Online' ? 'rgb(35, 164, 85)' : 'rgb(255, 14, 14)',
                                                            background: data.status === 'Online' ? 'rgb(233, 246, 238)' : 'rgb(255, 231, 231)'
                                                        }} className='user_status_content'>{data.status}</div></TableCell>
                                                        <TableCell className='body__cell'>{data.email}</TableCell>
                                                        <TableCell className='body__cell' >{data.role}</TableCell>
                                                        <TableCell className='body__cell'>{data.teams}</TableCell>
                                                        <TableCell>
                                                            <button className='user_cell__arrow' onClick={() => handleToggleRow(data.id)}><svg className='user_arrowsvg' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></button>
                                                            <button className='user_cell__moreicon' onClick={() => handleOpenMoreIcon(data.id)} ><svg className='user_moreiconsvg' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg></button>
                                                        </TableCell>

                                                    </TableRow>
                                                    {state.expandedRowId === data.id && (
                                                        <TableRow className="body_row user_operator">
                                                            <TableCell colSpan={7}>
                                                                <div className='user_operator_attributes'>
                                                                    <div className='user_attribute__name'>Last Login Ip</div>
                                                                    <div className='user_attribute__value'>{data.ip}</div>
                                                                </div>
                                                                <div className='user_operator_attributes'>
                                                                    <div className='user_attribute__name'>Last Login Date:</div>
                                                                    <div className='user_attribute__value'>{data.logindate}</div>
                                                                </div>
                                                                <div className='user_operator_attributes'>
                                                                    <div className='user_attribute__name'>Status:</div>
                                                                    <div className='user_attribute__value'>{data.statusData}</div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                    {
                                                        state.ShowMoreIconContainer === data.id && (

                                                            <div key={`moreicon-${data.id}`} className='user_moreicon_container'>
                                                                <div className='user_moreicon_main_content'>
                                                                    <div className='user_menu__item' onClick={handleOpenUserModal}>
                                                                        <span>Edit User</span>
                                                                    </div>
                                                                    <div className='user_menu__item'>
                                                                        <span>Reset password</span>
                                                                    </div>
                                                                    <div className='user_menu__item'>
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
                                    {/* <TableComponent
                                        columns={userColumn}
                                        data={transformedUserData}
                                        showActions={false}
                                    /> */}
                                    {/* <TableComponent
                                        columns={userColumn}
                                        data={transformedUserData}
                                        showActions={false}
                                        expandedRowId={state.expandedRowId}
                                        expandedRowRenderer={(user) => (
                                            <div className="user_operator_content">
                                                <div className="user_operator_attributes">
                                                    <div className="user_attribute__name">Last Login Ip:</div>
                                                    <div className="user_attribute__value">{user.ip}</div>
                                                </div>
                                                <div className="user_operator_attributes">
                                                    <div className="user_attribute__name">Last Login Date:</div>
                                                    <div className="user_attribute__value">{user.logindate}</div>
                                                </div>
                                                <div className="user_operator_attributes">
                                                    <div className="user_attribute__name">Status:</div>
                                                    <div className="user_attribute__value">{user.statusData}</div>
                                                </div>
                                            </div>
                                        )}
                                        getRowId={(row) => row.originalData.id}
                                    /> */}

                                    <div className='usermanagement__pagination'>
                                        <CustomPagination
                                            count={state.usermanagementData.length}
                                            rowsPerPage={state.rowsPerPage}
                                            page={state.page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowPerPage}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>

                                    <TableComponent
                                        columns={teamColumns}
                                        data={state.teamsData}
                                        onEdit={(index) => handleEditTeam(state.teamsData[index])}
                                        onDelete={handleOpenDeleteModal}
                                        showActions={true}
                                        customRenderCell={customRenderCell}
                                        actionHeaderLabel={
                                            isAnyTeamCheckboxChecked ? (
                                                <DeleteOutlineIcon sx={{ ...style.tableIconBtn, color: 'red' }} />

                                            ) : (
                                                'Actions'
                                            )
                                        }
                                    />
                                    <div className='usermanagement__pagination'>
                                        <CustomPagination
                                            count={state.usermanagementData.length}
                                            rowsPerPage={state.rowsPerPage}
                                            page={state.page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowPerPage}
                                        />
                                    </div>
                                </>
                            )
                        }


                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagement;
