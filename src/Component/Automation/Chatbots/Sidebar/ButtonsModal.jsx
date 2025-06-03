import React, { useState } from "react";
import BaseModal from "./BaseModal";
import ToggleSwitch from "../../../ToggleSwitch";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import ChatbotTextEditor from "./ChatbotTextEditor";
import VariablesDropdown from "./VariablesDropdown";


const variables = [
    { title: "first_incoming_message", value: "@first_incoming_message" },

];
const contactAttributes = [
    { title: "actual_fare", value: '{{actual_fare}}' },
    { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
    { title: 'additional_items', value: '{{additional_items}}' }
]
const emojis = [
    "😀", "😁", "😂", "😃", "😉", "😋", "😎", "😍", "😗", "🤗",
    "🤔", "😣", "😫", "😴", "😌", "🤓", "😛", "😜", "😠", "😇",

];
const ButtonsModal = ({ show, onClose, onSave }) => {
    const [inputValue, setInputValue] = useState("");
    const [HeaderValue, setHeaderValue] = useState('');
    const [isActive, setIsActive] = useState(false); //toggle
    const [isVisible, setIsVisible] = useState(false);
    const [isVariablesVisible, setIsVariablesVisible] = useState(false);
    const [isHeaderVariables, setIsHeaderVariables] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const handleToggle = () => {
        setIsActive(!isActive);
    };

    const toggleVariablesDropdown = () => {
        setIsVariablesVisible((prev) => !prev);
    };
    const toggleHeaderVariablesDropdown = () => {
        setIsHeaderVariables((prev) => !prev);
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredVariables = variables.filter(variable =>
        variable.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterContactAttributes = contactAttributes.filter(contact =>
        contact.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const toggleEmojiPicker = () => {
        setIsVisible((prev) => !prev);
    };
    const handleEmojiClick = (emoji) => {
        setInputValue(prev => prev + emoji);
        setIsVisible(false);
    };

    const handleVariableClick = (variable) => {
        setInputValue(prev => prev + variable.value);
        setIsVariablesVisible(false);
    };
    const handleHeaderVariableClick = (variable) => {
        setHeaderValue(prev => prev + variable.value);
        setIsHeaderVariables(false);
    };
    const formatText = (command) => {
        document.execCommand(command, false, null);
    };
    const applyCurlyFormatting = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText) {
                const curlyText = `{${selectedText}}`;
                const textNode = document.createTextNode(curlyText);
                range.deleteContents();
                range.insertNode(textNode);
                selection.removeAllRanges();
            }
        }
    };
    return (

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Set Button">
            <div className='question_text_content'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Media Header</div>
                    <ToggleSwitch leftLabel='Optional' isActive={isActive} onToggle={handleToggle} />

                </div>
            </div>
            {
                !isActive &&
                <div className='question_text_container'>
                    <div className='edit__text__label'>Header Text</div>
                    <div className='question_variant_item'>
                        <TextfieldComponent type="text" placeholder='inputvalue'
                            value={HeaderValue}
                            onChange={(e) => setHeaderValue(e.target.value)} />

                        <ButtonComponent label='Variables' onClick={toggleHeaderVariablesDropdown} customBtn='variant_create_button' />

                    </div>
                    {isHeaderVariables && (
                        <VariablesDropdown
                            variables={variables}
                            contactAttributes={contactAttributes}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            handleHeaderVariableClick={handleHeaderVariableClick}
                        />

                    )}
                </div>
            }

            <div className='question_text_container'>
                <div className='edit__text__label'>Body Text</div>
                <ChatbotTextEditor
                    value={inputValue}
                    onChange={setInputValue}
                    onFormatText={formatText}
                    onCurlyFormat={applyCurlyFormatting}
                    onEmojiHandler={toggleEmojiPicker}
                    onVariableHandler={toggleVariablesDropdown}
                />

                {isVisible && (
                    <div className="emoji_dropdown">
                        {emojis.map((emoji, index) => (
                            <span
                                key={index}
                                className="emoji_icon"
                                onClick={() => handleEmojiClick(emoji)}
                                style={{ cursor: 'pointer' }}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                )}
                {isVariablesVisible && (
                    <VariablesDropdown
                        variables={variables}
                        contactAttributes={contactAttributes}
                        searchTerm={searchTerm}
                        handleSearchChange={handleSearchChange}
                        handleHeaderVariableClick={handleVariableClick}
                    />

                )}
            </div>
            <div className='question_text_container'>
                <div className='edit__text__label'>Footer Text</div>
                <TextfieldComponent type="text" placeholder='input value' />

            </div>
            <div className='question_text_container'>
                <div className='edit__text__label'>Button 1</div>
                <TextfieldComponent type="text" placeholder='Answer 1' />

                <div className='edit__text__label'>New Button</div>
                <div className='question_variant_item'>
                    <TextfieldComponent type="text" placeholder='input value' />

                    <ButtonComponent label='Create' customBtn='variant_create_button' />

                </div>

            </div>

            <div className='question_text_container'>
                <div className='edit__text__label'>Save Answer in a Variable</div>
                <TextfieldComponent type="text" placeholder='@Value' />

            </div>


        </BaseModal>
    );
};
export default ButtonsModal;