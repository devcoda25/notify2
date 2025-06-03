import React, { useState } from "react";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import ToggleSwitch from "../../../ToggleSwitch";
import AutocompleteComponent from "../../../AutocompleteComponent";
import ChatbotTextEditor from "./ChatbotTextEditor";
import VariablesDropdown from "./VariablesDropdown";
import BaseModal from "./BaseModal";

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
const validationOptions = ["Number", "Date", 'Date + Time', "Time", "Pattern (regex)"]

const QuestionModal = ({ show, onClose, onSave }) => {
    const [inputValue, setInputValue] = useState("");
    const [isActive, setIsActive] = useState(false); //toggle
    const [isActiveAdvancedOption, setIsActiveAdvancedOption] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVariablesVisible, setIsVariablesVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [validation, setValidation] = useState('');

    const handleToggle = () => {
        setIsActive(!isActive);
    };
    const handleToggleAdvancedOptions = () => {
        setIsActiveAdvancedOption(!isActiveAdvancedOption)
    }
    const toggleVariablesDropdown = () => {
        setIsVariablesVisible((prev) => !prev);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Set a question">
            <>
                <div className='question_text_content'>
                    <div className='edit__text__label'>Question Text</div>
                   
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
                    <div className='edit__text__label'>Add Answer variant</div>
                    <div className='question_variant_item'>
                        <TextfieldComponent type="text" placeholder='Hi!' />
                     
                        <ButtonComponent label='Create' customBtn='variant_create_button' />
                       
                    </div>
                </div>

                <div className='question_text_container'>
                    <div className='question_accept_container'>
                        <div className='edit__text__label'>Accept a media response</div>
                        <ToggleSwitch leftLabel='Off' isActive={isActive} onToggle={handleToggle} rightLabel='On' />
                      

                    </div>
                </div>

                <div className='question_text_container'>
                    <div className='edit__text__label'>Save Answer in a Variable</div>
                    <TextfieldComponent type="text" placeholder='@Value' />
                 
                </div>
                <div className='question_text_container'>
                    <div className='question_accept_container'>
                        <div className='edit__text__label'>Advanced options</div>
                        <ToggleSwitch leftLabel='Off' isActive={isActiveAdvancedOption} onToggle={handleToggleAdvancedOptions} rightLabel='On' />
                      
                    </div>
                </div>
                {
                    isActiveAdvancedOption &&
                    <>
                        <div className='validation_container'>
                            <div className='edit__text__label'>Validation</div>
                          
                            <AutocompleteComponent
                                options={validationOptions}
                                value={validation}
                                onChange={(event, newValue) => setValidation(newValue)}
                            />
                        </div>
                        {validation === "Number" && (
                            <div className='validation_container'>
                                <div className='edit__text__label'>Minimum Value</div>
                                <TextfieldComponent type='number' placeholder='0' />
                             

                                <div className='edit__text__label'>Maximum Value</div>
                                <TextfieldComponent type='number' placeholder='9999' />
                              
                            </div>
                        )}
                        {validation === "Pattern (regex)" && (
                            <div className='validation_container'>
                                <div className='edit__text__label'>Regex Pattern</div>
                                <TextfieldComponent type='text' placeholder='Examples:$,%' />
                              

                            </div>
                        )}
                        <div className='validation_container'>
                            <div className='edit__text__label'>Validation error message</div>
                            <textarea value="I'm afraid I didn't understand, could you try again, please?" class="edit__text__textarea validation_textarea"  ></textarea>
                        </div>
                        <div className='validation_container'>
                            <div className='Validation_fails_count'>
                                Exit chatbot if validation failed more than
                                <TextfieldComponent type="number" customStyle='fails_count_textbox'/>
                              
                            </div>
                        </div>
                    </>

                }
             
            </>
        </BaseModal>

    );
};
export default QuestionModal;