import React, { useState } from 'react'
import whatsappflow from '../Assets/img/whatsappflow.svg'
import LeadGenerationModal from './PopupModal/Whatsappflows/LeadGenerationModal';
import FeedbackFormModal from './PopupModal/Whatsappflows/FeedbackFormModal';

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