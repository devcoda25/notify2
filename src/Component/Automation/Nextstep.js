import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TablePagination, TableRow, TextField, Autocomplete, Chip } from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import Cuppysmile from '../Assets/img/01_Cuppy_smile.webp';
import Cuppylol from '../Assets/img/02_Cuppy_lol.webp';
import Cuppyrofl from '../Assets/img/03_Cuppy_rofl.webp';
import Cuppysad from '../Assets/img/04_Cuppy_sad.webp';
import Cuppycry from '../Assets/img/05_Cuppy_cry.webp';
import Cuppylove from '../Assets/img/06_Cuppy_love.webp';
import Cuppyhate from '../Assets/img/07_Cuppy_hate.webp';
import Cuppylovewithmug from '../Assets/img/08_Cuppy_lovewithmug.webp';
import Cuppylovewithcookie from '../Assets/img/09_Cuppy_lovewithcookie.webp';
import Cuppyhmm from '../Assets/img/10_Cuppy_hmm.webp';

const initialCardData = [
    {
        title: "Offline_message",
        content: "Dear {{name}} we're unavailable right now"
    },
    {
        title: 'confirmed order',
        content: 'Your Order was confirmed and processed already 😊'
    },
    {
        title: 'Rating',
        content: "Thank you again 🤝 {{Name}}. We hope to serve you again soon. Goodbye ! 👋Incase you havent save this WhatsApp number, kindly add +256393249612 to your address book to avoid inconvinience in your future bookings via WhatsApp Visit www.evzone.app to view our other services"
    }
]
const initialDocumentData = [];
const initialImageData = [];
const initialVideoData = [];
const initialStickerData = [
    {
        title: "01_Cuppy_smile.webp",
        content: Cuppysmile
    },
    {
        title: "02_Cuppy_lol.webp",
        content: Cuppylol
    },
    {
        title: "03_Cuppy_rofl.webp",
        content: Cuppyrofl
    },
    {
        title: "04_Cuppy_sad.webp",
        content: Cuppysad
    },
    {
        title: "05_Cuppy_cry.webp",
        content: Cuppycry
    },
    {
        title: "06_Cuppy_love.webp",
        content: Cuppylove
    },
    {
        title: "07_Cuppy_hate.webp",
        content: Cuppyhate
    },
    {
        title: "08_Cuppy_lovewithmug.webp",
        content: Cuppylovewithmug
    },
    {
        title: "09_Cuppy_lovewithcookie.webp",
        content: Cuppylovewithcookie
    },
    {
        title: "10_Cuppy_hmm.webp",
        content: Cuppyhmm
    }
];
const initialChatbotsData = [
    { title: 'Other_Options' },
    { title: 'Fleet_ownership' },
    { title: 'Chargepoint owner ship' },
    { title: 'Become a driver' },
    { title: 'Charging' },
    { title: 'Investors' },
    { title: 'Agent enrollment' },
    { title: 'Charge point operator' },
    { title: 'Book_for_someone_a_ride_now' },
    { title: 'deliver_a_parcel_now' },
    { title: 'Recieve_parcel(food)' },
    { title: 'EV Market' },
    { title: 'Sell_EV_market' },
    { title: 'Buy_EV_Market' },
    { title: 'soon_to_be_closed' },
    { title: 'rides-flow' },
    { title: 'payment_process' },
    { title: 'dispatch' },
    { title: 'reschedule_order' },
    { title: 'cancel_order' },
    { title: 'ratings' },
    { title: 'Catalog' }
]
const initialSequencesData = [
    { title: 'normal' },
    { title: "incomplete" },
    { title: 'test' },
    { title: 'finish' }
]
const initialContactData = [];
const initialSendNotificationData = [];
const initialAssigntoUserData = [];
const initialAssigntoTeamData = [];
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

const EditTextModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent)
    }, [initialTitle, initialContent])
    const handleEditSave = () => {
        onSave(title, content)
    }
    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >New Text Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div >
                            <div className='edit__text__label'>Material name</div>
                            <input type="text" placeholder="Please input" className='edit__text__input'
                                value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <div className='edit__text__label'>Material content</div>
                            <textarea placeholder="Please input" class="edit__text__textarea" value={content}
                                onChange={(e) => setContent(e.target.value)}></textarea>
                        </div>
                        <div className='edit__text__save'>
                            <button className='btn btn-success' onClick={handleEditSave} >Save</button>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
