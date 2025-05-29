import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import TextComponent from './NextSteps/TextComponent';
import EditTextModal from './NextSteps/Modal/EditTextModal';
import DocumentComponent from './NextSteps/DocumentComponent';
import ImageComponent from './NextSteps/ImageComponent';
import VideoComponent from './NextSteps/VideoComponent';
import EditCaptionModal from './NextSteps/Modal/EditCaptionModal';
import StickerComponent from './NextSteps/StickerComponent';
import ChatbotsComponent from './NextSteps/ChatbotsComponent';
import SequencesComponent from './NextSteps/SequenceComponent';
import ContactComponent from './NextSteps/ContactComponent';
import EditContactAttributesModal from './NextSteps/Modal/EditContactAttributeModal';
import DeleteModal from '../DeleteModal';
import Cuppysmile from '../Assets/img/01_Cuppy_smile.webp';
import Cuppylol from '../Assets/img/02_Cuppy_lol.webp';
import Cuppyrofl from '../Assets/img/03_Cuppy_rofl.webp';
import Cuppysad from '../Assets/img/04_Cuppy_sad.webp';
import Cuppycry from '../Assets/img/05_Cuppy_cry.webp';
import Cuppylove from '../Assets/img/06_Cuppy_love.webp';
import Cuppyhate from '../Assets/img/07_Cuppy_hate.webp';
import Cuppylovewithmug from '../Assets/img/08_Cuppy_lovewithmug.webp';
import Cuppylovewithcookie from '../Assets/img/09_Cuppy_lovewithcookie.webp';
import Cuppyhmm from '../Assets/img/10_Cuppy_hmm.webp';
import SendNotificationComponent from './NextSteps/SendNotificationComponent';
import AssigntoUserComponent from './NextSteps/AssigntoUserComponent';
import AssigntoTeamComponent from './NextSteps/AssigntoTeamComponent';
import CatalogComponent from './NextSteps/CatalogComponent';
import ButtonComponent from '../ButtonComponent';
import SearchboxComponent from '../SearchboxComponent';
import CustomPagination from '../CustomPagination';
import EditNotificationModal from './NextSteps/Modal/EditNotificationModal';
import EditAssigntoUserModal from './NextSteps/Modal/EditAssigntoUserModal';
import EditAssigntoTeamModal from './NextSteps/Modal/EditAssigntoTeamModal';
import TemplateComponent from './NextSteps/TemplateComponent';

const initialCardData = [
    {
        title: "Offline_message",
        content: "Dear {{name}} we're unavailable right now"
    },
    {
        title: 'confirmed order',
        content: 'Your Order was confirmed and processed already 😊'
    },
    {
        title: 'Rating',
        content: "Thank you again 🤝 {{Name}}. We hope to serve you again soon. Goodbye ! 👋Incase you havent save this WhatsApp number, kindly add +256393249612 to your address book to avoid inconvinience in your future bookings via WhatsApp Visit www.evzone.app to view our other services"
    }
]
const initialDocumentData = [];
const initialImageData = [];
const initialVideoData = [];
const initialStickerData = [
    {
        title: "01_Cuppy_smile.webp",
        content: Cuppysmile
    },
    {
        title: "02_Cuppy_lol.webp",
        content: Cuppylol
    },
    {
        title: "03_Cuppy_rofl.webp",
        content: Cuppyrofl
    },
    {
        title: "04_Cuppy_sad.webp",
        content: Cuppysad
    },
    {
        title: "05_Cuppy_cry.webp",
        content: Cuppycry
    },
    {
        title: "06_Cuppy_love.webp",
        content: Cuppylove
    },
    {
        title: "07_Cuppy_hate.webp",
        content: Cuppyhate
    },
    {
        title: "08_Cuppy_lovewithmug.webp",
        content: Cuppylovewithmug
    },
    {
        title: "09_Cuppy_lovewithcookie.webp",
        content: Cuppylovewithcookie
    },
    {
        title: "10_Cuppy_hmm.webp",
        content: Cuppyhmm
    }
];
const initialChatbotsData = [
    { title: 'Other_Options' },
    { title: 'Fleet_ownership' },
    { title: 'Chargepoint owner ship' },
    { title: 'Become a driver' },
    { title: 'Charging' },
    { title: 'Investors' },
    { title: 'Agent enrollment' },
    { title: 'Charge point operator' },
    { title: 'Book_for_someone_a_ride_now' },
    { title: 'deliver_a_parcel_now' },
    { title: 'Recieve_parcel(food)' },
    { title: 'EV Market' },
    { title: 'Sell_EV_market' },
    { title: 'Buy_EV_Market' },
    { title: 'soon_to_be_closed' },
    { title: 'rides-flow' },
    { title: 'payment_process' },
    { title: 'dispatch' },
    { title: 'reschedule_order' },
    { title: 'cancel_order' },
    { title: 'ratings' },
    { title: 'Catalog' }
]
const initialSequencesData = [
    { title: 'normal' },
    { title: "incomplete" },
    { title: 'test' },
    { title: 'finish' }
]
const initialContactData = [];
const initialSendNotificationData = [];
const initialAssigntoUserData = [];
const initialAssigntoTeamData = [];




const Nextstep = ({
    buttonData,
    InitialLoadingData,
    isOpenEditPage,
    isAddOpenPage,
    selectedEditRow,
    isMaterialCheckedAdd,
    isMaterialCheckedEdit,
    handleDeleteMaterial,
    handleCheckboxToggle,
    handleCancelBtn,
    handleSaveBtn,
    setIsOpenYourTemplate,
    showCheckboxes = true }) => {

    const [cardData, setCardData] = useState(() => {

        const storedData = sessionStorage.getItem('cardData');
        return storedData ? JSON.parse(storedData) : {
            textCards: initialCardData,
            documentCards: initialDocumentData,
            imageCards: initialImageData,
            videoCards: initialVideoData,
            stickerCards: initialStickerData,
            chatbotsCards: initialChatbotsData,
            sequencesCards: initialSequencesData,
            contactCards: initialContactData,
            // templateCards: initialTemplateData,
            notificationCards: initialSendNotificationData,
            assigntouserCards: initialAssigntoUserData,
            assigntoteamCards: initialAssigntoTeamData,
        };
    });

    useEffect(() => {

        sessionStorage.setItem('cardData', JSON.stringify(cardData));
    }, [cardData])

    const [searchCardData, setSearchCardData] = useState('');
    const [showDeleteTextModal, setShowDeleteTextModal] = useState(false);
    const [cardTextToDelete, setCardTextToDelete] = useState(null);
    const [editTextModal, setEditTextModal] = useState(false);
    const [selectedTextCard, setSelectedTextCard] = useState(null);
    const [isTextEditing, setTextEditing] = useState(false);
    const [selectedButton, setSelectedButton] = useState(InitialLoadingData);
    const [isOpenEditCaption, setIsOpenEditCaption] = useState(false);
    const [isOpenChatbotsConfirmModal, setOpenChatbotsConfirmModal] = useState(false);
    const [isOpenSequenceConfirmModal, setOpenSequenceConfirmModal] = useState(false);
    const [isOpenContactAttributesModal, setOpenContactAttributesModal] = useState(false);
    const [isOpenNotificationModal, setOpenNotificationModal] = useState(false);
    const [isOpenAssigntoUserModal, setOpenAssigntoUserModal] = useState(false);
    const [isOpenAssigntoTeamModal, setOpenAssigntoTeamModal] = useState(false);
    const [keywordPage, setKeywordPage] = useState(0);
    const [keywordrowsPerPage, setKeywordRowsPerPage] = useState(10);


    const handleChangeKeywordPage = (event, newPage) => {
        setKeywordPage(newPage);
    };

    // Handle rows per page change
    const handleChangeKeywordRowsPerPage = (event) => {
        setKeywordRowsPerPage(parseInt(event.target.value, 10));
        setKeywordPage(0);
    };
    const filtercarddata = (selectedButton === 'Text' ?
        cardData.textCards.filter(data =>
            data.title.toLowerCase().includes(searchCardData.toLowerCase()) ||
            data.content.toLowerCase().includes(searchCardData.toLowerCase())
        )
        :
        selectedButton === 'Document' ?
            cardData.documentCards.filter(data =>
                data.title.toLowerCase().includes(searchCardData.toLowerCase())
            )
            :
            selectedButton === 'Image' ?
                cardData.imageCards.filter(data =>
                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                )
                :
                selectedButton === 'Video' ?
                    cardData.videoCards.filter(data =>
                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                    )
                    :
                    selectedButton === 'Sticker' ?
                        cardData.stickerCards.filter(data =>
                            data.title.toLowerCase().includes(searchCardData.toLowerCase())
                        )
                        : selectedButton === 'Chatbots' ?
                            cardData.chatbotsCards.filter(data =>
                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                            )
                            :
                            selectedButton === 'Sequences' ?
                                cardData.sequencesCards.filter(data =>
                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                )
                                :
                                selectedButton === 'Contact' ?
                                    cardData.contactCards.filter(data =>
                                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                    ) :
                                    // selectedButton === 'Templates' && cardData.templateCards
                                    //     ? cardData.templateCards.filter(data =>
                                    //         data.name.toLowerCase().includes(searchCardData.toLowerCase())
                                    //     )
                                        
                                        selectedButton === 'SendNotification' ?
                                            cardData.notificationCards.filter(data =>
                                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                            )
                                            :
                                            selectedButton === 'AssigntoUser' ?
                                                cardData.assigntouserCards.filter(data =>
                                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                                )
                                                :
                                                selectedButton === 'AssigntoTeam' ?
                                                    cardData.assigntoteamCards.filter(data =>
                                                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                                    )
                                                    :
                                                    []
    );
    const handleDeleteTextCard = (title) => {
        setCardTextToDelete(title);
        setShowDeleteTextModal(true);
    }

    const handleDeleteTextCardConfirm = () => {
        setCardData(prevData => ({
            textCards: prevData.textCards.filter(card => card.title !== cardTextToDelete),
            documentCards: prevData.documentCards.filter(card => card.title !== cardTextToDelete),
            imageCards: prevData.imageCards.filter(card => card.title !== cardTextToDelete),
            videoCards: prevData.videoCards.filter(card => card.title !== cardTextToDelete),
            stickerCards: prevData.stickerCards.filter(card => card.title !== cardTextToDelete),
            contactCards: prevData.contactCards.filter(card => card.title !== cardTextToDelete),
            notificationCards: prevData.notificationCards.filter(card => card.title !== cardTextToDelete),
            assigntouserCards: prevData.assigntouserCards.filter(card => card.title !== cardTextToDelete),
            assigntoteamCards: prevData.assigntoteamCards.filter(card => card.title !== cardTextToDelete)
        }));

        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    };

    const handleCloseDeleteTextCard = () => {
        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    }
    const handleEditTextModal = (card) => {
        setSelectedTextCard(card);
        setEditTextModal(true);
        setTextEditing(true);
    }

    const handleCloseEditTextModal = () => {
        setEditTextModal(false);
        setSelectedTextCard(null);
    }
    const handleEditCaptionModal = (card) => {
        setSelectedTextCard(card);
        setIsOpenEditCaption(true);
        setTextEditing(true);
    }

    const handleCloseEditCaptionModal = () => {
        setIsOpenEditCaption(false);
        setSelectedTextCard(null)
    }

    const handleSaveEditText = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                textCards: prevData.textCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                textCards: [...prevData.textCards, { title, content }]
            }));
        }
        handleCloseEditTextModal();
    };

    const handleSaveEditCaption = (newTitle) => {
        setCardData(prevData => {
            let updatedCards;

            if (selectedButton === 'Document') {
                updatedCards = prevData.documentCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    documentCards: updatedCards,
                };
            } else if (selectedButton === 'Image') {
                updatedCards = prevData.imageCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    imageCards: updatedCards,
                };
            } else if (selectedButton === 'Video') {
                updatedCards = prevData.videoCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    videoCards: updatedCards,
                };
            }

            return prevData;
        });

        handleCloseEditCaptionModal();
    };


    const handleAddTextCard = () => {
        if (selectedButton === 'Text') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setEditTextModal(true);
        } else if (selectedButton === 'Document') {
            document.getElementById('btn-file').click();
        }
        else if (selectedButton === 'Image') {
            document.getElementById('btn-file-img').click();
        }
        else if (selectedButton === 'Video') {
            document.getElementById('btn-file-video').click();
        }
        else if (selectedButton === 'Sticker') {
            document.getElementById('btn-file-stickerimg').click();
        }
        else if (selectedButton === 'Chatbots') {
            setOpenChatbotsConfirmModal(true);
        }
        else if (selectedButton === 'Sequences') {
            setOpenSequenceConfirmModal(true);
        }
        else if (selectedButton === 'Contact') {
            setOpenContactAttributesModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'Templates') {
            setIsOpenYourTemplate(true);
        }
        else if (selectedButton === 'SendNotification') {
            setOpenNotificationModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoUser') {
            setOpenAssigntoUserModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoTeam') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setOpenAssigntoTeamModal(true);
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        const loadedDocuments = Array.from(files).map(file => ({
            title: file.name,
        }));

        setCardData(prevState => ({
            ...prevState,
            documentCards: [...prevState.documentCards, ...loadedDocuments],
        }));
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0]; //get 1st image file
            const fileName = file.name;
            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                const newImageCard = {
                    title: fileName,
                    content: fileReader.result, // img URL
                };

                // Update the imageCards in state
                setCardData((prevData) => ({
                    ...prevData,
                    imageCards: [...prevData.imageCards, newImageCard],
                }));
            };

            fileReader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const videoFile = files[0];
            const videoTitle = videoFile.name; // fetch the file name as title

            // video url
            const videoURL = URL.createObjectURL(videoFile);


            setCardData(prevData => ({
                ...prevData,
                videoCards: [...prevData.videoCards, { title: videoTitle, content: videoURL }]
            }));
        }
    };
    const handleStickerImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newStickerData = {
                    title: file.name,
                    content: reader.result //image url
                };

                // Updatethe new sticker
                setCardData(prevCardData => ({
                    ...prevCardData,
                    stickerCards: [...prevCardData.stickerCards, newStickerData]
                }));


                event.target.value = '';
            };

            reader.readAsDataURL(file);
        }
    };
    const handleCloseChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(false);
    }
    const handleEditChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(true);
    }
    const handleCloseSequenceConfirm = () => {
        setOpenSequenceConfirmModal(false);
    }
    const handleEditSequenceConfirm = () => {
        setOpenSequenceConfirmModal(true);
    }
    const handleCloseContactAttributes = () => {
        setOpenContactAttributesModal(false);
    }
    const handleEditContactAttributes = (card) => {
        setOpenContactAttributesModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleCloseAssigntoUser = () => {
        setOpenAssigntoUserModal(false);
    }
    const handleEditAssigntoUser = (card) => {
        setOpenAssigntoUserModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleEditAssigntoTeam = (card) => {
        setSelectedTextCard(card);
        setTextEditing(true);
        setOpenAssigntoTeamModal(true);
    }
    const handleCloseAssigntoTeam = () => {
        setOpenAssigntoTeamModal(false);
    }
    const handleSaveAssigntoUser = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: prevData.assigntouserCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: [...prevData.assigntouserCards, { title, content }]
            }));
        }
        handleCloseAssigntoUser();

    }
    const handleSaveAssigntoTeam = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: prevData.assigntoteamCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: [...prevData.assigntoteamCards, { title, content }]
            }));
        }
        handleCloseAssigntoTeam();
    }
    const handleSaveContactAttributes = ({ title, rows }) => {


        if (isTextEditing) {
            // Update the existing card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: prevData.contactCards.map((card) =>
                    card.title === selectedTextCard.title ? { title, attributes: rows } : card
                ),
            }));
        } else {
            // Add new contact card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: [
                    ...prevData.contactCards,
                    { title, attributes: rows },
                ],
            }));
        }

        handleCloseContactAttributes();
    }
    const handleCloseNotification = () => {
        setOpenNotificationModal(false);
    }
    const handleEditNotification = (card) => {
        setOpenNotificationModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);

    }
    const handleSaveNotification = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: prevData.notificationCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: [...prevData.notificationCards, { title, content }]
            }));
        }
        handleCloseNotification();
    }

    return (
        <div>
            {
                showDeleteTextModal && (<DeleteModal show={showDeleteTextModal} onClose={handleCloseDeleteTextCard}
                    onConfirm={handleDeleteTextCardConfirm} msg='Do you want to remove this card?' />)
            }
            {
                editTextModal && (
                    <EditTextModal show={editTextModal} onClose={handleCloseEditTextModal} onSave={handleSaveEditText}
                        initialTitle={selectedTextCard?.title || ''}
                        initialContent={selectedTextCard?.content || ''} />
                )
            }
            {
                isOpenEditCaption &&
                <EditCaptionModal show={isOpenEditCaption} onClose={handleCloseEditCaptionModal} onSave={handleSaveEditCaption}
                    initialTitle={selectedTextCard?.title} />
            }
            {
                isOpenChatbotsConfirmModal &&
                <DeleteModal show={isOpenChatbotsConfirmModal} onClose={handleCloseChatbotsConfirm} msg='You will lose unsaved changes when you navigate to chatbot builder. Are you sure you want to continue?' />
            }
            {
                isOpenSequenceConfirmModal &&
                <DeleteModal show={isOpenSequenceConfirmModal} onClose={handleCloseSequenceConfirm} msg='Do you want to go to the Sequence Editor and lose not saved settings?' />
            }
            {
                isOpenContactAttributesModal &&
                <EditContactAttributesModal show={isOpenContactAttributesModal} onClose={handleCloseContactAttributes} onSave={handleSaveContactAttributes}
                    initialTitle={selectedTextCard?.title || ''}
                    initialRows={selectedTextCard?.attributes || [{ selectedOption: "", booleanOption: null, inputValue: "" }]} />
            }
            {
                isOpenNotificationModal &&
                <EditNotificationModal show={isOpenNotificationModal} onClose={handleCloseNotification} onSave={handleSaveNotification}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoUserModal &&
                <EditAssigntoUserModal show={isOpenAssigntoUserModal} onClose={handleCloseAssigntoUser} onSave={handleSaveAssigntoUser}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoTeamModal &&
                <EditAssigntoTeamModal show={isOpenAssigntoTeamModal} onClose={handleCloseAssigntoTeam} onSave={handleSaveAssigntoTeam}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }


            <div className='nextstep__editor__container'>
                <div className='nextstep_left_container'>
                    {
                        buttonData.map((btn, index) => (
                            <button key={index} className={`nextstep__btn__container ${selectedButton === btn.value ? 'active' : ''}`} onClick={() => setSelectedButton(btn.value)}>
                                <span class="tab-item__icon">{btn.icon}</span>
                                <span class="tab-item__name">{btn.name}</span>
                            </button>
                        ))
                    }

                </div>
                <div className='nextstep_right_container'>
                    <div className='materials__header'>

                        <div className='materials__search'>
                            <SearchboxComponent value={searchCardData} onChange={(e) => setSearchCardData(e.target.value)} customSearch='custom__search_box' placeholder='Search...' />

                        </div>
                        {showCheckboxes && (
                            <div className='select__material'>
                                <label className='selected__items'>Selected material :</label>

                                {isOpenEditPage && (
                                    <span>
                                        {selectedEditRow && Array.isArray(selectedEditRow.replyMaterial) && selectedEditRow.replyMaterial.length > 0 && (
                                            selectedEditRow.replyMaterial.map((material, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{material}</div>
                                                        <svg
                                                            className='selected_material_delete'
                                                            onClick={() => handleDeleteMaterial(material)}
                                                            aria-hidden="true"
                                                            viewBox="0 0 24 24"
                                                            data-testid="CancelIcon"
                                                        >
                                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                        {Object.entries(isMaterialCheckedEdit).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}

                                {isAddOpenPage && (
                                    <span>
                                        {Object.entries(isMaterialCheckedAdd).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className='material_btn_container'>
                            {showCheckboxes && (
                                <>
                                    <ButtonComponent customBtn='cancel_button_style' label='cancel' onClick={handleCancelBtn} />
                                    <ButtonComponent label='Save' onClick={handleSaveBtn} disabled={
                                        (isAddOpenPage && (!isMaterialCheckedAdd || Object.keys(isMaterialCheckedAdd).length === 0)) ||
                                        (isOpenEditPage && (!isMaterialCheckedEdit || Object.keys(isMaterialCheckedEdit).length === 0))
                                    } />

                                </>
                            )}
                            {selectedButton !== 'Catalog' && (
                                <ButtonComponent label='Add' onClick={handleAddTextCard} customBtn='keyword__add__btn' />

                            )}
                            <input id="btn-file" type="file" accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, text/plain, application/pdf" hidden
                                onChange={handleFileChange} />
                            <input id="btn-file-img" type="file" accept="image/jpeg, image/png, image/webp" hidden
                                onChange={handleImageChange} />
                            <input id="btn-file-video" type="file" accept="video/m4v, video/mp4, video/3gpp" hidden
                                onChange={handleVideoChange} />
                            <input id="btn-file-stickerimg" type="file" accept="image/webp" hidden onChange={handleStickerImageChange}
                            />
                        </div>

                    </div>

                    {
                        selectedButton === 'Text' && (
                            <TextComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditTextModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}

                            />
                        )
                    }
                    {
                        selectedButton === 'Document' && (
                            <DocumentComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Image' && (
                            <ImageComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Video' && (
                            <VideoComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sticker' && (
                            <StickerComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Chatbots' && (
                            <ChatbotsComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditChatbotsConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sequences' && (
                            <SequencesComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditSequenceConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Contact' && (
                            <ContactComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditContactAttributes}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {selectedButton === 'Templates' && (
                        <TemplateComponent
                            isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                            handleCheckboxToggle={handleCheckboxToggle}
                            showCheckboxes={showCheckboxes} />
                    )}


                    {
                        selectedButton === 'SendNotification' && (
                            <SendNotificationComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditNotification}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }

                    {
                        selectedButton === 'AssigntoUser' && (
                            <AssigntoUserComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoUser}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'AssigntoTeam' && (
                            <AssigntoTeamComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoTeam}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Catalog' && (
                            <CatalogComponent />
                        )
                    }


                </div>
                <div className='keyword__pagination'>
                    <CustomPagination
                        count={5}
                        rowsPerPage={keywordrowsPerPage}
                        page={keywordPage}
                        onPageChange={handleChangeKeywordPage}
                        onRowsPerPageChange={handleChangeKeywordRowsPerPage}
                    />

                </div>
            </div>


        </div>
    )
}
export default Nextstep;