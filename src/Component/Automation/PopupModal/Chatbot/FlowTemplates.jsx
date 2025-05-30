import React,{useState} from "react";
import CopyandAddModal from "./CopyandAddModal";
import ButtonComponent from "../../../ButtonComponent";
import AutocompleteComponent from "../../../AutocompleteComponent";
import Catalog from '../../../Assets/img/Catalog.jpeg';
import education from '../../../Assets/img/education.jpeg';
import general from '../../../Assets/img/general.jpeg';
import hospital from '../../../Assets/img/hospital.jpeg';
import Ecommerce from '../../../Assets/img/Ecommerce.jpeg';
import Realestate from '../../../Assets/img/Realestate.jpeg';
import Restaurant from '../../../Assets/img/Restaurant.jpeg';
import Finance from '../../../Assets/img/Finance.jpeg';

const options = ['All', 'Catalog', 'Restaurant', 'Real Estate', 'Hospital & Doctor', 'General', 'Finance', 'Education', 'Ecommerce']
const categoryMapping = {
    'Hospital & Doctor': ['Hospital Booking', 'Doctor Appointment'],
    'General': ['General Appointment Booking', 'Feedback For Using WATI'],
    'Finance': ['New Bank Account', 'Insurance'],
    'Education': ['Kids Booking Class', 'Education']
}
const initialTemplateData = [
    { id: 1, img: Catalog, title: 'Catalog', subTitle: 'Catalog checkout flow template' },
    { id: 2, img: Restaurant, title: 'Restaurant', subTitle: 'Restaurant template' },
    { id: 3, img: Realestate, title: 'Real Estate', subTitle: 'Real Estate template' },
    { id: 4, img: hospital, title: 'Hospital Booking', subTitle: 'Hospital Booking template' },
    { id: 5, img: hospital, title: 'Doctor Appointment', subTitle: 'Doctor Appointment template' },
    { id: 6, img: general, title: 'General Appointment Booking', subTitle: "General Appointment Booking template" },
    { id: 7, img: general, title: 'Feedback For Using WATI', subTitle: 'Feedback For Using WATI template' },
    { id: 8, img: Finance, title: 'New Bank Account', subTitle: 'New Bank Account template' },
    { id: 9, img: Finance, title: 'Insurance', subTitle: 'Insurance template' },
    { id: 10, img: education, title: 'Kids Booking Class', subTitle: 'Kids Booking Class template' },
    { id: 11, img: education, title: 'Education', subTitle: 'Education template' },
    { id: 12, img: Ecommerce, title: 'Ecommerce', subTitle: 'Ecommerce template' }

]

const FlowTemplates = ({ handleNotificationModal, handleEditChatbotbutton, onSave }) => {
    const [content, setContent] = useState('All');
    const [showAddChatbotModal, setShowAddChatbotModal] = useState(false);

    const filteredTemplates = content === 'All' ? initialTemplateData : content in categoryMapping ?
        initialTemplateData.filter(template => categoryMapping[content].includes(template.title)) :
        initialTemplateData.filter(template => template.title === content);

    const filteredOptions = content === 'All' ? options : options.filter(option => option !== content)
    const handleShowModal = () => {
        setShowAddChatbotModal(true);
    }
    const handleCloseChatbotModal = () => {
        setShowAddChatbotModal(false);
    }

    const handleSave = (chatbotName) => {
        handleCloseChatbotModal();
        handleEditChatbotbutton();
        onSave(chatbotName);
    };
    return (
        <>
            <div className='chatbots_template_container'>
                <div className='template__header'>
                    <div className='template_notice'>Choose one of our templates or build a bot from scratch</div>
                    <div className='template__header_category'>
                        <AutocompleteComponent 
                           options={filteredOptions}
                           value={content}
                           onChange={(event, newValue) => setContent(newValue)}
                        />
                        {/* <Autocomplete
                            options={filteredOptions}
                            value={content}
                            disableClearable
                            onChange={(event, newValue) => setContent(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    placeholder="All"
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

                        /> */}
                    </div>
                </div>
                <div className='grid__template__main__container'>
                    <div className='grid__template__container'>
                        <div className='grid_template_card' onClick={handleShowModal}>
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.0595 6.68788C21.9668 5.77071 26.0332 5.77071 29.9405 6.68788C35.2617 7.93695 39.483 11.929 41.0567 17.1153H6.94328C8.517 11.929 12.7383 7.93695 18.0595 6.68788Z" fill="#23A455"></path><path d="M6.40906 19.4144C5.78284 22.9062 5.87562 26.4942 6.6874 29.9574C8.01099 35.604 12.4168 40.013 18.0595 41.3375C19.6378 41.708 21.242 41.9288 22.8513 42V19.4144H6.40906Z" fill="#23A455"></path><path d="M25.1488 42C26.758 41.9288 28.3622 41.708 29.9405 41.3375C35.5832 40.013 39.989 35.604 41.3126 29.9574C42.1244 26.4942 42.2172 22.9062 41.5909 19.4144H25.1488V42Z" fill="#23A455"></path></svg>
                            Start From Scratch
                        </div>
                    </div>
                    {
                        filteredTemplates.map((templatacard, index) => (
                            <div key={index} className='grid__main_flowtemplate'>
                                <div>
                                    <div className='template_image'><img className='template_cardimg' src={templatacard.img} /></div>
                                    <h3 className='template__title'>{templatacard.title}</h3>
                                    <p>{templatacard.subTitle}</p>
                                </div>
                                <div className='template__button'>
                                    <ButtonComponent label='Use this' onClick={handleNotificationModal}/>
                                   
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
            <CopyandAddModal show={showAddChatbotModal} onClose={handleCloseChatbotModal} onSave={handleSave} placeholder="Chatbot Name"
                buttonLabel="Add" />
        </>
    )
}
export default FlowTemplates;
