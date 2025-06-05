import React, { useState } from 'react'
import DeleteModal from '../DeleteModal';
import CopyandAddModal from './PopupModal/Chatbot/CopyandAddModal';
import FlowTemplates from './PopupModal/Chatbot/FlowTemplates';
import NotificationModal from './PopupModal/Chatbot/NotificationModal';
import FallbackMessageModal from './PopupModal/Chatbot/FallbackMessageModal';
import ChatbotTimerModal from './PopupModal/Chatbot/ChatbotTimerModal';
import CustomPagination from '../CustomPagination';
import SearchboxComponent from '../SearchboxComponent';
import ButtonComponent from '../ButtonComponent';
import TableComponent from '../TableComponent';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';

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

const Chatbots = ({ handleEditChatbotbutton, onSave }) => {
    const [state, setState] = useState({
        chatbotData: initialTableData,
        searchChatbots: '',
        page: 0,
        rowsPerPage: 5,
        isOpenFallbackMessage: false,
        isOpenChatbotTimer: false,
        isOpenDeleteModal: false,
        rowIndexToDelete: null,
        isOpenCopyModal: false,
        isOpenTemplatePage: false,
        isOpenNotificationModal: false,
    });
    const navigate = useNavigate();

     const location = useLocation();
      const { authUser: routeAuthUser } = useParams();
      
      const authUser = useMemo(() => {
        if (routeAuthUser) {
          return routeAuthUser;
        }
        
        const regex = /\/u\/([^/]+)/;
        const match = location.pathname.match(regex);
        return match ? match[1] : '0';
      }, [routeAuthUser, location.pathname]);
   

   const updateState = (updatedValues) => {
        setState((prev) => ({ ...prev, ...updatedValues }));
    };

    // handle pagination and filter
    const handleChangePage = (event, newPage) => {
        updateState({ page: newPage });
    };

    const handleChangeRowPerPage = (event) => {
        updateState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    // const handlePreviousPage = () => {
    //     if (state.page > 0) {
    //         updateState({ page: state.page - 1 });
    //     }
    // };

    // const handleNextPage = () => {
    //     if (state.page < Math.ceil(state.chatbotData.length / state.rowsPerPage) - 1) {
    //         updateState({ page: state.page + 1 });
    //     }
    // };

   
    // const filterChatbots = state.chatbotData.filter(row =>
    //     row.name.toLowerCase().includes(state.searchChatbots.toLowerCase())
    // );

    

    // const paginatedChatbotsData = filterChatbots.slice(
    //     state.page * state.rowsPerPage,
    //     state.page * state.rowsPerPage + state.rowsPerPage
    // );
    //addchatbot --> template
    
    const handleTemplatePage = () => {
        updateState({ isOpenTemplatePage: true });
    };

    const handleNotificationModal = () => {
        updateState({
            isOpenNotificationModal: true,
            isOpenTemplatePage: false,
        });
    };

    const handleCloseNotificationModal = () => {
        updateState({ isOpenNotificationModal: false });
    };

    const handleFallbackMessage = () => {
        updateState({ isOpenFallbackMessage: true });
    };

    const handleCloseFallbackMessage = () => {
        updateState({ isOpenFallbackMessage: false });
    };

    const handleSaveFallbackMessage = () => {
        updateState({ isOpenFallbackMessage: false });
    };
    const handleChatbotTimer = () => {
        updateState({ isOpenChatbotTimer: true });
    };

    const handleCloseChatbotTimer = () => {
        updateState({ isOpenChatbotTimer: false });
    };

    const handleSaveChatbotTimer = () => {
        updateState({ isOpenChatbotTimer: false });
    };

    const handleDeleteCloseModal = () => {
        updateState({
            rowIndexToDelete: null,
            isOpenDeleteModal: false
        });
    };

    const handleDeleteOpenModal = (index) => {
        updateState({
            rowIndexToDelete: index,
            isOpenDeleteModal: true
        });
    };

    // const handleDeleteConfirm = () => {
    //     if (state.rowIndexToDelete !== null) {
    //         updateState({
    //             chatbotData: state.chatbotData.filter((_, index) => index !== state.rowIndexToDelete),
    //         });
    //     }
    //     handleDeleteCloseModal();
    // };

    const handleOpenCopyModal = () => {
        updateState({ isOpenCopyModal: true });
    };

    const handleCloseCopy = () => {
        updateState({ isOpenCopyModal: false });
    };

    const handleSaveCopy = () => {
        updateState({
            isOpenCopyModal: false,
            isOpenNotificationModal: true
        });
    };

    const handleSave = (chatbotName) => {
        onSave(chatbotName);
    };

    const handleEdit = ()=>{
        navigate(`/u/${authUser}/editchatbotpage`)
    }
   
   const chatbotColumn = [
        {
            id: 'name', label: 'Name'
        },
        {
            id: 'triggered', label: 'Triggered'
        },
        {
            id: 'stepsFinished', label: 'Steps Finished'
        },
        {
            id: 'finished', label: 'Finished'
        },
        {
            id: 'modifiedOn', label: 'Modified On'
        },
       
    ]
    const customRenderCell = (row, column) => {
        switch (column.id) {
            case 'name':
                return (
                    <div className='chatbots_name_fieldcontainer'>
                        <div className='chatbots_name_field'>{row.name}</div>
                    </div>
                );
           

            default:
                return row[column.id];
        }
    };

    return (
        <>
            {
                state.isOpenDeleteModal && (<DeleteModal show={state.isOpenDeleteModal} onClose={handleDeleteCloseModal}
                    // onConfirm={handleDeleteConfirm} 
                    msg='Do you want to remove this chatbot?' />)
            }
            {
                state.isOpenNotificationModal &&
                <NotificationModal show={state.isOpenNotificationModal} msg='The limit on chatbots is reached and the chatbot cannot be created.' value='20' onClose={handleCloseNotificationModal} />
            }
            {
                state.isOpenFallbackMessage &&
                <FallbackMessageModal show={state.isOpenFallbackMessage} onClose={handleCloseFallbackMessage} onSave={handleSaveFallbackMessage} />
            }
            {
                state.isOpenChatbotTimer &&
                <ChatbotTimerModal show={state.isOpenChatbotTimer} onClose={handleCloseChatbotTimer} onSave={handleSaveChatbotTimer} />
            }
            {
                state.isOpenCopyModal &&
                <CopyandAddModal show={state.isOpenCopyModal} onClose={handleCloseCopy} onSave={handleSaveCopy}
                    placeholder="Chatbot Name"
                    buttonLabel="Copy" />
            }
            {
                state.isOpenTemplatePage ?
                    <FlowTemplates onEdit={handleEdit} handleNotificationModal={handleNotificationModal} handleEditChatbotbutton={handleEditChatbotbutton} onSave={handleSave} /> :

                    <div className='chatbots_container'>
                          <div className='chatbots_header'>
                             <div className='chatbots_header_div1'>
                                 <h3 class="header__title">Chatbots<p class="header__title_count">(22/20)</p></h3>
                            <div className='header__search'>
                                <div className='search__input'>
                                    <SearchboxComponent value={state.searchChatbots} onChange={(e) => updateState({ searchChatbots: e.target.value })} customSearch='custom__search_box' placeholder='Search...' />

                                </div>
                            </div>
                            <a href="https://www.youtube.com/watch?v=zNCNTsGDbXM" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>
                            <ButtonComponent label='Fallback Message' onClick={handleFallbackMessage} customBtn='cancel_button_style chatbot_header_btn' />
                            <ButtonComponent label='Chatbot Timer' onClick={handleChatbotTimer} customBtn='cancel_button_style chatbot_header_btn' />
                            <button className='header_import_btn'><svg className="importicon" viewBox="-0.5 -3.2 16 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z" fill="#666666"></path></svg></button>
                                </div>
                        <div className='chatbots_header_div2'>
                            <ButtonComponent customBtn={"add_chatbot_button"} label='Add Chatbot' onClick={handleTemplatePage} />
                        </div>

                        </div>
                        <div className='chatbots__body__content'>
                            <div className='chatbots__list__table'>
                      
                                 <TableComponent
                                 authUser = {authUser}
                                columns={chatbotColumn}
                                data={state.chatbotData}
                                customRenderCell={customRenderCell}
                                onDelete={handleDeleteOpenModal}
                                showCopy={true}
                                onEdit={handleEdit}
                                onCopy={handleOpenCopyModal}
                                actionHeaderLabel="Actions"
                                />

                            </div>
                            <div className='chatbots__pagination'>
                                <CustomPagination
                                    count={state.chatbotData.length}
                                    rowsPerPage={state.rowsPerPage}
                                    page={state.page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowPerPage}
                                />

                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Chatbots;