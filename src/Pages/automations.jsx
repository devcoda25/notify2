import React, { useEffect, useState, useRef, useCallback } from 'react'
import DefaultAction from '../../src/Component/Automation/DefaultAction';
import KeywordAction from '../Component/Automation/KeywordAction';
import Replymaterial from '../../src/Component/Automation/Replymaterial';
import Routing from '../../src/Component/Automation/Routing';
import Rules from '../../src/Component/Automation/Rules';
import Sequence from '../../src/Component/Automation/Sequence';
import Chatbots from '../../src/Component/Automation/Chatbots';
import Whatsappflows from '../../src/Component/Automation/Whatsappflows';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import MovieIcon from '@mui/icons-material/Movie';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Autocomplete, TextField, Switch, Chip } from '@mui/material';
import { Button, Modal, ModalBody } from 'react-bootstrap';
import EditChatbotPage from '../Component/Automation/Chatbots/EditChatbotPage';

// import ReactFlow, { useNodesState, Position, ConnectionMode, ConnectionLineType, Handle, useEdgesState, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer';
// const emojis = [
//     "😀", "😁", "😂", "😃", "😉", "😋", "😎", "😍", "😗", "🤗",
//     "🤔", "😣", "😫", "😴", "😌", "🤓", "😛", "😜", "😠", "😇",
//     "😷", "😈", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
//     "🙈", "🙉", "🙊", "👼", "👮", "🕵", "💂", "👳", "🎅", "👸",
//     "👰", "👲", "🙍", "🙇", "🚶", "🏃", "💃", "⛷", "🏂", "🏌",
//     "🏄", "🚣", "🏊", "⛹", "🏋", "🚴", "👫", "💪", "👈", "👉",
//     "👆", "🖕", "👇", "🖖", "🤘", "🖐", "👌", "👍", "👎", "✊",
//     "👊", "👏", "🙌", "🙏", "🐵", "🐶", "🐇", "🐥", "🐸", "🐌",
//     "🐛", "🐜", "🐝", "🍉", "🍄", "🍔", "🍤", "🍨", "🍪", "🎂",
//     "🍰", "🍾", "🍷", "🍸", "🍺", "🌍", "🚑", "⏰", "🌙", "🌝",
//     "🌞", "⭐", "🌟", "🌠", "🌨", "🌩", "⛄", "🔥", "🎄", "🎈",
//     "🎉", "🎊", "🎁", "🎗", "🏀", "🏈", "🎲", "🔇", "🔈", "📣",
//     "🔔", "🎵", "🎷", "💰", "🖊", "📅", "✅", "❎", "💯"
// ];
// const EditNavContent = ({ svg, title, subtitle, backgroundColor, background, onClick }) => {
//     return (
//         <>
//             <div className='navitem' style={{ backgroundColor }} onClick={onClick}>
//                 <div className='navitem_image' style={{ backgroundColor: background }}>
//                     <span>{svg}</span>
//                 </div>
//                 <div className='nav_content'>
//                     <div className='nav_title'>{title}</div>
//                     <div className='nav_subtitle'>{subtitle}</div>
//                 </div>
//             </div>
//         </>
//     )
// }
// const OperationItemContent = ({ img, text, onClick }) => {
//     return (
//         <>
//             <div className='operation_item' onClick={onClick}>
//                 <div className='operation_item_image'>
//                     {img}
//                 </div>
//                 <div className='operation_item_text'>
//                     {text}
//                 </div>
//             </div>
//         </>
//     )
// }


// const Card = ({ title, onTitleClick, content, width, height, headerBackgroundColor, titleColor, borderColor, onDelete, onCopy, showEditButton }) => {
//     const [isMenuVisible, setMenuVisible] = useState(false);
//     const [isShowStartNode, setIsShowStartNode] = useState(false);
//     const menuRef = useRef(null);
//     const toggleMenu = (e) => {
//         e.stopPropagation();
//         setMenuVisible((prev) => !prev);
//     };
//     const handleClickOutside = (event) => {
//         if (menuRef.current && !menuRef.current.contains(event.target)) {
//             setMenuVisible(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//     const handleCopyClick = (e) => {
//         e.stopPropagation();
//         onCopy();
//         setMenuVisible(false);
//     };
//     const handleEditClick = () => {
//         onTitleClick();
//         setMenuVisible(false)
//     }
//     const handleStartNodeClick = (e) => {
//         e.stopPropagation();
//         setMenuVisible(false);
//         setIsShowStartNode(!isShowStartNode);
//     }
//     return (
//         <>
//             {isShowStartNode && (
//                 <div className='nodestart'>Starting Step</div>
//             )}
//             <div className="chatbot_card" style={{
//                 border: borderColor,
//                 minHeight: height,
//                 width: width
//             }}

//                 onClick={() => {

//                     if (typeof onTitleClick === 'function') {
//                         onTitleClick();
//                     }
//                 }}>

//                 <div className='chatbot_card_header' style={{ backgroundColor: headerBackgroundColor }}>
//                     <span className='chatbot_card_title' style={{ color: titleColor }} >{title}</span>
//                     <button className='chatbot_menu_button' onClick={toggleMenu}>
//                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17C10.9 17 10 17.9 10 19Z" fill={titleColor}></path><path d="M10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5Z" fill={titleColor}></path><path d="M10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12Z" fill={titleColor}></path></svg>
//                     </button>
//                 </div>
//                 <div className='message_list' >
//                     {content}
//                 </div>
//                 {isMenuVisible && (
//                     <div ref={menuRef} className='chatbotcard_menu_container'>
//                         {showEditButton &&
//                             <div className='chatbot_card_menu_itemconainer' onClick={handleEditClick} >
//                                 <svg className='chatbotmenu_item_icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg>
//                                 Edit
//                             </div>
//                         }
//                         <div className='chatbot_card_menu_itemconainer' onClick={handleCopyClick}>
//                             <svg className='chatbotmenu_item_icon' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.80745 11.2459C6.47571 9.8316 6.47571 8.35976 6.80745 6.9455C7.2668 4.98721 8.79585 3.45816 10.7541 2.9988C12.1684 2.66707 13.6402 2.66707 15.0545 2.9988C17.0128 3.45816 18.5418 4.98721 19.0012 6.94551C19.3329 8.35976 19.3329 9.8316 19.0012 11.2459C18.5418 13.2041 17.0128 14.7332 15.0545 15.1926C13.6402 15.5243 12.1684 15.5243 10.7541 15.1926M6.80745 11.2459C7.2668 13.2041 8.79586 14.7332 10.7541 15.1926M6.80745 11.2459C6.59857 10.3554 6.52121 9.44208 6.57537 8.53469C6.49878 8.55032 6.42237 8.56708 6.34615 8.58496C4.66761 8.97869 3.35699 10.2893 2.96326 11.9678C2.67891 13.1801 2.67891 14.4416 2.96326 15.6539C3.35699 17.3324 4.66761 18.643 6.34615 19.0367C7.55837 19.3211 8.81994 19.3211 10.0322 19.0367C11.7107 18.643 13.0213 17.3324 13.415 15.6539C13.4329 15.5776 13.4497 15.5012 13.4653 15.4246C12.5579 15.4788 11.6446 15.4014 10.7541 15.1926" stroke="#666666" stroke-width="1.5"></path></svg>
//                             Copy </div>
//                         <div className='chatbot_card_menu_itemconainer' onClick={(e) => {
//                             e.stopPropagation();
//                             onDelete();
//                         }}
//                         >
//                             <svg className='chatbotmenu_item_icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
//                             Delete
//                         </div>
//                         <div className='chatbot_card_menu_itemconainer' onClick={handleStartNodeClick}>
//                             <svg className='chatbotmenu_item_icon' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 13.2565H14.8417C16.1394 13.2565 16.9326 11.7088 16.2489 10.5108L15.8001 9.72448C15.3584 8.95063 15.3584 7.97186 15.8001 7.19801L16.2489 6.41165C16.9326 5.21373 16.1394 3.66602 14.8417 3.66602L5.5 3.66602L5.5 13.2565ZM5.5 13.2565L5.5 18.3327" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
//                             {isShowStartNode ? 'Unset Start Node' : 'Set Start Node'} </div>
//                     </div>
//                 )}

//             </div>
//         </>
//     );
// };

// const EditChatNameModal = ({ show, onClose, onSave, initialName }) => {
//     const [chatbotName, setChatbotName] = useState('');

//     useEffect(() => {
//         setChatbotName(initialName);
//     }, [initialName]);

//     const handleInputChange = (event) => {
//         setChatbotName(event.target.value);
//     };

//     const isDisabled = !chatbotName;

//     const handleSave = () => {
//         onSave(chatbotName);
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="keyword__delete__modal">
//             <div className='keyword__delete__content copymodal_content'>
//                 <Modal.Header className='keyword__delete__header' closeButton>
//                     <Modal.Title>Edit Chatbot</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='keyword__body__deletecontent'>
//                     <div className="delete__confirm__msg">Chatbot Name</div>
//                     <input
//                         type="text"
//                         placeholder="Chatbot Name"
//                         className='edit__text__input copymodal_text_input'
//                         value={chatbotName}
//                         onChange={handleInputChange}
//                     />
//                     <div className="keywordfooter__delete">
//                         <button
//                             className={`btn copy_btn ${isDisabled ? 'copy_disabled' : 'btn-success'}`}
//                             disabled={isDisabled}
//                             onClick={handleSave}
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };

// const MessageOption = () => {
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [textBoxVisibility, setTextBoxVisibility] = useState([]);
//     const [showTextbox, setShowTextbox] = useState(false);
//     const [inputValue, setInputValue] = useState('');
//     const [imageInputValue, setImageInputValue] = useState('');
//     const [isQuestionVisible, setIsQuestionVisible] = useState(false);
//     const [isImageBoxVisible, setImageBoxVisible] = useState(false);
//     const [showImageInput, setShowImageInput] = useState(true);
//     const [showImageContainer, setShowImageContainer] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imageContainers, setImageContainers] = useState([]);
//     const [videoContainers, setVideoContainers] = useState([]);
//     const [audioContainers, setAudioContainers] = useState([]);
//     const [documentContainers, setDocumentContainers] = useState([]);
//     const [isVisible, setIsVisible] = useState(false);
//     const [isVariablesVisible, setIsVariablesVisible] = useState(false);
//     const [isImageEmojiVisible, setIsImageEmojiVisible] = useState(false);
//     const [isImageVariablesVisible, setIsImageVariablesVisible] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const questionRef = useRef(null);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const activeInputRef = useRef(null);
//     const containerRef = useRef(null);
//     const handleInteraction = (e) => {
//         e.stopPropagation();

//     };


//     const formatText = (command) => {
//         document.execCommand(command, false, null);
//     };
//     const applyCurlyFormatting = (index) => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const selectedText = range.toString();
//             if (selectedText) {
//                 const curlyText = `{${selectedText}}`;
//                 const textNode = document.createTextNode(curlyText);
//                 range.deleteContents();
//                 range.insertNode(textNode);
//                 selection.removeAllRanges();

//                 // Save curly-formatted text in state
//                 setTextBoxVisibility((prev) => {
//                     const newVisibility = [...prev];
//                     newVisibility[index].text = curlyText; // Save curly-formatted text
//                     return newVisibility;
//                 });
//             }
//         }
//     };


//     // const handleMessageClick = () => {
//     //     // setShowTextbox(true);
//     //     setTextBoxVisibility((prev) => [...prev, { showTextContainer: true, isQuestionVisible: false }]);
//     // };
//     const handleMessageClick = () => {
//         setTextBoxVisibility((prev) => [
//             ...prev,
//             { showTextContainer: true, isQuestionVisible: false, text: '' }
//         ]);
//     };
//     // const handleInputClick = (index) => {
//     //     setTextBoxVisibility((prev) => {
//     //         const newVisibility = [...prev];


//     //         if (currentIndex === index) {
//     //             newVisibility[index].isQuestionVisible = !newVisibility[index].isQuestionVisible;
//     //             newVisibility[index].showTextContainer = !newVisibility[index].isQuestionVisible; // Toggle showTextContainer
//     //         } else {
//     //             // Hide the previously opened question and show the text container
//     //             if (currentIndex !== null) {
//     //                 newVisibility[currentIndex].isQuestionVisible = false; // Hide previous question
//     //                 newVisibility[currentIndex].showTextContainer = true; // Show previous text container
//     //             }

//     //             newVisibility[index].isQuestionVisible = true;
//     //             newVisibility[index].showTextContainer = false;
//     //             setCurrentIndex(index); // Update currentIndex to the new index
//     //         }

//     //         return newVisibility;
//     //     });
//     //     // setShowTextbox(false);
//     //     // setIsQuestionVisible(true);
//     //     setImageBoxVisible(false);
//     //     setShowImageInput(true);
//     // };
//     const handleInputClick = (index) => {
//         setTextBoxVisibility((prev) => {
//             const newVisibility = [...prev];
//             if (currentIndex === index) {
//                 newVisibility[index].isQuestionVisible = !newVisibility[index].isQuestionVisible;
//                 newVisibility[index].showTextContainer = !newVisibility[index].isQuestionVisible;
//             } else {
//                 if (currentIndex !== null) {
//                     newVisibility[currentIndex].isQuestionVisible = false;
//                     newVisibility[currentIndex].showTextContainer = true;
//                 }
//                 newVisibility[index].isQuestionVisible = true;
//                 newVisibility[index].showTextContainer = false;
//                 setCurrentIndex(index);
//             }
//             return newVisibility;
//         });
//     };
//     const handleBlur = (index, e) => {
//         const newText = e.currentTarget.innerHTML; // Capture formatted HTML
//         setTextBoxVisibility((prev) => {
//             const newVisibility = [...prev];
//             newVisibility[index].text = newText; // Update text with HTML content on blur
//             return newVisibility;
//         });
//     };

//     const handleImageInputClick = () => {
//         setImageBoxVisible(true);
//         setShowImageInput(false);
//         setShowTextbox(true);
//         setIsQuestionVisible(false);
//     }
//     const toggleVariablesDropdown = () => {
//         setIsVariablesVisible((prev) => !prev);
//         setIsVisible(false);
//     };
//     const toggleImageVariableDropdown = () => {
//         setIsImageVariablesVisible((prev) => !prev);
//     }

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleEmojiPicker = () => {
//         setIsVisible((prev) => !prev);
//         setIsVariablesVisible(false);
//     };
//     const toggleImageEmojiPicker = () => {
//         setIsImageEmojiVisible((prev) => !prev);
//     }
//     // const handleEmojiClick = (emoji) => {
//     //     setInputValue(prev => prev + emoji);
//     //     setIsVisible(false);
//     // };
//     const handleEmojiClick = (emoji) => {
//         if (activeInputRef.current) {
//             const currentHTML = activeInputRef.current.innerHTML;
//             activeInputRef.current.innerHTML = currentHTML + emoji;
//             handleBlur(currentIndex, { currentTarget: activeInputRef.current }); // Update state with new HTML content
//         }
//         setIsVisible(false);
//     };
//     const handleImageEmojiClick = (emoji) => {
//         setImageInputValue(prev => prev + emoji);
//         setIsImageEmojiVisible(false);
//     }
//     const handleVariableClick = (variable) => {
//         if (activeInputRef.current) {
//             const currentHTML = activeInputRef.current.innerHTML;
//             activeInputRef.current.innerHTML = currentHTML + variable.value;
//             handleBlur(currentIndex, { currentTarget: activeInputRef.current }); // Update state with new HTML content
//         }
//         // setInputValue(prev => prev + variable.value);
//         setIsVariablesVisible(false);
//     };
//     const handleImageVariableClick = (variable) => {
//         setImageInputValue(prev => prev + variable.value);
//         setIsImageVariablesVisible(false);
//     }
//     const handleMessageDelete = (index) => {
//         //setShowTextbox(false);
//         setTextBoxVisibility((prev) => prev.filter((_, i) => i !== index));

//         if (currentIndex === index) {
//             setCurrentIndex(null);
//         }

//     }

//     const handleImageDelete = (index) => {
//         // setShowImageContainer(false);
//         setImageContainers(prev => prev.filter((_, i) => i !== index));
//     }

//     const handleImageUpload = (event, index) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImageContainers(prev => {
//                     const newContainers = [...prev];
//                     newContainers[index] = reader.result;
//                     return newContainers;
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     //video
//     const handleImageClick = () => {
//         setImageContainers(prev => [...prev, null]);
//     }
//     const handleVideoClick = () => {
//         setVideoContainers(prev => [...prev, null]);
//     };

//     const handleVideoUpload = (event, index) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setVideoContainers(prev => {
//                     const newContainers = [...prev];
//                     newContainers[index] = reader.result; // Update specific container
//                     return newContainers;
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleVideoDelete = (index) => {
//         setVideoContainers(prev => prev.filter((_, i) => i !== index));
//     };

//     //Audio
//     const handleAudioClick = () => {
//         setAudioContainers(prev => [...prev, null]);
//     };
//     const handleAudioUpload = (event, index) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setAudioContainers(prev => {
//                     const newContainers = [...prev];
//                     newContainers[index] = reader.result;
//                     return newContainers;
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };
//     const handleAudioDelete = (index) => {
//         setAudioContainers(prev => prev.filter((_, i) => i !== index));
//     };

//     //Document
//     const handleDocumentClick = () => {
//         setDocumentContainers(prev => [...prev, { file: null, name: '' }]);
//     };
//     const handleDocumentUpload = (event, index) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setDocumentContainers(prev => {
//                     const newContainers = [...prev];
//                     newContainers[index] = { file: reader.result, name: file.name };
//                     return newContainers;
//                 });
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDocumentDelete = (index) => {
//         setDocumentContainers(prev => prev.filter((_, i) => i !== index));
//     };

//     // prevent the drag and drop functionality inside the inputbox
//     useEffect(() => {
//         // Function to prevent any movement inside the container
//         const preventDrag = (e) => {
//             if (questionRef.current && questionRef.current.contains(e.target)) {
//                 e.stopPropagation();
//             }
//         };


//         // Attach listeners
//         document.addEventListener('mousemove', preventDrag, true);
//         document.addEventListener('mousedown', preventDrag, true);
//         document.addEventListener('mouseup', preventDrag, true);

//         // Cleanup function to remove listeners on component unmount
//         return () => {
//             document.removeEventListener('mousemove', preventDrag, true);
//             document.removeEventListener('mousedown', preventDrag, true);
//             document.removeEventListener('mouseup', preventDrag, true);

//         };
//     }, []);

//     // Close the question text container if the user clicks outside of it
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (containerRef.current && !containerRef.current.contains(event.target)) {
//                 // Close question and show text container
//                 if (currentIndex !== null) {
//                     setTextBoxVisibility((prev) => {
//                         const newVisibility = [...prev];
//                         newVisibility[currentIndex].isQuestionVisible = false;
//                         newVisibility[currentIndex].showTextContainer = true;
//                         return newVisibility;
//                     });
//                 }
//             }
//         };

//         // Add event listener to detect clicks outside
//         document.addEventListener('mousedown', handleClickOutside);

//         // Cleanup event listener on unmount
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [currentIndex]);
//     return (
//         <>
//             {textBoxVisibility.map((item, index) => (
//                 <>
//                     {item.showTextContainer && (
//                         <>
//                             <div style={{ position: 'relative' }} >

//                                 <div
//                                     className='edit__text__input message_input_box'
//                                     contentEditable={false} // Prevent editing in `showTextContainer`
//                                     dangerouslySetInnerHTML={{ __html: item.text }} // Render stored HTML
//                                     onClick={() => handleInputClick(index)}
//                                     style={{ height: '35px' }}
//                                 ></div>

//                                 <button className='message_delete_icon' style={{ top: '0%' }} onClick={() => handleMessageDelete(index)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                             </div>

//                         </>
//                     )}
//                     {item.isQuestionVisible && (
//                         <div className='question_text_content' ref={(el) => {
//                             questionRef.current = el; // Attach ref for drag and drop
//                             containerRef.current = el; // Attach ref for outside click detection
//                         }}>

//                             <div className='question_editor_container' >


//                                 <div
//                                     className='message_edit__text__input question_editor_text'
//                                     contentEditable={true}
//                                     suppressContentEditableWarning={true}
//                                     dangerouslySetInnerHTML={{ __html: item.text }} // Display stored HTML on edit
//                                     onBlur={(e) => handleBlur(index, e)}
//                                     onClick={(e) => {
//                                         activeInputRef.current = e.currentTarget; // Set the active input ref
//                                     }}
//                                 ></div>
//                                 <div className='question_editor_toolbar'>
//                                     <div className='inline_toolbar'>
//                                         <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={() => applyCurlyFormatting(index)}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={toggleEmojiPicker}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                         </div>

//                                     </div>
//                                     <div className='question_variable_btn'>
//                                         <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             {isVisible && (
//                                 <div className="emoji_dropdown">
//                                     {emojis.map((emoji, index) => (
//                                         <span
//                                             key={index}
//                                             className="emoji_icon"
//                                             onClick={() => handleEmojiClick(emoji)}
//                                             style={{ cursor: 'pointer' }}
//                                         >
//                                             {emoji}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}
//                             {isVariablesVisible && (
//                                 <div className="varibles_drop_container" aria-hidden={!isVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </>
//             ))}
//             {imageContainers.map((image, index) => (
//                 <div key={index} className='image_container'>
//                     <div className='message_image_content'>
//                         {image ? (
//                             <img src={image} alt="Uploaded" style={{ width: '100%', height: '100%' }} />
//                         ) : (
//                             <ImageIcon />
//                         )}
//                     </div>
//                     <button className='footer__cancel__btn image_upload' onClick={() => document.getElementById(`image-input-${index}`).click()}>
//                         Upload image
//                     </button>
//                     <button className='message_delete_icon' onClick={() => handleImageDelete(index)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                     {
//                         showImageInput && (
//                             <div className='edit__text__input message_input_box image_text_input_field'
//                                 contentEditable
//                                 suppressContentEditableWarning={true}
//                                 onInput={(e) => setImageInputValue(e.currentTarget.innerHTML)}
//                                 dangerouslySetInnerHTML={{ __html: imageInputValue }} onClick={handleImageInputClick}></div>
//                         )
//                     }

//                     {isImageBoxVisible && (
//                         <div className='question_text_content image_text_input_field' ref={questionRef} >

//                             <div className='question_editor_container' onMouseDown={handleInteraction} onTouchStart={handleInteraction}>

//                                 <div
//                                     className='message_edit__text__input question_editor_text'
//                                     contentEditable
//                                     suppressContentEditableWarning={true}
//                                     onInput={(e) => setImageInputValue(e.currentTarget.innerHTML)}
//                                     onFocus={() => setShowImageInput(false)}
//                                     dangerouslySetInnerHTML={{ __html: imageInputValue }}
//                                 >

//                                 </div>
//                                 <div className='question_editor_toolbar'>
//                                     <div className='inline_toolbar'>
//                                         <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={applyCurlyFormatting}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                         </div>
//                                         <div className='option_toolbar' onClick={toggleImageEmojiPicker}>
//                                             <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                         </div>

//                                     </div>
//                                     <div className='question_variable_btn'>
//                                         <button className='btn btn-success variable_btn' onClick={toggleImageVariableDropdown} >Variables  </button>
//                                     </div>
//                                 </div>
//                             </div>
//                             {isImageEmojiVisible && (
//                                 <div className="emoji_dropdown">
//                                     {emojis.map((emoji, index) => (
//                                         <span
//                                             key={index}
//                                             className="emoji_icon"
//                                             onClick={() => handleImageEmojiClick(emoji)}
//                                             style={{ cursor: 'pointer' }}
//                                         >
//                                             {emoji}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}
//                             {isImageVariablesVisible && (
//                                 <div className="varibles_drop_container" aria-hidden={!isImageVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleImageVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleImageVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                     <input
//                         type='file'
//                         id={`image-input-${index}`}
//                         className='edt__text__input image_input_box'
//                         style={{ display: "none" }}
//                         onChange={(event) => handleImageUpload(event, index)}
//                     />

//                 </div>
//             ))}

//             {videoContainers.map((video, index) => (
//                 <div key={index} className='image_container'>
//                     <div className='message_image_content'>
//                         {video ? (
//                             <video controls style={{ width: '100%', height: '100%' }}>
//                                 <source src={video} type="video/mp4" />
//                             </video>
//                         ) : (
//                             <MovieIcon />
//                         )}
//                     </div>
//                     <button className='footer__cancel__btn image_upload' onClick={() => document.getElementById(`video-input-${index}`).click()}>
//                         Upload video
//                     </button>
//                     <button className='message_delete_icon' onClick={() => handleVideoDelete(index)}>
//                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                     <input
//                         type='file'
//                         id={`video-input-${index}`}
//                         className='edt__text__input image_input_box'
//                         style={{ display: "none" }}
//                         onChange={(event) => handleVideoUpload(event, index)}
//                     />
//                 </div>
//             ))}

//             {audioContainers.map((audio, index) => (
//                 <div key={index} className='image_container'>
//                     <div className='message_image_content'>
//                         {audio ? (
//                             <audio controls style={{ width: '100%' }}>
//                                 <source src={audio} />
//                             </audio>
//                         ) : (
//                             <AudiotrackIcon />
//                         )}
//                     </div>
//                     <button className='footer__cancel__btn image_upload' onClick={() => document.getElementById(`audio-input-${index}`).click()}>
//                         Upload audio
//                     </button>
//                     <button className='message_delete_icon' onClick={() => handleAudioDelete(index)}>
//                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                     <input
//                         type='file'
//                         id={`audio-input-${index}`}
//                         className='edt__text__input image_input_box'
//                         style={{ display: "none" }}
//                         onChange={(event) => handleAudioUpload(event, index)}
//                     />
//                 </div>
//             ))}

//             {documentContainers.map((doc, index) => (
//                 <div key={index} className='image_container'>
//                     <div className='message_image_content'>
//                         <DescriptionOutlinedIcon />
//                     </div>
//                     {doc.file && (
//                         <a href={doc.file} className='selecteddoc_link'>{doc.name}</a>
//                     )}
//                     <button className='footer__cancel__btn image_upload' onClick={() => document.getElementById(`document-input-${index}`).click()}>
//                         Upload document
//                     </button>
//                     <button className='message_delete_icon' onClick={() => handleDocumentDelete(index)}>
//                         <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                     <input
//                         type='file'
//                         id={`document-input-${index}`}
//                         className='edt__text__input image_input_box'
//                         style={{ display: "none" }}
//                         onChange={(event) => handleDocumentUpload(event, index)}
//                     />
//                 </div>
//             ))}
//             <div className='choose_msg_list'>
//                 <button className='footer__cancel__btn choose_msg_btn' onClick={handleMessageClick}>Message</button>
//                 <button className='footer__cancel__btn choose_msg_btn' onClick={handleImageClick}>Image</button>
//                 <button className='footer__cancel__btn choose_msg_btn' onClick={handleVideoClick}>Video</button>
//                 <button className='footer__cancel__btn choose_msg_btn' onClick={handleAudioClick}>Audio</button>
//                 <button className='footer__cancel__btn choose_msg_btn' onClick={handleDocumentClick}>Document</button>
//             </div>
//         </>
//     )
// }

// const ConditionModal = ({ show, onClose, onSave }) => {
//     const [conditions, setConditions] = useState([{ id: Date.now() }]);
//     const [content, setContent] = useState('');
//     const [open, setOpen] = useState(false);
//     const options = ['Option 1', 'Option 2', 'Option 3'];
//     const dropOptions = ['Equal to', 'Not Equal to', 'Contains']
//     const [secondContent, setSecondContent] = useState('Equal to');
//     const dropValue = ['Option 1', 'Option 2', 'Option 3'];
//     const [thirdContent, setThirdContent] = useState('');
//     const [openDropdown, setOpenDropdown] = useState(false);

//     const addCondition = () => {
//         setConditions([...conditions, { id: Date.now() }]);
//     };

//     const deleteCondition = (id) => {
//         const updatedConditions = conditions.filter(condition => condition.id !== id);
//         setConditions(updatedConditions);
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_condition_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set a Condition</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='edit__text__label'>Set the condition(s)</div>
//                     <div>
//                         {conditions.map((condition, index) => (
//                             <div key={condition.id} className='set_condition_container'>
//                                 <Autocomplete
//                                     options={options}
//                                     value={content}
//                                     disableClearable
//                                     onChange={(event, newValue) => setContent(newValue)}
//                                     open={open}
//                                     onOpen={() => setOpen(true)}
//                                     onClose={() => setOpen(false)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="standard"
//                                             placeholder="Type or select a variable"
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 disableUnderline: true,
//                                                 startAdornment: (
//                                                     <div className="set_condition_field__icon" style={{ marginRight: '8px' }}>
//                                                         <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HelpIcon" width="20px" height="20px">
//                                                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 17h-2v-2h2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25"></path>
//                                                         </svg>
//                                                         <span>IF</span>
//                                                     </div>
//                                                 ),
//                                                 endAdornment: (
//                                                     <div className="">
//                                                         <button className='btn btn-success variable_btn'
//                                                             onClick={() => setOpen(!open)}
//                                                         >
//                                                             Variables
//                                                         </button>
//                                                     </div>
//                                                 ),
//                                                 sx: {
//                                                     border: 'none',
//                                                     fontSize: '12px',
//                                                     borderRadius: '4px',
//                                                     height: '3rem',
//                                                     paddingLeft: '50px',
//                                                     paddingRight: '50px',
//                                                     backgroundColor: 'white',
//                                                     '&:hover': {
//                                                         border: 'none',
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         border: 'none',
//                                                         backgroundColor: 'white',
//                                                         outline: 'none',
//                                                     },
//                                                 },
//                                             }}

//                                         />
//                                     )}

//                                 />
//                                 <Autocomplete
//                                     options={dropOptions}
//                                     value={secondContent}
//                                     disableClearable
//                                     onChange={(event, newValue) => setSecondContent(newValue)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="standard"
//                                             placeholder=""
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 disableUnderline: true,
//                                                 sx: {
//                                                     border: '1px solid rgb(232, 234, 242)',
//                                                     borderRadius: '4px',
//                                                     height: '3rem',
//                                                     paddingLeft: '10px',
//                                                     backgroundColor: 'white',
//                                                     '&:hover': {
//                                                         border: '1px solid green',
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         border: '1px solid green',
//                                                         backgroundColor: 'white',
//                                                         outline: 'none',
//                                                     },
//                                                 },
//                                             }}

//                                         />
//                                     )}

//                                 />
//                                 <Autocomplete
//                                     options={dropValue}
//                                     value={thirdContent}
//                                     disableClearable
//                                     onChange={(event, newValue) => setThirdContent(newValue)}
//                                     open={openDropdown}
//                                     onOpen={() => setOpenDropdown(true)}
//                                     onClose={() => setOpenDropdown(false)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="standard"
//                                             placeholder="Type Value"
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 disableUnderline: true,

//                                                 endAdornment: (
//                                                     <div className="">
//                                                         <button className='btn btn-success variable_btn'
//                                                             onClick={() => setOpen(!openDropdown)}
//                                                         >
//                                                             Variables
//                                                         </button>
//                                                     </div>
//                                                 ),
//                                                 sx: {
//                                                     border: 'none',
//                                                     fontSize: '12px',
//                                                     borderRadius: '4px',
//                                                     height: '3rem',
//                                                     paddingLeft: '10px',
//                                                     backgroundColor: 'white',
//                                                     '&:hover': {
//                                                         border: 'none',
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         border: 'none',
//                                                         backgroundColor: 'white',
//                                                         outline: 'none',
//                                                     },
//                                                 },
//                                             }}

//                                         />
//                                     )}

//                                 />

//                                 {index > 0 && (
//                                     <button onClick={() => deleteCondition(condition.id)} className='condition_delete_btn'>
//                                         Delete
//                                     </button>
//                                 )}
//                             </div>
//                         ))}

//                         {conditions.length === 1 && (

//                             <button className='footer__cancel__btn condition__add' onClick={addCondition}>+ Add</button>
//                         )}
//                     </div>
//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const QuestionModal = ({ show, onClose, onSave }) => {
//     const [inputValue, setInputValue] = useState("");
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [isActive, setIsActive] = useState(false); //toggle
//     const handleToggle = () => {
//         setIsActive(!isActive);
//     };
//     const [isActiveAdvancedOption, setIsActiveAdvancedOption] = useState(false);
//     const handleToggleAdvancedOptions = () => {
//         setIsActiveAdvancedOption(!isActiveAdvancedOption)
//     }
//     const [isVisible, setIsVisible] = useState(false);
//     const [isVariablesVisible, setIsVariablesVisible] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const validationOptions = ["Number", "Date", 'Date + Time', "Time", "Pattern (regex)"]
//     const [validation, setValidation] = useState('');
//     const toggleVariablesDropdown = () => {
//         setIsVariablesVisible((prev) => !prev);
//     };

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleEmojiPicker = () => {
//         setIsVisible((prev) => !prev);
//     };
//     const handleEmojiClick = (emoji) => {
//         setInputValue(prev => prev + emoji);
//         setIsVisible(false);
//     };

//     const handleVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsVariablesVisible(false);
//     };
//     const formatText = (command) => {
//         document.execCommand(command, false, null);
//     };
//     const applyCurlyFormatting = () => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const selectedText = range.toString();
//             if (selectedText) {
//                 const curlyText = `{${selectedText}}`;
//                 const textNode = document.createTextNode(curlyText);
//                 range.deleteContents();
//                 range.insertNode(textNode);
//                 selection.removeAllRanges();
//             }
//         }
//     };
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set a question</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Question Text</div>
//                         <div className='question_editor_container'>
//                             {/* <input type="text" className='edit__text__input question_editor_text' value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)} /> */}
//                             <div
//                                 className='message_edit__text__input question_editor_text'
//                                 contentEditable
//                                 suppressContentEditableWarning={true}
//                                 onInput={(e) => setInputValue(e.currentTarget.innerHTML)}
//                                 dangerouslySetInnerHTML={{ __html: inputValue }}
//                             >

//                             </div>

//                             <div className='question_editor_toolbar'>
//                                 <div className='inline_toolbar'>
//                                     <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={applyCurlyFormatting}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={toggleEmojiPicker}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                     </div>

//                                 </div>
//                                 <div className='question_variable_btn'>
//                                     <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {isVisible && (
//                             <div className="emoji_dropdown">
//                                 {emojis.map((emoji, index) => (
//                                     <span
//                                         key={index}
//                                         className="emoji_icon"
//                                         onClick={() => handleEmojiClick(emoji)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         {emoji}
//                                     </span>
//                                 ))}
//                             </div>
//                         )}
//                         {isVariablesVisible && (
//                             <div className="varibles_drop_container" aria-hidden={!isVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Add Answer variant</div>
//                         <div className='question_variant_item'>
//                             <input type="text" className='edit__text__input variant_text_box' placeholder='Hi!' />
//                             <button className='btn btn-success variant_create_button'>Create</button>
//                         </div>
//                     </div>

//                     <div className='question_text_container'>
//                         <div className='question_accept_container'>
//                             <div className='edit__text__label'>Accept a media response</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">Off</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isActive ? 'active' : ''}`}
//                                     onClick={handleToggle}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>
//                                 <label className="toggle-label">On</label>
//                             </div>

//                         </div>
//                     </div>

//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Save Answer in a Variable</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='@Value' />
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='question_accept_container'>
//                             <div className='edit__text__label'>Advanced options</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">Off</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isActiveAdvancedOption ? 'active' : ''}`}
//                                     onClick={handleToggleAdvancedOptions}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>
//                                 <label className="toggle-label">On</label>
//                             </div>

//                         </div>
//                     </div>
//                     {
//                         isActiveAdvancedOption &&
//                         <>
//                             <div className='validation_container'>
//                                 <div className='edit__text__label'>Validation</div>
//                                 <Autocomplete
//                                     options={validationOptions}
//                                     value={validation}
//                                     disableClearable
//                                     onChange={(event, newValue) => setValidation(newValue)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="standard"
//                                             placeholder=""
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 disableUnderline: true,
//                                                 sx: {
//                                                     border: '1px solid rgb(232, 234, 242)',
//                                                     borderRadius: '4px',
//                                                     height: '3rem',
//                                                     paddingLeft: '10px',
//                                                     backgroundColor: validation ? 'white' : 'rgb(245, 246, 250)',
//                                                     '&:hover': {
//                                                         border: '1px solid green',
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         border: '1px solid green',
//                                                         backgroundColor: 'white',
//                                                         outline: 'none',
//                                                     },
//                                                 },
//                                             }}

//                                         />
//                                     )}

//                                 />
//                             </div>
//                             {validation === "Number" && (
//                                 <div className='validation_container'>
//                                     <div className='edit__text__label'>Minimum Value</div>
//                                     <input type='number' className='edit__text__input validation_number_textbox' placeholder='0' />

//                                     <div className='edit__text__label'>Maximum Value</div>
//                                     <input type='number' className='edit__text__input validation_number_textbox' placeholder='9999' />
//                                 </div>
//                             )}
//                             {validation === "Pattern (regex)" && (
//                                 <div className='validation_container'>
//                                     <div className='edit__text__label'>Regex Pattern</div>
//                                     <input type='text' className='edit__text__input validation_number_textbox' placeholder='Examples:$,%' />

//                                 </div>
//                             )}
//                             <div className='validation_container'>
//                                 <div className='edit__text__label'>Validation error message</div>
//                                 <textarea value="I'm afraid I didn't understand, could you try again, please?" class="edit__text__textarea validation_textarea"  ></textarea>
//                             </div>
//                             <div className='validation_container'>
//                                 <div className='Validation_fails_count'>
//                                     Exit chatbot if validation failed more than
//                                     <input type="number" className='edit__text__input fails_count_textbox' />
//                                 </div>
//                             </div>
//                         </>

//                     }
//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };

// const ButtonsModal = ({ show, onClose, onSave }) => {
//     const [inputValue, setInputValue] = useState("");
//     const [HeaderValue, setHeaderValue] = useState('');
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [isActive, setIsActive] = useState(false); //toggle
//     const handleToggle = () => {
//         setIsActive(!isActive);
//     };


//     const [isVisible, setIsVisible] = useState(false);
//     const [isVariablesVisible, setIsVariablesVisible] = useState(false);
//     const [isHeaderVariables, setIsHeaderVariables] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const toggleVariablesDropdown = () => {
//         setIsVariablesVisible((prev) => !prev);
//     };
//     const toggleHeaderVariablesDropdown = () => {
//         setIsHeaderVariables((prev) => !prev);
//     }

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleEmojiPicker = () => {
//         setIsVisible((prev) => !prev);
//     };
//     const handleEmojiClick = (emoji) => {
//         setInputValue(prev => prev + emoji);
//         setIsVisible(false);
//     };

//     const handleVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsVariablesVisible(false);
//     };
//     const handleHeaderVariableClick = (variable) => {
//         setHeaderValue(prev => prev + variable.value);
//         setIsHeaderVariables(false);
//     };
//     const formatText = (command) => {
//         document.execCommand(command, false, null);
//     };
//     const applyCurlyFormatting = () => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const selectedText = range.toString();
//             if (selectedText) {
//                 const curlyText = `{${selectedText}}`;
//                 const textNode = document.createTextNode(curlyText);
//                 range.deleteContents();
//                 range.insertNode(textNode);
//                 selection.removeAllRanges();
//             }
//         }
//     };
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set Button</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Media Header</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">optional</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isActive ? 'active' : ''}`}
//                                     onClick={handleToggle}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>

//                         </div>
//                     </div>
//                     {
//                         !isActive &&
//                         <div className='question_text_container'>
//                             <div className='edit__text__label'>Header Text</div>
//                             <div className='question_variant_item'>
//                                 <input type="text" className='edit__text__input message_input_box' placeholder='inputvalue'
//                                     value={HeaderValue}
//                                     onChange={(e) => setHeaderValue(e.target.value)} />
//                                 <button className='btn btn-success variant_create_button' onClick={toggleHeaderVariablesDropdown} >variables</button>
//                             </div>
//                             {isHeaderVariables && (
//                                 <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     }

//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Body Text</div>
//                         <div className='question_editor_container'>
//                             {/* <input type="text" className='edit__text__input question_editor_text' value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)} /> */}
//                             <div
//                                 className='message_edit__text__input question_editor_text'
//                                 contentEditable
//                                 suppressContentEditableWarning={true}
//                                 onInput={(e) => setInputValue(e.currentTarget.innerHTML)}
//                                 dangerouslySetInnerHTML={{ __html: inputValue }}
//                             >

//                             </div>

//                             <div className='question_editor_toolbar'>
//                                 <div className='inline_toolbar'>
//                                     <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={applyCurlyFormatting} >
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={toggleEmojiPicker}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                     </div>

//                                 </div>
//                                 <div className='question_variable_btn'>
//                                     <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {isVisible && (
//                             <div className="emoji_dropdown">
//                                 {emojis.map((emoji, index) => (
//                                     <span
//                                         key={index}
//                                         className="emoji_icon"
//                                         onClick={() => handleEmojiClick(emoji)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         {emoji}
//                                     </span>
//                                 ))}
//                             </div>
//                         )}
//                         {isVariablesVisible && (
//                             <div className="varibles_drop_container" aria-hidden={!isVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Footer Text</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='input value' />
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Button 1</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='Answer 1' />
//                         <div className='edit__text__label'>New Button</div>
//                         <div className='question_variant_item'>
//                             <input type="text" className='edit__text__input message_input_box' placeholder='input value' />
//                             <button className='btn btn-success variant_create_button'>Create</button>
//                         </div>

//                     </div>

//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Save Answer in a Variable</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='@Value' />
//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const ListModal = ({ show, onClose, onSave }) => {
//     const [inputValue, setInputValue] = useState("");
//     const [HeaderValue, setHeaderValue] = useState('');
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]

//     //add description button


//     const [sections, setSections] = useState([
//         { title: 'Section 1 Title', showDescription: false, showNewRow: false }
//     ]);

//     const handleAddSection = () => {
//         const newSectionNumber = sections.length + 1;
//         const newSection = { title: `Section ${newSectionNumber} Title`, showDescription: false, showNewRow: false };
//         setSections([...sections, newSection]);
//     };

//     const handleDeleteSection = (index) => {
//         const newSections = sections.filter((_, i) => i !== index);
//         setSections(newSections);
//     };

//     const handleAddDescription = (index) => {
//         const newSections = sections.map((section, i) => (
//             i === index ? { ...section, showDescription: true } : section
//         ));
//         setSections(newSections);
//     };

//     const handleDeleteDescription = (index) => {
//         const newSections = sections.map((section, i) => (
//             i === index ? { ...section, showDescription: false } : section
//         ));
//         setSections(newSections);
//     };

//     const handleAddNewRow = (index) => {
//         const newSections = sections.map((section, i) => (
//             i === index ? { ...section, showNewRow: true } : section
//         ));
//         setSections(newSections);
//     };
//     const [isVisible, setIsVisible] = useState(false);
//     const [isVariablesVisible, setIsVariablesVisible] = useState(false);
//     const [isHeaderVariables, setIsHeaderVariables] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const toggleVariablesDropdown = () => {
//         setIsVariablesVisible((prev) => !prev);
//     };
//     const toggleHeaderVariablesDropdown = () => {
//         setIsHeaderVariables((prev) => !prev);
//     }

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleEmojiPicker = () => {
//         setIsVisible((prev) => !prev);
//     };
//     const handleEmojiClick = (emoji) => {
//         setInputValue(prev => prev + emoji);
//         setIsVisible(false);
//     };

//     const handleVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsVariablesVisible(false);
//     };
//     const handleHeaderVariableClick = (variable) => {
//         setHeaderValue(prev => prev + variable.value);
//         setIsHeaderVariables(false);
//     };

//     const formatText = (command) => {
//         document.execCommand(command, false, null);
//     };
//     const applyCurlyFormatting = () => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const selectedText = range.toString();
//             if (selectedText) {
//                 const curlyText = `{${selectedText}}`;
//                 const textNode = document.createTextNode(curlyText);
//                 range.deleteContents();
//                 range.insertNode(textNode);
//                 selection.removeAllRanges();
//             }
//         }
//     };
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set List</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>

//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Header Text</div>
//                         <div className='question_variant_item'>
//                             <input type="text" className='edit__text__input message_input_box' placeholder='inputvalue'
//                                 value={HeaderValue}
//                                 onChange={(e) => setHeaderValue(e.target.value)} />
//                             <button className='btn btn-success variant_create_button' onClick={toggleHeaderVariablesDropdown} >variables</button>
//                         </div>
//                         {isHeaderVariables && (
//                             <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>


//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Body Text</div>
//                         <div className='question_editor_container'>
//                             {/* <input type="text" className='edit__text__input question_editor_text' value={inputValue}
//                                 onChange={(e) => setInputValue(e.target.value)} /> */}
//                             <div
//                                 className='message_edit__text__input question_editor_text'
//                                 contentEditable
//                                 suppressContentEditableWarning={true}
//                                 onInput={(e) => setInputValue(e.currentTarget.innerHTML)}
//                                 dangerouslySetInnerHTML={{ __html: inputValue }}
//                             >

//                             </div>

//                             <div className='question_editor_toolbar'>
//                                 <div className='inline_toolbar'>
//                                     <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={applyCurlyFormatting}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={toggleEmojiPicker}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                     </div>

//                                 </div>
//                                 <div className='question_variable_btn'>
//                                     <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {isVisible && (
//                             <div className="emoji_dropdown">
//                                 {emojis.map((emoji, index) => (
//                                     <span
//                                         key={index}
//                                         className="emoji_icon"
//                                         onClick={() => handleEmojiClick(emoji)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         {emoji}
//                                     </span>
//                                 ))}
//                             </div>
//                         )}
//                         {isVariablesVisible && (
//                             <div className="varibles_drop_container" aria-hidden={!isVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Footer Text</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='input value' />
//                     </div>

//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Button Text</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='Menu Here' />
//                     </div>

//                     <div className='question_text_container'>
//                         {sections.map((section, index) => (
//                             <div className='section_container' key={index} style={{ marginBottom: '20px' }}>
//                                 <div>
//                                     <div className='edit__text__label'>{section.title}</div>
//                                     <input type="text" className='edit__text__input section_text_box' placeholder='input Value' />
//                                 </div>
//                                 <div>
//                                     <div className='list_row'>
//                                         <div>
//                                             <div className='list_row_header'>
//                                                 <div className='edit__text__label'>Row 1</div>
//                                                 {!section.showDescription && (
//                                                     <button className='list_add_description' onClick={() => handleAddDescription(index)}>
//                                                         Add Description
//                                                     </button>
//                                                 )}
//                                             </div>
//                                             <input type="text" className='edit__text__input section_text_box' placeholder='input Value' />
//                                         </div>
//                                         {section.showDescription && (
//                                             <div>
//                                                 <div className='edit__text__label'>How do you describe this Bot?</div>
//                                                 <input type="text" className='edit__text__input section_text_box' placeholder='Input Value' />
//                                                 <button className='list_row_delete' onClick={() => handleDeleteDescription(index)}>

//                                                     <svg style={{ stroke: 'red' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                         <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path>
//                                                         <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round"></path>
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </div>
//                                     {
//                                         section.showNewRow && (
//                                             <>
//                                                 <div className='edit__text__label'>New Row</div>
//                                                 <div className='question_variant_item'>
//                                                     <input type="text" className='edit__text__input new_row_create_box' placeholder='' />
//                                                     <button className='btn btn-success variant_create_button'>Create</button>
//                                                 </div>
//                                             </>
//                                         )
//                                     }
//                                     {
//                                         !section.showNewRow && (
//                                             <button className='list_add_description list_new_row' onClick={() => handleAddNewRow(index)}>New Row</button>
//                                         )
//                                     }
//                                 </div>
//                                 <button className='condition_delete_btn' onClick={() => handleDeleteSection(index)}>Remove Section</button>
//                             </div>
//                         ))}
//                         <button className='footer__cancel__btn add_sec_btn' onClick={handleAddSection}>Add Section</button>
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Save Answers in a variable</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='@value' />
//                     </div>
//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const UpdateAttributesModal = ({ show, onClose, onSave }) => {
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [inputValue, setInputValue] = useState('');
//     const [secondInputValue, setsecondInputValue] = useState('');
//     const options = ['Variable', 'Custom Attribute']
//     const [content, setContent] = useState('');
//     const [isHeaderVariables, setIsHeaderVariables] = useState(false);
//     const [isSecondDropdown, setSecondDropdown] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleHeaderVariablesDropdown = () => {
//         setIsHeaderVariables((prev) => !prev);
//     }
//     const toggleSecondVariablesDropdown = () => {
//         setSecondDropdown((prev) => !prev);
//     }
//     const handleHeaderVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsHeaderVariables(false);
//     };

//     const handleSecondVariableClick = (variable) => {
//         setSecondDropdown(false);
//         setsecondInputValue(prev => prev + variable.value);
//     }
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Update Attribute</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Create/select a variable to modify</div>

//                         <Autocomplete
//                             options={options}
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder=""
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
//                         <div>
//                             <div className='update_attributes_container'>
//                                 <input type="text" className='edit__text__input message_input_box' placeholder='Type value or select a variable'
//                                     value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
//                                 <button className='btn btn-success variable_btn' onClick={toggleHeaderVariablesDropdown}>Variables</button>
//                             </div>
//                             {isHeaderVariables && (
//                                 <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div>
//                             <div className='update_attributes_container'>
//                                 <input type="text" className='edit__text__input message_input_box' placeholder='Type value or select a variable'
//                                     value={secondInputValue} onChange={(e) => setsecondInputValue(e.target.value)} />
//                                 <button className='btn btn-success variable_btn' onClick={toggleSecondVariablesDropdown}>Variables</button>
//                             </div>
//                             {isSecondDropdown && (
//                                 <div className="varibles_drop_container" aria-hidden={!isSecondDropdown} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleSecondVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleSecondVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const SetTagsModal = ({ show, onClose, onSave }) => {
//     const initialOptions = ['Driver Concerns', 'Emergency-Urgent-help-needed', 'General Enquiry', 'Investor customers'];
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [options, setOptions] = useState(initialOptions);

//     const handleTagDelete = (tagToDelete) => {
//         setSelectedTags((prev) => prev.filter(tag => tag !== tagToDelete));
//         setOptions((prev) => [...prev, tagToDelete]);
//     };

//     const handleTagChange = (event, newValue) => {
//         if (newValue && !selectedTags.includes(newValue)) {
//             setSelectedTags((prev) => [...prev, newValue]);
//             setOptions((prev) => prev.filter(option => option !== newValue));
//         }
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set Tags</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         {selectedTags.map((tag) => (
//                             <Chip
//                                 key={tag}
//                                 label={tag}
//                                 onDelete={() => handleTagDelete(tag)}
//                                 variant="outlined"
//                                 style={{ marginBottom: '15px' }}
//                             />
//                         ))}

//                         <Autocomplete
//                             options={options}
//                             disableClearable
//                             onChange={handleTagChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select Tags"
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

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const AssignToTeamModal = ({ show, onClose, onSave }) => {
//     const initialOptions = ['EV_Zone_everyone', 'Call_center_Kampala', 'Driver_Liaison_officers', 'Ride_Agents_officers', 'Corporate_Liaison_officers'];
//     const [selectedTags, setSelectedTags] = useState([]);
//     const [options, setOptions] = useState(initialOptions);

//     const handleTagDelete = (tagToDelete) => {
//         setSelectedTags((prev) => prev.filter(tag => tag !== tagToDelete));
//         setOptions((prev) => [...prev, tagToDelete]);
//     };

//     const handleTagChange = (event, newValue) => {
//         if (newValue && !selectedTags.includes(newValue)) {
//             setSelectedTags((prev) => [...prev, newValue]);
//             setOptions((prev) => prev.filter(option => option !== newValue));
//         }
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Assign To Team</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>

//                         <Autocomplete
//                             options={options}
//                             disableClearable
//                             onChange={handleTagChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select"
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
//                         {selectedTags.map((tag) => (
//                             <Chip
//                                 key={tag}
//                                 label={tag}
//                                 onDelete={() => handleTagDelete(tag)}
//                                 style={{ marginTop: '15px' }}
//                             />
//                         ))}

//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };

// const AssignToUserModal = ({ show, onClose, onSave }) => {
//     const initialOptions = ['Thameem Hameed', 'Bot', 'EV zone', 'juliet _1'];
//     const [selectedTag, setSelectedTag] = useState(null);
//     const [options, setOptions] = useState(initialOptions);

//     const handleTagChange = (event, newValue) => {
//         if (newValue) {

//             setSelectedTag(newValue);
//         }
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Assign To User</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         <Autocomplete
//                             options={options.filter(option => option !== selectedTag)}
//                             disableClearable
//                             onChange={handleTagChange}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select"
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
//                         {selectedTag && (
//                             <Chip
//                                 key={selectedTag}
//                                 label={selectedTag}
//                                 onDelete={() => setSelectedTag(null)}
//                                 style={{ marginTop: '15px' }}
//                             />
//                         )}
//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave}>Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const TriggerChatbotModal = ({ show, onClose, onSave }) => {
//     const options = ['ratings', 'cancel_order', 'reschdule_order', 'dispatch', 'payment_process']
//     const [content, setContent] = useState('');
//     const filteredOptions = options.filter(option => option !== content);
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Trigger Chatbot</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>

//                         <Autocomplete
//                             options={filteredOptions}
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave}>Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };

// const UpdateChatModal = ({ show, onClose, onSave }) => {
//     const options = ['Open', 'Pending', 'Solved', 'Spam & Block']
//     const [content, setContent] = useState('');
//     const filteredOptions = options.filter(option => option !== content);
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Update Chat Status</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>

//                         <Autocomplete
//                             options={filteredOptions}
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave}>Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const TemplatesModal = ({ show, onClose, onSave }) => {
//     const options = ["sell_ev_market", 'buy_ev_market', 'agent_signup', 'become_a_driver', 'charge_point_owner', 'agent_register', 'charging_point']
//     const messages = {
//         sell_ev_market: "You can sell Electric Vehicles, Charge Points and Accessories from our market",
//         buy_ev_market: "You can buy Electric Vehicles, Charge Points and Accessories from our market.",
//         agent_signup: "To become an EV zone Agent",
//         become_a_driver: "Register from website : https://www.evzoneride.com/#",
//         charge_point_owner: "Email on investors@evzoneafrica.com",
//         agent_register: "To become an EV zone Agent",
//         charging_point: "Book through Website https://www.evzoneride.com/#"
//     };
//     const [content, setContent] = useState('');
//     const filteredOptions = options.filter(option => option !== content);
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Message Template</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>

//                         <Autocomplete
//                             options={filteredOptions}
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="Select"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
//                         {content && (
//                             <div className='message_templates_body'>
//                                 {messages[content]}
//                             </div>
//                         )}

//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave}>Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const SetTimeDelayModal = ({ show, onClose, onSave }) => {

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Set Time Delay</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>
//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Set a delay from 0:00 to 180:00 minutes</div>
//                         <div className='time_delay_container'>
//                             <input type="number" className='edit__text__input time_delay_inputbox' />
//                             <span>min</span>
//                             <input type="number" className='edit__text__input time_delay_inputbox' />
//                             <span>sec</span>
//                         </div>
//                     </div>

//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave}>Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const WhatsappFlowModal = ({ show, onClose, onSave }) => {
//     const [content, setContent] = useState('');
//     const [inputValue, setInputValue] = useState("");
//     const [HeaderValue, setHeaderValue] = useState('');
//     const fallbackOptions = [1, 2, 3]
//     const [fallbackContent, setFallbackContent] = useState('')
//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [isActive, setIsActive] = useState(false); //toggle
//     const handleToggle = () => {
//         setIsActive(!isActive);
//     };


//     const [isVisible, setIsVisible] = useState(false);
//     const [isVariablesVisible, setIsVariablesVisible] = useState(false);
//     const [isHeaderVariables, setIsHeaderVariables] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const toggleVariablesDropdown = () => {
//         setIsVariablesVisible((prev) => !prev);
//     };
//     const toggleHeaderVariablesDropdown = () => {
//         setIsHeaderVariables((prev) => !prev);
//     }

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleEmojiPicker = () => {
//         setIsVisible((prev) => !prev);
//     };
//     const handleEmojiClick = (emoji) => {
//         setInputValue(prev => prev + emoji);
//         setIsVisible(false);
//     };

//     const handleVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsVariablesVisible(false);
//     };
//     const handleHeaderVariableClick = (variable) => {
//         setHeaderValue(prev => prev + variable.value);
//         setIsHeaderVariables(false);
//     };
//     const formatText = (command) => {
//         document.execCommand(command, false, null);
//     };
//     const applyCurlyFormatting = () => {
//         const selection = window.getSelection();
//         if (selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const selectedText = range.toString();
//             if (selectedText) {
//                 const curlyText = `{${selectedText}}`;
//                 const textNode = document.createTextNode(curlyText);
//                 range.deleteContents();
//                 range.insertNode(textNode);
//                 selection.removeAllRanges();
//             }
//         }
//     };
//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>WhatsApp Flow</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>

//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Header Text</div>
//                         <div className='question_variant_item'>
//                             <input type="text" className='edit__text__input message_input_box' placeholder='inputvalue'
//                                 value={HeaderValue}
//                                 onChange={(e) => setHeaderValue(e.target.value)} />
//                             <button className='btn btn-success variant_create_button' onClick={toggleHeaderVariablesDropdown} >variables</button>
//                         </div>
//                         {isHeaderVariables && (
//                             <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>


//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Body Text</div>
//                         <div className='question_editor_container'>

//                             <div
//                                 className='message_edit__text__input question_editor_text'
//                                 contentEditable
//                                 suppressContentEditableWarning={true}
//                                 onInput={(e) => setInputValue(e.currentTarget.innerHTML)}
//                                 dangerouslySetInnerHTML={{ __html: inputValue }}
//                             ></div>
//                             <div className='question_editor_toolbar'>
//                                 <div className='inline_toolbar'>
//                                     <div className='option_toolbar' onClick={() => formatText('bold')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuMjM2IDBjMS42NTIgMCAyLjk0LjI5OCAzLjg2Ni44OTMuOTI1LjU5NSAxLjM4OCAxLjQ4NSAxLjM4OCAyLjY2OSAwIC42MDEtLjE3MyAxLjEzOS0uNTE2IDEuNjEtLjM0My40NzQtLjg0NC44My0xLjQ5OSAxLjA2OC44NDMuMTY3IDEuNDc0LjUyMyAxLjg5NSAxLjA3MS40MTkuNTUuNjMgMS4xODMuNjMgMS45MDMgMCAxLjI0NS0uNDQ0IDIuMTg3LTEuMzMgMi44MjUtLjg4Ni42NDEtMi4xNDQuOTYxLTMuNzY5Ljk2MUgwdi0yLjE2N2gxLjQ5NFYyLjE2N0gwVjBoNi4yMzZ6TTQuMzA4IDUuNDQ2aDIuMDI0Yy43NTIgMCAxLjMzLS4xNDMgMS43MzQtLjQzLjQwNS0uMjg1LjYwOC0uNzAxLjYwOC0xLjI1IDAtLjYtLjIwNC0xLjA0NC0uNjEyLTEuMzMtLjQwOC0uMjg2LTEuMDE2LS40MjctMS44MjYtLjQyN0g0LjMwOHYzLjQzN3ptMCAxLjgwNFYxMWgyLjU5M2MuNzQ3IDAgMS4zMTQtLjE1MiAxLjcwNy0uNDUyLjM5LS4zLjU4OC0uNzQ1LjU4OC0xLjMzNCAwLS42MzYtLjE2OC0xLjEyNC0uNS0xLjQ2LS4zMzYtLjMzNS0uODY0LS41MDQtMS41ODItLjUwNEg0LjMwOHoiIGZpbGw9IiMwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('italic')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTcgM1YyaDR2MUg5Ljc1M2wtMyAxMEg4djFINHYtMWgxLjI0N2wzLTEwSDd6Ii8+PC9zdmc+' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={() => formatText('strikeThrough')}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNNC4wNCA1Ljk1NGg2LjIxNWE3LjQxMiA3LjQxMiAwIDAgMC0uNzk1LS40MzggMTEuOTA3IDExLjkwNyAwIDAgMC0xLjQ0Ny0uNTU3Yy0xLjE4OC0uMzQ4LTEuOTY2LS43MTEtMi4zMzQtMS4wODgtLjM2OC0uMzc3LS41NTItLjc3LS41NTItMS4xODEgMC0uNDk1LjE4Ny0uOTA2LjU2LTEuMjMyLjM4LS4zMzEuODg3LS40OTcgMS41MjMtLjQ5Ny42OCAwIDEuMjY2LjI1NSAxLjc1Ny43NjcuMjk1LjMxNS41ODIuODkxLjg2MSAxLjczbC4xMTcuMDE2LjcwMy4wNS4xLS4wMjRjLjAyOC0uMTUyLjA0Mi0uMjc5LjA0Mi0uMzggMC0uMzM3LS4wMzktLjg1Mi0uMTE3LTEuNTQ0YTkuMzc0IDkuMzc0IDAgMCAwLS4xNzYtLjk5NUM5Ljg4LjM3OSA5LjM4NS4yNDQgOS4wMTcuMTc2IDguMzY1LjA3IDcuODk5LjAxNiA3LjYyLjAxNmMtMS40NSAwLTIuNTQ1LjM1Ny0zLjI4NyAxLjA3MS0uNzQ3LjcyLTEuMTIgMS41ODktMS4xMiAyLjYwNyAwIC41MTEuMTMzIDEuMDQuNCAxLjU4Ni4xMjkuMjUzLjI3LjQ3OC40MjcuNjc0ek04LjI4IDguMTE0Yy41NzUuMjM2Ljk1Ny40MzYgMS4xNDcuNTk5LjQ1MS40MS42NzcuODUyLjY3NyAxLjMyNCAwIC4zODMtLjEzLjc0NS0uMzkzIDEuMDg4LS4yNS4zMzgtLjU5LjU4LTEuMDIuNzI2YTMuNDE2IDMuNDE2IDAgMCAxLTEuMTYzLjIyOGMtLjQwNyAwLS43NzUtLjA2Mi0xLjEwNC0uMTg2YTIuNjk2IDIuNjk2IDAgMCAxLS44NzgtLjQ4IDMuMTMzIDMuMTMzIDAgMCAxLS42Ny0uNzk0IDEuNTI3IDEuNTI3IDAgMCAxLS4xMDQtLjIyNyA1Ny41MjMgNTcuNTIzIDAgMCAwLS4xODgtLjQ3MyAyMS4zNzEgMjEuMzcxIDAgMCAwLS4yNTEtLjU5OWwtLjg1My4wMTd2LjM3MWwtLjAxNy4zMTNhOS45MiA5LjkyIDAgMCAwIDAgLjU3M2MuMDExLjI3LjAxNy43MDkuMDE3IDEuMzE2di4xMWMwIC4wNzkuMDIyLjE0LjA2Ny4xODUuMDgzLjA2OC4yODQuMTQ3LjYwMi4yMzdsMS4xNy4zMzdjLjQ1Mi4xMy45OTYuMTk0IDEuNjMyLjE5NC42ODYgMCAxLjI1Mi0uMDU5IDEuNjk4LS4xNzdhNC42OTQgNC42OTQgMCAwIDAgMS4yOC0uNTU3Yy40MDEtLjI1OS43MDUtLjQ4Ni45MTEtLjY4My4yNjgtLjI3Ni40NjYtLjU2OC41OTQtLjg3OGE0Ljc0IDQuNzQgMCAwIDAgLjM0My0xLjc4OGMwLS4yOTgtLjAyLS41NTctLjA1OC0uNzc2SDguMjgxek0xNC45MTQgNi41N2EuMjYuMjYgMCAwIDAtLjE5My0uMDc2SC4yNjhhLjI2LjI2IDAgMCAwLS4xOTMuMDc2LjI2NC4yNjQgMCAwIDAtLjA3NS4xOTR2LjU0YzAgLjA3OS4wMjUuMTQzLjA3NS4xOTRhLjI2LjI2IDAgMCAwIC4xOTMuMDc2SDE0LjcyYS4yNi4yNiAwIDAgMCAuMTkzLS4wNzYuMjY0LjI2NCAwIDAgMCAuMDc1LS4xOTR2LS41NGEuMjY0LjI2NCAwIDAgMC0uMDc1LS4xOTR6Ii8+PC9nPjwvc3ZnPg==' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={applyCurlyFormatting}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzQ0NCIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMS4wMjEgMi45MDZjLjE4NiAxLjIxOS4zNzIgMS41LjM3MiAyLjcxOUMxLjM5MyA2LjM3NSAwIDcuMDMxIDAgNy4wMzF2LjkzOHMxLjM5My42NTYgMS4zOTMgMS40MDZjMCAxLjIxOS0uMTg2IDEuNS0uMzcyIDIuNzE5Qy43NDMgMTQuMDYzIDEuNzY0IDE1IDIuNjkzIDE1aDEuOTV2LTEuODc1cy0xLjY3Mi4xODgtMS42NzItLjkzOGMwLS44NDMuMTg2LS44NDMuMzcyLTIuNzE4LjA5My0uODQ0LS40NjQtMS41LTEuMDIyLTEuOTY5LjU1OC0uNDY5IDEuMTE1LTEuMDMxIDEuMDIyLTEuODc1QzMuMDY0IDMuNzUgMi45NyAzLjc1IDIuOTcgMi45MDZjMC0xLjEyNSAxLjY3Mi0xLjAzMSAxLjY3Mi0xLjAzMVYwaC0xLjk1QzEuNjcgMCAuNzQzLjkzOCAxLjAyIDIuOTA2ek0xMS45NzkgMi45MDZjLS4xODYgMS4yMTktLjM3MiAxLjUtLjM3MiAyLjcxOSAwIC43NSAxLjM5MyAxLjQwNiAxLjM5MyAxLjQwNnYuOTM4cy0xLjM5My42NTYtMS4zOTMgMS40MDZjMCAxLjIxOS4xODYgMS41LjM3MiAyLjcxOS4yNzggMS45NjktLjc0MyAyLjkwNi0xLjY3MiAyLjkwNmgtMS45NXYtMS44NzVzMS42NzIuMTg4IDEuNjcyLS45MzhjMC0uODQzLS4xODYtLjg0My0uMzcyLTIuNzE4LS4wOTMtLjg0NC40NjQtMS41IDEuMDIyLTEuOTY5LS41NTgtLjQ2OS0xLjExNS0xLjAzMS0xLjAyMi0xLjg3NS4xODYtMS44NzUuMzcyLTEuODc1LjM3Mi0yLjcxOSAwLTEuMTI1LTEuNjcyLTEuMDMxLTEuNjcyLTEuMDMxVjBoMS45NWMxLjAyMiAwIDEuOTUuOTM4IDEuNjcyIDIuOTA2eiIvPjwvZz48L3N2Zz4=' />
//                                     </div>
//                                     <div className='option_toolbar' onClick={toggleEmojiPicker}>
//                                         <img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHZpZXdCb3g9IjE1LjcyOSAyMi4wODIgMTcgMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTI5LjcwOCAyNS4xMDRjLTMuMDIxLTMuMDIyLTcuOTM3LTMuMDIyLTEwLjk1OCAwLTMuMDIxIDMuMDItMy4wMiA3LjkzNiAwIDEwLjk1OCAzLjAyMSAzLjAyIDcuOTM3IDMuMDIgMTAuOTU4LS4wMDEgMy4wMi0zLjAyMSAzLjAyLTcuOTM2IDAtMTAuOTU3em0tLjg0NSAxMC4xMTJhNi41NiA2LjU2IDAgMCAxLTkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAtOS4yNjcgNi41NiA2LjU2IDAgMCAxIDkuMjY4IDAgNi41NiA2LjU2IDAgMCAxIDAgOS4yNjd6bS03LjUyNC02LjczYS45MDYuOTA2IDAgMSAxIDEuODExIDAgLjkwNi45MDYgMCAwIDEtMS44MTEgMHptNC4xMDYgMGEuOTA2LjkwNiAwIDEgMSAxLjgxMiAwIC45MDYuOTA2IDAgMCAxLTEuODEyIDB6bTIuMTQxIDMuNzA4Yy0uNTYxIDEuMjk4LTEuODc1IDIuMTM3LTMuMzQ4IDIuMTM3LTEuNTA1IDAtMi44MjctLjg0My0zLjM2OS0yLjE0N2EuNDM4LjQzOCAwIDAgMSAuODEtLjMzNmMuNDA1Ljk3NiAxLjQxIDEuNjA3IDIuNTU5IDEuNjA3IDEuMTIzIDAgMi4xMjEtLjYzMSAyLjU0NC0xLjYwOGEuNDM4LjQzOCAwIDAgMSAuODA0LjM0N3oiLz48L3N2Zz4=' />
//                                     </div>

//                                 </div>
//                                 <div className='question_variable_btn'>
//                                     <button className='btn btn-success variable_btn' onClick={toggleVariablesDropdown} >Variables  </button>
//                                 </div>
//                             </div>
//                         </div>
//                         {isVisible && (
//                             <div className="emoji_dropdown">
//                                 {emojis.map((emoji, index) => (
//                                     <span
//                                         key={index}
//                                         className="emoji_icon"
//                                         onClick={() => handleEmojiClick(emoji)}
//                                         style={{ cursor: 'pointer' }}
//                                     >
//                                         {emoji}
//                                     </span>
//                                 ))}
//                             </div>
//                         )}
//                         {isVariablesVisible && (
//                             <div className="varibles_drop_container" aria-hidden={!isVariablesVisible} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                 <div className="variables_search_bar">
//                                     <div>
//                                         <input
//                                             className=" variables_search_input"
//                                             type="text"
//                                             placeholder="Search variables"
//                                             value={searchTerm}
//                                             onChange={handleSearchChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className='varibles_drop_content'>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                         {filteredVariables.map((variable, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(variable)}>
//                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                     <div className="varibles_drop_list">
//                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                         {filterContactAttributes.map((contact, index) => (
//                                             <>
//                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleVariableClick(contact)}>
//                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                 </div>

//                                             </>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Footer Text</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='input value' />
//                     </div>

//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Button</div>
//                         <input type="text" className='edit__text__input message_input_box' placeholder='Menu Here' />
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='edit__text__label'>Select Flow</div>

//                         <Autocomplete
//                             options=''
//                             value={content}
//                             disableClearable
//                             onChange={(event, newValue) => setContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="select"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
//                     <div className='question_text_container'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Fallback Message</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>

//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isActive ? 'active' : ''}`}
//                                     style={{ marginLeft: '57px' }}
//                                     onClick={handleToggle}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>

//                         </div>
//                         <div className='fallback_subtext'>Set a fallback message for when the customer doesn’t engage with the WhatsApp flow.</div>
//                         <div className='message_templates_body'>
//                             Help us by completing the above form to continue.
//                         </div>
//                         <div className='edit__text__label'>How many times should the fallback get triggered?</div>
//                         <Autocomplete
//                             options={fallbackOptions}
//                             value={fallbackContent}
//                             disableClearable
//                             onChange={(event, newValue) => setFallbackContent(newValue)}
//                             renderInput={(params) => (
//                                 <TextField
//                                     {...params}
//                                     variant="standard"
//                                     placeholder="select"
//                                     InputProps={{
//                                         ...params.InputProps,
//                                         disableUnderline: true,
//                                         sx: {
//                                             border: '1px solid rgb(232, 234, 242)',
//                                             borderRadius: '4px',
//                                             height: '3rem',
//                                             paddingLeft: '10px',
//                                             backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
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
//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const WebhookModal = ({ show, onClose, onSave }) => {

//     const urlOptions = ['GET', 'POST'];
//     const [urlContent, setUrlContent] = useState('');

//     const variables = [
//         { title: "first_incoming_message", value: "@first_incoming_message" },

//     ];
//     const contactAttributes = [
//         { title: "actual_fare", value: '{{actual_fare}}' },
//         { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
//         { title: 'additional_items', value: '{{additional_items}}' }
//     ]
//     const [inputValue, setInputValue] = useState('');
//     const [customizeHeaderValue, setCustomizeHeaderValue] = useState('')
//     const [requestValue, setRequestValue] = useState('')
//     const [responseValue, setResponseValue] = useState('');
//     const options = ['Variable', 'Custom Attribute']
//     const [content, setContent] = useState('')

//     const [isHeaderVariables, setIsHeaderVariables] = useState(false);
//     const [isCustomizeHeaderVariables, setIsCustomizeHeaderVariables] = useState(false);
//     const [isRequestVariables, setIsRequestVariables] = useState(false);
//     const [isResponseVariables, setIsResponseVariables] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");

//     const handleSearchChange = (e) => {
//         setSearchTerm(e.target.value);
//     };
//     const filteredVariables = variables.filter(variable =>
//         variable.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     const filterContactAttributes = contactAttributes.filter(contact =>
//         contact.title.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     const toggleHeaderVariablesDropdown = () => {
//         setIsHeaderVariables((prev) => !prev);
//     }
//     const toggleCustomizeVariablesDropdown = () => {
//         setIsCustomizeHeaderVariables((prev) => !prev);
//     }
//     const toggleRequestVariablesDropdown = () => {
//         setIsRequestVariables((prev) => !prev);
//     }
//     const toggleResponseVariablesDropdown = () => {
//         setIsResponseVariables((prev) => !prev);
//     }
//     const handleHeaderVariableClick = (variable) => {
//         setInputValue(prev => prev + variable.value);
//         setIsHeaderVariables(false);
//     };
//     const handleCustomizeVariableClick = (variable) => {
//         setCustomizeHeaderValue(prev => prev + variable.value);
//         setIsCustomizeHeaderVariables(false);
//     }
//     const handleRequestVariableClick = (variable) => {
//         setRequestValue(prev => prev + variable.value);
//         setIsRequestVariables(false);
//     }
//     const handleResponseVariableClick = (variable) => {
//         setResponseValue(prev => prev + variable.value);
//         setIsResponseVariables(false);
//     }

//     const [isActive, setIsActive] = useState(false);
//     const handleToggle = () => {
//         setIsActive(!isActive);
//     }

//     const [isRequestActive, setIsRequestActive] = useState(false);
//     const handleToggleRequest = () => {
//         setIsRequestActive(!isRequestActive)
//     }
//     const [isResponseActive, setIsResponseActive] = useState(false);
//     const handleToggleResponse = () => {
//         setIsResponseActive(!isResponseActive)
//     }
//     const [isRoutingActive, setIsRoutingActive] = useState(false);
//     const handleToggleRouting = () => {
//         setIsRoutingActive(!isRoutingActive)
//     }

//     const [headers, setHeaders] = useState([{ id: Date.now() }]);
//     const addHeader = () => {
//         setHeaders([...headers, { id: Date.now() }]);
//     };

//     const deleteHeader = (id) => {
//         setHeaders(headers.filter(header => header.id !== id));
//     };
//     const [request, setRequest] = useState([{ id: Date.now() }]);
//     const addTestRequest = () => {
//         setRequest([...request, { id: Date.now() }]);
//     };

//     const deleteTestRequest = (id) => {
//         setRequest(request.filter(req => req.id !== id));
//     };
//     const [response, setResponse] = useState([{ id: Date.now() }]);
//     const addTestResponse = () => {
//         setResponse([...response, { id: Date.now() }]);
//     };

//     const deleteTestResponse = (id) => {
//         setResponse(response.filter(req => req.id !== id));
//     };

//     const [routing, setRouting] = useState([{ id: Date.now() }]);
//     const addTestRouting = () => {
//         setRouting([...routing, { id: Date.now() }]);
//     };

//     const deleteTestRouting = (id) => {
//         setRouting(routing.filter(req => req.id !== id));
//     };

//     return (
//         <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
//             <div className='chatbot_question_content'>
//                 <Modal.Header className='edit_text_material_header' closeButton>
//                     <Modal.Title className='edit_text_style'>Webhook</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className='edittext__body__content'>

//                     <div className='question_text_content'>
//                         <div className='edit__text__label'>Url & Method</div>
//                         <div className='url_set_container'>
//                             <div className='url_set_left'>
//                                 <div className='url_set_method'>
//                                     <Autocomplete
//                                         options={urlOptions}
//                                         value={urlContent}
//                                         disableClearable
//                                         onChange={(event, newValue) => setUrlContent(newValue)}
//                                         renderInput={(params) => (
//                                             <TextField
//                                                 {...params}
//                                                 variant="standard"
//                                                 placeholder=""
//                                                 InputProps={{
//                                                     ...params.InputProps,
//                                                     disableUnderline: true,
//                                                     sx: {
//                                                         border: '1px solid rgb(232, 234, 242)',
//                                                         borderRadius: '4px',
//                                                         height: '3rem',
//                                                         paddingLeft: '10px',
//                                                         fontSize: '12px',
//                                                         width: '80px',
//                                                         height: '30px',
//                                                         backgroundColor: 'white',
//                                                         '&:hover': {
//                                                             border: '1px solid green',
//                                                         },
//                                                         '&.Mui-focused': {
//                                                             border: '1px solid green',
//                                                             backgroundColor: 'white',
//                                                             outline: 'none',
//                                                         },
//                                                     },
//                                                 }}

//                                             />
//                                         )}


//                                     />
//                                 </div>
//                                 <input type="text" className='edit__text__input url_input_box' value={`http ${inputValue}`}
//                                     onChange={(e) => setInputValue(e.target.value)} />
//                             </div>
//                             <div className='url_set_variable'>

//                                 <button className='btn btn-success variable_btn' onClick={toggleHeaderVariablesDropdown}>Variables</button>
//                             </div>
//                             {isHeaderVariables && (
//                                 <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                     <div className="variables_search_bar">
//                                         <div>
//                                             <input
//                                                 className=" variables_search_input"
//                                                 type="text"
//                                                 placeholder="Search variables"
//                                                 value={searchTerm}
//                                                 onChange={handleSearchChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className='varibles_drop_content'>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                             {filteredVariables.map((variable, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(variable)}>
//                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                         <div className="varibles_drop_list">
//                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                             {filterContactAttributes.map((contact, index) => (
//                                                 <>
//                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleHeaderVariableClick(contact)}>
//                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                     </div>

//                                                 </>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                         </div>

//                     </div>
//                     <div className='question_text_container'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Customize Headers</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">optional</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isActive ? 'active' : ''}`}
//                                     onClick={handleToggle}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>
//                         </div>
//                         <div className='webhook_customize_text'>Add headers to your request (example: Content-Type: application/json)</div>
//                         <div className='customize_sub_text'>(User-Agent is not sent as a header by default. make sure you include it if necessary.)</div>
//                         {
//                             isActive && (
//                                 <div>
//                                     <div className='edit__text__label'>Edit Headers</div>
//                                     {headers.map((header) => (
//                                         <>
//                                             <div key={header.id} className='set_header_and_value'>
//                                                 <div className='set_header_value_field'>
//                                                     <div className='header_value_label'>Key</div>
//                                                     <input type="text" className='edit__text__input message_input_box' placeholder='Content-Type' />
//                                                 </div>
//                                                 <div className='set_header_value_field'>
//                                                     <div className='header_value_label'>Value</div>
//                                                     <input type="text" className='edit__text__input message_input_box' placeholder='application/json' value={customizeHeaderValue}
//                                                         onChange={(e) => setCustomizeHeaderValue(e.target.value)} />
//                                                     <button className='btn btn-success variable_btn' onClick={toggleCustomizeVariablesDropdown}>Variables</button>
//                                                 </div>

//                                                 <button type="button" className='customize_header_delete' onClick={() => deleteHeader(header.id)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
//                                             </div>
//                                             {isCustomizeHeaderVariables && (
//                                                 <div className="varibles_drop_container" aria-hidden={!isHeaderVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                                     <div className="variables_search_bar">
//                                                         <div>
//                                                             <input
//                                                                 className=" variables_search_input"
//                                                                 type="text"
//                                                                 placeholder="Search variables"
//                                                                 value={searchTerm}
//                                                                 onChange={handleSearchChange}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className='varibles_drop_content'>
//                                                         <div className="varibles_drop_list">
//                                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                                             {filteredVariables.map((variable, index) => (
//                                                                 <>
//                                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleCustomizeVariableClick(variable)}>
//                                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                                     </div>

//                                                                 </>
//                                                             ))}
//                                                         </div>
//                                                         <div className="varibles_drop_list">
//                                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                                             {filterContactAttributes.map((contact, index) => (
//                                                                 <>
//                                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleCustomizeVariableClick(contact)}>
//                                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                                     </div>

//                                                                 </>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </>
//                                     ))}
//                                     <button className='footer__cancel__btn condition__add ' onClick={addHeader} >Add Header</button>
//                                 </div>

//                             )
//                         }



//                     </div>
//                     <div className='question_text_container'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Test Your Request</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">optional</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isRequestActive ? 'active' : ''}`}
//                                     onClick={handleToggleRequest}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>
//                         </div>
//                         <div className='webhook_customize_text'>Manually set values for test variables</div>
//                         <div className='customize_sub_text'>(If your request contains variables, you can manually set their values for testing purposes.)</div>
//                         <button className='btn btn-success'>Test the Request</button>
//                         {
//                             isRequestActive && (
//                                 <div>
//                                     <div className='edit__text__label'>Edit Test Variables</div>
//                                     {request.map((req) => (
//                                         <>
//                                             <div key={req.id} className='set_header_and_value'>
//                                                 <div className='set_header_value_field'>
//                                                     <div className='header_value_label'>Variable Name</div>
//                                                     <input type="text" className='edit__text__input message_input_box' placeholder='Search Variables' value={requestValue}
//                                                         onChange={(e) => setRequestValue(e.target.value)} />
//                                                 </div>
//                                                 <div className='set_header_value_field'>
//                                                     <div className='header_value_label'>Test Value</div>
//                                                     <input type="text" className='edit__text__input message_input_box' placeholder='application/json'
//                                                     />

//                                                 </div>

//                                                 <button type="button" className='customize_header_delete' onClick={() => deleteTestRequest(req.id)}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>

//                                             </div>
//                                             <div> <button className='btn btn-success variable_btn' onClick={toggleRequestVariablesDropdown}>Variables</button></div>
//                                             {isRequestVariables && (
//                                                 <div className="varibles_drop_container" aria-hidden={!isRequestVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                                     <div className="variables_search_bar">
//                                                         <div>
//                                                             <input
//                                                                 className=" variables_search_input"
//                                                                 type="text"
//                                                                 placeholder="Search variables"
//                                                                 value={searchTerm}
//                                                                 onChange={handleSearchChange}
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     <div className='varibles_drop_content'>
//                                                         <div className="varibles_drop_list">
//                                                             <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                                             {filteredVariables.map((variable, index) => (
//                                                                 <>
//                                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleRequestVariableClick(variable)}>
//                                                                         <span className="variable_list_item_title">{variable.title}</span>
//                                                                         <span className="variable_list_item_value">{variable.value}</span>
//                                                                     </div>

//                                                                 </>
//                                                             ))}
//                                                         </div>
//                                                         <div className="varibles_drop_list">
//                                                             <div className="varibles_drop_list_header">Contact Attributes</div>
//                                                             {filterContactAttributes.map((contact, index) => (
//                                                                 <>
//                                                                     <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleRequestVariableClick(contact)}>
//                                                                         <span className="variable_list_item_title">{contact.title}</span>
//                                                                         <span className="variable_list_item_value">{contact.value}</span>
//                                                                     </div>

//                                                                 </>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </>
//                                     ))}
//                                     <div className='test_variables_add'>
//                                         <button className='footer__cancel__btn condition__add ' onClick={addTestRequest} >Add Test Variables</button></div>
//                                 </div>

//                             )
//                         }



//                     </div>
//                     <div className='question_text_container'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Save Responses as Variables</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">optional</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isResponseActive ? 'active' : ''}`}
//                                     onClick={handleToggleResponse}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>
//                         </div>
//                         {
//                             isResponseActive &&
//                             <>
//                                 <div className='customize_sub_text'><b>Select from the dropdown below</b> to save a specific part of the response as a variable (you must test the request first).</div>
//                                 <div className='customize_sub_text'>  Useful for displaying dynamic data from external sources as buttons or messages.</div>
//                                 <div className='edit__text__label'>Edit Response Variables</div>
//                                 <Autocomplete
//                                     options={options}
//                                     value={content}
//                                     disableClearable
//                                     onChange={(event, newValue) => setContent(newValue)}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             variant="standard"
//                                             placeholder="Input value & Please enter to search"
//                                             InputProps={{
//                                                 ...params.InputProps,
//                                                 disableUnderline: true,
//                                                 sx: {
//                                                     border: '1px solid rgb(232, 234, 242)',
//                                                     borderRadius: '4px',
//                                                     height: '3rem',
//                                                     paddingLeft: '10px',
//                                                     fontSize: '12px',
//                                                     marginBottom: '10px',
//                                                     backgroundColor: content ? 'white' : 'rgb(245, 246, 250)',
//                                                     '&:hover': {
//                                                         border: '1px solid green',
//                                                     },
//                                                     '&.Mui-focused': {
//                                                         border: '1px solid green',
//                                                         backgroundColor: 'white',
//                                                         outline: 'none',
//                                                     },
//                                                 },
//                                             }}

//                                         />
//                                     )}

//                                 />
//                                 {response.map((res) => (
//                                     <>
//                                         <div key={res.id} className='set_header_and_value'>
//                                             <div className='set_header_value_field'>
//                                                 <div className='header_value_label'>Variable Name</div>
//                                                 <input type="text" className='edit__text__input message_input_box' placeholder='Type value or select' value={responseValue}
//                                                     onChange={(e) => setResponseValue(e.target.value)}
//                                                 />
//                                             </div>
//                                             <div className='set_header_value_field'>
//                                                 <div className='header_value_label'>Entire Response Body</div>
//                                                 <input type="text" className='edit__text__input message_input_box'
//                                                 />

//                                             </div>

//                                             <button type="button" className='customize_header_delete' onClick={() => deleteTestResponse(res.id)} ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>

//                                         </div>
//                                         <div> <button className='btn btn-success variable_btn' onClick={toggleResponseVariablesDropdown}>Variables</button></div>
//                                         {isResponseVariables && (
//                                             <div className="varibles_drop_container" aria-hidden={!isResponseVariables} aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
//                                                 <div className="variables_search_bar">
//                                                     <div>
//                                                         <input
//                                                             className=" variables_search_input"
//                                                             type="text"
//                                                             placeholder="Search variables"
//                                                             value={searchTerm}
//                                                             onChange={handleSearchChange}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                                 <div className='varibles_drop_content'>
//                                                     <div className="varibles_drop_list">
//                                                         <div className="varibles_drop_list_header">Chatbot Input Variables</div>
//                                                         {filteredVariables.map((variable, index) => (
//                                                             <>
//                                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleResponseVariableClick(variable)}>
//                                                                     <span className="variable_list_item_title">{variable.title}</span>
//                                                                     <span className="variable_list_item_value">{variable.value}</span>
//                                                                 </div>

//                                                             </>
//                                                         ))}
//                                                     </div>
//                                                     <div className="varibles_drop_list">
//                                                         <div className="varibles_drop_list_header">Contact Attributes</div>
//                                                         {filterContactAttributes.map((contact, index) => (
//                                                             <>
//                                                                 <div key={index} className="varibles_drop_list_item" aria-hidden="true" onClick={() => handleResponseVariableClick(contact)}>
//                                                                     <span className="variable_list_item_title">{contact.title}</span>
//                                                                     <span className="variable_list_item_value">{contact.value}</span>
//                                                                 </div>

//                                                             </>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 ))}
//                                 <div className='test_variables_add'>
//                                     <button className='footer__cancel__btn condition__add ' onClick={addTestResponse} >Add Response Variables</button></div>

//                             </>
//                         }
//                     </div>
//                     <div className='question_text_container'>
//                         <div className='question_accept_container media_header_text'>
//                             <div className='edit__text__label'>Response Routing</div>

//                             <div className='holidaytoggle' style={{ width: '100px' }}>
//                                 <label className="toggle-label">optional</label>
//                                 <button
//                                     type="button"
//                                     className={`toggle__control ${isRoutingActive ? 'active' : ''}`}
//                                     onClick={handleToggleRouting}
//                                     aria-label="Toggle"

//                                 >
//                                     <div className='toggle-indicator'></div>
//                                 </button>

//                             </div>
//                         </div>
//                         <div className='webhook_customize_text'>Split your chatbot based on response status codes (200, 400, 500, etc).</div>
//                         {
//                             isRoutingActive &&

//                             <>
//                                 <div>
//                                     <div class="edit__text__label">Expected Status</div>
//                                     {routing.map((data) => (
//                                         <div key={data.id}>
//                                             <input type="text" class="edit__text__input section_text_box" placeholder="200" style={{ background: 'rgb(245, 246, 250)' }} />
//                                             <button class="list_row_delete">
//                                                 <svg
//                                                     width="20"
//                                                     height="20"
//                                                     viewBox="0 0 20 20"
//                                                     fill="none"
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     style={{ stroke: 'red' }}
//                                                     onClick={() => deleteTestRouting(data.id)}

//                                                 >
//                                                     <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path>
//                                                     <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round"></path>
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                     ))}

//                                 </div>
//                                 <div className='test_variables_add'>
//                                     <button className='footer__cancel__btn condition__add ' onClick={addTestRouting} >Add Expected Status</button></div>
//                             </>

//                         }

//                     </div>


//                     <div className='edit__text__save'>
//                         <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
//                         <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
//                     </div>
//                 </Modal.Body>
//             </div>
//         </Modal>
//     );
// };
// const GridBackground = ({ scale }) => (
//     <svg
//         style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             pointerEvents: 'none',
//             transform: `scale(${scale})`,
//             transformOrigin: '0 0', // Ensures scaling from the top left
//         }}
//     >
//         <defs>
//             <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
//                 <line x1="20" y1="0" x2="20" y2="20" stroke="gray" strokeWidth="0.5" />
//                 <line x1="0" y1="20" x2="20" y2="20" stroke="gray" strokeWidth="0.5" />
//             </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#grid)" />
//     </svg>
// );

// const EditChatbotPage = ({ chatbotName }) => {

//     const [nodes, setNodes, onNodesChange] = useNodesState([]);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//     const [isLeftContainerVisible, setIsLeftContainerVisible] = useState(true);
//     const [showAskQuestioncontent, setAskQuestionContent] = useState(false);
//     const [cardContent, setCardContent] = useState([]);
//     const [selectedCardIndex, setSelectedCardIndex] = React.useState(null);
//     const [connections, setConnections] = React.useState([]);
//     const [draggingCard, setDraggingCard] = useState(null);
//     const [offset, setOffset] = useState({ x: 0, y: 0 });
//     const [showModal, setShowModal] = useState(false);
//     const [questionModal, setQuestionModal] = useState(false);
//     const [buttonModal, setButtonModal] = useState(false);
//     const [listModal, setListModal] = useState(false);
//     const [updateAttributeModal, setUpdateAttributeModal] = useState(false)
//     const [tagsModal, setTagsModal] = useState(false);
//     const [assignToTeamModal, setAssignToTeamModal] = useState(false);
//     const [assignToUserModal, setAssignToUserModal] = useState(false);
//     const [triggerChatbotModal, setTriggerChatbotModal] = useState(false);
//     const [updateChatModal, setUpdateChatModal] = useState(false);
//     const [timedelayModal, setTimeDelayModal] = useState(false);
//     const [templateModal, setTemplateModal] = useState(false);
//     const [whatsappFlowModal, setWhatsappFlowModal] = useState(false);
//     const [webhookModal, setWebhookModal] = useState(false);
//     const [EditChatbotModal, setEditChatbotModal] = useState(false);
//     const [currentChatbotName, setCurrentChatbotName] = useState(chatbotName);

//     const onConnect = useCallback(
//         (params) =>
//             setEdges((els) =>
//                 addEdge(
//                     {
//                         ...params,
//                         style: { stroke: 'rgb(181, 181, 181)', strokeDasharray: '5 5' },
//                         markerEnd: { type: 'arrowclosed', color: 'gray', fill: 'none', },
//                         strokeWidth: 2
//                     },
//                     els
//                 )
//             ),
//         []
//     );

//     const handleComponentClick = (nodeId) => {
//         const nodeToAdd = initialNodesData[nodeId];

//         // Generate a unique ID 
//         const newId = `${nodeId}-${nodes.filter(node => node.id.startsWith(nodeId)).length + 1}`;
//         console.log('New ID being created:', newId);

//         // Update position for the new node
//         const newPosition = {
//             x: nodeToAdd.position.x,
//             y: nodes.length * 100,
//         };

//         const newNode = {
//             ...nodeToAdd,
//             id: newId,
//             position: newPosition,
//             data: {
//                 label: React.cloneElement(nodeToAdd.data.label, {
//                     onDelete: () => handleDeleteNode(newId),
//                     onCopy: () => handleCopyNode(newId),
//                 }),

//             }


//         };

//         // Update the nodes state
//         setNodes((prevNodes) => {
//             const updatedNodes = [...prevNodes, newNode];
//             console.log('Current nodes after adding:', updatedNodes);
//             return updatedNodes;
//         });
//     };

//     const toggleLeftContainer = () => {
//         setIsLeftContainerVisible(prevState => !prevState);
//     };


//     const handleAskQuestionContent = () => {
//         setAskQuestionContent(true);
//     }
//     const handleAskQuestionBackBtn = () => {
//         setAskQuestionContent(false);
//     }
//     const handleConditionComponent = () => {
//         setShowModal(true);
//     }
//     const handleCloseCondtion = () => {
//         setShowModal(false);
//     }
//     const handleSaveCondition = () => {
//         setShowModal(false)
//     }
//     const handleQuestion = () => {
//         setQuestionModal(true);
//     }
//     const handleCloseQuestion = () => {
//         setQuestionModal(false);
//     }
//     const handleSaveQuestion = () => {
//         setQuestionModal(false);
//     }
//     const handleButtons = () => {
//         setButtonModal(true);
//     }
//     const handleCloseButtonModal = () => {
//         setButtonModal(false);
//     }
//     const handleSaveButtonModal = () => {
//         setButtonModal(false);
//     }
//     const handleList = () => {
//         setListModal(true)
//     }
//     const handleCloseListModal = () => {
//         setListModal(false);
//     }
//     const handleSaveListModal = () => {
//         setListModal(false)
//     }
//     const handleUpdateAttributes = () => {
//         setUpdateAttributeModal(true)
//     }
//     const handleCloseUpdateModal = () => {
//         setUpdateAttributeModal(false);
//     }
//     const handleSaveUpdate = () => {
//         setUpdateAttributeModal(false)
//     }
//     const handleTags = () => {
//         setTagsModal(true)
//     }
//     const handleCloseTagsModal = () => {
//         setTagsModal(false);
//     }
//     const handleSaveTags = () => {
//         setTagsModal(false)
//     }
//     const handleAssignToTeam = () => {
//         setAssignToTeamModal(true);
//     }
//     const handleCloseAssignToTeam = () => {
//         setAssignToTeamModal(false);
//     }
//     const handleSaveAssignToTeam = () => {
//         setAssignToTeamModal(false);
//     }
//     const handleAssignToUser = () => {
//         setAssignToUserModal(true);
//     }
//     const handleCloseAssignToUser = () => {
//         setAssignToUserModal(false);
//     }
//     const handleSaveAssignToUser = () => {
//         setAssignToUserModal(false);
//     }
//     const handleTriggerChatbot = () => {
//         setTriggerChatbotModal(true);
//     }
//     const handleCloseTriggerChatbot = () => {
//         setTriggerChatbotModal(false);
//     }
//     const handleSaveTriggerChatbot = () => {
//         setTriggerChatbotModal(false);
//     }
//     const handleUpdateChat = () => {
//         setUpdateChatModal(true);
//     }
//     const handleCloseUpdateChatModal = () => {
//         setUpdateChatModal(false);
//     }
//     const handleSaveUpdateChat = () => {
//         setUpdateChatModal(false);
//     }
//     const handleTimeDelay = () => {
//         setTimeDelayModal(true);
//     }
//     const handleCloseTimeDelay = () => {
//         setTimeDelayModal(false);
//     }
//     const handleSaveTimeDelay = () => {
//         setTimeDelayModal(false);
//     }
//     const handleTemplates = () => {
//         setTemplateModal(true);
//     }
//     const handleCloseTemplates = () => {
//         setTemplateModal(false);
//     }
//     const handleSaveTemplates = () => {
//         setTemplateModal(false);
//     }
//     const handleWhatsappFlow = () => {
//         setWhatsappFlowModal(true);
//     }
//     const handleCloseWhatsappFlow = () => {
//         setWhatsappFlowModal(false);
//     }
//     const handleSaveWhatsappFlow = () => {
//         setWhatsappFlowModal(false);
//     }
//     const handleWebhook = () => {
//         setWebhookModal(true);
//     }
//     const handleCloseWebhook = () => {
//         setWebhookModal(false);
//     }
//     const handleSaveWebhook = () => {
//         setWebhookModal(false);
//     }
//     const handleEditClick = () => {
//         setEditChatbotModal(true);
//     }
//     const handleCloseEditchatbotModal = () => {
//         setEditChatbotModal(false);
//     }
//     const handleSaveEditchatbot = (updatedName) => {
//         setEditChatbotModal(false)
//         setCurrentChatbotName(updatedName);
//     }

//     const handleDeleteNode = (nodeId) => {
//         setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
//     };

//     const handleCopyNode = (nodeId) => {
//         setNodes((prevNodes) => {
//             // Locate the original node to copy
//             const nodeToCopy = prevNodes.find((node) => node.id === nodeId);

//             if (nodeToCopy) {
//                 // Generate a unique id
//                 const newNodeId = `copy-${Date.now()}`;

//                 // Create a copy of the node
//                 const newNode = {
//                     id: newNodeId,
//                     type: nodeToCopy.type,
//                     position: {
//                         x: nodeToCopy.position.x + 150,
//                         y: nodeToCopy.position.y + 150,
//                     },
//                     sourcePosition: nodeToCopy.sourcePosition, targetPosition: nodeToCopy.targetPosition,
//                     style: { ...nodeToCopy.style },
//                     data: {
//                         ...nodeToCopy.data,
//                         label: React.cloneElement(nodeToCopy.data.label, {
//                             onCopy: () => handleCopyNode(newNodeId),
//                             onDelete: () => handleDeleteNode(newNodeId)
//                         }),
//                     },
//                 };



//                 return [...prevNodes, newNode];
//             } else {
//                 console.error('Node not found:', nodeId);
//                 return prevNodes;
//             }
//         });
//     };

//     const NodeWithHandles = ({ title, color, onTitleClick, headerBackgroundColor, titleColor, content, onCopy, onDelete, height, width, showEditButton }) => (
//         <div >
//             <Card title={title} onTitleClick={onTitleClick} headerBackgroundColor={headerBackgroundColor} titleColor={titleColor} content={content} onCopy={onCopy} onDelete={onDelete} height={height} width={width} showEditButton={showEditButton} />

//             <Handle
//                 type="target"
//                 position="left"
//                 style={{ backgroundColor: 'white', width: 3, height: 3, zIndex: 10, }}
//             />

//             <Handle
//                 type="source"
//                 position="right"
//                 style={{ backgroundColor: color, width: 10, height: 10, borderRadius: '50%', zIndex: 10, }}
//             />
//         </div>
//     );

//     const initialNodesData = {
//         1: { id: '1', data: { label: <NodeWithHandles title="Send a message" onTitleClick={() => { }} headerBackgroundColor='#e95b69' titleColor='white' content={<MessageOption />} color='#e95b69' showEditButton={false} /> }, position: { x: 100, y: -100 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#3ccfa0', outline: 'none' } },
//         2: { id: '2', data: { label: <NodeWithHandles title='Question' onTitleClick={handleQuestion} headerBackgroundColor="#ff9933" titleColor="white" content={<div className='condition_text'></div>} color='#ff9933' showEditButton={true} /> }, position: { x: 300, y: -50 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#6080e6' } },
//         3: {
//             id: '3', data: {
//                 label: <NodeWithHandles title='Buttons' onTitleClick={handleButtons} headerBackgroundColor='#ff9933' titleColor='white' content={<div >
//                     <div className='condition_text'>Ask a question here</div>
//                     <div className='buttons_card'><div className='button_node_answer'>Answer 1</div><div className='button_node_answer default_box'>Default</div></div></div>} color='white' showEditButton={true} />
//             }, position: { x: 150, y: 0 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#ffcc00' }
//         },
//         4: {
//             id: '4', data: {
//                 label: <NodeWithHandles title='List' onTitleClick={handleList} headerBackgroundColor='#ff9933' titleColor='white' content={<div >
//                     <div className='condition_text'>default body</div>
//                     <div className='buttons_card'>
//                         <div className='button_node_answer menu_box'>Menu Here</div>
//                         <div className='button_node_answer'>default row</div>
//                         <div className='button_node_answer default_box'>Default</div>
//                     </div>
//                 </div>} color='white' showEditButton={true} />
//             }, position: { x: 250, y: 200 }, sourcePosition: Position.Right, targetPosition: Position.Left, style: { padding: 0, width: '300px', border: 'none', fill: '#ffcc00' }
//         },
//         5: { id: '5', data: { label: <NodeWithHandles title='Set a condition' onTitleClick={handleConditionComponent} headerBackgroundColor="#6c7ed6" titleColor="white" content={<div className='condition_text'>This is condition content</div>} color='#e95b69' showEditButton={true} /> }, position: { x: 300, y: 250 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#45cf72' } },
//         6: { id: '6', data: { label: <NodeWithHandles title='Subscribe' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='#ff9933' showEditButton={false} /> }, position: { x: 300, y: 300 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #f2aa4c', fill: '#ffcf06' } },
//         7: { id: '7', data: { label: <NodeWithHandles title='Unsubscribe' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='#ff9933' showEditButton={false} /> }, position: { x: 300, y: 350 }, style: { padding: 0, width: '220px', border: '2px solid #f2aa4c', fill: '#ffcf06' } },
//         8: { id: '8', data: { label: <NodeWithHandles title='Update Attribute' onTitleClick={handleUpdateAttributes} titleColor="black" height='55px' width='215px' color='rgb(227, 119, 76)' showEditButton={true} /> }, position: { x: 300, y: 400 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #e3774c', fill: '#f48f62' } },
//         9: { id: '9', data: { label: <NodeWithHandles title='Set tags' onTitleClick={handleTags} titleColor="black" height='55px' width='215px' color='#e60044' showEditButton={true} /> }, position: { x: 300, y: 450 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ecda40', fill: '#e60044' } },
//         10: { id: '10', data: { label: <NodeWithHandles title='Assign to Team' onTitleClick={handleAssignToTeam} titleColor="black" height='55px' width='215px' color='#545ee2' showEditButton={true} /> }, position: { x: 300, y: 500 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #545ee2', fill: '#f4929a' } },
//         11: { id: '11', data: { label: <NodeWithHandles title='Assign to User' onTitleClick={handleAssignToUser} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 550 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #75c595', fill: '#68a8cf' } },
//         12: { id: '12', data: { label: <NodeWithHandles title='Trigger Chatbot' onTitleClick={handleTriggerChatbot} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 600 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #4aa1ea', fill: '#fa1f11' } },
//         13: { id: '13', data: { label: <NodeWithHandles title='Update Chat Status' onTitleClick={handleUpdateChat} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 650 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ec8f99', fill: '#fa9f98' } },
//         14: { id: '14', data: { label: <NodeWithHandles title='Template' onTitleClick={handleTemplates} titleColor="black" height='55px' width='215px' color='#e0affd' showEditButton={true} /> }, position: { x: 300, y: 700 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #e0affd', fill: '#ffcc00' } },
//         15: { id: '15', data: { label: <NodeWithHandles title='Time Delay' onTitleClick={handleTimeDelay} titleColor="black" height='55px' width='215px' color='#a4e1e1' showEditButton={true} /> }, position: { x: 300, y: 750 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #a4e1e1', fill: '#31e30e' } },
//         16: { id: '16', data: { label: <NodeWithHandles title='Whatsapp Flows' onTitleClick={handleWhatsappFlow} titleColor="black" height='55px' width='215px' color='#37c96e' showEditButton={true} /> }, position: { x: 300, y: 800 }, style: { padding: 0, width: '220px', border: '2px solid #37c96e', fill: '#ffcc00' } },
//         17: { id: '17', data: { label: <NodeWithHandles title='Webhook' onTitleClick={handleWebhook} titleColor="black" height='55px' width='215px' color='ff9100' showEditButton={true} /> }, position: { x: 300, y: 850 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ff9100', fill: '#e02e80' } },
//         18: { id: '18', data: { label: <NodeWithHandles title='Google Spreadsheet' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 900 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #51b177', fill: '#ffcc00' } },
//         19: { id: '19', data: { label: <NodeWithHandles title='Sets' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 950 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #87ceff', fill: '#ffcc00' } },
//         20: { id: '20', data: { label: <NodeWithHandles title='Product' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 1000 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #c69af2', fill: '#ffcc00' } },
//     };



//     return (
//         <>

//             {
//                 EditChatbotModal &&
//                 <EditChatNameModal initialName={currentChatbotName} show={EditChatbotModal} onClose={handleCloseEditchatbotModal} onSave={handleSaveEditchatbot} />
//             }
//             {
//                 showModal &&
//                 <ConditionModal show={showModal} onClose={handleCloseCondtion} onSave={handleSaveCondition} />
//             }
//             {
//                 questionModal &&
//                 <QuestionModal show={questionModal} onClose={handleCloseQuestion} onSave={handleSaveQuestion} />
//             }
//             {
//                 buttonModal &&
//                 <ButtonsModal show={buttonModal} onClose={handleCloseButtonModal} onSave={handleSaveButtonModal} />
//             }
//             {
//                 listModal &&
//                 <ListModal show={listModal} onClose={handleCloseListModal} onSave={handleSaveListModal} />
//             }
//             {
//                 updateAttributeModal &&
//                 <UpdateAttributesModal show={updateAttributeModal} onClose={handleCloseUpdateModal} onSave={handleSaveUpdate} />
//             }
//             {
//                 tagsModal &&
//                 <SetTagsModal show={tagsModal} onClose={handleCloseTagsModal} onSave={handleSaveTags} />
//             }
//             {
//                 assignToTeamModal &&
//                 <AssignToTeamModal show={assignToTeamModal} onClose={handleCloseAssignToTeam} onSave={handleSaveAssignToTeam} />
//             }
//             {
//                 assignToUserModal &&
//                 <AssignToUserModal show={assignToUserModal} onClose={handleCloseAssignToUser} onSave={handleSaveAssignToUser} />
//             }
//             {
//                 triggerChatbotModal &&
//                 <TriggerChatbotModal show={triggerChatbotModal} onClose={handleCloseTriggerChatbot} onSave={handleSaveTriggerChatbot} />
//             }
//             {
//                 updateChatModal &&
//                 <UpdateChatModal show={updateChatModal} onClose={handleCloseUpdateChatModal} onSave={handleSaveUpdateChat} />
//             }
//             {
//                 timedelayModal &&
//                 <SetTimeDelayModal show={timedelayModal} onClose={handleCloseTimeDelay} onSave={handleSaveTimeDelay} />
//             }
//             {
//                 templateModal &&
//                 <TemplatesModal show={templateModal} onClose={handleCloseTemplates} onSave={handleSaveTemplates} />
//             }
//             {
//                 whatsappFlowModal &&
//                 <WhatsappFlowModal show={whatsappFlowModal} onClose={handleCloseWhatsappFlow} onSave={handleSaveWhatsappFlow} />
//             }
//             {
//                 webhookModal &&
//                 <WebhookModal show={webhookModal} onClose={handleCloseWebhook} onSave={handleSaveWebhook} />
//             }
//             <div className='editchatbot_container'>

//                 <div className='editchatbot_left_container' style={{ marginLeft: isLeftContainerVisible ? '0' : '-260px' }}
//                 >
//                     <div className='editchatbot_left_content'>
//                         {
//                             showAskQuestioncontent ?
//                                 (
//                                     <>
//                                         <div className='ask_question_container'>
//                                             <button className='askquestion_backbtn' onClick={handleAskQuestionBackBtn}>
//                                                 <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
//                                             </button>
//                                             <div className='operation_text'>Ask a question</div>

//                                         </div>
//                                         <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path fill="white" d="M18.85 24.7C20.4015 24.7 21.8895 24.0837 22.9866 22.9866C24.0837 21.8895 24.7 20.4015 24.7 18.85C24.7 17.2985 24.0837 15.8105 22.9866 14.7134C21.8895 13.6163 20.4015 13 18.85 13C17.2985 13 15.8105 13.6163 14.7134 14.7134C13.6163 15.8105 13 17.2985 13 18.85C13 20.4015 13.6163 21.8895 14.7134 22.9866C15.8105 24.0837 17.2985 24.7 18.85 24.7ZM19.6612 22.1065C19.6656 22.2158 19.6478 22.325 19.609 22.4273C19.5702 22.5296 19.5111 22.623 19.4352 22.7019C19.3594 22.7808 19.2685 22.8436 19.1678 22.8865C19.0671 22.9294 18.9588 22.9515 18.8493 22.9515C18.7399 22.9515 18.6316 22.9294 18.5309 22.8865C18.4302 22.8436 18.3393 22.7808 18.2635 22.7019C18.1876 22.623 18.1285 22.5296 18.0897 22.4273C18.0509 22.325 18.0331 22.2158 18.0375 22.1065C18.0375 21.891 18.1231 21.6843 18.2755 21.532C18.4278 21.3796 18.6345 21.294 18.85 21.294C19.0655 21.294 19.2722 21.3796 19.4245 21.532C19.5769 21.6843 19.6625 21.891 19.6625 22.1065H19.6612ZM21.2602 17.4889C21.2602 18.2507 20.9807 18.6693 20.3138 19.2036L19.9537 19.4818C19.6339 19.734 19.526 19.8718 19.5039 20.0642L19.4896 20.267C19.4607 20.4268 19.3729 20.57 19.2437 20.6684C19.1144 20.7668 18.953 20.8132 18.7913 20.7985C18.6295 20.7839 18.4791 20.7092 18.3697 20.5891C18.2602 20.4691 18.1997 20.3124 18.2 20.15C18.2 19.409 18.473 19.0008 19.1308 18.4756L19.4922 18.1961C19.8666 17.8971 19.9602 17.7515 19.9602 17.4889C19.9602 16.7635 19.4636 16.2539 18.85 16.2539C18.2078 16.2539 17.7333 16.7297 17.7398 17.4824C17.7407 17.5678 17.7247 17.6525 17.6928 17.7316C17.6609 17.8108 17.6138 17.883 17.554 17.9439C17.4943 18.0049 17.4231 18.0535 17.3445 18.0869C17.266 18.1204 17.1817 18.138 17.0963 18.1389C17.0109 18.1398 16.9262 18.1238 16.8471 18.0919C16.7679 18.06 16.6957 18.0129 16.6348 17.9531C16.5738 17.8934 16.5252 17.8222 16.4918 17.7436C16.4583 17.6651 16.4407 17.5808 16.4398 17.4954C16.4268 16.0173 17.4876 14.9539 18.85 14.9539C20.1903 14.9539 21.2589 16.0537 21.2589 17.4889H21.2602Z"></path>
//                                             <path fill="white" d="M11.7 2.59961C10.3209 2.59961 8.99823 3.14746 8.02304 4.12265C7.04786 5.09784 6.5 6.42048 6.5 7.79961C6.5 9.17873 7.04786 10.5014 8.02304 11.4766C8.99823 12.4518 10.3209 12.9996 11.7 12.9996C13.0791 12.9996 14.4018 12.4518 15.377 11.4766C16.3521 10.5014 16.9 9.17873 16.9 7.79961C16.9 6.42048 16.3521 5.09784 15.377 4.12265C14.4018 3.14746 13.0791 2.59961 11.7 2.59961Z"></path>
//                                             <path fill="white" d="M5.21131 14.2988C4.86894 14.2975 4.52966 14.3637 4.21294 14.4937C3.89622 14.6238 3.60828 14.8151 3.36565 15.0566C3.12301 15.2982 2.93044 15.5852 2.79899 15.9014C2.66753 16.2175 2.59978 16.5565 2.59961 16.8988C2.59961 19.0971 3.68251 20.7547 5.37511 21.835C7.04171 22.8971 9.28811 23.3988 11.6996 23.3988C12.2326 23.3988 12.7604 23.3742 13.2726 23.3248C12.252 22.0565 11.6968 20.4768 11.6996 18.8488C11.6996 17.1198 12.3132 15.5338 13.3337 14.2988H5.21261H5.21131Z"></path>
//                                         </svg>}
//                                             title='Question'
//                                             subtitle='Ask anything to the user'
//                                             backgroundColor='#ff9933'
//                                             background='#ffb062'

//                                             onClick={() => handleComponentClick(2)}
//                                         />
//                                         <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path fill="white" d="M13.0003 2.16602C7.02033 2.16602 2.16699 7.01935 2.16699 12.9993C2.16699 18.9793 7.02033 23.8327 13.0003 23.8327C18.9803 23.8327 23.8337 18.9793 23.8337 12.9993C23.8337 7.01935 18.9803 2.16602 13.0003 2.16602ZM13.0003 21.666C8.21199 21.666 4.33366 17.7877 4.33366 12.9993C4.33366 8.21102 8.21199 4.33268 13.0003 4.33268C17.7887 4.33268 21.667 8.21102 21.667 12.9993C21.667 17.7877 17.7887 21.666 13.0003 21.666Z"></path>
//                                             <path fill="white" d="M12.9997 18.4173C15.9912 18.4173 18.4163 15.9922 18.4163 13.0007C18.4163 10.0091 15.9912 7.58398 12.9997 7.58398C10.0081 7.58398 7.58301 10.0091 7.58301 13.0007C7.58301 15.9922 10.0081 18.4173 12.9997 18.4173Z"></path>
//                                         </svg>}
//                                             title='Buttons'
//                                             subtitle='Choices based on buttons (Maximum of 3 choices)'
//                                             backgroundColor='#ff9933'
//                                             background='#ffb062'

//                                             onClick={() => handleComponentClick(3)}
//                                         />
//                                         <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 5.95833L5.41699 7.58333L8.12533 4.875"></path>
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 12.4583L5.41699 14.0833L8.12533 11.375"></path>
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 18.9583L5.41699 20.5833L8.12533 17.875"></path>
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 6.5H21.667"></path>
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 13H21.667"></path>
//                                             <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 19.5H21.667"></path>
//                                         </svg>}
//                                             title='List'
//                                             subtitle='Choices based on buttons (Maximum of 10 choices)'
//                                             backgroundColor='#ff9933'
//                                             background='#ffb062'

//                                             onClick={() => handleComponentClick(4)}
//                                         />
//                                     </>
//                                 )
//                                 :
//                                 (
//                                     <>
//                                         <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path fill="white" d="M10.0939 3.60187C6.871 4.3305 4.34214 6.80736 3.56626 9.99529C3.142 11.7385 3.14588 13.5727 3.57014 15.3159C4.35814 18.5537 6.67613 21.2483 9.78568 22.5039L9.92122 22.5586C11.2668 23.1019 12.8083 22.4476 13.3605 21.1143C13.5124 20.7474 13.8743 20.504 14.2741 20.504H15.4915C18.8028 20.504 21.6833 18.2541 22.4605 15.0606C22.8465 13.4747 22.8465 11.8205 22.4605 10.2347L22.3586 9.81595C21.6095 6.73788 19.1678 4.34638 16.0559 3.64286L15.6188 3.54403C13.8847 3.15199 12.0839 3.15199 10.3498 3.54403L10.0939 3.60187ZM9.21044 9.06391C8.79359 9.06391 8.45568 9.39918 8.45568 9.81275C8.45568 10.2263 8.79359 10.5616 9.21044 10.5616H16.1291C16.546 10.5616 16.8839 10.2263 16.8839 9.81275C16.8839 9.39918 16.546 9.06391 16.1291 9.06391H9.21044ZM10.4684 12.8081C10.0515 12.8081 9.71362 13.1434 9.71362 13.5569C9.71362 13.9705 10.0515 14.3058 10.4684 14.3058H14.8712C15.288 14.3058 15.6259 13.9705 15.6259 13.5569C15.6259 13.1434 15.288 12.8081 14.8712 12.8081H10.4684Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                         </svg>}
//                                             title='Send a message'
//                                             subtitle='With no response required from visitor'
//                                             backgroundColor='#e95b69'
//                                             background='#ee7d88'

//                                             onClick={() => handleComponentClick(1)}
//                                         />
//                                         <EditNavContent onClick={handleAskQuestionContent} svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path fill="white" d="M3.62234 9.78223C3.12589 11.8987 3.12589 14.1013 3.62234 16.2178C4.33929 19.2742 6.72578 21.6607 9.78222 22.3777C11.8987 22.8741 14.1013 22.8741 16.2178 22.3777C19.2742 21.6607 21.6607 19.2742 22.3777 16.2178C22.8741 14.1013 22.8741 11.8987 22.3777 9.78223C21.6607 6.72578 19.2742 4.33928 16.2178 3.62234C14.1013 3.12589 11.8987 3.12589 9.78223 3.62234C6.72578 4.33928 4.33928 6.72578 3.62234 9.78223ZM13.8296 16.4742C13.8296 16.9038 13.4814 17.252 13.0518 17.252C12.6222 17.252 12.274 16.9038 12.274 16.4742C12.274 16.0447 12.6222 15.6964 13.0518 15.6964C13.4814 15.6964 13.8296 16.0447 13.8296 16.4742ZM11.5481 10.8222C11.5481 10.0204 12.1981 9.37035 13 9.37035C13.8018 9.37035 14.4519 10.0204 14.4519 10.8222V10.9481C14.4519 11.3665 14.2856 11.7678 13.9898 12.0637L12.56 13.4934C12.317 13.7364 12.317 14.1304 12.56 14.3734C12.803 14.6164 13.197 14.6164 13.44 14.3734L14.8697 12.9436C15.399 12.4144 15.6963 11.6965 15.6963 10.9481V10.8222C15.6963 9.33308 14.4891 8.12588 13 8.12588C11.5108 8.12588 10.3036 9.33308 10.3036 10.8222V11.3408C10.3036 11.6844 10.5822 11.963 10.9259 11.963C11.2695 11.963 11.5481 11.6844 11.5481 11.3408V10.8222Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                         </svg>}
//                                             title='Ask a question'
//                                             subtitle='Ask question and store user input in variable'
//                                             backgroundColor='#ff9933'
//                                             background='#ffb062' />
//                                         <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                             <path fill="white" d="M23.6947 2.6237C23.6947 2.6237 16.2622 6.41609 12.4867 8.1894C13.2955 8.92798 14.0478 9.7246 14.8282 10.4924C10.9897 14.3821 12.9911 12.4319 9.15262 16.3215C9.4341 16.5902 9.71536 16.8587 9.99686 17.1273C13.8353 13.2376 11.834 15.1882 15.6724 11.2986C16.4543 12.0777 17.2318 12.8612 18.0139 13.6401C20.0305 9.66858 23.6947 2.6237 23.6947 2.6237V2.6237Z"></path>
//                                             <path stroke-linecap="square" stroke-width="0.994363" stroke="white" fill="white" d="M9.10888 21.6214L3.80789 22.4837L4.67003 17.1824L9.97105 16.3205L9.10888 21.6214Z"></path>
//                                         </svg>}
//                                             title='Set a condition'
//                                             subtitle='Send message(s) based on logical condition(s)'
//                                             backgroundColor='#6c7ed6'
//                                             background='#8796e0'

//                                             onClick={() => handleComponentClick(5)} />
//                                         <div className='operation_text'>Operations</div>
//                                         <div className='operation_grid'>
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear)" d="M23.3244 15.6756L21.125 13.4761V10.5625C21.1225 8.54899 20.3735 6.60794 19.0228 5.11467C17.6721 3.62141 15.8157 2.68201 13.8125 2.47812V0.8125H12.1875V2.47812C10.1843 2.68201 8.32793 3.62141 6.97724 5.11467C5.62654 6.60794 4.87752 8.54899 4.875 10.5625V13.4761L2.67556 15.6756C2.52318 15.8279 2.43755 16.0345 2.4375 16.25V18.6875C2.4375 18.903 2.5231 19.1097 2.67548 19.262C2.82785 19.4144 3.03451 19.5 3.25 19.5H8.9375V20.3125C8.9375 21.3899 9.36551 22.4233 10.1274 23.1851C10.8892 23.947 11.9226 24.375 13 24.375C14.0774 24.375 15.1108 23.947 15.8726 23.1851C16.6345 22.4233 17.0625 21.3899 17.0625 20.3125V19.5H22.75C22.9655 19.5 23.1722 19.4144 23.3245 19.262C23.4769 19.1097 23.5625 18.903 23.5625 18.6875V16.25C23.5625 16.0345 23.4768 15.8279 23.3244 15.6756ZM15.4375 20.3125C15.4375 20.959 15.1807 21.579 14.7236 22.0361C14.2665 22.4932 13.6465 22.75 13 22.75C12.3535 22.75 11.7335 22.4932 11.2764 22.0361C10.8193 21.579 10.5625 20.959 10.5625 20.3125V19.5H15.4375V20.3125Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="24.375" x2="23.5625" y1="0.812499" x1="3.25" id="paint0_linear">
//                                                         <stop stop-color="#FFC691"></stop>
//                                                         <stop stop-color="#E79110" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Subscribe'

//                                                 onClick={() => handleComponentClick(6)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear1)" d="M21.125 13.4761V10.5625C21.1241 9.29129 20.8214 8.03846 20.2418 6.90706L24.375 2.77387L23.2261 1.625L1.625 23.2261L2.77387 24.375L7.64887 19.5H8.9375V20.3125C8.9375 21.3899 9.36551 22.4233 10.1274 23.1851C10.8892 23.947 11.9226 24.375 13 24.375C14.0774 24.375 15.1108 23.947 15.8726 23.1851C16.6345 22.4233 17.0625 21.3899 17.0625 20.3125V19.5H22.75C22.9655 19.5 23.1722 19.4144 23.3245 19.262C23.4769 19.1097 23.5625 18.903 23.5625 18.6875V16.25C23.5625 16.0345 23.4768 15.8279 23.3244 15.6756L21.125 13.4761ZM15.4375 20.3125C15.4375 20.959 15.1807 21.579 14.7236 22.0361C14.2665 22.4932 13.6465 22.75 13 22.75C12.3535 22.75 11.7335 22.4932 11.2764 22.0361C10.8193 21.579 10.5625 20.959 10.5625 20.3125V19.5H15.4375V20.3125Z"></path>
//                                                 <path fill="url(#paint1_linear1)" d="M17.5581 3.84962C16.444 3.08633 15.1561 2.61502 13.8125 2.47894V0.8125H12.1875V2.47812C10.1843 2.68201 8.32793 3.62141 6.97724 5.11467C5.62654 6.60794 4.87752 8.54899 4.875 10.5625V13.4761L2.67556 15.6756C2.52318 15.8279 2.43755 16.0345 2.4375 16.25V18.6875C2.44138 18.768 2.45755 18.8475 2.48544 18.9231L17.5581 3.84962Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="26.4516" x2="21.6882" y1="1.625" x1="2.5" id="paint0_linear1">
//                                                         <stop stop-color="#FFC691"></stop>
//                                                         <stop stop-color="#E79110" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="17.8133" x2="18.7571" y1="0.8125" x1="3.01906" id="paint1_linear1">
//                                                         <stop stop-color="#FFC691"></stop>
//                                                         <stop stop-color="#E79110" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Unsubscribe'

//                                                 onClick={() => handleComponentClick(7)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear2)" d="M20.5389 3.05469H14.8386C13.1979 3.05469 11.6203 3.76866 10.5265 5.02351L3.98483 12.5094C2.61759 14.0671 2.6807 16.447 4.13207 17.9182L8.5493 22.4616C9.97964 23.9328 12.2934 23.9978 13.8079 22.6131L21.0858 15.8845C22.3058 14.7594 22.9999 13.1368 22.9999 11.4492V5.56439C22.9789 4.17973 21.8851 3.05469 20.5389 3.05469ZM17.2996 11.2761C16.0165 11.2761 14.9858 10.216 14.9858 8.89625C14.9858 7.57649 16.0165 6.51635 17.2996 6.51635C18.5827 6.51635 19.6134 7.57649 19.6134 8.89625C19.6134 10.216 18.5827 11.2761 17.2996 11.2761Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="23.6099" x2="13" y1="3.05469" x1="13" id="paint0_linear2">
//                                                         <stop stop-color="#FA9066"></stop>
//                                                         <stop stop-color="#B9491E" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Update Attribute'

//                                                 onClick={() => handleComponentClick(8)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear8)" d="M17.875 23.5625C17.875 23.778 17.7894 23.9847 17.6371 24.1371C17.4847 24.2894 17.278 24.375 17.0625 24.375H8.93753C8.72204 24.375 8.51538 24.2894 8.36301 24.1371C8.21064 23.9847 8.12503 23.778 8.12503 23.5625C8.12503 23.3471 8.21064 23.1404 8.36301 22.988C8.51538 22.8356 8.72204 22.75 8.93753 22.75H17.0625C17.278 22.75 17.4847 22.8356 17.6371 22.988C17.7894 23.1404 17.875 23.3471 17.875 23.5625ZM21.9375 10.5625C21.941 11.917 21.6351 13.2544 21.0429 14.4725C20.4508 15.6907 19.5881 16.7575 18.5209 17.5915C18.3216 17.7442 18.1598 17.9404 18.0479 18.1651C17.9359 18.3898 17.8768 18.6372 17.875 18.8882V19.5C17.8745 19.9309 17.7032 20.3439 17.3985 20.6486C17.0939 20.9532 16.6809 21.1246 16.25 21.125H9.75003C9.3192 21.1246 8.90616 20.9532 8.60152 20.6486C8.29688 20.3439 8.12552 19.9309 8.12503 19.5V18.8875C8.12474 18.6391 8.06757 18.3941 7.95791 18.1712C7.84825 17.9483 7.68901 17.7535 7.4924 17.6017C6.42823 16.7731 5.56645 15.7133 4.97225 14.5025C4.37806 13.2916 4.06701 11.9616 4.06263 10.6128C4.03603 5.77215 7.94882 1.74133 12.785 1.62758C13.9765 1.59893 15.1616 1.80885 16.2707 2.24499C17.3798 2.68113 18.3905 3.33469 19.2433 4.16721C20.0961 4.99974 20.7738 5.99441 21.2365 7.09271C21.6992 8.19101 21.9375 9.37076 21.9375 10.5625ZM18.6075 9.60826C18.4102 8.44788 17.8568 7.37762 17.024 6.54584C16.1912 5.71406 15.1202 5.16195 13.9596 4.96605C13.8538 4.94692 13.7452 4.94899 13.6402 4.97214C13.5352 4.99528 13.4359 5.03904 13.3479 5.10086C13.2599 5.16269 13.1851 5.24137 13.1278 5.33233C13.0704 5.42329 13.0317 5.52473 13.0139 5.63076C12.996 5.73679 12.9994 5.84531 13.0238 5.95003C13.0482 6.05475 13.0932 6.15358 13.1561 6.24079C13.2189 6.32801 13.2985 6.40188 13.3902 6.45811C13.4818 6.51435 13.5837 6.55183 13.6899 6.5684C14.5178 6.70816 15.2817 7.10199 15.8758 7.69531C16.4698 8.28862 16.8646 9.05204 17.0054 9.87974C17.0374 10.0688 17.1353 10.2405 17.2818 10.3643C17.4282 10.4882 17.6137 10.5563 17.8055 10.5566C17.8513 10.5565 17.8971 10.5527 17.9423 10.5451C18.1547 10.5091 18.3441 10.3901 18.4689 10.2144C18.5936 10.0387 18.6435 9.82071 18.6075 9.60826Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="24" x2="21.9998" y1="2" x1="3.99982" id="paint0_linear8">
//                                                         <stop stop-color="#F8EA6E"></stop>
//                                                         <stop stop-color="#E6D32A" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Set tags'

//                                                 onClick={() => handleComponentClick(9)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear3)" d="M5.75 8.54351C5.75 6.21865 7.65279 4.33398 10 4.33398C12.3472 4.33398 14.25 6.21865 14.25 8.54351C14.25 10.8684 12.3472 12.753 10 12.753C7.65279 12.753 5.75 10.8684 5.75 8.54351Z"></path>
//                                                 <path fill="url(#paint1_linear3)" d="M7.31383 14.654L7.49193 14.6258C9.15346 14.3632 10.8465 14.3632 12.5081 14.6258L12.6862 14.654C15.0273 15.024 16.75 17.0242 16.75 19.3724C16.75 20.6399 15.7127 21.6673 14.433 21.6673H5.56697C4.28734 21.6673 3.25 20.6399 3.25 19.3724C3.25 17.0242 4.97267 15.024 7.31383 14.654Z"></path>
//                                                 <path fill="url(#paint2_linear3)" d="M16 4.33398C15.5858 4.33398 15.25 4.66657 15.25 5.07684C15.25 5.48711 15.5858 5.8197 16 5.8197C17.5188 5.8197 18.75 7.03919 18.75 8.54351C18.75 10.0478 17.5188 11.2673 16 11.2673C15.5858 11.2673 15.25 11.5999 15.25 12.0102C15.25 12.4204 15.5858 12.753 16 12.753C18.3472 12.753 20.25 10.8684 20.25 8.54351C20.25 6.21865 18.3472 4.33398 16 4.33398Z"></path>
//                                                 <path fill="url(#paint3_linear3)" d="M17.2412 14.6165C16.827 14.6165 16.4912 14.9491 16.4912 15.3594C16.4912 15.7696 16.827 16.1022 17.2412 16.1022H18.2093C18.2898 16.1022 18.3704 16.1086 18.4498 16.1211C20.063 16.3761 21.25 17.7544 21.25 19.3724C21.25 19.8193 20.8842 20.1816 20.433 20.1816H18.3899C17.9757 20.1816 17.6399 20.5142 17.6399 20.9245C17.6399 21.3347 17.9757 21.6673 18.3899 21.6673H20.433C21.7127 21.6673 22.75 20.6399 22.75 19.3724C22.75 17.0242 21.0273 15.024 18.6862 14.654C18.5285 14.629 18.3689 14.6165 18.2093 14.6165H17.2412Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint0_linear3">
//                                                         <stop stop-color="#8C94FF"></stop>
//                                                         <stop stop-color="#4B55DD" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint1_linear3">
//                                                         <stop stop-color="#8C94FF"></stop>
//                                                         <stop stop-color="#4B55DD" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint2_linear3">
//                                                         <stop stop-color="#8C94FF"></stop>
//                                                         <stop stop-color="#4B55DD" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint3_linear3">
//                                                         <stop stop-color="#8C94FF"></stop>
//                                                         <stop stop-color="#4B55DD" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Assign Team'

//                                                 onClick={() => handleComponentClick(10)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear4)" d="M10.7714 3.25C8.15597 3.25 6.03571 5.37025 6.03571 7.98571C6.03571 10.6012 8.15597 12.7214 10.7714 12.7214C13.3869 12.7214 15.5071 10.6012 15.5071 7.98571C15.5071 5.37025 13.3869 3.25 10.7714 3.25Z"></path>
//                                                 <path fill="url(#paint1_linear4)" d="M13.5661 14.8283C11.7147 14.5328 9.82815 14.5328 7.97672 14.8283L7.77827 14.86C5.16955 15.2763 3.25 17.5265 3.25 20.1682C3.25 21.5941 4.4059 22.75 5.83176 22.75H15.7111C17.137 22.75 18.2929 21.5941 18.2929 20.1682C18.2929 17.5265 16.3733 15.2763 13.7646 14.86L13.5661 14.8283Z"></path>
//                                                 <path fill="url(#paint2_linear4)" d="M19.6857 9.93571C20.1473 9.93571 20.5214 10.3099 20.5214 10.7714V12.1643H21.9143C22.3758 12.1643 22.75 12.5384 22.75 13C22.75 13.4616 22.3758 13.8357 21.9143 13.8357H20.5214V15.2286C20.5214 15.6901 20.1473 16.0643 19.6857 16.0643C19.2242 16.0643 18.85 15.6901 18.85 15.2286V13.8357H17.4571C16.9956 13.8357 16.6214 13.4616 16.6214 13C16.6214 12.5384 16.9956 12.1643 17.4571 12.1643H18.85V10.7714C18.85 10.3099 19.2242 9.93571 19.6857 9.93571Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear4">
//                                                         <stop stop-color="#74EBA2"></stop>
//                                                         <stop stop-color="#31CF6E" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint1_linear4">
//                                                         <stop stop-color="#74EBA2"></stop>
//                                                         <stop stop-color="#31CF6E" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint2_linear4">
//                                                         <stop stop-color="#74EBA2"></stop>
//                                                         <stop stop-color="#31CF6E" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Assign User'

//                                                 onClick={() => handleComponentClick(11)}

//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear7)" d="M9.75 5.6875C9.75 5.04103 10.0068 4.42105 10.4639 3.96393C10.921 3.50681 11.541 3.25 12.1875 3.25H13.8125C14.459 3.25 15.079 3.50681 15.5361 3.96393C15.9932 4.42105 16.25 5.04103 16.25 5.6875V7.3125C16.25 7.95897 15.9932 8.57895 15.5361 9.03607C15.079 9.49319 14.459 9.75 13.8125 9.75V11.375H17.875C18.0905 11.375 18.2972 11.4606 18.4495 11.613C18.6019 11.7653 18.6875 11.972 18.6875 12.1875V13.8125C18.6875 14.028 18.6019 14.2347 18.4495 14.387C18.2972 14.5394 18.0905 14.625 17.875 14.625C17.6595 14.625 17.4528 14.5394 17.3005 14.387C17.1481 14.2347 17.0625 14.028 17.0625 13.8125V13H8.9375V13.8125C8.9375 14.028 8.8519 14.2347 8.69952 14.387C8.54715 14.5394 8.34049 14.625 8.125 14.625C7.90951 14.625 7.70285 14.5394 7.55048 14.387C7.3981 14.2347 7.3125 14.028 7.3125 13.8125V12.1875C7.3125 11.972 7.3981 11.7653 7.55048 11.613C7.70285 11.4606 7.90951 11.375 8.125 11.375H12.1875V9.75C11.541 9.75 10.921 9.49319 10.4639 9.03607C10.0068 8.57895 9.75 7.95897 9.75 7.3125V5.6875ZM4.875 18.6875C4.875 18.041 5.13181 17.421 5.58893 16.9639C6.04605 16.5068 6.66603 16.25 7.3125 16.25H8.9375C9.58397 16.25 10.204 16.5068 10.6611 16.9639C11.1182 17.421 11.375 18.041 11.375 18.6875V20.3125C11.375 20.959 11.1182 21.579 10.6611 22.0361C10.204 22.4932 9.58397 22.75 8.9375 22.75H7.3125C6.66603 22.75 6.04605 22.4932 5.58893 22.0361C5.13181 21.579 4.875 20.959 4.875 20.3125V18.6875ZM14.625 18.6875C14.625 18.041 14.8818 17.421 15.3389 16.9639C15.796 16.5068 16.416 16.25 17.0625 16.25H18.6875C19.334 16.25 19.954 16.5068 20.4111 16.9639C20.8682 17.421 21.125 18.041 21.125 18.6875V20.3125C21.125 20.959 20.8682 21.579 20.4111 22.0361C19.954 22.4932 19.334 22.75 18.6875 22.75H17.0625C16.416 22.75 15.796 22.4932 15.3389 22.0361C14.8818 21.579 14.625 20.959 14.625 20.3125V18.6875Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear7">
//                                                         <stop stop-color="#73BFFF"></stop>
//                                                         <stop stop-color="#1685E1" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Trigger Chatbot'

//                                                 onClick={() => handleComponentClick(12)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear6)" d="M5.07017 9.21146C5.72287 6.42889 7.89553 4.25623 10.6781 3.60353C12.6876 3.13216 14.779 3.13216 16.7885 3.60353C19.5711 4.25623 21.7438 6.42889 22.3965 9.21147C22.8678 11.221 22.8678 13.3124 22.3965 15.3219C21.7438 18.1045 19.5711 20.2771 16.7885 20.9298C14.779 21.4012 12.6876 21.4012 10.6781 20.9298C9.99798 20.7703 9.35429 20.52 8.76033 20.1921C8.65744 21.622 7.46484 22.75 6.00877 22.75C4.48514 22.75 3.25 21.5149 3.25 19.9912C3.25 18.5352 4.37805 17.3426 5.8079 17.2397C5.48004 16.6457 5.2297 16.002 5.07017 15.3219C4.59879 13.3124 4.59879 11.221 5.07017 9.21146ZM9.20894 10.6115C9.20894 10.2458 9.50537 9.94935 9.87104 9.94935H13.1816C13.5472 9.94935 13.8437 10.2458 13.8437 10.6115C13.8437 10.9771 13.5472 11.2736 13.1816 11.2736H9.87104C9.50537 11.2736 9.20894 10.9771 9.20894 10.6115ZM10.9746 13.2599C10.6089 13.2599 10.3124 13.5563 10.3124 13.922C10.3124 14.2876 10.6089 14.5841 10.9746 14.5841H16.4921C16.8578 14.5841 17.1542 14.2876 17.1542 13.922C17.1542 13.5563 16.8578 13.2599 16.4921 13.2599H10.9746Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear6">
//                                                         <stop stop-color="#FD919C"></stop>
//                                                         <stop stop-color="#D81F31" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Update Chat Status'

//                                                 onClick={() => handleComponentClick(13)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear5)" d="M9.78223 3.6226C11.8987 3.1258 14.1013 3.1258 16.2178 3.6226C19.1001 4.29918 21.3866 6.46155 22.2391 9.2708H3.76095C4.61338 6.46155 6.89991 4.29918 9.78223 3.6226Z"></path>
//                                                 <path fill="url(#paint1_linear5)" d="M3.47157 10.5161C3.13237 12.4075 3.18263 14.351 3.62234 16.2269C4.33929 19.2855 6.72579 21.6737 9.78223 22.3912C10.6371 22.5918 11.5061 22.7114 12.3778 22.75V10.5161H3.47157Z"></path>
//                                                 <path fill="url(#paint2_linear5)" d="M13.6222 22.75C14.4939 22.7114 15.3629 22.5918 16.2178 22.3912C19.2742 21.6737 21.6607 19.2855 22.3777 16.2269C22.8174 14.351 22.8676 12.4075 22.5284 10.5161H13.6222V22.75Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear5">
//                                                         <stop stop-color="#D896FF"></stop>
//                                                         <stop stop-color="#D896FF" offset="0.0001"></stop>
//                                                         <stop stop-color="#A135DF" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint1_linear5">
//                                                         <stop stop-color="#D896FF"></stop>
//                                                         <stop stop-color="#D896FF" offset="0.0001"></stop>
//                                                         <stop stop-color="#A135DF" offset="1"></stop>
//                                                     </linearGradient>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint2_linear5">
//                                                         <stop stop-color="#D896FF"></stop>
//                                                         <stop stop-color="#D896FF" offset="0.0001"></stop>
//                                                         <stop stop-color="#A135DF" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Template'

//                                                 onClick={() => handleComponentClick(14)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear9)" d="M13 23.8334C7.02 23.8334 2.16666 18.9909 2.16666 13.0001C2.16666 7.02005 7.02 2.16672 13 2.16672C18.9908 2.16672 23.8333 7.02005 23.8333 13.0001C23.8333 18.9909 18.9908 23.8334 13 23.8334ZM16.4558 17.0191C16.5858 17.095 16.7267 17.1383 16.8783 17.1383C17.1492 17.1383 17.42 16.9975 17.5717 16.7375C17.7992 16.3583 17.68 15.86 17.29 15.6216L13.4333 13.325V8.31998C13.4333 7.86498 13.065 7.50748 12.6208 7.50748C12.1767 7.50748 11.8083 7.86498 11.8083 8.31998V13.7908C11.8083 14.0725 11.96 14.3325 12.2092 14.4841L16.4558 17.0191Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="23.8334" x2="13" y1="2.16672" x1="13" id="paint0_linear9">
//                                                         <stop stop-color="#97FFFF"></stop>
//                                                         <stop stop-color="#01A5A5" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Time Delay'

//                                                 onClick={() => handleComponentClick(15)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 28 28" height="28" width="28">
//                                                 <path stroke-width="0.4" stroke="#74EBA2" fill="url(#paint0_linear_1568_38266)" d="M21.0013 18.882V16.7225C21.0013 14.4708 19.1696 12.6392 16.918 12.6392C15.9531 12.6392 15.168 11.854 15.168 10.8892V9.11932C15.8483 8.87933 16.4378 8.43476 16.8555 7.84659C17.2732 7.25841 17.4988 6.55541 17.5013 5.83398C17.5013 3.90432 15.931 2.33398 14.0013 2.33398C12.0716 2.33398 10.5013 3.90432 10.5013 5.83398C10.5013 7.35298 11.4801 8.63515 12.8346 9.11815V10.8892C12.8346 11.854 12.0495 12.6392 11.0846 12.6392C8.83297 12.6392 7.0013 14.4708 7.0013 16.7225V18.882C6.32096 19.122 5.73151 19.5665 5.31377 20.1547C4.89603 20.7429 4.67045 21.4459 4.66797 22.1673C4.66797 24.097 6.2383 25.6673 8.16797 25.6673C10.0976 25.6673 11.668 24.097 11.668 22.1673C11.6655 21.4459 11.4399 20.7429 11.0222 20.1547C10.6044 19.5665 10.015 19.122 9.33464 18.882V16.7225C9.33464 15.7577 10.1198 14.9725 11.0846 14.9725C12.2268 14.9725 13.2593 14.4977 14.0013 13.7382C14.3802 14.1285 14.8336 14.4388 15.3346 14.6508C15.8356 14.8628 16.374 14.9722 16.918 14.9725C17.8828 14.9725 18.668 15.7577 18.668 16.7225V18.882C17.9876 19.122 17.3982 19.5665 16.9804 20.1547C16.5627 20.7429 16.3371 21.4459 16.3346 22.1673C16.3346 24.097 17.905 25.6673 19.8346 25.6673C21.7643 25.6673 23.3346 24.097 23.3346 22.1673C23.3322 21.4459 23.1066 20.7429 22.6888 20.1547C22.2711 19.5665 21.6816 19.122 21.0013 18.882ZM8.16797 23.334C7.86758 23.3205 7.58394 23.1918 7.37612 22.9744C7.16831 22.7571 7.05232 22.468 7.05232 22.1673C7.05232 21.8666 7.16831 21.5775 7.37612 21.3602C7.58394 21.1429 7.86758 21.0141 8.16797 21.0007C8.46836 21.0141 8.752 21.1429 8.95981 21.3602C9.16763 21.5775 9.28361 21.8666 9.28361 22.1673C9.28361 22.468 9.16763 22.7571 8.95981 22.9744C8.752 23.1918 8.46836 23.3205 8.16797 23.334ZM14.0013 4.66732C14.2324 4.66709 14.4583 4.73541 14.6506 4.86365C14.8428 4.99188 14.9926 5.17426 15.0812 5.3877C15.1697 5.60114 15.1929 5.83605 15.1479 6.0627C15.1029 6.28934 14.9916 6.49754 14.8283 6.66093C14.6649 6.82433 14.4567 6.93558 14.23 6.9806C14.0034 7.02563 13.7685 7.0024 13.555 6.91386C13.3416 6.82533 13.1592 6.67546 13.031 6.48324C12.9027 6.29101 12.8344 6.06506 12.8346 5.83398C12.8346 5.19115 13.3573 4.66732 14.0013 4.66732ZM19.8346 23.334C19.5342 23.3205 19.2506 23.1918 19.0428 22.9744C18.835 22.7571 18.719 22.468 18.719 22.1673C18.719 21.8666 18.835 21.5775 19.0428 21.3602C19.2506 21.1429 19.5342 21.0141 19.8346 21.0007C20.135 21.0141 20.4187 21.1429 20.6265 21.3602C20.8343 21.5775 20.9503 21.8666 20.9503 22.1673C20.9503 22.468 20.8343 22.7571 20.6265 22.9744C20.4187 23.1918 20.135 23.3205 19.8346 23.334Z"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="25.6673" x2="14.0013" y1="2.33398" x1="14.0013" id="paint0_linear_1568_38266">
//                                                         <stop stop-color="#74EBA2"></stop>
//                                                         <stop stop-color="#31CF6E" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Whatsapp Flows'

//                                                 onClick={() => handleComponentClick(16)}
//                                             />
//                                         </div>
//                                         <div className='operation_text'>Integrations</div>
//                                         <div className='integration_grid'>
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="#FFB906" d="M11.3317 20.5833C9.75 22.8258 6.6625 23.3892 4.43083 21.8292C2.21 20.2692 1.69 17.16 3.25 14.8958C3.68626 14.2625 4.26365 13.739 4.93666 13.3668C5.60968 12.9946 6.35994 12.7837 7.12833 12.7508L7.1825 14.3C6.19667 14.3758 5.24333 14.885 4.62583 15.7733C3.5425 17.3333 3.87833 19.435 5.3625 20.4858C6.8575 21.5258 8.94833 21.125 10.0317 19.5758C10.3675 19.0883 10.5625 18.5575 10.6383 18.0158V16.9217L16.6833 16.8783L16.7592 16.7592C17.3333 15.7625 18.5792 15.4158 19.5542 15.9792C19.7875 16.1157 19.9917 16.2969 20.155 16.5124C20.3183 16.7278 20.4376 16.9733 20.506 17.2349C20.5744 17.4965 20.5906 17.7689 20.5537 18.0368C20.5168 18.3046 20.4275 18.5625 20.2908 18.7958C19.7167 19.7817 18.46 20.1283 17.485 19.565C17.0408 19.3158 16.7267 18.915 16.5858 18.46L12.1767 18.4817C12.0475 19.2343 11.7595 19.9508 11.3317 20.5833V20.5833ZM19.2183 12.8483C21.9592 13.1842 23.9092 15.6433 23.5733 18.3408C23.2375 21.0492 20.7458 22.9667 18.005 22.6308C17.2439 22.5422 16.5132 22.2803 15.8691 21.8653C15.2249 21.4502 14.6845 20.8931 14.2892 20.2367L15.6325 19.4567C15.9104 19.887 16.2797 20.2508 16.714 20.5223C17.1484 20.7938 17.6373 20.9663 18.1458 21.0275C20.0417 21.255 21.7208 19.9658 21.9483 18.1567C22.1758 16.3475 20.8325 14.69 18.9583 14.4625C18.3733 14.3975 17.81 14.4733 17.3008 14.6575L16.38 15.1342L13.585 9.96667H13.3467C12.8013 9.95079 12.2843 9.71969 11.9088 9.32386C11.5333 8.92802 11.3297 8.39965 11.3425 7.85417C11.375 6.7275 12.35 5.85 13.4875 5.89334C14.625 5.95834 15.5242 6.87917 15.4917 8.00584C15.47 8.4825 15.2858 8.91584 14.9933 9.25167L17.0517 13.0542C17.7233 12.8375 18.46 12.7617 19.2183 12.8483V12.8483ZM8.9375 9.90167C7.85417 7.35584 9.0025 4.44167 11.505 3.38C14.0183 2.31834 16.9217 3.52084 18.005 6.06667C18.6442 7.55084 18.5142 9.17584 17.7883 10.4758L16.445 9.69584C16.9 8.81834 16.9758 7.74584 16.5425 6.73834C15.8058 5.005 13.845 4.17084 12.1658 4.875C10.4758 5.59 9.7175 7.58334 10.4542 9.31667C10.7575 10.0317 11.2667 10.5842 11.8842 10.9525L12.3067 11.18L8.98083 16.5858C9.01333 16.64 9.05667 16.705 9.08917 16.7917C9.62 17.7775 9.25167 19.0233 8.255 19.5542C7.26917 20.085 6.02333 19.695 5.48167 18.6767C4.95083 17.6692 5.31917 16.4233 6.31583 15.8925C6.73833 15.665 7.20417 15.6108 7.64833 15.7083L10.1508 11.6242C9.64167 11.1583 9.20833 10.5733 8.9375 9.90167V9.90167Z"></path>
//                                             </svg>} text='Webhook'

//                                                 onClick={() => handleComponentClick(17)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
//                                                 <path fill="url(#paint0_linear10)" d="M8.46083 2.16667H17.5403C20.8867 2.16667 22.75 4.095 22.75 7.39917V18.59C22.75 21.9483 20.8867 23.8333 17.5403 23.8333H8.46083C5.1675 23.8333 3.25 21.9483 3.25 18.59V7.39917C3.25 4.095 5.1675 2.16667 8.46083 2.16667ZM8.75333 7.215V7.20417H11.9914C12.4583 7.20417 12.8375 7.58333 12.8375 8.04808C12.8375 8.52583 12.4583 8.905 11.9914 8.905H8.75333C8.28642 8.905 7.90833 8.52583 7.90833 8.06C7.90833 7.59417 8.28642 7.215 8.75333 7.215ZM8.75333 13.8017H17.2467C17.7125 13.8017 18.0917 13.4225 18.0917 12.9567C18.0917 12.4908 17.7125 12.1106 17.2467 12.1106H8.75333C8.28642 12.1106 7.90833 12.4908 7.90833 12.9567C7.90833 13.4225 8.28642 13.8017 8.75333 13.8017ZM8.75333 18.7525H17.2467C17.6789 18.7092 18.005 18.3398 18.005 17.9075C18.005 17.4633 17.6789 17.095 17.2467 17.0517H8.75333C8.42833 17.0192 8.11417 17.1708 7.94083 17.4525C7.7675 17.7233 7.7675 18.0808 7.94083 18.3625C8.11417 18.6333 8.42833 18.7958 8.75333 18.7525Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="23.8333" x2="13" y1="2.16667" x1="13" id="paint0_linear10">
//                                                         <stop stop-color="#81DBA4"></stop>
//                                                         <stop stop-color="#006A29" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Google Spreadsheet'

//                                                 onClick={() => handleComponentClick(18)}
//                                             />
//                                         </div>
//                                         <div className='operation_text'>Catalog</div>
//                                         <div className='Catalog_grid'>
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 18 18" height="18" width="18">
//                                                 <path fill="url(#paint0_linear_832_26743)" d="M15.7135 0H12.6715C11.4025 0 10.3855 1.035 10.3855 2.3049V5.373C10.3855 6.651 11.4025 7.677 12.6715 7.677H15.7135C16.9735 7.677 17.9995 6.651 17.9995 5.373V2.3049C17.9995 1.035 16.9735 0 15.7135 0ZM2.286 1.98807e-05H5.328C6.597 1.98807e-05 7.614 1.03502 7.614 2.30492V5.37302C7.614 6.65102 6.597 7.67701 5.328 7.67701H2.286C1.026 7.67701 0 6.65102 0 5.37302V2.30492C0 1.03502 1.026 1.98807e-05 2.286 1.98807e-05ZM2.286 10.3215H5.328C6.597 10.3215 7.614 11.3484 7.614 12.6264V15.6945C7.614 16.9635 6.597 17.9985 5.328 17.9985H2.286C1.026 17.9985 0 16.9635 0 15.6945V12.6264C0 11.3484 1.026 10.3215 2.286 10.3215ZM12.6715 10.3215H15.7135C16.9735 10.3215 17.9995 11.3484 17.9995 12.6264V15.6945C17.9995 16.9635 16.9735 17.9985 15.7135 17.9985H12.6715C11.4025 17.9985 10.3855 16.9635 10.3855 15.6945V12.6264C10.3855 11.3484 11.4025 10.3215 12.6715 10.3215Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="17.9994" x2="17.9988" y1="0" x1="0" id="paint0_linear_832_26743">
//                                                         <stop stop-color="#2697FF"></stop>
//                                                         <stop stop-color="#1363AD" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Sets'

//                                                 onClick={() => handleComponentClick(19)}
//                                             />
//                                             <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 20 20" height="20" width="20">
//                                                 <path fill="url(#paint0_linear_832_26750)" d="M11.8492 9.08687H14.4979C14.8995 9.08687 15.215 8.75483 15.215 8.35444C15.215 7.94428 14.8995 7.62201 14.4979 7.62201H11.8492C11.4476 7.62201 11.1321 7.94428 11.1321 8.35444C11.1321 8.75483 11.4476 9.08687 11.8492 9.08687ZM17.644 4.00839C18.2273 4.00839 18.6097 4.21347 18.9922 4.66269C19.3747 5.11192 19.4416 5.75645 19.3556 6.34142L18.4472 12.7477C18.2751 13.9792 17.2424 14.8864 16.028 14.8864H5.59586C4.32412 14.8864 3.2723 13.8913 3.16712 12.6022L2.28741 1.95662L0.843553 1.70271C0.461073 1.63435 0.193338 1.25349 0.260272 0.862859C0.327206 0.463442 0.700123 0.198791 1.09216 0.258362L3.3727 0.608951C3.69781 0.668522 3.93686 0.940985 3.96554 1.27302L4.14722 3.46054C4.17591 3.77402 4.42452 4.00839 4.7305 4.00839H17.644ZM5.44292 16.4295C4.63972 16.4295 3.9895 17.0935 3.9895 17.9139C3.9895 18.7244 4.63972 19.3885 5.44292 19.3885C6.23657 19.3885 6.88679 18.7244 6.88679 17.9139C6.88679 17.0935 6.23657 16.4295 5.44292 16.4295ZM16.1999 16.4295C15.3967 16.4295 14.7465 17.0935 14.7465 17.9139C14.7465 18.7244 15.3967 19.3885 16.1999 19.3885C16.9936 19.3885 17.6438 18.7244 17.6438 17.9139C17.6438 17.0935 16.9936 16.4295 16.1999 16.4295Z" clip-rule="evenodd" fill-rule="evenodd"></path>
//                                                 <defs>
//                                                     <linearGradient gradientUnits="userSpaceOnUse" y2="18.5" x2="18" y1="0.5" x1="1" id="paint0_linear_832_26750">
//                                                         <stop stop-color="#C087F9"></stop>
//                                                         <stop stop-color="#8735DA" offset="1"></stop>
//                                                     </linearGradient>
//                                                 </defs>
//                                             </svg>} text='Product'

//                                                 onClick={() => handleComponentClick(20)}
//                                             />
//                                         </div>
//                                     </>
//                                 )
//                         }
//                     </div>
//                 </div>

//                 <div className='editchatbot_right_container'>
//                     <div className='header_content'>
//                         <div className='header_name'>
//                             <a className='chatbotbackbtn' ><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
//                             {currentChatbotName}
//                             <EditIcon onClick={handleEditClick} />
//                         </div>
//                         <div className='header_savebtn'>
//                             <button className='footer__cancel__btn headerbar_savebutton'>Save</button>
//                             <button className='header_importbtn'>
//                                 <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z" fill="#666666"></path></svg>
//                             </button>
//                         </div>
//                     </div>
//                     <div className='flow_container'>
//                         <div className='chatbot_main_container'>
//                             <div className='right-container' style={{ position: 'relative', width: '100%', height: '100%' }}>
//                                 <div className='chatbot_sidebartoggle_button' onClick={toggleLeftContainer} style={{ cursor: 'pointer' }}>
//                                     <svg className='chatbot_toggle_svg' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                         <path d="M5.63574 7.36328L1.74665 11.2524C1.55139 11.4476 1.55139 11.7642 1.74665 11.9595L5.63574 15.8486" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
//                                         <path d="M2.80724 11.6058H9.87831" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
//                                         <path d="M18.3643 15.8496L22.2533 11.9605C22.4486 11.7653 22.4486 11.4487 22.2533 11.2534L18.3643 7.36433" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
//                                         <path d="M21.1928 11.607L14.1217 11.607" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
//                                     </svg>
//                                 </div>
//                                 <ReactFlow
//                                     nodes={nodes}
//                                     edges={edges}
//                                     onNodesChange={onNodesChange}
//                                     onEdgesChange={onEdgesChange}
//                                     onConnect={onConnect}
//                                     fitView
//                                     fitViewOptions={{ padding: 0.2 }}
//                                     connectionLineType={ConnectionLineType.Bezier}
//                                     connectionLineStyle={{ stroke: '#6080e6' }}

//                                 >
//                                     {/* Add the Background component here */}
//                                     <Background
//                                         gap={70}
//                                         color="#e8eaf2"
//                                         lineWidth={5}
//                                         variant='lines'
//                                     />
//                                     <MiniMap nodeColor={(node) => {

//                                         return node.style?.fill || '#B1C8E2';
//                                     }} />
//                                     <Controls />
//                                 </ReactFlow>


//                             </div>



//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }


const Automations = () => {
    //chatbot -->edit page
    const [showEditChatbot, setShowEditChatbot] = useState(false);
    const handleEditChatbotbutton = () => {
        setShowEditChatbot(true);
    }

    const [activeContent, setActiveContent] = useState('defaultaction');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };
    const [chatbotName, setChatbotName] = useState('');
    const handleSaveChatbotName = (name) => {
        setChatbotName(name);
    };
    const renderContent = () => {
        switch (activeContent) {
            case 'defaultaction':
                return <DefaultAction />
            case 'keywordaction':
                return <KeywordAction />
            case 'replymaterial':
                return <Replymaterial />
            case 'routing':
                return <Routing />
            case 'chatbots':
                return <Chatbots handleEditChatbotbutton={handleEditChatbotbutton} onSave={handleSaveChatbotName} />
            case 'sequence':
                return <Sequence />
            case 'rules':
                return <Rules />
            case 'whatsappflows':
                return <Whatsappflows />

            default:
                return <DefaultAction />
        }
    }

    return (
        <>
            <div className='maincontent'>
                {showEditChatbot ? (
                    <EditChatbotPage chatbotName={chatbotName} />

                ) :

                    <div className='msgCont'>

                        <div className='msgContL automation__left__content'>
                            <li className={`${activeContent === 'defaultaction' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'defaultaction')}>
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8287 6.30469L10.9187 9.45277C10.1788 10.0329 9.14151 10.0329 8.40156 9.45277L4.45801 6.30469" stroke="#666666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.31392 1.20996H13.9562C15.2023 1.22394 16.3883 1.75073 17.238 2.66765C18.0878 3.58456 18.527 4.81157 18.4535 6.0629V12.0468C18.527 13.2981 18.0878 14.5251 17.238 15.442C16.3883 16.359 15.2023 16.8858 13.9562 16.8997H5.31392C2.63734 16.8997 0.833374 14.7222 0.833374 12.0468V6.0629C0.833374 3.38745 2.63734 1.20996 5.31392 1.20996Z" stroke="#666666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <span className='leftbar__item__title' >Default Action</span></a></li>
                            <li className={`${activeContent === 'keywordaction' ? 'active' : ''}`} ><a onClick={(e) => handleNavigationClick(e, 'keywordaction')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_2_Keyword_Action" data-name="2_Keyword Action"><path d="M29,35H7a6,6,0,0,1-6-6V7A6,6,0,0,1,7,1H29a6,6,0,0,1,6,6V29A6,6,0,0,1,29,35ZM7,3A4,4,0,0,0,3,7V29a4,4,0,0,0,4,4H29a4,4,0,0,0,4-4V7a4,4,0,0,0-4-4Z" fill="#777" /><path d="M26.36,17h-8a5.66,5.66,0,1,0,0,2h3.27v3.66a1,1,0,0,0,2,0V19h2.7a.47.47,0,0,1,.47.47v3.19a1,1,0,0,0,2,0V19.47A2.48,2.48,0,0,0,26.36,17ZM12.83,21.66A3.66,3.66,0,1,1,16.49,18,3.66,3.66,0,0,1,12.83,21.66Z" fill="#777" /></g></svg><span className='leftbar__item__title'>Keyword Action</span></a></li>
                            <li className={`${activeContent === 'replymaterial' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'replymaterial')}> <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.05386 11.2734C5.46282 11.2734 4.98267 10.7933 4.98267 10.2023C4.98267 9.61297 5.46282 9.13281 6.05386 9.13281C6.64489 9.13281 7.12505 9.61297 7.12505 10.2023C7.12505 10.7933 6.64489 11.2734 6.05386 11.2734ZM10.2182 11.2741C9.62716 11.2741 9.147 10.7939 9.147 10.2029C9.147 9.61362 9.62716 9.13346 10.2182 9.13346C10.8092 9.13346 11.2894 9.61362 11.2894 10.2029C11.2894 10.7939 10.8092 11.2741 10.2182 11.2741ZM13.3114 10.2029C13.3114 10.7939 13.7915 11.2741 14.3826 11.2741C14.9736 11.2741 15.4538 10.7939 15.4538 10.2029C15.4538 9.61362 14.9736 9.13346 14.3826 9.13346C13.7915 9.13346 13.3114 9.61362 13.3114 10.2029Z" fill="#666"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0184 0.833008C4.69254 0.833008 0.833374 5.18362 0.833374 10.0134C0.833374 11.5558 1.28254 13.1431 2.07087 14.5936C2.21754 14.8332 2.23587 15.1352 2.13504 15.4207L1.52087 17.4771C1.38337 17.9729 1.80504 18.3392 2.27254 18.1923L4.12421 17.6424C4.62837 17.4771 5.02254 17.6874 5.49004 17.9729C6.82837 18.7615 8.49671 19.1663 10 19.1663C14.5467 19.1663 19.1667 15.6502 19.1667 9.9859C19.1667 5.10099 15.225 0.833008 10.0184 0.833008Z" stroke="#666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path></svg><span className='leftbar__item__title'>Reply Material</span></a></li>
                            <li className={`${activeContent === 'routing' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'routing')}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.215 1.03522C16.152 0.967676 16.0761 0.913499 15.9918 0.875923C15.9075 0.838347 15.8164 0.818142 15.7241 0.816513C15.6318 0.814885 15.5401 0.831865 15.4545 0.866443C15.3689 0.901021 15.2911 0.952486 15.2259 1.01777C15.1606 1.08305 15.1091 1.16082 15.0745 1.24642C15.0399 1.33203 15.023 1.42372 15.0246 1.51603C15.0262 1.60835 15.0464 1.69938 15.084 1.78372C15.1216 1.86805 15.1758 1.94395 15.2433 2.00689L16.82 3.58356H11.1458C10.4772 3.58356 9.83605 3.84914 9.3633 4.32189C8.89056 4.79464 8.62497 5.43582 8.62497 6.10439V14.81C8.62497 15.4425 8.11164 15.9558 7.47914 15.9558H6.2948C6.1826 15.2962 5.83374 14.7001 5.31359 14.2792C4.79344 13.8583 4.13768 13.6415 3.46915 13.6694C2.80062 13.6972 2.16519 13.9679 1.6819 14.4306C1.1986 14.8934 0.900594 15.5165 0.843703 16.1832C0.786812 16.8498 0.974941 17.5144 1.37285 18.0523C1.77075 18.5903 2.35113 18.9647 3.00527 19.1054C3.65941 19.2462 4.34243 19.1436 4.92637 18.8169C5.51031 18.4903 5.95512 17.9619 6.17747 17.3308H7.47914C8.1477 17.3308 8.78889 17.0652 9.26163 16.5925C9.73438 16.1197 9.99997 15.4785 9.99997 14.81V6.10439C9.99997 5.47189 10.5133 4.95856 11.1458 4.95856H16.82L15.2433 6.53522C15.1219 6.66555 15.0558 6.83792 15.0589 7.01603C15.062 7.19414 15.1342 7.36408 15.2602 7.49004C15.3861 7.616 15.556 7.68816 15.7342 7.6913C15.9123 7.69444 16.0846 7.62833 16.215 7.50689L18.965 4.75689C19.0937 4.62798 19.166 4.45324 19.166 4.27106C19.166 4.08887 19.0937 3.91413 18.965 3.78522L16.215 1.03522ZM2.2083 16.4169C2.2083 16.0522 2.35317 15.7025 2.61103 15.4446C2.86889 15.1868 3.21863 15.0419 3.5833 15.0419C3.94797 15.0419 4.29771 15.1868 4.55557 15.4446C4.81344 15.7025 4.9583 16.0522 4.9583 16.4169C4.9583 16.7816 4.81344 17.1313 4.55557 17.3892C4.29771 17.647 3.94797 17.7919 3.5833 17.7919C3.21863 17.7919 2.86889 17.647 2.61103 17.3892C2.35317 17.1313 2.2083 16.7816 2.2083 16.4169Z" fill="#666"></path></svg><span className='leftbar__item__title'>Routing</span></a></li>
                            <li className={`${activeContent === 'chatbots' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'chatbots')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_5_Chatbots" data-name="5_Chatbots"><path d="M20,35H16A15,15,0,0,1,1,20V16A15,15,0,0,1,16,1h4A15,15,0,0,1,35,16v4A15,15,0,0,1,20,35ZM16,3A13,13,0,0,0,3,16v4A13,13,0,0,0,16,33h4A13,13,0,0,0,33,20V16A13,13,0,0,0,20,3Z" fill="#777" /><path d="M12.3,26a1,1,0,0,1-1-1V15.71a1,1,0,0,1,2,0V25A1,1,0,0,1,12.3,26Z" fill="#777" /><path d="M18,21.29a1,1,0,0,1-1-1V11a1,1,0,1,1,2,0v9.28A1,1,0,0,1,18,21.29Z" fill="#777" /><path d="M23.7,26a1,1,0,0,1-1-1V15.71a1,1,0,1,1,2,0V25A1,1,0,0,1,23.7,26Z" fill="#777" /></g></svg><span className='leftbar__item__title'>Chatbots</span></a></li>
                            <li className={`${activeContent === 'sequence' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'sequence')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_6_Sequence" data-name="6_Sequence"><path d="M7.33,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,7.33,17.68Z" fill="#777" /><path d="M28.67,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,28.67,17.68Z" fill="#777" /><path d="M18.14,35a1,1,0,0,1-1-1V17.36a1,1,0,0,1,2,0V34A1,1,0,0,1,18.14,35Z" fill="#777" /><path d="M12.69,19.92H2a1,1,0,0,0,0,2H6.33V34a1,1,0,0,0,2,0V21.94s0,0,0,0h4.37a1,1,0,0,0,0-2Z" fill="#777" /><path d="M34,19.92H23.31a1,1,0,0,0,0,2h4.37s0,0,0,0V34a1,1,0,0,0,2,0V21.92H34a1,1,0,0,0,0-2Z" fill="#777" /><path d="M23.37,10.69H19V2a1,1,0,0,0-2,0v8.69H12.63a1,1,0,0,0,0,2H23.37a1,1,0,0,0,0-2Z" fill="#777" /></g></svg><span className='leftbar__item__title' >Sequence</span></a></li>
                            <li className={`${activeContent === 'rules' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'rules')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_7_Rules" data-name="7_Rules"><path d="M18,25.09a1,1,0,0,1-.55-.17l-16-10.6a1,1,0,0,1,0-1.67L17.45,2a1,1,0,0,1,1.1,0l16,10.61a1,1,0,0,1,0,1.67l-16,10.6A1,1,0,0,1,18,25.09ZM3.81,13.48,18,22.89l14.19-9.41L18,4.08Z" fill="#777" /><path d="M18,29.61a1,1,0,0,1-.55-.17l-16-10.61a1,1,0,0,1,1.1-1.66L18,27.41,33.45,17.17a1,1,0,1,1,1.1,1.66l-16,10.61A1,1,0,0,1,18,29.61Z" fill="#777" /><path d="M18,34.12a1,1,0,0,1-.55-.16l-16-10.61a1,1,0,0,1,1.1-1.67L18,31.92,33.45,21.68a1,1,0,0,1,1.38.28,1,1,0,0,1-.28,1.39L18.55,34A1,1,0,0,1,18,34.12Z" fill="#777" /></g></svg><span className='leftbar__item__title' >Rules</span></a></li>
                            <li className={`${activeContent === 'whatsappflows' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'whatsappflows')}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Frame"><path id="Vector" d="M14.9987 13.4867V11.9442C14.9987 10.3358 13.6904 9.0275 12.082 9.0275C11.3929 9.0275 10.832 8.46666 10.832 7.7775V6.51333C11.318 6.34191 11.739 6.02436 12.0374 5.60424C12.3358 5.18411 12.4969 4.68197 12.4987 4.16666C12.4987 2.78833 11.377 1.66666 9.9987 1.66666C8.62036 1.66666 7.4987 2.78833 7.4987 4.16666C7.4987 5.25166 8.19786 6.1675 9.16536 6.5125V7.7775C9.16536 8.46666 8.60453 9.0275 7.91536 9.0275C6.30703 9.0275 4.9987 10.3358 4.9987 11.9442V13.4867C4.51274 13.6581 4.0917 13.9756 3.79332 14.3958C3.49493 14.8159 3.3338 15.318 3.33203 15.8333C3.33203 17.2117 4.4537 18.3333 5.83203 18.3333C7.21036 18.3333 8.33203 17.2117 8.33203 15.8333C8.33026 15.318 8.16913 14.8159 7.87075 14.3958C7.57236 13.9756 7.15132 13.6581 6.66536 13.4867V11.9442C6.66536 11.255 7.2262 10.6942 7.91536 10.6942C8.7312 10.6942 9.4687 10.355 9.9987 9.8125C10.2694 10.0913 10.5932 10.313 10.951 10.4644C11.3089 10.6158 11.6935 10.694 12.082 10.6942C12.7712 10.6942 13.332 11.255 13.332 11.9442V13.4867C12.8461 13.6581 12.425 13.9756 12.1266 14.3958C11.8283 14.8159 11.6671 15.318 11.6654 15.8333C11.6654 17.2117 12.787 18.3333 14.1654 18.3333C15.5437 18.3333 16.6654 17.2117 16.6654 15.8333C16.6636 15.318 16.5025 14.8159 16.2041 14.3958C15.9057 13.9756 15.4847 13.6581 14.9987 13.4867ZM5.83203 16.6667C5.61746 16.6571 5.41487 16.5651 5.26643 16.4098C5.11799 16.2546 5.03514 16.0481 5.03514 15.8333C5.03514 15.6185 5.11799 15.412 5.26643 15.2568C5.41487 15.1016 5.61746 15.0096 5.83203 15C6.0466 15.0096 6.24919 15.1016 6.39763 15.2568C6.54608 15.412 6.62892 15.6185 6.62892 15.8333C6.62892 16.0481 6.54608 16.2546 6.39763 16.4098C6.24919 16.5651 6.0466 16.6571 5.83203 16.6667ZM9.9987 3.33333C10.1638 3.33317 10.3251 3.38197 10.4624 3.47357C10.5998 3.56516 10.7068 3.69543 10.77 3.84789C10.8333 4.00035 10.8499 4.16814 10.8177 4.33003C10.7855 4.49192 10.7061 4.64063 10.5894 4.75734C10.4727 4.87405 10.324 4.95352 10.1621 4.98568C10.0002 5.01784 9.83238 5.00125 9.67992 4.93801C9.52747 4.87477 9.3972 4.76772 9.3056 4.63042C9.214 4.49311 9.1652 4.33172 9.16536 4.16666C9.16536 3.7075 9.5387 3.33333 9.9987 3.33333ZM14.1654 16.6667C13.9508 16.6571 13.7482 16.5651 13.5998 16.4098C13.4513 16.2546 13.3685 16.0481 13.3685 15.8333C13.3685 15.6185 13.4513 15.412 13.5998 15.2568C13.7482 15.1016 13.9508 15.0096 14.1654 15C14.3799 15.0096 14.5825 15.1016 14.731 15.2568C14.8794 15.412 14.9623 15.6185 14.9623 15.8333C14.9623 16.0481 14.8794 16.2546 14.731 16.4098C14.5825 16.5651 14.3799 16.6571 14.1654 16.6667Z" fill="#666"></path></g></svg><span className='leftbar__item__title__whatsapp'>Whastapp Flows</span><div class="whatsapp__new">New</div></a></li>
                        </div>
                        <div className='msgContR'>

                            {renderContent()}
                        </div>
                    </div>
                }
            </div>

        </>
    );
}
export default Automations;