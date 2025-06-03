import React,{useState} from "react";
import BaseModal from "./BaseModal";
import ChatbotTextEditor from "./ChatbotTextEditor";
import VariablesDropdown from "./VariablesDropdown";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";
import ToggleSwitch from "../../../ToggleSwitch";

const variables = [
    { title: "first_incoming_message", value: "@first_incoming_message" },

];
const contactAttributes = [
    { title: "actual_fare", value: '{{actual_fare}}' },
    { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
    { title: 'additional_items', value: '{{additional_items}}' }
]
const fallbackOptions = [1, 2, 3]
const emojis = [
    "😀", "😁", "😂", "😃", "😉", "😋", "😎", "😍", "😗", "🤗",
    "🤔", "😣", "😫", "😴", "😌", "🤓", "😛", "😜", "😠", "😇",
   
];
const WhatsappFlowModal = ({ show, onClose, onSave }) => {
    const [content, setContent] = useState('');
    const [inputValue, setInputValue] = useState("");
    const [HeaderValue, setHeaderValue] = useState('');
    const [fallbackContent, setFallbackContent] = useState('')
   const [isVisible, setIsVisible] = useState(false);
    const [isVariablesVisible, setIsVariablesVisible] = useState(false);
    const [isHeaderVariables, setIsHeaderVariables] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isActive, setIsActive] = useState(false); //toggle
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

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="WhatsApp Flow">
            <div className='question_text_content'>
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
                <TextfieldComponent type='text' placeholder='input value' />
             
            </div>

            <div className='question_text_container'>
                <div className='edit__text__label'>Button</div>
                <TextfieldComponent type="text" placeholder='Menu Here' />
             
            </div>
            <div className='question_text_container'>
                <div className='edit__text__label'>Select Flow</div>
                <AutocompleteComponent
                    options=''
                    value={content}
                    onChange={(event, newValue) => setContent(newValue)}
                    placeholder='select'
                />
              
            </div>
            <div className='question_text_container'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Fallback Message</div>
                    <ToggleSwitch isActive={isActive} onToggle={handleToggle} />
                    
                </div>
                <div className='fallback_subtext'>Set a fallback message for when the customer doesn’t engage with the WhatsApp flow.</div>
                <div className='message_templates_body'>
                    Help us by completing the above form to continue.
                </div>
                <div className='edit__text__label'>How many times should the fallback get triggered?</div>
                <AutocompleteComponent
                    options={fallbackOptions}
                    value={fallbackContent}
                    onChange={(event, newValue) => setFallbackContent(newValue)}
                    placeholder='Select'
                />

              
            </div>

        </BaseModal>
    );
};
export default WhatsappFlowModal;