import React from "react";
import TextfieldComponent from "../../../TextfieldComponent";
import { ArrowBackIcon } from '../../../Icon';
import ButtonComponent from '../../../ButtonComponent';
import ToggleSwitch from '../../../ToggleSwitch';

const LeadGenerationModal = ({ onClose }) => {
    return (
        <>
            <div className='leadgeneration_container' >
                <div className='header_content'>
                    <div className='header_left_content' onClick={onClose}>
                        <ArrowBackIcon />
                        <ButtonComponent label='Lead Generation' customBtn='generation_backbutton' />
                    </div>
                    <div className='header_right_content'>
                        <ButtonComponent label='Migrate Plan' />
                    </div>
                </div>
                <div className='leadgeneration_main_content'>
                    <div className='screen_container'>
                        <div className='container_title'>Screens</div>
                        <div className='screen_signupbox'>Sign up</div>
                    </div>
                    <div className='content_container'>
                        <div className='container_title'>content</div>
                        <div className='text_content_container'>
                            <div className='textbox_title'>Screen title</div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='text' placeholder='enter screen title' value='Sign up' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>
                                    <ToggleSwitch leftLabel='Mark as required' />
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='text' placeholder='Name' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>
                                    <ToggleSwitch leftLabel='Mark as required' />
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='email' placeholder='Email' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>
                                    <div className='required_field'>
                                        <ToggleSwitch leftLabel='Mark as required' />
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='text' placeholder='Street Address' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>
                                    <div className='required_field'>
                                        <ToggleSwitch leftLabel='Mark as required' />
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='text' placeholder='Zip Code' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                        <div className='text_content_container'>
                            <div className='textbox_title'>Button</div>
                            <div className='textbox_field_content'>
                                <TextfieldComponent type='text' placeholder='enter Button label' customStyle='generation_textbox_field' />
                            </div>
                        </div>
                    </div>
                    <div className='preview_container'>
                        <div className='container_title'>Preview</div>
                        <div>
                            <div className='preview_container_first_layer'></div>
                            <div className='preview_container_second_layer'>
                                <div>
                                    <div className='preview_header_container'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none"><path d="M4.79427 3.62375C4.55895 3.38844 4.17743 3.38844 3.94211 3.62375C3.7068 3.85907 3.7068 4.24059 3.94211 4.47591L7.13143 7.66522L3.94213 10.8545C3.70681 11.0898 3.70681 11.4714 3.94213 11.7067C4.17745 11.942 4.55897 11.942 4.79428 11.7067L7.98358 8.51738L11.1729 11.7067C11.4082 11.942 11.7897 11.942 12.025 11.7067C12.2604 11.4714 12.2604 11.0898 12.025 10.8545L8.83574 7.66522L12.0251 4.47591C12.2604 4.24059 12.2604 3.85907 12.0251 3.62375C11.7897 3.38844 11.4082 3.38844 11.1729 3.62375L7.98358 6.81307L4.79427 3.62375Z" fill="#6F767E"></path></svg>
                                        Sign up
                                        <svg xmlns="http://www.w3.org/2000/svg" width="5" height="15" viewBox="0 0 5 15" fill="none"><circle cx="2.44231" cy="2.24129" r="1.80769" transform="rotate(90 2.44231 2.24129)" fill="#6F767E"></circle><circle cx="2.44231" cy="7.66511" r="1.80769" transform="rotate(90 2.44231 7.66511)" fill="#6F767E"></circle><circle cx="2.44231" cy="13.087" r="1.80769" transform="rotate(90 2.44231 13.087)" fill="#6F767E"></circle></svg>
                                    </div>
                                    <div className='preview_main_content'>
                                        <div>
                                            <TextfieldComponent type='text' placeholder="Name (Optional)" customStyle='generation_preview_textfield' />
                                            <TextfieldComponent type='text' placeholder="Email (Optional)" customStyle='generation_preview_textfield' />
                                            <TextfieldComponent type='text' placeholder="Street Address (Optional)" customStyle='generation_preview_textfield' />
                                            <TextfieldComponent type='text' placeholder="Zip Code (Optional)" customStyle='generation_preview_textfield' />

                                        </div>
                                    </div>
                                </div>
                                <ButtonComponent label='Sign Up' customBtn='generation_preview_signupbtn' />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LeadGenerationModal;