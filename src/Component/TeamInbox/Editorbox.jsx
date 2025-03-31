import React from "react";
import ButtonComponent from "../ButtonComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import {
    FormatBoldOutlinedIcon, FormatItalicOutlinedIcon, FormatUnderlinedOutlinedIcon, StrikethroughSOutlinedIcon, CodeOffOutlinedIcon, FormatListNumberedOutlinedIcon, FormatListBulletedOutlinedIcon, InsertLinkOutlinedIcon, PhotoSizeSelectActualIcon, TagIcon, AttachFileIcon,
    RadioButtonCheckedIcon, FormatColorTextIcon, AutoFixHighIcon, 
} from '../Icon'
import style from "../MuiStyles/muiStyle";


const Editorbox = ({ isActive, ticketStatusOptions, onTogglePrivate, ticketStatusContent, onChange, showTicketStatus = true }) => {
    return (
        <div className="editorbox_container">
        <div className='support_tickets'>
            <textarea
                placeholder={isActive ? 'Enter private note visible only to agents' : 'Enter Message'}
                className='tab_reply_content'
            ></textarea>

            {/* Formatting Toolbar */}
            <div className='reply_text_container'>
                <div className='reply_text_style'>
                    <FormatBoldOutlinedIcon className='reply_text_container_icons' />
                    <FormatItalicOutlinedIcon className='reply_text_container_icons' />
                    <FormatUnderlinedOutlinedIcon className='reply_text_container_icons' />
                    <StrikethroughSOutlinedIcon className='reply_text_container_icons' />
                    <CodeOffOutlinedIcon className='reply_text_container_icons' />
                    <FormatListNumberedOutlinedIcon className='reply_text_container_icons' />
                    <FormatListBulletedOutlinedIcon className='reply_text_container_icons' />
                    <InsertLinkOutlinedIcon className='reply_text_container_icons' />
                    <PhotoSizeSelectActualIcon className='reply_text_container_icons' />
                </div>
            </div>

            {/* Second Toolbar */}
            <div className='reply_text_second_container'>
                <div className='reply_text_style'>
                    {/* Toggle Private Mode */}
                    <div className='holidaytoggle'>
                        <button
                            type="button"
                            className={`toggle__control ${isActive ? 'active' : ''}`}
                            onClick={onTogglePrivate}
                            aria-label="Toggle"
                        >
                            <div className='toggle-indicator'></div>
                        </button>
                        <label className="toggle-label">Private</label>
                    </div>

                    <TagIcon className='reply_text_container_icons' />
                    <AttachFileIcon className='reply_text_container_icons' />
                    <RadioButtonCheckedIcon className='reply_text_container_icons' />
                    <FormatColorTextIcon className='reply_text_container_icons' />
                    <AutoFixHighIcon className='reply_text_container_icons' />
                    <div className='reply_text_container_icons'>@</div>
                </div>

                {/* Ticket Status & Submit Button */}
                <div className='mail_send_btn'>
                    {!isActive && showTicketStatus && (
                        <>
                            <p className='ticket_status_text'>Ticket status</p>
                            <AutocompleteComponent
                                options={ticketStatusOptions}
                                value={ticketStatusContent}
                                onChange={onChange}
                                customStyles={style.ticketsStatusAutocomplete}
                            />
                        </>
                    )}
                    <ButtonComponent label='Submit' customBtn='submit_btn' />
                </div>
            </div>
        </div>
        </div>
    );
};
export default Editorbox;