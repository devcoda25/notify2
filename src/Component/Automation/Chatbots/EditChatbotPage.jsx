import React, { useEffect, useState, useRef, useCallback } from 'react'
import Card from './Card';
import EditNavContent from './EditNavContent';
import OperationItemContent from './OperationItemContent';
import CopyandAddModal from '../PopupModal/Chatbot/CopyandAddModal';
import ButtonComponent from '../../ButtonComponent';
import SetTagsModal from './Sidebar/SetTagsModal';
import AssignToTeamModal from './Sidebar/AssignToTeamModal';
import AssignToUserModal from './Sidebar/AssignToUserModal';
import TriggerChatbotModal from './Sidebar/TriggerChatbotModal';
import UpdateChatModal from './Sidebar/UpdateChatModal';
import TemplatesModal from './Sidebar/TemplatesModal';
import SetTimeDelayModal from './Sidebar/SetTimeDelayModal';
import WebhookModal from './Sidebar/WebhookModal';
import WhatsappFlowModal from './Sidebar/WhatsappFlowModal';
import UpdateAttributesModal from './Sidebar/UpdateAttributesModal';
import ButtonsModal from './Sidebar/ButtonsModal';
import QuestionModal from './Sidebar/QuestionModal';
import ListModal from './Sidebar/ListModal';
import ConditionModal from './Sidebar/ConditionModal';
import MessageOption from './Sidebar/MessageOption';
import { EditIcon } from '../../Icon';
import ReactFlow, { useNodesState, Position, ConnectionMode, ConnectionLineType, Handle, useEdgesState, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer';



const EditChatbotPage = ({ chatbotName }) => {

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLeftContainerVisible, setIsLeftContainerVisible] = useState(true);
    const [showAskQuestioncontent, setAskQuestionContent] = useState(false);
    const [cardContent, setCardContent] = useState([]);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState(null);
    const [connections, setConnections] = React.useState([]);
    const [draggingCard, setDraggingCard] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [showModal, setShowModal] = useState(false);
    const [questionModal, setQuestionModal] = useState(false);
    const [buttonModal, setButtonModal] = useState(false);
    const [listModal, setListModal] = useState(false);
    const [updateAttributeModal, setUpdateAttributeModal] = useState(false)
    const [tagsModal, setTagsModal] = useState(false);
    const [assignToTeamModal, setAssignToTeamModal] = useState(false);
    const [assignToUserModal, setAssignToUserModal] = useState(false);
    const [triggerChatbotModal, setTriggerChatbotModal] = useState(false);
    const [updateChatModal, setUpdateChatModal] = useState(false);
    const [timedelayModal, setTimeDelayModal] = useState(false);
    const [templateModal, setTemplateModal] = useState(false);
    const [whatsappFlowModal, setWhatsappFlowModal] = useState(false);
    const [webhookModal, setWebhookModal] = useState(false);
    const [EditChatbotModal, setEditChatbotModal] = useState(false);
    const [currentChatbotName, setCurrentChatbotName] = useState("New User");

    const onConnect = useCallback(
        (params) =>
            setEdges((els) =>
                addEdge(
                    {
                        ...params,
                        style: { stroke: 'rgb(181, 181, 181)', strokeDasharray: '5 5' },
                        markerEnd: { type: 'arrowclosed', color: 'gray', fill: 'none', },
                        strokeWidth: 2
                    },
                    els
                )
            ),
        []
    );

    const handleComponentClick = (nodeId) => {
        const nodeToAdd = initialNodesData[nodeId];

        // Generate a unique ID 
        const newId = `${nodeId}-${nodes.filter(node => node.id.startsWith(nodeId)).length + 1}`;
        console.log('New ID being created:', newId);

        // Update position for the new node
        const newPosition = {
            x: nodeToAdd.position.x,
            y: nodes.length * 100,
        };

        const newNode = {
            ...nodeToAdd,
            id: newId,
            position: newPosition,
            data: {
                label: React.cloneElement(nodeToAdd.data.label, {
                    onDelete: () => handleDeleteNode(newId),
                    onCopy: () => handleCopyNode(newId),
                }),

            }


        };

        // Update the nodes state
        setNodes((prevNodes) => {
            const updatedNodes = [...prevNodes, newNode];
            console.log('Current nodes after adding:', updatedNodes);
            return updatedNodes;
        });
    };

    const toggleLeftContainer = () => {
        setIsLeftContainerVisible(prevState => !prevState);
    };


    const handleAskQuestionContent = () => {
        setAskQuestionContent(true);
    }
    const handleAskQuestionBackBtn = () => {
        setAskQuestionContent(false);
    }
    const handleConditionComponent = () => {
        setShowModal(true);
    }
    const handleCloseCondtion = () => {
        setShowModal(false);
    }
    const handleSaveCondition = () => {
        setShowModal(false)
    }
    const handleQuestion = () => {
        setQuestionModal(true);
    }
    const handleCloseQuestion = () => {
        setQuestionModal(false);
    }
    const handleSaveQuestion = () => {
        setQuestionModal(false);
    }
    const handleButtons = () => {
        setButtonModal(true);
    }
    const handleCloseButtonModal = () => {
        setButtonModal(false);
    }
    const handleSaveButtonModal = () => {
        setButtonModal(false);
    }
    const handleList = () => {
        setListModal(true)
    }
    const handleCloseListModal = () => {
        setListModal(false);
    }
    const handleSaveListModal = () => {
        setListModal(false)
    }
    const handleUpdateAttributes = () => {
        setUpdateAttributeModal(true)
    }
    const handleCloseUpdateModal = () => {
        setUpdateAttributeModal(false);
    }
    const handleSaveUpdate = () => {
        setUpdateAttributeModal(false)
    }
    const handleTags = () => {
        setTagsModal(true)
    }
    const handleCloseTagsModal = () => {
        setTagsModal(false);
    }
    const handleSaveTags = () => {
        setTagsModal(false)
    }
    const handleAssignToTeam = () => {
        setAssignToTeamModal(true);
    }
    const handleCloseAssignToTeam = () => {
        setAssignToTeamModal(false);
    }
    const handleSaveAssignToTeam = () => {
        setAssignToTeamModal(false);
    }
    const handleAssignToUser = () => {
        setAssignToUserModal(true);
    }
    const handleCloseAssignToUser = () => {
        setAssignToUserModal(false);
    }
    const handleSaveAssignToUser = () => {
        setAssignToUserModal(false);
    }
    const handleTriggerChatbot = () => {
        setTriggerChatbotModal(true);
    }
    const handleCloseTriggerChatbot = () => {
        setTriggerChatbotModal(false);
    }
    const handleSaveTriggerChatbot = () => {
        setTriggerChatbotModal(false);
    }
    const handleUpdateChat = () => {
        setUpdateChatModal(true);
    }
    const handleCloseUpdateChatModal = () => {
        setUpdateChatModal(false);
    }
    const handleSaveUpdateChat = () => {
        setUpdateChatModal(false);
    }
    const handleTimeDelay = () => {
        setTimeDelayModal(true);
    }
    const handleCloseTimeDelay = () => {
        setTimeDelayModal(false);
    }
    const handleSaveTimeDelay = () => {
        setTimeDelayModal(false);
    }
    const handleTemplates = () => {
        setTemplateModal(true);
    }
    const handleCloseTemplates = () => {
        setTemplateModal(false);
    }
    const handleSaveTemplates = () => {
        setTemplateModal(false);
    }
    const handleWhatsappFlow = () => {
        setWhatsappFlowModal(true);
    }
    const handleCloseWhatsappFlow = () => {
        setWhatsappFlowModal(false);
    }
    const handleSaveWhatsappFlow = () => {
        setWhatsappFlowModal(false);
    }
    const handleWebhook = () => {
        setWebhookModal(true);
    }
    const handleCloseWebhook = () => {
        setWebhookModal(false);
    }
    const handleSaveWebhook = () => {
        setWebhookModal(false);
    }
    const handleEditClick = () => {
        setEditChatbotModal(true);
    }
    const handleCloseEditchatbotModal = () => {
        setEditChatbotModal(false);
    }
    const handleSaveEditchatbot = (updatedName) => {
        setEditChatbotModal(false)
        setCurrentChatbotName(updatedName);
    }

    const handleDeleteNode = (nodeId) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    };

    const handleCopyNode = (nodeId) => {
        setNodes((prevNodes) => {
            // Locate the original node to copy
            const nodeToCopy = prevNodes.find((node) => node.id === nodeId);

            if (nodeToCopy) {
                // Generate a unique id
                const newNodeId = `copy-${Date.now()}`;

                // Create a copy of the node
                const newNode = {
                    id: newNodeId,
                    type: nodeToCopy.type,
                    position: {
                        x: nodeToCopy.position.x + 150,
                        y: nodeToCopy.position.y + 150,
                    },
                    sourcePosition: nodeToCopy.sourcePosition, targetPosition: nodeToCopy.targetPosition,
                    style: { ...nodeToCopy.style },
                    data: {
                        ...nodeToCopy.data,
                        label: React.cloneElement(nodeToCopy.data.label, {
                            onCopy: () => handleCopyNode(newNodeId),
                            onDelete: () => handleDeleteNode(newNodeId)
                        }),
                    },
                };



                return [...prevNodes, newNode];
            } else {
                console.error('Node not found:', nodeId);
                return prevNodes;
            }
        });
    };

    const NodeWithHandles = ({ title, color, onTitleClick, headerBackgroundColor, titleColor, content, onCopy, onDelete, height, width, showEditButton }) => (
        <div >
            <Card title={title} onTitleClick={onTitleClick} headerBackgroundColor={headerBackgroundColor} titleColor={titleColor} content={content} onCopy={onCopy} onDelete={onDelete} height={height} width={width} showEditButton={showEditButton} />

            <Handle
                type="target"
                position="left"
                style={{ backgroundColor: 'white', width: 3, height: 3, zIndex: 10, }}
            />

            <Handle
                type="source"
                position="right"
                style={{ backgroundColor: color, width: 10, height: 10, borderRadius: '50%', zIndex: 10, }}
            />
        </div>
    );

    const initialNodesData = {
        1: { id: '1', data: { label: <NodeWithHandles title="Send a message" onTitleClick={() => { }} headerBackgroundColor='#e95b69' titleColor='white' content={<MessageOption />} color='#e95b69' showEditButton={false} /> }, position: { x: 100, y: -100 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#3ccfa0', outline: 'none' } },
        2: { id: '2', data: { label: <NodeWithHandles title='Question' onTitleClick={handleQuestion} headerBackgroundColor="#ff9933" titleColor="white" content={<div className='condition_text'></div>} color='#ff9933' showEditButton={true} /> }, position: { x: 300, y: -50 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#6080e6' } },
        3: {
            id: '3', data: {
                label: <NodeWithHandles title='Buttons' onTitleClick={handleButtons} headerBackgroundColor='#ff9933' titleColor='white' content={<div >
                    <div className='condition_text'>Ask a question here</div>
                    <div className='buttons_card'><div className='button_node_answer'>Answer 1</div><div className='button_node_answer default_box'>Default</div></div></div>} color='white' showEditButton={true} />
            }, position: { x: 150, y: 0 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#ffcc00' }
        },
        4: {
            id: '4', data: {
                label: <NodeWithHandles title='List' onTitleClick={handleList} headerBackgroundColor='#ff9933' titleColor='white' content={<div >
                    <div className='condition_text'>default body</div>
                    <div className='buttons_card'>
                        <div className='button_node_answer menu_box'>Menu Here</div>
                        <div className='button_node_answer'>default row</div>
                        <div className='button_node_answer default_box'>Default</div>
                    </div>
                </div>} color='white' showEditButton={true} />
            }, position: { x: 250, y: 200 }, sourcePosition: Position.Right, targetPosition: Position.Left, style: { padding: 0, width: '300px', border: 'none', fill: '#ffcc00' }
        },
        5: { id: '5', data: { label: <NodeWithHandles title='Set a condition' onTitleClick={handleConditionComponent} headerBackgroundColor="#6c7ed6" titleColor="white" content={<div className='condition_text'>This is condition content</div>} color='#e95b69' showEditButton={true} /> }, position: { x: 300, y: 250 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '300px', border: 'none', fill: '#45cf72' } },
        6: { id: '6', data: { label: <NodeWithHandles title='Subscribe' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='#ff9933' showEditButton={false} /> }, position: { x: 300, y: 300 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #f2aa4c', fill: '#ffcf06' } },
        7: { id: '7', data: { label: <NodeWithHandles title='Unsubscribe' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='#ff9933' showEditButton={false} /> }, position: { x: 300, y: 350 }, style: { padding: 0, width: '220px', border: '2px solid #f2aa4c', fill: '#ffcf06' } },
        8: { id: '8', data: { label: <NodeWithHandles title='Update Attribute' onTitleClick={handleUpdateAttributes} titleColor="black" height='55px' width='215px' color='rgb(227, 119, 76)' showEditButton={true} /> }, position: { x: 300, y: 400 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #e3774c', fill: '#f48f62' } },
        9: { id: '9', data: { label: <NodeWithHandles title='Set tags' onTitleClick={handleTags} titleColor="black" height='55px' width='215px' color='#e60044' showEditButton={true} /> }, position: { x: 300, y: 450 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ecda40', fill: '#e60044' } },
        10: { id: '10', data: { label: <NodeWithHandles title='Assign to Team' onTitleClick={handleAssignToTeam} titleColor="black" height='55px' width='215px' color='#545ee2' showEditButton={true} /> }, position: { x: 300, y: 500 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #545ee2', fill: '#f4929a' } },
        11: { id: '11', data: { label: <NodeWithHandles title='Assign to User' onTitleClick={handleAssignToUser} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 550 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #75c595', fill: '#68a8cf' } },
        12: { id: '12', data: { label: <NodeWithHandles title='Trigger Chatbot' onTitleClick={handleTriggerChatbot} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 600 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #4aa1ea', fill: '#fa1f11' } },
        13: { id: '13', data: { label: <NodeWithHandles title='Update Chat Status' onTitleClick={handleUpdateChat} titleColor="black" height='55px' width='215px' color='white' showEditButton={true} /> }, position: { x: 300, y: 650 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ec8f99', fill: '#fa9f98' } },
        14: { id: '14', data: { label: <NodeWithHandles title='Template' onTitleClick={handleTemplates} titleColor="black" height='55px' width='215px' color='#e0affd' showEditButton={true} /> }, position: { x: 300, y: 700 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #e0affd', fill: '#ffcc00' } },
        15: { id: '15', data: { label: <NodeWithHandles title='Time Delay' onTitleClick={handleTimeDelay} titleColor="black" height='55px' width='215px' color='#a4e1e1' showEditButton={true} /> }, position: { x: 300, y: 750 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #a4e1e1', fill: '#31e30e' } },
        16: { id: '16', data: { label: <NodeWithHandles title='Whatsapp Flows' onTitleClick={handleWhatsappFlow} titleColor="black" height='55px' width='215px' color='#37c96e' showEditButton={true} /> }, position: { x: 300, y: 800 }, style: { padding: 0, width: '220px', border: '2px solid #37c96e', fill: '#ffcc00' } },
        17: { id: '17', data: { label: <NodeWithHandles title='Webhook' onTitleClick={handleWebhook} titleColor="black" height='55px' width='215px' color='ff9100' showEditButton={true} /> }, position: { x: 300, y: 850 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #ff9100', fill: '#e02e80' } },
        18: { id: '18', data: { label: <NodeWithHandles title='Google Spreadsheet' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 900 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #51b177', fill: '#ffcc00' } },
        19: { id: '19', data: { label: <NodeWithHandles title='Sets' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 950 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #87ceff', fill: '#ffcc00' } },
        20: { id: '20', data: { label: <NodeWithHandles title='Product' onTitleClick={() => { }} titleColor="black" height='55px' width='215px' color='rgb(35, 164, 85)' showEditButton={true} /> }, position: { x: 300, y: 1000 }, sourcePosition: 'right', targetPosition: 'left', style: { padding: 0, width: '220px', border: '2px solid #c69af2', fill: '#ffcc00' } },
    };



    return (
        <>


            {
                EditChatbotModal &&
                <CopyandAddModal
                    show={EditChatbotModal}
                    onClose={handleCloseEditchatbotModal}
                    onSave={handleSaveEditchatbot}
                    placeholder="Chatbot Name"
                    buttonLabel="Save"
                    modalTitle="Edit Chatbot"
                    initialValue={currentChatbotName}
                />
            }
            {
                showModal &&
                <ConditionModal show={showModal} onClose={handleCloseCondtion} onSave={handleSaveCondition} />
            }
            {
                questionModal &&
                <QuestionModal show={questionModal} onClose={handleCloseQuestion} onSave={handleSaveQuestion} />
            }
            {
                buttonModal &&
                <ButtonsModal show={buttonModal} onClose={handleCloseButtonModal} onSave={handleSaveButtonModal} />
            }
            {
                listModal &&
                <ListModal show={listModal} onClose={handleCloseListModal} onSave={handleSaveListModal} />
            }
            {
                updateAttributeModal &&
                <UpdateAttributesModal show={updateAttributeModal} onClose={handleCloseUpdateModal} onSave={handleSaveUpdate} />
            }
            {
                tagsModal &&
                <SetTagsModal show={tagsModal} onClose={handleCloseTagsModal} onSave={handleSaveTags} />
            }
            {
                assignToTeamModal &&
                <AssignToTeamModal show={assignToTeamModal} onClose={handleCloseAssignToTeam} onSave={handleSaveAssignToTeam} />
            }
            {
                assignToUserModal &&
                <AssignToUserModal show={assignToUserModal} onClose={handleCloseAssignToUser} onSave={handleSaveAssignToUser} />
            }
            {
                triggerChatbotModal &&
                <TriggerChatbotModal show={triggerChatbotModal} onClose={handleCloseTriggerChatbot} onSave={handleSaveTriggerChatbot} />
            }
            {
                updateChatModal &&
                <UpdateChatModal show={updateChatModal} onClose={handleCloseUpdateChatModal} onSave={handleSaveUpdateChat} />
            }
            {
                timedelayModal &&
                <SetTimeDelayModal show={timedelayModal} onClose={handleCloseTimeDelay} onSave={handleSaveTimeDelay} />
            }
            {
                templateModal &&
                <TemplatesModal show={templateModal} onClose={handleCloseTemplates} onSave={handleSaveTemplates} />
            }
            {
                whatsappFlowModal &&
                <WhatsappFlowModal show={whatsappFlowModal} onClose={handleCloseWhatsappFlow} onSave={handleSaveWhatsappFlow} />
            }
            {
                webhookModal &&
                <WebhookModal show={webhookModal} onClose={handleCloseWebhook} onSave={handleSaveWebhook} />
            }
            {/* <div className={`editchatbot_container ${!currentChatbotName ? "maincontent": ""}`}> */}
            <div className="editchatbot_container maincontent">
                
                
                
                <div>hy</div>


                {/* <div className='editchatbot_left_container' style={{ marginLeft: isLeftContainerVisible ? '0' : '-260px' }}
                >
                    <div className='editchatbot_left_content'>
                        {
                            showAskQuestioncontent ?
                                (
                                    <>
                                        <div className='ask_question_container'>
                                            <button className='askquestion_backbtn' onClick={handleAskQuestionBackBtn}>
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                            </button>
                                            <div className='operation_text'>Ask a question</div>

                                        </div>
                                        <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path fill="white" d="M18.85 24.7C20.4015 24.7 21.8895 24.0837 22.9866 22.9866C24.0837 21.8895 24.7 20.4015 24.7 18.85C24.7 17.2985 24.0837 15.8105 22.9866 14.7134C21.8895 13.6163 20.4015 13 18.85 13C17.2985 13 15.8105 13.6163 14.7134 14.7134C13.6163 15.8105 13 17.2985 13 18.85C13 20.4015 13.6163 21.8895 14.7134 22.9866C15.8105 24.0837 17.2985 24.7 18.85 24.7ZM19.6612 22.1065C19.6656 22.2158 19.6478 22.325 19.609 22.4273C19.5702 22.5296 19.5111 22.623 19.4352 22.7019C19.3594 22.7808 19.2685 22.8436 19.1678 22.8865C19.0671 22.9294 18.9588 22.9515 18.8493 22.9515C18.7399 22.9515 18.6316 22.9294 18.5309 22.8865C18.4302 22.8436 18.3393 22.7808 18.2635 22.7019C18.1876 22.623 18.1285 22.5296 18.0897 22.4273C18.0509 22.325 18.0331 22.2158 18.0375 22.1065C18.0375 21.891 18.1231 21.6843 18.2755 21.532C18.4278 21.3796 18.6345 21.294 18.85 21.294C19.0655 21.294 19.2722 21.3796 19.4245 21.532C19.5769 21.6843 19.6625 21.891 19.6625 22.1065H19.6612ZM21.2602 17.4889C21.2602 18.2507 20.9807 18.6693 20.3138 19.2036L19.9537 19.4818C19.6339 19.734 19.526 19.8718 19.5039 20.0642L19.4896 20.267C19.4607 20.4268 19.3729 20.57 19.2437 20.6684C19.1144 20.7668 18.953 20.8132 18.7913 20.7985C18.6295 20.7839 18.4791 20.7092 18.3697 20.5891C18.2602 20.4691 18.1997 20.3124 18.2 20.15C18.2 19.409 18.473 19.0008 19.1308 18.4756L19.4922 18.1961C19.8666 17.8971 19.9602 17.7515 19.9602 17.4889C19.9602 16.7635 19.4636 16.2539 18.85 16.2539C18.2078 16.2539 17.7333 16.7297 17.7398 17.4824C17.7407 17.5678 17.7247 17.6525 17.6928 17.7316C17.6609 17.8108 17.6138 17.883 17.554 17.9439C17.4943 18.0049 17.4231 18.0535 17.3445 18.0869C17.266 18.1204 17.1817 18.138 17.0963 18.1389C17.0109 18.1398 16.9262 18.1238 16.8471 18.0919C16.7679 18.06 16.6957 18.0129 16.6348 17.9531C16.5738 17.8934 16.5252 17.8222 16.4918 17.7436C16.4583 17.6651 16.4407 17.5808 16.4398 17.4954C16.4268 16.0173 17.4876 14.9539 18.85 14.9539C20.1903 14.9539 21.2589 16.0537 21.2589 17.4889H21.2602Z"></path>
                                            <path fill="white" d="M11.7 2.59961C10.3209 2.59961 8.99823 3.14746 8.02304 4.12265C7.04786 5.09784 6.5 6.42048 6.5 7.79961C6.5 9.17873 7.04786 10.5014 8.02304 11.4766C8.99823 12.4518 10.3209 12.9996 11.7 12.9996C13.0791 12.9996 14.4018 12.4518 15.377 11.4766C16.3521 10.5014 16.9 9.17873 16.9 7.79961C16.9 6.42048 16.3521 5.09784 15.377 4.12265C14.4018 3.14746 13.0791 2.59961 11.7 2.59961Z"></path>
                                            <path fill="white" d="M5.21131 14.2988C4.86894 14.2975 4.52966 14.3637 4.21294 14.4937C3.89622 14.6238 3.60828 14.8151 3.36565 15.0566C3.12301 15.2982 2.93044 15.5852 2.79899 15.9014C2.66753 16.2175 2.59978 16.5565 2.59961 16.8988C2.59961 19.0971 3.68251 20.7547 5.37511 21.835C7.04171 22.8971 9.28811 23.3988 11.6996 23.3988C12.2326 23.3988 12.7604 23.3742 13.2726 23.3248C12.252 22.0565 11.6968 20.4768 11.6996 18.8488C11.6996 17.1198 12.3132 15.5338 13.3337 14.2988H5.21261H5.21131Z"></path>
                                        </svg>}
                                            title='Question'
                                            subtitle='Ask anything to the user'
                                            backgroundColor='#ff9933'
                                            background='#ffb062'

                                            onClick={() => handleComponentClick(2)}
                                        />
                                        <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path fill="white" d="M13.0003 2.16602C7.02033 2.16602 2.16699 7.01935 2.16699 12.9993C2.16699 18.9793 7.02033 23.8327 13.0003 23.8327C18.9803 23.8327 23.8337 18.9793 23.8337 12.9993C23.8337 7.01935 18.9803 2.16602 13.0003 2.16602ZM13.0003 21.666C8.21199 21.666 4.33366 17.7877 4.33366 12.9993C4.33366 8.21102 8.21199 4.33268 13.0003 4.33268C17.7887 4.33268 21.667 8.21102 21.667 12.9993C21.667 17.7877 17.7887 21.666 13.0003 21.666Z"></path>
                                            <path fill="white" d="M12.9997 18.4173C15.9912 18.4173 18.4163 15.9922 18.4163 13.0007C18.4163 10.0091 15.9912 7.58398 12.9997 7.58398C10.0081 7.58398 7.58301 10.0091 7.58301 13.0007C7.58301 15.9922 10.0081 18.4173 12.9997 18.4173Z"></path>
                                        </svg>}
                                            title='Buttons'
                                            subtitle='Choices based on buttons (Maximum of 3 choices)'
                                            backgroundColor='#ff9933'
                                            background='#ffb062'

                                            onClick={() => handleComponentClick(3)}
                                        />
                                        <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 5.95833L5.41699 7.58333L8.12533 4.875"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 12.4583L5.41699 14.0833L8.12533 11.375"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M3.79199 18.9583L5.41699 20.5833L8.12533 17.875"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 6.5H21.667"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 13H21.667"></path>
                                            <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.16667" stroke="white" d="M11.917 19.5H21.667"></path>
                                        </svg>}
                                            title='List'
                                            subtitle='Choices based on buttons (Maximum of 10 choices)'
                                            backgroundColor='#ff9933'
                                            background='#ffb062'

                                            onClick={() => handleComponentClick(4)}
                                        />
                                    </>
                                )
                                :
                                (
                                    <>
                                        <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path fill="white" d="M10.0939 3.60187C6.871 4.3305 4.34214 6.80736 3.56626 9.99529C3.142 11.7385 3.14588 13.5727 3.57014 15.3159C4.35814 18.5537 6.67613 21.2483 9.78568 22.5039L9.92122 22.5586C11.2668 23.1019 12.8083 22.4476 13.3605 21.1143C13.5124 20.7474 13.8743 20.504 14.2741 20.504H15.4915C18.8028 20.504 21.6833 18.2541 22.4605 15.0606C22.8465 13.4747 22.8465 11.8205 22.4605 10.2347L22.3586 9.81595C21.6095 6.73788 19.1678 4.34638 16.0559 3.64286L15.6188 3.54403C13.8847 3.15199 12.0839 3.15199 10.3498 3.54403L10.0939 3.60187ZM9.21044 9.06391C8.79359 9.06391 8.45568 9.39918 8.45568 9.81275C8.45568 10.2263 8.79359 10.5616 9.21044 10.5616H16.1291C16.546 10.5616 16.8839 10.2263 16.8839 9.81275C16.8839 9.39918 16.546 9.06391 16.1291 9.06391H9.21044ZM10.4684 12.8081C10.0515 12.8081 9.71362 13.1434 9.71362 13.5569C9.71362 13.9705 10.0515 14.3058 10.4684 14.3058H14.8712C15.288 14.3058 15.6259 13.9705 15.6259 13.5569C15.6259 13.1434 15.288 12.8081 14.8712 12.8081H10.4684Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                        </svg>}
                                            title='Send a message'
                                            subtitle='With no response required from visitor'
                                            backgroundColor='#e95b69'
                                            background='#ee7d88'

                                            onClick={() => handleComponentClick(1)}
                                        />
                                        <EditNavContent onClick={handleAskQuestionContent} svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path fill="white" d="M3.62234 9.78223C3.12589 11.8987 3.12589 14.1013 3.62234 16.2178C4.33929 19.2742 6.72578 21.6607 9.78222 22.3777C11.8987 22.8741 14.1013 22.8741 16.2178 22.3777C19.2742 21.6607 21.6607 19.2742 22.3777 16.2178C22.8741 14.1013 22.8741 11.8987 22.3777 9.78223C21.6607 6.72578 19.2742 4.33928 16.2178 3.62234C14.1013 3.12589 11.8987 3.12589 9.78223 3.62234C6.72578 4.33928 4.33928 6.72578 3.62234 9.78223ZM13.8296 16.4742C13.8296 16.9038 13.4814 17.252 13.0518 17.252C12.6222 17.252 12.274 16.9038 12.274 16.4742C12.274 16.0447 12.6222 15.6964 13.0518 15.6964C13.4814 15.6964 13.8296 16.0447 13.8296 16.4742ZM11.5481 10.8222C11.5481 10.0204 12.1981 9.37035 13 9.37035C13.8018 9.37035 14.4519 10.0204 14.4519 10.8222V10.9481C14.4519 11.3665 14.2856 11.7678 13.9898 12.0637L12.56 13.4934C12.317 13.7364 12.317 14.1304 12.56 14.3734C12.803 14.6164 13.197 14.6164 13.44 14.3734L14.8697 12.9436C15.399 12.4144 15.6963 11.6965 15.6963 10.9481V10.8222C15.6963 9.33308 14.4891 8.12588 13 8.12588C11.5108 8.12588 10.3036 9.33308 10.3036 10.8222V11.3408C10.3036 11.6844 10.5822 11.963 10.9259 11.963C11.2695 11.963 11.5481 11.6844 11.5481 11.3408V10.8222Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                        </svg>}
                                            title='Ask a question'
                                            subtitle='Ask question and store user input in variable'
                                            backgroundColor='#ff9933'
                                            background='#ffb062' />
                                        <EditNavContent svg={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" height="26" width="26">
                                            <path fill="white" d="M23.6947 2.6237C23.6947 2.6237 16.2622 6.41609 12.4867 8.1894C13.2955 8.92798 14.0478 9.7246 14.8282 10.4924C10.9897 14.3821 12.9911 12.4319 9.15262 16.3215C9.4341 16.5902 9.71536 16.8587 9.99686 17.1273C13.8353 13.2376 11.834 15.1882 15.6724 11.2986C16.4543 12.0777 17.2318 12.8612 18.0139 13.6401C20.0305 9.66858 23.6947 2.6237 23.6947 2.6237V2.6237Z"></path>
                                            <path stroke-linecap="square" stroke-width="0.994363" stroke="white" fill="white" d="M9.10888 21.6214L3.80789 22.4837L4.67003 17.1824L9.97105 16.3205L9.10888 21.6214Z"></path>
                                        </svg>}
                                            title='Set a condition'
                                            subtitle='Send message(s) based on logical condition(s)'
                                            backgroundColor='#6c7ed6'
                                            background='#8796e0'

                                            onClick={() => handleComponentClick(5)} />
                                        <div className='operation_text'>Operations</div>
                                        <div className='operation_grid'>
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear)" d="M23.3244 15.6756L21.125 13.4761V10.5625C21.1225 8.54899 20.3735 6.60794 19.0228 5.11467C17.6721 3.62141 15.8157 2.68201 13.8125 2.47812V0.8125H12.1875V2.47812C10.1843 2.68201 8.32793 3.62141 6.97724 5.11467C5.62654 6.60794 4.87752 8.54899 4.875 10.5625V13.4761L2.67556 15.6756C2.52318 15.8279 2.43755 16.0345 2.4375 16.25V18.6875C2.4375 18.903 2.5231 19.1097 2.67548 19.262C2.82785 19.4144 3.03451 19.5 3.25 19.5H8.9375V20.3125C8.9375 21.3899 9.36551 22.4233 10.1274 23.1851C10.8892 23.947 11.9226 24.375 13 24.375C14.0774 24.375 15.1108 23.947 15.8726 23.1851C16.6345 22.4233 17.0625 21.3899 17.0625 20.3125V19.5H22.75C22.9655 19.5 23.1722 19.4144 23.3245 19.262C23.4769 19.1097 23.5625 18.903 23.5625 18.6875V16.25C23.5625 16.0345 23.4768 15.8279 23.3244 15.6756ZM15.4375 20.3125C15.4375 20.959 15.1807 21.579 14.7236 22.0361C14.2665 22.4932 13.6465 22.75 13 22.75C12.3535 22.75 11.7335 22.4932 11.2764 22.0361C10.8193 21.579 10.5625 20.959 10.5625 20.3125V19.5H15.4375V20.3125Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="24.375" x2="23.5625" y1="0.812499" x1="3.25" id="paint0_linear">
                                                        <stop stop-color="#FFC691"></stop>
                                                        <stop stop-color="#E79110" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Subscribe'

                                                onClick={() => handleComponentClick(6)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear1)" d="M21.125 13.4761V10.5625C21.1241 9.29129 20.8214 8.03846 20.2418 6.90706L24.375 2.77387L23.2261 1.625L1.625 23.2261L2.77387 24.375L7.64887 19.5H8.9375V20.3125C8.9375 21.3899 9.36551 22.4233 10.1274 23.1851C10.8892 23.947 11.9226 24.375 13 24.375C14.0774 24.375 15.1108 23.947 15.8726 23.1851C16.6345 22.4233 17.0625 21.3899 17.0625 20.3125V19.5H22.75C22.9655 19.5 23.1722 19.4144 23.3245 19.262C23.4769 19.1097 23.5625 18.903 23.5625 18.6875V16.25C23.5625 16.0345 23.4768 15.8279 23.3244 15.6756L21.125 13.4761ZM15.4375 20.3125C15.4375 20.959 15.1807 21.579 14.7236 22.0361C14.2665 22.4932 13.6465 22.75 13 22.75C12.3535 22.75 11.7335 22.4932 11.2764 22.0361C10.8193 21.579 10.5625 20.959 10.5625 20.3125V19.5H15.4375V20.3125Z"></path>
                                                <path fill="url(#paint1_linear1)" d="M17.5581 3.84962C16.444 3.08633 15.1561 2.61502 13.8125 2.47894V0.8125H12.1875V2.47812C10.1843 2.68201 8.32793 3.62141 6.97724 5.11467C5.62654 6.60794 4.87752 8.54899 4.875 10.5625V13.4761L2.67556 15.6756C2.52318 15.8279 2.43755 16.0345 2.4375 16.25V18.6875C2.44138 18.768 2.45755 18.8475 2.48544 18.9231L17.5581 3.84962Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="26.4516" x2="21.6882" y1="1.625" x1="2.5" id="paint0_linear1">
                                                        <stop stop-color="#FFC691"></stop>
                                                        <stop stop-color="#E79110" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="17.8133" x2="18.7571" y1="0.8125" x1="3.01906" id="paint1_linear1">
                                                        <stop stop-color="#FFC691"></stop>
                                                        <stop stop-color="#E79110" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Unsubscribe'

                                                onClick={() => handleComponentClick(7)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear2)" d="M20.5389 3.05469H14.8386C13.1979 3.05469 11.6203 3.76866 10.5265 5.02351L3.98483 12.5094C2.61759 14.0671 2.6807 16.447 4.13207 17.9182L8.5493 22.4616C9.97964 23.9328 12.2934 23.9978 13.8079 22.6131L21.0858 15.8845C22.3058 14.7594 22.9999 13.1368 22.9999 11.4492V5.56439C22.9789 4.17973 21.8851 3.05469 20.5389 3.05469ZM17.2996 11.2761C16.0165 11.2761 14.9858 10.216 14.9858 8.89625C14.9858 7.57649 16.0165 6.51635 17.2996 6.51635C18.5827 6.51635 19.6134 7.57649 19.6134 8.89625C19.6134 10.216 18.5827 11.2761 17.2996 11.2761Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="23.6099" x2="13" y1="3.05469" x1="13" id="paint0_linear2">
                                                        <stop stop-color="#FA9066"></stop>
                                                        <stop stop-color="#B9491E" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Update Attribute'

                                                onClick={() => handleComponentClick(8)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear8)" d="M17.875 23.5625C17.875 23.778 17.7894 23.9847 17.6371 24.1371C17.4847 24.2894 17.278 24.375 17.0625 24.375H8.93753C8.72204 24.375 8.51538 24.2894 8.36301 24.1371C8.21064 23.9847 8.12503 23.778 8.12503 23.5625C8.12503 23.3471 8.21064 23.1404 8.36301 22.988C8.51538 22.8356 8.72204 22.75 8.93753 22.75H17.0625C17.278 22.75 17.4847 22.8356 17.6371 22.988C17.7894 23.1404 17.875 23.3471 17.875 23.5625ZM21.9375 10.5625C21.941 11.917 21.6351 13.2544 21.0429 14.4725C20.4508 15.6907 19.5881 16.7575 18.5209 17.5915C18.3216 17.7442 18.1598 17.9404 18.0479 18.1651C17.9359 18.3898 17.8768 18.6372 17.875 18.8882V19.5C17.8745 19.9309 17.7032 20.3439 17.3985 20.6486C17.0939 20.9532 16.6809 21.1246 16.25 21.125H9.75003C9.3192 21.1246 8.90616 20.9532 8.60152 20.6486C8.29688 20.3439 8.12552 19.9309 8.12503 19.5V18.8875C8.12474 18.6391 8.06757 18.3941 7.95791 18.1712C7.84825 17.9483 7.68901 17.7535 7.4924 17.6017C6.42823 16.7731 5.56645 15.7133 4.97225 14.5025C4.37806 13.2916 4.06701 11.9616 4.06263 10.6128C4.03603 5.77215 7.94882 1.74133 12.785 1.62758C13.9765 1.59893 15.1616 1.80885 16.2707 2.24499C17.3798 2.68113 18.3905 3.33469 19.2433 4.16721C20.0961 4.99974 20.7738 5.99441 21.2365 7.09271C21.6992 8.19101 21.9375 9.37076 21.9375 10.5625ZM18.6075 9.60826C18.4102 8.44788 17.8568 7.37762 17.024 6.54584C16.1912 5.71406 15.1202 5.16195 13.9596 4.96605C13.8538 4.94692 13.7452 4.94899 13.6402 4.97214C13.5352 4.99528 13.4359 5.03904 13.3479 5.10086C13.2599 5.16269 13.1851 5.24137 13.1278 5.33233C13.0704 5.42329 13.0317 5.52473 13.0139 5.63076C12.996 5.73679 12.9994 5.84531 13.0238 5.95003C13.0482 6.05475 13.0932 6.15358 13.1561 6.24079C13.2189 6.32801 13.2985 6.40188 13.3902 6.45811C13.4818 6.51435 13.5837 6.55183 13.6899 6.5684C14.5178 6.70816 15.2817 7.10199 15.8758 7.69531C16.4698 8.28862 16.8646 9.05204 17.0054 9.87974C17.0374 10.0688 17.1353 10.2405 17.2818 10.3643C17.4282 10.4882 17.6137 10.5563 17.8055 10.5566C17.8513 10.5565 17.8971 10.5527 17.9423 10.5451C18.1547 10.5091 18.3441 10.3901 18.4689 10.2144C18.5936 10.0387 18.6435 9.82071 18.6075 9.60826Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="24" x2="21.9998" y1="2" x1="3.99982" id="paint0_linear8">
                                                        <stop stop-color="#F8EA6E"></stop>
                                                        <stop stop-color="#E6D32A" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Set tags'

                                                onClick={() => handleComponentClick(9)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear3)" d="M5.75 8.54351C5.75 6.21865 7.65279 4.33398 10 4.33398C12.3472 4.33398 14.25 6.21865 14.25 8.54351C14.25 10.8684 12.3472 12.753 10 12.753C7.65279 12.753 5.75 10.8684 5.75 8.54351Z"></path>
                                                <path fill="url(#paint1_linear3)" d="M7.31383 14.654L7.49193 14.6258C9.15346 14.3632 10.8465 14.3632 12.5081 14.6258L12.6862 14.654C15.0273 15.024 16.75 17.0242 16.75 19.3724C16.75 20.6399 15.7127 21.6673 14.433 21.6673H5.56697C4.28734 21.6673 3.25 20.6399 3.25 19.3724C3.25 17.0242 4.97267 15.024 7.31383 14.654Z"></path>
                                                <path fill="url(#paint2_linear3)" d="M16 4.33398C15.5858 4.33398 15.25 4.66657 15.25 5.07684C15.25 5.48711 15.5858 5.8197 16 5.8197C17.5188 5.8197 18.75 7.03919 18.75 8.54351C18.75 10.0478 17.5188 11.2673 16 11.2673C15.5858 11.2673 15.25 11.5999 15.25 12.0102C15.25 12.4204 15.5858 12.753 16 12.753C18.3472 12.753 20.25 10.8684 20.25 8.54351C20.25 6.21865 18.3472 4.33398 16 4.33398Z"></path>
                                                <path fill="url(#paint3_linear3)" d="M17.2412 14.6165C16.827 14.6165 16.4912 14.9491 16.4912 15.3594C16.4912 15.7696 16.827 16.1022 17.2412 16.1022H18.2093C18.2898 16.1022 18.3704 16.1086 18.4498 16.1211C20.063 16.3761 21.25 17.7544 21.25 19.3724C21.25 19.8193 20.8842 20.1816 20.433 20.1816H18.3899C17.9757 20.1816 17.6399 20.5142 17.6399 20.9245C17.6399 21.3347 17.9757 21.6673 18.3899 21.6673H20.433C21.7127 21.6673 22.75 20.6399 22.75 19.3724C22.75 17.0242 21.0273 15.024 18.6862 14.654C18.5285 14.629 18.3689 14.6165 18.2093 14.6165H17.2412Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint0_linear3">
                                                        <stop stop-color="#8C94FF"></stop>
                                                        <stop stop-color="#4B55DD" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint1_linear3">
                                                        <stop stop-color="#8C94FF"></stop>
                                                        <stop stop-color="#4B55DD" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint2_linear3">
                                                        <stop stop-color="#8C94FF"></stop>
                                                        <stop stop-color="#4B55DD" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="21.6673" x2="13" y1="4.33398" x1="13" id="paint3_linear3">
                                                        <stop stop-color="#8C94FF"></stop>
                                                        <stop stop-color="#4B55DD" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Assign Team'

                                                onClick={() => handleComponentClick(10)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear4)" d="M10.7714 3.25C8.15597 3.25 6.03571 5.37025 6.03571 7.98571C6.03571 10.6012 8.15597 12.7214 10.7714 12.7214C13.3869 12.7214 15.5071 10.6012 15.5071 7.98571C15.5071 5.37025 13.3869 3.25 10.7714 3.25Z"></path>
                                                <path fill="url(#paint1_linear4)" d="M13.5661 14.8283C11.7147 14.5328 9.82815 14.5328 7.97672 14.8283L7.77827 14.86C5.16955 15.2763 3.25 17.5265 3.25 20.1682C3.25 21.5941 4.4059 22.75 5.83176 22.75H15.7111C17.137 22.75 18.2929 21.5941 18.2929 20.1682C18.2929 17.5265 16.3733 15.2763 13.7646 14.86L13.5661 14.8283Z"></path>
                                                <path fill="url(#paint2_linear4)" d="M19.6857 9.93571C20.1473 9.93571 20.5214 10.3099 20.5214 10.7714V12.1643H21.9143C22.3758 12.1643 22.75 12.5384 22.75 13C22.75 13.4616 22.3758 13.8357 21.9143 13.8357H20.5214V15.2286C20.5214 15.6901 20.1473 16.0643 19.6857 16.0643C19.2242 16.0643 18.85 15.6901 18.85 15.2286V13.8357H17.4571C16.9956 13.8357 16.6214 13.4616 16.6214 13C16.6214 12.5384 16.9956 12.1643 17.4571 12.1643H18.85V10.7714C18.85 10.3099 19.2242 9.93571 19.6857 9.93571Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear4">
                                                        <stop stop-color="#74EBA2"></stop>
                                                        <stop stop-color="#31CF6E" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint1_linear4">
                                                        <stop stop-color="#74EBA2"></stop>
                                                        <stop stop-color="#31CF6E" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint2_linear4">
                                                        <stop stop-color="#74EBA2"></stop>
                                                        <stop stop-color="#31CF6E" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Assign User'

                                                onClick={() => handleComponentClick(11)}

                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear7)" d="M9.75 5.6875C9.75 5.04103 10.0068 4.42105 10.4639 3.96393C10.921 3.50681 11.541 3.25 12.1875 3.25H13.8125C14.459 3.25 15.079 3.50681 15.5361 3.96393C15.9932 4.42105 16.25 5.04103 16.25 5.6875V7.3125C16.25 7.95897 15.9932 8.57895 15.5361 9.03607C15.079 9.49319 14.459 9.75 13.8125 9.75V11.375H17.875C18.0905 11.375 18.2972 11.4606 18.4495 11.613C18.6019 11.7653 18.6875 11.972 18.6875 12.1875V13.8125C18.6875 14.028 18.6019 14.2347 18.4495 14.387C18.2972 14.5394 18.0905 14.625 17.875 14.625C17.6595 14.625 17.4528 14.5394 17.3005 14.387C17.1481 14.2347 17.0625 14.028 17.0625 13.8125V13H8.9375V13.8125C8.9375 14.028 8.8519 14.2347 8.69952 14.387C8.54715 14.5394 8.34049 14.625 8.125 14.625C7.90951 14.625 7.70285 14.5394 7.55048 14.387C7.3981 14.2347 7.3125 14.028 7.3125 13.8125V12.1875C7.3125 11.972 7.3981 11.7653 7.55048 11.613C7.70285 11.4606 7.90951 11.375 8.125 11.375H12.1875V9.75C11.541 9.75 10.921 9.49319 10.4639 9.03607C10.0068 8.57895 9.75 7.95897 9.75 7.3125V5.6875ZM4.875 18.6875C4.875 18.041 5.13181 17.421 5.58893 16.9639C6.04605 16.5068 6.66603 16.25 7.3125 16.25H8.9375C9.58397 16.25 10.204 16.5068 10.6611 16.9639C11.1182 17.421 11.375 18.041 11.375 18.6875V20.3125C11.375 20.959 11.1182 21.579 10.6611 22.0361C10.204 22.4932 9.58397 22.75 8.9375 22.75H7.3125C6.66603 22.75 6.04605 22.4932 5.58893 22.0361C5.13181 21.579 4.875 20.959 4.875 20.3125V18.6875ZM14.625 18.6875C14.625 18.041 14.8818 17.421 15.3389 16.9639C15.796 16.5068 16.416 16.25 17.0625 16.25H18.6875C19.334 16.25 19.954 16.5068 20.4111 16.9639C20.8682 17.421 21.125 18.041 21.125 18.6875V20.3125C21.125 20.959 20.8682 21.579 20.4111 22.0361C19.954 22.4932 19.334 22.75 18.6875 22.75H17.0625C16.416 22.75 15.796 22.4932 15.3389 22.0361C14.8818 21.579 14.625 20.959 14.625 20.3125V18.6875Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear7">
                                                        <stop stop-color="#73BFFF"></stop>
                                                        <stop stop-color="#1685E1" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Trigger Chatbot'

                                                onClick={() => handleComponentClick(12)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear6)" d="M5.07017 9.21146C5.72287 6.42889 7.89553 4.25623 10.6781 3.60353C12.6876 3.13216 14.779 3.13216 16.7885 3.60353C19.5711 4.25623 21.7438 6.42889 22.3965 9.21147C22.8678 11.221 22.8678 13.3124 22.3965 15.3219C21.7438 18.1045 19.5711 20.2771 16.7885 20.9298C14.779 21.4012 12.6876 21.4012 10.6781 20.9298C9.99798 20.7703 9.35429 20.52 8.76033 20.1921C8.65744 21.622 7.46484 22.75 6.00877 22.75C4.48514 22.75 3.25 21.5149 3.25 19.9912C3.25 18.5352 4.37805 17.3426 5.8079 17.2397C5.48004 16.6457 5.2297 16.002 5.07017 15.3219C4.59879 13.3124 4.59879 11.221 5.07017 9.21146ZM9.20894 10.6115C9.20894 10.2458 9.50537 9.94935 9.87104 9.94935H13.1816C13.5472 9.94935 13.8437 10.2458 13.8437 10.6115C13.8437 10.9771 13.5472 11.2736 13.1816 11.2736H9.87104C9.50537 11.2736 9.20894 10.9771 9.20894 10.6115ZM10.9746 13.2599C10.6089 13.2599 10.3124 13.5563 10.3124 13.922C10.3124 14.2876 10.6089 14.5841 10.9746 14.5841H16.4921C16.8578 14.5841 17.1542 14.2876 17.1542 13.922C17.1542 13.5563 16.8578 13.2599 16.4921 13.2599H10.9746Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear6">
                                                        <stop stop-color="#FD919C"></stop>
                                                        <stop stop-color="#D81F31" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Update Chat Status'

                                                onClick={() => handleComponentClick(13)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear5)" d="M9.78223 3.6226C11.8987 3.1258 14.1013 3.1258 16.2178 3.6226C19.1001 4.29918 21.3866 6.46155 22.2391 9.2708H3.76095C4.61338 6.46155 6.89991 4.29918 9.78223 3.6226Z"></path>
                                                <path fill="url(#paint1_linear5)" d="M3.47157 10.5161C3.13237 12.4075 3.18263 14.351 3.62234 16.2269C4.33929 19.2855 6.72579 21.6737 9.78223 22.3912C10.6371 22.5918 11.5061 22.7114 12.3778 22.75V10.5161H3.47157Z"></path>
                                                <path fill="url(#paint2_linear5)" d="M13.6222 22.75C14.4939 22.7114 15.3629 22.5918 16.2178 22.3912C19.2742 21.6737 21.6607 19.2855 22.3777 16.2269C22.8174 14.351 22.8676 12.4075 22.5284 10.5161H13.6222V22.75Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint0_linear5">
                                                        <stop stop-color="#D896FF"></stop>
                                                        <stop stop-color="#D896FF" offset="0.0001"></stop>
                                                        <stop stop-color="#A135DF" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint1_linear5">
                                                        <stop stop-color="#D896FF"></stop>
                                                        <stop stop-color="#D896FF" offset="0.0001"></stop>
                                                        <stop stop-color="#A135DF" offset="1"></stop>
                                                    </linearGradient>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="22.75" x2="13" y1="3.25" x1="13" id="paint2_linear5">
                                                        <stop stop-color="#D896FF"></stop>
                                                        <stop stop-color="#D896FF" offset="0.0001"></stop>
                                                        <stop stop-color="#A135DF" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Template'

                                                onClick={() => handleComponentClick(14)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear9)" d="M13 23.8334C7.02 23.8334 2.16666 18.9909 2.16666 13.0001C2.16666 7.02005 7.02 2.16672 13 2.16672C18.9908 2.16672 23.8333 7.02005 23.8333 13.0001C23.8333 18.9909 18.9908 23.8334 13 23.8334ZM16.4558 17.0191C16.5858 17.095 16.7267 17.1383 16.8783 17.1383C17.1492 17.1383 17.42 16.9975 17.5717 16.7375C17.7992 16.3583 17.68 15.86 17.29 15.6216L13.4333 13.325V8.31998C13.4333 7.86498 13.065 7.50748 12.6208 7.50748C12.1767 7.50748 11.8083 7.86498 11.8083 8.31998V13.7908C11.8083 14.0725 11.96 14.3325 12.2092 14.4841L16.4558 17.0191Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="23.8334" x2="13" y1="2.16672" x1="13" id="paint0_linear9">
                                                        <stop stop-color="#97FFFF"></stop>
                                                        <stop stop-color="#01A5A5" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Time Delay'

                                                onClick={() => handleComponentClick(15)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 28 28" height="28" width="28">
                                                <path stroke-width="0.4" stroke="#74EBA2" fill="url(#paint0_linear_1568_38266)" d="M21.0013 18.882V16.7225C21.0013 14.4708 19.1696 12.6392 16.918 12.6392C15.9531 12.6392 15.168 11.854 15.168 10.8892V9.11932C15.8483 8.87933 16.4378 8.43476 16.8555 7.84659C17.2732 7.25841 17.4988 6.55541 17.5013 5.83398C17.5013 3.90432 15.931 2.33398 14.0013 2.33398C12.0716 2.33398 10.5013 3.90432 10.5013 5.83398C10.5013 7.35298 11.4801 8.63515 12.8346 9.11815V10.8892C12.8346 11.854 12.0495 12.6392 11.0846 12.6392C8.83297 12.6392 7.0013 14.4708 7.0013 16.7225V18.882C6.32096 19.122 5.73151 19.5665 5.31377 20.1547C4.89603 20.7429 4.67045 21.4459 4.66797 22.1673C4.66797 24.097 6.2383 25.6673 8.16797 25.6673C10.0976 25.6673 11.668 24.097 11.668 22.1673C11.6655 21.4459 11.4399 20.7429 11.0222 20.1547C10.6044 19.5665 10.015 19.122 9.33464 18.882V16.7225C9.33464 15.7577 10.1198 14.9725 11.0846 14.9725C12.2268 14.9725 13.2593 14.4977 14.0013 13.7382C14.3802 14.1285 14.8336 14.4388 15.3346 14.6508C15.8356 14.8628 16.374 14.9722 16.918 14.9725C17.8828 14.9725 18.668 15.7577 18.668 16.7225V18.882C17.9876 19.122 17.3982 19.5665 16.9804 20.1547C16.5627 20.7429 16.3371 21.4459 16.3346 22.1673C16.3346 24.097 17.905 25.6673 19.8346 25.6673C21.7643 25.6673 23.3346 24.097 23.3346 22.1673C23.3322 21.4459 23.1066 20.7429 22.6888 20.1547C22.2711 19.5665 21.6816 19.122 21.0013 18.882ZM8.16797 23.334C7.86758 23.3205 7.58394 23.1918 7.37612 22.9744C7.16831 22.7571 7.05232 22.468 7.05232 22.1673C7.05232 21.8666 7.16831 21.5775 7.37612 21.3602C7.58394 21.1429 7.86758 21.0141 8.16797 21.0007C8.46836 21.0141 8.752 21.1429 8.95981 21.3602C9.16763 21.5775 9.28361 21.8666 9.28361 22.1673C9.28361 22.468 9.16763 22.7571 8.95981 22.9744C8.752 23.1918 8.46836 23.3205 8.16797 23.334ZM14.0013 4.66732C14.2324 4.66709 14.4583 4.73541 14.6506 4.86365C14.8428 4.99188 14.9926 5.17426 15.0812 5.3877C15.1697 5.60114 15.1929 5.83605 15.1479 6.0627C15.1029 6.28934 14.9916 6.49754 14.8283 6.66093C14.6649 6.82433 14.4567 6.93558 14.23 6.9806C14.0034 7.02563 13.7685 7.0024 13.555 6.91386C13.3416 6.82533 13.1592 6.67546 13.031 6.48324C12.9027 6.29101 12.8344 6.06506 12.8346 5.83398C12.8346 5.19115 13.3573 4.66732 14.0013 4.66732ZM19.8346 23.334C19.5342 23.3205 19.2506 23.1918 19.0428 22.9744C18.835 22.7571 18.719 22.468 18.719 22.1673C18.719 21.8666 18.835 21.5775 19.0428 21.3602C19.2506 21.1429 19.5342 21.0141 19.8346 21.0007C20.135 21.0141 20.4187 21.1429 20.6265 21.3602C20.8343 21.5775 20.9503 21.8666 20.9503 22.1673C20.9503 22.468 20.8343 22.7571 20.6265 22.9744C20.4187 23.1918 20.135 23.3205 19.8346 23.334Z"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="25.6673" x2="14.0013" y1="2.33398" x1="14.0013" id="paint0_linear_1568_38266">
                                                        <stop stop-color="#74EBA2"></stop>
                                                        <stop stop-color="#31CF6E" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Whatsapp Flows'

                                                onClick={() => handleComponentClick(16)}
                                            />
                                        </div>
                                        <div className='operation_text'>Integrations</div>
                                        <div className='integration_grid'>
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="#FFB906" d="M11.3317 20.5833C9.75 22.8258 6.6625 23.3892 4.43083 21.8292C2.21 20.2692 1.69 17.16 3.25 14.8958C3.68626 14.2625 4.26365 13.739 4.93666 13.3668C5.60968 12.9946 6.35994 12.7837 7.12833 12.7508L7.1825 14.3C6.19667 14.3758 5.24333 14.885 4.62583 15.7733C3.5425 17.3333 3.87833 19.435 5.3625 20.4858C6.8575 21.5258 8.94833 21.125 10.0317 19.5758C10.3675 19.0883 10.5625 18.5575 10.6383 18.0158V16.9217L16.6833 16.8783L16.7592 16.7592C17.3333 15.7625 18.5792 15.4158 19.5542 15.9792C19.7875 16.1157 19.9917 16.2969 20.155 16.5124C20.3183 16.7278 20.4376 16.9733 20.506 17.2349C20.5744 17.4965 20.5906 17.7689 20.5537 18.0368C20.5168 18.3046 20.4275 18.5625 20.2908 18.7958C19.7167 19.7817 18.46 20.1283 17.485 19.565C17.0408 19.3158 16.7267 18.915 16.5858 18.46L12.1767 18.4817C12.0475 19.2343 11.7595 19.9508 11.3317 20.5833V20.5833ZM19.2183 12.8483C21.9592 13.1842 23.9092 15.6433 23.5733 18.3408C23.2375 21.0492 20.7458 22.9667 18.005 22.6308C17.2439 22.5422 16.5132 22.2803 15.8691 21.8653C15.2249 21.4502 14.6845 20.8931 14.2892 20.2367L15.6325 19.4567C15.9104 19.887 16.2797 20.2508 16.714 20.5223C17.1484 20.7938 17.6373 20.9663 18.1458 21.0275C20.0417 21.255 21.7208 19.9658 21.9483 18.1567C22.1758 16.3475 20.8325 14.69 18.9583 14.4625C18.3733 14.3975 17.81 14.4733 17.3008 14.6575L16.38 15.1342L13.585 9.96667H13.3467C12.8013 9.95079 12.2843 9.71969 11.9088 9.32386C11.5333 8.92802 11.3297 8.39965 11.3425 7.85417C11.375 6.7275 12.35 5.85 13.4875 5.89334C14.625 5.95834 15.5242 6.87917 15.4917 8.00584C15.47 8.4825 15.2858 8.91584 14.9933 9.25167L17.0517 13.0542C17.7233 12.8375 18.46 12.7617 19.2183 12.8483V12.8483ZM8.9375 9.90167C7.85417 7.35584 9.0025 4.44167 11.505 3.38C14.0183 2.31834 16.9217 3.52084 18.005 6.06667C18.6442 7.55084 18.5142 9.17584 17.7883 10.4758L16.445 9.69584C16.9 8.81834 16.9758 7.74584 16.5425 6.73834C15.8058 5.005 13.845 4.17084 12.1658 4.875C10.4758 5.59 9.7175 7.58334 10.4542 9.31667C10.7575 10.0317 11.2667 10.5842 11.8842 10.9525L12.3067 11.18L8.98083 16.5858C9.01333 16.64 9.05667 16.705 9.08917 16.7917C9.62 17.7775 9.25167 19.0233 8.255 19.5542C7.26917 20.085 6.02333 19.695 5.48167 18.6767C4.95083 17.6692 5.31917 16.4233 6.31583 15.8925C6.73833 15.665 7.20417 15.6108 7.64833 15.7083L10.1508 11.6242C9.64167 11.1583 9.20833 10.5733 8.9375 9.90167V9.90167Z"></path>
                                            </svg>} text='Webhook'

                                                onClick={() => handleComponentClick(17)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 26 26" height="26" width="26">
                                                <path fill="url(#paint0_linear10)" d="M8.46083 2.16667H17.5403C20.8867 2.16667 22.75 4.095 22.75 7.39917V18.59C22.75 21.9483 20.8867 23.8333 17.5403 23.8333H8.46083C5.1675 23.8333 3.25 21.9483 3.25 18.59V7.39917C3.25 4.095 5.1675 2.16667 8.46083 2.16667ZM8.75333 7.215V7.20417H11.9914C12.4583 7.20417 12.8375 7.58333 12.8375 8.04808C12.8375 8.52583 12.4583 8.905 11.9914 8.905H8.75333C8.28642 8.905 7.90833 8.52583 7.90833 8.06C7.90833 7.59417 8.28642 7.215 8.75333 7.215ZM8.75333 13.8017H17.2467C17.7125 13.8017 18.0917 13.4225 18.0917 12.9567C18.0917 12.4908 17.7125 12.1106 17.2467 12.1106H8.75333C8.28642 12.1106 7.90833 12.4908 7.90833 12.9567C7.90833 13.4225 8.28642 13.8017 8.75333 13.8017ZM8.75333 18.7525H17.2467C17.6789 18.7092 18.005 18.3398 18.005 17.9075C18.005 17.4633 17.6789 17.095 17.2467 17.0517H8.75333C8.42833 17.0192 8.11417 17.1708 7.94083 17.4525C7.7675 17.7233 7.7675 18.0808 7.94083 18.3625C8.11417 18.6333 8.42833 18.7958 8.75333 18.7525Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="23.8333" x2="13" y1="2.16667" x1="13" id="paint0_linear10">
                                                        <stop stop-color="#81DBA4"></stop>
                                                        <stop stop-color="#006A29" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Google Spreadsheet'

                                                onClick={() => handleComponentClick(18)}
                                            />
                                        </div>
                                        <div className='operation_text'>Catalog</div>
                                        <div className='Catalog_grid'>
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 18 18" height="18" width="18">
                                                <path fill="url(#paint0_linear_832_26743)" d="M15.7135 0H12.6715C11.4025 0 10.3855 1.035 10.3855 2.3049V5.373C10.3855 6.651 11.4025 7.677 12.6715 7.677H15.7135C16.9735 7.677 17.9995 6.651 17.9995 5.373V2.3049C17.9995 1.035 16.9735 0 15.7135 0ZM2.286 1.98807e-05H5.328C6.597 1.98807e-05 7.614 1.03502 7.614 2.30492V5.37302C7.614 6.65102 6.597 7.67701 5.328 7.67701H2.286C1.026 7.67701 0 6.65102 0 5.37302V2.30492C0 1.03502 1.026 1.98807e-05 2.286 1.98807e-05ZM2.286 10.3215H5.328C6.597 10.3215 7.614 11.3484 7.614 12.6264V15.6945C7.614 16.9635 6.597 17.9985 5.328 17.9985H2.286C1.026 17.9985 0 16.9635 0 15.6945V12.6264C0 11.3484 1.026 10.3215 2.286 10.3215ZM12.6715 10.3215H15.7135C16.9735 10.3215 17.9995 11.3484 17.9995 12.6264V15.6945C17.9995 16.9635 16.9735 17.9985 15.7135 17.9985H12.6715C11.4025 17.9985 10.3855 16.9635 10.3855 15.6945V12.6264C10.3855 11.3484 11.4025 10.3215 12.6715 10.3215Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="17.9994" x2="17.9988" y1="0" x1="0" id="paint0_linear_832_26743">
                                                        <stop stop-color="#2697FF"></stop>
                                                        <stop stop-color="#1363AD" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Sets'

                                                onClick={() => handleComponentClick(19)}
                                            />
                                            <OperationItemContent img={<svg xmlns="http://www.w3.org/2000/svg" className='operation_image_svg' fill="none" viewBox="0 0 20 20" height="20" width="20">
                                                <path fill="url(#paint0_linear_832_26750)" d="M11.8492 9.08687H14.4979C14.8995 9.08687 15.215 8.75483 15.215 8.35444C15.215 7.94428 14.8995 7.62201 14.4979 7.62201H11.8492C11.4476 7.62201 11.1321 7.94428 11.1321 8.35444C11.1321 8.75483 11.4476 9.08687 11.8492 9.08687ZM17.644 4.00839C18.2273 4.00839 18.6097 4.21347 18.9922 4.66269C19.3747 5.11192 19.4416 5.75645 19.3556 6.34142L18.4472 12.7477C18.2751 13.9792 17.2424 14.8864 16.028 14.8864H5.59586C4.32412 14.8864 3.2723 13.8913 3.16712 12.6022L2.28741 1.95662L0.843553 1.70271C0.461073 1.63435 0.193338 1.25349 0.260272 0.862859C0.327206 0.463442 0.700123 0.198791 1.09216 0.258362L3.3727 0.608951C3.69781 0.668522 3.93686 0.940985 3.96554 1.27302L4.14722 3.46054C4.17591 3.77402 4.42452 4.00839 4.7305 4.00839H17.644ZM5.44292 16.4295C4.63972 16.4295 3.9895 17.0935 3.9895 17.9139C3.9895 18.7244 4.63972 19.3885 5.44292 19.3885C6.23657 19.3885 6.88679 18.7244 6.88679 17.9139C6.88679 17.0935 6.23657 16.4295 5.44292 16.4295ZM16.1999 16.4295C15.3967 16.4295 14.7465 17.0935 14.7465 17.9139C14.7465 18.7244 15.3967 19.3885 16.1999 19.3885C16.9936 19.3885 17.6438 18.7244 17.6438 17.9139C17.6438 17.0935 16.9936 16.4295 16.1999 16.4295Z" clip-rule="evenodd" fill-rule="evenodd"></path>
                                                <defs>
                                                    <linearGradient gradientUnits="userSpaceOnUse" y2="18.5" x2="18" y1="0.5" x1="1" id="paint0_linear_832_26750">
                                                        <stop stop-color="#C087F9"></stop>
                                                        <stop stop-color="#8735DA" offset="1"></stop>
                                                    </linearGradient>
                                                </defs>
                                            </svg>} text='Product'

                                                onClick={() => handleComponentClick(20)}
                                            />
                                        </div>
                                    </>
                                )
                        }
                    </div>
                </div>

                <div className='editchatbot_right_container'>
                    <div className='header_content'>
                        <div className='header_name'>
                            <a className='chatbotbackbtn'><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
                            {currentChatbotName}
                            <EditIcon onClick={handleEditClick} />
                        </div>
                        <div className='header_savebtn'>
                            <ButtonComponent label='Save' customBtn='cancel_button_style' />

                            <button className='header_importbtn'>
                                <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.828V15H7V3.828L3.757 7.071L2.343 5.657L8 0L13.657 5.657L12.243 7.071L9 3.828ZM0 14H2V18H14V14H16V18C16 19.1 15.1 20 14 20H2C0.9 20 0 19.037 0 18V14Z" fill="#666666"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div className='flow_container'>
                        <div className='chatbot_main_container'>
                            <div className='right-container' style={{ position: 'relative', width: '100%', height: '100%' }}>
                                <div className='chatbot_sidebartoggle_button' onClick={toggleLeftContainer} style={{ cursor: 'pointer' }}>
                                    <svg className='chatbot_toggle_svg' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.63574 7.36328L1.74665 11.2524C1.55139 11.4476 1.55139 11.7642 1.74665 11.9595L5.63574 15.8486" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
                                        <path d="M2.80724 11.6058H9.87831" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
                                        <path d="M18.3643 15.8496L22.2533 11.9605C22.4486 11.7653 22.4486 11.4487 22.2533 11.2534L18.3643 7.36433" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
                                        <path d="M21.1928 11.607L14.1217 11.607" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"></path>
                                    </svg>
                                </div>
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    fitView
                                    fitViewOptions={{ padding: 0.2 }}
                                    connectionLineType={ConnectionLineType.Bezier}
                                    connectionLineStyle={{ stroke: '#6080e6' }}

                                >
                                    
                                    <Background
                                        gap={70}
                                        color="#e8eaf2"
                                        lineWidth={5}
                                        variant='lines'
                                    />
                                    <MiniMap nodeColor={(node) => {

                                        return node.style?.fill || '#B1C8E2';
                                    }} />
                                    <Controls />
                                </ReactFlow>


                            </div>



                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}
export default EditChatbotPage;
