import React  from "react";
import { Modal, ModalBody } from 'react-bootstrap';

const NewRuleModal = ({ show, onClose, onClick }) => {

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="newrule_modal">
                <div className='newrule_main_content'>
                    <Modal.Header className='newrule_header' closeButton>
                        <Modal.Title >Create a new rule</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='newrule_modal_bodycontent'>
                        <div className='newrule_trigger_text'>Pick a trigger</div>
                        <div className='newrule_trigger_subtext'>A trigger is an event that starts a rule. Once you turn on a rule, we will monitor for that trigger event.
                            <a href='#' target='_blank'>Learn more about triggers</a>
                        </div>
                        <div className='newrule_attribute_trigger'>
                            <div>
                                <div className='newrule_trigger_text'> Attribute based triggers</div>
                                <div className='newrule_attribute_grid'>
                                    <div className='newrule_attribute_grid_content' onClick={onClick}>
                                        <div className='newrule_attribute_image'>
                                            <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg></div>
                                        </div>
                                        <div class="gridcontent_trigger__text">New attribute is added to a contact</div>
                                    </div>
                                    <div className='newrule_attribute_grid_content' onClick={onClick}>
                                        <div className='newrule_attribute_image'>
                                            <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M4 1.5C3.4475 1.5 3 1.9475 3 2.5V6C3 6.5525 3.4475 7 4 7H5.5V8.5C5.5 9.04653 5.95347 9.5 6.5 9.5H10C10.5465 9.5 11 9.04653 11 8.5V5C11 4.45347 10.5465 4 10 4H8.5V2.5C8.5 1.9475 8.0525 1.5 7.5 1.5H4ZM8.5 5H10V8.5H6.5V7H7.5C8.0525 7 8.5 6.5525 8.5 6V5ZM1 7V9C1 9.54653 1.45347 10 2 10H3.5V11L5 9.5L3.5 8V9H2V7H1Z" fill="white"></path></svg></div>
                                        </div>
                                        <div class="gridcontent_trigger__text">An attribute value is changed for a contact</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <div className='newrule_modal_footer'><a class="newrulemodal_footer__link" href="https://feedback.wati.io/board-1/feedback?typeId=c4739cc2-c0ac-4062-893a-26ddb645549f" target="_blank">Don’t see a trigger that you need? Suggest a new trigger here!</a></div>
                </div>
            </Modal>
        </>
    )
}
export default NewRuleModal;