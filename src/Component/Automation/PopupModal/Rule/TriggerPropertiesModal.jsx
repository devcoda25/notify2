import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ActionSelect from "./ActionSelect";
const options = [
    {
        id: 1, label: "New attribute is added to a contact", svg: (
            <svg style={{ background: "#ff9500", padding: "3px", marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg>
        )
    },
    { id: 2, label: "An attribute valueis changed for a contact", svg: (<svg style={{ background: "#ff9500", padding: "3px", marginRight: "8px" }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M4 1.5C3.4475 1.5 3 1.9475 3 2.5V6C3 6.5525 3.4475 7 4 7H5.5V8.5C5.5 9.04653 5.95347 9.5 6.5 9.5H10C10.5465 9.5 11 9.04653 11 8.5V5C11 4.45347 10.5465 4 10 4H8.5V2.5C8.5 1.9475 8.0525 1.5 7.5 1.5H4ZM8.5 5H10V8.5H6.5V7H7.5C8.0525 7 8.5 6.5525 8.5 6V5ZM1 7V9C1 9.54653 1.45347 10 2 10H3.5V11L5 9.5L3.5 8V9H2V7H1Z" fill="white"></path></svg>) },
];
const contactOptions = [
    { id: 1, label: 'Source' },
    { id: 2, label: 'Channel' },
    { id: 3, label: 'actual_fare' },
    { id: 4, label: 'actuall_estimate' },
    { id: 5, label: 'additional_items' }
]

const TriggerPropertiesModal = ({ show, onClose }) => {
 
    const [selectedOption, setSelectedOption] = useState("");
    const [SelectedContactOption, setSelectedContactOption] = useState("");

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleContactChange = (event) => {
        setSelectedContactOption(event.target.value);
    }
    return (
        <>
            <Modal show={show} onHide={onClose} backdrop={false}
                dialogClassName="custom_triggerpropertiesmodal">
                <div className='triggerproperties_content_container'>
                    <Modal.Header className='triggerproperties_header' closeButton>
                        <Modal.Title >Trigger Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='triggerproperties_modal_bodycontent'>
                        <div className='trigger_text'>
                            <div className='learn_more_text'>Your rule will trigger based on the below properties</div>
                            <a href='https://support.wati.io/l/en/article/4t7p3q876y-learn-more-about-triggers' className='learn_more_link'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66683 2.66651C2.31321 2.66651 1.97407 2.80698 1.72402 3.05703C1.47397 3.30708 1.3335 3.64622 1.3335 3.99984V11.9998C1.3335 12.3535 1.47397 12.6926 1.72402 12.9426C1.97407 13.1927 2.31321 13.3332 2.66683 13.3332H6.66683C7.17883 13.3332 7.64683 13.1405 8.00016 12.8238C8.3535 13.1405 8.8215 13.3332 9.3335 13.3332H13.3335C13.6871 13.3332 14.0263 13.1927 14.2763 12.9426C14.5264 12.6926 14.6668 12.3535 14.6668 11.9998V3.99984C14.6668 3.64622 14.5264 3.30708 14.2763 3.05703C14.0263 2.80698 13.6871 2.66651 13.3335 2.66651H9.3335C8.8215 2.66651 8.3535 2.85917 8.00016 3.17584C7.63385 2.84725 7.15892 2.66583 6.66683 2.66651H2.66683ZM7.3335 4.66651V11.3332C7.3335 11.51 7.26326 11.6796 7.13823 11.8046C7.01321 11.9296 6.84364 11.9998 6.66683 11.9998H2.66683V3.99984H6.66683C6.84364 3.99984 7.01321 4.07008 7.13823 4.1951C7.26326 4.32013 7.3335 4.48969 7.3335 4.66651ZM8.66683 11.3332V4.66651C8.66683 4.48969 8.73707 4.32013 8.86209 4.1951C8.98712 4.07008 9.15668 3.99984 9.3335 3.99984H13.3335V11.9998H9.3335C9.15668 11.9998 8.98712 11.9296 8.86209 11.8046C8.73707 11.6796 8.66683 11.51 8.66683 11.3332Z" fill="#1B74E3"></path></svg>
                                Learn more about triggers
                            </a>
                        </div>
                        <div className='trigger_details'>Trigger Details</div>
                        <div className='trigger_type_container'>
                            <div className='triggertype_text'>Trigger Type</div>
                           <ActionSelect
                                options={options}
                                selectedOption={selectedOption}
                                onChange={handleChange} />

                        </div>
                        <div className='contact_type_container'>
                            <div className='contacttype_text'>Contact Type</div>
                         <ActionSelect
                                options={contactOptions}
                                selectedOption={SelectedContactOption}
                                onChange={handleContactChange}

                            />
                        </div>
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
export default TriggerPropertiesModal;