import React, { useState } from 'react';
import { ImCross } from "react-icons/im";
import { FormControl, InputLabel, MenuItem, Select, Box, Typography } from '@mui/material';
import mailLap from '../img/mailLap.png';
import mailMobile from '../img/mailMobile.png';
import msgMobile from '../img/msgMobile.png';

const Popup = ({ onClose }) => {
  const [app, setApp] = useState('');
  const [platform, setPlatform] = useState('');
  const [cleanText, setCleanText] = useState('');
  const [htmlText, setHtmlText] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [cleanTextMail, setCleanTextMail] = useState('');
  const [htmlTextMail, setHtmlTextMail] = useState('');
  let img = '';

  const handleAppChange = (event) => {
    setApp(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  // const handleTextChange = (event) => {
  //   let newText = event.target.value;

  //   // let newHtmlText = '';
  //   // if (newText.length < cleanText.length) {
  //   //   newHtmlText = htmlText.substring(0, htmlText.lastIndexOf('<b>') > -1 ? htmlText.lastIndexOf('<b>') : 0);
  //   //   newHtmlText += newText.slice(newHtmlText.replace(/<\/?b>/g, '').length);
  //   // } else {
  //   //   const newContent = newText.slice(cleanText.length);
  //   //   const newHtmlContent = isBold ? `<b>${newContent}</b>` : newContent;
  //   //   newHtmlText = htmlText + newHtmlContent;
  //   // }
  //   let newHtmlText = newText.replace(/\n/g,"<br />");

  //   setCleanText(newText);
  //   setHtmlText(newHtmlText);
  // };


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
  
  const handleTextChangeMail = (event) => {
    let newTextMail = event.target.value;

    //let newHtmlTextMail = '';
    // if (newTextMail.length < cleanTextMail.length) {
    //   newHtmlTextMail = htmlTextMail.substring(0, htmlTextMail.lastIndexOf('<b>') > -1 ? htmlTextMail.lastIndexOf('<b>') : 0);
    //   newHtmlTextMail += newTextMail.slice(newHtmlTextMail.replace(/<\/?b>/g, '').length);
    // } else {
    //   const newContent = newTextMail.slice(cleanTextMail.length);
    //   const newHtmlContent = isBold ? `<b>${newContent}</b>` : newContent;
    //   newHtmlTextMail = htmlTextMail + newHtmlContent;
    // }
    let newHtmlText = newTextMail.replace(/\n/g,"<br />");

    setCleanTextMail(newTextMail);
    setHtmlTextMail(newHtmlText);
  };

  const toggleBold = () => {
    setIsBold(prevIsBold => !prevIsBold);
  };
  
  var imgWidth = '';
  var imgHeight = '';

  if (app === 'mail' && platform === 'mobile') {
    img = mailMobile;
    imgWidth="60%"
    imgHeight="70%"
  } else if (app === 'mail' && platform === 'laptop') {
    img = mailLap;
    imgWidth="100%"
    imgHeight='70%'
  } else if (app === 'message' && platform === 'mobile') {
    img = msgMobile;
    imgWidth="60%"
    imgHeight="70%"
  }

  const mailOnly = {
    visibility: app === 'mail' ? 'visible' : 'hidden'
  };

  // Define style object based on condition
  const previewTextStyle = {};
  const previewTextStyleTitle = {};
  if (app === 'mail' && platform === 'mobile') {
    previewTextStyle.position = 'absolute';
    previewTextStyle.wordBreak = 'break-word';
    previewTextStyle.top = '29%';
    previewTextStyle.left = '22%';
    previewTextStyle.fontSize = '1.03rem';
    previewTextStyle.letterSpacing = '0.1rem';
    previewTextStyle.width = '55%';
    previewTextStyle.textAlign = 'justify';
    previewTextStyle.whiteSpace = 'pre-wrap';
    previewTextStyleTitle.wordBreak = 'break-word';
    previewTextStyleTitle.position = 'absolute';
    previewTextStyleTitle.top = '15%';
    previewTextStyleTitle.textAlign = 'justify';
    previewTextStyleTitle.left = '22%';
    previewTextStyleTitle.fontSize = '1.5rem';
    previewTextStyleTitle.width = '52%';
  } else if (app === 'message' && platform === 'mobile') {
    previewTextStyle.position = 'absolute';
    previewTextStyle.top = '10rem';
    previewTextStyle.left = '10rem';
    previewTextStyle.color = 'black';
    previewTextStyle.wordBreak = 'break-word';
    previewTextStyle.border = '1px solid white';
    previewTextStyle.padding = '1.5rem';
    previewTextStyle.width = '35%';
    previewTextStyle.backgroundColor = 'white';
    previewTextStyle.borderRadius = '.5rem';
    previewTextStyle.whiteSpace = 'pre-wrap';
    previewTextStyle.textAlign = 'justify';
    previewTextStyle.fontSize = '1.1rem';
  }
  if (app === 'mail' && platform === 'laptop') {
    previewTextStyleTitle.position = 'absolute';
    previewTextStyleTitle.top = '5rem';
    previewTextStyle.position = 'absolute';
    previewTextStyle.top = '10rem';
    previewTextStyle.left = '.7rem';
    previewTextStyleTitle.left = '.7rem';
    previewTextStyle.fontSize = '.8rem';
    previewTextStyleTitle.wordBreak = 'break-word';
    previewTextStyle.wordBreak = 'break-word';
    previewTextStyleTitle.whiteSpace = 'pre-wrap';
    previewTextStyle.whiteSpace = 'pre-wrap';
    previewTextStyle.textAlign = 'start';
  } 

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" style={{ marginLeft: '75rem' }} onClick={onClose}><ImCross /></button>
        <div className="contImg" >
          <div style={{ width: '50%' }}>
            <h2>create message template</h2>
            <div>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', paddingTop: '50px', gap:'.5rem' }}>
                <Box sx={{ width: '40%' }}>
                  <Typography variant="h6" gutterBottom>
                    App
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="app-select-label">Select App</InputLabel>
                    <Select
                      labelId="app-select-label"
                      id="app-select"
                      value={app}
                      label="Select App"
                      onChange={handleAppChange}
                    >
                      <MenuItem value="mail">Mail</MenuItem>
                      <MenuItem value="message">Message</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: '40%' }}>
                  <Typography variant="h6" gutterBottom>
                    Platform
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="platform-select-label">Select Platform</InputLabel>
                    <Select
                      labelId="platform-select-label"
                      id="platform-select"
                      value={platform}
                      label="Select Platform"
                      onChange={handlePlatformChange}
                    >
                      <MenuItem value="mobile">Mobile</MenuItem>
                      <MenuItem value="laptop">Laptop</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </div>
            <div className="container">
              <h1 onClick={toggleBold} className='boldCont' style={{ cursor: 'pointer', fontWeight: isBold ? 'bold' : 'normal' }}>B</h1>
              <textarea
                className="textarea"
                value={cleanText}
                onChange={handleTextChange}
                placeholder="Type body content here..."
              />
            </div>
            <div className="container" style={mailOnly}>
              <h2 className='boldCont'>Email Title:-</h2>
              <textarea
                className="textareamail"
                value={cleanTextMail}
                onChange={handleTextChangeMail}
                placeholder="Type title content here..."
              />
            </div>
          </div>
          <div className='' style={{position:"relative"}}>
            <h2>Preview</h2>
            {img && <img src={img} alt='Selected' width={imgWidth} height={imgHeight} className="imgWithCont"/>}
           
            <div
              className="preview-text"
              style={previewTextStyle} 
              dangerouslySetInnerHTML={{ __html: htmlText }}
            />
            <div
              className="preview-textMail"
              style={previewTextStyleTitle} 
              dangerouslySetInnerHTML={{ __html: htmlTextMail }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup
