import React, { useState, useRef, useEffect  } from 'react';
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrBold } from "react-icons/gr";
import { FaItalic } from "react-icons/fa6";
import { MdStrikethroughS } from "react-icons/md";
import { MdLink } from "react-icons/md";
import img from '../Assets/img/mediaImg.png';
import vdo from '../Assets/img/mediaVdo.png';
import document from '../Assets/img/mediaDocument.png'
import AttributePopup from './AttributePopup';
import { FaArrowLeft } from "react-icons/fa6";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import SampleTemplate from './SampleTemplate';
import '../Style.css';
import whatsapp from '../Assets/img/whatsapp.png'
import sms from '../Assets/img/sms.png'
import push from '../Assets/img/push.png'
import platform from '../Assets/img/platform.png'
import email from '../Assets/img/mail.png'
import whatsappDesk from '../Assets/img/whatsappDesk.png'
import platformDesk from '../Assets/img/platformDesk.png'
import pushDesk from '../Assets/img/pushDesk.png'
import emailDesk from '../Assets/img/gmailDesk.png'
import car from '../Assets/img/evzone.png'
import { CiMobile2 } from "react-icons/ci";
import { CiDesktop } from "react-icons/ci";
import evMarket from '../Assets/img/evmarket.svg'
import { IoMdSettings } from "react-icons/io";
import visit from '../Assets/img/visit.png';
import copy from '../Assets/img/copy.png';
import reply from '../Assets/img/reply.png';

