import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import { CustomScroll } from "react-custom-scroll";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrBold } from "react-icons/gr";
import { FaItalic } from "react-icons/fa6";
import { MdStrikethroughS } from "react-icons/md";
import { MdLink } from "react-icons/md";
import img from './Assets/img/mediaImg.png';
import vdo from './Assets/img/mediaVdo.png';
import document from './Assets/img/mediaDocument.png'
import AttributePopup from './Popup/AttributePopup';
import { FaArrowLeft } from "react-icons/fa6";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import SampleTemplate from './Popup/SampleTemplate';
// import './Style.css';
import whatsapp from './Assets/img/whatsapp.png'
import sms from './Assets/img/sms.png'
import push from './Assets/img/push.png'
import platform from './Assets/img/platform.png'
import email from './Assets/img/mail.png'
import whatsappDesk from './Assets/img/whatsappDesk.png'
import platformDesk from './Assets/img/platformDesk.png'
import pushDesk from './Assets/img/pushDesk.png'
import emailDesk from './Assets/img/gmailDesk.png'
import car from './Assets/img/evzone.png'
import { CiMobile2 } from "react-icons/ci";
import { CiDesktop } from "react-icons/ci";
import evMarket from './Assets/img/evmarket.svg'
import { IoMdSettings } from "react-icons/io";
import visit from './Assets/img/visit.png';
import copy from './Assets/img/copy.png';
import reply from './Assets/img/reply.png';
import call from './Assets/img/call.png';

