import React, { useState } from "react";
import BaseModal from "./BaseModal";
import VariablesDropdown from "./VariablesDropdown";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";



const variables = [
    { title: "first_incoming_message", value: "@first_incoming_message" },

];
const contactAttributes = [
    { title: "actual_fare", value: '{{actual_fare}}' },
    { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
    { title: 'additional_items', value: '{{additional_items}}' }
]
const options = ['Variable', 'Custom Attribute']

const UpdateAttributesModal = ({ show, onClose, onSave }) => {
    const [inputValue, setInputValue] = useState('');
    const [secondInputValue, setsecondInputValue] = useState('');
    const [content, setContent] = useState('');
    const [isHeaderVariables, setIsHeaderVariables] = useState(false);
    const [isSecondDropdown, setSecondDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleHeaderVariablesDropdown = () => {
        setIsHeaderVariables((prev) => !prev);
    }
    const toggleSecondVariablesDropdown = () => {
        setSecondDropdown((prev) => !prev);
    }
    const handleHeaderVariableClick = (variable) => {
        setInputValue(prev => prev + variable.value);
        setIsHeaderVariables(false);
    };

    const handleSecondVariableClick = (variable) => {
        setSecondDropdown(false);
        setsecondInputValue(prev => prev + variable.value);
    }
    return (

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Update Attribute">
            <div className='question_text_content'>
                <div className='edit__text__label'>Create/select a variable to modify</div>

                <AutocompleteComponent
                    options={options}
                    value={content}
                    onChange={(event, newValue) => setContent(newValue)}
                    placeholder='Select'
                />

                <div>
                    <div className='update_attributes_container'>
                        <TextfieldComponent type="text" placeholder='Type value or select a variable'
                            value={inputValue} onChange={(e) => setInputValue(e.target.value)} />

                        <ButtonComponent label='Variables' onClick={toggleHeaderVariablesDropdown} />

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
                <div>
                    <div className='update_attributes_container'>
                        <TextfieldComponent type="text" placeholder='Type value or select a variable'
                            value={secondInputValue} onChange={(e) => setsecondInputValue(e.target.value)}
                        />

                        <ButtonComponent label='Variables' onClick={toggleSecondVariablesDropdown} />

                    </div>
                    {isSecondDropdown && (
                        <VariablesDropdown
                            variables={variables}
                            contactAttributes={contactAttributes}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            handleHeaderVariableClick={handleSecondVariableClick}
                        />

                    )}
                </div>
            </div>

        </BaseModal>
    );
};
export default UpdateAttributesModal;