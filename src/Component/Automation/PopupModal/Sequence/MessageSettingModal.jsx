import React,{useState} from "react";
import { Modal, ModalBody } from 'react-bootstrap';
import AutocompleteComponent from "../../../AutocompleteComponent";
import ButtonComponent from "../../../ButtonComponent";
import TimePickerComponent from "../../../TimePickerComponent";
import TextfieldComponent from '../../../TextfieldComponent';
import style from '../../../MuiStyles/muiStyle';
import Dropdown from '../../../Dropdown';
import {Autocomplete, TextField, Checkbox, Chip} from '@mui/material';

const StickerOptions = [
    { value: "01_Cuppy_smile.webp", label: "01_Cuppy_smile.webp" },
    { value: "02_Cuppy_lol.webp", label: "02_Cuppy_lol.webp" },
    { value: "03_Cuppy_rofl.webp", label: "03_Cuppy_rofl.webp" }
];

const TextOptions = [
    { value: "Offline_mess", label: "Offline_mess" },
    { value: "confirmed order", label: "confirmed order" },
    { value: "Rating", label: "Rating" }
];
const TemplateOptions = [
    { value: "wake_up", label: "wake_up" },
    { value: "emergency_update", label: "emergency_update" },
    { value: "welcomenote", label: "welcomenote" }
];
const ImageOptions = [
    { value: "Catalog.jpeg", label: "Catalog.jpeg" },
];
const groupedOptions = [
    { label: "Sticker", options: StickerOptions },
    { label: "Text", options: TextOptions },
    { label: "Template", options: TemplateOptions },
    { label: "Image", options: ImageOptions },
];
const selectTimeOptions = ['days', 'hours', 'minutes'];
const timeOptions = ['Any time', 'send between'];
const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MessageSettingModal = ({ show, onClose, onSave, initialData }) => {

    const [state, setState] = useState({
        content: initialData?.content || '',
        data: initialData?.data || selectTimeOptions[0],
        timeCount: initialData?.timeCount || '',
        timeData: initialData?.timeData || timeOptions[0],
        fromTime: initialData?.fromTime || '',
        toTime: initialData?.toTime || '',
        selectedDays: initialData?.selectedDays || []
    });
    const updateState = (newState) => {
        setState((prevState) => ({
            ...prevState,
            ...newState
        }));
    };

    const handleSelect = (event, newValue) => {
        updateState({ selectedDays: newValue });
    };

    // Handle removing a chip
    const handleDelete = (dayToDelete) => {
        updateState({
            selectedDays: state.selectedDays.filter((day) => day !== dayToDelete)
        });
    };

    const handleSave = () => {
        const savedValues = {
            content: state.content,
            timeCount: state.timeCount,
            data: state.data,
            timeData: state.timeData,
            fromTime: state.fromTime,
            toTime: state.toTime,
            selectedDays: state.selectedDays
        };
        onSave(savedValues);
    };
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="chatbot_condition_modal">
                <div className='chatbot_question_content'>
                    <Modal.Header className='edit_text_material_header' closeButton>
                        <Modal.Title className='edit_text_style'>Message Settings</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='edittext__body__content'>
                        <div>
                            <Dropdown options={groupedOptions} selectLabel='Select Action' />
                        </div>

                        <div className='time_message_settings_container'>
                            <div className='edit__text__label'>This message will be sent atleast</div>
                            <div className='messagesettings_timedelay'>
                                <TextfieldComponent type='number' value={state.timeCount} onChange={(e) => updateState({ timeCount: e.target.value })} customStyle='custom_textfield' />
                                <AutocompleteComponent
                                    options={selectTimeOptions}
                                    value={state.data}
                                    onChange={(e, newValue) => updateState({ data: newValue })}
                                    customStyles={{ ...style.automationAutoComplete, width: '190px' }}
                                />

                            </div>
                        </div>
                        <div className='time_message_settings_container'>
                            <AutocompleteComponent
                                options={timeOptions}
                                value={state.timeData}
                                onChange={(e, newValue) => updateState({ timeData: newValue })}
                                customStyles={{ ...style.automationAutoComplete }}
                            />

                            {state.timeData === 'send between' && (
                                <div className='msg_sendtime_between'>
                                    <div className='msg_sendtime_container'>
                                        <span className='msg_sendtime_container_title'>From</span>

                                        <TimePickerComponent initialValue={state.fromTime} placeholder='00:00' onChange={(newValue) => updateState({ fromTime: newValue })} />
                                    </div>
                                    <div className='msg_sendtime_container'>
                                        <span className='msg_sendtime_container_title'>to</span>
                                        <TimePickerComponent initialValue={state.toTime} placeholder='00:00' onChange={(newValue) => updateState({ toTime: newValue })} />

                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='time_message_settings_container'>
                            <div className='edit__text__label'>Days</div>
                            <div className='messagesettings_timedelay'>
                                <Autocomplete
                                    multiple
                                    placeholder='All days'
                                    options={daysOptions}
                                    value={state.selectedDays}
                                    disableClearable
                                    onChange={handleSelect}
                                    getOptionLabel={(option) => option}
                                    isOptionEqualToValue={(option, value) => option === value}

                                    renderTags={(selected) =>
                                        selected.length > 0 ? <span>{selected[0]}</span> : null
                                    }

                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                checked={selected}
                                                sx={{ marginRight: 1 }}
                                            />
                                            {option}
                                        </li>
                                    )}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            placeholder=''
                                            InputProps={{
                                                ...params.InputProps,
                                                disableUnderline: true,
                                                sx: {
                                                    ...style.automationAutoComplete,
                                                    width: '190px',
                                                },
                                            }}

                                        />
                                    )}

                                />


                            </div>
                            <div className='message_settings_chip'>
                                {state.selectedDays.map((day) => (
                                    <Chip
                                        key={day}
                                        label={day}
                                        variant="outlined"
                                        onDelete={() => handleDelete(day)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='edit__text__save'>
                            <ButtonComponent label='Save' onClick={handleSave} />
                        </div>
                    </Modal.Body>
                </div>
            </Modal>
        </>
    )
}
export default MessageSettingModal;