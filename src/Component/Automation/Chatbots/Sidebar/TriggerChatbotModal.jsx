import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import AutocompleteComponent from '../../../AutocompleteComponent';
import BaseModal from './BaseModal';

const options = ['ratings', 'cancel_order', 'reschdule_order', 'dispatch', 'payment_process']

const TriggerChatbotModal = ({ show, onClose, onSave }) => {
    const [content, setContent] = useState('');
    const filteredOptions = options.filter(option => option !== content);
    return (
      
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Trigger Chatbot">
        <AutocompleteComponent
          options={filteredOptions}
          value={content}
          onChange={(event, newValue) => setContent(newValue)}
          placeholder='Select'
        />
        </BaseModal>
    );
};
export default TriggerChatbotModal;