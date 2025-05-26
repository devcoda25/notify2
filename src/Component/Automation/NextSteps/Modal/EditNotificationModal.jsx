import React,{useState,useEffect} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import AutocompleteComponent from "../../../AutocompleteComponent";
import ButtonComponent from "../../../ButtonComponent";
import { Chip } from "@mui/material";
import TextfieldComponent from "../../../TextfieldComponent";

const options = ["Thameem Hameed", "EV zone", "juliet_1"];

const EditNotificationModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent || []);
  

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
                        <TextfieldComponent type='text' placeholder="Please input" customStyle='custom_textfield'  value={title} onChange={(e) => setTitle(e.target.value)} />
                       
                    </div>
                    <div>
                        <div className='edit__text__label'>User List</div>
                        <AutocompleteComponent 
                         options={options.filter(option => !content.includes(option))}
                         onChange={(event, newValue) => handleAddUser(newValue)}
                        />
                        {/* <Autocomplete
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
                        /> */}
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
                        <ButtonComponent label='Save' onClick={handleEditSave}/>
                 </div>
                </Modal.Body>
            </div>
        </Modal>
    );
};
export default EditNotificationModal;