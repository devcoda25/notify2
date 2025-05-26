import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Autocomplete, TextField, Switch, Chip } from '@mui/material';
import { Button, Modal, ModalBody } from 'react-bootstrap';

const initialOptions = ['Driver Concerns', 'Emergency-Urgent-help-needed', 'General Enquiry', 'Investor customers'];

const SetTagsModal = ({ show, onClose, onSave }) => {
  
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
        <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
            <div className='chatbot_question_content'>
                <Modal.Header className='edit_text_material_header' closeButton>
                    <Modal.Title className='edit_text_style'>Set Tags</Modal.Title>
                </Modal.Header>
                <Modal.Body className='edittext__body__content'>
                    <div className='question_text_content'>
                        {selectedTags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                onDelete={() => handleTagDelete(tag)}
                                variant="outlined"
                                style={{ marginBottom: '15px' }}
                            />
                        ))}

                        <Autocomplete
                            options={options}
                            disableClearable
                            onChange={handleTagChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder="Select Tags"
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                        sx: {
                                            border: '1px solid rgb(232, 234, 242)',
                                            borderRadius: '4px',
                                            height: '3rem',
                                            paddingLeft: '10px',
                                            backgroundColor: 'rgb(245, 246, 250)',
                                            '&:hover': {
                                                border: '1px solid green',
                                            },
                                            '&.Mui-focused': {
                                                border: '1px solid green',
                                                backgroundColor: 'white',
                                                outline: 'none',
                                            },
                                        },
                                    }}

                                />
                            )}

                        />


                    </div>

                    <div className='edit__text__save'>
                        <button className='footer__cancel__btn' onClick={onClose}>Cancel</button>
                        <button className='btn btn-success condition__save' onClick={onSave} >Save</button>
                    </div>
                </Modal.Body>
            </div>
        </Modal>
    );
};
export default SetTagsModal;