import React from "react";
import SearchboxComponent from "../../../SearchboxComponent";

const VariablesDropdown = ({
  variables,
  contactAttributes,
  searchTerm,
  handleSearchChange,
  handleHeaderVariableClick,
}) => {

  const filteredVariables = variables.filter(variable =>
    variable.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filterContactAttributes = contactAttributes.filter(contact =>
    contact.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="varibles_drop_container" aria-label="Dropdown" style={{ right: '-10px', left: 'auto' }}>
      <div className="variables_search_bar">
        <div>
        
          <SearchboxComponent 
          placeholder="Search variables"
          value={searchTerm}
          onChange={handleSearchChange}
          customSearch='chatbotcustomsearch'/>
        </div>
      </div>
      <div className="varibles_drop_content">
        <div className="varibles_drop_list">
          <div className="varibles_drop_list_header">Chatbot Input Variables</div>
          {filteredVariables.map((variable, index) => (
            <div
              key={index}
              className="varibles_drop_list_item"
              aria-hidden="true"
              onClick={() => handleHeaderVariableClick(variable)}
            >
              <span className="variable_list_item_title">{variable.title}</span>
              <span className="variable_list_item_value">{variable.value}</span>
            </div>
          ))}
        </div>
        <div className="varibles_drop_list">
          <div className="varibles_drop_list_header">Contact Attributes</div>
          {filterContactAttributes.map((contact, index) => (
            <div
              key={index}
              className="varibles_drop_list_item"
              aria-hidden="true"
              onClick={() => handleHeaderVariableClick(contact)}
            >
              <span className="variable_list_item_title">{contact.title}</span>
              <span className="variable_list_item_value">{contact.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariablesDropdown;