const NewTemplatePopup = ({ onClose }) => {

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
    { value:'English (US)', label:'English (US)' },
    { value:'Afrikaans', label:'Afrikaans' },
    { value:'Albanian', label:'Albanian' },
    { value:'Arabic', label:'Arabic' },
    { value:'Azerbaijani', label:'Azerbaijani' },
    { value:'Bengali', label:'Bengali' },
    { value:'Bulgarian', label:'Bulgarian' },
    { value:'Catalan', label:'Catalan' },
    { value:'Chinese (CHN)', label:'Chinese (CHN)' },
    { value:'Chinese (HKG)', label:'Chinese (HKG)' },
    { value:'Chinese (TAI)', label:'Chinese (TAI)' },
    { value:'Croatian', label:'Croatian' },
    { value:'Czech', label:'Czech' },
    { value:'Danish', label:'Danish' },
    { value:'Dutch', label:'Dutch' },
    { value:'English', label:'English' },
    { value:'English (UK)', label:'English (UK)' },
    { value:'Estonian', label:'Estonian' },
    { value:'Filipino', label:'Filipino' },
    { value:'Finnish', label:'Finnish' },
    { value:'French', label:'French' },
    { value:'Georgian', label:'Georgian' },
    { value:'German', label:'German' },
    { value:'Greek', label:'Greek' },
    { value:'Gujarati', label:'Gujarati' },
    { value:'Hausa', label:'Hausa' },
    { value:'Hebrew', label:'Hebrew' },
    { value:'Hindi', label:'Hindi' },
    { value:'Hungarian', label:'Hungarian' },
    { value:'Indonesian', label:'Indonesian' },
    { value:'Irish', label:'Irish' },
    { value:'Italian', label:'Italian' },
    { value:'Japanese', label:'Japanese' },
    { value:'Kannada', label:'Kannada' },
    { value:'Kazakh', label:'Kazakh' },
    { value:'Kinyarwanda', label:'Kinyarwanda' },
    { value:'Korean', label:'Korean' },
    { value:'Kyrgyz (Kyrgyzstan)', label:'Kyrgyz (Kyrgyzstan)' },
    { value:'Lao', label:'Lao' },
    { value:'Latvian', label:'Latvian' },
    { value:'Lithuanian', label:'Lithuanian' },
    { value:'Macedonian', label:'Macedonian' },
    { value:'Malay', label:'Malay' },
    { value:'Malayalam', label:'Malayalam' },
    { value:'Marathi', label:'Marathi' },
    { value:'Norwegian', label:'Norwegian' },
    { value:'Persian', label:'Persian' },
    { value:'Polish', label:'Polish' },
    { value:'Portuguese (BR)', label:'Portuguese (BR)' },
    { value:'Portuguese (POR)', label:'Portuguese (POR)' },
    { value:'Punjabi', label:'Punjabi' },
    { value:'Romanian', label:'Romanian' },
    { value:'Russian', label:'Russian' },
    { value:'Serbian', label:'Serbian' },
    { value:'Slovak', label:'Slovak' },
    { value:'Slovenian', label:'Slovenian' },
    { value:'Spanish', label:'Spanish' },
    { value:'Spanish (ARG)', label:'Spanish (ARG)' },
    { value:'Spanish (SPA)', label:'Spanish (SPA)' },
    { value:'Spanish (MEX)', label:'Spanish (MEX)' },
    { value:'Swahili', label:'Swahili' },
    { value:'Swedish', label:'Swedish' },
    { value:'Tamil', label:'Tamil' },
    { value:'Telugu', label:'Telugu' },
    { value:'Thai', label:'Thai' },
    { value:'Turkish', label:'Turkish' },
    { value:'Ukrainian', label:'Ukrainian' },
    { value:'Urdu', label:'Urdu' },
    { value:'Uzbek', label:'Uzbek' },
    { value:'Vietnamese', label:'Vietnamese' },
    { value:'Zulu', label:'Zulu' },
  ]


  const broadcastSelectOption = [
    { value: 'None', label: 'None' },
    { value: 'text', label: 'Text' },
    { value: 'media', label: 'Media' },
  ];

  const buttonSelectOption = [
    { value: 'Visit Website', label: 'Visit Website' },
    { value: 'callPhone', label: 'Call Phone' },
  ];

  const buttonStaticOption = [
    {value:'Static', label:'Static'},
    {value:'Dynamic', label:'Dynamic'},
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
  {console.log(cleanTextBody.length)};
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
  let visitWebSiteObj ={type:"Visit Us",visitData:[{visitWebsite:buttonSelectOption[0].value,visitUsInput:"",staticDropdown:buttonStaticOption[0].value,visithttpInput:""}]}
  let copyOfferCodeObj ={type:"copy", coperData:[]}
  let quickReplybj ={type:"reply",ReplyData:[]}
  const [visitWebSiteArray, setVisitWebSiteArray] = useState([visitWebSiteObj,copyOfferCodeObj,quickReplybj]);
  let [chatReplyBox, setChatReplyBox] = useState([]);
  const [verificationCodeText, setVerificationCodeText] = useState("{{1}} is your verification code. For your security, do not share this code.");
  const [buttonCount, setButtonCount] = useState(0);
  const [visitCont, setVisitCont] = useState('')
  const [isButtonChecked, setIsButtonChecked] = useState(false);
  const [textareaCount, setTextareaCount] = useState(0);

  useEffect(() => {
    setTextareaCount(cleanTextBody.length);
  }, [cleanTextBody]);

  const textareaStyle = {
    color: textareaCount > 1024 ? 'red' : 'black',
    border: textareaCount > 1024 ? '2px solid red' : ''
  };

  const changeMarketingTemplet=(value)=>{
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
    
    if(value!=="whatsapp"){
      setVisitWebSiteArray([visitWebSiteObj,copyOfferCodeObj,quickReplybj])
      setChatReplyBox([])
    }
   
  }

  const handleIdentification = (e)=>{
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

    // setTypeValue(selectedCategory.value);
    // let choosevalue = selectedCategory.value;
    // if( choosevalue === "Red" ){
    // let dummyFooterTest = verificationCodeText
    //  setCleanTextBody(`${dummyFooterTest}`);
    //  setHtmlTextBody(`${dummyFooterTest}`);
 
    //  let dummyFooter = `This code expires in ${expire} minutes.`
    //   setCleanTextFooter(dummyFooter)
    //   setHtmlTextFooter(dummyFooter)
    // }
    // else{
    //   setCleanTextBody('');
    //   setHtmlTextBody('');
    //   setCleanTextFooter('');
    //   setHtmlTextFooter('');
    // }
     
  };

  const handleLanguagesOption = (selectedCategory)=>{
    setLanguage(selectedCategory.value);
  }

  const handleBroadcastOption = (selectedBroadcast) =>{
    setBroadcast(selectedBroadcast);
  }

  const handleButtonOption = (selectedButton)=>{
    setSelectedOption(selectedButton);
  }
  const handleStaticButtonOption =(selectedButton)=>{
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

let handleButtonOpen = ()=>{
  setButtonOpen(true);
}


  const handleButtonToggle = (checkedtype) => {
    chatReplyBox =[]
    if(!checkedtype){
      chatReplyBox.push({type:"Visit Us"})
    }
    else{
      setVisitWebSiteArray([visitWebSiteObj,copyOfferCodeObj,quickReplybj])
      chatReplyBox =[]
    }
    setIsButtonChecked(!isButtonChecked);
    setChatReplyBox(...[chatReplyBox])

  };
 
  useEffect(()=>{
    if(isButtonChecked == false){
      setButtonCount(0);
    }
    else{
      setButtonCount(buttonCount+1);
    }
  }, [isButtonChecked])

  const [mobileDeskview, setMobileDeskview] = useState('mobile');

  const handleMobileDeskView = (type) => {
    setMobileDeskview(type);
  };

  const [isZoomed, setIsZoomed] = useState(false);

  const handleZoomClick = () => {
    setIsZoomed(!isZoomed);
  };


  let classNames = `${mobileDeskview === 'mobile' ? "selectImgs" : "selectDeskWhatsapp"}`;
  if (mobileDeskview === 'desktop' && isZoomed) {
    classNames += ' zoomed';
  }
  
  let platformClass =  `${mobileDeskview == 'mobile' ? 'selectImgs' : 'selectDeskWhatsapp'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    platformClass += ' zoomed';
  }

  let pushClass = `${mobileDeskview == 'mobile'?'selectImgs':'selectDeskWhatsapp'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    pushClass += ' zoomed';
  }

  let emailClass = `${mobileDeskview == 'mobile'?'selectImgs':'selectDeskWhatsapp'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    emailClass += ' zoomed';
  }

  let deskClass = `${mobileDeskview==='mobile'?'MobileScreen':'DeskScreen'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    deskClass += ' deskZoom';
  }
 
  let platformPreviewClass = `${mobileDeskview=='mobile'?'MobileScreenPlat':'MobileScreenSmsDesk'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    platformPreviewClass += ' platformPreviewZoom';
  }

  let platformPreviewCont = `${mobileDeskview == 'mobile'?'previewStylePlatform':'previewStylePlatformDesk'} `
  if (mobileDeskview === 'desktop' && isZoomed) {
    platformPreviewCont += ' platformPreviewContZoom';
  }
  
  let pushPreview = `${mobileDeskview=='mobile'?'MobileScreenPush':'DeskScreenPush'} `
  if (mobileDeskview === 'desktop' && isZoomed) {
    pushPreview += ' pushPreviewZoom';
  }

  let pushCont =`${mobileDeskview=='mobile'?'previewStylePush':'previewStylePushDesk'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    pushCont += ' pushContZoom';
  }

  let emailPreviewCont = `${mobileDeskview == 'mobile'? 'MobileScreenEmail': 'DeskScreenSms'}`
   if (mobileDeskview === 'desktop' && isZoomed) {
    emailPreviewCont += ' emailPreviewContZoom';
  }

  let chatReply = `${mobileDeskview =='desktop'?'buttonStyleDesk':'buttonStyle'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    chatReply += ' chatReplyBoxZoom';
  }

  let emailZoomClass= `${mobileDeskview == 'mobile'? 'previewEmailBody': 'previewEmailBodyDesk'}`
  if (mobileDeskview === 'desktop' && isZoomed) {
    emailZoomClass += ' emailZoomClassZoom';
  }

  const handleSampleCont = (e)=>{
      let copyText = verificationCodeText;
      let newValue = e.target.value || "{{1}}"; 
      copyText = copyText.replace("{{1}}", newValue);
      setHtmlTextBody(copyText);
  }
  

  return (

    <div className={mobileDeskview}>
      <div className="modal-backdrop" >
        <div className="modal-content">
          <div className='popupNav'>
            <div>
              {sampleTemplateChoose ? <>
                  <p className="close-button" onClick={()=>{
                    setSampleTemplate(true)
                  }
                }><FaArrowLeft  className='splUpArrow' /></p>
              </> : null}
              <p className='popupNavHead'>Create template message</p>
            </div>
            <p className="close-button" onClick={onClose}><RxCross2  /></p>
          </div>
          <div className='bodyPoppup'>
            <div className='bodyPoppupL'>
                {sampleTemplate ?<SampleTemplate
                onClose={onClose}
                closeSamplePage={()=>{
                  setSampleTemplate(false)
                  setSampleTemplateChoose(false)
                  setCleanTextBody("");
                  setHtmlTextBody("");

                  setFromName("")
                  setFromNameShow(false)
                }}  
                templateOnchange={(samplehtmltext)=>{
                  samplehtmltext =  samplehtmltext.replaceAll('{{name}}', 'John');
                  setFromName("John")
                  setFromNameShow(true)

                  handleTextBodyChange(samplehtmltext)
                  setSampleTemplate(false)
                  setSampleTemplateChoose(true)
                }}
                
                createOwnTemplateOnClick={()=>{
                  setSampleTemplateChoose(false)
                  setSampleTemplate(false)

                  setFromName("")
                  setFromNameShow(false)
                }}
                /> :null}
                <div>
                  <div className='popupInput'>
                    <div className='selectInputs'>
                      <label>Template Name</label>
                      <input placeholder='Template Name' type='text'/>
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
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button>
                        {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'surveys') && <div className='poppupRadio'>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button>
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}
                      
                      {(identification.value == 'Interactive Prompts') && <div className='poppupRadio'>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button>
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button> */}
                      </div>}

                      {/* Red */}

                      {(identification.value == 'Emergency') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button> */}
                      </div>}

                      {(identification.value == 'Account Verfication') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>}
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button> */}
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == '3rd-Party Authentication') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button> */}
                      </div>}

                      {(identification.value == 'MFA') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'Failed Activity') && <div className='poppupRadio'>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button>
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'Rejections') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'Bad Activity') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {/* Blue */}

                      {((identification.value == 'Credential Access/share') ||( identification.value =='Update notices') || (identification.value =='Transactions')) && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'Helper tours') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button> */}
                      </div>}

                      {/* Green */}

                      {((identification.value == 'Approvals') || (identification.value == 'Lifts')) && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button>
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {(identification.value == 'success activity') && <div className='poppupRadio'>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="whatsapp" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("whatsapp")}></span>
                            <label htmlFor="whatsapp">WhatsApp</label><br />
                          </div>
                        </button> */}
                        {/* {mobileDeskview === 'mobile' && <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="sms" ?"radio-active":""} `}>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("sms")}></span>
                            <label htmlFor="sms">SMS</label><br />
                          </div>
                        </button>} */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="platform" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("platform")}></span>
                              <label htmlFor="platform">Platform</label>
                            </div>
                          </div>
                        </button>
                        {/* <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="push" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("push")}></span>
                              <label htmlFor="push">Push</label>
                            </div>
                          </div>
                        </button> */}
                        <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                          <div className={`poppupInputLabel ${marketingTemplate==="email" ?"radio-active":""} `} >
                            <div className='poppupInputLabelCarousel'>
                            <span class="radio-btn" onClick={()=> changeMarketingTemplet("email")}></span>
                              <label htmlFor="email">Email</label>
                            </div>
                          </div>
                        </button>
                      </div>}

                      {/* template */}
                      {/* whatsapp */}

                      {(marketingTemplate == 'whatsapp')&& <>
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
                                {filePreview && <img src={filePreview} alt="Image" className="documentVdoFile" />}
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
                            {errorMessageFile && <p style={{color:'red'}}>{errorMessageFile}</p>}
                          </div>
                        </div>
          }
                        </div>
                        <div className='poppupBroadcast'>
                      <h5>Body</h5>
                      <p>Make your messages personal using variables like and get more replies!</p>
                      <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                      {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                        let copyHtmlTextBody = htmlTextBody
                        copyHtmlTextBody+=`{{${vname}}}`
                        setHtmlTextBody(copyHtmlTextBody)
                        setCleanTextBody(copyHtmlTextBody);
                        setIsAttributePopOpen(false);

                      }} />}
                      <div style={{color:'red', marginBottom:'1rem'}}>
                        {textareaCount > 1024 ? "Body can't be empty or more than 1024 characters"  : null}
                      </div>
                      <div className='poppupBodyInput'>
                        <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' style={textareaStyle} value={cleanTextBody} onChange={(e)=>{
                          handleTextBodyChange(e.target.value)
                        }}></textarea>
                        <div className='textAreaInputIcons'>
                          {/* <input type='text' disabled/> */}
                            <div className='poppupBodyDiv'>
                              <div className='poppupBodyInputIcons'>
                                <div>
                                  <MdOutlineEmojiEmotions className='poppupBodyInputIcon poppupBodyInputIconColor'/>
                                </div>
                                <div>
                                  <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal'}} className='poppupBodyInputIconColor poppupBodyInputIcon'/>
                                </div>
                                <div>
                                  <FaItalic onClick={toggleItalic} style={{cursor:'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconColor poppupBodyInputIconColor'/>
                                </div>
                                <div>
                                  <MdStrikethroughS className='poppupBodyInputIcon poppupBodyInputIconColor'/>
                                </div>
                                <div>
                                  <MdLink className='poppupBodyInputIcon poppupBodyInputIconColor'/>
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
                                  setButtonCount(buttonCount+1)
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
                      

                     <div> {visitWebSiteArray[index].ReplyData.map((cmap,cindex)=>{
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
                      })}</div>
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
                        </div>
                        <div className='poppupButtons'>
                          <p className='poppupButtons1'>Save as draft</p>
                          <p className='poppupButtons2'>Save and Submit</p>
                        </div>
                      </>}

                      {/* sms */}
                      
                      {(marketingTemplate == 'sms') && <>
                        <div className='poppupBroadcast'>
                          <h5>Body</h5>
                          <p>Make your messages personal using variables like and get more replies!</p>
                          <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                          {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                            let copyHtmlTextBody = htmlTextBody
                            copyHtmlTextBody+=`{{${vname}}}`
                            setHtmlTextBody(copyHtmlTextBody)
                            setCleanTextBody(copyHtmlTextBody);
                            setIsAttributePopOpen(false);

                          }} />}
                          <div className='poppupBodyInputSms'>
                            <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
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
                      <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                      {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                        let copyHtmlTextBody = htmlTextBody
                        copyHtmlTextBody+=`{{${vname}}}`
                        setHtmlTextBody(copyHtmlTextBody)
                        setCleanTextBody(copyHtmlTextBody);
                        setIsAttributePopOpen(false);

                      }} />}
                      <div className='poppupBodyInput'>
                        <textarea rows="10" cols="70" maxLength='20' placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
                          handleTextBodyChange(e.target.value)
                        }}></textarea>
                        <div className='textAreaInputIcons'>
                          <input type='text' disabled/>
                            <div className='poppupBodyInputIcons'>
                              <div>
                                <MdOutlineEmojiEmotions className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal'}} className='poppupBodyInputIconGrBold poppupBodyInputIcon'/>
                              </div>
                              <div style={{fontSize:'.85rem'}}>
                                <FaItalic onClick={toggleItalic} style={{cursor:'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconFaItalic poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdStrikethroughS className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdLink className='poppupBodyInputIcon'/>
                              </div>
                            </div>
                        </div>
                      </div>
                        </div>
                        <div className='poppupBroadcast'>
                        <h5>Footer <span className='poppupBroadcastTitleSpan'>(Optional)</span></h5>
                        <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                        <div className="poppupFooterInput">
                          <input maxLength='20' type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange}/>
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
                      <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                      {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                        let copyHtmlTextBody = htmlTextBody
                        copyHtmlTextBody+=`{{${vname}}}`
                        setHtmlTextBody(copyHtmlTextBody)
                        setCleanTextBody(copyHtmlTextBody);
                        setIsAttributePopOpen(false);

                      }} />}
                      <div className='poppupBodyInput'>
                        <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
                          handleTextBodyChange(e.target.value)
                        }}></textarea>
                        <div className='textAreaInputIcons'>
                          <input type='text' disabled/>
                            <div className='poppupBodyInputIcons'>
                              <div>
                                <MdOutlineEmojiEmotions className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal'}} className='poppupBodyInputIconGrBold poppupBodyInputIcon'/>
                              </div>
                              <div style={{fontSize:'.85rem'}}>
                                <FaItalic onClick={toggleItalic} style={{cursor:'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconFaItalic poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdStrikethroughS className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdLink className='poppupBodyInputIcon'/>
                              </div>
                            </div>
                        </div>
                      </div>
                        </div>
                        <div className='poppupBroadcast'>
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
                      

                     <div> {visitWebSiteArray[index].ReplyData.map((cmap,cindex)=>{
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
                      })}</div>
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
                        </div>
                      </>}

                      {/* email */}

                      {(marketingTemplate == 'email') && <>
                        <div className="poppupBroadcast">
                          <h5>Notification title</h5>
                          <p>Highlight your brand here, use images or videos, to stand out</p>
                          <div className="titleInput">
                            <input maxLength='60' type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                          </div>
                        </div>
                        <div className='poppupBroadcast'>
                      <h5>Body</h5>
                      <p>Make your messages personal using variables like and get more replies!</p>
                      <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                      {isAttributePopOpen && <AttributePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                        let copyHtmlTextBody = htmlTextBody
                        copyHtmlTextBody+=`{{${vname}}}`
                        setHtmlTextBody(copyHtmlTextBody)
                        setCleanTextBody(copyHtmlTextBody);
                        setIsAttributePopOpen(false);

                      }} />}
                      <div className='poppupBodyInput'>
                        <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
                          handleTextBodyChange(e.target.value)
                        }}></textarea>
                        <div className='textAreaInputIcons'>
                          <input type='text' disabled/>
                            <div className='poppupBodyInputIcons'>
                              <div>
                                <MdOutlineEmojiEmotions className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <GrBold onClick={toggleBold} style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal'}} className='poppupBodyInputIconGrBold poppupBodyInputIcon'/>
                              </div>
                              <div style={{fontSize:'.85rem'}}>
                                <FaItalic onClick={toggleItalic} style={{cursor:'pointer', fontStyle: isItalic ? 'italic' : 'normal' }} className='poppupBodyInputIconFaItalic poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdStrikethroughS className='poppupBodyInputIcon'/>
                              </div>
                              <div>
                                <MdLink className='poppupBodyInputIcon'/>
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
                  </div></>:""}
              </div>
  
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
                  className={`previewBorder2 ${mobileDeskview === 'desktop' ? 'active' : null}`} 
                  onClick={() => handleMobileDeskView('desktop')}
                >
                  <CiDesktop />
                </div>
                </div>
              </div>
              {(marketingTemplate==="whatsapp" && (mobileDeskview==='mobile' || mobileDeskview==='desktop'))?<> <div className={mobileDeskview == 'desktop' ? 'zoom': null}>
                <img 
                  draggable="false"
                  src={mobileDeskview === 'mobile' ? whatsapp : whatsappDesk} 
                  alt='whatsappImg' 
                  className={classNames}
                  onClick={handleZoomClick}
                />
              </div> 
              <div className='MobileScroll'>
                {/* {mobileDeskview==='mobile' ?
                  <div className='mobileAutoMsg'>
                  <svg class="preview-message__disclaimer" width="220" height="50" viewBox="0 0 241 47" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="241" height="47" rx="7" fill="#DBF2F1"></rect><path d="M27.64 13.026H25.022V12.146H31.303V13.026H28.685V20H27.64V13.026ZM32.0204 12.146H32.9554V15.149H32.9774C33.0507 14.973 33.1534 14.8263 33.2854 14.709C33.4174 14.5843 33.5641 14.4853 33.7254 14.412C33.8941 14.3313 34.0664 14.2727 34.2424 14.236C34.4257 14.1993 34.6017 14.181 34.7704 14.181C35.1444 14.181 35.4561 14.2323 35.7054 14.335C35.9547 14.4377 36.1564 14.5807 36.3104 14.764C36.4644 14.9473 36.5707 15.1673 36.6294 15.424C36.6954 15.6733 36.7284 15.952 36.7284 16.26V20H35.7934V16.15C35.7934 15.798 35.6907 15.5193 35.4854 15.314C35.2801 15.1087 34.9977 15.006 34.6384 15.006C34.3524 15.006 34.1031 15.05 33.8904 15.138C33.6851 15.226 33.5127 15.3507 33.3734 15.512C33.2341 15.6733 33.1277 15.864 33.0544 16.084C32.9884 16.2967 32.9554 16.5313 32.9554 16.788V20H32.0204V12.146ZM39.1227 13.29H38.1877V12.146H39.1227V13.29ZM38.1877 14.313H39.1227V20H38.1877V14.313ZM41.1432 18.207C41.1505 18.4123 41.1982 18.5883 41.2862 18.735C41.3742 18.8743 41.4879 18.988 41.6272 19.076C41.7739 19.1567 41.9352 19.2153 42.1112 19.252C42.2945 19.2887 42.4815 19.307 42.6722 19.307C42.8189 19.307 42.9729 19.296 43.1342 19.274C43.2955 19.252 43.4422 19.2117 43.5742 19.153C43.7135 19.0943 43.8272 19.01 43.9152 18.9C44.0032 18.7827 44.0472 18.636 44.0472 18.46C44.0472 18.218 43.9555 18.0347 43.7722 17.91C43.5889 17.7853 43.3579 17.6863 43.0792 17.613C42.8079 17.5323 42.5109 17.4627 42.1882 17.404C41.8655 17.338 41.5649 17.25 41.2862 17.14C41.0149 17.0227 40.7875 16.8613 40.6042 16.656C40.4209 16.4507 40.3292 16.1647 40.3292 15.798C40.3292 15.512 40.3915 15.2663 40.5162 15.061C40.6482 14.8557 40.8132 14.6907 41.0112 14.566C41.2165 14.434 41.4439 14.3387 41.6932 14.28C41.9499 14.214 42.2029 14.181 42.4522 14.181C42.7749 14.181 43.0719 14.2103 43.3432 14.269C43.6145 14.3203 43.8529 14.4157 44.0582 14.555C44.2709 14.687 44.4395 14.8703 44.5642 15.105C44.6889 15.3323 44.7622 15.6183 44.7842 15.963H43.8492C43.8345 15.7797 43.7869 15.6293 43.7062 15.512C43.6255 15.3873 43.5229 15.2883 43.3982 15.215C43.2735 15.1417 43.1342 15.0903 42.9802 15.061C42.8335 15.0243 42.6832 15.006 42.5292 15.006C42.3899 15.006 42.2469 15.017 42.1002 15.039C41.9609 15.061 41.8325 15.1013 41.7152 15.16C41.5979 15.2113 41.5025 15.2847 41.4292 15.38C41.3559 15.468 41.3192 15.5853 41.3192 15.732C41.3192 15.8933 41.3742 16.029 41.4842 16.139C41.6015 16.2417 41.7482 16.3297 41.9242 16.403C42.1002 16.469 42.2982 16.5277 42.5182 16.579C42.7382 16.623 42.9582 16.6707 43.1782 16.722C43.4129 16.7733 43.6402 16.8357 43.8602 16.909C44.0875 16.9823 44.2855 17.0813 44.4542 17.206C44.6302 17.3233 44.7695 17.4737 44.8722 17.657C44.9822 17.8403 45.0372 18.0677 45.0372 18.339C45.0372 18.6837 44.9639 18.9697 44.8172 19.197C44.6779 19.4243 44.4909 19.6077 44.2562 19.747C44.0289 19.8863 43.7685 19.9817 43.4752 20.033C43.1892 20.0917 42.9032 20.121 42.6172 20.121C42.3019 20.121 42.0012 20.088 41.7152 20.022C41.4292 19.956 41.1762 19.8497 40.9562 19.703C40.7362 19.549 40.5602 19.351 40.4282 19.109C40.2962 18.8597 40.2229 18.559 40.2082 18.207H41.1432ZM49.1657 12.146H50.1007V15.083H50.1227C50.2767 14.7677 50.5187 14.5403 50.8487 14.401C51.1787 14.2543 51.5417 14.181 51.9377 14.181C52.3777 14.181 52.759 14.2617 53.0817 14.423C53.4117 14.5843 53.683 14.8043 53.8957 15.083C54.1157 15.3543 54.2807 15.6697 54.3907 16.029C54.5007 16.3883 54.5557 16.7697 54.5557 17.173C54.5557 17.5763 54.5007 17.9577 54.3907 18.317C54.288 18.6763 54.1267 18.9917 53.9067 19.263C53.694 19.527 53.4227 19.736 53.0927 19.89C52.77 20.044 52.3924 20.121 51.9597 20.121C51.8204 20.121 51.6627 20.1063 51.4867 20.077C51.318 20.0477 51.1494 20 50.9807 19.934C50.812 19.868 50.6507 19.78 50.4967 19.67C50.35 19.5527 50.2254 19.4097 50.1227 19.241H50.1007V20H49.1657V12.146ZM53.5657 17.107C53.5657 16.843 53.529 16.5863 53.4557 16.337C53.3897 16.0803 53.2834 15.853 53.1367 15.655C52.9974 15.457 52.814 15.2993 52.5867 15.182C52.3667 15.0647 52.1064 15.006 51.8057 15.006C51.4904 15.006 51.2227 15.0683 51.0027 15.193C50.7827 15.3177 50.603 15.4827 50.4637 15.688C50.3244 15.886 50.2217 16.1133 50.1557 16.37C50.097 16.6267 50.0677 16.887 50.0677 17.151C50.0677 17.4297 50.1007 17.701 50.1667 17.965C50.2327 18.2217 50.3354 18.449 50.4747 18.647C50.6214 18.845 50.8084 19.0063 51.0357 19.131C51.263 19.2483 51.538 19.307 51.8607 19.307C52.1834 19.307 52.451 19.2447 52.6637 19.12C52.8837 18.9953 53.0597 18.8303 53.1917 18.625C53.3237 18.4197 53.419 18.185 53.4777 17.921C53.5364 17.657 53.5657 17.3857 53.5657 17.107ZM60.3612 20H59.4812V19.098H59.4592C59.2612 19.45 59.0082 19.7103 58.7002 19.879C58.3922 20.0403 58.0292 20.121 57.6112 20.121C57.2372 20.121 56.9256 20.0733 56.6762 19.978C56.4269 19.8753 56.2252 19.7323 56.0712 19.549C55.9172 19.3657 55.8072 19.1493 55.7412 18.9C55.6826 18.6433 55.6532 18.361 55.6532 18.053V14.313H56.5882V18.163C56.5882 18.515 56.6909 18.7937 56.8962 18.999C57.1016 19.2043 57.3839 19.307 57.7432 19.307C58.0292 19.307 58.2749 19.263 58.4802 19.175C58.6929 19.087 58.8689 18.9623 59.0082 18.801C59.1476 18.6397 59.2502 18.4527 59.3162 18.24C59.3896 18.02 59.4262 17.7817 59.4262 17.525V14.313H60.3612V20ZM62.3375 18.207C62.3449 18.4123 62.3925 18.5883 62.4805 18.735C62.5685 18.8743 62.6822 18.988 62.8215 19.076C62.9682 19.1567 63.1295 19.2153 63.3055 19.252C63.4889 19.2887 63.6759 19.307 63.8665 19.307C64.0132 19.307 64.1672 19.296 64.3285 19.274C64.4899 19.252 64.6365 19.2117 64.7685 19.153C64.9079 19.0943 65.0215 19.01 65.1095 18.9C65.1975 18.7827 65.2415 18.636 65.2415 18.46C65.2415 18.218 65.1499 18.0347 64.9665 17.91C64.7832 17.7853 64.5522 17.6863 64.2735 17.613C64.0022 17.5323 63.7052 17.4627 63.3825 17.404C63.0599 17.338 62.7592 17.25 62.4805 17.14C62.2092 17.0227 61.9819 16.8613 61.7985 16.656C61.6152 16.4507 61.5235 16.1647 61.5235 15.798C61.5235 15.512 61.5859 15.2663 61.7105 15.061C61.8425 14.8557 62.0075 14.6907 62.2055 14.566C62.4109 14.434 62.6382 14.3387 62.8875 14.28C63.1442 14.214 63.3972 14.181 63.6465 14.181C63.9692 14.181 64.2662 14.2103 64.5375 14.269C64.8089 14.3203 65.0472 14.4157 65.2525 14.555C65.4652 14.687 65.6339 14.8703 65.7585 15.105C65.8832 15.3323 65.9565 15.6183 65.9785 15.963H65.0435C65.0289 15.7797 64.9812 15.6293 64.9005 15.512C64.8199 15.3873 64.7172 15.2883 64.5925 15.215C64.4679 15.1417 64.3285 15.0903 64.1745 15.061C64.0279 15.0243 63.8775 15.006 63.7235 15.006C63.5842 15.006 63.4412 15.017 63.2945 15.039C63.1552 15.061 63.0269 15.1013 62.9095 15.16C62.7922 15.2113 62.6969 15.2847 62.6235 15.38C62.5502 15.468 62.5135 15.5853 62.5135 15.732C62.5135 15.8933 62.5685 16.029 62.6785 16.139C62.7959 16.2417 62.9425 16.3297 63.1185 16.403C63.2945 16.469 63.4925 16.5277 63.7125 16.579C63.9325 16.623 64.1525 16.6707 64.3725 16.722C64.6072 16.7733 64.8345 16.8357 65.0545 16.909C65.2819 16.9823 65.4799 17.0813 65.6485 17.206C65.8245 17.3233 65.9639 17.4737 66.0665 17.657C66.1765 17.8403 66.2315 18.0677 66.2315 18.339C66.2315 18.6837 66.1582 18.9697 66.0115 19.197C65.8722 19.4243 65.6852 19.6077 65.4505 19.747C65.2232 19.8863 64.9629 19.9817 64.6695 20.033C64.3835 20.0917 64.0975 20.121 63.8115 20.121C63.4962 20.121 63.1955 20.088 62.9095 20.022C62.6235 19.956 62.3705 19.8497 62.1505 19.703C61.9305 19.549 61.7545 19.351 61.6225 19.109C61.4905 18.8597 61.4172 18.559 61.4025 18.207H62.3375ZM68.2555 13.29H67.3205V12.146H68.2555V13.29ZM67.3205 14.313H68.2555V20H67.3205V14.313ZM69.704 14.313H70.584V15.215H70.606C70.9947 14.5257 71.6107 14.181 72.454 14.181C72.828 14.181 73.1397 14.2323 73.389 14.335C73.6383 14.4377 73.84 14.5807 73.994 14.764C74.148 14.9473 74.2543 15.1673 74.313 15.424C74.379 15.6733 74.412 15.952 74.412 16.26V20H73.477V16.15C73.477 15.798 73.3743 15.5193 73.169 15.314C72.9637 15.1087 72.6813 15.006 72.322 15.006C72.036 15.006 71.7867 15.05 71.574 15.138C71.3687 15.226 71.1963 15.3507 71.057 15.512C70.9177 15.6733 70.8113 15.864 70.738 16.084C70.672 16.2967 70.639 16.5313 70.639 16.788V20H69.704V14.313ZM79.7653 16.612C79.7506 16.392 79.6993 16.183 79.6113 15.985C79.5306 15.787 79.417 15.6183 79.2703 15.479C79.131 15.3323 78.9623 15.2187 78.7643 15.138C78.5736 15.05 78.361 15.006 78.1263 15.006C77.8843 15.006 77.6643 15.05 77.4663 15.138C77.2756 15.2187 77.1106 15.3323 76.9713 15.479C76.832 15.6257 76.722 15.798 76.6413 15.996C76.5606 16.1867 76.513 16.392 76.4983 16.612H79.7653ZM80.6673 18.196C80.5426 18.834 80.2676 19.3143 79.8423 19.637C79.417 19.9597 78.8816 20.121 78.2363 20.121C77.7816 20.121 77.3856 20.0477 77.0483 19.901C76.7183 19.7543 76.4396 19.549 76.2123 19.285C75.985 19.021 75.8126 18.7057 75.6953 18.339C75.5853 17.9723 75.523 17.5727 75.5083 17.14C75.5083 16.7073 75.5743 16.3113 75.7063 15.952C75.8383 15.5927 76.0216 15.281 76.2563 15.017C76.4983 14.753 76.7806 14.5477 77.1033 14.401C77.4333 14.2543 77.7926 14.181 78.1813 14.181C78.6873 14.181 79.1053 14.2873 79.4353 14.5C79.7726 14.7053 80.0403 14.9693 80.2383 15.292C80.4436 15.6147 80.583 15.9667 80.6563 16.348C80.737 16.7293 80.77 17.0923 80.7553 17.437H76.4983C76.491 17.6863 76.5203 17.9247 76.5863 18.152C76.6523 18.372 76.7586 18.57 76.9053 18.746C77.052 18.9147 77.239 19.0503 77.4663 19.153C77.6936 19.2557 77.9613 19.307 78.2693 19.307C78.6653 19.307 78.988 19.2153 79.2373 19.032C79.494 18.8487 79.6626 18.57 79.7433 18.196H80.6673ZM82.2965 18.207C82.3038 18.4123 82.3515 18.5883 82.4395 18.735C82.5275 18.8743 82.6412 18.988 82.7805 19.076C82.9272 19.1567 83.0885 19.2153 83.2645 19.252C83.4478 19.2887 83.6348 19.307 83.8255 19.307C83.9722 19.307 84.1262 19.296 84.2875 19.274C84.4488 19.252 84.5955 19.2117 84.7275 19.153C84.8668 19.0943 84.9805 19.01 85.0685 18.9C85.1565 18.7827 85.2005 18.636 85.2005 18.46C85.2005 18.218 85.1088 18.0347 84.9255 17.91C84.7422 17.7853 84.5112 17.6863 84.2325 17.613C83.9612 17.5323 83.6642 17.4627 83.3415 17.404C83.0188 17.338 82.7182 17.25 82.4395 17.14C82.1682 17.0227 81.9408 16.8613 81.7575 16.656C81.5742 16.4507 81.4825 16.1647 81.4825 15.798C81.4825 15.512 81.5448 15.2663 81.6695 15.061C81.8015 14.8557 81.9665 14.6907 82.1645 14.566C82.3698 14.434 82.5972 14.3387 82.8465 14.28C83.1032 14.214 83.3562 14.181 83.6055 14.181C83.9282 14.181 84.2252 14.2103 84.4965 14.269C84.7678 14.3203 85.0062 14.4157 85.2115 14.555C85.4242 14.687 85.5928 14.8703 85.7175 15.105C85.8422 15.3323 85.9155 15.6183 85.9375 15.963H85.0025C84.9878 15.7797 84.9402 15.6293 84.8595 15.512C84.7788 15.3873 84.6762 15.2883 84.5515 15.215C84.4268 15.1417 84.2875 15.0903 84.1335 15.061C83.9868 15.0243 83.8365 15.006 83.6825 15.006C83.5432 15.006 83.4002 15.017 83.2535 15.039C83.1142 15.061 82.9858 15.1013 82.8685 15.16C82.7512 15.2113 82.6558 15.2847 82.5825 15.38C82.5092 15.468 82.4725 15.5853 82.4725 15.732C82.4725 15.8933 82.5275 16.029 82.6375 16.139C82.7548 16.2417 82.9015 16.3297 83.0775 16.403C83.2535 16.469 83.4515 16.5277 83.6715 16.579C83.8915 16.623 84.1115 16.6707 84.3315 16.722C84.5662 16.7733 84.7935 16.8357 85.0135 16.909C85.2408 16.9823 85.4388 17.0813 85.6075 17.206C85.7835 17.3233 85.9228 17.4737 86.0255 17.657C86.1355 17.8403 86.1905 18.0677 86.1905 18.339C86.1905 18.6837 86.1172 18.9697 85.9705 19.197C85.8312 19.4243 85.6442 19.6077 85.4095 19.747C85.1822 19.8863 84.9218 19.9817 84.6285 20.033C84.3425 20.0917 84.0565 20.121 83.7705 20.121C83.4552 20.121 83.1545 20.088 82.8685 20.022C82.5825 19.956 82.3295 19.8497 82.1095 19.703C81.8895 19.549 81.7135 19.351 81.5815 19.109C81.4495 18.8597 81.3762 18.559 81.3615 18.207H82.2965ZM87.7965 18.207C87.8038 18.4123 87.8515 18.5883 87.9395 18.735C88.0275 18.8743 88.1412 18.988 88.2805 19.076C88.4272 19.1567 88.5885 19.2153 88.7645 19.252C88.9478 19.2887 89.1348 19.307 89.3255 19.307C89.4722 19.307 89.6262 19.296 89.7875 19.274C89.9488 19.252 90.0955 19.2117 90.2275 19.153C90.3668 19.0943 90.4805 19.01 90.5685 18.9C90.6565 18.7827 90.7005 18.636 90.7005 18.46C90.7005 18.218 90.6088 18.0347 90.4255 17.91C90.2422 17.7853 90.0112 17.6863 89.7325 17.613C89.4612 17.5323 89.1642 17.4627 88.8415 17.404C88.5188 17.338 88.2182 17.25 87.9395 17.14C87.6682 17.0227 87.4408 16.8613 87.2575 16.656C87.0742 16.4507 86.9825 16.1647 86.9825 15.798C86.9825 15.512 87.0448 15.2663 87.1695 15.061C87.3015 14.8557 87.4665 14.6907 87.6645 14.566C87.8698 14.434 88.0972 14.3387 88.3465 14.28C88.6032 14.214 88.8562 14.181 89.1055 14.181C89.4282 14.181 89.7252 14.2103 89.9965 14.269C90.2678 14.3203 90.5062 14.4157 90.7115 14.555C90.9242 14.687 91.0928 14.8703 91.2175 15.105C91.3422 15.3323 91.4155 15.6183 91.4375 15.963H90.5025C90.4878 15.7797 90.4402 15.6293 90.3595 15.512C90.2788 15.3873 90.1762 15.2883 90.0515 15.215C89.9268 15.1417 89.7875 15.0903 89.6335 15.061C89.4868 15.0243 89.3365 15.006 89.1825 15.006C89.0432 15.006 88.9002 15.017 88.7535 15.039C88.6142 15.061 88.4858 15.1013 88.3685 15.16C88.2512 15.2113 88.1558 15.2847 88.0825 15.38C88.0092 15.468 87.9725 15.5853 87.9725 15.732C87.9725 15.8933 88.0275 16.029 88.1375 16.139C88.2548 16.2417 88.4015 16.3297 88.5775 16.403C88.7535 16.469 88.9515 16.5277 89.1715 16.579C89.3915 16.623 89.6115 16.6707 89.8315 16.722C90.0662 16.7733 90.2935 16.8357 90.5135 16.909C90.7408 16.9823 90.9388 17.0813 91.1075 17.206C91.2835 17.3233 91.4228 17.4737 91.5255 17.657C91.6355 17.8403 91.6905 18.0677 91.6905 18.339C91.6905 18.6837 91.6172 18.9697 91.4705 19.197C91.3312 19.4243 91.1442 19.6077 90.9095 19.747C90.6822 19.8863 90.4218 19.9817 90.1285 20.033C89.8425 20.0917 89.5565 20.121 89.2705 20.121C88.9552 20.121 88.6545 20.088 88.3685 20.022C88.0825 19.956 87.8295 19.8497 87.6095 19.703C87.3895 19.549 87.2135 19.351 87.0815 19.109C86.9495 18.8597 86.8762 18.559 86.8615 18.207H87.7965ZM100.494 20H99.614V19.098H99.592C99.394 19.45 99.141 19.7103 98.833 19.879C98.525 20.0403 98.162 20.121 97.744 20.121C97.37 20.121 97.0584 20.0733 96.809 19.978C96.5597 19.8753 96.358 19.7323 96.204 19.549C96.05 19.3657 95.94 19.1493 95.874 18.9C95.8154 18.6433 95.786 18.361 95.786 18.053V14.313H96.721V18.163C96.721 18.515 96.8237 18.7937 97.029 18.999C97.2344 19.2043 97.5167 19.307 97.876 19.307C98.162 19.307 98.4077 19.263 98.613 19.175C98.8257 19.087 99.0017 18.9623 99.141 18.801C99.2804 18.6397 99.383 18.4527 99.449 18.24C99.5224 18.02 99.559 17.7817 99.559 17.525V14.313H100.494V20ZM102.47 18.207C102.478 18.4123 102.525 18.5883 102.613 18.735C102.701 18.8743 102.815 18.988 102.954 19.076C103.101 19.1567 103.262 19.2153 103.438 19.252C103.622 19.2887 103.809 19.307 103.999 19.307C104.146 19.307 104.3 19.296 104.461 19.274C104.623 19.252 104.769 19.2117 104.901 19.153C105.041 19.0943 105.154 19.01 105.242 18.9C105.33 18.7827 105.374 18.636 105.374 18.46C105.374 18.218 105.283 18.0347 105.099 17.91C104.916 17.7853 104.685 17.6863 104.406 17.613C104.135 17.5323 103.838 17.4627 103.515 17.404C103.193 17.338 102.892 17.25 102.613 17.14C102.342 17.0227 102.115 16.8613 101.931 16.656C101.748 16.4507 101.656 16.1647 101.656 15.798C101.656 15.512 101.719 15.2663 101.843 15.061C101.975 14.8557 102.14 14.6907 102.338 14.566C102.544 14.434 102.771 14.3387 103.02 14.28C103.277 14.214 103.53 14.181 103.779 14.181C104.102 14.181 104.399 14.2103 104.67 14.269C104.942 14.3203 105.18 14.4157 105.385 14.555C105.598 14.687 105.767 14.8703 105.891 15.105C106.016 15.3323 106.089 15.6183 106.111 15.963H105.176C105.162 15.7797 105.114 15.6293 105.033 15.512C104.953 15.3873 104.85 15.2883 104.725 15.215C104.601 15.1417 104.461 15.0903 104.307 15.061C104.161 15.0243 104.01 15.006 103.856 15.006C103.717 15.006 103.574 15.017 103.427 15.039C103.288 15.061 103.16 15.1013 103.042 15.16C102.925 15.2113 102.83 15.2847 102.756 15.38C102.683 15.468 102.646 15.5853 102.646 15.732C102.646 15.8933 102.701 16.029 102.811 16.139C102.929 16.2417 103.075 16.3297 103.251 16.403C103.427 16.469 103.625 16.5277 103.845 16.579C104.065 16.623 104.285 16.6707 104.505 16.722C104.74 16.7733 104.967 16.8357 105.187 16.909C105.415 16.9823 105.613 17.0813 105.781 17.206C105.957 17.3233 106.097 17.4737 106.199 17.657C106.309 17.8403 106.364 18.0677 106.364 18.339C106.364 18.6837 106.291 18.9697 106.144 19.197C106.005 19.4243 105.818 19.6077 105.583 19.747C105.356 19.8863 105.096 19.9817 104.802 20.033C104.516 20.0917 104.23 20.121 103.944 20.121C103.629 20.121 103.328 20.088 103.042 20.022C102.756 19.956 102.503 19.8497 102.283 19.703C102.063 19.549 101.887 19.351 101.755 19.109C101.623 18.8597 101.55 18.559 101.535 18.207H102.47ZM111.347 16.612C111.333 16.392 111.281 16.183 111.193 15.985C111.113 15.787 110.999 15.6183 110.852 15.479C110.713 15.3323 110.544 15.2187 110.346 15.138C110.156 15.05 109.943 15.006 109.708 15.006C109.466 15.006 109.246 15.05 109.048 15.138C108.858 15.2187 108.693 15.3323 108.553 15.479C108.414 15.6257 108.304 15.798 108.223 15.996C108.143 16.1867 108.095 16.392 108.08 16.612H111.347ZM112.249 18.196C112.125 18.834 111.85 19.3143 111.424 19.637C110.999 19.9597 110.464 20.121 109.818 20.121C109.364 20.121 108.968 20.0477 108.63 19.901C108.3 19.7543 108.022 19.549 107.794 19.285C107.567 19.021 107.395 18.7057 107.277 18.339C107.167 17.9723 107.105 17.5727 107.09 17.14C107.09 16.7073 107.156 16.3113 107.288 15.952C107.42 15.5927 107.604 15.281 107.838 15.017C108.08 14.753 108.363 14.5477 108.685 14.401C109.015 14.2543 109.375 14.181 109.763 14.181C110.269 14.181 110.687 14.2873 111.017 14.5C111.355 14.7053 111.622 14.9693 111.82 15.292C112.026 15.6147 112.165 15.9667 112.238 16.348C112.319 16.7293 112.352 17.0923 112.337 17.437H108.08C108.073 17.6863 108.102 17.9247 108.168 18.152C108.234 18.372 108.341 18.57 108.487 18.746C108.634 18.9147 108.821 19.0503 109.048 19.153C109.276 19.2557 109.543 19.307 109.851 19.307C110.247 19.307 110.57 19.2153 110.819 19.032C111.076 18.8487 111.245 18.57 111.325 18.196H112.249ZM113.879 18.207C113.886 18.4123 113.934 18.5883 114.022 18.735C114.11 18.8743 114.223 18.988 114.363 19.076C114.509 19.1567 114.671 19.2153 114.847 19.252C115.03 19.2887 115.217 19.307 115.408 19.307C115.554 19.307 115.708 19.296 115.87 19.274C116.031 19.252 116.178 19.2117 116.31 19.153C116.449 19.0943 116.563 19.01 116.651 18.9C116.739 18.7827 116.783 18.636 116.783 18.46C116.783 18.218 116.691 18.0347 116.508 17.91C116.324 17.7853 116.093 17.6863 115.815 17.613C115.543 17.5323 115.246 17.4627 114.924 17.404C114.601 17.338 114.3 17.25 114.022 17.14C113.75 17.0227 113.523 16.8613 113.34 16.656C113.156 16.4507 113.065 16.1647 113.065 15.798C113.065 15.512 113.127 15.2663 113.252 15.061C113.384 14.8557 113.549 14.6907 113.747 14.566C113.952 14.434 114.179 14.3387 114.429 14.28C114.685 14.214 114.938 14.181 115.188 14.181C115.51 14.181 115.807 14.2103 116.079 14.269C116.35 14.3203 116.588 14.4157 116.794 14.555C117.006 14.687 117.175 14.8703 117.3 15.105C117.424 15.3323 117.498 15.6183 117.52 15.963H116.585C116.57 15.7797 116.522 15.6293 116.442 15.512C116.361 15.3873 116.258 15.2883 116.134 15.215C116.009 15.1417 115.87 15.0903 115.716 15.061C115.569 15.0243 115.419 15.006 115.265 15.006C115.125 15.006 114.982 15.017 114.836 15.039C114.696 15.061 114.568 15.1013 114.451 15.16C114.333 15.2113 114.238 15.2847 114.165 15.38C114.091 15.468 114.055 15.5853 114.055 15.732C114.055 15.8933 114.11 16.029 114.22 16.139C114.337 16.2417 114.484 16.3297 114.66 16.403C114.836 16.469 115.034 16.5277 115.254 16.579C115.474 16.623 115.694 16.6707 115.914 16.722C116.148 16.7733 116.376 16.8357 116.596 16.909C116.823 16.9823 117.021 17.0813 117.19 17.206C117.366 17.3233 117.505 17.4737 117.608 17.657C117.718 17.8403 117.773 18.0677 117.773 18.339C117.773 18.6837 117.699 18.9697 117.553 19.197C117.413 19.4243 117.226 19.6077 116.992 19.747C116.764 19.8863 116.504 19.9817 116.211 20.033C115.925 20.0917 115.639 20.121 115.353 20.121C115.037 20.121 114.737 20.088 114.451 20.022C114.165 19.956 113.912 19.8497 113.692 19.703C113.472 19.549 113.296 19.351 113.164 19.109C113.032 18.8597 112.958 18.559 112.944 18.207H113.879ZM126.906 19.978C126.745 20.0733 126.521 20.121 126.235 20.121C125.993 20.121 125.799 20.055 125.652 19.923C125.513 19.7837 125.443 19.56 125.443 19.252C125.186 19.56 124.886 19.7837 124.541 19.923C124.204 20.055 123.837 20.121 123.441 20.121C123.184 20.121 122.939 20.0917 122.704 20.033C122.477 19.9743 122.279 19.8827 122.11 19.758C121.941 19.6333 121.806 19.472 121.703 19.274C121.608 19.0687 121.56 18.823 121.56 18.537C121.56 18.2143 121.615 17.9503 121.725 17.745C121.835 17.5397 121.978 17.3747 122.154 17.25C122.337 17.118 122.543 17.019 122.77 16.953C123.005 16.887 123.243 16.832 123.485 16.788C123.742 16.7367 123.984 16.7 124.211 16.678C124.446 16.6487 124.651 16.612 124.827 16.568C125.003 16.5167 125.142 16.447 125.245 16.359C125.348 16.2637 125.399 16.128 125.399 15.952C125.399 15.7467 125.359 15.5817 125.278 15.457C125.205 15.3323 125.106 15.237 124.981 15.171C124.864 15.105 124.728 15.061 124.574 15.039C124.427 15.017 124.281 15.006 124.134 15.006C123.738 15.006 123.408 15.083 123.144 15.237C122.88 15.3837 122.737 15.666 122.715 16.084H121.78C121.795 15.732 121.868 15.435 122 15.193C122.132 14.951 122.308 14.7567 122.528 14.61C122.748 14.456 122.997 14.346 123.276 14.28C123.562 14.214 123.866 14.181 124.189 14.181C124.446 14.181 124.699 14.1993 124.948 14.236C125.205 14.2727 125.436 14.3497 125.641 14.467C125.846 14.577 126.011 14.7347 126.136 14.94C126.261 15.1453 126.323 15.413 126.323 15.743V18.669C126.323 18.889 126.334 19.0503 126.356 19.153C126.385 19.2557 126.473 19.307 126.62 19.307C126.701 19.307 126.796 19.2887 126.906 19.252V19.978ZM125.388 17.063C125.271 17.151 125.117 17.217 124.926 17.261C124.735 17.2977 124.534 17.3307 124.321 17.36C124.116 17.382 123.907 17.4113 123.694 17.448C123.481 17.4773 123.291 17.5287 123.122 17.602C122.953 17.6753 122.814 17.7817 122.704 17.921C122.601 18.053 122.55 18.2363 122.55 18.471C122.55 18.625 122.579 18.757 122.638 18.867C122.704 18.9697 122.785 19.054 122.88 19.12C122.983 19.186 123.1 19.2337 123.232 19.263C123.364 19.2923 123.503 19.307 123.65 19.307C123.958 19.307 124.222 19.2667 124.442 19.186C124.662 19.098 124.842 18.9917 124.981 18.867C125.12 18.735 125.223 18.5957 125.289 18.449C125.355 18.295 125.388 18.152 125.388 18.02V17.063ZM131.41 18.207C131.417 18.4123 131.465 18.5883 131.553 18.735C131.641 18.8743 131.754 18.988 131.894 19.076C132.04 19.1567 132.202 19.2153 132.378 19.252C132.561 19.2887 132.748 19.307 132.939 19.307C133.085 19.307 133.239 19.296 133.401 19.274C133.562 19.252 133.709 19.2117 133.841 19.153C133.98 19.0943 134.094 19.01 134.182 18.9C134.27 18.7827 134.314 18.636 134.314 18.46C134.314 18.218 134.222 18.0347 134.039 17.91C133.855 17.7853 133.624 17.6863 133.346 17.613C133.074 17.5323 132.777 17.4627 132.455 17.404C132.132 17.338 131.831 17.25 131.553 17.14C131.281 17.0227 131.054 16.8613 130.871 16.656C130.687 16.4507 130.596 16.1647 130.596 15.798C130.596 15.512 130.658 15.2663 130.783 15.061C130.915 14.8557 131.08 14.6907 131.278 14.566C131.483 14.434 131.71 14.3387 131.96 14.28C132.216 14.214 132.469 14.181 132.719 14.181C133.041 14.181 133.338 14.2103 133.61 14.269C133.881 14.3203 134.119 14.4157 134.325 14.555C134.537 14.687 134.706 14.8703 134.831 15.105C134.955 15.3323 135.029 15.6183 135.051 15.963H134.116C134.101 15.7797 134.053 15.6293 133.973 15.512C133.892 15.3873 133.789 15.2883 133.665 15.215C133.54 15.1417 133.401 15.0903 133.247 15.061C133.1 15.0243 132.95 15.006 132.796 15.006C132.656 15.006 132.513 15.017 132.367 15.039C132.227 15.061 132.099 15.1013 131.982 15.16C131.864 15.2113 131.769 15.2847 131.696 15.38C131.622 15.468 131.586 15.5853 131.586 15.732C131.586 15.8933 131.641 16.029 131.751 16.139C131.868 16.2417 132.015 16.3297 132.191 16.403C132.367 16.469 132.565 16.5277 132.785 16.579C133.005 16.623 133.225 16.6707 133.445 16.722C133.679 16.7733 133.907 16.8357 134.127 16.909C134.354 16.9823 134.552 17.0813 134.721 17.206C134.897 17.3233 135.036 17.4737 135.139 17.657C135.249 17.8403 135.304 18.0677 135.304 18.339C135.304 18.6837 135.23 18.9697 135.084 19.197C134.944 19.4243 134.757 19.6077 134.523 19.747C134.295 19.8863 134.035 19.9817 133.742 20.033C133.456 20.0917 133.17 20.121 132.884 20.121C132.568 20.121 132.268 20.088 131.982 20.022C131.696 19.956 131.443 19.8497 131.223 19.703C131.003 19.549 130.827 19.351 130.695 19.109C130.563 18.8597 130.489 18.559 130.475 18.207H131.41ZM140.287 16.612C140.272 16.392 140.221 16.183 140.133 15.985C140.052 15.787 139.938 15.6183 139.792 15.479C139.652 15.3323 139.484 15.2187 139.286 15.138C139.095 15.05 138.882 15.006 138.648 15.006C138.406 15.006 138.186 15.05 137.988 15.138C137.797 15.2187 137.632 15.3323 137.493 15.479C137.353 15.6257 137.243 15.798 137.163 15.996C137.082 16.1867 137.034 16.392 137.02 16.612H140.287ZM141.189 18.196C141.064 18.834 140.789 19.3143 140.364 19.637C139.938 19.9597 139.403 20.121 138.758 20.121C138.303 20.121 137.907 20.0477 137.57 19.901C137.24 19.7543 136.961 19.549 136.734 19.285C136.506 19.021 136.334 18.7057 136.217 18.339C136.107 17.9723 136.044 17.5727 136.03 17.14C136.03 16.7073 136.096 16.3113 136.228 15.952C136.36 15.5927 136.543 15.281 136.778 15.017C137.02 14.753 137.302 14.5477 137.625 14.401C137.955 14.2543 138.314 14.181 138.703 14.181C139.209 14.181 139.627 14.2873 139.957 14.5C140.294 14.7053 140.562 14.9693 140.76 15.292C140.965 15.6147 141.104 15.9667 141.178 16.348C141.258 16.7293 141.291 17.0923 141.277 17.437H137.02C137.012 17.6863 137.042 17.9247 137.108 18.152C137.174 18.372 137.28 18.57 137.427 18.746C137.573 18.9147 137.76 19.0503 137.988 19.153C138.215 19.2557 138.483 19.307 138.791 19.307C139.187 19.307 139.509 19.2153 139.759 19.032C140.015 18.8487 140.184 18.57 140.265 18.196H141.189ZM146.107 16.139C146.034 15.7797 145.88 15.501 145.645 15.303C145.41 15.105 145.095 15.006 144.699 15.006C144.362 15.006 144.079 15.0683 143.852 15.193C143.625 15.3177 143.441 15.4827 143.302 15.688C143.17 15.8933 143.075 16.1317 143.016 16.403C142.957 16.667 142.928 16.942 142.928 17.228C142.928 17.492 142.957 17.7487 143.016 17.998C143.082 18.2473 143.181 18.471 143.313 18.669C143.445 18.8597 143.617 19.0137 143.83 19.131C144.043 19.2483 144.296 19.307 144.589 19.307C145.051 19.307 145.41 19.186 145.667 18.944C145.931 18.702 146.092 18.361 146.151 17.921H147.108C147.005 18.625 146.741 19.1677 146.316 19.549C145.898 19.9303 145.326 20.121 144.6 20.121C144.167 20.121 143.782 20.0513 143.445 19.912C143.115 19.7727 142.836 19.5747 142.609 19.318C142.389 19.0613 142.22 18.757 142.103 18.405C141.993 18.0457 141.938 17.6533 141.938 17.228C141.938 16.8027 141.993 16.4067 142.103 16.04C142.213 15.666 142.378 15.3433 142.598 15.072C142.825 14.7933 143.108 14.577 143.445 14.423C143.782 14.2617 144.175 14.181 144.622 14.181C144.945 14.181 145.245 14.2213 145.524 14.302C145.81 14.3753 146.059 14.4927 146.272 14.654C146.492 14.8153 146.672 15.0207 146.811 15.27C146.95 15.512 147.038 15.8017 147.075 16.139H146.107ZM152.862 20H151.982V19.098H151.96C151.762 19.45 151.509 19.7103 151.201 19.879C150.893 20.0403 150.53 20.121 150.112 20.121C149.738 20.121 149.427 20.0733 149.177 19.978C148.928 19.8753 148.726 19.7323 148.572 19.549C148.418 19.3657 148.308 19.1493 148.242 18.9C148.184 18.6433 148.154 18.361 148.154 18.053V14.313H149.089V18.163C149.089 18.515 149.192 18.7937 149.397 18.999C149.603 19.2043 149.885 19.307 150.244 19.307C150.53 19.307 150.776 19.263 150.981 19.175C151.194 19.087 151.37 18.9623 151.509 18.801C151.649 18.6397 151.751 18.4527 151.817 18.24C151.891 18.02 151.927 17.7817 151.927 17.525V14.313H152.862V20ZM154.234 14.313H155.114V15.512H155.136C155.363 15.05 155.642 14.709 155.972 14.489C156.302 14.269 156.72 14.1663 157.226 14.181V15.171C156.852 15.171 156.533 15.2223 156.269 15.325C156.005 15.4277 155.792 15.578 155.631 15.776C155.469 15.974 155.352 16.216 155.279 16.502C155.205 16.7807 155.169 17.1033 155.169 17.47V20H154.234V14.313ZM161.685 16.612C161.671 16.392 161.619 16.183 161.531 15.985C161.451 15.787 161.337 15.6183 161.19 15.479C161.051 15.3323 160.882 15.2187 160.684 15.138C160.494 15.05 160.281 15.006 160.046 15.006C159.804 15.006 159.584 15.05 159.386 15.138C159.196 15.2187 159.031 15.3323 158.891 15.479C158.752 15.6257 158.642 15.798 158.561 15.996C158.481 16.1867 158.433 16.392 158.418 16.612H161.685ZM162.587 18.196C162.463 18.834 162.188 19.3143 161.762 19.637C161.337 19.9597 160.802 20.121 160.156 20.121C159.702 20.121 159.306 20.0477 158.968 19.901C158.638 19.7543 158.36 19.549 158.132 19.285C157.905 19.021 157.733 18.7057 157.615 18.339C157.505 17.9723 157.443 17.5727 157.428 17.14C157.428 16.7073 157.494 16.3113 157.626 15.952C157.758 15.5927 157.942 15.281 158.176 15.017C158.418 14.753 158.701 14.5477 159.023 14.401C159.353 14.2543 159.713 14.181 160.101 14.181C160.607 14.181 161.025 14.2873 161.355 14.5C161.693 14.7053 161.96 14.9693 162.158 15.292C162.364 15.6147 162.503 15.9667 162.576 16.348C162.657 16.7293 162.69 17.0923 162.675 17.437H158.418C158.411 17.6863 158.44 17.9247 158.506 18.152C158.572 18.372 158.679 18.57 158.825 18.746C158.972 18.9147 159.159 19.0503 159.386 19.153C159.614 19.2557 159.881 19.307 160.189 19.307C160.585 19.307 160.908 19.2153 161.157 19.032C161.414 18.8487 161.583 18.57 161.663 18.196H162.587ZM167.278 18.207C167.285 18.4123 167.333 18.5883 167.421 18.735C167.509 18.8743 167.623 18.988 167.762 19.076C167.909 19.1567 168.07 19.2153 168.246 19.252C168.429 19.2887 168.616 19.307 168.807 19.307C168.954 19.307 169.108 19.296 169.269 19.274C169.43 19.252 169.577 19.2117 169.709 19.153C169.848 19.0943 169.962 19.01 170.05 18.9C170.138 18.7827 170.182 18.636 170.182 18.46C170.182 18.218 170.09 18.0347 169.907 17.91C169.724 17.7853 169.493 17.6863 169.214 17.613C168.943 17.5323 168.646 17.4627 168.323 17.404C168 17.338 167.7 17.25 167.421 17.14C167.15 17.0227 166.922 16.8613 166.739 16.656C166.556 16.4507 166.464 16.1647 166.464 15.798C166.464 15.512 166.526 15.2663 166.651 15.061C166.783 14.8557 166.948 14.6907 167.146 14.566C167.351 14.434 167.579 14.3387 167.828 14.28C168.085 14.214 168.338 14.181 168.587 14.181C168.91 14.181 169.207 14.2103 169.478 14.269C169.749 14.3203 169.988 14.4157 170.193 14.555C170.406 14.687 170.574 14.8703 170.699 15.105C170.824 15.3323 170.897 15.6183 170.919 15.963H169.984C169.969 15.7797 169.922 15.6293 169.841 15.512C169.76 15.3873 169.658 15.2883 169.533 15.215C169.408 15.1417 169.269 15.0903 169.115 15.061C168.968 15.0243 168.818 15.006 168.664 15.006C168.525 15.006 168.382 15.017 168.235 15.039C168.096 15.061 167.967 15.1013 167.85 15.16C167.733 15.2113 167.637 15.2847 167.564 15.38C167.491 15.468 167.454 15.5853 167.454 15.732C167.454 15.8933 167.509 16.029 167.619 16.139C167.736 16.2417 167.883 16.3297 168.059 16.403C168.235 16.469 168.433 16.5277 168.653 16.579C168.873 16.623 169.093 16.6707 169.313 16.722C169.548 16.7733 169.775 16.8357 169.995 16.909C170.222 16.9823 170.42 17.0813 170.589 17.206C170.765 17.3233 170.904 17.4737 171.007 17.657C171.117 17.8403 171.172 18.0677 171.172 18.339C171.172 18.6837 171.099 18.9697 170.952 19.197C170.813 19.4243 170.626 19.6077 170.391 19.747C170.164 19.8863 169.903 19.9817 169.61 20.033C169.324 20.0917 169.038 20.121 168.752 20.121C168.437 20.121 168.136 20.088 167.85 20.022C167.564 19.956 167.311 19.8497 167.091 19.703C166.871 19.549 166.695 19.351 166.563 19.109C166.431 18.8597 166.358 18.559 166.343 18.207H167.278ZM176.155 16.612C176.14 16.392 176.089 16.183 176.001 15.985C175.92 15.787 175.807 15.6183 175.66 15.479C175.521 15.3323 175.352 15.2187 175.154 15.138C174.963 15.05 174.751 15.006 174.516 15.006C174.274 15.006 174.054 15.05 173.856 15.138C173.665 15.2187 173.5 15.3323 173.361 15.479C173.222 15.6257 173.112 15.798 173.031 15.996C172.95 16.1867 172.903 16.392 172.888 16.612H176.155ZM177.057 18.196C176.932 18.834 176.657 19.3143 176.232 19.637C175.807 19.9597 175.271 20.121 174.626 20.121C174.171 20.121 173.775 20.0477 173.438 19.901C173.108 19.7543 172.829 19.549 172.602 19.285C172.375 19.021 172.202 18.7057 172.085 18.339C171.975 17.9723 171.913 17.5727 171.898 17.14C171.898 16.7073 171.964 16.3113 172.096 15.952C172.228 15.5927 172.411 15.281 172.646 15.017C172.888 14.753 173.17 14.5477 173.493 14.401C173.823 14.2543 174.182 14.181 174.571 14.181C175.077 14.181 175.495 14.2873 175.825 14.5C176.162 14.7053 176.43 14.9693 176.628 15.292C176.833 15.6147 176.973 15.9667 177.046 16.348C177.127 16.7293 177.16 17.0923 177.145 17.437H172.888C172.881 17.6863 172.91 17.9247 172.976 18.152C173.042 18.372 173.148 18.57 173.295 18.746C173.442 18.9147 173.629 19.0503 173.856 19.153C174.083 19.2557 174.351 19.307 174.659 19.307C175.055 19.307 175.378 19.2153 175.627 19.032C175.884 18.8487 176.052 18.57 176.133 18.196H177.057ZM178.081 14.313H178.961V15.512H178.983C179.21 15.05 179.489 14.709 179.819 14.489C180.149 14.269 180.567 14.1663 181.073 14.181V15.171C180.699 15.171 180.38 15.2223 180.116 15.325C179.852 15.4277 179.639 15.578 179.478 15.776C179.317 15.974 179.199 16.216 179.126 16.502C179.053 16.7807 179.016 17.1033 179.016 17.47V20H178.081V14.313ZM184.34 20H183.339L181.227 14.313H182.272L183.867 19.054H183.889L185.44 14.313H186.419L184.34 20ZM188.267 13.29H187.332V12.146H188.267V13.29ZM187.332 14.313H188.267V20H187.332V14.313ZM193.577 16.139C193.503 15.7797 193.349 15.501 193.115 15.303C192.88 15.105 192.565 15.006 192.169 15.006C191.831 15.006 191.549 15.0683 191.322 15.193C191.094 15.3177 190.911 15.4827 190.772 15.688C190.64 15.8933 190.544 16.1317 190.486 16.403C190.427 16.667 190.398 16.942 190.398 17.228C190.398 17.492 190.427 17.7487 190.486 17.998C190.552 18.2473 190.651 18.471 190.783 18.669C190.915 18.8597 191.087 19.0137 191.3 19.131C191.512 19.2483 191.765 19.307 192.059 19.307C192.521 19.307 192.88 19.186 193.137 18.944C193.401 18.702 193.562 18.361 193.621 17.921H194.578C194.475 18.625 194.211 19.1677 193.786 19.549C193.368 19.9303 192.796 20.121 192.07 20.121C191.637 20.121 191.252 20.0513 190.915 19.912C190.585 19.7727 190.306 19.5747 190.079 19.318C189.859 19.0613 189.69 18.757 189.573 18.405C189.463 18.0457 189.408 17.6533 189.408 17.228C189.408 16.8027 189.463 16.4067 189.573 16.04C189.683 15.666 189.848 15.3433 190.068 15.072C190.295 14.7933 190.577 14.577 190.915 14.423C191.252 14.2617 191.644 14.181 192.092 14.181C192.414 14.181 192.715 14.2213 192.994 14.302C193.28 14.3753 193.529 14.4927 193.742 14.654C193.962 14.8153 194.141 15.0207 194.281 15.27C194.42 15.512 194.508 15.8017 194.545 16.139H193.577ZM199.573 16.612C199.558 16.392 199.507 16.183 199.419 15.985C199.338 15.787 199.225 15.6183 199.078 15.479C198.939 15.3323 198.77 15.2187 198.572 15.138C198.381 15.05 198.169 15.006 197.934 15.006C197.692 15.006 197.472 15.05 197.274 15.138C197.083 15.2187 196.918 15.3323 196.779 15.479C196.64 15.6257 196.53 15.798 196.449 15.996C196.368 16.1867 196.321 16.392 196.306 16.612H199.573ZM200.475 18.196C200.35 18.834 200.075 19.3143 199.65 19.637C199.225 19.9597 198.689 20.121 198.044 20.121C197.589 20.121 197.193 20.0477 196.856 19.901C196.526 19.7543 196.247 19.549 196.02 19.285C195.793 19.021 195.62 18.7057 195.503 18.339C195.393 17.9723 195.331 17.5727 195.316 17.14C195.316 16.7073 195.382 16.3113 195.514 15.952C195.646 15.5927 195.829 15.281 196.064 15.017C196.306 14.753 196.588 14.5477 196.911 14.401C197.241 14.2543 197.6 14.181 197.989 14.181C198.495 14.181 198.913 14.2873 199.243 14.5C199.58 14.7053 199.848 14.9693 200.046 15.292C200.251 15.6147 200.391 15.9667 200.464 16.348C200.545 16.7293 200.578 17.0923 200.563 17.437H196.306C196.299 17.6863 196.328 17.9247 196.394 18.152C196.46 18.372 196.566 18.57 196.713 18.746C196.86 18.9147 197.047 19.0503 197.274 19.153C197.501 19.2557 197.769 19.307 198.077 19.307C198.473 19.307 198.796 19.2153 199.045 19.032C199.302 18.8487 199.47 18.57 199.551 18.196H200.475ZM204.979 15.138H204.022V14.313H204.979V13.466C204.979 13.004 205.111 12.6557 205.375 12.421C205.646 12.179 206.038 12.058 206.552 12.058C206.64 12.058 206.739 12.0653 206.849 12.08C206.966 12.0947 207.069 12.1167 207.157 12.146V12.96C207.076 12.9307 206.988 12.9123 206.893 12.905C206.797 12.8903 206.709 12.883 206.629 12.883C206.401 12.883 206.225 12.927 206.101 13.015C205.976 13.103 205.914 13.2717 205.914 13.521V14.313H207.014V15.138H205.914V20H204.979V15.138ZM207.816 14.313H208.696V15.512H208.718C208.945 15.05 209.224 14.709 209.554 14.489C209.884 14.269 210.302 14.1663 210.808 14.181V15.171C210.434 15.171 210.115 15.2223 209.851 15.325C209.587 15.4277 209.374 15.578 209.213 15.776C209.051 15.974 208.934 16.216 208.861 16.502C208.787 16.7807 208.751 17.1033 208.751 17.47V20H207.816V14.313ZM212 17.162C212 17.5067 212.044 17.8147 212.132 18.086C212.228 18.35 212.356 18.5737 212.517 18.757C212.679 18.933 212.866 19.0687 213.078 19.164C213.298 19.2593 213.529 19.307 213.771 19.307C214.013 19.307 214.241 19.2593 214.453 19.164C214.673 19.0687 214.864 18.933 215.025 18.757C215.187 18.5737 215.311 18.35 215.399 18.086C215.495 17.8147 215.542 17.5067 215.542 17.162C215.542 16.8173 215.495 16.513 215.399 16.249C215.311 15.9777 215.187 15.7503 215.025 15.567C214.864 15.3837 214.673 15.2443 214.453 15.149C214.241 15.0537 214.013 15.006 213.771 15.006C213.529 15.006 213.298 15.0537 213.078 15.149C212.866 15.2443 212.679 15.3837 212.517 15.567C212.356 15.7503 212.228 15.9777 212.132 16.249C212.044 16.513 212 16.8173 212 17.162ZM211.01 17.162C211.01 16.744 211.069 16.3553 211.186 15.996C211.304 15.6293 211.48 15.314 211.714 15.05C211.949 14.7787 212.239 14.566 212.583 14.412C212.928 14.258 213.324 14.181 213.771 14.181C214.226 14.181 214.622 14.258 214.959 14.412C215.304 14.566 215.594 14.7787 215.828 15.05C216.063 15.314 216.239 15.6293 216.356 15.996C216.474 16.3553 216.532 16.744 216.532 17.162C216.532 17.58 216.474 17.9687 216.356 18.328C216.239 18.6873 216.063 19.0027 215.828 19.274C215.594 19.538 215.304 19.747 214.959 19.901C214.622 20.0477 214.226 20.121 213.771 20.121C213.324 20.121 212.928 20.0477 212.583 19.901C212.239 19.747 211.949 19.538 211.714 19.274C211.48 19.0027 211.304 18.6873 211.186 18.328C211.069 17.9687 211.01 17.58 211.01 17.162ZM217.635 14.313H218.515V15.149H218.537C218.962 14.5037 219.574 14.181 220.374 14.181C220.726 14.181 221.045 14.2543 221.331 14.401C221.617 14.5477 221.818 14.797 221.936 15.149C222.126 14.841 222.376 14.6027 222.684 14.434C222.999 14.2653 223.344 14.181 223.718 14.181C224.004 14.181 224.26 14.214 224.488 14.28C224.722 14.3387 224.92 14.434 225.082 14.566C225.25 14.698 225.379 14.8703 225.467 15.083C225.562 15.2883 225.61 15.5377 225.61 15.831V20H224.675V16.271C224.675 16.095 224.66 15.93 224.631 15.776C224.601 15.622 224.546 15.49 224.466 15.38C224.385 15.2627 224.271 15.171 224.125 15.105C223.985 15.039 223.802 15.006 223.575 15.006C223.113 15.006 222.75 15.138 222.486 15.402C222.222 15.666 222.09 16.018 222.09 16.458V20H221.155V16.271C221.155 16.0877 221.136 15.919 221.1 15.765C221.07 15.611 221.015 15.479 220.935 15.369C220.854 15.2517 220.744 15.1637 220.605 15.105C220.473 15.039 220.3 15.006 220.088 15.006C219.816 15.006 219.582 15.061 219.384 15.171C219.193 15.281 219.035 15.413 218.911 15.567C218.793 15.721 218.705 15.8823 218.647 16.051C218.595 16.2123 218.57 16.348 218.57 16.458V20H217.635V14.313Z" fill="#607372"></path><path d="M10.88 28.146H12.31L14.785 34.746L17.271 28.146H18.701V36H17.711V29.466H17.689L15.236 36H14.345L11.892 29.466H11.87V36H10.88V28.146ZM24.235 32.612C24.2204 32.392 24.169 32.183 24.081 31.985C24.0004 31.787 23.8867 31.6183 23.74 31.479C23.6007 31.3323 23.432 31.2187 23.234 31.138C23.0434 31.05 22.8307 31.006 22.596 31.006C22.354 31.006 22.134 31.05 21.936 31.138C21.7454 31.2187 21.5804 31.3323 21.441 31.479C21.3017 31.6257 21.1917 31.798 21.111 31.996C21.0304 32.1867 20.9827 32.392 20.968 32.612H24.235ZM25.137 34.196C25.0124 34.834 24.7374 35.3143 24.312 35.637C23.8867 35.9597 23.3514 36.121 22.706 36.121C22.2514 36.121 21.8554 36.0477 21.518 35.901C21.188 35.7543 20.9094 35.549 20.682 35.285C20.4547 35.021 20.2824 34.7057 20.165 34.339C20.055 33.9723 19.9927 33.5727 19.978 33.14C19.978 32.7073 20.044 32.3113 20.176 31.952C20.308 31.5927 20.4914 31.281 20.726 31.017C20.968 30.753 21.2504 30.5477 21.573 30.401C21.903 30.2543 22.2624 30.181 22.651 30.181C23.157 30.181 23.575 30.2873 23.905 30.5C24.2424 30.7053 24.51 30.9693 24.708 31.292C24.9134 31.6147 25.0527 31.9667 25.126 32.348C25.2067 32.7293 25.2397 33.0923 25.225 33.437H20.968C20.9607 33.6863 20.99 33.9247 21.056 34.152C21.122 34.372 21.2284 34.57 21.375 34.746C21.5217 34.9147 21.7087 35.0503 21.936 35.153C22.1634 35.2557 22.431 35.307 22.739 35.307C23.135 35.307 23.4577 35.2153 23.707 35.032C23.9637 34.8487 24.1324 34.57 24.213 34.196H25.137ZM27.4922 30.313H28.6252V31.138H27.4922V34.669C27.4922 34.779 27.4996 34.867 27.5142 34.933C27.5362 34.999 27.5729 35.0503 27.6242 35.087C27.6756 35.1237 27.7452 35.1493 27.8332 35.164C27.9286 35.1713 28.0496 35.175 28.1962 35.175H28.6252V36H27.9102C27.6682 36 27.4592 35.9853 27.2832 35.956C27.1146 35.9193 26.9752 35.857 26.8652 35.769C26.7626 35.681 26.6856 35.5563 26.6342 35.395C26.5829 35.2337 26.5572 35.021 26.5572 34.757V31.138H25.5892V30.313H26.5572V28.608H27.4922V30.313ZM34.702 35.978C34.5406 36.0733 34.317 36.121 34.031 36.121C33.789 36.121 33.5946 36.055 33.448 35.923C33.3086 35.7837 33.239 35.56 33.239 35.252C32.9823 35.56 32.6816 35.7837 32.337 35.923C31.9996 36.055 31.633 36.121 31.237 36.121C30.9803 36.121 30.7346 36.0917 30.5 36.033C30.2726 35.9743 30.0746 35.8827 29.906 35.758C29.7373 35.6333 29.6016 35.472 29.499 35.274C29.4036 35.0687 29.356 34.823 29.356 34.537C29.356 34.2143 29.411 33.9503 29.521 33.745C29.631 33.5397 29.774 33.3747 29.95 33.25C30.1333 33.118 30.3386 33.019 30.566 32.953C30.8006 32.887 31.039 32.832 31.281 32.788C31.5376 32.7367 31.7796 32.7 32.007 32.678C32.2416 32.6487 32.447 32.612 32.623 32.568C32.799 32.5167 32.9383 32.447 33.041 32.359C33.1436 32.2637 33.195 32.128 33.195 31.952C33.195 31.7467 33.1546 31.5817 33.074 31.457C33.0006 31.3323 32.9016 31.237 32.777 31.171C32.6596 31.105 32.524 31.061 32.37 31.039C32.2233 31.017 32.0766 31.006 31.93 31.006C31.534 31.006 31.204 31.083 30.94 31.237C30.676 31.3837 30.533 31.666 30.511 32.084H29.576C29.5906 31.732 29.664 31.435 29.796 31.193C29.928 30.951 30.104 30.7567 30.324 30.61C30.544 30.456 30.7933 30.346 31.072 30.28C31.358 30.214 31.6623 30.181 31.985 30.181C32.2416 30.181 32.4946 30.1993 32.744 30.236C33.0006 30.2727 33.2316 30.3497 33.437 30.467C33.6423 30.577 33.8073 30.7347 33.932 30.94C34.0566 31.1453 34.119 31.413 34.119 31.743V34.669C34.119 34.889 34.13 35.0503 34.152 35.153C34.1813 35.2557 34.2693 35.307 34.416 35.307C34.4966 35.307 34.592 35.2887 34.702 35.252V35.978ZM33.184 33.063C33.0666 33.151 32.9126 33.217 32.722 33.261C32.5313 33.2977 32.3296 33.3307 32.117 33.36C31.9116 33.382 31.7026 33.4113 31.49 33.448C31.2773 33.4773 31.0866 33.5287 30.918 33.602C30.7493 33.6753 30.61 33.7817 30.5 33.921C30.3973 34.053 30.346 34.2363 30.346 34.471C30.346 34.625 30.3753 34.757 30.434 34.867C30.5 34.9697 30.5806 35.054 30.676 35.12C30.7786 35.186 30.896 35.2337 31.028 35.263C31.16 35.2923 31.2993 35.307 31.446 35.307C31.754 35.307 32.018 35.2667 32.238 35.186C32.458 35.098 32.6376 34.9917 32.777 34.867C32.9163 34.735 33.019 34.5957 33.085 34.449C33.151 34.295 33.184 34.152 33.184 34.02V33.063ZM39.9317 30.313H41.0647V31.138H39.9317V34.669C39.9317 34.779 39.939 34.867 39.9537 34.933C39.9757 34.999 40.0124 35.0503 40.0637 35.087C40.115 35.1237 40.1847 35.1493 40.2727 35.164C40.368 35.1713 40.489 35.175 40.6357 35.175H41.0647V36H40.3497C40.1077 36 39.8987 35.9853 39.7227 35.956C39.554 35.9193 39.4147 35.857 39.3047 35.769C39.202 35.681 39.125 35.5563 39.0737 35.395C39.0224 35.2337 38.9967 35.021 38.9967 34.757V31.138H38.0287V30.313H38.9967V28.608H39.9317V30.313ZM42.7854 33.162C42.7854 33.5067 42.8294 33.8147 42.9174 34.086C43.0127 34.35 43.1411 34.5737 43.3024 34.757C43.4637 34.933 43.6507 35.0687 43.8634 35.164C44.0834 35.2593 44.3144 35.307 44.5564 35.307C44.7984 35.307 45.0257 35.2593 45.2384 35.164C45.4584 35.0687 45.6491 34.933 45.8104 34.757C45.9717 34.5737 46.0964 34.35 46.1844 34.086C46.2797 33.8147 46.3274 33.5067 46.3274 33.162C46.3274 32.8173 46.2797 32.513 46.1844 32.249C46.0964 31.9777 45.9717 31.7503 45.8104 31.567C45.6491 31.3837 45.4584 31.2443 45.2384 31.149C45.0257 31.0537 44.7984 31.006 44.5564 31.006C44.3144 31.006 44.0834 31.0537 43.8634 31.149C43.6507 31.2443 43.4637 31.3837 43.3024 31.567C43.1411 31.7503 43.0127 31.9777 42.9174 32.249C42.8294 32.513 42.7854 32.8173 42.7854 33.162ZM41.7954 33.162C41.7954 32.744 41.8541 32.3553 41.9714 31.996C42.0887 31.6293 42.2647 31.314 42.4994 31.05C42.7341 30.7787 43.0237 30.566 43.3684 30.412C43.7131 30.258 44.1091 30.181 44.5564 30.181C45.0111 30.181 45.4071 30.258 45.7444 30.412C46.0891 30.566 46.3787 30.7787 46.6134 31.05C46.8481 31.314 47.0241 31.6293 47.1414 31.996C47.2587 32.3553 47.3174 32.744 47.3174 33.162C47.3174 33.58 47.2587 33.9687 47.1414 34.328C47.0241 34.6873 46.8481 35.0027 46.6134 35.274C46.3787 35.538 46.0891 35.747 45.7444 35.901C45.4071 36.0477 45.0111 36.121 44.5564 36.121C44.1091 36.121 43.7131 36.0477 43.3684 35.901C43.0237 35.747 42.7341 35.538 42.4994 35.274C42.2647 35.0027 42.0887 34.6873 41.9714 34.328C41.8541 33.9687 41.7954 33.58 41.7954 33.162ZM51.4813 30.313H52.3613V31.149H52.3833C52.8087 30.5037 53.421 30.181 54.2203 30.181C54.5723 30.181 54.8913 30.2543 55.1773 30.401C55.4633 30.5477 55.665 30.797 55.7823 31.149C55.973 30.841 56.2223 30.6027 56.5303 30.434C56.8457 30.2653 57.1903 30.181 57.5643 30.181C57.8503 30.181 58.107 30.214 58.3343 30.28C58.569 30.3387 58.767 30.434 58.9283 30.566C59.097 30.698 59.2253 30.8703 59.3133 31.083C59.4087 31.2883 59.4563 31.5377 59.4563 31.831V36H58.5213V32.271C58.5213 32.095 58.5067 31.93 58.4773 31.776C58.448 31.622 58.393 31.49 58.3123 31.38C58.2317 31.2627 58.118 31.171 57.9713 31.105C57.832 31.039 57.6487 31.006 57.4213 31.006C56.9593 31.006 56.5963 31.138 56.3323 31.402C56.0683 31.666 55.9363 32.018 55.9363 32.458V36H55.0013V32.271C55.0013 32.0877 54.983 31.919 54.9463 31.765C54.917 31.611 54.862 31.479 54.7813 31.369C54.7007 31.2517 54.5907 31.1637 54.4513 31.105C54.3193 31.039 54.147 31.006 53.9343 31.006C53.663 31.006 53.4283 31.061 53.2303 31.171C53.0397 31.281 52.882 31.413 52.7573 31.567C52.64 31.721 52.552 31.8823 52.4933 32.051C52.442 32.2123 52.4163 32.348 52.4163 32.458V36H51.4813V30.313ZM65.8973 35.978C65.7359 36.0733 65.5123 36.121 65.2263 36.121C64.9843 36.121 64.7899 36.055 64.6433 35.923C64.5039 35.7837 64.4343 35.56 64.4343 35.252C64.1776 35.56 63.8769 35.7837 63.5323 35.923C63.1949 36.055 62.8283 36.121 62.4323 36.121C62.1756 36.121 61.9299 36.0917 61.6953 36.033C61.4679 35.9743 61.2699 35.8827 61.1013 35.758C60.9326 35.6333 60.7969 35.472 60.6943 35.274C60.5989 35.0687 60.5513 34.823 60.5513 34.537C60.5513 34.2143 60.6063 33.9503 60.7163 33.745C60.8263 33.5397 60.9693 33.3747 61.1453 33.25C61.3286 33.118 61.5339 33.019 61.7613 32.953C61.9959 32.887 62.2343 32.832 62.4763 32.788C62.7329 32.7367 62.9749 32.7 63.2023 32.678C63.4369 32.6487 63.6423 32.612 63.8183 32.568C63.9943 32.5167 64.1336 32.447 64.2363 32.359C64.3389 32.2637 64.3903 32.128 64.3903 31.952C64.3903 31.7467 64.3499 31.5817 64.2693 31.457C64.1959 31.3323 64.0969 31.237 63.9723 31.171C63.8549 31.105 63.7193 31.061 63.5653 31.039C63.4186 31.017 63.2719 31.006 63.1253 31.006C62.7293 31.006 62.3993 31.083 62.1353 31.237C61.8713 31.3837 61.7283 31.666 61.7063 32.084H60.7713C60.7859 31.732 60.8593 31.435 60.9913 31.193C61.1233 30.951 61.2993 30.7567 61.5193 30.61C61.7393 30.456 61.9886 30.346 62.2673 30.28C62.5533 30.214 62.8576 30.181 63.1803 30.181C63.4369 30.181 63.6899 30.1993 63.9393 30.236C64.1959 30.2727 64.4269 30.3497 64.6323 30.467C64.8376 30.577 65.0026 30.7347 65.1273 30.94C65.2519 31.1453 65.3143 31.413 65.3143 31.743V34.669C65.3143 34.889 65.3253 35.0503 65.3473 35.153C65.3766 35.2557 65.4646 35.307 65.6113 35.307C65.6919 35.307 65.7873 35.2887 65.8973 35.252V35.978ZM64.3793 33.063C64.2619 33.151 64.1079 33.217 63.9173 33.261C63.7266 33.2977 63.5249 33.3307 63.3123 33.36C63.1069 33.382 62.8979 33.4113 62.6853 33.448C62.4726 33.4773 62.2819 33.5287 62.1133 33.602C61.9446 33.6753 61.8053 33.7817 61.6953 33.921C61.5926 34.053 61.5413 34.2363 61.5413 34.471C61.5413 34.625 61.5706 34.757 61.6293 34.867C61.6953 34.9697 61.7759 35.054 61.8713 35.12C61.9739 35.186 62.0913 35.2337 62.2233 35.263C62.3553 35.2923 62.4946 35.307 62.6413 35.307C62.9493 35.307 63.2133 35.2667 63.4333 35.186C63.6533 35.098 63.8329 34.9917 63.9723 34.867C64.1116 34.735 64.2143 34.5957 64.2803 34.449C64.3463 34.295 64.3793 34.152 64.3793 34.02V33.063ZM66.7675 30.313H67.6475V31.215H67.6695C68.0581 30.5257 68.6741 30.181 69.5175 30.181C69.8915 30.181 70.2031 30.2323 70.4525 30.335C70.7018 30.4377 70.9035 30.5807 71.0575 30.764C71.2115 30.9473 71.3178 31.1673 71.3765 31.424C71.4425 31.6733 71.4755 31.952 71.4755 32.26V36H70.5405V32.15C70.5405 31.798 70.4378 31.5193 70.2325 31.314C70.0271 31.1087 69.7448 31.006 69.3855 31.006C69.0995 31.006 68.8501 31.05 68.6375 31.138C68.4321 31.226 68.2598 31.3507 68.1205 31.512C67.9811 31.6733 67.8748 31.864 67.8015 32.084C67.7355 32.2967 67.7025 32.5313 67.7025 32.788V36H66.7675V30.313ZM77.9178 35.978C77.7564 36.0733 77.5328 36.121 77.2468 36.121C77.0048 36.121 76.8104 36.055 76.6638 35.923C76.5244 35.7837 76.4548 35.56 76.4548 35.252C76.1981 35.56 75.8974 35.7837 75.5528 35.923C75.2154 36.055 74.8488 36.121 74.4528 36.121C74.1961 36.121 73.9504 36.0917 73.7158 36.033C73.4884 35.9743 73.2904 35.8827 73.1218 35.758C72.9531 35.6333 72.8174 35.472 72.7148 35.274C72.6194 35.0687 72.5718 34.823 72.5718 34.537C72.5718 34.2143 72.6268 33.9503 72.7368 33.745C72.8468 33.5397 72.9898 33.3747 73.1658 33.25C73.3491 33.118 73.5544 33.019 73.7818 32.953C74.0164 32.887 74.2548 32.832 74.4968 32.788C74.7534 32.7367 74.9954 32.7 75.2228 32.678C75.4574 32.6487 75.6628 32.612 75.8388 32.568C76.0148 32.5167 76.1541 32.447 76.2568 32.359C76.3594 32.2637 76.4108 32.128 76.4108 31.952C76.4108 31.7467 76.3704 31.5817 76.2898 31.457C76.2164 31.3323 76.1174 31.237 75.9928 31.171C75.8754 31.105 75.7398 31.061 75.5858 31.039C75.4391 31.017 75.2924 31.006 75.1458 31.006C74.7498 31.006 74.4198 31.083 74.1558 31.237C73.8918 31.3837 73.7488 31.666 73.7268 32.084H72.7918C72.8064 31.732 72.8798 31.435 73.0118 31.193C73.1438 30.951 73.3198 30.7567 73.5398 30.61C73.7598 30.456 74.0091 30.346 74.2878 30.28C74.5738 30.214 74.8781 30.181 75.2008 30.181C75.4574 30.181 75.7104 30.1993 75.9598 30.236C76.2164 30.2727 76.4474 30.3497 76.6528 30.467C76.8581 30.577 77.0231 30.7347 77.1478 30.94C77.2724 31.1453 77.3348 31.413 77.3348 31.743V34.669C77.3348 34.889 77.3458 35.0503 77.3678 35.153C77.3971 35.2557 77.4851 35.307 77.6318 35.307C77.7124 35.307 77.8078 35.2887 77.9178 35.252V35.978ZM76.3998 33.063C76.2824 33.151 76.1284 33.217 75.9378 33.261C75.7471 33.2977 75.5454 33.3307 75.3328 33.36C75.1274 33.382 74.9184 33.4113 74.7058 33.448C74.4931 33.4773 74.3024 33.5287 74.1338 33.602C73.9651 33.6753 73.8258 33.7817 73.7158 33.921C73.6131 34.053 73.5618 34.2363 73.5618 34.471C73.5618 34.625 73.5911 34.757 73.6498 34.867C73.7158 34.9697 73.7964 35.054 73.8918 35.12C73.9944 35.186 74.1118 35.2337 74.2438 35.263C74.3758 35.2923 74.5151 35.307 74.6618 35.307C74.9698 35.307 75.2338 35.2667 75.4538 35.186C75.6738 35.098 75.8534 34.9917 75.9928 34.867C76.1321 34.735 76.2348 34.5957 76.3008 34.449C76.3668 34.295 76.3998 34.152 76.3998 34.02V33.063ZM83.694 35.516C83.694 36.4473 83.4813 37.144 83.056 37.606C82.6307 38.068 81.9633 38.299 81.054 38.299C80.79 38.299 80.5187 38.2697 80.24 38.211C79.9687 38.1523 79.7193 38.057 79.492 37.925C79.272 37.793 79.0887 37.6207 78.942 37.408C78.7953 37.1953 78.7147 36.935 78.7 36.627H79.635C79.6423 36.7957 79.6937 36.9387 79.789 37.056C79.8917 37.1733 80.0127 37.2687 80.152 37.342C80.2987 37.4153 80.4563 37.4667 80.625 37.496C80.7937 37.5327 80.955 37.551 81.109 37.551C81.417 37.551 81.6773 37.496 81.89 37.386C82.1027 37.2833 82.2787 37.1367 82.418 36.946C82.5573 36.7627 82.6563 36.539 82.715 36.275C82.781 36.011 82.814 35.7213 82.814 35.406V35.032H82.792C82.6307 35.384 82.385 35.6443 82.055 35.813C81.7323 35.9743 81.3877 36.055 81.021 36.055C80.5957 36.055 80.2253 35.978 79.91 35.824C79.5947 35.67 79.3307 35.4647 79.118 35.208C78.9053 34.944 78.744 34.6397 78.634 34.295C78.5313 33.943 78.48 33.5727 78.48 33.184C78.48 32.8467 78.524 32.502 78.612 32.15C78.7 31.7907 78.8467 31.468 79.052 31.182C79.2573 30.8887 79.5287 30.6503 79.866 30.467C80.2033 30.2763 80.6177 30.181 81.109 30.181C81.4683 30.181 81.7983 30.2617 82.099 30.423C82.3997 30.577 82.6343 30.8117 82.803 31.127H82.814V30.313H83.694V35.516ZM81.076 35.241C81.384 35.241 81.6443 35.1787 81.857 35.054C82.077 34.922 82.253 34.7533 82.385 34.548C82.517 34.3353 82.6123 34.097 82.671 33.833C82.737 33.569 82.77 33.305 82.77 33.041C82.77 32.7917 82.7407 32.546 82.682 32.304C82.6233 32.062 82.528 31.8457 82.396 31.655C82.2713 31.457 82.1063 31.2993 81.901 31.182C81.6957 31.0647 81.4463 31.006 81.153 31.006C80.8523 31.006 80.5957 31.0647 80.383 31.182C80.1703 31.292 79.9943 31.4423 79.855 31.633C79.723 31.8237 79.624 32.0437 79.558 32.293C79.4993 32.5423 79.47 32.8027 79.47 33.074C79.47 33.3307 79.4957 33.5873 79.547 33.844C79.5983 34.1007 79.6863 34.3353 79.811 34.548C79.9357 34.7533 80.1007 34.922 80.306 35.054C80.5113 35.1787 80.768 35.241 81.076 35.241ZM89.0534 32.612C89.0387 32.392 88.9874 32.183 88.8994 31.985C88.8187 31.787 88.7051 31.6183 88.5584 31.479C88.4191 31.3323 88.2504 31.2187 88.0524 31.138C87.8617 31.05 87.6491 31.006 87.4144 31.006C87.1724 31.006 86.9524 31.05 86.7544 31.138C86.5637 31.2187 86.3987 31.3323 86.2594 31.479C86.1201 31.6257 86.0101 31.798 85.9294 31.996C85.8487 32.1867 85.8011 32.392 85.7864 32.612H89.0534ZM89.9554 34.196C89.8307 34.834 89.5557 35.3143 89.1304 35.637C88.7051 35.9597 88.1697 36.121 87.5244 36.121C87.0697 36.121 86.6737 36.0477 86.3364 35.901C86.0064 35.7543 85.7277 35.549 85.5004 35.285C85.2731 35.021 85.1007 34.7057 84.9834 34.339C84.8734 33.9723 84.8111 33.5727 84.7964 33.14C84.7964 32.7073 84.8624 32.3113 84.9944 31.952C85.1264 31.5927 85.3097 31.281 85.5444 31.017C85.7864 30.753 86.0687 30.5477 86.3914 30.401C86.7214 30.2543 87.0807 30.181 87.4694 30.181C87.9754 30.181 88.3934 30.2873 88.7234 30.5C89.0607 30.7053 89.3284 30.9693 89.5264 31.292C89.7317 31.6147 89.8711 31.9667 89.9444 32.348C90.0251 32.7293 90.0581 33.0923 90.0434 33.437H85.7864C85.7791 33.6863 85.8084 33.9247 85.8744 34.152C85.9404 34.372 86.0467 34.57 86.1934 34.746C86.3401 34.9147 86.5271 35.0503 86.7544 35.153C86.9817 35.2557 87.2494 35.307 87.5574 35.307C87.9534 35.307 88.2761 35.2153 88.5254 35.032C88.7821 34.8487 88.9507 34.57 89.0314 34.196H89.9554ZM95.3721 30.313H96.5051V31.138H95.3721V34.669C95.3721 34.779 95.3795 34.867 95.3941 34.933C95.4161 34.999 95.4528 35.0503 95.5041 35.087C95.5555 35.1237 95.6251 35.1493 95.7131 35.164C95.8085 35.1713 95.9295 35.175 96.0761 35.175H96.5051V36H95.7901C95.5481 36 95.3391 35.9853 95.1631 35.956C94.9945 35.9193 94.8551 35.857 94.7451 35.769C94.6425 35.681 94.5655 35.5563 94.5141 35.395C94.4628 35.2337 94.4371 35.021 94.4371 34.757V31.138H93.4691V30.313H94.4371V28.608H95.3721V30.313ZM97.5438 28.146H98.4788V31.149H98.5008C98.5742 30.973 98.6768 30.8263 98.8088 30.709C98.9408 30.5843 99.0875 30.4853 99.2488 30.412C99.4175 30.3313 99.5898 30.2727 99.7658 30.236C99.9492 30.1993 100.125 30.181 100.294 30.181C100.668 30.181 100.98 30.2323 101.229 30.335C101.478 30.4377 101.68 30.5807 101.834 30.764C101.988 30.9473 102.094 31.1673 102.153 31.424C102.219 31.6733 102.252 31.952 102.252 32.26V36H101.317V32.15C101.317 31.798 101.214 31.5193 101.009 31.314C100.804 31.1087 100.521 31.006 100.162 31.006C99.8758 31.006 99.6265 31.05 99.4138 31.138C99.2085 31.226 99.0362 31.3507 98.8968 31.512C98.7575 31.6733 98.6512 31.864 98.5778 32.084C98.5118 32.2967 98.4788 32.5313 98.4788 32.788V36H97.5438V28.146ZM104.646 29.29H103.711V28.146H104.646V29.29ZM103.711 30.313H104.646V36H103.711V30.313ZM106.667 34.207C106.674 34.4123 106.722 34.5883 106.81 34.735C106.898 34.8743 107.011 34.988 107.151 35.076C107.297 35.1567 107.459 35.2153 107.635 35.252C107.818 35.2887 108.005 35.307 108.196 35.307C108.342 35.307 108.496 35.296 108.658 35.274C108.819 35.252 108.966 35.2117 109.098 35.153C109.237 35.0943 109.351 35.01 109.439 34.9C109.527 34.7827 109.571 34.636 109.571 34.46C109.571 34.218 109.479 34.0347 109.296 33.91C109.112 33.7853 108.881 33.6863 108.603 33.613C108.331 33.5323 108.034 33.4627 107.712 33.404C107.389 33.338 107.088 33.25 106.81 33.14C106.538 33.0227 106.311 32.8613 106.128 32.656C105.944 32.4507 105.853 32.1647 105.853 31.798C105.853 31.512 105.915 31.2663 106.04 31.061C106.172 30.8557 106.337 30.6907 106.535 30.566C106.74 30.434 106.967 30.3387 107.217 30.28C107.473 30.214 107.726 30.181 107.976 30.181C108.298 30.181 108.595 30.2103 108.867 30.269C109.138 30.3203 109.376 30.4157 109.582 30.555C109.794 30.687 109.963 30.8703 110.088 31.105C110.212 31.3323 110.286 31.6183 110.308 31.963H109.373C109.358 31.7797 109.31 31.6293 109.23 31.512C109.149 31.3873 109.046 31.2883 108.922 31.215C108.797 31.1417 108.658 31.0903 108.504 31.061C108.357 31.0243 108.207 31.006 108.053 31.006C107.913 31.006 107.77 31.017 107.624 31.039C107.484 31.061 107.356 31.1013 107.239 31.16C107.121 31.2113 107.026 31.2847 106.953 31.38C106.879 31.468 106.843 31.5853 106.843 31.732C106.843 31.8933 106.898 32.029 107.008 32.139C107.125 32.2417 107.272 32.3297 107.448 32.403C107.624 32.469 107.822 32.5277 108.042 32.579C108.262 32.623 108.482 32.6707 108.702 32.722C108.936 32.7733 109.164 32.8357 109.384 32.909C109.611 32.9823 109.809 33.0813 109.978 33.206C110.154 33.3233 110.293 33.4737 110.396 33.657C110.506 33.8403 110.561 34.0677 110.561 34.339C110.561 34.6837 110.487 34.9697 110.341 35.197C110.201 35.4243 110.014 35.6077 109.78 35.747C109.552 35.8863 109.292 35.9817 108.999 36.033C108.713 36.0917 108.427 36.121 108.141 36.121C107.825 36.121 107.525 36.088 107.239 36.022C106.953 35.956 106.7 35.8497 106.48 35.703C106.26 35.549 106.084 35.351 105.952 35.109C105.82 34.8597 105.746 34.559 105.732 34.207H106.667ZM118.517 32.139C118.444 31.7797 118.29 31.501 118.055 31.303C117.82 31.105 117.505 31.006 117.109 31.006C116.772 31.006 116.489 31.0683 116.262 31.193C116.035 31.3177 115.851 31.4827 115.712 31.688C115.58 31.8933 115.485 32.1317 115.426 32.403C115.367 32.667 115.338 32.942 115.338 33.228C115.338 33.492 115.367 33.7487 115.426 33.998C115.492 34.2473 115.591 34.471 115.723 34.669C115.855 34.8597 116.027 35.0137 116.24 35.131C116.453 35.2483 116.706 35.307 116.999 35.307C117.461 35.307 117.82 35.186 118.077 34.944C118.341 34.702 118.502 34.361 118.561 33.921H119.518C119.415 34.625 119.151 35.1677 118.726 35.549C118.308 35.9303 117.736 36.121 117.01 36.121C116.577 36.121 116.192 36.0513 115.855 35.912C115.525 35.7727 115.246 35.5747 115.019 35.318C114.799 35.0613 114.63 34.757 114.513 34.405C114.403 34.0457 114.348 33.6533 114.348 33.228C114.348 32.8027 114.403 32.4067 114.513 32.04C114.623 31.666 114.788 31.3433 115.008 31.072C115.235 30.7933 115.518 30.577 115.855 30.423C116.192 30.2617 116.585 30.181 117.032 30.181C117.355 30.181 117.655 30.2213 117.934 30.302C118.22 30.3753 118.469 30.4927 118.682 30.654C118.902 30.8153 119.082 31.0207 119.221 31.27C119.36 31.512 119.448 31.8017 119.485 32.139H118.517ZM120.564 28.146H121.499V31.149H121.521C121.595 30.973 121.697 30.8263 121.829 30.709C121.961 30.5843 122.108 30.4853 122.269 30.412C122.438 30.3313 122.61 30.2727 122.786 30.236C122.97 30.1993 123.146 30.181 123.314 30.181C123.688 30.181 124 30.2323 124.249 30.335C124.499 30.4377 124.7 30.5807 124.854 30.764C125.008 30.9473 125.115 31.1673 125.173 31.424C125.239 31.6733 125.272 31.952 125.272 32.26V36H124.337V32.15C124.337 31.798 124.235 31.5193 124.029 31.314C123.824 31.1087 123.542 31.006 123.182 31.006C122.896 31.006 122.647 31.05 122.434 31.138C122.229 31.226 122.057 31.3507 121.917 31.512C121.778 31.6733 121.672 31.864 121.598 32.084C121.532 32.2967 121.499 32.5313 121.499 32.788V36H120.564V28.146ZM131.715 35.978C131.553 36.0733 131.33 36.121 131.044 36.121C130.802 36.121 130.607 36.055 130.461 35.923C130.321 35.7837 130.252 35.56 130.252 35.252C129.995 35.56 129.694 35.7837 129.35 35.923C129.012 36.055 128.646 36.121 128.25 36.121C127.993 36.121 127.747 36.0917 127.513 36.033C127.285 35.9743 127.087 35.8827 126.919 35.758C126.75 35.6333 126.614 35.472 126.512 35.274C126.416 35.0687 126.369 34.823 126.369 34.537C126.369 34.2143 126.424 33.9503 126.534 33.745C126.644 33.5397 126.787 33.3747 126.963 33.25C127.146 33.118 127.351 33.019 127.579 32.953C127.813 32.887 128.052 32.832 128.294 32.788C128.55 32.7367 128.792 32.7 129.02 32.678C129.254 32.6487 129.46 32.612 129.636 32.568C129.812 32.5167 129.951 32.447 130.054 32.359C130.156 32.2637 130.208 32.128 130.208 31.952C130.208 31.7467 130.167 31.5817 130.087 31.457C130.013 31.3323 129.914 31.237 129.79 31.171C129.672 31.105 129.537 31.061 129.383 31.039C129.236 31.017 129.089 31.006 128.943 31.006C128.547 31.006 128.217 31.083 127.953 31.237C127.689 31.3837 127.546 31.666 127.524 32.084H126.589C126.603 31.732 126.677 31.435 126.809 31.193C126.941 30.951 127.117 30.7567 127.337 30.61C127.557 30.456 127.806 30.346 128.085 30.28C128.371 30.214 128.675 30.181 128.998 30.181C129.254 30.181 129.507 30.1993 129.757 30.236C130.013 30.2727 130.244 30.3497 130.45 30.467C130.655 30.577 130.82 30.7347 130.945 30.94C131.069 31.1453 131.132 31.413 131.132 31.743V34.669C131.132 34.889 131.143 35.0503 131.165 35.153C131.194 35.2557 131.282 35.307 131.429 35.307C131.509 35.307 131.605 35.2887 131.715 35.252V35.978ZM130.197 33.063C130.079 33.151 129.925 33.217 129.735 33.261C129.544 33.2977 129.342 33.3307 129.13 33.36C128.924 33.382 128.715 33.4113 128.503 33.448C128.29 33.4773 128.099 33.5287 127.931 33.602C127.762 33.6753 127.623 33.7817 127.513 33.921C127.41 34.053 127.359 34.2363 127.359 34.471C127.359 34.625 127.388 34.757 127.447 34.867C127.513 34.9697 127.593 35.054 127.689 35.12C127.791 35.186 127.909 35.2337 128.041 35.263C128.173 35.2923 128.312 35.307 128.459 35.307C128.767 35.307 129.031 35.2667 129.251 35.186C129.471 35.098 129.65 34.9917 129.79 34.867C129.929 34.735 130.032 34.5957 130.098 34.449C130.164 34.295 130.197 34.152 130.197 34.02V33.063ZM133.883 30.313H135.016V31.138H133.883V34.669C133.883 34.779 133.89 34.867 133.905 34.933C133.927 34.999 133.964 35.0503 134.015 35.087C134.066 35.1237 134.136 35.1493 134.224 35.164C134.319 35.1713 134.44 35.175 134.587 35.175H135.016V36H134.301C134.059 36 133.85 35.9853 133.674 35.956C133.505 35.9193 133.366 35.857 133.256 35.769C133.153 35.681 133.076 35.5563 133.025 35.395C132.974 35.2337 132.948 35.021 132.948 34.757V31.138H131.98V30.313H132.948V28.608H133.883V30.313ZM136.264 34.779H137.485V36H136.264V34.779ZM144.114 29.026H141.496V28.146H147.777V29.026H145.159V36H144.114V29.026ZM152.307 35.978C152.146 36.0733 151.922 36.121 151.636 36.121C151.394 36.121 151.2 36.055 151.053 35.923C150.914 35.7837 150.844 35.56 150.844 35.252C150.588 35.56 150.287 35.7837 149.942 35.923C149.605 36.055 149.238 36.121 148.842 36.121C148.586 36.121 148.34 36.0917 148.105 36.033C147.878 35.9743 147.68 35.8827 147.511 35.758C147.343 35.6333 147.207 35.472 147.104 35.274C147.009 35.0687 146.961 34.823 146.961 34.537C146.961 34.2143 147.016 33.9503 147.126 33.745C147.236 33.5397 147.379 33.3747 147.555 33.25C147.739 33.118 147.944 33.019 148.171 32.953C148.406 32.887 148.644 32.832 148.886 32.788C149.143 32.7367 149.385 32.7 149.612 32.678C149.847 32.6487 150.052 32.612 150.228 32.568C150.404 32.5167 150.544 32.447 150.646 32.359C150.749 32.2637 150.8 32.128 150.8 31.952C150.8 31.7467 150.76 31.5817 150.679 31.457C150.606 31.3323 150.507 31.237 150.382 31.171C150.265 31.105 150.129 31.061 149.975 31.039C149.829 31.017 149.682 31.006 149.535 31.006C149.139 31.006 148.809 31.083 148.545 31.237C148.281 31.3837 148.138 31.666 148.116 32.084H147.181C147.196 31.732 147.269 31.435 147.401 31.193C147.533 30.951 147.709 30.7567 147.929 30.61C148.149 30.456 148.399 30.346 148.677 30.28C148.963 30.214 149.268 30.181 149.59 30.181C149.847 30.181 150.1 30.1993 150.349 30.236C150.606 30.2727 150.837 30.3497 151.042 30.467C151.248 30.577 151.413 30.7347 151.537 30.94C151.662 31.1453 151.724 31.413 151.724 31.743V34.669C151.724 34.889 151.735 35.0503 151.757 35.153C151.787 35.2557 151.875 35.307 152.021 35.307C152.102 35.307 152.197 35.2887 152.307 35.252V35.978ZM150.789 33.063C150.672 33.151 150.518 33.217 150.327 33.261C150.137 33.2977 149.935 33.3307 149.722 33.36C149.517 33.382 149.308 33.4113 149.095 33.448C148.883 33.4773 148.692 33.5287 148.523 33.602C148.355 33.6753 148.215 33.7817 148.105 33.921C148.003 34.053 147.951 34.2363 147.951 34.471C147.951 34.625 147.981 34.757 148.039 34.867C148.105 34.9697 148.186 35.054 148.281 35.12C148.384 35.186 148.501 35.2337 148.633 35.263C148.765 35.2923 148.905 35.307 149.051 35.307C149.359 35.307 149.623 35.2667 149.843 35.186C150.063 35.098 150.243 34.9917 150.382 34.867C150.522 34.735 150.624 34.5957 150.69 34.449C150.756 34.295 150.789 34.152 150.789 34.02V33.063ZM153.211 30.313H154.146V31.083H154.168C154.322 30.7677 154.564 30.5403 154.894 30.401C155.224 30.2543 155.587 30.181 155.983 30.181C156.423 30.181 156.804 30.2617 157.127 30.423C157.457 30.5843 157.728 30.8043 157.941 31.083C158.161 31.3543 158.326 31.6697 158.436 32.029C158.546 32.3883 158.601 32.7697 158.601 33.173C158.601 33.5763 158.546 33.9577 158.436 34.317C158.333 34.6763 158.172 34.9917 157.952 35.263C157.739 35.527 157.468 35.736 157.138 35.89C156.815 36.044 156.437 36.121 156.005 36.121C155.865 36.121 155.708 36.1063 155.532 36.077C155.363 36.0477 155.194 36 155.026 35.934C154.857 35.868 154.696 35.78 154.542 35.67C154.395 35.5527 154.27 35.4097 154.168 35.241H154.146V38.167H153.211V30.313ZM157.611 33.107C157.611 32.843 157.574 32.5863 157.501 32.337C157.435 32.0803 157.328 31.853 157.182 31.655C157.042 31.457 156.859 31.2993 156.632 31.182C156.412 31.0647 156.151 31.006 155.851 31.006C155.535 31.006 155.268 31.0683 155.048 31.193C154.828 31.3177 154.648 31.4827 154.509 31.688C154.369 31.886 154.267 32.1133 154.201 32.37C154.142 32.6267 154.113 32.887 154.113 33.151C154.113 33.4297 154.146 33.701 154.212 33.965C154.278 34.2217 154.38 34.449 154.52 34.647C154.666 34.845 154.853 35.0063 155.081 35.131C155.308 35.2483 155.583 35.307 155.906 35.307C156.228 35.307 156.496 35.2447 156.709 35.12C156.929 34.9953 157.105 34.8303 157.237 34.625C157.369 34.4197 157.464 34.185 157.523 33.921C157.581 33.657 157.611 33.3857 157.611 33.107ZM164.058 30.313H165.191V31.138H164.058V34.669C164.058 34.779 164.065 34.867 164.08 34.933C164.102 34.999 164.138 35.0503 164.19 35.087C164.241 35.1237 164.311 35.1493 164.399 35.164C164.494 35.1713 164.615 35.175 164.762 35.175H165.191V36H164.476C164.234 36 164.025 35.9853 163.849 35.956C163.68 35.9193 163.541 35.857 163.431 35.769C163.328 35.681 163.251 35.5563 163.2 35.395C163.148 35.2337 163.123 35.021 163.123 34.757V31.138H162.155V30.313H163.123V28.608H164.058V30.313ZM166.911 33.162C166.911 33.5067 166.955 33.8147 167.043 34.086C167.139 34.35 167.267 34.5737 167.428 34.757C167.59 34.933 167.777 35.0687 167.989 35.164C168.209 35.2593 168.44 35.307 168.682 35.307C168.924 35.307 169.152 35.2593 169.364 35.164C169.584 35.0687 169.775 34.933 169.936 34.757C170.098 34.5737 170.222 34.35 170.31 34.086C170.406 33.8147 170.453 33.5067 170.453 33.162C170.453 32.8173 170.406 32.513 170.31 32.249C170.222 31.9777 170.098 31.7503 169.936 31.567C169.775 31.3837 169.584 31.2443 169.364 31.149C169.152 31.0537 168.924 31.006 168.682 31.006C168.44 31.006 168.209 31.0537 167.989 31.149C167.777 31.2443 167.59 31.3837 167.428 31.567C167.267 31.7503 167.139 31.9777 167.043 32.249C166.955 32.513 166.911 32.8173 166.911 33.162ZM165.921 33.162C165.921 32.744 165.98 32.3553 166.097 31.996C166.215 31.6293 166.391 31.314 166.625 31.05C166.86 30.7787 167.15 30.566 167.494 30.412C167.839 30.258 168.235 30.181 168.682 30.181C169.137 30.181 169.533 30.258 169.87 30.412C170.215 30.566 170.505 30.7787 170.739 31.05C170.974 31.314 171.15 31.6293 171.267 31.996C171.385 32.3553 171.443 32.744 171.443 33.162C171.443 33.58 171.385 33.9687 171.267 34.328C171.15 34.6873 170.974 35.0027 170.739 35.274C170.505 35.538 170.215 35.747 169.87 35.901C169.533 36.0477 169.137 36.121 168.682 36.121C168.235 36.121 167.839 36.0477 167.494 35.901C167.15 35.747 166.86 35.538 166.625 35.274C166.391 35.0027 166.215 34.6873 166.097 34.328C165.98 33.9687 165.921 33.58 165.921 33.162ZM175.662 28.146H176.597V36H175.662V28.146ZM181.995 32.612C181.98 32.392 181.929 32.183 181.841 31.985C181.76 31.787 181.646 31.6183 181.5 31.479C181.36 31.3323 181.192 31.2187 180.994 31.138C180.803 31.05 180.59 31.006 180.356 31.006C180.114 31.006 179.894 31.05 179.696 31.138C179.505 31.2187 179.34 31.3323 179.201 31.479C179.061 31.6257 178.951 31.798 178.871 31.996C178.79 32.1867 178.742 32.392 178.728 32.612H181.995ZM182.897 34.196C182.772 34.834 182.497 35.3143 182.072 35.637C181.646 35.9597 181.111 36.121 180.466 36.121C180.011 36.121 179.615 36.0477 179.278 35.901C178.948 35.7543 178.669 35.549 178.442 35.285C178.214 35.021 178.042 34.7057 177.925 34.339C177.815 33.9723 177.752 33.5727 177.738 33.14C177.738 32.7073 177.804 32.3113 177.936 31.952C178.068 31.5927 178.251 31.281 178.486 31.017C178.728 30.753 179.01 30.5477 179.333 30.401C179.663 30.2543 180.022 30.181 180.411 30.181C180.917 30.181 181.335 30.2873 181.665 30.5C182.002 30.7053 182.27 30.9693 182.468 31.292C182.673 31.6147 182.812 31.9667 182.886 32.348C182.966 32.7293 182.999 33.0923 182.985 33.437H178.728C178.72 33.6863 178.75 33.9247 178.816 34.152C178.882 34.372 178.988 34.57 179.135 34.746C179.281 34.9147 179.468 35.0503 179.696 35.153C179.923 35.2557 180.191 35.307 180.499 35.307C180.895 35.307 181.217 35.2153 181.467 35.032C181.723 34.8487 181.892 34.57 181.973 34.196H182.897ZM188.992 35.978C188.831 36.0733 188.607 36.121 188.321 36.121C188.079 36.121 187.885 36.055 187.738 35.923C187.599 35.7837 187.529 35.56 187.529 35.252C187.272 35.56 186.972 35.7837 186.627 35.923C186.29 36.055 185.923 36.121 185.527 36.121C185.27 36.121 185.025 36.0917 184.79 36.033C184.563 35.9743 184.365 35.8827 184.196 35.758C184.027 35.6333 183.892 35.472 183.789 35.274C183.694 35.0687 183.646 34.823 183.646 34.537C183.646 34.2143 183.701 33.9503 183.811 33.745C183.921 33.5397 184.064 33.3747 184.24 33.25C184.423 33.118 184.629 33.019 184.856 32.953C185.091 32.887 185.329 32.832 185.571 32.788C185.828 32.7367 186.07 32.7 186.297 32.678C186.532 32.6487 186.737 32.612 186.913 32.568C187.089 32.5167 187.228 32.447 187.331 32.359C187.434 32.2637 187.485 32.128 187.485 31.952C187.485 31.7467 187.445 31.5817 187.364 31.457C187.291 31.3323 187.192 31.237 187.067 31.171C186.95 31.105 186.814 31.061 186.66 31.039C186.513 31.017 186.367 31.006 186.22 31.006C185.824 31.006 185.494 31.083 185.23 31.237C184.966 31.3837 184.823 31.666 184.801 32.084H183.866C183.881 31.732 183.954 31.435 184.086 31.193C184.218 30.951 184.394 30.7567 184.614 30.61C184.834 30.456 185.083 30.346 185.362 30.28C185.648 30.214 185.952 30.181 186.275 30.181C186.532 30.181 186.785 30.1993 187.034 30.236C187.291 30.2727 187.522 30.3497 187.727 30.467C187.932 30.577 188.097 30.7347 188.222 30.94C188.347 31.1453 188.409 31.413 188.409 31.743V34.669C188.409 34.889 188.42 35.0503 188.442 35.153C188.471 35.2557 188.559 35.307 188.706 35.307C188.787 35.307 188.882 35.2887 188.992 35.252V35.978ZM187.474 33.063C187.357 33.151 187.203 33.217 187.012 33.261C186.821 33.2977 186.62 33.3307 186.407 33.36C186.202 33.382 185.993 33.4113 185.78 33.448C185.567 33.4773 185.377 33.5287 185.208 33.602C185.039 33.6753 184.9 33.7817 184.79 33.921C184.687 34.053 184.636 34.2363 184.636 34.471C184.636 34.625 184.665 34.757 184.724 34.867C184.79 34.9697 184.871 35.054 184.966 35.12C185.069 35.186 185.186 35.2337 185.318 35.263C185.45 35.2923 185.589 35.307 185.736 35.307C186.044 35.307 186.308 35.2667 186.528 35.186C186.748 35.098 186.928 34.9917 187.067 34.867C187.206 34.735 187.309 34.5957 187.375 34.449C187.441 34.295 187.474 34.152 187.474 34.02V33.063ZM189.829 30.313H190.709V31.512H190.731C190.959 31.05 191.237 30.709 191.567 30.489C191.897 30.269 192.315 30.1663 192.821 30.181V31.171C192.447 31.171 192.128 31.2223 191.864 31.325C191.6 31.4277 191.388 31.578 191.226 31.776C191.065 31.974 190.948 32.216 190.874 32.502C190.801 32.7807 190.764 33.1033 190.764 33.47V36H189.829V30.313ZM193.719 30.313H194.599V31.215H194.621C195.009 30.5257 195.625 30.181 196.469 30.181C196.843 30.181 197.154 30.2323 197.404 30.335C197.653 30.4377 197.855 30.5807 198.009 30.764C198.163 30.9473 198.269 31.1673 198.328 31.424C198.394 31.6733 198.427 31.952 198.427 32.26V36H197.492V32.15C197.492 31.798 197.389 31.5193 197.184 31.314C196.978 31.1087 196.696 31.006 196.337 31.006C196.051 31.006 195.801 31.05 195.589 31.138C195.383 31.226 195.211 31.3507 195.072 31.512C194.932 31.6733 194.826 31.864 194.753 32.084C194.687 32.2967 194.654 32.5313 194.654 32.788V36H193.719V30.313ZM202.892 30.313H203.772V31.149H203.794C204.22 30.5037 204.832 30.181 205.631 30.181C205.983 30.181 206.302 30.2543 206.588 30.401C206.874 30.5477 207.076 30.797 207.193 31.149C207.384 30.841 207.633 30.6027 207.941 30.434C208.257 30.2653 208.601 30.181 208.975 30.181C209.261 30.181 209.518 30.214 209.745 30.28C209.98 30.3387 210.178 30.434 210.339 30.566C210.508 30.698 210.636 30.8703 210.724 31.083C210.82 31.2883 210.867 31.5377 210.867 31.831V36H209.932V32.271C209.932 32.095 209.918 31.93 209.888 31.776C209.859 31.622 209.804 31.49 209.723 31.38C209.643 31.2627 209.529 31.171 209.382 31.105C209.243 31.039 209.06 31.006 208.832 31.006C208.37 31.006 208.007 31.138 207.743 31.402C207.479 31.666 207.347 32.018 207.347 32.458V36H206.412V32.271C206.412 32.0877 206.394 31.919 206.357 31.765C206.328 31.611 206.273 31.479 206.192 31.369C206.112 31.2517 206.002 31.1637 205.862 31.105C205.73 31.039 205.558 31.006 205.345 31.006C205.074 31.006 204.839 31.061 204.641 31.171C204.451 31.281 204.293 31.413 204.168 31.567C204.051 31.721 203.963 31.8823 203.904 32.051C203.853 32.2123 203.827 32.348 203.827 32.458V36H202.892V30.313ZM212.952 33.162C212.952 33.5067 212.996 33.8147 213.084 34.086C213.18 34.35 213.308 34.5737 213.469 34.757C213.631 34.933 213.818 35.0687 214.03 35.164C214.25 35.2593 214.481 35.307 214.723 35.307C214.965 35.307 215.193 35.2593 215.405 35.164C215.625 35.0687 215.816 34.933 215.977 34.757C216.139 34.5737 216.263 34.35 216.351 34.086C216.447 33.8147 216.494 33.5067 216.494 33.162C216.494 32.8173 216.447 32.513 216.351 32.249C216.263 31.9777 216.139 31.7503 215.977 31.567C215.816 31.3837 215.625 31.2443 215.405 31.149C215.193 31.0537 214.965 31.006 214.723 31.006C214.481 31.006 214.25 31.0537 214.03 31.149C213.818 31.2443 213.631 31.3837 213.469 31.567C213.308 31.7503 213.18 31.9777 213.084 32.249C212.996 32.513 212.952 32.8173 212.952 33.162ZM211.962 33.162C211.962 32.744 212.021 32.3553 212.138 31.996C212.256 31.6293 212.432 31.314 212.666 31.05C212.901 30.7787 213.191 30.566 213.535 30.412C213.88 30.258 214.276 30.181 214.723 30.181C215.178 30.181 215.574 30.258 215.911 30.412C216.256 30.566 216.546 30.7787 216.78 31.05C217.015 31.314 217.191 31.6293 217.308 31.996C217.426 32.3553 217.484 32.744 217.484 33.162C217.484 33.58 217.426 33.9687 217.308 34.328C217.191 34.6873 217.015 35.0027 216.78 35.274C216.546 35.538 216.256 35.747 215.911 35.901C215.574 36.0477 215.178 36.121 214.723 36.121C214.276 36.121 213.88 36.0477 213.535 35.901C213.191 35.747 212.901 35.538 212.666 35.274C212.432 35.0027 212.256 34.6873 212.138 34.328C212.021 33.9687 211.962 33.58 211.962 33.162ZM218.554 30.313H219.434V31.512H219.456C219.683 31.05 219.962 30.709 220.292 30.489C220.622 30.269 221.04 30.1663 221.546 30.181V31.171C221.172 31.171 220.853 31.2223 220.589 31.325C220.325 31.4277 220.112 31.578 219.951 31.776C219.789 31.974 219.672 32.216 219.599 32.502C219.525 32.7807 219.489 33.1033 219.489 33.47V36H218.554V30.313ZM226.006 32.612C225.991 32.392 225.94 32.183 225.852 31.985C225.771 31.787 225.657 31.6183 225.511 31.479C225.371 31.3323 225.203 31.2187 225.005 31.138C224.814 31.05 224.601 31.006 224.367 31.006C224.125 31.006 223.905 31.05 223.707 31.138C223.516 31.2187 223.351 31.3323 223.212 31.479C223.072 31.6257 222.962 31.798 222.882 31.996C222.801 32.1867 222.753 32.392 222.739 32.612H226.006ZM226.908 34.196C226.783 34.834 226.508 35.3143 226.083 35.637C225.657 35.9597 225.122 36.121 224.477 36.121C224.022 36.121 223.626 36.0477 223.289 35.901C222.959 35.7543 222.68 35.549 222.453 35.285C222.225 35.021 222.053 34.7057 221.936 34.339C221.826 33.9723 221.763 33.5727 221.749 33.14C221.749 32.7073 221.815 32.3113 221.947 31.952C222.079 31.5927 222.262 31.281 222.497 31.017C222.739 30.753 223.021 30.5477 223.344 30.401C223.674 30.2543 224.033 30.181 224.422 30.181C224.928 30.181 225.346 30.2873 225.676 30.5C226.013 30.7053 226.281 30.9693 226.479 31.292C226.684 31.6147 226.823 31.9667 226.897 32.348C226.977 32.7293 227.01 33.0923 226.996 33.437H222.739C222.731 33.6863 222.761 33.9247 222.827 34.152C222.893 34.372 222.999 34.57 223.146 34.746C223.292 34.9147 223.479 35.0503 223.707 35.153C223.934 35.2557 224.202 35.307 224.51 35.307C224.906 35.307 225.228 35.2153 225.478 35.032C225.734 34.8487 225.903 34.57 225.984 34.196H226.908Z" fill="#607372"></path><path d="M16.6 14.2H15.4V13H16.6M16.6 19H15.4V15.4H16.6M16 10C15.2121 10 14.4319 10.1552 13.7039 10.4567C12.9759 10.7583 12.3145 11.2002 11.7574 11.7574C10.6321 12.8826 10 14.4087 10 16C10 17.5913 10.6321 19.1174 11.7574 20.2426C12.3145 20.7998 12.9759 21.2417 13.7039 21.5433C14.4319 21.8448 15.2121 22 16 22C17.5913 22 19.1174 21.3679 20.2426 20.2426C21.3679 19.1174 22 17.5913 22 16C22 15.2121 21.8448 14.4319 21.5433 13.7039C21.2417 12.9759 20.7998 12.3145 20.2426 11.7574C19.6855 11.2002 19.0241 10.7583 18.2961 10.4567C17.5681 10.1552 16.7879 10 16 10Z" fill="#657070"></path></svg>
                  </div>
                 : null} */}
                  <div className={deskClass}>
                    <div className={mobileDeskview == 'desktop' && isZoomed ? 'previewContZoomed':"previewStyle"}>
                      {/* { broadcast.value ==="media"&&selectOption === 'IMAGE' ? <div className='bg-img-div'>
                      <img src={filePreview ? filePreview:img} alt="Image" className="documentVdoImg"/>
                      </div> :null}  */}

                      { broadcast.value ==="media"&&selectOption === 'IMAGE' ? <div className='bg-img-div'>
                      {filePreview ?<img src={filePreview} className='documentVdoFile'/>:  <img src={img} alt="img" className="documentVdoImg"/>}
                      </div> :null}

                      { broadcast.value ==="media"&&selectOption === 'VIDEO' ? <div className='bg-img-div'>
                        {filePreview ? <video className='documentVdoFile' controls>
                          <source src={filePreview} type='video/mp4'/>
                          Your browser does not support the video tag.
                        </video>:  <img src={vdo} alt="Video" className="documentVdoImg"/>}
                    
                      </div> :null}

                      { broadcast.value ==="media"&&selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                      {filePreview ?<embed src={filePreview} className='documentVdoFile' />:  <img src={document} alt="document" className="documentVdoImg"/>}
                      </div> :null}
                  
                        {htmlText ? <div
                          className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed':"previewTextStyle"}
                          dangerouslySetInnerHTML={{ __html: htmlText }}
                        />:null}
                        {htmlTextBody ? <div
                          className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed':"previewBodyStyle"}
                          dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                        />:null}
                        {htmlTextFooter ?  <div
                            className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed':"previewFooterStyle"}
                            dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                          /> : null}
                            <div className={`previewStyleTime ${isButtonChecked ? 'checkedStyle' : ''}`}>{currentTime}</div>
                            {isButtonChecked&&chatReplyBox.length ? <>{
                          chatReplyBox.map((ival)=>{
                            return <>
                            {(ival.type==="Visit Us") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={visit}/></div>
                              <div>{ival.type}{visitCont}</div>
                            </div>}
                            {(ival.type==="copy") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={copy}/></div>
                              <div>{ival.type}</div>
                            </div>}
                            {(ival.type==="reply") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={reply}/></div>
                              <div>{ival.type}</div>
                            </div>}
                            </> 
                          })
                        }
                        </> : null}
                          </div>
                          {(type == 'Red' && marketingTemplate == 'whatsapp')?
                            <div className='previewSampleStyleCont'>
                              {htmlTextSample ?  <div
                                className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed':"previewSampleStyle"}
                                dangerouslySetInnerHTML={{ __html: htmlTextSample }}
                              /> : null}
                            </div>
                          :null}
                    </div>
              </div>
              </>:null}

              {(marketingTemplate==="sms")?<> <div>
                <img src={sms} draggable="false" alt='smsImg' className='selectImgs'/>
              </div> 
              <div className='MobileScroll'>
                  <div className='MobileScreenSms'>
                    <div className='previewStyle previewStyleExtra'>
                      { broadcast.value ==="media"&&selectOption === 'IMAGE' ? <div className='bg-img-div'>
                      <img src={filePreview ? filePreview:img} alt="Image" className="documentVdoImg"/>
                      </div> :null} 

                      { broadcast.value ==="media"&&selectOption === 'VIDEO' ? <div className='bg-img-div'>
                        {filePreview ? <video width={100} height={100} controls>
                          <source src={filePreview} type='video/mp4'/>
                          Your browser does not support the video tag.
                        </video>:  <img src={vdo} alt="Video" className="documentVdoImg"/>}
                    
                      </div> :null}

                      { broadcast ==="media"&&selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                      {filePreview ?<embed src={filePreview} width="800px" height="2100px" />:  <img src={document} alt="document" className="documentVdoImg"/>}
                      
                      </div> :null}
                  
                        {htmlText ? <div
                          className="previewTextStyle" 
                          dangerouslySetInnerHTML={{ __html: htmlText }}
                        />:null}
                        {htmlTextBody ? <div
                          className="previewBodyStyle" 
                          dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                        />:null}
                        {htmlTextFooter ?  <div
                            className="previewFooterStyle" 
                            dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                          /> : null}
                          {isButtonChecked&&chatReplyBox.length ? <>{
                          chatReplyBox.map((ival)=>{
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
              </>:null}

              {(marketingTemplate==="platform" && (mobileDeskview==='mobile' || mobileDeskview==='desktop'))?<> <div>
                <img 
                  draggable="false"
                  src={mobileDeskview=='mobile'?platform:platformDesk} 
                  alt='platformImg' 
                  className= {platformClass}
                  onClick={handleZoomClick}/>
              </div> 
              <div className={mobileDeskview=='mobile'?'MobileScroll':'MobileScrollDesk'}>
                  <div className={platformPreviewClass}>
                    <div className={platformPreviewCont}>
                      <div className={mobileDeskview == 'mobile'?'previewPlatformCont':'previewPlatformContDesk'}> 
                        {mobileDeskview=='desktop'?
                          <div className='previewPlatformPopupCont'>
                          <div style={{display:'flex', gap:'.5rem'}}>
                              <img src={evMarket} className='platformCar' alt='evmarket' width='10%'/>
                            <div>
                              <div><p>Lowest Prices in 90 days</p></div>
                              <div><p>Discover product from the source</p></div>
                            </div>
                          </div>
                          <div>
                            <p>X</p>
                          </div>
                        </div>
                        :null}
                        {htmlText ? <div
                          className={mobileDeskview == 'desktop' && isZoomed ? 'platformtitleZoomed':"previewTextStyle"}
                          dangerouslySetInnerHTML={{ __html: htmlText }}
                        />:null} 
                        {htmlTextBody ? <div
                          className={mobileDeskview == 'desktop' && isZoomed ? 'platformbodyZoomed':"previewBodyStyle"}
                          dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                        />:null}
                        {htmlTextFooter ?  <div
                            className={mobileDeskview == 'desktop' && isZoomed ? 'platformfooterZoomed':"previewFooterStyle"}
                            dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                          /> : null}
                        {isButtonChecked&&chatReplyBox.length ? <>{
                          chatReplyBox.map((ival)=>{
                            return <>
                            {(ival.type==="Visit Us") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={visit}/></div>
                              <div>{ival.type}{visitCont}</div>
                            </div>}
                            {(ival.type==="copy") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={copy}/></div>
                              <div>{ival.type}</div>
                            </div>}
                            {(ival.type==="reply") && <div className={chatReply}>
                              <div className={mobileDeskview == 'desktop' && isZoomed ? 'VisitImgDesk' : 'VisitImg' }><img src={reply}/></div>
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
              </>:null}

              {(marketingTemplate==="push" && (mobileDeskview==='mobile' || mobileDeskview==='desktop'))?<> <div>
                <img 
                draggable="false"
                src={mobileDeskview=='mobile'?push:pushDesk} 
                alt='pushImg' 
                className= {pushClass}
                onClick={handleZoomClick}/>
              </div>  
              <div>
                  <div className={pushPreview}>
                    <div className={pushCont}>
                      { broadcast.value ==="media"&&selectOption === 'IMAGE' ? <div className='bg-img-div'>
                      <img src={filePreview ? filePreview:img} alt="Image" className="documentVdoImg"/>
                      </div> :null}   

                      { broadcast.value ==="media"&&selectOption === 'VIDEO' ? <div className='bg-img-div'>
                        {filePreview ? <video width={100} height={100} controls>
                          <source src={filePreview} type='video/mp4'/>
                          Your browser does not support the video tag.
                        </video>:  <img src={vdo} alt="Video" className="documentVdoImg"/>}
                    
                      </div> :null}

                      { broadcast ==="media"&&selectOption === 'DOCUMENT' ? <div className='bg-img-div'>
                      {filePreview ?<embed src={filePreview} width="800px" height="2100px" />:  <img src={document} alt="document" className="documentVdoImg"/>}
                      
                      </div> :null}
                      {mobileDeskview=='mobile'?
                        <div style={{display:'flex'}}>
                        <div className='previewPushImg'>
                          <img src={car} alt='car'/>
                        </div>
                        <div className='previewPushCont'>
                          <div>
                            <p>EVzone</p>
                          </div>
                          {htmlText ? <div
                            className="previewTextStyle" 
                            dangerouslySetInnerHTML={{ __html: htmlText }}
                          />:null}
                          {htmlTextBody ? <div
                            className="previewBodyStyle" 
                            dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                          />:null}
                          {htmlTextFooter ?  <div
                              className="previewFooterStyle" 
                              dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                            /> : null}
                           {isButtonChecked&&chatReplyBox.length ? <>{
                          chatReplyBox.map((ival)=>{
                            return <>
                            {/* {ival.type==="reply" } */}
                            <div className={chatReply}>{ival.type}</div>
                            </>
                          })
                        }
                        </> : null}
                          {/* <div className='previewStyleTime'>{currentTime}</div> */}
                          </div>
                        </div>:
                        <div>
                          <div className='pushContClose'>
                            X
                          </div>
                          <div className='pushCarCont'>
                            <img src={evMarket} alt='evMarket' className='pushNotificationCar'/>
                            <div>
                              <div>
                                <div>
                                  {htmlText ? <div
                                    className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed':"previewTextStylePush"}
                                    dangerouslySetInnerHTML={{ __html: htmlText }}
                                  />:null}
                                  {htmlTextBody ? <div
                                    className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed':"previewBodyStyle"} 
                                    dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                                  />:null}
                                  {htmlTextFooter ?  <div
                                      className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed':"previewFooterStyle"} 
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
                              <IoMdSettings className='settingIcon'/>
                            </div>
                          </div>
                        </div>
                        }
                      
                    </div>
                  </div>
              </div>
              </>:null}

              {(marketingTemplate==="email" && (mobileDeskview==='mobile' || mobileDeskview==='desktop'))?<> <div>
                <img 
                  src={mobileDeskview==='mobile'?email:emailDesk} 
                  alt='emailImg'
                  className= {emailClass}
                  onClick={handleZoomClick} 
                  draggable="false"
                />
              </div> 
              <div className='MobileScroll'>
                  <div className={emailPreviewCont}>
                    <div>
                      <div className={mobileDeskview == 'desktop' && isZoomed?'previewEmailTitleZoom':'previewEmailTitle'}>
                        {htmlText ? <div
                          className={mobileDeskview == 'desktop' && isZoomed ? 'titleZoomed':"previewTextStyle"} 
                          dangerouslySetInnerHTML={{ __html: htmlText }}
                        />:null}
                      </div>
                      <div className={emailZoomClass}>
                        {htmlTextBody ? <div   
                          className={mobileDeskview == 'desktop' && isZoomed ? 'bodyZoomed':"previewBodyStyle"} 
                          dangerouslySetInnerHTML={{ __html: htmlTextBody }}
                        />:null}
                      </div>
                      <div className='previewEmailFooter'>
                        {htmlTextFooter ?  <div
                            className={mobileDeskview == 'desktop' && isZoomed ? 'footerZoomed':"previewFooterStyle"} 
                            dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
                          /> : null}
                        </div>
                        {isButtonChecked&&chatReplyBox.length ? <>{
                          chatReplyBox.map((ival)=>{
                            return <>
                            <div className={mobileDeskview==='desktop'?'buttonStyleDesk':'buttonStyle'}>{ival.type}</div>
                            </>
                          })
                        }
                        </> : null}
                        {/* <div className='previewStyleTime'>{currentTime}</div> */}
                    </div>
                  </div>
              </div>
              </>:null}            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTemplatePopup