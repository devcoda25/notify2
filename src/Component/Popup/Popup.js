import React, { useState, useRef  } from 'react';
import { RxCross2 } from "react-icons/rx";
import whatsapp from '../img/whatsapp.png'
import { SlDiamond } from "react-icons/sl";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrBold } from "react-icons/gr";
import { FaItalic } from "react-icons/fa6";
import { MdStrikethroughS } from "react-icons/md";
import { MdLink } from "react-icons/md";
import { CgLogIn } from 'react-icons/cg';
import img from '../img/mediaImg.png';
import vdo from '../img/mediaVdo.png';
import document from '../img/mediaDocument.png';
import Sample from '../../Sample';
import catalogImg from '../img/catalogImg.svg'
import { IoDiamondOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import AttriubutePopup from './AttriubutePopup';
import { FaArrowLeft } from "react-icons/fa6";


const Popup = ({ onClose }) => {

  const [category, setCategory] = useState('marketing');
  const [broadcast, setBroadcast] = useState('none');
  const [selectedOption, setSelectedOption] = useState('');
  const [cleanText, setCleanText] = useState('');
  let [cleanTextBody, setCleanTextBody] = useState('');
  const [cleanTextFooter, setCleanTextFooter] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [htmlTextBody, setHtmlTextBody] = useState('');
  const [htmlTextFooter, setHtmlTextFooter] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [selectOption, setSelectOption] = useState('IMAGE');
  const [filePreview, setFilePreview] = useState('');
  const [sampleTemplate, setSampleTemplate] = useState(false);
  const [marketingTemplate, setMarketingTemplate] = useState("standard");
  const [expire, setExpire] = useState(10);
  const [copyOffer, setcopyOffer] = useState('Copy offer code');
  
  
  const [showPopup, setShowPopup] = useState(false);
  const [isAttributePopOpen, setIsAttributePopOpen] = useState(false);
  const [sampleTemplateChoose, setSampleTemplateChoose] = useState(false);
  const [fromName, setFromName] = useState("");
  const [fromNameShow, setFromNameShow] = useState(false);
  const [securityRecommandChecked, setSecurityRecommandChecked] = useState(true);




  const handleOpenAttributePop = () => {
    setIsAttributePopOpen(true);
  };

  const handleCloseAttributePop = () => {
    setIsAttributePopOpen(false);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [upgradeShowPopup, setUpgradeShowPopup] = useState(false);

  const upgradePopup = () => {
    setUpgradeShowPopup(!upgradeShowPopup);
  };


  const handleOptionChange = (e) => {
    setSelectOption(e.target.value);
  };


  let broadcastTextStyle = { display: 'none' };
  let broadcastMediaStyle = { display: 'none' };
  // let alignIcon = {top:'32rem'};
  // let alignInput = {top:'31.5rem'};
  let inputExtra = {};
  let previewBodyStyleImg = {};

  if (broadcast === 'text') {
    broadcastTextStyle = { display: 'block' };
    // alignInput = {top:'34.5rem'};
    // alignIcon = {top:'35rem'};
  }
  
  if (broadcast === 'media') {
    broadcastMediaStyle = { display: 'block' };
    // alignInput = {top:'37rem'};
    // alignIcon = {top:'37.5rem'};
    // inputExtra = {paddingBottom:'9rem'}
    // previewBodyStyleImg = {paddingTop:'5rem'}
  }
  // if(broadcast === 'media' && filePreview !== null){
  //   alignInput = {top:'34.5rem'};
  //   alignIcon = {top:'35rem'};
  // }

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
      let objectUrl = URL.createObjectURL(file)
      // Do something with the selected file
      setFilePreview(objectUrl)
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
      const newHtmlContent = isBold ? `<b>${newContent}</b>` : newContent;
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
      const newHtmlContent = isBold ? `<b>${newContent}</b>` : newContent;
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

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCategoryChange = (event) => {
    let choosevalue =event.target.value
   if( choosevalue === "authentication" ){
   let dummyFooterTest ="{{1}} is your verification code. For your security, do not share this code."
    setCleanTextBody(`${dummyFooterTest}`);
    setHtmlTextBody(`${dummyFooterTest}`);
    
     setCleanTextFooter(`This code expires in ${expire} minutes.`)
   }
    setCategory(choosevalue);
  };

  const handleBroadcastChange =(e)=>{
    setBroadcast(e.target.value)
  }
  

const languages = [
  'English (US)', 'Afrikaans', 'Albanian', 'Arabic', 'Azerbaijani', 'Bengali', 'Bulgarian', 'Catalan',
  'Chinese (CHN)', 'Chinese (HKG)', 'Chinese (TAI)', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English',
  'English (UK)', 'Estonian', 'Filipino', 'Finnish', 'French', 'Georgian', 'German', 'Greek', 'Gujarati',
  'Hausa', 'Hebrew', 'Hindi', 'Hungarian', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Kannada', 'Kazakh',
  'Kinyarwanda', 'Korean', 'Kyrgyz (Kyrgyzstan)', 'Lao', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay',
  'Malayalam', 'Marathi', 'Norwegian', 'Persian', 'Polish', 'Portuguese (BR)', 'Portuguese (POR)', 'Punjabi',
  'Romanian', 'Russian', 'Serbian', 'Slovak', 'Slovenian', 'Spanish', 'Spanish (ARG)', 'Spanish (SPA)',
  'Spanish (MEX)', 'Swahili', 'Swedish', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek',
  'Vietnamese', 'Zulu'
];


let now = new Date();
let hours = String(now.getHours()).padStart(2, '0');
let minutes = String(now.getMinutes()).padStart(2, '0');
let currentTime = `${hours}:${minutes}`;

  return (
    <div className="modal-backdrop">
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
              <div>
                <p className='popupBlue'>Need help getting started? Use a sample from our template gallery <a  onClick={()=>{
                  setSampleTemplate(true)
                }}>Use a sample</a></p>
              </div>
             
              {sampleTemplate ?<Sample
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
               

              <div className='popupInput'>
                <div>
                  <label>Template Name</label>
                  <input placeholder='Template Name' type='text'/>
                </div>
                <div className="App" style={{marginLeft:'-2.5rem'}}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={handleCategoryChange}
                    className='select1'
                  >
                    <option value="marketing">Marketing</option>
                    <option value="authentication">Authentication</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="language">Language</label>
                  <select id="language" name="language" className='select2'>
                      <option value="" disabled selected>language...</option>
                      {languages.map((language, index) => (
                          <option key={index} value={language}>{language}</option>
                      ))}
                  </select>
                </div>
              </div>

              {category === 'marketing' ? <>
              <div className='poppupRadioCont'>
                <div>
                  <p>Select Marketing template</p>
                </div>
                <div className='poppupRadio'>
                  <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                    <div className={`poppupInputLabel ${marketingTemplate==="standard" ?"radio-active":""} `}>
                      <span class="radio-btn" onClick={()=>{ setMarketingTemplate("standard")}}></span>
                      <label htmlFor="standard">Standard</label><br />
                    </div>
                  </button>
                  <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                    <div onClick={togglePopup} className={`poppupInputLabel ${marketingTemplate==="catalog" ?"radio-active":""} `}>
                      {/* <input type="radio" id="catalog" name="type" value="catalog" /> */}
                      <span class="radio-btn" onClick={()=>{ setMarketingTemplate("catalog")}}></span>
                      <label htmlFor="catalog">Catalog</label><br />
                    </div>
                  </button>
                  <button className='sc-jIBlqr bsHFOv market-radio__button button-standard active__standardbutton'>
                    <div className={`poppupInputLabel ${marketingTemplate==="carousel" ?"radio-active":""} `} >
                      <div style={{display:'flex', gap:'.5rem'}}>
                      <span class="radio-btn" onClick={()=>{ setMarketingTemplate("carousel")}}></span>
                        {/* <input type="radio" id="carousel" name="type" value="carousel" /> */}
                        <label htmlFor="carousel">Carousel</label>
                      </div>
                      <div className='poppupInputLabelIcon'>
                          <p><SlDiamond /> Pro</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              {(marketingTemplate==="standard" || marketingTemplate==="catalog" )? <>
              <div className="poppupBroadcast">
                <h5>Broadcast title <span style={{ color: 'gray', fontWeight: '500' }}>(Optional)</span></h5>
                <p>Highlight your brand here, use images or videos, to stand out</p>
                <div className="App">
                  <select
                    id="broadcast"
                    value={broadcast}
                    onChange={handleBroadcastChange}
                    className="poppupBroadcastInput"
                  >
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="none">None</option>
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="text">Text</option>
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="media">Media</option>
                  </select>
                </div>
                <div className="titleInput" style={broadcastTextStyle}>
                  <input type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                </div>
                <div style={broadcastMediaStyle}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '.8rem', cursor: 'pointer' }}>
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
                    <label htmlFor="video">video</label>
                    <input
                      type="radio"
                      id="document"
                      name="media"
                      value="DOCUMENT"
                      checked={selectOption === 'DOCUMENT'}
                      onChange={handleOptionChange}
                    />
                    <label htmlFor="document">document</label>
                  </div>
                  <div className='dropImg'>  
                    {selectOption === 'IMAGE' && <div>
                      <p className='dropImgp'>(Image:.jpeg, .png)</p>
                      {filePreview ?  <img src={filePreview} alt="Image" className="documentVdoImg" width='70%'/> :null}
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/images/WATI_logo_square_2.png'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                    
                     
                      
                      </div>}
                    {selectOption === 'VIDEO' && <div>
                      <p className='dropImgp'>(Video:.mp4)</p>
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/videos/Wati.mp4'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                      {filePreview ? <video width={100} height={100} >
                  <source src={filePreview} type='video/mp4' controls/>

                </video>:  
                null}
                      </div>}
                    {selectOption === 'DOCUMENT' && <div>
                      <p className='dropImgp'>(document:.pdf)</p>
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/documents/Wati.pdf'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                      {/* <img src={document} alt="Document" /> */}
                      </div>}
                  </div>
                </div>
              </div>         
              <div className='poppupBroadcast'>
                  <h5>Body</h5>
                  <p>Make your messages personal using variables like and get more replies!</p>
                  <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                  {isAttributePopOpen && <AttriubutePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
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
                    <div style={{position:'absolute', top:'0'}}>
                      <input type='text' disabled/>
                        <div className='poppupBodyInputIcons'>
                          <div>
                            <MdOutlineEmojiEmotions />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <GrBold style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }}/>
                          </div>
                          <div>
                            <FaItalic style={{fontSize:'.8rem'}} />
                          </div>
                          <div>
                            <MdStrikethroughS />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <MdLink />
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
              <div className='poppupBroadcast'>
                  <h5>Footer <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                  <div className="poppupFooterInput">
                    <input type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange}/>
                  </div>
              </div>
              <div className='poppupButton'>
                  <h5>Buttons <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Create up to 3 buttons that let customers respond to your message or take action.</p>
                  <div className='buttonSelect'>
                    <select value={selectedOption} className='poppupBroadcastInput' onChange={handleChange}>
                      <option value="">None</option>
                      <option value="copyOfferCode">Copy offer code</option>
                      <option value="visitWebsite">Visit Website</option>
                      <option value="quickReplies">Quick replies</option>
                      <option value="callPhone">Call Phone</option>
                    </select>
                    {selectedOption && (
                      <div className='copyOffContWhole'>
                        {selectedOption === 'copyOfferCode'?<>
                          <div className='copyOffCont'>
                            <div className='copyOffInputs'>
                              <div className='copyOffLabels'>
                                <label>15/25</label><br/>
                                <input type='text' value={copyOffer} className='copyOffInput'/>
                              </div>
                              <div className='copyOffLabels'>
                                <label>0/15</label><br/>
                                <input type='text' placeholder='Enter coupon code to copy' className='copyCouponInput'/>
                              </div>
                            </div>
                            <div className='copyCouponBtn'>
                              {/* <button className='copyCouponButton'>Add button</button> */}
                              <input className='copyCouponButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'visitWebsite' ? <>
                          <div className='visitWebsiteWhole'>
                            <div className='visitAddBtnCont'>
                              <div className='visitBtnCont'>
                                <label>0/25</label><br/>
                                <input type='text' placeholder='Button Text'/>
                              </div>
                              <div className='visitAddBtn'>
                                <input type='button' value='Add button'/>
                              </div>
                            </div>
                            <div className='visistStaticCont'>
                              <div>
                                <select className='visistStaticContSelect'>
                                  <option value="static">Static</option>
                                  <option value="dynamic">Dynamic</option>
                                </select>
                              </div>
                              <div className='visitTextCont'>
                                {/* <label>0/2000</label><br/> */}
                                <input type='text' placeholder='https://www.wati.io'/>
                              </div>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'quickReplies'?<>
                          <div className='copyOffCont'>
                            <div className='quickLabels'>
                              <label>0/25</label><br/>
                              <input type='text' placeholder='Button Text' className='copyCouponInput'/>
                            </div>
                            <div className='copyCouponBtn'>
                              <input className='quickButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'callPhone'?<>
                          <div className='copyOffCont'>
                            <div className='copyOffInputs'>
                              <div className='copyOffLabels'>
                                <label>15/25</label><br/>
                                <input type='text' placeholder='Button Text' className='callPhoneBtn'/>
                              </div>
                              <div className='copyOffLabels'>
                                <label>0/15</label><br/>
                                <input type='text' placeholder='Phone number with country code' className='callPhoneInput'/>
                              </div>
                            </div>
                            <div className='copyCouponBtn'>
                              <input className='copyCouponButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                      </div>                    
                    )}
                  </div>
              </div>
              {fromNameShow ? <>
                <div className='poppupBroadcast'>
                  {/* <div className="poppupFooterInput">
                    <input type='text' placeholder='Enter Text' value={fromName} onChange={(e)=>{
                      setFromName(e.target.value)
                    }}/>
                  </div> */}
                  <div className='sampleContentCont'>
                  <h5>Sample Content</h5>
                  <p>Just enter sample content here (it doesn’t need to be exact!)</p>
                    <div className="sampleContent">
                      <label className='sampleContentLabel'>0/200</label><br/>
                      <input type='text' placeholder='Enter Text' value={fromName} onChange={(e)=>{
                      setFromName(e.target.value)
                      }}/>
                      <p style={{fontSize:'.7rem'}}>Make sure not to include any actual user or customer information, and provide only sample content in your examples. <a href='https://developers.facebook.com/docs/whatsapp/message-templates/guidelines' target='_blank'>Learn more</a></p>
                    </div>
                </div>
                </div>
              </>:""}
              <div className='poppupButtons'>
                <p className='poppupButtons1'>Save as draft</p>
                <p className='poppupButtons2'>Save and Submit</p>
              </div>
              </>:null}
              {marketingTemplate==="catalog" ? <>
                  <div>
                  {showPopup && (
                    <div className="sampopup">
                      <div className="sampopup-content">
                        <span className="close" onClick={togglePopup}>&times;</span>
                        <h2 className='samPopH2'>Connect, share, sell - your way!</h2>
                        <p className='samPopP'>Connect to your catalog and share with your customers easily.</p>
                        <img src={catalogImg} alt='catalogImg' width='50%'/>
                        <a className='sampopInput' href='https://live-6053.wati.io/6053/catalog' target='_blank'>Setup catalog</a>
                      </div>
                    </div>
                  )}
                  </div>
              </>:null}
              {marketingTemplate==="carousel" ? <>
                <div className='carouselExtraInput' onClick={upgradePopup}>
                  <div className='carouselIconCont'>
                    <IoDiamondOutline className='carDiaIcon' />
                    <div className='carouselCont'>
                      <h5>Carousel requires an upgrade</h5>
                      <p>We’ve made this a special pro plan feature, upgrade your plan to enjoy it!</p>
                    </div>
                  </div>
                  <div className='carouselIconBtn'>
                    <FaArrowUp className='carIcon' />
                    {upgradeShowPopup && (
                      <div className="upgradePopup">
                        <div className="upgradePopup-content">
                          <span className="close" onClick={upgradePopup}>&times;</span>
                          <div className='upgradePop'>
                            <div className='upgradePopTitle'>
                              <h2>Not included in your current plan.</h2>
                              <h5>Your Current Plan: Professional</h5>
                            </div>
                            <div className='upgradePopBody'>
                              <p>Carousel template is not included in your current plan. You must <br/> upgrade your plan to use this feature.</p>
                            </div>
                            <div className='upgradePopFooter'>
                              <a className='upgradePopFooterCancel' >cancel</a>
                              <a className='upgradePopFooterNow' href='https://live-6053.wati.io/account_details/switch_plan' target='_blank'>Upgrade Now</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <p style={{fontSize:'.9rem'}}>Upgrade</p>
                  </div>
                </div>
                <div className='poppupBroadcast'>
                    <h5>Body</h5>
                    <p>Makes your messages personal using variables like and get more replies!</p>
                    <div className="poppupBodyInputCont">
                    <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                  {isAttributePopOpen && <AttriubutePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
                    let copyHtmlTextBody = htmlTextBody
                    copyHtmlTextBody+=`{{${vname}}}`
                    setHtmlTextBody(copyHtmlTextBody)
                    setCleanTextBody(copyHtmlTextBody);
                    setIsAttributePopOpen(false);
                  }} />}
                    </div>
                    <div className='poppupBodyInput'>
                      <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
                        handleTextBodyChange(e.target.value)
                      }}></textarea>
                      <div>
                        <input type='text' disabled/>
                          <div className='poppupBodyInputIcons'>
                            <div>
                              <MdOutlineEmojiEmotions />
                            </div>
                            <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                            <div>
                              <GrBold style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }}/>
                            </div>
                            <div>
                              <FaItalic style={{fontSize:'.8rem'}} />
                            </div>
                            <div>
                              <MdStrikethroughS />
                            </div>
                            <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                            <div>
                              <MdLink />
                            </div>
                          </div>
                      </div>
                    </div>
                </div>
              </>:null}
              </>:null}

              {category === 'authentication' ? <>
              <div className='poppupBroadcast'>
                  <h5>Body</h5>
                  <p>Content for authentication message templates can’t be edited. You can add/remove additional content from the option below</p>
                  {/* <div className="poppupBodyInputCont">
                    <p>Add variable</p>
                  </div> */}
                  <div className='poppupBodyInput'>
                    <textarea rows="10" cols="70" placeholder='press `control\` to add a variable' value={cleanTextBody} onChange={(e)=>{
                      handleTextBodyChange(e.target.value)
                    }}></textarea>
                    <div style={{position:'absolute', top:'0'}}>
                      <input type='text' disabled/>
                        <div className='poppupBodyInputIcons'>
                          <div>
                            <MdOutlineEmojiEmotions />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <GrBold style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }}/>
                          </div>
                          <div>
                            <FaItalic style={{fontSize:'.8rem'}} />
                          </div>
                          <div>
                            <MdStrikethroughS />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <MdLink />
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className='ui checked checkbox'>
                    <input  checked={securityRecommandChecked} type="checkbox" className='hidden' onChange={(event)=>{
                      let dummyFooterTest ="{{1}} is your verification code."
                      if(event.target.checked)
                        {
                          dummyFooterTest="{{1}} is your verification code. For your security, do not share this code."
                        }
                      setCleanTextBody(`${dummyFooterTest}`);
                      setHtmlTextBody(`${dummyFooterTest}`);
                      setSecurityRecommandChecked(event.target.checked)
                    }}/>
                    <label style={{fontSize:'.9rem'}}>Add security recommendation</label>
                  </div>
              </div>
              <div className='poppupBroadcast'>
                  <h5>Footer <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                  <div className="poppupFooterInput">
                    <input type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange}/>
                  </div>
                  <div className='ui checked checkbox'>
                    <input checked={htmlTextFooter} type="checkbox" className='hidden'/>
                    <label style={{fontSize:'.9rem'}}>Include expiry time</label>
                  </div>
                  <div>
                    <label style={{fontSize:'.9rem'}}>Expires in</label><br/>
                    <input type='number' value={expire} className='expireInput' onChange={(event)=>{
                      let timertext =`This code expires in ${event.target.value} minutes.`
                      setCleanTextFooter(timertext)
                      setExpire(event.target.value)
                      setHtmlTextFooter(timertext);
                    }}/>
                  </div>
              </div>
              <div className='poppupButton'>
                  <h5>Buttons <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Basic authentication with quick setup. Your customers copy and paste the code into your app.</p>
                  <div>
                    <label className='BtnTextLabel'>0/25</label><br/>
                    <input type='text' placeholder='Button Text' className='btnText'/>
                  </div>
              </div>
              <div className='sampleContentCont'>
                <h5>Sample Content</h5>
                <p>Just enter sample content here (it doesn’t need to be exact!)</p>
                  <div className="sampleContent">
                    <label className='sampleContentLabel'>0/200</label><br/>
                    <input type='text' placeholder='Enter content for {{1}}'/>
                    <p style={{fontSize:'.7rem'}}>Make sure not to include any actual user or customer information, and provide only sample content in your examples. <a href='https://developers.facebook.com/docs/whatsapp/message-templates/guidelines' target='_blank'>Learn more</a></p>
                  </div>
              </div>
              <div className='poppupButtons'>
                <p className='poppupButtons1'>Save as draft</p>
                <p className='poppupButtons2'>Save and Submit</p>
              </div>
              </> : null}

              {category === 'utility' ? <>
              <div className="poppupBroadcast">
                <h5>Broadcast title <span style={{ color: 'gray', fontWeight: '500' }}>(Optional)</span></h5>
                <p>Highlight your brand here, use images or videos, to stand out</p>
                <div className="App">
                  <select
                    id="broadcast"
                    value={broadcast}
                    onChange={handleBroadcastChange}
                    className="poppupBroadcastInput"
                  >
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="none">None</option>
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="text">Text</option>
                    <option class="custom-option" style={{backgroundColor:'whitesmoke'}} value="media">Media</option>
                  </select>
                </div>
                <div className="titleInput" style={broadcastTextStyle}>
                  <input type="text" value={cleanText} onChange={handleTextChange} placeholder="Enter Text" />
                </div>
                <div style={broadcastMediaStyle}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '.8rem', cursor: 'pointer' }}>
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
                    <label htmlFor="video">video</label>
                    <input
                      type="radio"
                      id="document"
                      name="media"
                      value="DOCUMENT"
                      checked={selectOption === 'DOCUMENT'}
                      onChange={handleOptionChange}
                    />
                    <label htmlFor="document">document</label>
                  </div>
                  <div className='dropImg'>  
                    {selectOption === 'IMAGE' && <div>
                      <p className='dropImgp'>(Image:.jpeg, .png)</p>
                      {filePreview ?  <img src={filePreview} alt="Image" className="documentVdoImg" width='70%'/> :null}
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/images/WATI_logo_square_2.png'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                    
                     
                      
                      </div>}
                    {selectOption === 'VIDEO' && <div>
                      <p className='dropImgp'>(Video:.mp4)</p>
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/videos/Wati.mp4'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                      {filePreview ? <video width={100} height={100} >
                  <source src={filePreview} type='video/mp4' controls/>

                </video>:  
                null}
                      </div>}
                    {selectOption === 'DOCUMENT' && <div>
                      <p className='dropImgp'>(document:.pdf)</p>
                        <div className='dropInput'>
                            <input className='dropInput1' type='text' placeholder='https://cdn.clare.ai/wati/documents/Wati.pdf'/>  
                            <p>or</p>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="dropInput2"
                                onChange={handleFileChange}
                              />
                              {/* <button onClick={handleClick}>Choose File</button> */}
                            </div>
                        </div>
                        {/* <input className='dropInput3' type='text' placeholder='Add Variable'/> */}
                      {/* <img src={document} alt="Document" /> */}
                      </div>}
                  </div>
                </div>
              </div>         
              <div className='poppupBroadcast'>
                  <h5>Body</h5>
                  <p>Make your messages personal using variables like and get more replies!</p>
                  <button onClick={handleOpenAttributePop} color="primary" class="sc-jIBlqr kZhSXp button-addVariable" data-testid="messageTemplate-addTemplateModal-body-addVariable-button" target="_self">Add Variable</button>
                  {isAttributePopOpen && <AttriubutePopup onClose={handleCloseAttributePop} ChooseVariable={(vname)=>{
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
                    <div>
                      <input type='text' disabled/>
                        <div className='poppupBodyInputIcons'>
                          <div>
                            <MdOutlineEmojiEmotions />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <GrBold style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }}/>
                          </div>
                          <div>
                            <FaItalic style={{fontSize:'.8rem'}} />
                          </div>
                          <div>
                            <MdStrikethroughS />
                          </div>
                          <hr style={{marginLeft:'-.2rem', marginRight:'-.2rem'}}/>
                          <div>
                            <MdLink />
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
              <div className='poppupBroadcast'>
                  <h5>Footer <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Footers are great to add any disclaimers or to add a thoughtful PS</p>
                  <div className="poppupFooterInput">
                    <input type='text' placeholder='Enter Text' value={cleanTextFooter} onChange={handleTextFooterChange}/>
                  </div>
              </div>
              <div className='poppupButton'>
                  <h5>Buttons <span style={{color:'gray', fontWeight:'500'}}>(Optional)</span></h5>
                  <p>Create up to 3 buttons that let customers respond to your message or take action.</p>
                  <div className='buttonSelect'>
                    <select value={selectedOption} className='poppupBroadcastInput' onChange={handleChange}>
                      <option value="">None</option>
                      <option value="copyOfferCode">Copy offer code</option>
                      <option value="visitWebsite">Visit Website</option>
                      <option value="quickReplies">Quick replies</option>
                      <option value="callPhone">Call Phone</option>
                    </select>
                    {selectedOption && (
                      <div className='copyOffContWhole'>
                        {selectedOption === 'copyOfferCode'?<>
                          <div className='copyOffCont'>
                            <div className='copyOffInputs'>
                              <div className='copyOffLabels'>
                                <label>15/25</label><br/>
                                <input type='text' value={copyOffer} className='copyOffInput'/>
                              </div>
                              <div className='copyOffLabels'>
                                <label>0/15</label><br/>
                                <input type='text' placeholder='Enter coupon code to copy' className='copyCouponInput'/>
                              </div>
                            </div>
                            <div className='copyCouponBtn'>
                              {/* <button className='copyCouponButton'>Add button</button> */}
                              <input className='copyCouponButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'visitWebsite' ? <>
                          <div className='visitWebsiteWhole'>
                            <div className='visitAddBtnCont'>
                              <div className='visitBtnCont'>
                                <label>0/25</label><br/>
                                <input type='text' placeholder='Button Text'/>
                              </div>
                              <div className='visitAddBtn'>
                                <input type='button' value='Add button'/>
                              </div>
                            </div>
                            <div className='visistStaticCont'>
                              <div>
                                <select className='visistStaticContSelect'>
                                  <option value="static">Static</option>
                                  <option value="dynamic">Dynamic</option>
                                </select>
                              </div>
                              <div className='visitTextCont'>
                                {/* <label>0/2000</label><br/> */}
                                <input type='text' placeholder='https://www.wati.io'/>
                              </div>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'quickReplies'?<>
                          <div className='copyOffCont'>
                            <div className='quickLabels'>
                              <label>0/25</label><br/>
                              <input type='text' placeholder='Button Text' className='copyCouponInput'/>
                            </div>
                            <div className='copyCouponBtn'>
                              <input className='quickButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                        {selectedOption === 'callPhone'?<>
                          <div className='copyOffCont'>
                            <div className='copyOffInputs'>
                              <div className='copyOffLabels'>
                                <label>15/25</label><br/>
                                <input type='text' placeholder='Button Text' className='callPhoneBtn'/>
                              </div>
                              <div className='copyOffLabels'>
                                <label>0/15</label><br/>
                                <input type='text' placeholder='Phone number with country code' className='callPhoneInput'/>
                              </div>
                            </div>
                            <div className='copyCouponBtn'>
                              <input className='copyCouponButton' value='Add button'/>
                            </div>
                          </div>
                        </>:null}
                      </div>                    
                    )}
                  </div>
              </div>
              <div className='poppupButtons'>
                <p className='poppupButtons1'>Save as draft</p>
                <p className='poppupButtons2'>Save and Submit</p>
              </div>
              </> : null}
          </div>
 
          <div className='bodyPoppupR'>
            <h2 style={{fontSize:'1rem'}}>Preview</h2>
            <img src={whatsapp} alt='email' className='selectImg'/>
            <div className='previewStyle' style={inputExtra}>
              { broadcast ==="media"&&selectOption === 'IMAGE' ? <div className='bg-img-div'>
              <img src={filePreview ? filePreview:img} alt="Image" className="documentVdoImg"/>
              </div> :null} 

              { broadcast ==="media"&&selectOption === 'VIDEO' ? <div className='bg-img-div'>
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
                style={previewBodyStyleImg}
                dangerouslySetInnerHTML={{ __html: htmlTextBody }}
              />:null}
             {htmlTextFooter ?  <div
                className="previewFooterStyle" 
                dangerouslySetInnerHTML={{ __html: htmlTextFooter }}
              /> : null}
             
              <div className='previewStyleTime'>{currentTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup
