import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import TextfieldComponent from "../../../TextfieldComponent";



const ChatbotTimerModal = ({ show, onClose, onSave }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (

        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton >
                        <Modal.Title className='edit_text_style' >Chatbot Timer Settings</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div className='chatbot_time_container'>
                            <div>
                                <span className='chatbot_timemsg'>If user does not reply more than</span>
                                <TextfieldComponent type='text' placeholder='10'  customStyle='Timer__input'/>
                              
                                <span className='chatbot_timemsg'>minutes, the chatbot will end automatically.</span>
                            </div>
                        </div>
                        <div className='chatbot_checkbox__container'>
                            <input type='checkbox' className='chatbotmsg_checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} /><label className='checkboxlabel'>Enable fallback message</label>
                        </div>
                        {
                            isChecked &&
                            <>
                                <div className='chatbot_msg_container'>
                                    <label className='chatbot_message'>Exit chatbot notification:</label>
                                    <span className="text_field__counter">1/1024</span>
                                    <textarea className='edit__text__textarea chatbotmsg__textarea'>2</textarea>
                                </div>
                                <div className='chatbot_time_container'>
                                    <div>
                                        <span className='chatbot_timemsg'>This exit chatbot notification will show</span>
                                        <TextfieldComponent type='text' placeholder='5' customStyle='Timer__input'/>
                                       
                                        <span className='chatbot_timemsg'>minutes before the chatbot ends.</span>
                                    </div>
                                </div>
                            </>
                        }


                        <div className='edit__text__save'>
                            <ButtonComponent label='Save' onClick={onSave} />
                      
                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>

    )
}
export default ChatbotTimerModal;