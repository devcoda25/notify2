import React,{useState} from "react";
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";
import BaseModal from "./BaseModal";


const options = ['Option 1', 'Option 2', 'Option 3'];
const dropOptions = ['Equal to', 'Not Equal to', 'Contains'];
//const dropValue = ['Option 1', 'Option 2', 'Option 3'];

const ConditionModal = ({ show, onClose, onSave }) => {
    const [conditions, setConditions] = useState([{ id: Date.now() }]);
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false);
    const [secondContent, setSecondContent] = useState(dropOptions[0]);
    const [thirdContent, setThirdContent] = useState('');
    const [openDropdown, setOpenDropdown] = useState(false);

    const addCondition = () => {
        setConditions([...conditions, { id: Date.now() }]);
    };

    const deleteCondition = (id) => {
        const updatedConditions = conditions.filter(condition => condition.id !== id);
        setConditions(updatedConditions);
    };

    return (
   
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Set a Condition">
        <>
                    <div className='edit__text__label'>Set the condition(s)</div>
                    <div>
                        {conditions.map((condition, index) => (
                            <div key={condition.id} className='set_condition_container'>
                             
                                <AutocompleteComponent
                                    options={options}
                                    value={content}
                                    onChange={(event, newValue) => setContent(newValue)}
                                    open={open}
                                    onOpen={() => setOpen(true)}
                                    onClose={() => setOpen(false)}
                                    placeholder="Type or select a variable"
                                    startAdornment={
                                        <div className="set_condition_field__icon" style={{ marginRight: '8px' }}>
                                            <svg
                                                focusable="false"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                data-testid="HelpIcon"
                                                width="20px"
                                                height="20px"
                                            >
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 17h-2v-2h2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25"></path>
                                            </svg>
                                            <span>IF</span>
                                        </div>
                                    }
                                    endAdornment={
                                        <ButtonComponent label='Variables' onClick={() => setOpen(!open)} customBtn='variable_btn' />
                                       
                                    }
                                    customStyles={{paddingLeft:'50px !important'}}


                                />
                                <AutocompleteComponent
                                    options={dropOptions}
                                    value={secondContent}
                                    onChange={(event, newValue) => setSecondContent(newValue)}
                                />
                              
                                <AutocompleteComponent
                                    options={options}
                                    value={thirdContent}
                                    onChange={(event, newValue) => setThirdContent(newValue)}
                                    open={openDropdown}
                                    onOpen={() => setOpenDropdown(true)}
                                    onClose={() => setOpenDropdown(false)}
                                    placeholder="Type or select a variable"
                                   
                                    endAdornment={
                                        <ButtonComponent label='Variables' onClick={() => setOpen(!openDropdown)} customBtn='variable_btn' />

                                    }
                                   

                                />
                              

                                {index > 0 && (
                                    <ButtonComponent label='Delete' onClick={() => deleteCondition(condition.id)} customBtn='condition_delete_btn' />
                                    
                                )}
                            </div>
                        ))}

                        {conditions.length === 1 && (

                          
                            <ButtonComponent label='+Add' onClick={addCondition} customBtn='keyword__add__btn' />
                        )}
                    </div>
                 
              </>
              </BaseModal>
    );
};
export default ConditionModal;