import React, { useState } from 'react'
import rule from '../Assets/img/Rule.svg';
import CustomPagination from '../CustomPagination';
import SearchboxComponent from '../SearchboxComponent';
import ButtonComponent from '../ButtonComponent';
import TableComponent from '../TableComponent';
import NewRuleModal from './PopupModal/Rule/NewRuleModal';
import TextfieldComponent from '../TextfieldComponent';
import TriggerPropertiesModal from './PopupModal/Rule/TriggerPropertiesModal';
import FilterPropertiesModal from './PopupModal/Rule/FilterPropertiesModal';
import ActionPropertiesModal from './PopupModal/Rule/ActionPropertiesModal';

const ruleColumns = [
    { id: "ruleName", label: "RULL NAME" },
    { id: "triggerType", label: "TRIGGER TYPE" },
    { id: "action", label: "ACTION" },
    { id: "status", label: "STATUS" },
    { id: "executed", label: "EXECUTED" },
    { id: "lastUpdated", label: "LAST UPDATED" },
    { id: "actions", label: "ACTIONS" },
];
const ruleTableData = [];

const Rules = () => {
    const [state, setState] = useState({
        isOpenNewruleModal: false,
        page: 0,
        rowsPerPage: 5,
        totalRows: 0,
        showNewrulePage: false,
        showTriggerProperties: false,
        showFilterProperties: false,
        showActionProperties: false,
    });
   
    const handleChangePage = (event, newPage) => {
        setState((prev) => ({ ...prev, page: newPage }));
    };
    
    const handleChangeRowPerPage = (event) => {
        setState((prev) => ({
            ...prev,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        }));
    };
    const handleBackbutton = () => {
        setState((prev) => ({
            ...prev,
            showNewrulePage: false,
            isOpenNewruleModal: false,
        }));
    };

    const handleOpenNewruleModal = () => {
        setState((prev) => ({ ...prev, isOpenNewruleModal: true }));
    };

    const handleCloseNewruleModal = () => {
        setState((prev) => ({ ...prev, isOpenNewruleModal: false }));
    };

    const handleClickGridContent = () => {
        setState((prev) => ({ ...prev, showNewrulePage: true }));
    };

    const handleOpenTriggerProperties = () => {
        setState((prev) => ({ ...prev, showTriggerProperties: true }));
    };

    const handleCloseTriggerProperties = () => {
        setState((prev) => ({ ...prev, showTriggerProperties: false }));
    };

    const handleOpenFilterProperties = () => {
        setState((prev) => ({ ...prev, showFilterProperties: true }));
    };

    const handleCloseFilterProperties = () => {
        setState((prev) => ({ ...prev, showFilterProperties: false }));
    };

    const handleOpenActionProperties = () => {
        setState((prev) => ({ ...prev, showActionProperties: true }));
    };

    const handleCloseActionProperties = () => {
        setState((prev) => ({ ...prev, showActionProperties: false }));
    };
   

    return (
        <>
            {
                state.showNewrulePage ?
                    (
                        <>
                            {
                                state.showTriggerProperties &&
                                <TriggerPropertiesModal show={state.showTriggerProperties} onClose={handleCloseTriggerProperties} />
                            }
                            {
                                state.showFilterProperties &&
                                <FilterPropertiesModal show={state.showFilterProperties} onClose={handleCloseFilterProperties} />
                            }
                            {
                                state.showActionProperties &&
                                <ActionPropertiesModal show={state.showActionProperties} onClose={handleCloseActionProperties} />
                            }
                            <div className='newruletype_container' >
                                <div className='newruletype_header'>
                                    <div className='newruletype_header_left_container'>
                                        <div className='newruletype_backbutton' onClick={handleBackbutton}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3.55967 17.9001H2.1001V6.0752H3.55967V17.9001ZM12.0116 17.9098L6.102 12.0002L12.0116 6.09057L13.0269 7.09632L8.90002 11.2579H21.9V12.7175H8.8904L13.0519 16.8944L12.0116 17.9098Z" fill="#747474"></path></svg>
                                        </div>
                                        <TextfieldComponent type='text' placeholder='Enter a rule name' customStyle='newruletype_header_input' />
                                    
                                    </div>
                                    <div className='newruletype_header_right_container'>
                                        <ButtonComponent label='Save changes' />
                                        <div className='newruletype_toggle_container'><div className="newruletype_toggle_circle"></div><div>Off</div></div>
                                    </div>
                                </div>
                                <div className='newruletype_maincontent'>
                                    <div className='newruletype_attribute_card'>
                                        <div class="attribute_svg_image"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none"><path d="M1.89453 2.59619C1.13628 2.59619 0.519531 3.21294 0.519531 3.97119V6.72119C0.519531 7.47944 1.13628 8.09619 1.89453 8.09619H2.78271C2.77646 8.01344 2.76953 7.93069 2.76953 7.84619C2.76953 6.05419 4.22753 4.59619 6.01953 4.59619C7.81153 4.59619 9.26953 6.05419 9.26953 7.84619C9.26953 7.93069 9.26334 8.01344 9.25684 8.09619H10.1445C10.9028 8.09619 11.5195 7.47944 11.5195 6.72119V3.97119C11.5195 3.21294 10.9028 2.59619 10.1445 2.59619H1.89453ZM6.00049 5C4.48174 5 3.25049 6.23125 3.25049 7.75C3.25049 9.26875 4.48174 10.5 6.00049 10.5C7.51924 10.5 8.75049 9.26875 8.75049 7.75C8.75049 6.23125 7.51924 5 6.00049 5ZM6.00049 5.75C6.13849 5.75 6.25049 5.862 6.25049 6V7.5H7.75049C7.88849 7.5 8.00049 7.612 8.00049 7.75C8.00049 7.888 7.88849 8 7.75049 8H6.25049V9.5C6.25049 9.638 6.13849 9.75 6.00049 9.75C5.86249 9.75 5.75049 9.638 5.75049 9.5V8H4.25049C4.11249 8 4.00049 7.888 4.00049 7.75C4.00049 7.612 4.11249 7.5 4.25049 7.5H5.75049V6C5.75049 5.862 5.86249 5.75 6.00049 5.75Z" fill="white"></path></svg></div>
                                        <div className='attribute_card_rightcontent'>
                                            <div className='attribute_card_heading'>
                                                When
                                            </div>
                                            <div className='attribute_card_name'>New attribute is added to a contact
                                                <div className='select_attribute' onClick={handleOpenTriggerProperties}>Choose attribute</div>
                                            </div>
                                            <div className='edit_attribute'>Edit</div>
                                        </div>
                                    </div>
                                    <div className='card_connectorline'></div>
                                    <div className='addfilter_card' onClick={handleOpenFilterProperties}>
                                        Add Filter (Optional)
                                    </div>
                                    <div className='card_connectorline'></div>
                                    <div className='actioncard' onClick={handleOpenActionProperties}>
                                        <div class="actioncard_svg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 12" fill="none"><path d="M3.9126 11.1499L4.4126 7.6499H1.8501L6.5626 0.837402H7.7001L7.2001 4.8374H10.2751L5.0376 11.1499H3.9126Z" fill="#1F2A37"></path></svg></div>
                                        <div>
                                            <div className='empty_action_title'>Add an action you want to perform</div>
                                            <div className='empty_action_description'>Action is an event performed after the rule is triggered</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    : (
                        <div className='rule_container'>
                            {
                                state.isOpenNewruleModal &&
                                <NewRuleModal show={state.isOpenNewruleModal} onClose={handleCloseNewruleModal} onClick={handleClickGridContent} />
                            }
                            <div className='rule_header'>
                                <div>
                                    <div className='rule_title'>Rules</div>
                                    <div className='rule_subtitle'>Create Rules to trigger automated messages, chat assignments, chatbots and more.</div>
                                </div>
                                <div className='rule_header_right_container'>
                                    <div className='header__search'>
                                        <SearchboxComponent customSearch='custom__search_box' placeholder='Search...' />

                                    </div>
                                    <a href="https://support.wati.io/l/en/article/jih6ul0jne-how-to-create-an-attribute-rule" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">How it works</span></div></a>
                                    <ButtonComponent label='+ Create Rule' onClick={handleOpenNewruleModal} />

                                </div>
                            </div>
                            <div className='rule_main_table_content'>
                                <TableComponent columns={ruleColumns} data={ruleTableData} showActions={false}
                                    customStyle={{
                                        headerCell: { fontWeight: 'normal', fontSize: '14px' },

                                    }} />

                                <div className='rule_main_image_content'>
                                    <div className='rule_image_container'>
                                        <img className='rule_no_content_svg' alt='nodata' src={rule} />
                                        <div className='rule_no_content_title'>It’s quiet in here!</div>
                                        <div className='rule_no_content_text'>You don’t have any Rules set up, but once you set up the first one it’ll come up here</div>
                                    </div>
                                    <ButtonComponent label='+ Create New rule' onClick={handleOpenNewruleModal} />

                                </div>

                            </div>
                            <div className='rule_table_pagination'>
                                <CustomPagination
                                    count={state.totalRows}
                                    rowsPerPage={state.rowsPerPage}
                                    page={state.page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowPerPage}
                                />

                            </div>
                        </div>
                    )
            }

        </>
    )

}
export default Rules;