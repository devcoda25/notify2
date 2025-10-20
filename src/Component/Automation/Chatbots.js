import React, { useState } from 'react';
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

import { useFlowsStore } from './Chatbots/flowbuilder/store/flows';

const Chatbots = ({ handleEditChatbotbutton /*, authUser */ }) => {
  const { flows, deleteFlow, setActiveFlow } = useFlowsStore();
  const [state, setState] = useState({
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

  const updateState = (updatedValues) => {
    setState((prev) => ({ ...prev, ...updatedValues }));
  };

  const handleChangePage = (_, newPage) => {
    updateState({ page: newPage });
  };

  const handleChangeRowPerPage = (event) => {
    updateState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  // Template / Notification flows
  const handleTemplatePage = () => updateState({ isOpenTemplatePage: true });

  const handleNotificationModal = () =>
    updateState({ isOpenNotificationModal: true, isOpenTemplatePage: false });

  const handleCloseNotificationModal = () =>
    updateState({ isOpenNotificationModal: false });

  const handleFallbackMessage = () => updateState({ isOpenFallbackMessage: true });
  const handleCloseFallbackMessage = () => updateState({ isOpenFallbackMessage: false });
  const handleSaveFallbackMessage = () => updateState({ isOpenFallbackMessage: false });

  const handleChatbotTimer = () => updateState({ isOpenChatbotTimer: true });
  const handleCloseChatbotTimer = () => updateState({ isOpenChatbotTimer: false });
  const handleSaveChatbotTimer = () => updateState({ isOpenChatbotTimer: false });

  const handleDeleteCloseModal = () =>
    updateState({ rowIndexToDelete: null, isOpenDeleteModal: false });

  const handleDeleteOpenModal = (flowId) =>
    updateState({ rowIndexToDelete: flowId, isOpenDeleteModal: true });

  const handleDeleteConfirm = () => {
    if (state.rowIndexToDelete !== null) deleteFlow(state.rowIndexToDelete);
    handleDeleteCloseModal();
  };

  const filterChatbots = flows.filter((row) =>
    row.title.toLowerCase().includes(state.searchChatbots.toLowerCase())
  );

  const paginatedChatbotsData = filterChatbots.slice(
    state.page * state.rowsPerPage,
    state.page * state.rowsPerPage + state.rowsPerPage
  );

  const handleOpenCopyModal = () => updateState({ isOpenCopyModal: true });
  const handleCloseCopy = () => updateState({ isOpenCopyModal: false });
  const handleSaveCopy = () =>
    updateState({ isOpenCopyModal: false, isOpenNotificationModal: true });

  const handleEdit = (flowId) => {
    setActiveFlow(flowId);
    handleEditChatbotbutton();
  };

  // ✅ Define handleSave so FlowTemplates has a valid callback
  const handleSave = (_newFlow) => {
    // If you have an addFlow action in your store, you could add it here.
    // addFlow(_newFlow);
    updateState({ isOpenTemplatePage: false, isOpenNotificationModal: true });
  };

  const chatbotColumn = [
    { id: 'name', label: 'Name' },
    { id: 'triggered', label: 'Triggered' },
    { id: 'stepsFinished', label: 'Steps Finished' },
    { id: 'finished', label: 'Finished' },
    { id: 'modifiedOn', label: 'Modified On' },
  ];

  const customRenderCell = (row, column) => {
    switch (column.id) {
      case 'name':
        return (
          <div className="chatbots_name_fieldcontainer">
            <div className="chatbots_name_field">{row.name}</div>
          </div>
        );
      default:
        return row[column.id];
    }
  };

  return (
    <>
      {state.isOpenDeleteModal && (
        <DeleteModal
          show={state.isOpenDeleteModal}
          onClose={handleDeleteCloseModal}
          // onConfirm={handleDeleteConfirm}
          msg="Do you want to remove this chatbot?"
        />
      )}

      {state.isOpenNotificationModal && (
        <NotificationModal
          show={state.isOpenNotificationModal}
          msg="The limit on chatbots is reached and the chatbot cannot be created."
          value="20"
          onClose={handleCloseNotificationModal}
        />
      )}

      {state.isOpenFallbackMessage && (
        <FallbackMessageModal
          show={state.isOpenFallbackMessage}
          onClose={handleCloseFallbackMessage}
          onSave={handleSaveFallbackMessage}
        />
      )}

      {state.isOpenChatbotTimer && (
        <ChatbotTimerModal
          show={state.isOpenChatbotTimer}
          onClose={handleCloseChatbotTimer}
          onSave={handleSaveChatbotTimer}
        />
      )}

      {state.isOpenCopyModal && (
        <CopyandAddModal
          show={state.isOpenCopyModal}
          onClose={handleCloseCopy}
          onSave={handleSaveCopy}
          placeholder="Chatbot Name"
          buttonLabel="Copy"
        />
      )}

      {state.isOpenTemplatePage ? (
        <FlowTemplates
          onEdit={handleEdit}
          handleNotificationModal={handleNotificationModal}
          handleEditChatbotbutton={handleEditChatbotbutton}
          onSave={handleSave} // ✅ now defined
        />
      ) : (
        <div className="chatbots_container">
          <div className="chatbots_header">
            <div className="chatbots_header_div1">
              <h3 className="header__title">
                Chatbots
                <p className="header__title_count">(22/20)</p>
              </h3>

              <div className="header__search">
                <div className="search__input">
                  <SearchboxComponent
                    value={state.searchChatbots}
                    onChange={(e) => updateState({ searchChatbots: e.target.value })}
                    customSearch="custom__search_box"
                    placeholder="Search..."
                  />
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=zNCNTsGDbXM"
                target="_blank"
                rel="noreferrer"
                className="note-watch-tutorial"
              >
                <div className="watch-tutorial-content">
                  <svg
                    className="importicon"
                    viewBox="-0.5 -3.2 16 26"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z"
                      fill="#666666"
                    />
                  </svg>
                  <span className="watch-tutorial__text">Watch Tutorial</span>
                </div>
              </a>

              <ButtonComponent
                label="Fallback Message"
                onClick={handleFallbackMessage}
                customBtn="cancel_button_style chatbot_header_btn"
              />
              <ButtonComponent
                label="Chatbot Timer"
                onClick={handleChatbotTimer}
                customBtn="cancel_button_style chatbot_header_btn"
              />
              <button className="header_import_btn">
                <svg
                  className="importicon"
                  viewBox="-0.5 -3.2 16 26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z"
                    fill="#666666"
                  />
                </svg>
              </button>
            </div>

            <div className="chatbots_header_div2">
              <ButtonComponent
                customBtn="add_chatbot_button"
                label="Add Chatbot"
                onClick={handleTemplatePage}
              />
            </div>
          </div>

          <div className="chatbots__body__content">
            <div className="chatbots__list__table">
              <TableComponent
                // authUser={authUser} // ❌ removed to avoid 'authUser is not defined' lint
                columns={chatbotColumn}
                data={paginatedChatbotsData}
                customRenderCell={customRenderCell}
                onDelete={handleDeleteOpenModal}
                showCopy={true}
                onEdit={handleEdit}
                onCopy={handleOpenCopyModal}
                actionHeaderLabel="Actions"
              />
            </div>

            <div className="chatbots__pagination">
              <CustomPagination
                count={filterChatbots.length}
                rowsPerPage={state.rowsPerPage}
                page={state.page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowPerPage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbots;
