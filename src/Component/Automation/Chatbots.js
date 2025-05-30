import React, { useState } from 'react'
import { Modal, ModalBody } from 'react-bootstrap';
// import Catalog from '../Assets/img/Catalog.jpeg';
// import education from '../Assets/img/education.jpeg';
// import general from '../Assets/img/general.jpeg';
// import hospital from '../Assets/img/hospital.jpeg';
// import Ecommerce from '../Assets/img/Ecommerce.jpeg';
// import Realestate from '../Assets/img/Realestate.jpeg';
// import Restaurant from '../Assets/img/Restaurant.jpeg';
// import Finance from '../Assets/img/Finance.jpeg';
import DeleteModal from '../DeleteModal';
import CopyandAddModal from './PopupModal/Chatbot/CopyandAddModal';
import FlowTemplates from './PopupModal/Chatbot/FlowTemplates';
import NotificationModal from './PopupModal/Chatbot/NotificationModal';
import FallbackMessageModal from './PopupModal/Chatbot/FallbackMessageModal';
import ChatbotTimerModal from './PopupModal/Chatbot/ChatbotTimerModal';

import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Autocomplete, TextField } from '@mui/material';
const initialTableData = [
    {
        id: 1, name: 'catalog', triggered: 0, stepsFinished: 0, finished: 0, modifiedOn: ['created 8 months ago', 'updated 8 months ago']
    },
    {
        id: 2, name: 'ratings', triggered: 35, stepsFinished: 139, finished: 35, modifiedOn: ['created 24 months ago', 'updated 23 months ago']
    },
    {
        id: 3, name: 'cancel_order', triggered: 117, stepsFinished: 768, finished: 117, modifiedOn: ['created 25 months ago', 'updated 23 months ago']
    },
    {
        id: 4, name: 'reschedule_order', triggered: 17, stepsFinished: 86, finished: 17, modifiedOn: ['created 25 months ago', 'updated 23 months ago']
    },
    {
        id: 5, name: 'dispatch', triggered: 34, stepsFinished: 67, finished: 34, modifiedOn: ['created 25 months ago', 'updated 24 months ago']
    },
    {
        id: 6, name: 'payment_process', triggered: 154, stepsFinished: 909, finished: 154, modifiedOn: ['created 27 months ago', 'updated 23 months ago']
    },
    {
        id: 7, name: 'rides-flow', triggered: 333, stepsFinished: 1441, finished: 333, modifiedOn: ['created 27 months ago', 'updated 23 months ago']
    },
    {
        id: 8, name: 'soon_to_be_closed', triggered: 266, stepsFinished: 295, finished: 266, modifiedOn: ['created 34 months ago', 'updated 23 months ago']
    },
    {
        id: 9, name: 'Buy_EV_Market', triggered: 14, stepsFinished: 43, finished: 14, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 10, name: 'Sell_EV_market', triggered: 6, stepsFinished: 21, finished: 6, modifiedOn: ['created 34 months ago', 'updated 32 months ago']
    },
    {
        id: 11, name: 'EV Market', triggered: 35, stepsFinished: 130, finished: 35, modifiedOn: ['created 34 months ago', 'updated 23 months ago']
    },
    {
        id: 12, name: 'Receive_parcel(food)', triggered: 18, stepsFinished: 112, finished: 18, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 13, name: 'Book_for_someone_a_ride_now', triggered: 25, stepsFinished: 164, finished: 25, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 14, name: 'deliver_a_parcel_now', triggered: 22, stepsFinished: 117, finished: 22, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 15, name: 'Charge point operator', triggered: 8, stepsFinished: 54, finished: 8, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 16, name: 'Agent enrollment', triggered: 54, stepsFinished: 260, finished: 54, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 17, name: 'Investor', triggered: 25, stepsFinished: 115, finished: 25, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 18, name: 'Charging', triggered: 117, stepsFinished: 402, finished: 117, modifiedOn: ['created 34 months ago', 'updated 23 months ago']
    },
    {
        id: 19, name: 'Become a driver', triggered: 22, stepsFinished: 86, finished: 22, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 20, name: 'Charge point ownership', triggered: 12, stepsFinished: 63, finished: 12, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 21, name: 'Fleet_ownership', triggered: 10, stepsFinished: 42, finished: 10, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },
    {
        id: 22, name: 'Other_options', triggered: 540, stepsFinished: 1250, finished: 540, modifiedOn: ['created 34 months ago', 'updated 33 months ago']
    },

]
// const initialTemplateData = [
//     { id: 1, img: Catalog, title: 'Catalog', subTitle: 'Catalog checkout flow template' },
//     { id: 2, img: Restaurant, title: 'Restaurant', subTitle: 'Restaurant template' },
//     { id: 3, img: Realestate, title: 'Real Estate', subTitle: 'Real Estate template' },
//     { id: 4, img: hospital, title: 'Hospital Booking', subTitle: 'Hospital Booking template' },
//     { id: 5, img: hospital, title: 'Doctor Appointment', subTitle: 'Doctor Appointment template' },
//     { id: 6, img: general, title: 'General Appointment Booking', subTitle: "General Appointment Booking template" },
//     { id: 7, img: general, title: 'Feedback For Using WATI', subTitle: 'Feedback For Using WATI template' },
//     { id: 8, img: Finance, title: 'New Bank Account', subTitle: 'New Bank Account template' },
//     { id: 9, img: Finance, title: 'Insurance', subTitle: 'Insurance template' },
//     { id: 10, img: education, title: 'Kids Booking Class', subTitle: 'Kids Booking Class template' },
//     { id: 11, img: education, title: 'Education', subTitle: 'Education template' },
//     { id: 12, img: Ecommerce, title: 'Ecommerce', subTitle: 'Ecommerce template' }

