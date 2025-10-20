import React, { useState } from 'react'
import { EditIcon, ArrowBackIcon } from '../Icon';
import MessageSettingModal from './PopupModal/Sequence/MessageSettingModal';
import SearchboxComponent from '../SearchboxComponent';
import ButtonComponent from '../ButtonComponent';
import ToggleSwitch from '../ToggleSwitch';
import DeleteModal from '../DeleteModal';
import AddSequenceModal from './PopupModal/Sequence/AddSequenceModal';
import TableComponent from '../TableComponent';
import CustomPagination from '../CustomPagination';


//initial default table data
const columns = [
    { id: "name", label: "Name" },
    { id: "messages", label: "Message" },
    { id: "triggered", label: "Triggered" },
    { id: "completed", label: "Completed" },
];

const initialTableData = [
    { id: 1, name: 'finish', messages: 1, triggered: 0, completed: '0%' },
    { id: 2, name: 'test', messages: 1, triggered: 0, completed: "0%" },
    { id: 3, name: 'incomplete', messages: 0, triggered: 0, completed: "0%" },
    { id: 4, name: 'normal', messages: 0, triggered: 0, completed: "0%" },
]

//sequenceId table
const sequenceIdColumns = [
    { id: "icon", label: "" },
    { id: "active", label: "Active" },
    { id: "schedule", label: "Schedule" },
    { id: "actionName", label: "Action Name" },
    { id: "sent", label: "Sent" },
];

