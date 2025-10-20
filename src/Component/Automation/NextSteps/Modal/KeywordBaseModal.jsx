import React from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";

const KeywordBaseModal=({show,onClose,title,children,onSave})=>{
    return(
        <>
         <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >{title}</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                       {children}
                        <div className='edit__text__save'>
                            <ButtonComponent  onClick={onSave} label='Save'/>
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
export default KeywordBaseModal;