// ]
// const DeleteModal = ({ show, onClose, onConfirm, msg }) => {
//     return (
//       <>
//         <Modal show={show} dialogClassName="keyword__delete__modal">
//           <div className='keyword__delete__content'>
//             <Modal.Header className='keyword__delete__header'>
//               <Modal.Title >Confirm</Modal.Title>
//             </Modal.Header>
//             <ModalBody className='keyword__body__deletecontent'>
//               <div class="delete__confirm__msg">{msg}</div>
//               <div class="keywordfooter__delete"><button target="_self" className='footer__cancel__btn delete__cancel__btn' onClick={onClose} >Cancel</button><button target="_self" className='delete__confirm__btn' onClick={onConfirm}>Yes</button></div>
//             </ModalBody>
//           </div>
//         </Modal>
//       </>
//     )
//   }
//   const CopyModal = ({ show,onClose,onSave}) => {
//     const [chatbotName, setChatbotName] = useState('');

//   const handleInputChange = (event) => {
//     setChatbotName(event.target.value);
//   };
//   const isDisabled = !chatbotName;
//     return (
//       <>
//         <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
//           <div className='keyword__delete__content copymodal_content'>
//             <Modal.Header className='keyword__delete__header' closeButton>
//               <Modal.Title >Add New Chatbot</Modal.Title>
//             </Modal.Header>
//             <ModalBody className='keyword__body__deletecontent'>
//               <div class="delete__confirm__msg">Chatbot Name</div>
//               <input type="text" placeholder="Chatbot Name" className='edit__text__input copymodal_text_input'
//               value={chatbotName}
//               onChange={handleInputChange} />
//               <div class="keywordfooter__delete"><button target="_self" className={`btn copy_btn ${isDisabled ? 'copy_disabled' : 'btn-success'}`} disabled={isDisabled} onClick={onSave} >Copy</button></div>
//             </ModalBody>
//           </div>
//         </Modal>
//       </>
//     )
//   }
//   const AddChatbotModal = ({ show,onClose,onSave}) => {
//     const [chatbotName, setChatbotName] = useState('');

