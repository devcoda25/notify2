import React from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";

const AddKeywordModalComponent = ({
    show,
    onClose,
    inputValue,
    onInputChange,
    onAddClick,
  }) => {
    return (
      <Modal show={show} onHide={onClose} dialogClassName="keyword__add__modal">
        <div className="keyword__add__content">
          <Modal.Header className="keyword__add__header" closeButton>
            <Modal.Title>Add Keyword</Modal.Title>
          </Modal.Header>
          <ModalBody className="keyword__body__addcontent">
            <TextfieldComponent
              placeholder="Please input a keyword."
              value={inputValue}
              onChange={onInputChange}
            />
            <div className="keywordfooter__add">
              <ButtonComponent
                label="Add"
                onClick={onAddClick}
                customBtn={!inputValue.trim() ? "keyword__add_disabled" : ""}
                disabled={!inputValue.trim()}
              />
            </div>
          </ModalBody>
        </div>
      </Modal>
    );
  };
  export default AddKeywordModalComponent;