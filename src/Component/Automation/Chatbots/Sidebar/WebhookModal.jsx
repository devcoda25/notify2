import React, { useState } from "react";
import BaseModal from "./BaseModal";
import VariablesDropdown from "./VariablesDropdown";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import ToggleSwitch from "../../../ToggleSwitch";
import { DeleteOutlineIcon } from "../../../Icon";
import style from "../../../MuiStyles/muiStyle";



const variables = [
    { title: "first_incoming_message", value: "@first_incoming_message" },

];
const contactAttributes = [
    { title: "actual_fare", value: '{{actual_fare}}' },
    { title: 'actuall_estimate', value: '{{actuall_estimate}}' },
    { title: 'additional_items', value: '{{additional_items}}' }
]
const urlOptions = ['GET', 'POST'];
const options = ['Variable', 'Custom Attribute']

const WebhookModal = ({ show, onClose, onSave }) => {

    const [urlContent, setUrlContent] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [customizeHeaderValue, setCustomizeHeaderValue] = useState('')
    const [requestValue, setRequestValue] = useState('')
    const [responseValue, setResponseValue] = useState('');
    const [content, setContent] = useState('');
    const [isHeaderVariables, setIsHeaderVariables] = useState(false);
    const [isCustomizeHeaderVariables, setIsCustomizeHeaderVariables] = useState(false);
    const [isRequestVariables, setIsRequestVariables] = useState(false);
    const [isResponseVariables, setIsResponseVariables] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isActive, setIsActive] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
  
    const toggleHeaderVariablesDropdown = () => {
        setIsHeaderVariables((prev) => !prev);
    }
    const toggleCustomizeVariablesDropdown = () => {
        setIsCustomizeHeaderVariables((prev) => !prev);
    }
    const toggleRequestVariablesDropdown = () => {
        setIsRequestVariables((prev) => !prev);
    }
    const toggleResponseVariablesDropdown = () => {
        setIsResponseVariables((prev) => !prev);
    }
    const handleHeaderVariableClick = (variable) => {
        setInputValue(prev => prev + variable.value);
        setIsHeaderVariables(false);
    };
    const handleCustomizeVariableClick = (variable) => {
        setCustomizeHeaderValue(prev => prev + variable.value);
        setIsCustomizeHeaderVariables(false);
    }
    const handleRequestVariableClick = (variable) => {
        setRequestValue(prev => prev + variable.value);
        setIsRequestVariables(false);
    }
    const handleResponseVariableClick = (variable) => {
        setResponseValue(prev => prev + variable.value);
        setIsResponseVariables(false);
    }

  
    const handleToggle = () => {
        setIsActive(!isActive);
    }

    const [isRequestActive, setIsRequestActive] = useState(false);
    const handleToggleRequest = () => {
        setIsRequestActive(!isRequestActive)
    }
    const [isResponseActive, setIsResponseActive] = useState(false);
    const handleToggleResponse = () => {
        setIsResponseActive(!isResponseActive)
    }
    const [isRoutingActive, setIsRoutingActive] = useState(false);
    const handleToggleRouting = () => {
        setIsRoutingActive(!isRoutingActive)
    }

    const [headers, setHeaders] = useState([{ id: Date.now() }]);
    const addHeader = () => {
        setHeaders([...headers, { id: Date.now() }]);
    };

    const deleteHeader = (id) => {
        setHeaders(headers.filter(header => header.id !== id));
    };
    const [request, setRequest] = useState([{ id: Date.now() }]);
    const addTestRequest = () => {
        setRequest([...request, { id: Date.now() }]);
    };

    const deleteTestRequest = (id) => {
        setRequest(request.filter(req => req.id !== id));
    };
    const [response, setResponse] = useState([{ id: Date.now() }]);
    const addTestResponse = () => {
        setResponse([...response, { id: Date.now() }]);
    };

    const deleteTestResponse = (id) => {
        setResponse(response.filter(req => req.id !== id));
    };

    const [routing, setRouting] = useState([{ id: Date.now() }]);
    const addTestRouting = () => {
        setRouting([...routing, { id: Date.now() }]);
    };

    const deleteTestRouting = (id) => {
        setRouting(routing.filter(req => req.id !== id));
    };

    return (

        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Webhook">

            <div className='question_text_content'>
                <div className='edit__text__label'>Url & Method</div>
                <div className='url_set_container'>
                    <div className='url_set_left'>
                        <div className='url_set_method'>
                            <AutocompleteComponent
                                options={urlOptions}
                                value={urlContent}
                                onChange={(event, newValue) => setUrlContent(newValue)}
                            />
                           
                        </div>
                        <TextfieldComponent type='text' value={`http ${inputValue}`}
                            onChange={(e) => setInputValue(e.target.value)} customStyle='url_input_box'/>
                       
                    </div>
                    <div className='url_set_variable'>
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

            </div>
            <div className='question_text_container'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Customize Headers</div>

                    <ToggleSwitch leftLabel='Optional' isActive={isActive} onToggle={handleToggle} />
                </div>
                <div className='webhook_customize_text'>Add headers to your request (example: Content-Type: application/json)</div>
                <div className='customize_sub_text'>(User-Agent is not sent as a header by default. make sure you include it if necessary.)</div>
                {
                    isActive && (
                        <div>
                            <div className='edit__text__label'>Edit Headers</div>
                            {headers.map((header) => (
                                <>
                                    <div key={header.id} className='set_header_and_value'>
                                        <div className='set_header_value_field'>
                                            <div className='header_value_label'>Key</div>
                                            <TextfieldComponent type="text" placeholder='Content-Type' />
                                        
                                        </div>
                                        <div className='set_header_value_field'>
                                            <div className='header_value_label'>Value</div>
                                            <TextfieldComponent type="text"
                                                placeholder='application/json'
                                                value={customizeHeaderValue}
                                                onChange={(e) => setCustomizeHeaderValue(e.target.value)}
                                            />
                                           
                                            <ButtonComponent label='Variables' onClick={toggleCustomizeVariablesDropdown} />
                                          
                                        </div>

                                        <button type="button" className='customize_header_delete' onClick={() => deleteHeader(header.id)}><DeleteOutlineIcon sx={style.deleteIconHover}/></button>
                                    </div>
                                    {isCustomizeHeaderVariables && (
                                     
                                        <VariablesDropdown
                                            variables={variables}
                                            contactAttributes={contactAttributes}
                                            searchTerm={searchTerm}
                                            handleSearchChange={handleSearchChange}
                                            handleHeaderVariableClick={handleCustomizeVariableClick}
                                        />
                                    )}
                                </>
                            ))}
                            <ButtonComponent label='Add Header' onClick={addHeader} customBtn='keyword__add__btn' />
                          
                        </div>

                    )
                }



            </div>
            <div className='question_text_container'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Test Your Request</div>


                    <ToggleSwitch leftLabel='Optional' isActive={isRequestActive} onToggle={handleToggleRequest} />
                </div>
                <div className='webhook_customize_text'>Manually set values for test variables</div>
                <div className='customize_sub_text'>(If your request contains variables, you can manually set their values for testing purposes.)</div>
                <button className='btn btn-success'>Test the Request</button>
                {
                    isRequestActive && (
                        <div>
                            <div className='edit__text__label'>Edit Test Variables</div>
                            {request.map((req) => (
                                <>
                                    <div key={req.id} className='set_header_and_value'>
                                        <div className='set_header_value_field'>
                                            <div className='header_value_label'>Variable Name</div>
                                            <TextfieldComponent type="text" placeholder='Search Variables' value={requestValue} onChange={(e) => setRequestValue(e.target.value)} />
                                      
                                        </div>
                                        <div className='set_header_value_field'>
                                            <div className='header_value_label'>Test Value</div>
                                            <TextfieldComponent type='text' placeholder='application/json' />
                                           

                                        </div>

                                        <button type="button" className='customize_header_delete' onClick={() => deleteTestRequest(req.id)}>
                                           <DeleteOutlineIcon sx={style.deleteIconHover}/>
                                            </button>

                                    </div>
                                    <div>
                                        <ButtonComponent label='Variables' onClick={toggleRequestVariablesDropdown} />
                                     
                                    </div>
                                    {isRequestVariables && (
                                        <VariablesDropdown
                                            variables={variables}
                                            contactAttributes={contactAttributes}
                                            searchTerm={searchTerm}
                                            handleSearchChange={handleSearchChange}
                                            handleHeaderVariableClick={handleRequestVariableClick}
                                        />
                                       

                                    )}
                                </>
                            ))}
                            <div className='test_variables_add'>
                                <ButtonComponent label='Add Test Variables' onClick={addTestRequest} customBtn='keyword__add__btn' />
                               
                            </div>
                        </div>

                    )
                }



            </div>
            <div className='question_text_container'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Save Responses as Variables</div>
                    <ToggleSwitch leftLabel='Optional' isActive={isResponseActive} onToggle={handleToggleResponse} />
                   
                </div>
                {
                    isResponseActive &&
                    <>
                        <div className='customize_sub_text'><b>Select from the dropdown below</b> to save a specific part of the response as a variable (you must test the request first).</div>
                        <div className='customize_sub_text'>  Useful for displaying dynamic data from external sources as buttons or messages.</div>
                        <div className='edit__text__label'>Edit Response Variables</div>
                        <AutocompleteComponent
                            options={options}
                            value={content}
                            onChange={(event, newValue) => setContent(newValue)}
                            placeholder='Input value & Please enter to search' />
                      
                        {response.map((res) => (
                            <>
                                <div key={res.id} className='set_header_and_value'>
                                    <div className='set_header_value_field'>
                                        <div className='header_value_label'>Variable Name</div>
                                        <TextfieldComponent type="text" placeholder='Type value or select' value={responseValue}
                                            onChange={(e) => setResponseValue(e.target.value)} />
                                       
                                    </div>
                                    <div className='set_header_value_field'>
                                        <div className='header_value_label'>Entire Response Body</div>
                                        <TextfieldComponent type="text" />
                                      

                                    </div>

                                    <button type="button" className='customize_header_delete' onClick={() => deleteTestResponse(res.id)} >
                                      <DeleteOutlineIcon/>
                                        </button>

                                </div>
                                <div>
                                    <ButtonComponent label='Variables' onClick={toggleResponseVariablesDropdown} />
                                 
                                </div>
                                {isResponseVariables && (
                                    <VariablesDropdown
                                        variables={variables}
                                        contactAttributes={contactAttributes}
                                        searchTerm={searchTerm}
                                        handleSearchChange={handleSearchChange}
                                        handleHeaderVariableClick={handleResponseVariableClick}
                                    />
                                 
                                )}
                            </>
                        ))}
                        <div className='test_variables_add'>
                            <ButtonComponent label='Add Response Variables' onClick={addTestResponse} customBtn='keyword__add__btn' />
                           
                        </div>

                    </>
                }
            </div>
            <div className='question_text_container'>
                <div className='question_accept_container media_header_text'>
                    <div className='edit__text__label'>Response Routing</div>
                    <ToggleSwitch leftLabel='Optional' isActive={isRoutingActive} onToggle={handleToggleRouting} />
                   
                </div>
                <div className='webhook_customize_text'>Split your chatbot based on response status codes (200, 400, 500, etc).</div>
                {
                    isRoutingActive &&

                    <>
                        <div>
                            <div class="edit__text__label">Expected Status</div>
                            {routing.map((data) => (
                                <div key={data.id}>
                                    <TextfieldComponent type="text" placeholder="200" />
                                
                                    <button class="list_row_delete"   onClick={() => deleteTestRouting(data.id)}>
                                       <DeleteOutlineIcon sx={style.deleteIconHover}/>
                                    </button>
                                </div>
                            ))}

                        </div>
                        <div className='test_variables_add'>
                            <ButtonComponent label='Add Expected Status' onClick={addTestRouting} customBtn='keyword__add__btn' />

                        </div>
                    </>

                }

            </div>



        </BaseModal>
    );
};
export default WebhookModal;