//   const handleInputChange = (event) => {
//     setChatbotName(event.target.value);
//   };
//   const handleSave=()=>{
//     onSave(chatbotName);
//     setChatbotName('')
//   }
//   const isDisabled = !chatbotName;
//     return (
//       <>
//         <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
//           <div className='keyword__delete__content copymodal_content'>
//             <Modal.Header className='keyword__delete__header' closeButton>
//               <Modal.Title >Add New Chatbot</Modal.Title>
//             </Modal.Header>
//             <ModalBody className='keyword__body__deletecontent'>
//               <div class="delete__confirm__msg">Chatbot Name</div>
//               <input type="text" placeholder="Chatbot Name" className='edit__text__input copymodal_text_input'
//               value={chatbotName}
//               onChange={handleInputChange} />
//               <div class="keywordfooter__delete"><button target="_self" className={`btn copy_btn ${isDisabled ? 'copy_disabled' : 'btn-success'}`} disabled={isDisabled} onClick={handleSave} >Add</button></div>
//             </ModalBody>
//           </div>
//         </Modal>
//       </>
//     )
//   }
// const FlowTemplates = ({ handleNotificationModal, handleEditChatbotbutton, onSave }) => {
//     const options = ['All', 'Catalog', 'Restaurant', 'Real Estate', 'Hospital & Doctor', 'General', 'Finance', 'Education', 'Ecommerce']
//     const [content, setContent] = useState('All');
//     const [showAddChatbotModal, setShowAddChatbotModal] = useState(false);
//     const categoryMapping = {
//         'Hospital & Doctor': ['Hospital Booking', 'Doctor Appointment'],
//         'General': ['General Appointment Booking', 'Feedback For Using WATI'],
//         'Finance': ['New Bank Account', 'Insurance'],
//         'Education': ['Kids Booking Class', 'Education']
//     }
//     const filteredTemplates = content === 'All' ? initialTemplateData : content in categoryMapping ?
//         initialTemplateData.filter(template => categoryMapping[content].includes(template.title)) :
//         initialTemplateData.filter(template => template.title === content);

//     const filteredOptions = content === 'All' ? options : options.filter(option => option !== content)
//     const handleShowModal = () => {
//         setShowAddChatbotModal(true);
//     }
//     const handleCloseChatbotModal = () => {
//         setShowAddChatbotModal(false);
//     }

//     const handleSave = (chatbotName) => {
//         handleCloseChatbotModal();
//         handleEditChatbotbutton();
//         onSave(chatbotName);
//     };
//     return (
//         <>
//             <div className='chatbots_template_container'>
//                 <div className='template__header'>
//                     <div className='template_notice'>Choose one of our templates or build a bot from scratch</div>
//                     <div className='template__header_category'>
//                         <Autocomplete
//                             options={filteredOptions}
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="All"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: 'rgb(245, 246, 250)',
//                                             '&:hover': {
//                                                 border: '1px solid green',
//                                             },
//                                             '&.Mui-focused': {
//                                                 border: '1px solid green',
//                                                 backgroundColor: 'white',
//                                                 outline: 'none',
//                                             },
//                                         },
//                                     }}

//                                 />
//                             )}

//                         />
//                     </div>
//                 </div>
//                 <div className='grid__template__main__container'>
//                     <div className='grid__template__container'>
//                         <div className='grid_template_card' onClick={handleShowModal}>
//                             <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.0595 6.68788C21.9668 5.77071 26.0332 5.77071 29.9405 6.68788C35.2617 7.93695 39.483 11.929 41.0567 17.1153H6.94328C8.517 11.929 12.7383 7.93695 18.0595 6.68788Z" fill="#23A455"></path><path d="M6.40906 19.4144C5.78284 22.9062 5.87562 26.4942 6.6874 29.9574C8.01099 35.604 12.4168 40.013 18.0595 41.3375C19.6378 41.708 21.242 41.9288 22.8513 42V19.4144H6.40906Z" fill="#23A455"></path><path d="M25.1488 42C26.758 41.9288 28.3622 41.708 29.9405 41.3375C35.5832 40.013 39.989 35.604 41.3126 29.9574C42.1244 26.4942 42.2172 22.9062 41.5909 19.4144H25.1488V42Z" fill="#23A455"></path></svg>
//                             Start From Scratch
//                         </div>
//                     </div>
//                     {
//                         filteredTemplates.map((templatacard, index) => (
//                             <div key={index} className='grid__main_flowtemplate'>
//                                 <div>
//                                     <div className='template_image'><img className='template_cardimg' src={templatacard.img} /></div>
//                                     <h3 className='template__title'>{templatacard.title}</h3>
//                                     <p>{templatacard.subTitle}</p>
//                                 </div>
//                                 <div className='template__button'>
//                                     <button className='btn btn-success template_usebtn' onClick={handleNotificationModal}>Use this</button>
//                                 </div>
//                             </div>
//                         ))
//                     }

