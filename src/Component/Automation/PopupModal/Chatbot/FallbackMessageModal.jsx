import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";

const options = [1, 2, 3];

const FallbackMessageModal = ({ show, onClose, onSave }) => {
    
    const [value, setValue] = useState(2);
    const [isChecked, setIsChecked] = useState(false);
    const filteredOptions = options.filter(option => option !== value)

    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >Fallback Message</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div className='fallback_checkbox__container'>
                            <input type='checkbox' className='fallbackmsg_checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} /><label className='checkboxlabel'>Enable fallback message</label>
                        </div>
                        {
                            isChecked &&
                            <>
                                <div className='fallback_msg_container'>
                                    <label className='fallback_message'>Set fallback message if no keyword is matched in the chatbot:</label>
                                    <span className="text_field__counter">94/1024</span>
                                    <textarea className='edit__text__textarea fallbackmsg__textarea'>Sorry, we don't quite understand what you mean, please select or input from the options below.</textarea>
                                </div>
                                <div className='fallback_time_container'>
                                    <div>
                                        <span className='fallback_timemsg'>Fallback message will be triggered up to</span>
                                        <div className='fallback__dropdown'>
                                            <AutocompleteComponent 
                                             options={filteredOptions}
                                             value={value}
                                             onChange={(event, newValue) => setValue(newValue)}/>
                                           
                                        </div>
                                        <span className='fallback_timemsg'>times before chatbot ends.</span>
                                    </div></div>
                            </>
                        }


                        <div className='edit__text__save'>
                            <ButtonComponent label='save' onClick={onSave}/>
                         
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
export default FallbackMessageModal;