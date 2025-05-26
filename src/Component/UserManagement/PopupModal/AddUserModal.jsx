import React, { useState } from "react";
import TextfieldComponent from "../../TextfieldComponent";
import ButtonComponent from "../../ButtonComponent";
import { Autocomplete, TextField, Chip } from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import AutocompleteComponent from "../../AutocompleteComponent";
import style from "../../MuiStyles/muiStyle";



const options = ["Broadcast manager", "Template manager", "contact manager", "operator", "Developer", "Dashboard viewer", "Billing manager", "Automation manager", "Administrator"];
const teamOptions = ["EV_Zone_Everyone", "call_center_kampala", "Driver_Liasion_officers"];

const AddUserModal = ({ show, onClose }) => {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [content, setContent] = useState(["Administrator"]);
    const [emailConfirmed, setEmailConfirmed] = useState("No");
    const [phoneConfirmed, setPhoneConfirmed] = useState("No");
    const [teamData, setTeamData] = useState(teamOptions[0]);

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
                            <TextfieldComponent type="text" placeholder="First Name" value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} />


                            <div className='edit__text__label'>Last Name</div>
                            <TextfieldComponent type="text" placeholder="Last Name" value={lastName}
                                onChange={(e) => setLastName(e.target.value)} />

                            <div className='edit__text__label'>Email</div>
                            <TextfieldComponent type="email" placeholder="Email" value={email}
                                onChange={(e) => setEmail(e.target.value)} />

                            <div class="usercheckbox-container">

                                <input type="checkbox" id="customCheckbox" class="usercustom-checkbox userconfirmedcheckbox"
                                    checked={emailConfirmed === "Yes"}
                                    onChange={(e) =>
                                        setEmailConfirmed(e.target.checked ? "Yes" : "No")} />
                                <span className='edit__text__label'>Email Confirmed</span>
                            </div>

                            <div className='edit__text__label'>Phone Number</div>
                            <TextfieldComponent type="phone" placeholder="Phone Number" value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} />

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
                                                ...style.userAutocompleteStyle,
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
                                    <AutocompleteComponent
                                        options={teamOptions}
                                        value={teamData}
                                        onChange={(e, newValue) => setTeamData(newValue)}
                                        customStyles={{ ...style.automationAutoComplete }}
                                    />

                                </>
                            )}
                        </div>
                        <div className='savebtn'>
                            <ButtonComponent label='Save' onClick={onClose} />

                        </div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}


export default AddUserModal;