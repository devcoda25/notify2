import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import TextfieldComponent from "../../../TextfieldComponent";

const AddSequenceModal = ({ show, onClose, onSave, initialName, isEditing }) => {
    const [sequenceName, setSequenceName] = useState(initialName || '');

    const handleInputChange = (event) => {
        setSequenceName(event.target.value);
    };
    const handleSave = () => {
        onSave(sequenceName);
        setSequenceName('');
    };
    const isDisabled = !sequenceName;
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
                <div className='keyword__delete__content copymodal_content'>
                    <Modal.Header className='keyword__delete__header' closeButton>
                        <Modal.Title >{isEditing ? "Edit Sequence Name" : "Add New Sequence"}</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='keyword__body__deletecontent'>
                        <div class="delete__confirm__msg">Sequence Name</div>
                        <TextfieldComponent type='text' placeholder="Sequence Name" value={sequenceName} onChange={handleInputChange} customStyle='custom_textfield' />

                        <div class="keywordfooter__delete">
                            <ButtonComponent
                                label='Save'
                                onClick={handleSave}
                                disabled={isDisabled}
                                customBtn={isDisabled && 'copy_disabled'}
                            />

                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    )
}
export default AddSequenceModal;