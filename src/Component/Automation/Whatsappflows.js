import React, { useState } from 'react'
import whatsappflow from '../Assets/img/whatsappflow.svg'
const LeadGenerationModal = ({ onClose }) => {
    return (
        <>
            <div className='leadgeneration_container' >
                <div className='header_content'>
                    <div className='header_left_content'>
                        <button className='backbutton' onClick={onClose}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg></button>
                        Lead Generation
                    </div>
                    <div className='header_right_content'>
                        <button className='btn btn-success'>Migrate Plan</button>
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
                                <input className='textbox_field' placeholder='enter screen title' value='Sign up' />
                                <div className='input_letter_counter'>7/20</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Name' />
                                <div className='input_letter_counter'>4/40</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Email' />
                                <div className='input_letter_counter'>5/40</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Street Address' />
                                <div className='input_letter_counter'>14/40</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Short Answer
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Zip Code' />
                                <div className='input_letter_counter'>8/40</div>
                            </div>
                        </div>
                        <div className='text_content_container'>
                            <div className='textbox_title'>Button</div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='enter Button label' value='Sign Up' />
                                <div className='input_letter_counter'>8/30</div>
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
                                            <input type='text' className='preview_textfield' placeholder="Name (Optional)" />
                                            <input type='text' className='preview_textfield' placeholder="Email (Optional)" />
                                            <input type='text' className='preview_textfield' placeholder="Street Address (Optional)" />
                                            <input type='text' className='preview_textfield' placeholder="Zip Code (Optional)" />
                                        </div>

                                    </div>
                                </div>
                                <div className='preview_signupbtn'>Sign Up</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const FeedbackFormModal = ({ onClose }) => {
    return (
        <>
            <div className='feedbackgeneration_container' >
                <div className='header_content'>
                    <div className='header_left_content'>
                        <button className='backbutton' onClick={onClose}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg></button>
                        Feedback form
                    </div>
                    <div className='header_right_content'>
                        <button className='btn btn-success'>Migrate Plan</button>
                    </div>
                </div>
                <div className='feedbackgeneration_main_content'>
                    <div className='screen_container'>
                        <div className='container_title'>Screens</div>
                        <div className='screen_feedbackbox'>Feedback</div>

                    </div>
                    <div className='content_container'>
                        <div className='container_title'>content</div>
                        <div className='text_content_container'>
                            <div className='textbox_title'>Screen title</div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='enter screen title' value='Feedback' />
                                <div className='input_letter_counter'>8/20</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title textbox_heading'>Large Heading</div>
                            <div className='textbox_field_content'>
                                <textarea className='textarea_field'>Would you recommend us to a friend?</textarea>
                                <div className='input_letter_counter'>35/80</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title'>Selection
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Choose' />
                                <div className='input_letter_counter'>6/30</div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Yes' />
                                <div className='input_letter_counter'>3/30</div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='No' />
                                <div className='input_letter_counter'>2/30</div>
                            </div>
                        </div>
                        <div className='textbox_container'>
                            <div className='textbox_title'>Paragraph
                                <div className='required_field'>Mark as required
                                    <div className='required_toggle_container'>
                                        <div className='required_toggle_circle'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='Enter Text' value='Leave a comment' />
                                <div className='input_letter_counter'>15/30</div>
                            </div>
                        </div>
                        <div className='text_content_container'>
                            <div className='textbox_title'>Button</div>
                            <div className='textbox_field_content'>
                                <input className='textbox_field' placeholder='enter Button label' value='Sign Up' />
                                <div className='input_letter_counter'>6/30</div>
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
                                        Feedback
                                        <svg xmlns="http://www.w3.org/2000/svg" width="5" height="15" viewBox="0 0 5 15" fill="none"><circle cx="2.44231" cy="2.24129" r="1.80769" transform="rotate(90 2.44231 2.24129)" fill="#6F767E"></circle><circle cx="2.44231" cy="7.66511" r="1.80769" transform="rotate(90 2.44231 7.66511)" fill="#6F767E"></circle><circle cx="2.44231" cy="13.087" r="1.80769" transform="rotate(90 2.44231 13.087)" fill="#6F767E"></circle></svg>
                                    </div>
                                    <div className='preview_main_content'>

                                        <div className='main_content_selection'>Would you recommend us to a friend?</div>
                                        <div className='selection_heading'>Choose (Optional)
                                            <div className='selection_option_container'>
                                                <div className='option_label'>Yes</div>
                                                <div className='option_radio_btn'></div>
                                            </div>
                                            <div className='selection_option_container'>
                                                <div className='option_label'>No</div>
                                                <div className='option_radio_btn'></div>
                                            </div>
                                        </div>
                                        <div>
                                            <textarea className='preview_textarea_field'>Leave a comment(Optional)</textarea>
                                            <div className='preview_text_counter'>0/600</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='preview_submitbtn'>Submit</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const Whatsappflows = () => {
    const [showOpenLeadGeneration, setShowOpenLeadGeneration] = useState(false);
    const [showOpenFeedbackForm, setShowFeedbackForm] = useState(false)
    const handleOpenLeadGeneration = () => {
        setShowOpenLeadGeneration(true);
    }
    const handleOpenFeedbackForm = () => {
        setShowFeedbackForm(true);
    }
    const handleCloseLeadGeneration = () => {
        setShowOpenLeadGeneration(false);
    }
    const handleCloseFeedbackForm = () => {
        setShowFeedbackForm(false)
    }
    return (
        <>
            {
                showOpenLeadGeneration ? (
                    <LeadGenerationModal show={showOpenLeadGeneration} onClose={handleCloseLeadGeneration} />
                ) :
                    showOpenFeedbackForm ? (
                        <FeedbackFormModal show={showOpenFeedbackForm} onClose={handleCloseFeedbackForm} />
                    )

                        : (
                            <div className='whatsappflow_container'>
                                <div className='whatsappflow_main_content'>
                                    <h1 className='content_title'>WhatsApp Flows</h1>
                                    <h3 className='sub_title'>Templates</h3>
                                    <div className='card_container'>
                                        <div className='card_content' onClick={handleOpenLeadGeneration}>
                                            <div className='card_left_content'>L</div>
                                            <div className='card_right_content'>
                                                <h5 className='card_title'>Lead Generation</h5>
                                                <p className='card_description'>Request user sign up and generate leads effortlessly.</p>
                                            </div>
                                        </div>
                                        <div className='card_content' onClick={handleOpenFeedbackForm}>
                                            <div className='card_left_content'>F</div>
                                            <div className='card_right_content'>
                                                <h5 className='card_title'>Feedback form</h5>
                                                <p className='card_description'>Send feedback forms to customers and get feedback easily</p>
                                            </div>
                                        </div>
                                        <hr className='line_style' />
                                        <div className='cardimage_content'>
                                            <img src={whatsappflow} />
                                            <p className='card_image_text'>Select a template from above and make it your own by customising it.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )

            }

        </>
    )
}
export default Whatsappflows;