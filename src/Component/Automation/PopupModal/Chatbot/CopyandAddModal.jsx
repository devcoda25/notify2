import React,{useState,useEffect} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import ButtonComponent from "../../../ButtonComponent";
import TextfieldComponent from "../../../TextfieldComponent";

// const CopyModal = ({ show, onClose, onSave }) => {
//     const [chatbotName, setChatbotName] = useState('');

//     const handleInputChange = (event) => {
//         setChatbotName(event.target.value);
//     };
//     const isDisabled = !chatbotName;
//     return (
//         <>
//             <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
//                 <div className='keyword__delete__content copymodal_content'>
//                     <Modal.Header className='keyword__delete__header' closeButton>
//                         <Modal.Title >Add New Chatbot</Modal.Title>
//                     </Modal.Header>
//                     <ModalBody className='keyword__body__deletecontent'>
//                         <div class="delete__confirm__msg">Chatbot Name</div>
//                         <TextfieldComponent type='text' placeholder="Chatbot Name" value={chatbotName} onChange={handleInputChange} customStyle='custom_textfield' />
                        
//                         <div class="keywordfooter__delete">
//                             <ButtonComponent
//                                 label='Copy'
//                                 onClick={onSave}
//                                 disabled={isDisabled}
//                                 customBtn={isDisabled && 'copy_disabled'}
//                             />

//                         </div>

//                     </ModalBody>
//                 </div>
//             </Modal>
//         </>
//     )
// }
// export default CopyModal;



const CopyandAddModal = ({
  show,
  onClose,
  onSave,
  placeholder,
  buttonLabel,
  initialValue = ''
}) => {
  const [chatbotName, setChatbotName] = useState(initialValue);

  useEffect(() => {
    if (!show) {
      setChatbotName('');
    }
  }, [show]);

  const handleInputChange = (event) => {
    setChatbotName(event.target.value);
  };

  const handleSave = () => {
    onSave(chatbotName);
    setChatbotName('');
  };

  const isDisabled = !chatbotName;

  return (
    <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
      <div className='keyword__delete__content copymodal_content'>
        <Modal.Header className='keyword__delete__header' closeButton>
          <Modal.Title>Add New Chatbot</Modal.Title>
        </Modal.Header>
        <ModalBody className='keyword__body__deletecontent'>
          <div className="delete__confirm__msg">{placeholder}</div>
          <TextfieldComponent type='text' placeholder={placeholder} value={chatbotName} onChange={handleInputChange} customStyle='custom_textfield' />
          <div class="keywordfooter__delete">
                           <ButtonComponent
                                label={buttonLabel}
                                onClick={handleSave}
                                disabled={isDisabled}
                                customBtn={isDisabled && 'copy_disabled'}
                            />

                        </div>
         
        </ModalBody>
      </div>
    </Modal>
  );
};

export default CopyandAddModal;
