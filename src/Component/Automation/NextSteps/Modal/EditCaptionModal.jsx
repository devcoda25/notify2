import React,{useState,useEffect} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";

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
                            <ButtonComponent label='Save' onClick={handleEditSave} />
                           
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
export default EditCaptionModal;