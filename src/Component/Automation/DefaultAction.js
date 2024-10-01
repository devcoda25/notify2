import React, { useState } from 'react'
import { Grid } from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import Workinghourssettings from './PopupModal/Workinghourssettings';

const stickers = [
    '01_Cuppy_smile.webp',
    '02_Cuppy_lol.webp',
    '03_Cuppy_rofl.webp',
    '04_Cuppy_sad.webp',
    '05_Cuppy_cry.webp',
    '06_Cuppy_love.webp',
    '07_Cuppy_hate.webp',
    '08_Cuppy_lovewithmug.webp',
    '09_Cuppy_lovewithcookie.webp',
    '10_Cuppy_hmm.webp',
    '11_Cuppy_upset.webp',
    '12_Cuppy_angry.webp',
    '13_Cuppy_curious.webp',
    '14_Cuppy_weird.webp',
    '15_Cuppy_bluescreen.webp',
    '16_Cuppy_angry.webp',
    '17_Cuppy_tired.webp',
    '18_Cuppy_workhard.webp',
    '19_Cuppy_shine.webp',
    '20_Cuppy_disgusting.webp',
    '21_Cuppy_hi.webp',
    '22_Cuppy_bye.webp',
    '23_Cuppy_greentea.webp',
    '24_Cuppy_phone.webp',
    '25_Cuppy_battery.webp'


]
const sequence = [
    'normal',
    'incomplete',
    'test',
    'finish'
]
const chatbot = [
    'Other_Options',
    'Fleet_ownership',
    'Chargepoint owner ship',
    'Become a driver',
    'Charging',
    'Investors',
    'Agent enrollment',
    'Charge point operator',
    'Book_for_someone_a_ride_now',
    'deliver_a_parcel_now',
    'Recieve_parcel(food)',
    'EV Market',
    'Sell_EV_market',
    'Buy_EV_Market',
    'soon_to_be_closed',
    'rides-flow',
    'payment_process',
    'dispatch',
    'reschedule_order',
    'cancel_order',
    'ratings',
    'Catalog'
]
const text = [
    'Offline_message',
    'confirmed order',
    'Rating',
]
const Template = [
    'wake_up',
    'emergency_update',
    'welcomenote',
    'intro_welcome',
    'introduction_new',
    'intro_tunes',
    'welcome_text',
    'sell_ev_market',
    'buy_ev_market',
    'agent_signup',
    'become_a_driver',
    'charge_point_owner',
    'agent_register',
    'charging_point',
    'investor_sign_up',
    'charge_point_operator',
    'operator',
    'waiting_delivery_now',
    'waiting_for_ride_now_now',
    'schedule_a_ride_for_someone',
    'book_a_delivery_later',
    'delivery_for_a_friend',
    'safety_policy',
    'meet_driver',
    'driver_app',
    'drive_cancelled',
    'speak_to_us_driver',
    'become_fleet_owner',
    'callcenter_agent',
    'call_apply',
    'contact_us',
    'contact_details',
    'confirming_delivery',
    'deliver_booking_confirmed',
    'driver_delivery_details',
    'start_delivery',
    'customer_delivery_info',
    'to_who',
    'trip_started',
    'pay_failed',
    'to_airport_for_me_today',
    'to_airport_for_me_later',
    'to_airport_for_someone_later',
    'from_airport_for_me_today',
    'from_airport_for_me_later',
    'from_airport_for_someone_today',
    'from_airport_for_someone_later',
    'rides_me_today',
    'rides_me_later',
    'rides_someone_today',
    'rides_someone_later',
    'add_charge_point',
    'plan_my_trip',
    'locate_charge_point_now',
    'charge_point_installation',
    'charge_point_testing',
    'locate_charge_point_1',
    'add_charge_point_2',
    'plan_my_trip_3',
    'no_driver_one',
    'pay_now_final_1',
    '2_hour_to_ride_2',
    '30_minutes_reminder_to_ride_2',
    '2_hours_pdw_ambulance_reminder_2',
    '24_hours_pwd_ambulance_reminder_2',
    '30_minutes_pwd_ambulance_reminder_2',
    '24_hours_ride_reminder_3',
    'driver_pick_up_2',
    'time_for_charging_3',
    'charge_session_4',
    'ride_4_someone_9',
    'driver_and_vehicle_details_13',
    'charging_complete',
    '15_minutes_to_complete_charging_4',
    '5_minutes_to_complete_charging_4',
    'cancelled_order_later_1',
    'booking_fee_successful_5',
    'payment_progress_final_4',
    'mobile_operator_details_3',
    'installation_testing_confirmed_5',
    'no_mobile_operator_3',
    'operator_at_location_3',
    'time_for_charging_4',
    'installation_testing_complete_3',
    'payment_success_1',
    'payment_failed_1',
    'payment_progress_7',
    'payment_failed_2',
    'payment_success_2',
    'ride_for_someone_10',
    'from_airport_ride_for_me_11',
    'from_airport_ride_someone_12',
    'pwd_for_somone_14',
    'pwd_rides_me_11',
    'to_airport_ride_me_11',
    'to_airport_ride_someone_12',
    'car_rental_4_me_14',
    'car_rental_someone_11',
    'ambulance_ride_for_me_13',
    'ambulance_ride_for_someone_10',
    '1_day_reminder_mobile_someone_4',
    '1_day_reminder_mobile_me_3',
    '1_day_reminder_fixed_some_one_2',
    '1_day_reminder_fixed_me_3',
    '1_hour_to_fixed_charge_some_one_4',
    '1_hour_to_fixed_charge_me_3',
    '2_hours_reminder_fixed_for_someone_3',
    '2_hours_reminder_fixed_me_3',
    '2_hours_reminder_mobile_3',
    '2_hours_reminder_mobile_someone_3',
    'fixed_charge_for_someone_3',
    'fixed_charge_for_me_3',
    'mobile_charge_for_someone_4',
    'mobile_charge_for_me_3',
    'order_rescheduled_by_customer_4',
    'order_cancelled_by_customer_7',
    'rescheduled_fixed_charging_for_me_6',
    'rescheduled_fixed_charging_for_someone_4',
    'rescheduled_mobile_charging_someone_5',
    'rescheduled_mobile_charging_for_me_6',
    'installer_extra_costs_1',
    'ride_for_me_14',
    '1_hour_to_mobile_charging_operator_details_4',
    'add_multi_stop_2',
    'multi_stop_update_4',
    'deleted_stop_update_4',
    'ambulance_ride_now',
    'ambulance_ride_later',
    'pwd_ride_now',
    'pwd_ride_later',
    'dfdf',
    'fdadfa',


]

