import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";

const options = ["EV_Zone_everyone", "call_center_Kampala", "Ride_Agents_officers", "Corporate_Liasion_officers"]

const EditAssigntoTeamModal = ({ show, onClose, onSave, initialTitle, initialContent }) => {
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
                        <Modal.Title className='edit_text_style' >New Routing Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div >
                            <div className='edit__text__label'>Material name</div>
                            <TextfieldComponent type="text" placeholder="Please input" value={title} onChange={(e) => setTitle(e.target.value)} />

                        </div>
                        <div>
                            <div className='edit__text__label'>Selected Team</div>
                            <AutocompleteComponent options={options}
                                value={content}
                               onChange={(event, newValue) => setContent(newValue)} />
                           
                        </div>
                        <div className='edit__text__save'>
                            <ButtonComponent label='Save' onClick={handleEditSave}/>
                           
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
export default EditAssigntoTeamModal;