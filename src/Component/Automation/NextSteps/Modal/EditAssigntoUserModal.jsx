import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";
import KeywordBaseModal from "./KeywordBaseModal";


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
           
            <KeywordBaseModal show={show} onClose={onClose} onSave={handleEditSave} title='Assign to User Material'>
                <div>
                    <div className='edit__text__label'>Material name</div>
                    <TextfieldComponent type="text" placeholder="Please input" value={title} onChange={(e) => setTitle(e.target.value)} />

                </div>
                <div>
                    <div className='edit__text__label'>Selected User</div>
                    <AutocompleteComponent
                        options={options}
                        value={content}
                        onChange={(event, newValue) => setContent(newValue)}
                    />

                </div>
               
            </KeywordBaseModal>

        </>

    )
}
export default EditAssigntoUserModal;