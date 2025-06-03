import React, { useState } from 'react'
import { Chip } from '@mui/material';
import { Modal } from 'react-bootstrap';
import AutocompleteComponent from '../../../AutocompleteComponent';
import BaseModal from './BaseModal';

const initialOptions = ['Thameem Hameed', 'Bot', 'EV zone', 'juliet _1'];

const AssignToUserModal = ({ show, onClose, onSave }) => {

    const [selectedTag, setSelectedTag] = useState(null);
    const [options, setOptions] = useState(initialOptions);

    const handleTagChange = (event, newValue) => {
        if (newValue) {

            setSelectedTag(newValue);
        }
    };

    return (
   
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Assign To User">
            <AutocompleteComponent
                options={options.filter(option => option !== selectedTag)}
                value={selectedTag}
                onChange={handleTagChange}
                placeholder="Select"
            />
            {selectedTag && (
                <Chip
                    key={selectedTag}
                    label={selectedTag}
                    onDelete={() => setSelectedTag(null)}
                    style={{ marginTop: '15px' }}
                />
            )}
        </BaseModal>
    );
};
export default AssignToUserModal;