const CheckboxComponent = ({ checklabel, onToggle }) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        onToggle(newCheckedState);

    };


    return (
        <>
            <div
                className={`${isChecked ? 'checkbox-checked' : 'checkbox-unchecked'}`}

                role="checkbox"
                onClick={handleToggle}

            >
                <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    height="1em"
                    width="1em"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <div className='check-label'>{checklabel}</div>

        </>
    )
}
const DropdownComponent = ({ selectedtextlabel, isEnabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selectedtextlabel);
    const [isStickerOpen, setStickerOpen] = useState(false);
    const [isSequenceOpen, setSequenceOpen] = useState(false);
    const [isChatbotOpen, setChatbotOpen] = useState(false);
    const [isTextOpen, setTextOpen] = useState(false);
    const [isTemplateOpen, setTemplateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = () => {
        if (isEnabled) {
            setIsOpen(!isOpen);
        }

    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsOpen(false);
    };
    const handleInputClick = (event) => {

        event.stopPropagation();
    };



    const handleStickers = () => {
        setStickerOpen(!isStickerOpen);
    };
    const handleSequence = () => {
        setSequenceOpen(!isSequenceOpen);
    };
    const handleChatbot = () => {
        setChatbotOpen(!isChatbotOpen);
    };
    const handleText = () => {
        setTextOpen(!isTextOpen);
    };
    const handleTemplate = () => {
        setTemplateOpen(!isTemplateOpen);
    };

    const filteredStickers = stickers.filter((sticker) =>
        sticker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSequence = sequence.filter((seq) =>
        seq.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filterChatbot = chatbot.filter((chatbot) =>
        chatbot.toLowerCase().includes(searchTerm.toLowerCase()));

    const filterText = text.filter((text) => text.toLowerCase().includes(searchTerm.toLowerCase()));
    const filerTemplate = Template.filter((template) => template.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
        <>

            <div className="select-container">
                {/* <div
        className={`select-box ${isOpen ? "active" : ""}`}
        
      > */}
                <div className={`select-box ${isOpen ? 'active' : ''} ${!isEnabled ? 'disabled' : ''}`} style={{ opacity: isEnabled ? 1 : 0.5 }}>

                    <div className="select-content" onClick={toggleDropdown}>
                        {isOpen ? (
                            <div className="dropdown-active">
                                <svg
                                    className='search-img'
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2.76311 11.4842L3.37159 11.3415L2.76311 11.4842ZM2.76311 6.93667L3.37159 7.0794L2.76311 6.93667ZM15.6578 6.93667L16.2663 6.79394L15.6578 6.93667ZM15.6578 11.4842L16.2663 11.6269L15.6578 11.4842ZM11.4842 15.6578L11.3415 15.0493L11.4842 15.6578ZM6.93667 15.6578L6.79394 16.2663L6.93667 15.6578ZM6.93667 2.76311L6.79394 2.15462L6.93667 2.76311ZM11.4842 2.76311L11.6269 2.15462L11.4842 2.76311ZM17.0581 17.9419C17.3021 18.186 17.6979 18.186 17.9419 17.9419C18.186 17.6979 18.186 17.3021 17.9419 17.0581L17.0581 17.9419ZM3.37159 11.3415C3.0428 9.93981 3.0428 8.48107 3.37159 7.0794L2.15462 6.79393C1.78179 8.38337 1.78179 10.0375 2.15462 11.6269L3.37159 11.3415ZM15.0493 7.0794C15.3781 8.48107 15.3781 9.93981 15.0493 11.3415L16.2663 11.6269C16.6391 10.0375 16.6391 8.38337 16.2663 6.79394L15.0493 7.0794ZM11.3415 15.0493C9.93981 15.3781 8.48107 15.3781 7.0794 15.0493L6.79394 16.2663C8.38337 16.6391 10.0375 16.6391 11.6269 16.2663L11.3415 15.0493ZM7.0794 3.37159C8.48107 3.0428 9.93981 3.0428 11.3415 3.37159L11.6269 2.15462C10.0375 1.78179 8.38337 1.78179 6.79394 2.15462L7.0794 3.37159ZM7.0794 15.0493C5.23964 14.6177 3.80314 13.1812 3.37159 11.3415L2.15462 11.6269C2.69459 13.9289 4.49198 15.7263 6.79394 16.2663L7.0794 15.0493ZM11.6269 16.2663C13.9289 15.7263 15.7263 13.9289 16.2663 11.6269L15.0493 11.3415C14.6177 13.1812 13.1812 14.6177 11.3415 15.0493L11.6269 16.2663ZM11.3415 3.37159C13.1812 3.80314 14.6177 5.23964 15.0493 7.0794L16.2663 6.79394C15.7263 4.49198 13.9289 2.69459 11.6269 2.15462L11.3415 3.37159ZM6.79394 2.15462C4.49198 2.69459 2.69459 4.49198 2.15462 6.79393L3.37159 7.0794C3.80314 5.23964 5.23964 3.80314 7.0794 3.37159L6.79394 2.15462ZM14.004 14.8879L17.0581 17.9419L17.9419 17.0581L14.8879 14.004L14.004 14.8879Z"
                                        fill="#9F9F9F"
                                    ></path>
                                </svg>
                                <input className='search-text' placeholder="Search..." onClick={handleInputClick}
                                    value={searchTerm}
                                    onChange={handleSearchChange} />
                            </div>
                        ) : (
                            // <span className="selected-text">{selectedtextlabel}</span>
                            <span className="selected-text">{selectedItem}</span>
                        )}
                        <div className="drop-btn">
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 16 16"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d={
                                        isOpen
                                            ? "M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                                            : "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                    }
                                ></path>
                            </svg>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="drop-open-container">
                            <div className="drop-sub-container add-new-btn">
                                <span>Add new +</span>
                            </div>
                            {/* stickers */}
                            <div className="drop-sub-container">
                                <div className="sub-label-content">
                                    <div className="label-box" onClick={handleStickers}>
                                        <span className="label-text">Sticker</span>
                                        {isStickerOpen ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 11h14v2H5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isStickerOpen && (
                                        <div className="sticker-list">

                                            {filteredStickers.length > 0 && (
                                                filteredStickers.map((sticker, index) => (
                                                    <div key={index} className="subdrop-item" onClick={() => handleSelectItem(sticker)}>
                                                        <span>
                                                            <div className='option-content'>
                                                                <span className="option__label">{sticker}</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* sequence */}
                            <div className="drop-sub-container">
                                <div className="sub-label-content">
                                    <div className="label-box" onClick={handleSequence}>
                                        <span className="label-text">Sequence</span>
                                        {isSequenceOpen ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 11h14v2H5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isSequenceOpen && (
                                        <div className="sticker-list">

                                            {filteredSequence.length > 0 && (
                                                filteredSequence.map((seq, index) => (
                                                    <div key={index} className="subdrop-item" onClick={() => handleSelectItem(seq)}>
                                                        <span>
                                                            <div className='option-content'>
                                                                <span className="option__label">{seq}</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* chatbot */}
                            <div className="drop-sub-container">
                                <div className="sub-label-content">
                                    <div className="label-box" onClick={handleChatbot}>
                                        <span className="label-text">Chatbot</span>
                                        {isChatbotOpen ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 11h14v2H5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isChatbotOpen && (
                                        <div className="sticker-list">

                                            {filterChatbot.length > 0 && (
                                                filterChatbot.map((chatbot, index) => (
                                                    <div key={index} className="subdrop-item" onClick={() => handleSelectItem(chatbot)}>
                                                        <span>
                                                            <div className='option-content'>
                                                                <span className="option__label">{chatbot}</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* text */}
                            <div className="drop-sub-container">
                                <div className="sub-label-content">
                                    <div className="label-box" onClick={handleText}>
                                        <span className="label-text">Text</span>
                                        {isTextOpen ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 11h14v2H5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isTextOpen && (
                                        <div className="sticker-list">


                                            {filterText.length > 0 && (
                                                filterText.map((text, index) => (
                                                    <div key={index} className="subdrop-item" onClick={() => handleSelectItem(text)}>
                                                        <span>
                                                            <div className='option-content'>
                                                                <span className="option__label">{text}</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* template */}
                            <div className="drop-sub-container">
                                <div className="sub-label-content">
                                    <div className="label-box" onClick={handleTemplate}>
                                        <span className="label-text">Template</span>
                                        {isTemplateOpen ? (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 11h14v2H5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 24 24"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                                            </svg>
                                        )}
                                    </div>
                                    {isTemplateOpen && (
                                        <div className="sticker-list">
                                            {filerTemplate.length > 0 && (
                                                filerTemplate.map((template, index) => (
                                                    <div key={index} className="subdrop-item" onClick={() => handleSelectItem(template)}>
                                                        <span>
                                                            <div className='option-content'>
                                                                <span className="option__label">{template}</span>
                                                            </div>
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>


                        </div>
                    )}
                </div>
            </div>

        </>
    )
}
const DefaultAction = () => {
    const [showModal, setShowModal] = useState(false);
    const [showCurrentplanModal,setShowCurrentplanModal]=useState(false);
    const [checkbox1Checked, setCheckbox1Checked] = useState(false);
    const [checkbox2Checked, setCheckbox2Checked] = useState(false);
    const [checkbox3Checked, setCheckbox3Checked] = useState(false);
    const [checkbox4Checked, setCheckbox4Checked] = useState(false);
    const [checkbox5Checked, setCheckbox5Checked] = useState(false);
    const [checkbox6Checked, setCheckbox6Checked] = useState(false);
    const [checkbox7Checked,setCheckbox7Checked]=useState(false);
    const [checkbox8Checked,setCheckbox8Checked]=useState(false);
    const [checkbox9Checked,setCheckbox9Checked]=useState(false);
    const handleOpenModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleCheckboxModal=(checked)=>{
   setCheckbox9Checked(checked);
   setShowCurrentplanModal(true);
    }
    const handleCheckboxCloseModal=()=>{
        setShowCurrentplanModal(false);
        setCheckbox9Checked(false);
    }

    return (
        <>
        {/* working hours settings modal */}
            {
                showModal && (<Workinghourssettings show={showModal} handleClose={handleCloseModal} />)
            }
            {/* current plan modal */}
            {
                showCurrentplanModal && (
                    <Modal show={showCurrentplanModal} dialogClassName="currentplanmodal">
                        <div className='currentplanmodal-content'>
                         <Modal.Header className='currentplanmodal-header'>
                    <Modal.Title >    <button type="button" className='modal-close-btn' onClick={handleCheckboxCloseModal} ><svg className='closesvg'  focusable="false" aria-hidden="true" viewBox="0 0 24 24" ><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg></button></Modal.Title>
                </Modal.Header>
                      <ModalBody>
                <div class="content__title">Not included in your current plan.</div>
                <div className='content__subtitle'>Your Current Plan: Professional</div>
                <div class="content__description">Automatic chat assignment in a round-robin manner is not included in your current plan. You must upgrade your plan to use this feature.</div>
                <div class="footer__btn__container"><button  target="_self" className='footer__cancel__btn' onClick={handleCheckboxCloseModal}>Cancel</button><button  target="_self" className='footer__upgrade__btn'>Upgrade Now</button></div>
                </ModalBody>
                </div>
            </Modal>
                )
            }
            <div className='defaultaction__right__content'>


                <div className="default-heading-profile">Default Actions</div>

                <div className='sub-container'>
                    <div className='sub-text'> Check when the keyword reply does not match, according to the set working time, use the default reply.</div>
                    <a href="https://www.youtube.com/watch?v=Gt3qhW24tiE" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span>Watch Tutorial</span></div></a>
                </div>



                <div className='defaultbodycontent'>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='grid-working-item'>
                        <div className='working-text'>Current Working hours :</div>
                        <button className='btn btn-success' onClick={handleOpenModal}>Set Working Hours</button>

                    </Grid>
                    <div className='form-select-group'>
                        <div className='select-left-content'>
                            {/* 1st checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid'>
                                <CheckboxComponent checklabel='When it is not working hours, reply the following'
                                    onToggle={(checked) => setCheckbox1Checked(checked)} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='Select material'
                                    isEnabled={checkbox1Checked} />
                            </Grid>

                            {/* 2nd checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel='When there is no customer service online during working hours, reply the following'
                                    onToggle={(checked) => setCheckbox2Checked(checked)} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='Select material'
                                    isEnabled={checkbox2Checked} />
                            </Grid>

                            {/* 3rd checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel='Send the following welcome message when a new chat is started and no keyword search criteria is met'
                                    onToggle={(checked) => setCheckbox3Checked(checked)} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='intro_welcome'
                                    isEnabled={checkbox3Checked} />
                            </Grid>

                            {/* 4th checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel='During working hours, users wait more than 2 minutes without any reply and no keyword matched, reply the following'
                                    onToggle={(checked) => setCheckbox4Checked(checked)} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='Select material'
                                    isEnabled={checkbox4Checked} />
                            </Grid>
                        </div>

                        <div className='select-right-content'>
                            {/* 1st checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid'>
                                <CheckboxComponent checklabel='Send the following fallback message if no keyword search criteria is met and no default action criteria is met.'
                                    onToggle={(checked) => setCheckbox5Checked(checked)} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='Select material' isEnabled={checkbox5Checked} />
                            </Grid>

                            {/* 2nd checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel="If customer does not respond and it's not SOLVED, when it almost reaches 24 hours since last message, use the following reply"
                                    onToggle={(checked) => setCheckbox6Checked(checked)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <DropdownComponent selectedtextlabel='Soon_to_be_closed' isEnabled={checkbox6Checked} />
                            </Grid>
                            {/* 3rd checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel="Expired or Closed chat will not be assigned to Bot but leave the last assignee in case of new message"
                              onToggle={(checked) => setCheckbox7Checked(checked)}   />
                            </Grid>

                            {/* 4th checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel="During out of office, send out of office message always (even if a keyword match is found)."
                                  onToggle={(checked) => setCheckbox8Checked(checked)}   />
                            </Grid>

                            {/* 4th checkbox content */}
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='checkbox-grid-style'>
                                <CheckboxComponent checklabel="Assign newly opened chats in round robin manner within users of the assigned team"
                               onToggle={handleCheckboxModal}    />
                            </Grid>
                        </div>
                    </div>
                </div>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className='grid__footer'>
                <button className='btn btn-success'>Save settings</button>
                </Grid>
            </div>

        </>
    )
}
export default DefaultAction;