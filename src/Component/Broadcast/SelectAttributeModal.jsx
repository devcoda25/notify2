import React from "react";
import { Chip } from '@mui/material';
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';

const styles = {
   
    chipAttributes: {
        height: "34px",
        margin: " 0px 20px 20px 0px",
        padding: "0px 13px",
        border: "1px solid rgb(35, 164, 85)",
        borderRadius: " 100px",
        color: " rgb(35, 164, 85)",
        fontSize: "13px",
        fontWeight: " 500",
    }

}
const SelectAttributeModal = ({ show, onClose, onSelectAttribute }) => {
    const contactAttribute = ['Source', 'Channel', 'actual_fare', 'actuall_estimate', 'additional_items', 'address_count', 'agent', 'agent_name', 'airport', 'airport_name', 'allowbroadcast', 'allowsms', 'amount']
    const handleChipClick = (attribute) => {
        onSelectAttribute(`{{${attribute}}}`);
        onClose();
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="select_attribute_modal">
                <div className='select_attribute_content'>
                    <Modal.Header className='select_attribute_header' closeButton >
                        <Modal.Title className='select_attribute_text_style' >Select attribute</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <h4 className="attribute_title">Contact</h4>
                        {contactAttribute.map((attribute, index) => (
                            <Chip
                                key={index}
                                label={attribute}
                                variant="outlined"
                                sx={styles.chipAttributes}
                                onClick={() => handleChipClick(attribute)}
                            />
                        ))}
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
export default SelectAttributeModal;