//                 </div>
//             </div>
//             <CopyandAddModal show={showAddChatbotModal} onClose={handleCloseChatbotModal} onSave={handleSave} placeholder="Chatbot Name"
//                 buttonLabel="Add" />
//         </>
//     )
// }

// const NotificationModal = ({ show, onClose, msg, value }) => {
//     return (
//         <>
//             <Modal show={show} onHide={onClose} dialogClassName="chatbot__notification__modal">
//                 <div className='chatbot__notification__content'>
//                     <Modal.Header className='chatbot__notification__header' closeButton>
//                         <Modal.Title >Notification</Modal.Title>
//                     </Modal.Header>
//                     <ModalBody className='chatbot__body__notificationcontent'>

//                         <div class="notification__msg">Chatbot limit :<b>{value}</b><div>{msg}</div></div>
//                         <div class="chatbotfoooter__delete"><button target="_self" className='btn btn-success' onClick={onClose} >Cancel</button></div>
//                     </ModalBody>
//                 </div>
//             </Modal>
//         </>
//     )
// }
// const FallbackMessageModal = ({ show, onClose, onSave }) => {
//     const options = [1, 2, 3];
//     const [value, setValue] = useState(2);
//     const [isChecked, setIsChecked] = useState(false);
//     const filteredOptions = options.filter(option => option !== value)

//     return (

//         <>
//             <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
//                 <div className='edit_text_material_content'>
//                     <Modal.Header className='edit_text_material_header' closeButton >
//                         <Modal.Title className='edit_text_style' >Fallback Message</Modal.Title>
//                     </Modal.Header>
//                     <ModalBody className='edittext__body__content'>
//                         <div className='fallback_checkbox__container'>
//                             <input type='checkbox' className='fallbackmsg_checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} /><label className='checkboxlabel'>Enable fallback message</label>
//                         </div>
//                         {
//                             isChecked &&
//                             <>
//                                 <div className='fallback_msg_container'>
//                                     <label className='fallback_message'>Set fallback message if no keyword is matched in the chatbot:</label>
//                                     <span className="text_field__counter">94/1024</span>
//                                     <textarea className='edit__text__textarea fallbackmsg__textarea'>Sorry, we don't quite understand what you mean, please select or input from the options below.</textarea>
//                                 </div>
//                                 <div className='fallback_time_container'>
//                                     <div>
//                                         <span className='fallback_timemsg'>Fallback message will be triggered up to</span>
//                                         <div className='fallback__dropdown'>
//                                             <Autocomplete
//                                                 options={filteredOptions}
//                                                 value={value}
//                                                 disableClearable
//                                                 onChange={(event, newValue) => setValue(newValue)}
//                                                 renderInput={(params) => (
//                                                     <TextField
//                                                         {...params}
//                                                         variant="standard"
//                                                         placeholder=""
//                                                         InputProps={{
//                                                             ...params.InputProps,
//                                                             disableUnderline: true,
//                                                             sx: {
//                                                                 border: '1px solid rgb(232, 234, 242)',
//                                                                 borderRadius: '4px',
//                                                                 height: '3rem',
//                                                                 paddingLeft: '10px',
//                                                                 backgroundColor: 'rgb(245, 246, 250)',
//                                                                 '&:hover': {
//                                                                     border: '1px solid green',
//                                                                 },
//                                                                 '&.Mui-focused': {
//                                                                     border: '1px solid green',
//                                                                     backgroundColor: 'white',
//                                                                     outline: 'none',
//                                                                 },
//                                                             },
//                                                         }}

//                                                     />
//                                                 )}

//                                             />
//                                         </div>
//                                         <span className='fallback_timemsg'>times before chatbot ends.</span>
//                                     </div></div>
//                             </>
//                         }


//                         <div className='edit__text__save'>
//                             <button className='btn btn-success' onClick={onSave} >Save</button>
//                         </div>
//                     </ModalBody>
//                 </div>
//             </Modal>
//         </>

