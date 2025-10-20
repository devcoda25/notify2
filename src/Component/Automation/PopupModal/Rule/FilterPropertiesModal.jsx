import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ActionSelect from "./ActionSelect";

const options = [{ id: 1, label: 'Source' },
    { id: 2, label: 'Channel' },
    { id: 3, label: 'actual_fare' },
    { id: 4, label: 'actuall_estimate' },
    { id: 5, label: 'additional_items' }]
   

const FilterPropertiesModal = ({ show, onClose }) => {
    
    const [selectedOption, setSelectedOption] = useState("");


    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            <Modal show={show} onHide={onClose} backdrop={false}
                dialogClassName="custom_triggerpropertiesmodal">
                <div className='triggerproperties_content_container'>
                    <Modal.Header className='triggerproperties_header' closeButton>
                        <Modal.Title >Filter Properties</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='triggerproperties_modal_bodycontent'>
                        <div className='trigger_text'>
                            <div className='learn_more_text'>Add a filter to narrow down where the action should take place</div>
                            <a href='https://support.wati.io/l/en/article/ws0l9jdkkk-learn-more-about-filters?_gl=1*1xsro8w*_gcl_au*ODI5NTcxMjk3LjE3MjY0OTE0NDU.*_ga*MTYxNTI3NjY1MS4xNzI2NDkxNDQ2*_ga_HYL717ZD73*MTczMTc1NDQ0Mi4xNjcuMS4xNzMxNzU0NDQ1LjU3LjAuMA..' className='learn_more_link' target='_blank'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66683 2.66651C2.31321 2.66651 1.97407 2.80698 1.72402 3.05703C1.47397 3.30708 1.3335 3.64622 1.3335 3.99984V11.9998C1.3335 12.3535 1.47397 12.6926 1.72402 12.9426C1.97407 13.1927 2.31321 13.3332 2.66683 13.3332H6.66683C7.17883 13.3332 7.64683 13.1405 8.00016 12.8238C8.3535 13.1405 8.8215 13.3332 9.3335 13.3332H13.3335C13.6871 13.3332 14.0263 13.1927 14.2763 12.9426C14.5264 12.6926 14.6668 12.3535 14.6668 11.9998V3.99984C14.6668 3.64622 14.5264 3.30708 14.2763 3.05703C14.0263 2.80698 13.6871 2.66651 13.3335 2.66651H9.3335C8.8215 2.66651 8.3535 2.85917 8.00016 3.17584C7.63385 2.84725 7.15892 2.66583 6.66683 2.66651H2.66683ZM7.3335 4.66651V11.3332C7.3335 11.51 7.26326 11.6796 7.13823 11.8046C7.01321 11.9296 6.84364 11.9998 6.66683 11.9998H2.66683V3.99984H6.66683C6.84364 3.99984 7.01321 4.07008 7.13823 4.1951C7.26326 4.32013 7.3335 4.48969 7.3335 4.66651ZM8.66683 11.3332V4.66651C8.66683 4.48969 8.73707 4.32013 8.86209 4.1951C8.98712 4.07008 9.15668 3.99984 9.3335 3.99984H13.3335V11.9998H9.3335C9.15668 11.9998 8.98712 11.9296 8.86209 11.8046C8.73707 11.6796 8.66683 11.51 8.66683 11.3332Z" fill="#1B74E3"></path></svg>
                                Learn more about filters
                            </a>
                        </div>
                        <div className='trigger_details'>Filter Details</div>
                        <div className='trigger_type_container'>
                            <div className='triggertype_text'>Select your Criteria</div>
                            <ActionSelect

                                options={options}
                                selectedOption={selectedOption}
                                onChange={handleChange}
                                styleProps={{
                                    width: "45%"
                                }}

                            />
                        </div>

                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
export default FilterPropertiesModal;