//sequence Main Component 
const Sequence = () => {

    const [state, setState] = useState({
        sequenceData: initialTableData,
        searchSequence: '',
        isOpenDeleteModal: false,
        rowIndexToDelete: null,
        addSequenceModal: false,
        sequenceId: false,
        sequenceName: '',
        isEditing: false,
        messageSettingModal: false,
        savedMessages: [],
        editIndex: null,
        isOpenDeleteAddmsgModal: false,
        rowIndexToDeleteAddmsg: null,
        isActive: false,
        editSequenceIndex: null,
        page: 0,
        rowsPerPage: 5,
    });


    const handleToggle = () => {
        setState(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    //pagination 
    const handleChangePage = (event, newPage) => {
        setState((prevState) => ({
            ...prevState,
            page: newPage,
        }));
    };
    const handleChangeRowPerPage = (event) => {
        setState((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0, // Reset to first page
        }));
    };
    // default table--> delete 
    const handleDeleteOpenModal = (index) => {
        setState(prev => ({
            ...prev,
            rowIndexToDelete: index,
            isOpenDeleteModal: true
        }));
    };
    const handleDeleteCloseModal = () => {
        setState(prev => ({
            ...prev,
            rowIndexToDelete: null,
            isOpenDeleteModal: false,
        }));
    };

    // const handleDeleteConfirm = () => {
    //     if (rowIndexToDelete !== null) {
    //         setSequenceData(prev => prev.filter((_, index) => index !== rowIndexToDelete))
    //     }
    //     handleDeleteCloseModal();
    // }

    // add sequence Name
    const handleOpenAddSequenceModal = () => {
        setState(prev => ({
            ...prev,
            addSequenceModal: true,
            isEditing: false,
        }));
    };

    //edit sequence Name
    const handleOpenEditSequenceModal = () => {
        setState(prev => ({
            ...prev,
            addSequenceModal: true,
            isEditing: true,
        }));
    };

    const handleCloseAddSequence = () => {
        setState(prev => ({
            ...prev,
            addSequenceModal: false,
        }));
    };


    // save add and edit sequence Name
    const handleSaveAddSequence = (newName) => {
        setState(prev => ({
            ...prev,
            sequenceName: newName,
            addSequenceModal: false,
            sequenceId: true,
        }));
    };


    //  edit (sequenceId)
    const handleEditOpenModal = (index) => {
        setState(prev => ({
            ...prev,
            sequenceName: prev.sequenceData[index].name,
            addSequenceModal: false,
            sequenceId: true,
            editSequenceIndex: index,
        }));
    };

    // message settings modal
    const handleOpenMessagesettingsModal = (messageIndex = null) => {
        setState(prev => ({
            ...prev,
            editIndex: messageIndex !== null ? messageIndex : null,
            messageSettingModal: true,
        }));
    };
    const handleCloseMssagesettingsModal = () => {
        setState(prev => ({
            ...prev,
            messageSettingModal: false,
        }));
    };

    // save add and edit message settings modal
    const handleSaveMessagesettingsModal = (savedValues) => {
        setState(prev => {
            const updatedMessages = [...prev.savedMessages];

            if (prev.editIndex !== null) {
                updatedMessages[prev.editIndex] = savedValues;
            } else {
                updatedMessages.push(savedValues);
            }

            return {
                ...prev,
                savedMessages: updatedMessages,
                editIndex: null,
                messageSettingModal: false,
            };
        });
    };


    // delete data of  sequence id table
    const handleDeleteRow = (index) => {
        setState(prev => ({
            ...prev,
            isOpenDeleteAddmsgModal: true,
            rowIndexToDeleteAddmsg: index,
        }));
    };
    const handleDeleteAddmsgCloseModal = () => {
        setState(prev => ({
            ...prev,
            isOpenDeleteAddmsgModal: false,
            rowIndexToDeleteAddmsg: null,
        }));
    };

    // const handleDeleteAddmsgConfirm = () => {
    //     if (rowIndexToDeleteAddmsg !== null) {
    //         setSavedMessages((prevMessages) =>
    //             prevMessages.filter((_, index) => index !== rowIndexToDeleteAddmsg)
    //         );
    //     }
    //     setOpenDeleteAddmsgModal(false);
    //     setRowIndexToDeleteAddmsg(null);
    // };
    // back button
    const handleSequenceBackbutton = () => {
        setState(prev => {
            let updatedData = [...prev.sequenceData];

            if (prev.editSequenceIndex !== null) {
                updatedData = updatedData.map((row, index) =>
                    index === prev.editSequenceIndex
                        ? {
                            ...row,
                            name: prev.sequenceName,
                            messages: prev.savedMessages.length,
                        }
                        : row
                );
            } else {
                const newSequence = {
                    id: prev.sequenceData.length + 1,
                    name: prev.sequenceName,
                    messages: prev.savedMessages.length,
                    triggered: 0,
                    completed: '0%',
                };
                updatedData = [newSequence, ...prev.sequenceData];
            }

            return {
                ...prev,
                sequenceId: false,
                sequenceData: updatedData,
                sequenceName: '',
                editSequenceIndex: null,
            };
        });
    };

    //sequenceId Table
    const sequenceIdData = state.savedMessages.map((message) => ({
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 6L20 10L4 10L4 6L20 6Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20 14L20 18L4 18L4 14L20 14Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        ),
        active: (
            <ToggleSwitch
                onToggle={() => handleToggle(message.id)}
                isActive={state.isActive}
            />
        ),
        schedule: (
            <>
                {message.timeCount ? `after ${message.timeCount} ` : ""}
                <span>{message.data}</span>
            </>
        ),
        actionName: message.content,
        sent: 0,
    }));

    return (
        <>
            {
                state.isOpenDeleteModal && (<DeleteModal show={state.isOpenDeleteModal} onClose={handleDeleteCloseModal}
                    // onConfirm={handleDeleteConfirm} 
                    msg='Do you want to remove this sequence?'
                />)
            }
            {
                state.isOpenDeleteAddmsgModal &&
                (<DeleteModal show={state.isOpenDeleteAddmsgModal} onClose={handleDeleteAddmsgCloseModal}
                    //  onConfirm={handleDeleteAddmsgConfirm}
                    msg='Do you want to remove this sequence?' />)
            }
            {
                state.addSequenceModal &&
                <AddSequenceModal show={state.addSequenceModal} onClose={handleCloseAddSequence} onSave={handleSaveAddSequence}
                    initialName={state.isEditing ? state.sequenceName : ''}
                    isEditing={state.isEditing} />
            }
            {
                state.messageSettingModal &&
                <MessageSettingModal show={state.messageSettingModal} onClose={handleCloseMssagesettingsModal} onSave={handleSaveMessagesettingsModal}
                    initialData={state.editIndex !== null ? state.savedMessages[state.editIndex] : null} />

            }

            {
                state.sequenceId ? (
                    <>
                        <div className='sequence_container'>
                            <div className='sequence_header'>
                                <div className='header_name'>
                                    <ArrowBackIcon onClick={handleSequenceBackbutton} />
                                    {state.sequenceName}
                                    <EditIcon onClick={handleOpenEditSequenceModal} />
                                </div>
                                <ButtonComponent label='Add Message' onClick={() => handleOpenMessagesettingsModal()} />

                            </div>
                            <div className='sequence__body__content'>
                                <div className='sequence__list__table'>

                                    <TableComponent
                                        columns={sequenceIdColumns}
                                        data={sequenceIdData}
                                        onEdit={handleOpenMessagesettingsModal}
                                        onDelete={handleDeleteRow}
                                    />
                                </div>

                            </div>
                        </div>
                    </>)
                    :
                    (
                        <div className='sequence_container'>
                            <div className='sequence_header'>
                                <h3 class="header__title">Sequences</h3>
                                <div className='header__search'>
                                    <SearchboxComponent value={state.searchSequence} onChange={(e) => setState(prev => ({ ...prev, searchSequence: e.target.value }))} customSearch='custom__search_box' placeholder='Search...' />
                                </div>
                                <a href="https://www.youtube.com/watch?v=plhp--9B9b8" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>
                                <ButtonComponent label='Add Sequence' onClick={handleOpenAddSequenceModal} />

                            </div>
                            <div className='sequence__body__content'>
                                <div className='sequence__list__table'>

                                    <TableComponent columns={columns} data={state.sequenceData} onEdit={handleEditOpenModal} onDelete={handleDeleteOpenModal} />
                                </div>
                                <div className='sequence__pagination'>
                                    <CustomPagination
                                        count={state.sequenceData.length}
                                        page={state.page}
                                        rowsPerPage={state.rowsPerPage}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowPerPage}
                                    />

                                </div>
                            </div>
                        </div>
                    )
            }

        </>
    )

}
export default Sequence;