//     )
// }
// const ChatbotTimerModal = ({ show, onClose, onSave }) => {
//     const [isChecked, setIsChecked] = useState(false);

//     return (

//         <>
//             <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
//                 <div className='edit_text_material_content'>
//                     <Modal.Header className='edit_text_material_header' closeButton >
//                         <Modal.Title className='edit_text_style' >Chatbot Timer Settings</Modal.Title>
//                     </Modal.Header>
//                     <ModalBody className='edittext__body__content'>
//                         <div className='chatbot_time_container'>
//                             <div>
//                                 <span className='chatbot_timemsg'>If user does not reply more than</span>
//                                 <input type='text' value='10' className='Timer__input' />
//                                 <span className='chatbot_timemsg'>minutes, the chatbot will end automatically.</span>
//                             </div>
//                         </div>
//                         <div className='chatbot_checkbox__container'>
//                             <input type='checkbox' className='chatbotmsg_checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} /><label className='checkboxlabel'>Enable fallback message</label>
//                         </div>
//                         {
//                             isChecked &&
//                             <>
//                                 <div className='chatbot_msg_container'>
//                                     <label className='chatbot_message'>Exit chatbot notification:</label>
//                                     <span className="text_field__counter">1/1024</span>
//                                     <textarea className='edit__text__textarea chatbotmsg__textarea'>2</textarea>
//                                 </div>
//                                 <div className='chatbot_time_container'>
//                                     <div>
//                                         <span className='chatbot_timemsg'>This exit chatbot notification will show</span>
//                                         <input type='text' value='5' className='Timer__input' />
//                                         <span className='chatbot_timemsg'>minutes before the chatbot ends.</span>
//                                     </div>
//                                 </div>
//                             </>
//                         }


//                         <div className='edit__text__save'>
//                             <button className='btn btn-success' onClick={onSave} >Save</button>
//                         </div>
//                     </ModalBody>
//                 </div>
//             </Modal>
//         </>

