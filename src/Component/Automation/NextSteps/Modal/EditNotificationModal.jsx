import React, { useState, useEffect } from "react";
import AutocompleteComponent from "../../../AutocompleteComponent";
import { Chip } from "@mui/material";
import TextfieldComponent from "../../../TextfieldComponent";
import KeywordBaseModal from "./KeywordBaseModal";

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

        <KeywordBaseModal show={show} onClose={onClose} onSave={handleEditSave} title='Send Notification Material'>
            <div>
                <div className='edit__text__label'>Material name</div>
                <TextfieldComponent type='text' placeholder="Please input" customStyle='custom_textfield' value={title} onChange={(e) => setTitle(e.target.value)} />

            </div>
            <div>
                <div className='edit__text__label'>User List</div>
                <AutocompleteComponent
                    options={options.filter(option => !content.includes(option))}
                    onChange={(event, newValue) => handleAddUser(newValue)}
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


        </KeywordBaseModal>

    );
};
export default EditNotificationModal;