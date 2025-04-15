import React,{useState,useEffect} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";

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
                            <TextfieldComponent type='text'  placeholder="Please input"   value={title} onChange={(e) => setTitle(e.target.value)}/>
                           
                        </div>
                        <div>
                            <div className='edit__text__label'>Material content</div>
                            <textarea placeholder="Please input" class="edit__text__textarea" value={content}
                                onChange={(e) => setContent(e.target.value)}></textarea>
                        </div>
                        <div className='edit__text__save'>
                            <ButtonComponent  onClick={handleEditSave} label='Save'/>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
export default EditTextModal;