//     )
// }
const Chatbots = ({ handleEditChatbotbutton, onSave }) => {
    //flow builder --> initial chatbots loading
    const [chatbotData, setChatbotData] = useState(initialTableData);
    const [searchChatbots, setSearchChatbots] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, SetRowsPerPage] = useState(5);
    const [isOpenFallbackMessage, setIsOpenFallbackMessage] = useState(false);
    const [isOpenChatbotTimer, setIsOpenChatbotTimer] = useState(false);
    const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
    const [rowIndexToDelete, setRowIndexToDelete] = useState(null);
    const [isOpenCopyModal, setIsOpenCopyModal] = useState(false);
    // flow templates --> add chatbot
    const [isOpenTemplatePage, setIsOpenTemplatePage] = useState(false);
    const [isOpenNotificationModal, setIsOpenNotificationModal] = useState(false);

    //handle pagination and filter
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }
    const handleChangeRowPerPage = (event) => {
        SetRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }
    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1)
        }
    }
    const handleNextPage = () => {
        if (page < Math.ceil(chatbotData.length / rowsPerPage) - 1) {
            setPage(prev => prev + 1)
        }
    }
    const filterChatbots = chatbotData.filter(row =>
        row.name.toLowerCase().includes(searchChatbots.toLowerCase())
    );
    const paginatedChatbotsData = filterChatbots.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    //addchatbot --> template
    const handleTemplatePage = () => {
        setIsOpenTemplatePage(true);
    }
    const handleNotificationModal = () => {
        setIsOpenNotificationModal(true);
        setIsOpenTemplatePage(false);
    }
    const handleCloseNotificationModal = () => {
        setIsOpenNotificationModal(false);

    }
    const handleFallbackMessage = () => {
        setIsOpenFallbackMessage(true);
    }
    const handleCloseFallbackMessage = () => {
        setIsOpenFallbackMessage(false);
    }
    const handleSaveFallbackMessage = () => {
        setIsOpenFallbackMessage(false);
    }
    const handleChatbotTimer = () => {
        setIsOpenChatbotTimer(true);
    }
    const handleCloseChatbotTimer = () => {
        setIsOpenChatbotTimer(false);
    }
    const handleSaveChatbotTimer = () => {
        setIsOpenChatbotTimer(false);
    }
    const handleDeleteCloseModal = () => {
        setRowIndexToDelete(null);
        setOpenDeleteModal(false);
    }
    const handleDeleteOpenModal = (index) => {
        setRowIndexToDelete(index)
        setOpenDeleteModal(true);
    }
    const handleDeleteConfirm = () => {
        if (rowIndexToDelete !== null) {
            setChatbotData(prev => prev.filter((_, index) => index !== rowIndexToDelete))
        }
        handleDeleteCloseModal();
    }
    const handleOpenCopyModal = () => {
        setIsOpenCopyModal(true);
    }
    const handleCloseCopy = () => {
        setIsOpenCopyModal(false);
    }
    const handleSaveCopy = () => {
        setIsOpenCopyModal(false);
        setIsOpenNotificationModal(true);
    }
    const handleSave = (chatbotName) => {

        onSave(chatbotName);

    };
    return (
        <>
            {
                isOpenDeleteModal && (<DeleteModal show={isOpenDeleteModal} onClose={handleDeleteCloseModal}
                    onConfirm={handleDeleteConfirm} msg='Do you want to remove this chatbot?' />)
            }
            {
                isOpenNotificationModal &&
                <NotificationModal show={isOpenNotificationModal} msg='The limit on chatbots is reached and the chatbot cannot be created.' value='20' onClose={handleCloseNotificationModal} />
            }
            {
                isOpenFallbackMessage &&
                <FallbackMessageModal show={isOpenFallbackMessage} onClose={handleCloseFallbackMessage} onSave={handleSaveFallbackMessage} />
            }
            {
                isOpenChatbotTimer &&
                <ChatbotTimerModal show={isOpenChatbotTimer} onClose={handleCloseChatbotTimer} onSave={handleSaveChatbotTimer} />
            }
            {
                isOpenCopyModal &&
                <CopyandAddModal show={isOpenCopyModal} onClose={handleCloseCopy} onSave={handleSaveCopy}
                    placeholder="Chatbot Name"
                    buttonLabel="Copy" />
            }
            {
                isOpenTemplatePage ?
                    <FlowTemplates handleNotificationModal={handleNotificationModal} handleEditChatbotbutton={handleEditChatbotbutton} onSave={handleSave} /> :

                    <div className='chatbots_container'>
                        <div className='chatbots_header'>
                            <h3 class="header__title">Chatbots<p class="header__title_count">(22/20)</p></h3>
                            <div className='header__search'>
                                <div className='search__input'>
                                    <div className='input__wrap'>
                                        <input placeholder="Search..." value={searchChatbots} onChange={(e) => setSearchChatbots(e.target.value)} />
                                        <div tabindex="0" class="header__search__icon"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                                    </div>
                                </div>
                            </div>
                            <a href="https://www.youtube.com/watch?v=zNCNTsGDbXM" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>
                            <button className='chatbot_header_btn ' onClick={handleFallbackMessage} >Fallback Message</button>
                            <button className='chatbot_header_btn ' onClick={handleChatbotTimer} >Chatbot Timer</button>
                            <button className='header_import_btn'><svg className="importicon" viewBox="-0.5 -3.2 16 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z" fill="#666666"></path></svg></button>
                            <button className='btn btn-success chatbot_header_btn' onClick={handleTemplatePage} >Add Chatbot</button>
                        </div>
                        <div className='chatbots__body__content'>
                            <div className='chatbots__list__table'>
                                <Table className='chatbots__table'>
                                    <TableHead className='chatbotstable__head'>
                                        <TableRow className='chatbotstable__row'>
                                            <TableCell className='chatbotstable__cell alignleft firstcell' style={{ width: '25%' }}>Name</TableCell>
                                            <TableCell className='chatbotstable__cell' style={{ width: '200px' }}>Triggered</TableCell>
                                            <TableCell className='chatbotstable__cell alignleft' style={{ width: '200px' }}>Steps Finished</TableCell>
                                            <TableCell className='chatbotstable__cell alignleft' style={{ width: '200px' }}>Finished</TableCell>
                                            <TableCell className='chatbotstable__cell alignleft' style={{ width: '200px' }}>Modified on</TableCell>
                                            <TableCell className='chatbotstable__cell lastcell' style={{ width: '200px' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='chatbots__table__body'>
                                        {
                                            paginatedChatbotsData.map((row, index) => (
                                                <TableRow key={index} className='keyword__body__row'>
                                                    <TableCell className='chatbots__body__cell body_first_cell'>

                                                        <div className='chatbots_name_fieldcontainer'>
                                                            <div className='chatbots_name_field'>{row.name}</div>
                                                        </div>

                                                    </TableCell>
                                                    <TableCell className='chatbots__body__cell trigger_text'>{row.triggered}</TableCell>
                                                    <TableCell className='chatbots__body__cell trigger_text'>{row.stepsFinished}</TableCell>
                                                    <TableCell className='chatbots__body__cell trigger_text'>{row.finished}</TableCell>
                                                    <TableCell className='chatbots__body__cell'>
                                                        {
                                                            row.modifiedOn.map((modifiedon, idx) => (
                                                                <div key={idx} className='modified__text'>{modifiedon}</div>
                                                            ))
                                                        }
                                                    </TableCell>
                                                    <TableCell className='chatbots__body__cell chatbotactions'>
                                                        <button aria-label="copy" className='cell__copy' onClick={handleOpenCopyModal}><svg className='copysvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.66406 3.33341V13.3334C6.66406 13.7754 6.83966 14.1994 7.15222 14.5119C7.46478 14.8245 7.8887 15.0001 8.33073 15.0001H14.9974C15.4394 15.0001 15.8633 14.8245 16.1759 14.5119C16.4885 14.1994 16.6641 13.7754 16.6641 13.3334V6.03508C16.664 5.81305 16.6196 5.59326 16.5335 5.38862C16.4473 5.18398 16.3212 4.99862 16.1624 4.84341L13.3999 2.14175C13.0885 1.8373 12.6704 1.6668 12.2349 1.66675H8.33073C7.8887 1.66675 7.46478 1.84234 7.15222 2.1549C6.83966 2.46746 6.66406 2.89139 6.66406 3.33341V3.33341Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.332 15.0002V16.6668C13.332 17.1089 13.1564 17.5328 12.8439 17.8453C12.5313 18.1579 12.1074 18.3335 11.6654 18.3335H4.9987C4.55667 18.3335 4.13275 18.1579 3.82019 17.8453C3.50763 17.5328 3.33203 17.1089 3.33203 16.6668V7.50016C3.33203 7.05814 3.50763 6.63421 3.82019 6.32165C4.13275 6.00909 4.55667 5.8335 4.9987 5.8335H6.66536" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
                                                        <button aria-label="edit" className='cell__edit'><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                                        <button aria-label="delete" className='cell__delete' onClick={() => handleDeleteOpenModal(index)}><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>

                            </div>
                            <div className='chatbots__pagination'>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 100]}
                                    component='div'
                                    count={filterChatbots.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowPerPage}
                                    ActionsComponent={() => (
                                        <div className='tablepagination__action'>
                                            {/* Previous Button */}
                                            <div>
                                                <p onClick={handlePreviousPage} aria-label="Go to previous page" title="Go to previous page">
                                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                                    </svg>
                                                    <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                                </p>
                                            </div>

                                            {/* Next Button */}
                                            <div>
                                                <p onClick={handleNextPage} aria-label="Go to next page" title="Go to next page">
                                                    <span className="pagination_previousnextcont" >Next</span>
                                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                                    </svg>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    sx={{
                                        '.MuiTablePagination-displayedRows': {
                                            fontSize: '1.2rem',
                                            margin: '0px',
                                            color: 'rgb(51, 51, 51)'
                                        },
                                        '.MuiSelect-nativeInput': {
                                            padding: '0px 1rem',
                                            height: '3rem',
                                            margin: '0 0 8px 0px',
                                        },
                                        '.MuiInputBase-root': {
                                            fontSize: '1.2rem',
                                            paddingRight: '0',
                                        },
                                        '.MuiTablePagination-selectLabel': {
                                            fontSize: '1.2rem',
                                            margin: '0px',
                                            color: 'rgb(51, 51, 51)',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Chatbots;