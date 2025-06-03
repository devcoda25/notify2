import React,{useState} from "react";
import AutocompleteComponent from "../../../AutocompleteComponent";
import BaseModal from "./BaseModal";

const options = ['Open', 'Pending', 'Solved', 'Spam & Block']
const UpdateChatModal = ({ show, onClose, onSave }) => {
    
    const [content, setContent] = useState('');
    const filteredOptions = options.filter(option => option !== content);
    return (
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Update Chat Status" >
            <AutocompleteComponent 
              options={filteredOptions}
              value={content}
              onChange={(event, newValue) => setContent(newValue)}
              placeholder='Select'
            />
        </BaseModal>
      
    );
};
export default UpdateChatModal;
