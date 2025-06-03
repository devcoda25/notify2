import React, { useState } from "react";
import TextfieldComponent from "../../../TextfieldComponent";
import BaseModal from "./BaseModal";

const SetTimeDelayModal = ({ show, onClose, onSave }) => {

    return (
        <BaseModal show={show} onClose={onClose} onSave={onSave} title="Set Time Delay">
            <div className='edit__text__label'>Set a delay from 0:00 to 180:00 minutes</div>
            <div className='time_delay_container'>
                <TextfieldComponent type='number' />
                <span>min</span>
                <TextfieldComponent type='number' />
                <span>sec</span>
            </div>
        </BaseModal>
    );
};
export default SetTimeDelayModal;