const EditCaptionModal = ({ show, onClose, onSave, initialTitle }) => {
    const [title, setTitle] = useState(initialTitle);


    useEffect(() => {
        setTitle(initialTitle);

    }, [initialTitle])
    const handleEditSave = () => {
        onSave(title)
    }
    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >Edit Caption</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>

                        <div>
                            <div className='edit__text__label'>Caption</div>
                            <textarea placeholder="Please input" class="edit__text__textarea" value={title}
                                onChange={(e) => setTitle(e.target.value)}></textarea>
                        </div>
                        <div className='edit__text__save'>
                            <button className='btn btn-success' onClick={handleEditSave} >Save</button>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}

const EditContactAttributesModal = ({ show, onClose, onSave, initialTitle, initialRows }) => {
    const [title, setTitle] = useState(initialTitle);
    const options = ["Allow Broadcast", "Allow SMS", "Actual Fare",];
    const [rows, setRows] = useState(initialRows);

    useEffect(() => {
        setTitle(initialTitle);
        setRows(initialRows);
    }, [initialTitle, initialRows]);

    const handleEditSave = () => {
        onSave({ title, rows });
    };

    const addRow = () => {
        setRows([...rows, { selectedOption: "", booleanOption: null, inputValue: "" }]);
    };

    const handleChange = (index, key, value) => {
        const updatedRows = [...rows];
        updatedRows[index][key] = value;
        setRows(updatedRows);
    };
    const deleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };


    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton>
                        <Modal.Title className='edit_text_style'>Contact Attributes Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div>
                            <div className='edit__text__label'>Material name</div>
                            <input type="text" placeholder="Please input" className='edit__text__input'
                                value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <Table className='contact_attr_table'>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='contact_attr_cell firstchild'>
                                                {index === 0 && <div>Attributes</div>}
                                            </TableCell>
                                            <TableCell className='contact_attr_cell attr_type'>
                                                <Autocomplete
                                                    options={options}
                                                    value={row.selectedOption}
                                                    disableClearable
                                                    onChange={(event, newValue) => {
                                                        handleChange(index, "selectedOption", newValue);
                                                        handleChange(index, "booleanOption", null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="Attributes"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                disableUnderline: true,
                                                                sx: {
                                                                    border: '1px solid rgb(232, 234, 242)',
                                                                    borderRadius: '4px',
                                                                    height: '3rem',
                                                                    paddingLeft: '10px',
                                                                    backgroundColor: row.selectedOption ? 'white' : 'rgb(245, 246, 250)',
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
                                            </TableCell>
                                            <TableCell className='contact_attr_cell attr_type'>
                                                {row.selectedOption === "Allow Broadcast" || row.selectedOption === "Allow SMS" ? (
                                                    <Autocomplete
                                                        options={["True", "False"]}
                                                        value={row.booleanOption}
                                                        disableClearable
                                                        onChange={(event, newValue) => handleChange(index, "booleanOption", newValue)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                variant="standard"
                                                                placeholder="Value"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    disableUnderline: true,
                                                                    sx: {
                                                                        border: '1px solid rgb(232, 234, 242)',
                                                                        borderRadius: '4px',
                                                                        height: '3rem',
                                                                        paddingLeft: '10px',
                                                                        backgroundColor: row.selectedOption ? 'white' : 'rgb(245, 246, 250)',
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
                                                ) : (
                                                    <input type='text' className='attr_textfield' value={row.inputValue}
                                                        onChange={(e) => handleChange(index, "inputValue", e.target.value)} placeholder='Value' />
                                                )}
                                            </TableCell>
                                            <TableCell className='contact_attr_cell'>

                                                <button aria-label="delete" className=' material__btn cell__delete' onClick={() => deleteRow(index)}  ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className='contact_attr_addsegment'>
                                <button className='contact_attr_add' onClick={addRow}>Add segment +</button>
                            </div>
                        </div>
                        <div className='edit__text__save'>
                            <button className='btn btn-success' onClick={handleEditSave}>Save</button>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    );
};

const EditNotificationModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent || []);
    const options = ["Thameem Hameed", "EV zone", "juliet_1"];

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent || []);
    }, [initialTitle, initialContent]);

    const handleEditSave = () => {
        onSave(title, content);
    };

    const handleAddUser = (newValue) => {
        if (newValue && !content.includes(newValue)) {
            setContent((prev) => [...prev, newValue]);
        }
    };

    const handleDelete = (userToDelete) => {
        setContent((prev) => prev.filter(user => user !== userToDelete));
    };

    return (
        <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
            <div className='edit_text_material_content'>
                <Modal.Header className='edit_text_material_header' closeButton>
                    <Modal.Title className='edit_text_style'>Send Notification Material</Modal.Title>
                </Modal.Header>
                <Modal.Body className='edittext__body__content'>
                    <div>
                        <div className='edit__text__label'>Material name</div>
                        <input type="text" placeholder="Please input" className='edit__text__input'
                            value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <div className='edit__text__label'>User List</div>
                        <Autocomplete
                            options={options.filter(option => !content.includes(option))}
                            disableClearable
                            onChange={(event, newValue) => handleAddUser(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder="Input value & Please enter to search"
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                        sx: {
                                            border: '1px solid rgb(232, 234, 242)',
                                            borderRadius: '4px',
                                            height: '3rem',
                                            paddingLeft: '10px',
                                            backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
                    </div>
                    <div className='notification_selected_user'>
                        <div className='notification_selected_label'>Selected User(s)</div>
                        {content.map((user) => (
                            <Chip
                                key={user}
                                label={user}
                                variant="outlined"
                                onDelete={() => handleDelete(user)}
                            />
                        ))}
                    </div>
                    <div className='edit__text__save'>
                        <button className='btn btn-success' onClick={handleEditSave}>Save</button>
                    </div>
                </Modal.Body>
            </div>
        </Modal>
    );
};

const EditAssigntoUserModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const options = ["EV zone", "Thameem Hameed", "juliet_1"]
    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent)
    }, [initialTitle, initialContent])
    const handleEditSave = () => {
        onSave(title, content)
    }
    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >Assign to User Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div >
                            <div className='edit__text__label'>Material name</div>
                            <input type="text" placeholder="Please input" className='edit__text__input'
                                value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <div className='edit__text__label'>Selected User</div>

                            <Autocomplete
                                options={options}
                                value={content}
                                disableClearable
                                onChange={(event, newValue) => setContent(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Input value & Please enter to search"
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                            sx: {
                                                border: '1px solid rgb(232, 234, 242)',
                                                borderRadius: '4px',
                                                height: '3rem',
                                                paddingLeft: '10px',
                                                backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
                        </div>
                        <div className='edit__text__save'>
                            <button className='btn btn-success' onClick={handleEditSave} >Save</button>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
const EditAssigntoTeamModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const options = ["EV_Zone_everyone", "call_center_Kampala", "Ride_Agents_officers", "Corporate_Liasion_officers"]
    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent)
    }, [initialTitle, initialContent])
    const handleEditSave = () => {
        onSave(title, content)
    }
    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >New Routing Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div >
                            <div className='edit__text__label'>Material name</div>
                            <input type="text" placeholder="Please input" className='edit__text__input'
                                value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <div className='edit__text__label'>Selected Team</div>

                            <Autocomplete
                                options={options}
                                value={content}
                                disableClearable
                                onChange={(event, newValue) => setContent(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        placeholder="Input value & Please enter to search"
                                        InputProps={{
                                            ...params.InputProps,
                                            disableUnderline: true,
                                            sx: {
                                                border: '1px solid rgb(232, 234, 242)',
                                                borderRadius: '4px',
                                                height: '3rem',
                                                paddingLeft: '10px',
                                                backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
                        </div>
                        <div className='edit__text__save'>
                            <button className='btn btn-success' onClick={handleEditSave} >Save</button>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
const TextComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Text']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Text')}

                                                    >
                                                        {isMaterialChecked['Text']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>{data.content}</div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const DocumentComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,

}) => {
    const handleDownload = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl; // URL of the file
        link.download = fileName; // downloaded file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Document']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Document')}

                                                    >
                                                        {isMaterialChecked['Document']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                            <button className='material__btn cell__download' onClick={() => handleDownload(data.fileUrl, data.title)} ><svg className='downloadsvg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.333V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V11.333" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.33301 8L7.99967 10.6667L10.6663 8" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 1.33301V10.6663" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const ImageComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url; // The URL of the image
        link.download = title; // downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Image']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Image')}

                                                    >
                                                        {isMaterialChecked['Image']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                            <button className='material__btn cell__download' onClick={() => handleDownload(data.content, data.title)}><svg className='downloadsvg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.333V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V11.333" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.33301 8L7.99967 10.6667L10.6663 8" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 1.33301V10.6663" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'> <img src={data.content} alt={data.title} style={{ maxWidth: '100%', height: 'auto' }} /></div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const VideoComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url; // The URL of the image
        link.download = title; // downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Video']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Video')}

                                                    >
                                                        {isMaterialChecked['Video']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                            <button className='material__btn cell__download' onClick={() => handleDownload(data.content, data.title)}><svg className='downloadsvg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.333V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V11.333" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.33301 8L7.99967 10.6667L10.6663 8" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 1.33301V10.6663" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>
                                            <video width="100%" height="auto" controls>
                                                <source src={data.content} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const StickerComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url; // The URL of the image
        link.download = title; // downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Sticker']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Sticker')}

                                                    >
                                                        {isMaterialChecked['Sticker']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                            <button className='material__btn cell__download' onClick={() => handleDownload(data.content, data.title)}><svg className='downloadsvg' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.333V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V11.333" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.33301 8L7.99967 10.6667L10.6663 8" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 1.33301V10.6663" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'> <img src={data.content} alt={data.title} style={{ maxWidth: '100%', height: '190px' }} /></div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const ChatbotsComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Chatbots']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Chatbots')}

                                                    >
                                                        {isMaterialChecked['Chatbots']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const SequencesComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Sequences']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Sequences')}

                                                    >
                                                        {isMaterialChecked['Sequences']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const ContactComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['Contact']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'Contact')}

                                                    >
                                                        {isMaterialChecked['Contact']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const SendNotificationComponent = ({

    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['SendNotification']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'SendNotification')}

                                                    >
                                                        {isMaterialChecked['SendNotification']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>

                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const AssigntoUserComponent = ({

    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['AssigntoUser']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'AssigntoUser')}

                                                    >
                                                        {isMaterialChecked['AssigntoUser']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>Assign to User:{data.content}

                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const AssigntoTeamComponent = ({

    isMaterialChecked,
    handleCheckboxToggle,
    filterCardData,
    handleEditTextModal,
    handleDeleteTextCard,
    showCheckboxes,
}) => {
    return (
        <>
            <div>

                <div className='materials__action__item'>
                    <div className='action__item__'>
                        <div className='action__cards'>
                            {
                                filterCardData.map((data, index) => (
                                    <div key={index} className='material__action__cards'>
                                        <div className='action__edit'>
                                            <div className='action__edit__check'>
                                                {showCheckboxes && (
                                                    <div
                                                        className={`${isMaterialChecked['AssigntoUser']?.includes(data.title) ? 'checkbox_checked' : 'checkbox_unchecked'}`}
                                                        role="checkbox"
                                                        onClick={() => handleCheckboxToggle(data.title, 'AssigntoUser')}

                                                    >
                                                        {isMaterialChecked['AssigntoUser']?.includes(data.title) && (
                                                            <svg
                                                                stroke="currentColor"
                                                                fill="currentColor"
                                                                strokeWidth="0"
                                                                viewBox="0 0 20 20"
                                                                aria-hidden="true"
                                                                height="1em"
                                                                width="1em"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <button aria-label="edit" className='material__btn cell__edit' onClick={() => handleEditTextModal(data)} ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                            <button aria-label="delete" className=' material__btn cell__delete' onClick={() => handleDeleteTextCard(data.title)} ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                        </div>

                                        <div className='material__action__title'>{data.title}</div>
                                        <div className='material__action__content'>
                                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.75 16.8973C2.75 15.0619 4.08361 13.4986 5.89603 13.2093L6.05929 13.1833C7.51058 12.9517 8.98942 12.9517 10.4407 13.1833L10.604 13.2093C12.4164 13.4986 13.75 15.0619 13.75 16.8973C13.75 17.6906 13.1069 18.3337 12.3136 18.3337H4.18639C3.39309 18.3337 2.75 17.6906 2.75 16.8973Z" stroke="#666666" stroke-width="1.375"></path><path d="M11.4583 6.87533C11.4583 8.64724 10.0219 10.0837 8.25 10.0837C6.47809 10.0837 5.04167 8.64724 5.04167 6.87533C5.04167 5.10341 6.47809 3.66699 8.25 3.66699C10.0219 3.66699 11.4583 5.10341 11.4583 6.87533Z" stroke="#666666" stroke-width="1.375"></path><path d="M13.75 10.0837C15.5219 10.0837 16.9583 8.64724 16.9583 6.87533C16.9583 5.10341 15.5219 3.66699 13.75 3.66699M15.9407 18.3337H17.8136C18.6069 18.3337 19.25 17.6906 19.25 16.8973C19.25 15.0619 17.9164 13.4986 16.104 13.2093V13.2093C15.9953 13.192 15.8852 13.1833 15.7752 13.1833C15.4821 13.1833 15.391 13.1833 14.8877 13.1833" stroke="#666666" stroke-width="1.375" stroke-linecap="round"></path></svg>
                                            {data.content}

                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const CatalogComponent = () => {
    return (
        <div>
            <div className='catalog_content'>
                <div>All Sets created in Catalog gets displayed here. Checkout the <a href="https://www.youtube.com/watch?v=07vdgqGcU50" target="_blank" className='catalog_tutorial_link' color="#0E71C3"><div className="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#0E71C3"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span >Video</span></div></a> to learn how to create Sets in Meta Catalog.</div>
                <p>Note: Maximum of 30 items in a Set gets sent when a Set Catalog message is delivered to user.</p>
            </div>
            <div className='materials__action__item'>
                <div className='action__item__'>
                    <div className='material__list__nocontent'>
                        <img alt="No data" src="https://live-6053.wati.io/static/media/no_data.f7f1c72cf9ac99dfe00aa267dbd7928f.svg" />
                        <span className="nocontent__title">Catalog empty</span>
                        <span className="nocontent__text"><div>Visit <a href="https://live-6053.wati.io/catalog">Catalog setup page</a> to enable Catalog with WATI</div></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Nextstep = ({
    buttonData,
    InitialLoadingData,
    isOpenEditPage,
    isAddOpenPage,
    selectedEditRow,
    isMaterialCheckedAdd,
    isMaterialCheckedEdit,
    handleDeleteMaterial,
    handleCheckboxToggle,
    handleCancelBtn,
    handleSaveBtn,
    showCheckboxes = true }) => {

    const [cardData, setCardData] = useState(() => {

        const storedData = sessionStorage.getItem('cardData');
        return storedData ? JSON.parse(storedData) : {
            textCards: initialCardData,
            documentCards: initialDocumentData,
            imageCards: initialImageData,
            videoCards: initialVideoData,
            stickerCards: initialStickerData,
            chatbotsCards: initialChatbotsData,
            sequencesCards: initialSequencesData,
            contactCards: initialContactData,
            notificationCards: initialSendNotificationData,
            assigntouserCards: initialAssigntoUserData,
            assigntoteamCards: initialAssigntoTeamData,
        };
    });

    useEffect(() => {

        sessionStorage.setItem('cardData', JSON.stringify(cardData));
    }, [cardData])

    const [searchCardData, setSearchCardData] = useState('');
    const [showDeleteTextModal, setShowDeleteTextModal] = useState(false);
    const [cardTextToDelete, setCardTextToDelete] = useState(null);
    const [editTextModal, setEditTextModal] = useState(false);
    const [selectedTextCard, setSelectedTextCard] = useState(null);
    const [isTextEditing, setTextEditing] = useState(false);
    const [selectedButton, setSelectedButton] = useState(InitialLoadingData);
    const [isOpenEditCaption, setIsOpenEditCaption] = useState(false);
    const [isOpenChatbotsConfirmModal, setOpenChatbotsConfirmModal] = useState(false);
    const [isOpenSequenceConfirmModal, setOpenSequenceConfirmModal] = useState(false);
    const [isOpenContactAttributesModal, setOpenContactAttributesModal] = useState(false);
    const [isOpenNotificationModal, setOpenNotificationModal] = useState(false);
    const [isOpenAssigntoUserModal, setOpenAssigntoUserModal] = useState(false);
    const [isOpenAssigntoTeamModal, setOpenAssigntoTeamModal] = useState(false);
    const [keywordPage, setKeywordPage] = useState(0);
    const [keywordrowsPerPage, setKeywordRowsPerPage] = useState(10);


    const handleChangeKeywordPage = (event, newPage) => {
        setKeywordPage(newPage);
    };

    // Handle rows per page change
    const handleChangeKeywordRowsPerPage = (event) => {
        setKeywordRowsPerPage(parseInt(event.target.value, 10));
        setKeywordPage(0);
    };
    const filtercarddata = (selectedButton === 'Text' ?
        cardData.textCards.filter(data =>
            data.title.toLowerCase().includes(searchCardData.toLowerCase()) ||
            data.content.toLowerCase().includes(searchCardData.toLowerCase())
        )
        :
        selectedButton === 'Document' ?
            cardData.documentCards.filter(data =>
                data.title.toLowerCase().includes(searchCardData.toLowerCase())
            )
            :
            selectedButton === 'Image' ?
                cardData.imageCards.filter(data =>
                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                )
                :
                selectedButton === 'Video' ?
                    cardData.videoCards.filter(data =>
                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                    )
                    :
                    selectedButton === 'Sticker' ?
                        cardData.stickerCards.filter(data =>
                            data.title.toLowerCase().includes(searchCardData.toLowerCase())
                        )
                        : selectedButton === 'Chatbots' ?
                            cardData.chatbotsCards.filter(data =>
                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                            )
                            :
                            selectedButton === 'Sequences' ?
                                cardData.sequencesCards.filter(data =>
                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                )
                                :
                                selectedButton === 'Contact' ?
                                    cardData.contactCards.filter(data =>
                                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                    )
                                    :
                                    selectedButton === 'SendNotification' ?
                                        cardData.notificationCards.filter(data =>
                                            data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                        )
                                        :
                                        selectedButton === 'AssigntoUser' ?
                                            cardData.assigntouserCards.filter(data =>
                                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                            )
                                            :
                                            selectedButton === 'AssigntoTeam' ?
                                                cardData.assigntoteamCards.filter(data =>
                                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                                )
                                                :
                                                []
    );
    const handleDeleteTextCard = (title) => {
        setCardTextToDelete(title);
        setShowDeleteTextModal(true);
    }

    const handleDeleteTextCardConfirm = () => {
        setCardData(prevData => ({
            textCards: prevData.textCards.filter(card => card.title !== cardTextToDelete),
            documentCards: prevData.documentCards.filter(card => card.title !== cardTextToDelete),
            imageCards: prevData.imageCards.filter(card => card.title !== cardTextToDelete),
            videoCards: prevData.videoCards.filter(card => card.title !== cardTextToDelete),
            stickerCards: prevData.stickerCards.filter(card => card.title !== cardTextToDelete),
            contactCards: prevData.contactCards.filter(card => card.title !== cardTextToDelete),
            notificationCards: prevData.notificationCards.filter(card => card.title !== cardTextToDelete),
            assigntouserCards: prevData.assigntouserCards.filter(card => card.title !== cardTextToDelete),
            assigntoteamCards: prevData.assigntoteamCards.filter(card => card.title !== cardTextToDelete)
        }));

        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    };

    const handleCloseDeleteTextCard = () => {
        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    }
    const handleEditTextModal = (card) => {
        setSelectedTextCard(card);
        setEditTextModal(true);
        setTextEditing(true);
    }

    const handleCloseEditTextModal = () => {
        setEditTextModal(false);
        setSelectedTextCard(null);
    }
    const handleEditCaptionModal = (card) => {
        setSelectedTextCard(card);
        setIsOpenEditCaption(true);
        setTextEditing(true);
    }

    const handleCloseEditCaptionModal = () => {
        setIsOpenEditCaption(false);
        setSelectedTextCard(null)
    }

    const handleSaveEditText = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                textCards: prevData.textCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                textCards: [...prevData.textCards, { title, content }]
            }));
        }
        handleCloseEditTextModal();
    };

    const handleSaveEditCaption = (newTitle) => {
        setCardData(prevData => {
            let updatedCards;

            if (selectedButton === 'Document') {
                updatedCards = prevData.documentCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    documentCards: updatedCards,
                };
            } else if (selectedButton === 'Image') {
                updatedCards = prevData.imageCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    imageCards: updatedCards,
                };
            } else if (selectedButton === 'Video') {
                updatedCards = prevData.videoCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    videoCards: updatedCards,
                };
            }

            return prevData;
        });

        handleCloseEditCaptionModal();
    };


    const handleAddTextCard = () => {
        if (selectedButton === 'Text') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setEditTextModal(true);
        } else if (selectedButton === 'Document') {
            document.getElementById('btn-file').click();
        }
        else if (selectedButton === 'Image') {
            document.getElementById('btn-file-img').click();
        }
        else if (selectedButton === 'Video') {
            document.getElementById('btn-file-video').click();
        }
        else if (selectedButton === 'Sticker') {
            document.getElementById('btn-file-stickerimg').click();
        }
        else if (selectedButton === 'Chatbots') {
            setOpenChatbotsConfirmModal(true);
        }
        else if (selectedButton === 'Sequences') {
            setOpenSequenceConfirmModal(true);
        }
        else if (selectedButton === 'Contact') {
            setOpenContactAttributesModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'SendNotification') {
            setOpenNotificationModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoUser') {
            setOpenAssigntoUserModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoTeam') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setOpenAssigntoTeamModal(true);
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        const loadedDocuments = Array.from(files).map(file => ({
            title: file.name,
        }));

        setCardData(prevState => ({
            ...prevState,
            documentCards: [...prevState.documentCards, ...loadedDocuments],
        }));
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0]; //get 1st image file
            const fileName = file.name;
            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                const newImageCard = {
                    title: fileName,
                    content: fileReader.result, // img URL
                };

                // Update the imageCards in state
                setCardData((prevData) => ({
                    ...prevData,
                    imageCards: [...prevData.imageCards, newImageCard],
                }));
            };

            fileReader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const videoFile = files[0];
            const videoTitle = videoFile.name; // fetch the file name as title

            // video url
            const videoURL = URL.createObjectURL(videoFile);


            setCardData(prevData => ({
                ...prevData,
                videoCards: [...prevData.videoCards, { title: videoTitle, content: videoURL }]
            }));
        }
    };
    const handleStickerImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newStickerData = {
                    title: file.name,
                    content: reader.result //image url
                };

                // Updatethe new sticker
                setCardData(prevCardData => ({
                    ...prevCardData,
                    stickerCards: [...prevCardData.stickerCards, newStickerData]
                }));


                event.target.value = '';
            };

            reader.readAsDataURL(file);
        }
    };
    const handleCloseChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(false);
    }
    const handleEditChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(true);
    }
    const handleCloseSequenceConfirm = () => {
        setOpenSequenceConfirmModal(false);
    }
    const handleEditSequenceConfirm = () => {
        setOpenSequenceConfirmModal(true);
    }
    const handleCloseContactAttributes = () => {
        setOpenContactAttributesModal(false);
    }
    const handleEditContactAttributes = (card) => {
        setOpenContactAttributesModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleCloseAssigntoUser = () => {
        setOpenAssigntoUserModal(false);
    }
    const handleEditAssigntoUser = (card) => {
        setOpenAssigntoUserModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleEditAssigntoTeam = (card) => {
        setSelectedTextCard(card);
        setTextEditing(true);
        setOpenAssigntoTeamModal(true);
    }
    const handleCloseAssigntoTeam = () => {
        setOpenAssigntoTeamModal(false);
    }
    const handleSaveAssigntoUser = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: prevData.assigntouserCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: [...prevData.assigntouserCards, { title, content }]
            }));
        }
        handleCloseAssigntoUser();

    }
    const handleSaveAssigntoTeam = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: prevData.assigntoteamCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: [...prevData.assigntoteamCards, { title, content }]
            }));
        }
        handleCloseAssigntoTeam();
    }
    const handleSaveContactAttributes = ({ title, rows }) => {


        if (isTextEditing) {
            // Update the existing card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: prevData.contactCards.map((card) =>
                    card.title === selectedTextCard.title ? { title, attributes: rows } : card
                ),
            }));
        } else {
            // Add new contact card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: [
                    ...prevData.contactCards,
                    { title, attributes: rows },
                ],
            }));
        }

        handleCloseContactAttributes();
    }
    const handleCloseNotification = () => {
        setOpenNotificationModal(false);
    }
    const handleEditNotification = (card) => {
        setOpenNotificationModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);

    }
    const handleSaveNotification = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: prevData.notificationCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: [...prevData.notificationCards, { title, content }]
            }));
        }
        handleCloseNotification();
    }

    return (
        <div>
            {
                showDeleteTextModal && (<DeleteModal show={showDeleteTextModal} onClose={handleCloseDeleteTextCard}
                    onConfirm={handleDeleteTextCardConfirm} msg='Do you want to remove this card?' />)
            }
            {
                editTextModal && (
                    <EditTextModal show={editTextModal} onClose={handleCloseEditTextModal} onSave={handleSaveEditText}
                        initialTitle={selectedTextCard?.title || ''}
                        initialContent={selectedTextCard?.content || ''} />
                )
            }
            {
                isOpenEditCaption &&
                <EditCaptionModal show={isOpenEditCaption} onClose={handleCloseEditCaptionModal} onSave={handleSaveEditCaption}
                    initialTitle={selectedTextCard?.title} />
            }
            {
                isOpenChatbotsConfirmModal &&
                <DeleteModal show={isOpenChatbotsConfirmModal} onClose={handleCloseChatbotsConfirm} msg='You will lose unsaved changes when you navigate to chatbot builder. Are you sure you want to continue?' />
            }
            {
                isOpenSequenceConfirmModal &&
                <DeleteModal show={isOpenSequenceConfirmModal} onClose={handleCloseSequenceConfirm} msg='Do you want to go to the Sequence Editor and lose not saved settings?' />
            }
            {
                isOpenContactAttributesModal &&
                <EditContactAttributesModal show={isOpenContactAttributesModal} onClose={handleCloseContactAttributes} onSave={handleSaveContactAttributes}
                    initialTitle={selectedTextCard?.title || ''}
                    initialRows={selectedTextCard?.attributes || [{ selectedOption: "", booleanOption: null, inputValue: "" }]} />
            }
            {
                isOpenNotificationModal &&
                <EditNotificationModal show={isOpenNotificationModal} onClose={handleCloseNotification} onSave={handleSaveNotification}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoUserModal &&
                <EditAssigntoUserModal show={isOpenAssigntoUserModal} onClose={handleCloseAssigntoUser} onSave={handleSaveAssigntoUser}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoTeamModal &&
                <EditAssigntoTeamModal show={isOpenAssigntoTeamModal} onClose={handleCloseAssigntoTeam} onSave={handleSaveAssigntoTeam}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            <div className='nextstep__editor__container'>
                <div className='nextstep_left_container'>
                    {
                        buttonData.map((btn, index) => (
                            <button key={index} className={`nextstep__btn__container ${selectedButton === btn.value ? 'active' : ''}`} onClick={() => setSelectedButton(btn.value)}>
                                <span class="tab-item__icon">{btn.icon}</span>
                                <span class="tab-item__name">{btn.name}</span>
                            </button>
                        ))
                    }

                </div>
                <div className='nextstep_right_container'>
                    <div className='materials__header'>
                        <div className='materials__search'>
                            <div className='material__inputbox'>
                                <div className='material__searchcontainer'>
                                    <div className='material__input__wrap'>
                                        <input placeholder="Search..." className='search__input' value={searchCardData} onChange={(e) => setSearchCardData(e.target.value)} />
                                        <div className='material_search_icon'><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showCheckboxes && (
                            <div className='select__material'>
                                <label className='selected__items'>Selected material :</label>

                                {isOpenEditPage && (
                                    <span>
                                        {selectedEditRow && Array.isArray(selectedEditRow.replyMaterial) && selectedEditRow.replyMaterial.length > 0 && (
                                            selectedEditRow.replyMaterial.map((material, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{material}</div>
                                                        <svg
                                                            className='selected_material_delete'
                                                            onClick={() => handleDeleteMaterial(material)}
                                                            aria-hidden="true"
                                                            viewBox="0 0 24 24"
                                                            data-testid="CancelIcon"
                                                        >
                                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                        {Object.entries(isMaterialCheckedEdit).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}

                                {isAddOpenPage && (
                                    <span>
                                        {Object.entries(isMaterialCheckedAdd).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className='material_btn_container'>
                            {showCheckboxes && (
                                <>
                                    <button target="_self" class="material__cancel__btn" onClick={handleCancelBtn}>Cancel</button>

                                    <button target="_self" class="material__save__btn" onClick={handleSaveBtn} disabled={
                                        (isAddOpenPage && (!isMaterialCheckedAdd || Object.keys(isMaterialCheckedAdd).length === 0)) ||
                                        (isOpenEditPage && (!isMaterialCheckedEdit || Object.keys(isMaterialCheckedEdit).length === 0))
                                    }>Save</button>
                                </>
                            )}
                            {selectedButton !== 'Catalog' && (
                                <button className='keyword__add__btn' onClick={handleAddTextCard}>
                                    Add
                                </button>
                            )}
                            <input id="btn-file" type="file" accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, text/plain, application/pdf" hidden
                                onChange={handleFileChange} />
                            <input id="btn-file-img" type="file" accept="image/jpeg, image/png, image/webp" hidden
                                onChange={handleImageChange} />
                            <input id="btn-file-video" type="file" accept="video/m4v, video/mp4, video/3gpp" hidden
                                onChange={handleVideoChange} />
                            <input id="btn-file-stickerimg" type="file" accept="image/webp" hidden onChange={handleStickerImageChange}
                            />
                        </div>

                    </div>

                    {
                        selectedButton === 'Text' && (
                            <TextComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditTextModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}

                            />
                        )
                    }
                    {
                        selectedButton === 'Document' && (
                            <DocumentComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Image' && (
                            <ImageComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Video' && (
                            <VideoComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sticker' && (
                            <StickerComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Chatbots' && (
                            <ChatbotsComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditChatbotsConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sequences' && (
                            <SequencesComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditSequenceConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Contact' && (
                            <ContactComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditContactAttributes}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }

                    {
                        selectedButton === 'SendNotification' && (
                            <SendNotificationComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditNotification}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }

                    {
                        selectedButton === 'AssigntoUser' && (
                            <AssigntoUserComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoUser}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'AssigntoTeam' && (
                            <AssigntoTeamComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoTeam}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Catalog' && (
                            <CatalogComponent />
                        )
                    }


                </div>
                <div className='keyword__pagination'>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component='div'
                        count={5}
                        rowsPerPage={keywordrowsPerPage}
                        page={keywordPage}
                        onPageChange={handleChangeKeywordPage}
                        onRowsPerPageChange={handleChangeKeywordRowsPerPage}
                        ActionsComponent={() => (
                            <div className='tablepagination__action'>
                                {/* Previous Button */}
                                <div>
                                    <p aria-label="Go to previous page" title="Go to previous page">
                                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                        </svg>
                                        <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                    </p>
                                </div>

                                {/* Next Button */}
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
    )
}
export default Nextstep;