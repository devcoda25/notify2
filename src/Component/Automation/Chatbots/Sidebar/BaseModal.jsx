import React from 'react';
import { Modal } from 'react-bootstrap';
import ButtonComponent from '../../../ButtonComponent';

const BaseModal = ({ show, onClose, onSave, title, children }) => {
  return (
    <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
      <div className="chatbot_question_content">
        <Modal.Header className="edit_text_material_header" closeButton>
          <Modal.Title className="edit_text_style">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edittext__body__content">
          <div className="question_text_content">{children}</div>
          <div className="footer__btn__container">
            <ButtonComponent label="Cancel" onClick={onClose} customBtn="cancel_button_style" />
            <ButtonComponent label="Save" onClick={onSave} />
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default BaseModal;
