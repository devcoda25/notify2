import React, { useState } from "react";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import { DeleteOutlineIcon } from "../../../Icon";
import VariablesDropdown from "./VariablesDropdown";
import ChatbotTextEditor from "./ChatbotTextEditor";
import BaseModal from "./BaseModal";
import style from "../../../MuiStyles/muiStyle";


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
const ListModal = ({ show, onClose, onSave }) => {
    const [inputValue, setInputValue] = useState("");
    const [HeaderValue, setHeaderValue] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isVariablesVisible, setIsVariablesVisible] = useState(false);
    const [isHeaderVariables, setIsHeaderVariables] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const [sections, setSections] = useState([
        { title: 'Section 1 Title', showDescription: false, showNewRow: false }
    ]);

    const handleAddSection = () => {
        const newSectionNumber = sections.length + 1;
        const newSection = { title: `Section ${newSectionNumber} Title`, showDescription: false, showNewRow: false };
        setSections([...sections, newSection]);
    };

    const handleDeleteSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleAddDescription = (index) => {
        const newSections = sections.map((section, i) => (
            i === index ? { ...section, showDescription: true } : section
        ));
        setSections(newSections);
    };

    const handleDeleteDescription = (index) => {
        const newSections = sections.map((section, i) => (
            i === index ? { ...section, showDescription: false } : section
        ));
        setSections(newSections);
    };

    const handleAddNewRow = (index) => {
        const newSections = sections.map((section, i) => (
            i === index ? { ...section, showNewRow: true } : section
        ));
        setSections(newSections);
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

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Set List">
            <>
                <div className='question_text_content'>
                    <div className='edit__text__label'>Header Text</div>
                    <div className='question_variant_item'>
                        <TextfieldComponent type="text" placeholder='inputvalue'
                            value={HeaderValue}
                            onChange={(e) => setHeaderValue(e.target.value)} />

                        <ButtonComponent label='Variables' onClick={toggleHeaderVariablesDropdown} customBtn='variant_create_button' />

                    </div>
                    {isHeaderVariables && (
                        <>
                            <VariablesDropdown
                                variables={variables}
                                contactAttributes={contactAttributes}
                                searchTerm={searchTerm}
                                handleSearchChange={handleSearchChange}
                                handleHeaderVariableClick={handleHeaderVariableClick}
                            />
                        </>

                    )}
                </div>


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
                    <div className='edit__text__label'>Button Text</div>
                    <TextfieldComponent type="text" placeholder='Menu Here' />

                </div>

                <div className='question_text_container'>
                    {sections.map((section, index) => (
                        <div className='section_container' key={index} style={{ marginBottom: '20px' }}>
                            <div>
                                <div className='edit__text__label'>{section.title}</div>
                                <TextfieldComponent type="text" placeholder='input Value' customStyle='section_text_box' />

                            </div>
                            <div>
                                <div className='list_row'>
                                    <div>
                                        <div className='list_row_header'>
                                            <div className='edit__text__label'>Row 1</div>
                                            {!section.showDescription && (
                                                <button className='list_add_description' onClick={() => handleAddDescription(index)}>
                                                    Add Description
                                                </button>
                                            )}
                                        </div>
                                        <TextfieldComponent type="text" placeholder='input Value' customStyle='section_text_box' />

                                    </div>
                                    {section.showDescription && (
                                        <div>
                                            <div className='edit__text__label'>How do you describe this Bot?</div>
                                            <TextfieldComponent type="text" placeholder='Input Value' customStyle='section_text_box' /> {/* <input type="text" className='edit__text__input section_text_box' placeholder='Input Value' /> */}

                                            <button className='list_row_delete' onClick={() => handleDeleteDescription(index)}>
                                                <DeleteOutlineIcon sx={style.deleteIconHover} />

                                            </button>
                                        </div>
                                    )}
                                </div>
                                {
                                    section.showNewRow && (
                                        <>
                                            <div className='edit__text__label'>New Row</div>
                                            <div className='question_variant_item'>
                                                <TextfieldComponent type="text" placeholder='' customStyle='new_row_create_box' />

                                                <ButtonComponent label='Create' customBtn='variant_create_button' />

                                            </div>
                                        </>
                                    )
                                }
                                {
                                    !section.showNewRow && (
                                        <button className='list_add_description list_new_row' onClick={() => handleAddNewRow(index)}>New Row</button>
                                    )
                                }
                            </div>
                            <ButtonComponent label='Remove Section' onClick={() => handleDeleteSection(index)} customBtn='condition_delete_btn' />

                        </div>
                    ))}
                    <ButtonComponent label='Add Section' onClick={handleAddSection} customBtn='cancel_button_style add_sec_btn' />

                </div>
                <div className='question_text_container'>
                    <div className='edit__text__label'>Save Answers in a variable</div>
                    <TextfieldComponent type="text" placeholder='@value' />

                </div>

            </>
        </BaseModal>
    );
};
export default ListModal;


