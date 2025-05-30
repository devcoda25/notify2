import React from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";

const NotificationModal = ({ show, onClose, msg, value }) => {
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="chatbot__notification__modal">
                <div className='chatbot__notification__content'>
                    <Modal.Header className='chatbot__notification__header' closeButton>
                        <Modal.Title >Notification</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='chatbot__body__notificationcontent'>

                        <div class="notification__msg">Chatbot limit :<b>{value}</b><div>{msg}</div></div>
                        <div class="chatbotfoooter__delete">
                            <ButtonComponent label='cancel' onClick={onClose} />
                           
                            </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
export default NotificationModal;
