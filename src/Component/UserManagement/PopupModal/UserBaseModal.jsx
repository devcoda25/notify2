import React from "react";
import { Modal} from 'react-bootstrap';
import ButtonComponent from "../../ButtonComponent";


const UserBaseModal = ({ show, onClose, title, children, onSave }) => {
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="user__modal">
                <div className="userrule_main_content">
                    <Modal.Header className="userrule_header" closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="userrule_modal_bodycontent">
                        <div>{children}</div>
                        <div className='savebtn'>
                            <ButtonComponent label='Save' onClick={onSave} />
                        </div>

                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}
export default UserBaseModal;