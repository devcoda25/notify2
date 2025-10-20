import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ButtonComponent from '../../../ButtonComponent';
import ToggleSwitch from '../../../ToggleSwitch';
import WorkingHoursRow from './WorkingHoursRow';

const WorkingHoursSettings = ({ show, handleClose }) => {
    const [isHolidayMode, setIsHolidayMode] = useState(false);
    const [openStates, setOpenStates] = useState({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
    });



    const handleToggle = () => {
        setIsHolidayMode(!isHolidayMode);
    };

    const toggleDayOpen = (day) => {
        setOpenStates(prev => ({ ...prev, [day]: !prev[day] }));
    };


    const handleSave = () => {

        handleClose();
    };

    return (

        <Modal show={show} onHide={handleClose} dialogClassName="modal-custom">
            <Modal.Header className="modal-header" closeButton>
                <Modal.Title className="modal-title">Working Hours Setting</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-content">
                <div className="body-sub-content">
                    <div className="holiday-mode-text">Holiday Mode</div>
                    <ToggleSwitch leftLabel='On' rightLabel='Off' onToggle={handleToggle} isActive={isHolidayMode} />

                    {isHolidayMode && (<div className='holidaymode__text'>  (Holiday mode is on: Users will be replied with out of office hour reply.) </div>)}
                </div>
                <div className="body-sub-text">Working hours in Customer time zone (GMT +3)</div>


                {Object.keys(openStates).map(day => (
                    <WorkingHoursRow
                        key={day}
                        day={day}
                        isOpen={openStates[day]}
                        handleToggle={() => toggleDayOpen(day)}


                    />
                ))}
            </Modal.Body>
            <div className='modal-action'>
                <ButtonComponent label='Save and close' onClick={handleSave} />
            </div>
        </Modal>

    );
};

export default WorkingHoursSettings;