function NewPopup({ show, setShow, onClose }) {
    const typeSelectOption = [
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Red', label: 'Red' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Green', label: 'Green' }
    ];

    const Yellow = [
        { value: 'marketing/ads', label: 'marketing/ads' },
        { value: 'surveys', label: 'surveys' },
        { value: 'Interactive Prompts', label: 'Interactive Prompts' }
    ]

    const Red = [
        { value: 'Emergency', label: 'Emergency' },
        { value: 'Account Verfication', label: 'Account Verfication' },
        { value: '3rd-Party Authentication', label: '3rd-Party Authentication' },
        { value: 'MFA', label: 'MFA' },
        { value: 'Failed Activity', label: 'Failed Activity' },
        { value: 'Rejections', label: 'Rejections' },
        { value: 'Bad Activity', label: 'Bad Activity' }
    ];

    const Blue = [
        { value: 'Credential Access/share', label: 'Credential Access/share' },
        { value: 'Update notices', label: 'Update notices' },
        { value: 'Helper tours', label: 'Helper tours' },
        { value: 'Transactions', label: 'Transactions' }
    ]

    const Green = [
        { value: 'Approvals', label: 'Approvals' },
        { value: 'Lifts', label: 'Lifts' },
        { value: 'success activity', label: 'success activity' }
    ]

    const languagesSelectOption = [
        { value: 'English (US)', label: 'English (US)' },
        { value: 'Afrikaans', label: 'Afrikaans' },
        { value: 'Albanian', label: 'Albanian' },
        { value: 'Arabic', label: 'Arabic' },
        { value: 'Azerbaijani', label: 'Azerbaijani' },
        { value: 'Bengali', label: 'Bengali' },
        { value: 'Bulgarian', label: 'Bulgarian' },
        { value: 'Catalan', label: 'Catalan' },
        { value: 'Chinese (CHN)', label: 'Chinese (CHN)' },
        { value: 'Chinese (HKG)', label: 'Chinese (HKG)' },
        { value: 'Chinese (TAI)', label: 'Chinese (TAI)' },
        { value: 'Croatian', label: 'Croatian' },
        { value: 'Czech', label: 'Czech' },
        { value: 'Danish', label: 'Danish' },
        { value: 'Dutch', label: 'Dutch' },
        { value: 'English', label: 'English' },
        { value: 'English (UK)', label: 'English (UK)' },
        { value: 'Estonian', label: 'Estonian' },
        { value: 'Filipino', label: 'Filipino' },
        { value: 'Finnish', label: 'Finnish' },
        { value: 'French', label: 'French' },
        { value: 'Georgian', label: 'Georgian' },
        { value: 'German', label: 'German' },
        { value: 'Greek', label: 'Greek' },
        { value: 'Gujarati', label: 'Gujarati' },
        { value: 'Hausa', label: 'Hausa' },
        { value: 'Hebrew', label: 'Hebrew' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Hungarian', label: 'Hungarian' },
        { value: 'Indonesian', label: 'Indonesian' },
        { value: 'Irish', label: 'Irish' },
        { value: 'Italian', label: 'Italian' },
        { value: 'Japanese', label: 'Japanese' },
        { value: 'Kannada', label: 'Kannada' },
        { value: 'Kazakh', label: 'Kazakh' },
        { value: 'Kinyarwanda', label: 'Kinyarwanda' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Kyrgyz (Kyrgyzstan)', label: 'Kyrgyz (Kyrgyzstan)' },
        { value: 'Lao', label: 'Lao' },
        { value: 'Latvian', label: 'Latvian' },
        { value: 'Lithuanian', label: 'Lithuanian' },
        { value: 'Macedonian', label: 'Macedonian' },
        { value: 'Malay', label: 'Malay' },
        { value: 'Malayalam', label: 'Malayalam' },
        { value: 'Marathi', label: 'Marathi' },
        { value: 'Norwegian', label: 'Norwegian' },
        { value: 'Persian', label: 'Persian' },
        { value: 'Polish', label: 'Polish' },
        { value: 'Portuguese (BR)', label: 'Portuguese (BR)' },
        { value: 'Portuguese (POR)', label: 'Portuguese (POR)' },
        { value: 'Punjabi', label: 'Punjabi' },
        { value: 'Romanian', label: 'Romanian' },
        { value: 'Russian', label: 'Russian' },
        { value: 'Serbian', label: 'Serbian' },
        { value: 'Slovak', label: 'Slovak' },
        { value: 'Slovenian', label: 'Slovenian' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'Spanish (ARG)', label: 'Spanish (ARG)' },
        { value: 'Spanish (SPA)', label: 'Spanish (SPA)' },
        { value: 'Spanish (MEX)', label: 'Spanish (MEX)' },
        { value: 'Swahili', label: 'Swahili' },
        { value: 'Swedish', label: 'Swedish' },
        { value: 'Tamil', label: 'Tamil' },
        { value: 'Telugu', label: 'Telugu' },
        { value: 'Thai', label: 'Thai' },
        { value: 'Turkish', label: 'Turkish' },
        { value: 'Ukrainian', label: 'Ukrainian' },
        { value: 'Urdu', label: 'Urdu' },
        { value: 'Uzbek', label: 'Uzbek' },
        { value: 'Vietnamese', label: 'Vietnamese' },
        { value: 'Zulu', label: 'Zulu' },
    ]


    const broadcastSelectOption = [
        { value: 'None', label: 'None' },
        { value: 'text', label: 'Text' },
        { value: 'media', label: 'Media' },
    ];

    const broadcastSelectOptionEmail = [
        { value: 'None', label: 'None' },
        { value: 'media', label: 'Media' },
    ];

    const buttonSelectOption = [
        { value: 'Visit Website', label: 'Visit Website' },
        { value: 'callPhone', label: 'Call Phone' },
    ];

    const buttonStaticOption = [
        { value: 'Static', label: 'Static' },
        { value: 'Dynamic', label: 'Dynamic' },
    ]
    const [type, setType] = useState(typeSelectOption[0]);
    const [typeValue, setTypeValue] = useState(Yellow);
    const [identification, setIdentification] = useState(Yellow[0]);
    const [language, setLanguage] = useState(languagesSelectOption[0].value);
    const [broadcast, setBroadcast] = useState(broadcastSelectOption[0].value);
    const [selectedOption, setSelectedOption] = useState(buttonSelectOption[0].value);
    const [selectedStaticOption, setSelectedStaticOption] = useState(buttonStaticOption[0].value);
    const [cleanText, setCleanText] = useState('');
    let [cleanTextBody, setCleanTextBody] = useState('');
    const [cleanTextFooter, setCleanTextFooter] = useState('');
    const [cleanTextSample, setCleanTextSample] = useState('');
    const [htmlText, setHtmlText] = useState('');
    const [htmlTextBody, setHtmlTextBody] = useState('');
    const [htmlTextFooter, setHtmlTextFooter] = useState('');
    const [htmlTextSample, setHtmlTextSample] = useState('');

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    const [selectOption, setSelectOption] = useState('IMAGE');
    const [filePreview, setFilePreview] = useState('');
    const [errorMessageFile, setErrorMessageFile] = useState('');
    const [sampleTemplate, setSampleTemplate] = useState(false);
    const [marketingTemplate, setMarketingTemplate] = useState("whatsapp");
    const [expire, setExpire] = useState(10);
    const [copyOffer, setcopyOffer] = useState('Copy offer code');
    const [buttonText, setButtonText] = useState("");
    const [buttonOpen, setButtonOpen] = useState(false);

    const [isAttributePopOpen, setIsAttributePopOpen] = useState(false);
    const [sampleTemplateChoose, setSampleTemplateChoose] = useState(false);
    const [fromName, setFromName] = useState("");
    const [fromNameShow, setFromNameShow] = useState(false);
    const [securityRecommandChecked, setSecurityRecommandChecked] = useState(true);
    const [securityRecommandCheckedFooter, setSecurityRecommandCheckedFooter] = useState(true)
    let visitWebSiteObj = { type: "Visit Us", visitData: [] }
    //{ visitWebsite: buttonSelectOption[0].value, visitUsInput: "", staticDropdown: buttonStaticOption[0].value, visithttpInput: "", type: "visitUs" }
    let copyOfferCodeObj = { type: "copy", coperData: [] }
    let quickReplybj = { type: "reply", ReplyData: [] }
    const [visitWebSiteArray, setVisitWebSiteArray] = useState([visitWebSiteObj, copyOfferCodeObj, quickReplybj]);
    let [chatReplyBox, setChatReplyBox] = useState([]);
    const [verificationCodeText, setVerificationCodeText] = useState("{{1}} is your verification code. For your security, do not share this code.");
    const [buttonCount, setButtonCount] = useState(0);
    const [visitCont, setVisitCont] = useState('')
    const [isButtonChecked, setIsButtonChecked] = useState(false);
    const [textareaCount, setTextareaCount] = useState(0);
    const [footerCount, setFooterCount] = useState(0);
    const [smsCursor, setSmsCursor] = useState('');

    useEffect(() => {
        setTextareaCount(cleanTextBody.length);
    }, [cleanTextBody]);

    const textareaStyle = {
        color: textareaCount > 1024 ? 'red' : 'black',
        border: textareaCount > 1024 ? '2px solid red' : ''
    };

    useEffect(() => {
        setFooterCount(cleanTextFooter.length);
    }, [cleanTextFooter]);

    const footerStyle = {
        // border: footerCount > 60 ? '2px solid red' : null,
        outline: footerCount > 60 ? '2px solid red' : null,
        color: footerCount > 60 ? 'red' : null
    }

    const changeMarketingTemplate = (value) => {
        setCleanText('');
        setCleanTextBody('');
        setCleanTextFooter('');
        setCleanTextSample('');
        setHtmlText('');
        setHtmlTextBody('');
        setHtmlTextFooter('');
        setHtmlTextSample('');
        setFilePreview('');
        setSelectOption('IMAGE');
        setBroadcast(broadcastSelectOption[0].value);
        setIsButtonChecked(false);
        setMarketingTemplate(value);

        if (value !== "whatsapp") {
            setVisitWebSiteArray([visitWebSiteObj, copyOfferCodeObj, quickReplybj])
            setChatReplyBox([])
        }

    }

    const handleIdentification = (e) => {
        setIdentification(e);
    }


    const handleTypeOption = (selectedCategory) => {

        setType(selectedCategory);
        switch (selectedCategory.value) {
            case 'Red':
                setTypeValue(Red);
                setIdentification(Red[0]);
                // setMarketingTemplate("sms")
                setMarketingTemplate("platform")
                break;
            case 'Blue':
                setTypeValue(Blue);
                setIdentification(Blue[0]);
                setMarketingTemplate("platform")
                break;
            case 'Green':
                setTypeValue(Green);
                setIdentification(Green[0]);
                setMarketingTemplate("platform")
                break;
            default:
                setTypeValue(Yellow);
                setIdentification(Yellow[0]);
                setMarketingTemplate("whatsapp")
        }
    };
    const handleLanguagesOption = (selectedCategory) => {
        setLanguage(selectedCategory.value);
    }

    const handleBroadcastOption = (selectedBroadcast) => {
        setBroadcast(selectedBroadcast);
    }

    const handleButtonOption = (selectedButton) => {
        setSelectedOption(selectedButton);
    }
    const handleStaticButtonOption = (selectedButton) => {
        setSelectedStaticOption(selectedButton);
    }


    const handleOpenAttributePop = () => {
        setIsAttributePopOpen(true);
    };

    const handleCloseAttributePop = () => {
        setIsAttributePopOpen(false);
    };


    const handleOptionChange = (e) => {
        setSelectOption(e.target.value);
        setFilePreview('');
        setErrorMessageFile('');
    };


    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;
            let isValid = false;

            if (selectOption === 'IMAGE' && (fileType === 'image/jpeg' || fileType === 'image/png')) {
                isValid = true;
            } else if (selectOption === 'VIDEO' && fileType === 'video/mp4') {
                isValid = true;
            } else if (selectOption === 'DOCUMENT' && fileType === 'application/pdf') {
                isValid = true;
            }

            if (isValid) {
                let objectUrl = URL.createObjectURL(file);
                setFilePreview(objectUrl);
                setErrorMessageFile('');
            } else {
                setFilePreview('');
                setErrorMessageFile(`Please select a valid ${selectOption.toLowerCase()} file.`);
            }
        }
    };


    const handleTextChange = (event) => {
        const newText = event.target.value;
        let newHtmlText = '';


        if (newText.length === 0) {
            newHtmlText = '';
        }
        else if (newText.length < cleanText.length) {
            newHtmlText = htmlText.substring(0, htmlText.lastIndexOf('<b>') > -1 ? htmlText.lastIndexOf('<b>') : 0);
            newHtmlText += newText.slice(newHtmlText.replace(/<\/?b>/g, '').length);
        }
        else {
            const newContent = newText.slice(cleanText.length);
            let newHtmlContent = newContent;

            if (isBold) {
                newHtmlContent = isBold ? `<b>${newHtmlContent}</b>` : newHtmlContent;
            }

            if (isItalic) {
                newHtmlContent = isItalic ? `<i>${newHtmlContent}</i>` : newHtmlContent;
            }

            newHtmlText = htmlText + newHtmlContent;
        }

        newHtmlText = newHtmlText.replace(/\n/g, "<br />");

        setCleanText(newText);
        setHtmlText(newHtmlText);
    };

    const handleTextBodyChange = (typingvalue) => {
        const newTextBody = typingvalue;
        let newHtmlTextBody = '';

        if (newTextBody.length === 0) {
            newHtmlTextBody = '';
        }
        else if (newTextBody.length < cleanTextBody.length) {
            newHtmlTextBody = htmlTextBody.substring(0, htmlTextBody.lastIndexOf('<b>') > -1 ? htmlTextBody.lastIndexOf('<b>') : 0);
            newHtmlTextBody += newTextBody.slice(newHtmlTextBody.replace(/<\/?b>/g, '').length);
        }
        else {
            const newContent = newTextBody.slice(cleanTextBody.length);
            let newHtmlContent = newContent;

            if (isBold) {
                newHtmlContent = isBold ? `<b>${newHtmlContent}</b>` : newHtmlContent;
            }

            if (isItalic) {
                newHtmlContent = isItalic ? `<i>${newHtmlContent}</i>` : newHtmlContent;
            }

            newHtmlTextBody = htmlTextBody + newHtmlContent;
        }

        newHtmlTextBody = newHtmlTextBody.replace(/\n/g, "<br />");

        setCleanTextBody(newTextBody);
        setHtmlTextBody(newHtmlTextBody);
    };

    const handleTextFooterChange = (event) => {
        const newTextFooter = event.target.value;
        let newHtmlTextFooter = '';

        if (newTextFooter.length === 0) {
            newHtmlTextFooter = '';
        }
        else if (newTextFooter.length < cleanTextFooter.length) {
            newHtmlTextFooter = htmlTextFooter.substring(0, htmlTextFooter.lastIndexOf('<b>') > -1 ? htmlTextFooter.lastIndexOf('<b>') : 0);
            newHtmlTextFooter += newTextFooter.slice(newHtmlTextFooter.replace(/<\/?b>/g, '').length);
        }
        else {
            const newContent = newTextFooter.slice(cleanTextFooter.length);
            const newHtmlContent = isBold ? `<b>${newContent}</b>` : newContent;
            newHtmlTextFooter = htmlTextFooter + newHtmlContent;
        }

        newHtmlTextFooter = newHtmlTextFooter.replace(/\n/g, "<br />");

        setCleanTextFooter(newTextFooter);
        setHtmlTextFooter(newHtmlTextFooter);
    };

    const toggleBold = () => {
        setIsBold(prevIsBold => !prevIsBold);
    };

    const toggleItalic = () => {
        setIsItalic(!isItalic);
    };

    let now = new Date();
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');
    let currentTime = `${hours}:${minutes}`;

    let handleButtonOpen = () => {
        setButtonOpen(true);
    }


    const handleButtonToggle = (checkedtype) => {
        chatReplyBox = []
        // if (!checkedtype) {
        //     chatReplyBox.push({ type: "Visit Us", typedText: "Visit Us" })
        // }
        // else {
            setVisitWebSiteArray([visitWebSiteObj, copyOfferCodeObj, quickReplybj])
            chatReplyBox = []
        // }
        setIsButtonChecked(!isButtonChecked);
        setChatReplyBox(...[chatReplyBox])

    };

    useEffect(() => {
        if (isButtonChecked == false) {
            setButtonCount(0);
        }
        // else {
        //     setButtonCount(buttonCount + 1);
        // }
    }, [isButtonChecked])

    const [mobileDeskview, setMobileDeskview] = useState('mobile');
    

    const handleMobileDeskView = (type) => {
        setMobileDeskview(type);
    };

    const [isZoomed, setIsZoomed] = useState(false);

    const handleZoomClick = () => {
        setIsZoomed(true);
    };

    const handleCloseClick = () => {
        setIsZoomed(false);
    };

    let classNames = `${mobileDeskview === 'mobile' ? "selectImgs" : "selectDeskWhatsapp"}`;
    if (mobileDeskview === 'desktop' && isZoomed) {
        classNames += ' zoomed';
    }

    let platformClass = `${mobileDeskview == 'mobile' ? 'selectImgs' : 'selectDeskWhatsapp'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        platformClass += ' zoomed';
    }

    let pushClass = `${mobileDeskview == 'mobile' ? 'selectImgs' : 'selectDeskWhatsapp'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        pushClass += ' zoomed';
    }

    let emailClass = `${mobileDeskview == 'mobile' ? 'selectImgs' : 'selectDeskWhatsapp'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        emailClass += ' zoomed';
    }

    let MobileScrollWp = `${mobileDeskview == 'mobile' ? 'MobileScrollWpMobile' : 'MobileScrollWpDesk'}`
    if (mobileDeskview == 'desktop' && isZoomed) {
        MobileScrollWp += ' MobileScrollWpDeskZoom';
    }

    let deskClass = `${mobileDeskview === 'mobile' ? 'MobileScreen' : 'DeskScreen'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        deskClass += ' deskZoom';
    }

    let platformPreviewClass = `${mobileDeskview == 'mobile' ? 'MobileScreenPlat' : 'MobileScreenSmsDesk'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        platformPreviewClass += ' platformPreviewZoom';
    }

    let platformPreviewCont = `${mobileDeskview == 'mobile' ? 'previewStylePlatform' : 'previewStylePlatformDesk'} `
    if (mobileDeskview === 'desktop' && isZoomed) {
        platformPreviewCont += ' platformPreviewContZoom';
    }

    let pushPreview = `${mobileDeskview == 'mobile' ? 'MobileScreenPush' : 'DeskScreenPush'} `
    if (mobileDeskview === 'desktop' && isZoomed) {
        pushPreview += ' pushPreviewZoom';
    }

    let pushCont = `${mobileDeskview == 'mobile' ? 'previewStylePush' : 'previewStylePushDesk'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        pushCont += ' pushContZoom';
    }

    let emailPreviewCont = `${mobileDeskview == 'mobile' ? 'MobileScreenEmail' : 'DeskScreenSms'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        emailPreviewCont += ' emailPreviewContZoom';
    }

    let chatReply = `${mobileDeskview == 'desktop' ? 'buttonStyleDesk' : 'buttonStyle'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        chatReply += ' chatReplyBoxZoom';
    }

    let emailZoomClass = `${mobileDeskview == 'mobile' ? 'previewEmailBody' : 'previewEmailBodyDesk'}`
    if (mobileDeskview === 'desktop' && isZoomed) {
        emailZoomClass += ' emailZoomClassZoom';
    }

    const handleSampleCont = (e) => {
        let copyText = verificationCodeText;
        let newValue = e.target.value || "{{1}}";
        copyText = copyText.replace("{{1}}", newValue);
        setHtmlTextBody(copyText);
    }
    
    const handleClose = () => setShow(false);
    const handleClosea = () => setShow(false);

        const [isDisabled, setIsDisabled] = useState(false);
      
        useEffect(() => {
          if (mobileDeskview === 'mobile' && marketingTemplate === 'sms') {
            setIsDisabled(true);
          } else {
            setIsDisabled(false);
          }
        }, [mobileDeskview, marketingTemplate]);

        const [isOpen, setIsOpen] = useState(false);

        const openPopup = () => {
            setIsOpen(true);
        };

        const closePopup = () => {
            setIsOpen(false);
        };
    
    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Create template message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-lg-8 col-md-8 col-sm-12'>
                            <div className='bodyPoppupL'>
                                <div>
                                    {sampleTemplate ? <SampleTemplate
                                        onClose={onClose}
                                        closeSamplePage={() => {
                                            setSampleTemplate(false)
                                            setSampleTemplateChoose(false)
                                            setCleanTextBody("");
                                            setHtmlTextBody("");

                                            setFromName("")
                                            setFromNameShow(false)
                                        }}
                                        templateOnchange={(samplehtmltext) => {
                                            samplehtmltext = samplehtmltext.replaceAll('{{name}}', 'John');
                                            setFromName("John")
                                            setFromNameShow(true)

                                            handleTextBodyChange(samplehtmltext)
                                            setSampleTemplate(false)
                                            setSampleTemplateChoose(true)
                                        }}

                                        createOwnTemplateOnClick={() => {
                                            setSampleTemplateChoose(false)
                                            setSampleTemplate(false)

                                            setFromName("")
                                            setFromNameShow(false)
                                        }}
                                    /> : null}
                                    <div>
                                        <div className='popupInput'>
                                            <div className='selectInputs'>
                                                <label>Template Name</label>
                                                <input
                                                    placeholder='Template Name'
                                                    type='text'
                                                />
                                            </div>
                                            <div className="App categoryWhole selectInputs">
                                                <label htmlFor="type">Type</label>
                                                <div className='CategorySelect'>
                                                    <Dropdown
                                                        className='packageDropdown'
                                                        options={typeSelectOption}
                                                        onChange={handleTypeOption}
                                                        value={type}
                                                        placeholder="Select an option"
                                                    />
                                                </div>
                                            </div>
                                            <div className="App categoryWhole selectInputs">
                                                <label htmlFor="language">Language</label>
                                                <div className='CategorySelect'>
                                                    <Dropdown
                                                        className='packageDropdown'
                                                        options={languagesSelectOption.filter(op => op.value !== type)}
                                                        onChange={handleLanguagesOption}
                                                        value={language}
                                                        placeholder="Select an option"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='identification'>
                                            <Dropdown
                                                id="broadcast"
                                                options={typeValue}
                                                onChange={handleIdentification}
                                                value={identification}
                                                placeholder="Select an option"
                                            />
                                        </div>
                                    </div>
                                    {type.value == 'Yellow' || type.value == 'Blue' || type.value == 'Green' || type.value == 'Red' ? <>
                                        <div>
                                            <div className='poppupRadioCont'>
                                                <div>
                                                    <p className='selectMarketing'>Select Marketing template</p>
                                                </div>

                                                {/* Yellow */}

                                                {(identification.value == 'marketing/ads') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "whatsapp" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("whatsapp")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "whatsapp" ? "radio-active" : ""}`}>
                                                            <span className="radio-btn"></span>
                                                            <label htmlFor="whatsapp">WhatsApp</label><br />
                                                        </div>
                                                    </button>
                                                    {mobileDeskview === 'mobile' && (
                                                        <button 
                                                            className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "sms" ? "active__standardbutton" : ""}`}
                                                            onClick={() => changeMarketingTemplate("sms")}
                                                        >
                                                            <div className={`poppupInputLabel ${marketingTemplate === "sms" ? "radio-active" : ""}`}>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="sms">SMS</label><br />
                                                            </div>
                                                        </button>
                                                    )}
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'surveys') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "whatsapp" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("whatsapp")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "whatsapp" ? "radio-active" : ""}`}>
                                                            <span className="radio-btn"></span>
                                                            <label htmlFor="whatsapp">WhatsApp</label><br />
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Interactive Prompts') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "whatsapp" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("whatsapp")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "whatsapp" ? "radio-active" : ""}`}>
                                                            <span className="radio-btn"></span>
                                                            <label htmlFor="whatsapp">WhatsApp</label><br />
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {/* Red */}

                                                {(identification.value == 'Emergency') && <div className='poppupRadio'>
                                                    {mobileDeskview === 'mobile' && (
                                                        <button 
                                                            className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "sms" ? "active__standardbutton" : ""}`}
                                                            onClick={() => changeMarketingTemplate("sms")}
                                                        >
                                                            <div className={`poppupInputLabel ${marketingTemplate === "sms" ? "radio-active" : ""}`}>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="sms">SMS</label><br />
                                                            </div>
                                                        </button>
                                                    )}
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Account Verfication') && <div className='poppupRadio'>
                                                    {mobileDeskview === 'mobile' && (
                                                        <button 
                                                            className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "sms" ? "active__standardbutton" : ""}`}
                                                            onClick={() => changeMarketingTemplate("sms")}
                                                        >
                                                            <div className={`poppupInputLabel ${marketingTemplate === "sms" ? "radio-active" : ""}`}>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="sms">SMS</label><br />
                                                            </div>
                                                        </button>
                                                    )}
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == '3rd-Party Authentication') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'MFA') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Failed Activity') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "whatsapp" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("whatsapp")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "whatsapp" ? "radio-active" : ""}`}>
                                                            <span className="radio-btn"></span>
                                                            <label htmlFor="whatsapp">WhatsApp</label><br />
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Rejections') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Bad Activity') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {/* Blue */}

                                                {((identification.value == 'Credential Access/share') || (identification.value == 'Update notices') || (identification.value == 'Transactions')) && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'Helper tours') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {/* Green */}

                                                {((identification.value == 'Approvals') || (identification.value == 'Lifts')) && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "push" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("push")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "push" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="push">Push</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {(identification.value == 'success activity') && <div className='poppupRadio'>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "platform" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("platform")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "platform" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="platform">Platform</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <button 
                                                        className={`sc-jIBlqr bsHFOv market-radio__button button-standard ${marketingTemplate === "email" ? "active__standardbutton" : ""}`}
                                                        onClick={() => changeMarketingTemplate("email")}
                                                    >
                                                        <div className={`poppupInputLabel ${marketingTemplate === "email" ? "radio-active" : ""}`}>
                                                            <div className='poppupInputLabelCarousel'>
                                                                <span className="radio-btn"></span>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>}

                                                {/* template */}
                                                {/* whatsapp */}

                                                {(marketingTemplate == 'whatsapp') && <>
                                                    <div className='paraLinkHr'>
                                                        <div className='paraLink'>
                                                            <p>All templates must adhere to WhatsApp's Template Message Guidelines.<a href='https://support.wati.io/l/en/article/d0ewqzh7gv-how-to-avoid-template-message-rejection?_gl=1*10pj2tu*_ga*NjY4NjgyOTg4LjE3MTU3NTA3MTA.*_ga_HYL717ZD73*MTcxNjI2NjI5MS4xNS4xLjE3MTYyNjY0NDkuNTQuMC4w' target="_blank">Click here to read</a></p>
                                                        </div>
                                                    </div>
                                                    <div className="poppupBroadcast">
                                                        <h5>Broadcast title</h5>
                                                        <p>Highlight your brand here, use images or videos, to stand out</p>
                                                        <div className="App">
                                                            <div className='BroadcastSelect'>
                                                                <Dropdown
                                                                    id="broadcast"
                                                                    options={broadcastSelectOption.filter(op => op.value !== broadcast)}
                                                                    onChange={handleBroadcastOption}
                                                                    value={broadcast}
                                                                    placeholder="Select an option"
                                                                />
                                                            </div>
                                                        </div>
                                                        {broadcast.value == 'text' &&
                                                            <div className="titleInput">
                                                                <input type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                                                            </div>}
                                                        {broadcast.value == 'media' &&
                                                            <div>
                                                                <div className='imageVdoCont'>
                                                                    <input
                                                                        type="radio"
                                                                        id="image"
                                                                        name="media"
                                                                        value="IMAGE"
                                                                        checked={selectOption === 'IMAGE'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="image">Image</label>
                                                                    <input
                                                                        type="radio"
                                                                        id="video"
                                                                        name="media"
                                                                        value="VIDEO"
                                                                        checked={selectOption === 'VIDEO'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="video">Video</label>
                                                                    <input
                                                                        type="radio"
                                                                        id="document"
                                                                        name="media"
                                                                        value="DOCUMENT"
                                                                        checked={selectOption === 'DOCUMENT'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="document">Document</label>
                                                                </div>
                                                                <div className='dropImg'>
                                                                    {selectOption === 'IMAGE' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Image: .jpeg, .png)</p>
                                                                            {filePreview && <img src={filePreview} alt="Image" className="documentVdoFileTxt" />}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/images/WATI_logo_square_2.png'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        ref={fileInputRef}
                                                                                        className="dropInput2"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectOption === 'VIDEO' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Video: .mp4)</p>
                                                                            {filePreview && (
                                                                                <video controls className='video'>
                                                                                    <source src={filePreview} type='video/mp4' className='documentVdoFile' />
                                                                                </video>
                                                                            )}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/videos/Wati.mp4'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        ref={fileInputRef}
                                                                                        className="dropInput2"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectOption === 'DOCUMENT' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Document: .pdf)</p>
                                                                            {filePreview && (<embed src={filePreview} className='documentVdoFile' />)}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/documents/Wati.pdf'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input type="file" ref={fileInputRef} className="dropInput2" onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {errorMessageFile && <p style={{ color: 'red' }}>{errorMessageFile}</p>}
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Body</h5>
                                                        <p>Make your messages personal using variables like and get more replies!</p>
                                                        <button onClick={handleOpenAttributePop} color="primary" className="btn btn-light-green" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                                                        {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname) => {
                                                            let copyHtmlTextBody = htmlTextBody
                                                            copyHtmlTextBody += `{{${vname}}}`
                                                            setHtmlTextBody(copyHtmlTextBody)
                                                            setCleanTextBody(copyHtmlTextBody);
                                                            setIsAttributePopOpen(false);

                                                        }} />}
                                                        <div className='errorThrow'>
                                                            {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters" : null}
                                                        </div>
                                                        <div className='poppupBodyInput'>
                                                            <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e) => {
                                                                handleTextBodyChange(e.target.value)
                                                            }}></textarea>
                                                            <div className='textAreaInputIcons'>
                                                                {/* <input type='text' disabled/> */}
                                                                <div className='poppupBodyDiv'>
                                                                    <div className='poppupBodyInputIcons'>
                                                                        <div>
                                                                            <MdOutlineEmojiEmotions className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIcon' />
                                                                        </div>
                                                                        <div>
                                                                            <FaItalic onClick={toggleItalic} style={{ cursor: 'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdStrikethroughS className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdLink className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                    </div>
                                                                    <div className='poppupBodyInputCont'>
                                                                        <h5>{textareaCount}/1024</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Footer <span className='poppupBroadcastTitleSpan'>(Optional)</span></h5>
                                                        <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                                                        <div className="poppupFooterInput">
                                                            <p className='footerCount'>{footerCount}/60</p>
                                                            <input style={footerStyle} type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange} />
                                                        </div>
                                                    </div>
                                                    <div className='poppupButton'>
                                                        <div className='poppupButtonDesign'>
                                                            <div>
                                                                <h5>Buttons <span className='poppupBroadcastTitleSpan'>(Recommended)</span><span className='ButtonCount'>{buttonCount}/7</span></h5>
                                                                <p className='poppupButtonDesignP'>Add quick replies and call to actions together for extra engagement!</p>
                                                            </div>
                                                            <div>
                                                                <label className="switch">
                                                                    <input type="checkbox" checked={isButtonChecked} className={`${isButtonChecked ? 'checkedStyle' : ''}`} onChange={() => { handleButtonToggle(isButtonChecked) }} />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {isButtonChecked && (

                                                            visitWebSiteArray.map((ival, index) => {
                                                                return <>
                                                                    {ival.type === "Visit Us" && <>
                                                                        <div className='visitAfterDelete'>{ival.visitData.length === 0 ? <>
                                                                            <Dropdown
                                                                                className='visitWebsiteButton'
                                                                                options={buttonSelectOption.filter(op => op.value !== buttonSelectOption[0].value)}
                                                                                onChange={(e) => {
                                                                                    visitWebSiteArray[index].visitWebsite = e.value
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                }}
                                                                                value={buttonSelectOption[0].value}
                                                                                placeholder="Select an option"
                                                                            />
                                                                            <button className='btn btn-light-green' onClick={() => {

                                                                                let valueConditionBased = buttonSelectOption[0].value;
                                                                                let iconBox = "Visit Us";
                                                                                let viewType = "visitUs";
                                                                                let buildObj = { visitWebsite: valueConditionBased, visitUsInput: "", staticDropdown: buttonStaticOption[0].value, visithttpInput: "", type: viewType }
                                                                                let typedText = "Visit Us"
                                                                                if (ival.visitData.length === 2) {
                                                                                    valueConditionBased = buttonSelectOption[1].value
                                                                                    iconBox = "callPhone";
                                                                                    viewType = "callPhone";
                                                                                    buildObj = { visitWebsite: valueConditionBased, buttonText: "", countryCodeText: "", type: viewType }
                                                                                    typedText = ""
                                                                                }

                                                                                visitWebSiteArray[index].visitData.push(buildObj)
                                                                                chatReplyBox.push({ type: iconBox, typedText })
                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                setChatReplyBox([...chatReplyBox])
                                                                                setButtonCount(buttonCount + 1)
                                                                            }} >Add Button</button>
                                                                        </> : null}</div>
                                                                        {ival.visitData.map((vmap, vindex) => {
                                                                            let { visitWebsite, visitUsInput, staticDropdown, visithttpInput, countryCodeText, buttonText } = vmap
                                                                            return <div className='visitWebsiteButtonsCont'>
                                                                                <div className='visitWebsiteButtonCont'>
                                                                                    <div className='visitWebsiteSelectCont'>
                                                                                        <Dropdown
                                                                                            className='visitWebsiteButton'
                                                                                            options={buttonSelectOption.filter(op => op.value !== visitWebsite)}
                                                                                            onChange={(e) => {
                                                                                                visitWebSiteArray[index].visitData[vindex].visitWebsite = e.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }}
                                                                                            value={visitWebsite}
                                                                                            placeholder="Select an option"
                                                                                        />


                                                                                        <div className='visitUsCont'>
                                                                                            <div className='visitUsConts'>
                                                                                                <input className='visitUsInput' maxLength='25' value={visitUsInput} type='text' placeholder='Visit Us' onChange={(e) => {
                                                                                                    visitWebSiteArray[index].visitData[vindex].visitUsInput = e.target.value
                                                                                                    chatReplyBox[vindex].typedText = e.target.value
                                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                                }} />
                                                                                            </div>

                                                                                            <div className='deleteIcon' onClick={() => {
                                                                                                visitWebSiteArray[index].visitData.splice(vindex, 1)
                                                                                                chatReplyBox.splice(index, 1)
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                setChatReplyBox([...chatReplyBox])
                                                                                                setButtonCount(buttonCount - 1)
                                                                                            }}>
                                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                                    <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                                </svg>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            {vindex == 0 && ival.visitData.length < 3 ? <button className='btn btn-light-green' onClick={() => {

                                                                                                let valueConditionBased = buttonSelectOption[0].value;
                                                                                                let iconBox = "Visit Us";
                                                                                                let viewType = "visitUs";
                                                                                                let buildObj = { visitWebsite: valueConditionBased, visitUsInput: "", staticDropdown: buttonStaticOption[0].value, visithttpInput: "", type: viewType }
                                                                                                let typedText = "Visit Us"
                                                                                                if (ival.visitData.length === 2) {
                                                                                                    valueConditionBased = buttonSelectOption[1].value
                                                                                                    iconBox = "callPhone";
                                                                                                    viewType = "callPhone";
                                                                                                    buildObj = { visitWebsite: valueConditionBased, buttonText: "", countryCodeText: "", type: viewType }
                                                                                                    typedText = ""
                                                                                                }
                                                                                                visitWebSiteArray[index].visitData.push(buildObj)
                                                                                                chatReplyBox.push({ type: iconBox, typedText })
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                setChatReplyBox([...chatReplyBox])
                                                                                                setButtonCount(buttonCount + 1)
                                                                                            }} >Add Button</button> : null}
                                                                                        </div>
                                                                                    </div>


                                                                                    {vmap.type === "visitUs" && <div className='visitHttpCont'>
                                                                                        <div className='staticDropdown'>
                                                                                            <Dropdown
                                                                                                className='staticButton'
                                                                                                options={buttonStaticOption.filter(op => op.value !== staticDropdown)}
                                                                                                onChange={(e) => {
                                                                                                    visitWebSiteArray[index].staticDropdown = e.value
                                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                }}
                                                                                                value={staticDropdown}
                                                                                                placeholder="Select an option"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <input className='visithttpInput' value={visithttpInput} type='text' placeholder='https://www.wati.io' onChange={(e) => {
                                                                                                visitWebSiteArray[index].visithttpInput = e.target.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }} />
                                                                                        </div>
                                                                                    </div>}

                                                                                    {vmap.type === "callPhone" && <>
                                                                                        <div>
                                                                                            <input className='callhttpInput' value={buttonText} type='text' placeholder='https://www.wati.io' onChange={(e) => {
                                                                                                visitWebSiteArray[index].buttonText = e.target.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }} />
                                                                                        </div>
                                                                                    </>
                                                                                    }


                                                                                </div>
                                                                            </div>
                                                                        })}

                                                                    </>}

                                                                    {ival.type === "copy" ? <>
                                                                        <div className='copyOfferCodeButtonCont'>
                                                                            <input className='visitWebsiteInput' type='text' placeholder='Copy offer code' value={""} disabled />
                                                                            <div>
                                                                                {visitWebSiteArray[index].coperData.length === 0 ? <button className='btn btn-light-green' onClick={() => {
                                                                                    visitWebSiteArray[index].coperData.push({ copyCouponCode: "", copyOfferCode: "" })
                                                                                    chatReplyBox.push({ type: "copy", typedText: "" })
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount + 1)
                                                                                }} >Add Button</button> : null}
                                                                            </div>
                                                                            {visitWebSiteArray[index].coperData.map((cmap) => {
                                                                                let { copyCouponCode, copyOfferCode } = cmap
                                                                                return <div className='copyOfferCont'>
                                                                                    <input className='copyOfferInput' type='text' placeholder='Copy offer code' value={copyOfferCode} disabled />
                                                                                    <input className='copyCouponInput' type='text' placeholder='Enter coupon code to copy' value={copyCouponCode} onChange={(e) => {
                                                                                        visitWebSiteArray[index].visithttpInput = e.target.value
                                                                                        setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    }} />
                                                                                </div>
                                                                            })}
                                                                            {visitWebSiteArray[index].coperData.length ? <>
                                                                                <div className='deleteIcon' onClick={() => {
                                                                                    visitWebSiteArray[index].coperData.splice(0, 1)
                                                                                    chatReplyBox.splice(index, 1)
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount - 1)
                                                                                }}>
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                        <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                    </svg>
                                                                                </div>
                                                                            </> : null}
                                                                        </div>
                                                                    </> : null}

                                                                    {ival.type === "reply" ? <div className='quickRepliesButtonCont'>
                                                                        <input className='visitWebsiteInput' value={"Quick replies"} type='text' placeh
                                                                            older='Quick replies'
                                                                            disabled
                                                                        />
                                                                        <div> {visitWebSiteArray[index].ReplyData.map((cmap, cindex) => {
                                                                            return <div className='replyCont'>
                                                                                <input className='copyOfferInput' value={cmap.buttonText} type='text' placeh
                                                                                    older='Button text'
                                                                                    placeholder='Button Text'
                                                                                    disabled
                                                                                    onChange={(e) => {
                                                                                        visitWebSiteArray[index].ReplyData = e.target.value
                                                                                        setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    }} />

                                                                                <div className='deleteIcon' onClick={() => {
                                                                                    visitWebSiteArray[index].ReplyData.splice(cindex, 1)
                                                                                    chatReplyBox.splice(index, 1)
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount - 1)
                                                                                }}>
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                        <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        })}</div>
                                                                        <div>
                                                                            {visitWebSiteArray[index].ReplyData.length < 3 ? <button className='btn btn-light-green' onClick={() => {
                                                                                visitWebSiteArray[index].ReplyData.push({ buttonText: "" })
                                                                                chatReplyBox.push({ type: "reply", typedText: "" })
                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                setChatReplyBox([...chatReplyBox])
                                                                                setButtonCount(buttonCount + 1)

                                                                            }} >Add Button</button> : null}


                                                                        </div>
                                                                    </div> : null}

                                                                </>
                                                            })
                                                        )}
                                                    </div>
                                                    <div className='poppupButtons mb-20'>
                                                        <a href='' className='btn btn-light-green'>Save as draft</a>
                                                        <a href='' className='btn btn-green'>Save and submit</a>
                                                    </div>
                                                </>}

                                                {/* sms */}

                                                {(marketingTemplate == 'sms') && <>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Body</h5>
                                                        <p>Make your messages personal using variables like and get more replies!</p>
                                                        <button onClick={handleOpenAttributePop} color="primary" className="btn btn-light-green" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                                                        {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname) => {
                                                            let copyHtmlTextBody = htmlTextBody
                                                            copyHtmlTextBody += `{{${vname}}}`
                                                            setHtmlTextBody(copyHtmlTextBody)
                                                            setCleanTextBody(copyHtmlTextBody);
                                                            setIsAttributePopOpen(false);

                                                        }} />}
                                                        <div className='errorThrow'>
                                                            {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters" : null}
                                                        </div>
                                                        <span className='textareaSms'>{textareaCount}/1024</span>
                                                        <div className='poppupBodyInputSms'>
                                                            <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e) => {
                                                                handleTextBodyChange(e.target.value)
                                                            }}></textarea>
                                                        </div>
                                                    </div>
                                                </>}

                                                {/* push */}

                                                {(marketingTemplate == 'push') && <>
                                                    <div className="poppupBroadcast">
                                                        <h5>Notification title</h5>
                                                        <p>Highlight your brand here, use images or videos, to stand out</p>
                                                        <div className="titleInput">
                                                            <input maxLength='20' type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                                                        </div>
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Body</h5>
                                                        <p>Make your messages personal using variables like and get more replies!</p>
                                                        <button onClick={handleOpenAttributePop} color="primary" className="btn btn-light-green" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                                                        {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname) => {
                                                            let copyHtmlTextBody = htmlTextBody
                                                            copyHtmlTextBody += `{{${vname}}}`
                                                            setHtmlTextBody(copyHtmlTextBody)
                                                            setCleanTextBody(copyHtmlTextBody);
                                                            setIsAttributePopOpen(false);

                                                        }} />}
                                                        {/* <div className='errorThrow'>
                              {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters"  : null}
                            </div> */}
                                                        <div className='poppupBodyInput'>
                                                            <textarea rows="10" maxLength='20' cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e) => {
                                                                handleTextBodyChange(e.target.value)
                                                            }}></textarea>
                                                            <div className='textAreaInputIcons'>
                                                                {/* <input type='text' disabled/> */}
                                                                <div className='poppupBodyDiv'>
                                                                    <div className='poppupBodyInputIcons'>
                                                                        <div>
                                                                            <MdOutlineEmojiEmotions className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIcon' />
                                                                        </div>
                                                                        <div>
                                                                            <FaItalic onClick={toggleItalic} style={{ cursor: 'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdStrikethroughS className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdLink className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className='poppupBodyInputCont'>
                                        <h5>{textareaCount}/1024</h5>
                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Footer <span className='poppupBroadcastTitleSpan'>(Optional)</span></h5>
                                                        <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                                                        <div className="poppupFooterInput">
                                                            <input maxLength='20' type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange} />
                                                        </div>
                                                    </div>
                                                    {/* <div className='poppupButton'>
                          <div className='poppupButtonDesign'>
                            <div>
                              <h5>Buttons <span className='poppupBroadcastTitleSpan'>(Recommended)</span><span className='ButtonCount'>{buttonCount}/7</span></h5>
                              <p className='poppupButtonDesignP'>Add quick replies and call to actions together for extra engagement!</p>
                            </div>
                            <div>
                              <label className="switch">
                                <input type="checkbox" checked={isButtonChecked} className={`${isButtonChecked ? 'checkedStyle' : ''}`} onChange={()=>{handleButtonToggle(isButtonChecked)}} />
                                <span className="slider"></span>
                              </label>
                            </div>
                          </div>
                          {isButtonChecked && (
                        
                        visitWebSiteArray.map((ival,index)=>{
                            return <>
                            {ival.type ==="Visit Us" && <> 
                            <div className='visitAfterDelete'>{ival.visitData.length ===0 ? <>
                              <Dropdown
                                className='visitWebsiteButton'
                                options={buttonSelectOption.filter(op => op.value !==buttonSelectOption[0].value)}
                                onChange={(e)=>{
                                  visitWebSiteArray[index].visitWebsite=e
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                }}
                                value={buttonSelectOption[0].value}
                                placeholder="Select an option"
                              />
                              <input className='visitWebsiteButtonAdd'  type='button' value='Add button'  onClick={()=>{
                                    visitWebSiteArray[index].visitData.push({visitWebsite:buttonSelectOption[0].value,visitUsInput:"",staticDropdown:buttonStaticOption[0].value,visithttpInput:""})
                                    chatReplyBox.push({type:"Visit Us"})
                                    setVisitWebSiteArray([...visitWebSiteArray])
                                    setChatReplyBox([...chatReplyBox])
                                  }}/>
                            </>: null}</div>
                            {ival.visitData.map((vmap,vindex)=>{
                              let {visitWebsite,visitUsInput,staticDropdown,visithttpInput}=vmap
                                return <div className='visitWebsiteButtonsCont'>
                                <div className='visitWebsiteButtonCont'>
                                  <div className='visitWebsiteSelectCont'>
                                    <Dropdown
                                      className='visitWebsiteButton'
                                      options={buttonSelectOption.filter(op => op.value !== visitWebsite)}
                                      onChange={(e)=>{
                                        visitWebSiteArray[index].visitWebsite=e
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                      }}
                                      value={visitWebsite}
                                      placeholder="Select an option"
                                    />
                                      <div className='visitUsCont'>
                                        <div className='visitUsConts'>
                                          <input className='visitUsInput' value={visitUsInput} type='text' placeholder='Visit Us' onChange={(e)=>{
                                            visitWebSiteArray[index].visitUsInput=e.target.value
                                            setVisitWebSiteArray([...visitWebSiteArray])
                                            setVisitCont(e.target.value)
                                          }}/>
                                        </div>
                                        <div className='deleteIcon' onClick={()=>{
                                          visitWebSiteArray[index].visitData.splice(vindex,1)
                                          chatReplyBox.splice(index,1)
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                            <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                          </svg>
                                        </div>
                                      </div>
                                      <div>
                                        {vindex ==0 && ival.visitData.length < 3?  <input className='visitWebsiteButtonAdd'  type='button' value='Add button'  onClick={()=>{
                                          let optsel =buttonSelectOption[0].value
                                          if(visitWebSiteArray[index].visitData.length ==2){
                                            optsel =buttonSelectOption[1].value
                                          }
                                          visitWebSiteArray[index].visitData.push({visitWebsite:optsel,visitUsInput:"",staticDropdown:buttonStaticOption[0].value,visithttpInput:""})
                                          chatReplyBox.push({type:"Visit Us"})
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount+1)
                                        }}/>:null}
                                      </div>
                                  </div>
                                  <div className='visitHttpCont'>
                                    <div className='staticDropdown'>
                                      <Dropdown
                                        className='staticButton'
                                        options={buttonStaticOption.filter(op => op.value !== staticDropdown)}
                                        onChange={(e)=>{
                                          visitWebSiteArray[index].staticDropdown=e
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                        }}
                                        value={staticDropdown}
                                        placeholder="Select an option"
                                      />
                                    </div>
                                    <div>
                                      <input className='visithttpInput' value={visithttpInput}  type='text' placeholder='https://www.wati.io' onChange={(e)=>{
                                        visitWebSiteArray[index].visithttpInput=e.target.value
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                      }}/>
                                    </div>
                                  </div>
                                </div>
                                </div>
                            })}
                            
                            </>}

                            {ival.type ==="copy" ? <> 
                              <div className='copyOfferCodeButtonCont'>
                                <input className='visitWebsiteInput'  type='text' placeholder='Copy offer code' value={""} disabled/>
                              <div>
                                {visitWebSiteArray[index].coperData.length === 0 ?   <input className='visitWebsiteButtonAdd'  type='button' value='Add button' onClick={()=>{
                                  visitWebSiteArray[index].coperData.push({copyCouponCode:"",copyOfferCode:""})
                                  chatReplyBox.push({type:"copy"})
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                  setChatReplyBox([...chatReplyBox])
                                  setButtonCount(buttonCount+1)
                                }}/>: null}
                              </div>
                              {visitWebSiteArray[index].coperData.map((cmap)=>{
                                let {copyCouponCode,copyOfferCode}=cmap
                              return <div className='copyOfferCont'>
                                <input className='copyOfferInput'  type='text' placeholder='Copy offer code' value={copyOfferCode} disabled/>
                                <input className='copyCouponInput'  type='text' placeholder='Enter coupon code to copy' value={copyCouponCode} onChange={(e)=>{
                                    visitWebSiteArray[index].visithttpInput=e.target.value
                                    setVisitWebSiteArray([...visitWebSiteArray])
                                }}/>
                              </div>
                              })}
                              {visitWebSiteArray[index].coperData.length ? <>
                                <div className='deleteIcon' onClick={()=>{
                                        visitWebSiteArray[index].coperData.splice(0,1)
                                        chatReplyBox.splice(index,1)
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                        setChatReplyBox([...chatReplyBox])
                                        setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                    <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                  </svg>
                                </div>
                              </> : null}
                            </div>
                            </>:null}                   

                            {ival.type ==="reply" ? <div className='quickRepliesButtonCont'>

                        <input className='visitWebsiteInput' value={"Quick replies"}  type='text' placeh
                        older='Quick replies' 
                        disabled
                        />
                        

                        {visitWebSiteArray[index].ReplyData.map((cmap,cindex)=>{
                        return<div className='replyCont'>
                          <input className='copyOfferInput' value={cmap.buttonText}  type='text' placeh
                        older='Button text' 
                        placeholder='Button Text'
                        disabled
                        onChange={(e)=>{
                        visitWebSiteArray[index].ReplyData=e.target.value
                        setVisitWebSiteArray([...visitWebSiteArray])
                  }}/>
                  
                      <div className='deleteIcon' onClick={()=>{
                                          visitWebSiteArray[index].ReplyData.splice(cindex,1)
                                          chatReplyBox.splice(index,1)
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                            <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                          </svg>
                                        </div>
                              </div>
                        })}
                              <div>
                                {visitWebSiteArray[index].ReplyData.length < 3 ?    <input className='visitWebsiteButtonAdd' type='button' value='Add button' onClick={()=>{
                                  visitWebSiteArray[index].ReplyData.push({buttonText:""})
                                  chatReplyBox.push({type:"reply"})
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                  setChatReplyBox([...chatReplyBox])
                                  setButtonCount(buttonCount+1)
                                  
                                }}/> : null}
                            

                              </div>
                            </div> : null}
                            
                            </>
                          }) 
                            )}
                          </div> */}
                                                </>}

                                                {/* platform */}

                                                {(marketingTemplate == 'platform') && <>
                                                    <div className="poppupBroadcast">
                                                        <h5>Notification title</h5>
                                                        <p>Highlight your brand here, use images or videos, to stand out</p>
                                                        <div className="titleInput">
                                                            <input type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                                                        </div>
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Body</h5>
                                                        <p>Make your messages personal using variables like and get more replies!</p>
                                                        <button onClick={handleOpenAttributePop} color="primary" className="btn btn-light-green" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                                                        {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname) => {
                                                            let copyHtmlTextBody = htmlTextBody
                                                            copyHtmlTextBody += `{{${vname}}}`
                                                            setHtmlTextBody(copyHtmlTextBody)
                                                            setCleanTextBody(copyHtmlTextBody);
                                                            setIsAttributePopOpen(false);

                                                        }} />}
                                                        <div className='errorThrow'>
                                                            {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters" : null}
                                                        </div>
                                                        <div className='poppupBodyInput'>
                                                            <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e) => {
                                                                handleTextBodyChange(e.target.value)
                                                            }}></textarea>
                                                            <div className='textAreaInputIcons'>
                                                                {/* <input type='text' disabled/> */}
                                                                <div className='poppupBodyDiv'>
                                                                    <div className='poppupBodyInputIcons'>
                                                                        <div>
                                                                            <MdOutlineEmojiEmotions className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIcon' />
                                                                        </div>
                                                                        <div>
                                                                            <FaItalic onClick={toggleItalic} style={{ cursor: 'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdStrikethroughS className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdLink className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                    </div>
                                                                    <div className='poppupBodyInputCont'>
                                                                        <h5>{textareaCount}/1024</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Footer <span className='poppupBroadcastTitleSpan'>(Optional)</span></h5>
                                                        <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                                                        <div className="poppupFooterInput">
                                                            <input type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange} />
                                                        </div>
                                                    </div>
                                                    <div className='poppupButton'>
                                                        <div className='poppupButtonDesign'>
                                                            <div>
                                                                <h5>Buttons <span className='poppupBroadcastTitleSpan'>(Recommended)</span><span className='ButtonCount'>{buttonCount}/7</span></h5>
                                                                <p className='poppupButtonDesignP'>Add quick replies and call to actions together for extra engagement!</p>
                                                            </div>
                                                            <div>
                                                                <label className="switch">
                                                                    <input type="checkbox" checked={isButtonChecked} className={`${isButtonChecked ? 'checkedStyle' : ''}`} onChange={() => { handleButtonToggle(isButtonChecked) }} />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {isButtonChecked && (

                                                            visitWebSiteArray.map((ival, index) => {
                                                                return <>
                                                                    {ival.type === "Visit Us" && <>
                                                                        <div className='visitAfterDelete'>{ival.visitData.length === 0 ? <>
                                                                            <Dropdown
                                                                                className='visitWebsiteButton'
                                                                                options={buttonSelectOption.filter(op => op.value !== buttonSelectOption[0].value)}
                                                                                onChange={(e) => {
                                                                                    visitWebSiteArray[index].visitWebsite = e.value
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                }}
                                                                                value={buttonSelectOption[0].value}
                                                                                placeholder="Select an option"
                                                                            />
                                                                            <button className='btn btn-light-green' onClick={() => {

                                                                                let valueConditionBased = buttonSelectOption[0].value;
                                                                                let iconBox = "Visit Us";
                                                                                let viewType = "visitUs";
                                                                                let buildObj = { visitWebsite: valueConditionBased, visitUsInput: "", staticDropdown: buttonStaticOption[0].value, visithttpInput: "", type: viewType }
                                                                                let typedText = "Visit Us"
                                                                                if (ival.visitData.length === 2) {
                                                                                    valueConditionBased = buttonSelectOption[1].value
                                                                                    iconBox = "callPhone";
                                                                                    viewType = "callPhone";
                                                                                    buildObj = { visitWebsite: valueConditionBased, buttonText: "", countryCodeText: "", type: viewType }
                                                                                    typedText = ""
                                                                                }

                                                                                visitWebSiteArray[index].visitData.push(buildObj)
                                                                                chatReplyBox.push({ type: iconBox, typedText })
                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                setChatReplyBox([...chatReplyBox])
                                                                                setButtonCount(buttonCount + 1)
                                                                            }} >Add Button</button>
                                                                        </> : null}</div>
                                                                        {ival.visitData.map((vmap, vindex) => {
                                                                            let { visitWebsite, visitUsInput, staticDropdown, visithttpInput, countryCodeText, buttonText } = vmap
                                                                            return <div className='visitWebsiteButtonsCont'>
                                                                                <div className='visitWebsiteButtonCont'>
                                                                                    <div className='visitWebsiteSelectCont'>
                                                                                        <Dropdown
                                                                                            className='visitWebsiteButton'
                                                                                            options={buttonSelectOption.filter(op => op.value !== visitWebsite)}
                                                                                            onChange={(e) => {
                                                                                                visitWebSiteArray[index].visitData[vindex].visitWebsite = e.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }}
                                                                                            value={visitWebsite}
                                                                                            placeholder="Select an option"
                                                                                        />


                                                                                        <div className='visitUsCont'>
                                                                                            <div className='visitUsConts'>
                                                                                                <input className='visitUsInput' maxLength='25' value={visitUsInput} type='text' placeholder='Visit Us' onChange={(e) => {
                                                                                                    visitWebSiteArray[index].visitData[vindex].visitUsInput = e.target.value
                                                                                                    chatReplyBox[vindex].typedText = e.target.value
                                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                                }} />
                                                                                            </div>

                                                                                            <div className='deleteIcon' onClick={() => {
                                                                                                visitWebSiteArray[index].visitData.splice(vindex, 1)
                                                                                                chatReplyBox.splice(index, 1)
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                setChatReplyBox([...chatReplyBox])
                                                                                                setButtonCount(buttonCount - 1)
                                                                                            }}>
                                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                                    <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                                </svg>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            {vindex == 0 && ival.visitData.length < 3 ? <button className='btn btn-light-green' onClick={() => {

                                                                                                let valueConditionBased = buttonSelectOption[0].value;
                                                                                                let iconBox = "Visit Us";
                                                                                                let viewType = "visitUs";
                                                                                                let buildObj = { visitWebsite: valueConditionBased, visitUsInput: "", staticDropdown: buttonStaticOption[0].value, visithttpInput: "", type: viewType }
                                                                                                let typedText = "Visit Us"
                                                                                                if (ival.visitData.length === 2) {
                                                                                                    valueConditionBased = buttonSelectOption[1].value
                                                                                                    iconBox = "callPhone";
                                                                                                    viewType = "callPhone";
                                                                                                    buildObj = { visitWebsite: valueConditionBased, buttonText: "", countryCodeText: "", type: viewType }
                                                                                                    typedText = ""
                                                                                                }
                                                                                                visitWebSiteArray[index].visitData.push(buildObj)
                                                                                                chatReplyBox.push({ type: iconBox, typedText })
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                setChatReplyBox([...chatReplyBox])
                                                                                                setButtonCount(buttonCount + 1)
                                                                                            }} >Add Button</button> : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    {vmap.type === "visitUs" && <div className='visitHttpCont'>
                                                                                        <div className='staticDropdown'>
                                                                                            <Dropdown
                                                                                                className='staticButton'
                                                                                                options={buttonStaticOption.filter(op => op.value !== staticDropdown)}
                                                                                                onChange={(e) => {
                                                                                                    visitWebSiteArray[index].staticDropdown = e.value
                                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                                }}
                                                                                                value={staticDropdown}
                                                                                                placeholder="Select an option"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <input className='visithttpInput' value={visithttpInput} type='text' placeholder='https://www.wati.io' onChange={(e) => {
                                                                                                visitWebSiteArray[index].visithttpInput = e.target.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }} />
                                                                                        </div>
                                                                                    </div>}

                                                                                    {vmap.type === "callPhone" && <>
                                                                                        <div>
                                                                                            <input className='callhttpInput' value={buttonText} type='text' placeholder='https://www.wati.io' onChange={(e) => {
                                                                                                visitWebSiteArray[index].buttonText = e.target.value
                                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                            }} />
                                                                                        </div>
                                                                                    </>
                                                                                    }


                                                                                </div>
                                                                            </div>
                                                                        })}

                                                                    </>}

                                                                    {ival.type === "copy" ? <>
                                                                        <div className='copyOfferCodeButtonCont'>
                                                                            <input className='visitWebsiteInput' type='text' placeholder='Copy offer code' value={""} disabled />
                                                                            <div>
                                                                                {visitWebSiteArray[index].coperData.length === 0 ? <button className='btn btn-light-green' onClick={() => {
                                                                                    visitWebSiteArray[index].coperData.push({ copyCouponCode: "", copyOfferCode: "" })
                                                                                    chatReplyBox.push({ type: "copy", typedText: "" })
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount + 1)
                                                                                }} >Add Button</button> : null}
                                                                            </div>
                                                                            {visitWebSiteArray[index].coperData.map((cmap) => {
                                                                                let { copyCouponCode, copyOfferCode } = cmap
                                                                                return <div className='copyOfferCont'>
                                                                                    <input className='btn btn-light-green' type='text' placeholder='Copy offer code' value={copyOfferCode} disabled />
                                                                                    <input className='btn btn-light-green' type='text' placeholder='Enter coupon code to copy' value={copyCouponCode} onChange={(e) => {
                                                                                        visitWebSiteArray[index].visithttpInput = e.target.value
                                                                                        setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    }} />
                                                                                </div>
                                                                            })}
                                                                            {visitWebSiteArray[index].coperData.length ? <>
                                                                                <div className='deleteIcon' onClick={() => {
                                                                                    visitWebSiteArray[index].coperData.splice(0, 1)
                                                                                    chatReplyBox.splice(index, 1)
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount - 1)
                                                                                }}>
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                        <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                    </svg>
                                                                                </div>
                                                                            </> : null}
                                                                        </div>
                                                                    </> : null}

                                                                    {ival.type === "reply" ? <div className='quickRepliesButtonCont'>

                                                                        <input className='visitWebsiteInput' value={"Quick replies"} type='text' placeh
                                                                            older='Quick replies'
                                                                            disabled
                                                                        />


                                                                        <div> {visitWebSiteArray[index].ReplyData.map((cmap, cindex) => {
                                                                            return <div className='replyCont'>
                                                                                <input className='copyOfferInput' value={cmap.buttonText} type='text' placeh
                                                                                    older='Button text'
                                                                                    placeholder='Button Text'
                                                                                    disabled
                                                                                    onChange={(e) => {
                                                                                        visitWebSiteArray[index].ReplyData = e.target.value
                                                                                        setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    }} />

                                                                                <div className='deleteIcon' onClick={() => {
                                                                                    visitWebSiteArray[index].ReplyData.splice(cindex, 1)
                                                                                    chatReplyBox.splice(index, 1)
                                                                                    setVisitWebSiteArray([...visitWebSiteArray])
                                                                                    setChatReplyBox([...chatReplyBox])
                                                                                    setButtonCount(buttonCount - 1)
                                                                                }}>
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                                                                        <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        })}</div>
                                                                        <div>
                                                                            {visitWebSiteArray[index].ReplyData.length < 3 ? <button className='btn btn-light-green' onClick={() => {
                                                                                visitWebSiteArray[index].ReplyData.push({ buttonText: "" })
                                                                                chatReplyBox.push({ type: "reply", typedText: "" })
                                                                                setVisitWebSiteArray([...visitWebSiteArray])
                                                                                setChatReplyBox([...chatReplyBox])
                                                                                setButtonCount(buttonCount + 1)

                                                                            }} > Add Button</button> : null}


                                                                        </div>
                                                                    </div> : null}

                                                                </>
                                                            })
                                                        )}
                                                    </div>
                                                </>}

                                                {/* email */}

                                                {(marketingTemplate == 'email') && <>
                                                    <div className="poppupBroadcast">
                                                        <h5>Notification title</h5>
                                                        <p>Highlight your brand here, use images or videos, to stand out</p>
                                                        <div className="titleInput">
                                                            <input maxLength='40' type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                                                        </div>
                                                    </div>
                                                    <div className="poppupBroadcast">
                                                        <h5>Media</h5>
                                                        <p>Highlight your brand here, use images or videos, to stand out</p>
                                                        <div className="App">
                                                            <div className='BroadcastSelect'>
                                                                <Dropdown
                                                                    id="broadcast"
                                                                    options={broadcastSelectOptionEmail.filter(op => op.value !== broadcast)}
                                                                    onChange={handleBroadcastOption}
                                                                    value={broadcast}
                                                                    placeholder="Select an option"
                                                                />
                                                            </div>
                                                        </div>
                                                        {broadcast.value == 'media' &&
                                                            <div>
                                                                <div className='imageVdoCont'>
                                                                    <input
                                                                        type="radio"
                                                                        id="image"
                                                                        name="media"
                                                                        value="IMAGE"
                                                                        checked={selectOption === 'IMAGE'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="image">Image</label>
                                                                    <input
                                                                        type="radio"
                                                                        id="video"
                                                                        name="media"
                                                                        value="VIDEO"
                                                                        checked={selectOption === 'VIDEO'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="video">Video</label>
                                                                    <input
                                                                        type="radio"
                                                                        id="document"
                                                                        name="media"
                                                                        value="DOCUMENT"
                                                                        checked={selectOption === 'DOCUMENT'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor="document">Document</label>
                                                                </div>
                                                                <div className='dropImg'>
                                                                    {selectOption === 'IMAGE' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Image: .jpeg, .png)</p>
                                                                            {filePreview && <img src={filePreview} alt="Image" className="documentVdoFileTxt" />}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/images/WATI_logo_square_2.png'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        ref={fileInputRef}
                                                                                        className="dropInput2"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectOption === 'VIDEO' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Video: .mp4)</p>
                                                                            {filePreview && (
                                                                                <video controls className='video'>
                                                                                    <source src={filePreview} type='video/mp4' className='documentVdoFile' />
                                                                                </video>
                                                                            )}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/videos/Wati.mp4'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        ref={fileInputRef}
                                                                                        className="dropInput2"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectOption === 'DOCUMENT' && (
                                                                        <div>
                                                                            <p className='dropImgp'>(Document: .pdf)</p>
                                                                            {filePreview && (<embed src={filePreview} className='documentVdoFile' />)}
                                                                            <div className='dropInput'>
                                                                                <input
                                                                                    className='dropInput1'
                                                                                    type='text'
                                                                                    placeholder='https://cdn.clare.ai/wati/documents/Wati.pdf'
                                                                                />
                                                                                <p>or</p>
                                                                                <div>
                                                                                    <input
                                                                                        type="file"
                                                                                        ref={fileInputRef}
                                                                                        className="dropInput2"
                                                                                        onChange={handleFileChange}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {errorMessageFile && <p style={{ color: 'red' }}>{errorMessageFile}</p>}
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className='poppupBroadcast'>
                                                        <h5>Body</h5>
                                                        <p>Make your messages personal using variables like and get more replies!</p>
                                                        <button onClick={handleOpenAttributePop} color="primary" className="btn btn-light-green" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                                                        {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname) => {
                                                            let copyHtmlTextBody = htmlTextBody
                                                            copyHtmlTextBody += `{{${vname}}}`
                                                            setHtmlTextBody(copyHtmlTextBody)
                                                            setCleanTextBody(copyHtmlTextBody);
                                                            setIsAttributePopOpen(false);

                                                        }} />}
                                                        <div className='errorThrow'>
                                                            {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters" : null}
                                                        </div>
                                                        <div className='poppupBodyInput'>
                                                            <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e) => {
                                                                handleTextBodyChange(e.target.value)
                                                            }}></textarea>
                                                            <div className='textAreaInputIcons'>
                                                                {/* <input type='text' disabled/> */}
                                                                <div className='poppupBodyDiv'>
                                                                    <div className='poppupBodyInputIcons'>
                                                                        <div>
                                                                            <MdOutlineEmojiEmotions className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIcon' />
                                                                        </div>
                                                                        <div>
                                                                            <FaItalic onClick={toggleItalic} style={{ cursor: 'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdStrikethroughS className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                        <div>
                                                                            <MdLink className='poppupBodyInputIcon poppupBodyInputIconColor' />
                                                                        </div>
                                                                    </div>
                                                                    <div className='poppupBodyInputCont'>
                                                                        <h5>{textareaCount}/1024</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='poppupBroadcast'>
                          <h5>Footer <span className='poppupBroadcastTitleSpan'>(Optional)</span></h5>
                          <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                          <div className="poppupFooterInput">
                            <input type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange}/>
                          </div>
                          </div>
                          <div className='poppupButton'>
                          <div className='poppupButtonDesign'>
                            <div>
                              <h5>Buttons <span className='poppupBroadcastTitleSpan'>(Recommended)</span><span className='ButtonCount'>{buttonCount}/7</span></h5>
                              <p className='poppupButtonDesignP'>Add quick replies and call to actions together for extra engagement!</p>
                            </div>
                            <div>
                              <label className="switch">
                                <input type="checkbox" checked={isButtonChecked} className={`${isButtonChecked ? 'checkedStyle' : ''}`} onChange={()=>{handleButtonToggle(isButtonChecked)}} />
                                <span className="slider"></span>
                              </label>
                            </div>
                          </div>
                          {isButtonChecked && (
                        
                        visitWebSiteArray.map((ival,index)=>{
                            return <>
                            {ival.type ==="Visit Us" && <> 
                            <div className='visitAfterDelete'>{ival.visitData.length ===0 ? <>
                              <Dropdown
                                className='visitWebsiteButton'
                                options={buttonSelectOption.filter(op => op.value !==buttonSelectOption[0].value)}
                                onChange={(e)=>{
                                  visitWebSiteArray[index].visitWebsite=e
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                }}
                                value={buttonSelectOption[0].value}
                                placeholder="Select an option"
                              />
                              <input className='visitWebsiteButtonAdd'  type='button' value='Add button'  onClick={()=>{
                                    visitWebSiteArray[index].visitData.push({visitWebsite:buttonSelectOption[0].value,visitUsInput:"",staticDropdown:buttonStaticOption[0].value,visithttpInput:""})
                                    chatReplyBox.push({type:"Visit Us"})
                                    setVisitWebSiteArray([...visitWebSiteArray])
                                    setChatReplyBox([...chatReplyBox])
                                  }}/>
                            </>: null}</div>
                            {ival.visitData.map((vmap,vindex)=>{
                              let {visitWebsite,visitUsInput,staticDropdown,visithttpInput}=vmap
                                return <div className='visitWebsiteButtonsCont'>
                                <div className='visitWebsiteButtonCont'>
                                  <div className='visitWebsiteSelectCont'>
                                    <Dropdown
                                      className='visitWebsiteButton'
                                      options={buttonSelectOption.filter(op => op.value !== visitWebsite)}
                                      onChange={(e)=>{
                                        visitWebSiteArray[index].visitWebsite=e
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                      }}
                                      value={visitWebsite}
                                      placeholder="Select an option"
                                    />
                                      <div className='visitUsCont'>
                                        <div className='visitUsConts'>
                                          <input className='visitUsInput' value={visitUsInput} type='text' placeholder='Visit Us' onChange={(e)=>{
                                            visitWebSiteArray[index].visitUsInput=e.target.value
                                            setVisitWebSiteArray([...visitWebSiteArray])
                                            setVisitCont(e.target.value)
                                          }}/>
                                        </div>
                                        <div className='deleteIcon' onClick={()=>{
                                          visitWebSiteArray[index].visitData.splice(vindex,1)
                                          chatReplyBox.splice(index,1)
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                            <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                          </svg>
                                        </div>
                                      </div>
                                      <div>
                                        {vindex ==0 && ival.visitData.length < 3?  <input className='visitWebsiteButtonAdd'  type='button' value='Add button'  onClick={()=>{
                                          let optsel =buttonSelectOption[0].value
                                          if(visitWebSiteArray[index].visitData.length ==2){
                                            optsel =buttonSelectOption[1].value
                                          }
                                          visitWebSiteArray[index].visitData.push({visitWebsite:optsel,visitUsInput:"",staticDropdown:buttonStaticOption[0].value,visithttpInput:""})
                                          chatReplyBox.push({type:"Visit Us"})
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount+1)
                                        }}/>:null}
                                      </div>
                                  </div>
                                  <div className='visitHttpCont'>
                                    <div className='staticDropdown'>
                                      <Dropdown
                                        className='staticButton'
                                        options={buttonStaticOption.filter(op => op.value !== staticDropdown)}
                                        onChange={(e)=>{
                                          visitWebSiteArray[index].staticDropdown=e
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                        }}
                                        value={staticDropdown}
                                        placeholder="Select an option"
                                      />
                                    </div>
                                    <div>
                                      <input className='visithttpInput' value={visithttpInput}  type='text' placeholder='https://www.wati.io' onChange={(e)=>{
                                        visitWebSiteArray[index].visithttpInput=e.target.value
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                      }}/>
                                    </div>
                                  </div>
                                </div>
                                </div>
                            })}
                            
                            </>}

                            {ival.type ==="copy" ? <> 
                              <div className='copyOfferCodeButtonCont'>
                                <input className='visitWebsiteInput'  type='text' placeholder='Copy offer code' value={""} disabled/>
                              <div>
                                {visitWebSiteArray[index].coperData.length === 0 ?   <input className='visitWebsiteButtonAdd'  type='button' value='Add button' onClick={()=>{
                                  visitWebSiteArray[index].coperData.push({copyCouponCode:"",copyOfferCode:""})
                                  chatReplyBox.push({type:"copy"})
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                  setChatReplyBox([...chatReplyBox])
                                  setButtonCount(buttonCount+1)
                                }}/>: null}
                              </div>
                              {visitWebSiteArray[index].coperData.map((cmap)=>{
                                let {copyCouponCode,copyOfferCode}=cmap
                              return <div className='copyOfferCont'>
                                <input className='copyOfferInput'  type='text' placeholder='Copy offer code' value={copyOfferCode} disabled/>
                                <input className='copyCouponInput'  type='text' placeholder='Enter coupon code to copy' value={copyCouponCode} onChange={(e)=>{
                                    visitWebSiteArray[index].visithttpInput=e.target.value
                                    setVisitWebSiteArray([...visitWebSiteArray])
                                }}/>
                              </div>
                              })}
                              {visitWebSiteArray[index].coperData.length ? <>
                                <div className='deleteIcon' onClick={()=>{
                                        visitWebSiteArray[index].coperData.splice(0,1)
                                        chatReplyBox.splice(index,1)
                                        setVisitWebSiteArray([...visitWebSiteArray])
                                        setChatReplyBox([...chatReplyBox])
                                        setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                    <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                  </svg>
                                </div>
                              </> : null}
                            </div>
                            </>:null}                   

                            {ival.type ==="reply" ? <div className='quickRepliesButtonCont'>

                        <input className='visitWebsiteInput' value={"Quick replies"}  type='text' placeh
                        older='Quick replies' 
                        disabled
                        />
                        

                        {visitWebSiteArray[index].ReplyData.map((cmap,cindex)=>{
                        return<div className='replyCont'>
                          <input className='copyOfferInput' value={cmap.buttonText}  type='text' placeh
                        older='Button text' 
                        placeholder='Button Text'
                        disabled
                        onChange={(e)=>{
                        visitWebSiteArray[index].ReplyData=e.target.value
                        setVisitWebSiteArray([...visitWebSiteArray])
                  }}/>
                  
                      <div className='deleteIcon' onClick={()=>{
                                          visitWebSiteArray[index].ReplyData.splice(cindex,1)
                                          chatReplyBox.splice(index,1)
                                          setVisitWebSiteArray([...visitWebSiteArray])
                                          setChatReplyBox([...chatReplyBox])
                                          setButtonCount(buttonCount-1)
                                        }}>
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333" className='deleteIconHover'></path>
                                            <path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" strokeWidth="1.25" strokeLinecap="round" className='deleteIconHover'></path>
                                          </svg>
                                        </div>
                              </div>
                        })}
                              <div>
                                {visitWebSiteArray[index].ReplyData.length < 3 ?    <input className='visitWebsiteButtonAdd' type='button' value='Add button' onClick={()=>{
                                  visitWebSiteArray[index].ReplyData.push({buttonText:""})
                                  chatReplyBox.push({type:"reply"})
                                  setVisitWebSiteArray([...visitWebSiteArray])
                                  setChatReplyBox([...chatReplyBox])
                                  setButtonCount(buttonCount+1)
                                  
                                }}/> : null}
                            

                              </div>
                            </div> : null}
                            
                            </>
                          }) 
                            )}
                          </div> */}
                                                </>}


                                            </div>
                                        </div></> : ""}
                                </div>
                            </div>
                            {/* Popup left side end */}
                        </div>
                        <div className='col-lg-4 col-md-4 col-sm-12'>
                            <div className='bodyPoppupR'>
                                <div className='previewCont'>
                                    <div>
                                        <h2 className='bodyPoppupRPreview'>Preview</h2>
                                    </div>
                                    <div className='previewBorder'>
                                        <div
                                            className={`previewBorder1 ${mobileDeskview === 'mobile' ? 'active' : null}`}
                                            onClick={() => handleMobileDeskView('mobile')}
                                        >
                                            <CiMobile2 />
                                        </div>
                                        <div
                                            className={`previewBorder2 ${mobileDeskview === 'desktop' ? 'active' : ''}`}
                                            onClick={!isDisabled ? () => handleMobileDeskView('desktop') : null}
                                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                            >
                                            <div style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}>
                                                <CiDesktop />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {mobileDeskview == 'desktop' && (<button className='btn' onClick={handleZoomClick}>View Template</button>)}
                                {(marketingTemplate === "whatsapp" && (mobileDeskview === 'mobile' || mobileDeskview === 'desktop')) ? <> <div className={mobileDeskview == 'desktop' ? 'zoom' : null}>
                                    <img
                                        draggable="false"
                                        src={mobileDeskview === 'mobile' ? whatsapp : whatsappDesk}
                                        alt='whatsappImg'
                                        className={classNames}
                                        // onClick={handleZoomClick}
                                    />
                                </div>
                                {mobileDeskview == 'desktop' && isZoomed && (<button type="button" aria-label="Close" className='imgZoom-btn' onClick={handleCloseClick}>X</button>)}
                                    <div className={MobileScrollWp}>
                                        <div className={deskClass}>
                                            <div className={mobileDeskview == 'desktop' && isZoomed ? 'previewContZoomed' : "previewStyle"}>

                                                {broadcast.value === "media" && selectOption === 'IMAGE' ? <div className='bg-img-div'>
                                                    {filePreview ? <img src={filePreview} className='documentVdoFile' /> : <img src={img} alt="img" className="documentVdoImg" />}
                                                </div> : null}

                                                {broadcast.value === "media" && selectOption === 'VIDEO' ? <div className='bg-img-div'>
                                                    {filePreview ? <video className='documentVdoFile' controls>
                                                        <source src={filePreview} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video> : <img src={vdo} alt="Video" className="documentVdoImg" />}

                                                </div> : null}

                                                {broadcast.value === "media" && selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                                                    {filePreview ? <embed src={filePreview} className='documentVdoFile' /> : <img src={document} alt="document" className="documentVdoImg" />}
                                                </div> : null}

                                                {htmlText ? <div
                                                    className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed' : "previewTextStyle"}
                                                    dangerouslySetInnerHTML={{ __html: htmlText }}
                                                /> : null}
                                                {htmlTextBody ? <div
                                                    className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed' : "previewBodyStyle"}
                                                    dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                /> : null}
                                                {htmlTextFooter ? <div
                                                    className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed' : "previewFooterStyle"}
                                                    dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                /> : null}
                                                <div className={`previewStyleTime ${isButtonChecked ? 'checkedStyle' : ''}`}>{currentTime}</div>
                                                {isButtonChecked && chatReplyBox.length ? <>{
                                                    chatReplyBox.map((ival, index) => {
                                                        return <>
                                                            {(ival.type === "Visit Us") && <div className={chatReply}>
                                                                <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={visit} /></div>
                                                                <div> {ival.typedText}</div>
                                                            </div>}
                                                            {(ival.type === "callPhone") && <div className={chatReply}>
                                                                <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={call} /></div>
                                                                <div>{ival.typedText}</div>
                                                            </div>}
                                                            {(ival.type === "copy") && <div className={chatReply}>
                                                                <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={copy} /></div>
                                                                <div>{ival.type}</div>
                                                            </div>}
                                                            {(ival.type === "reply") && <div className={chatReply}>
                                                                <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={reply} /></div>
                                                                <div>{ival.type}</div>
                                                            </div>}
                                                        </>
                                                    })
                                                }
                                                </> : null}
                                            </div>
                                            {(type == 'Red' && marketingTemplate == 'whatsapp') ?
                                                <div className='previewSampleStyleCont'>
                                                    {htmlTextSample ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed' : "previewSampleStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlTextSample }}
                                                    /> : null}
                                                </div>
                                                : null}
                                        </div>
                                    </div>


                                </> : null}

                                {(marketingTemplate === "sms") ? <> <div>
                                   
                                    <img src={sms} draggable="false" alt='smsImg' className='selectImgs' />

                                </div>
                                    <div className='MobileScrollSms'>
                                        <div className='MobileScreenSms'>
                                            <div className='previewStyle previewStyleExtra'>
                                                {broadcast.value === "media" && selectOption === 'IMAGE' ? <div className='bg-img-div'>
                                                    <img src={filePreview ? filePreview : img} alt="Image" className="documentVdoImg" />
                                                </div> : null}

                                                {broadcast.value === "media" && selectOption === 'VIDEO' ? <div className='bg-img-div'>
                                                    {filePreview ? <video width={100} height={100} controls>
                                                        <source src={filePreview} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video> : <img src={vdo} alt="Video" className="documentVdoImg" />}

                                                </div> : null}

                                                {broadcast === "media" && selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                                                    {filePreview ? <embed src={filePreview} width="800px" height="2100px" /> : <img src={document} alt="document" className="documentVdoImg" />}

                                                </div> : null}

                                                {htmlText ? <div
                                                    className="previewTextStyle"
                                                    dangerouslySetInnerHTML={{ __html: htmlText }}
                                                /> : null}
                                                {htmlTextBody ? <div
                                                    className="previewBodyStyle"
                                                    dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                /> : null}
                                                {htmlTextFooter ? <div
                                                    className="previewFooterStyle"
                                                    dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                /> : null}
                                                {isButtonChecked && chatReplyBox.length ? <>{
                                                    chatReplyBox.map((ival) => {
                                                        return <>
                                                            <div className='buttonStyle'>{ival.type}</div>
                                                        </>
                                                    })
                                                }
                                                </> : null}
                                                <div className='previewStyleTime'>{currentTime}</div>
                                            </div>
                                        </div>
                                    </div>
                                </> : null}

                                {(marketingTemplate === "platform" && (mobileDeskview === 'mobile' || mobileDeskview === 'desktop')) ? <> <div>
                                    <img
                                        draggable="false"
                                        src={mobileDeskview == 'mobile' ? platform : platformDesk}
                                        alt='platformImg'
                                        className={platformClass}
                                        onClick={handleZoomClick} />
                                </div>
                                    <div className={mobileDeskview == 'mobile' ? 'MobileScroll' : 'MobileScrollDesk'}>
                                        <div className={platformPreviewClass}>
                                            <div className={platformPreviewCont}>
                                                <div className={mobileDeskview == 'mobile' ? 'previewPlatformCont' : 'previewPlatformContDesk'}>
                                                    {mobileDeskview == 'desktop' ?
                                                        <div className='previewPlatformPopupCont'>
                                                            <div style={{ display: 'flex', gap: '.5rem' }}>
                                                                <img src={evMarket} className='platformCar' alt='evmarket' width='10%' />
                                                                <div>
                                                                    <div><p>Lowest Prices in 90 days</p></div>
                                                                    <div><p>Discover product from the source</p></div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p>X</p>
                                                            </div>
                                                        </div>
                                                        : null}
                                                    {htmlText ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'platformtitleZoomed' : "previewTextStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlText }}
                                                    /> : null}
                                                    {htmlTextBody ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'platformbodyZoomed' : "previewBodyStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                    /> : null}
                                                    {htmlTextFooter ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'platformfooterZoomed' : "previewFooterStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                    /> : null}
                                                    {isButtonChecked && chatReplyBox.length ? <>{
                                                        chatReplyBox.map((ival) => {
                                                            return <>
                                                                {(ival.type === "Visit Us") && <div className={chatReply}>
                                                                    <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={visit} /></div>
                                                                    <div> {ival.typedText}</div>
                                                                </div>}
                                                                {(ival.type === "callPhone") && <div className={chatReply}>
                                                                    <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={call} /></div>
                                                                    <div>{ival.typedText}</div>
                                                                </div>}
                                                                {(ival.type === "copy") && <div className={chatReply}>
                                                                    <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={copy} /></div>
                                                                    <div>{ival.type}</div>
                                                                </div>}
                                                                {(ival.type === "reply") && <div className={chatReply}>
                                                                    <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg'}><img src={reply} /></div>
                                                                    <div>{ival.type}</div>
                                                                </div>}
                                                            </>
                                                        })
                                                    }
                                                    </> : null}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </> : null}

                                {(marketingTemplate === "push" && (mobileDeskview === 'mobile' || mobileDeskview === 'desktop')) ? <> <div>
                                    <img
                                        draggable="false"
                                        src={mobileDeskview == 'mobile' ? push : pushDesk}
                                        alt='pushImg'
                                        className={pushClass}
                                        onClick={handleZoomClick} />
                                </div>
                                    <div>
                                        <div className={pushPreview}>
                                            <div className={pushCont}>
                                                {broadcast.value === "media" && selectOption === 'IMAGE' ? <div className='bg-img-div'>
                                                    <img src={filePreview ? filePreview : img} alt="Image" className="documentVdoImg" />
                                                </div> : null}

                                                {broadcast.value === "media" && selectOption === 'VIDEO' ? <div className='bg-img-div'>
                                                    {filePreview ? <video width={100} height={100} controls>
                                                        <source src={filePreview} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video> : <img src={vdo} alt="Video" className="documentVdoImg" />}

                                                </div> : null}

                                                {broadcast === "media" && selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                                                    {filePreview ? <embed src={filePreview} width="800px" height="2100px" /> : <img src={document} alt="document" className="documentVdoImg" />}

                                                </div> : null}
                                                {mobileDeskview == 'mobile' ?
                                                    <div style={{ display: 'flex' }}>
                                                        <div className='previewPushImg'>
                                                            <img src={car} alt='car' />
                                                        </div>
                                                        <div className='previewPushCont'>
                                                            <div>
                                                                <p>EVzone</p>
                                                            </div>
                                                            {htmlText ? <div
                                                                className="previewTextStyle"
                                                                dangerouslySetInnerHTML={{ __html: htmlText }}
                                                            /> : null}
                                                            {htmlTextBody ? <div
                                                                className="previewBodyStyle"
                                                                dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                            /> : null}
                                                            {htmlTextFooter ? <div
                                                                className="previewFooterStyle"
                                                                dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                            /> : null}
                                                            {isButtonChecked && chatReplyBox.length ? <>{
                                                                chatReplyBox.map((ival) => {
                                                                    return <>
                                                                        {/* {ival.type==="reply" } */}
                                                                        <div className={chatReply}>{ival.type}</div>
                                                                    </>
                                                                })
                                                            }
                                                            </> : null}
                                                            {/* <div className='previewStyleTime'>{currentTime}</div> */}
                                                        </div>
                                                    </div> :
                                                    <div>
                                                        <div className='pushContClose'>
                                                            X
                                                        </div>
                                                        <div className='pushCarCont'>
                                                            <img src={evMarket} alt='evMarket' className='pushNotificationCar' />
                                                            <div>
                                                                <div>
                                                                    <div>
                                                                        {htmlText ? <div
                                                                            className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed' : "previewTextStylePush"}
                                                                            dangerouslySetInnerHTML={{ __html: htmlText }}
                                                                        /> : null}
                                                                        {htmlTextBody ? <div
                                                                            className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed' : "previewBodyStyle"}
                                                                            dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                                        /> : null}
                                                                        {htmlTextFooter ? <div
                                                                            className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed' : "previewFooterStyle"}
                                                                            dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                                        /> : null}
                                                                        {/* <div className='previewStyleTime'>{currentTime}</div> */}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p>via evzonemarketplace.com</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <IoMdSettings className='settingIcon' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </> : null}

                                {(marketingTemplate === "email" && (mobileDeskview === 'mobile' || mobileDeskview === 'desktop')) ? <> <div>
                                    <img
                                        src={mobileDeskview === 'mobile' ? email : emailDesk}
                                        alt='emailImg'
                                        className={emailClass}
                                        onClick={handleZoomClick}
                                        draggable="false"
                                    />
                                </div>
                                    <div className='MobileScroll'>
                                        <div className={emailPreviewCont}>
                                            <div>
                                                <div className={mobileDeskview == 'desktop' && isZoomed ? 'previewEmailTitleZoom' : 'previewEmailTitle'}>
                                                    {htmlText ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed' : "previewTextStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlText }}
                                                    /> : null}
                                                </div>
                                                <div className={emailZoomClass}>
                                                    {broadcast.value === "media" && selectOption === 'IMAGE' ? <div className='bg-img-div'>
                                                        {filePreview ? <img src={filePreview} className='documentVdoFile' /> : <img src={img} alt="img" className="documentVdoImg" />}
                                                    </div> : null}

                                                    {broadcast.value === "media" && selectOption === 'VIDEO' ? <div className='bg-img-div'>
                                                        {filePreview ? <video className='documentVdoFile' controls>
                                                            <source src={filePreview} type='video/mp4' />
                                                            Your browser does not support the video tag.
                                                        </video> : <img src={vdo} alt="Video" className="documentVdoImg" />}

                                                    </div> : null}

                                                    {broadcast.value === "media" && selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                                                        {filePreview ? <embed src={filePreview} className='documentVdoFile' /> : <img src={document} alt="document" className="documentVdoImg" />}
                                                    </div> : null}

                                                    {htmlTextBody ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed' : "previewBodyStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                                    /> : null}
                                                </div>
                                                <div className='previewEmailFooter'>
                                                    {htmlTextFooter ? <div
                                                        className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed' : "previewFooterStyle"}
                                                        dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                                                    /> : null}
                                                </div>
                                                {isButtonChecked && chatReplyBox.length ? <>{
                                                    chatReplyBox.map((ival) => {
                                                        return <>
                                                            <div className={mobileDeskview === 'desktop' ? 'buttonStyleDesk' : 'buttonStyle'}>{ival.type}</div>
                                                        </>
                                                    })
                                                }
                                                </> : null}
                                                {/* <div className='previewStyleTime'>{currentTime}</div> */}
                                            </div>
                                        </div>
                                    </div>
                                </> : null}
                            </div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>
            {/* <Modal show={show} onHide={handleClosea} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Create </Modal.Title>
                </Modal.Header>
                <Modal.Body>dfdfdfdfdfdf</Modal.Body>
                </Modal> */}
        </>
    );
}

export default NewPopup;