import React,{useState} from "react";
import { Chip } from '@mui/material';
import { Modal } from 'react-bootstrap';
import AutocompleteComponent from '../../../AutocompleteComponent';
import BaseModal from "./BaseModal";

const initialOptions = ['EV_Zone_everyone', 'Call_center_Kampala', 'Driver_Liaison_officers', 'Ride_Agents_officers', 'Corporate_Liaison_officers'];

const AssignToTeamModal = ({ show, onClose, onSave }) => {

    const [selectedTags, setSelectedTags] = useState([]);
    const [options, setOptions] = useState(initialOptions);

    const handleTagDelete = (tagToDelete) => {
        setSelectedTags((prev) => prev.filter(tag => tag !== tagToDelete));
        setOptions((prev) => [...prev, tagToDelete]);
    };

    const handleTagChange = (event, newValue) => {
        if (newValue && !selectedTags.includes(newValue)) {
            setSelectedTags((prev) => [...prev, newValue]);
            setOptions((prev) => prev.filter(option => option !== newValue));
        }
    };

    return (
      
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Assign To Team">
        <AutocompleteComponent
          options={options}
          value={selectedTags}
          onChange={handleTagChange}
          placeholder="Select"
        />
        {selectedTags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleTagDelete(tag)}
            style={{ marginTop: '15px' }}
          />
        ))}
      </BaseModal>
    );
};
export default AssignToTeamModal;