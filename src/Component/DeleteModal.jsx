import React from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "./ButtonComponent";

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
                        <div class="keywordfooter__delete">
                            <ButtonComponent label='cancel' onClick={onClose} customBtn='cancel_button_style' />
                            <ButtonComponent label='Yes' onClick={onConfirm} customBtn='confirm_button_style' />
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
export default DeleteModal;