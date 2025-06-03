import React, { useState, useEffect } from "react";
import TextfieldComponent from "../../../TextfieldComponent";
import KeywordBaseModal from "./KeywordBaseModal";

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

            <KeywordBaseModal show={show} onClose={onClose}  onSave={handleEditSave} title='New Text Material'>
                <div>
                    <div className='edit__text__label'>Material name</div>
                    <TextfieldComponent type='text' placeholder="Please input" value={title} onChange={(e) => setTitle(e.target.value)} />

                </div>
                <div>
                    <div className='edit__text__label'>Material content</div>
                    <textarea placeholder="Please input" class="edit__text__textarea" value={content}
                        onChange={(e) => setContent(e.target.value)}></textarea>
                </div>

            </KeywordBaseModal>

        </>

    )
}
export default EditTextModal;