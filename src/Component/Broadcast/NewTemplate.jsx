import React, { useState, useEffect, useRef } from "react";
import { FormControlLabel, Radio, RadioGroup, Switch, Box } from '@mui/material';
import ButtonComponent from "../ButtonComponent";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import EmojiPicker from "emoji-picker-react";
import SelectAttributeModal from "./SelectAttributeModal";
import ImageSelectAttribute from "./ImageSelectAttribute";
import StayCurrentPortraitRoundedIcon from '@mui/icons-material/StayCurrentPortraitRounded';
import DesktopWindowsRoundedIcon from '@mui/icons-material/DesktopWindowsRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from "@mui/icons-material/Check";
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/theme/material.css";

const mobileBackgroundImages = {
    // Email: "/assets/images/Email.png",
    Whatsapp: "/assets/images/whatsapp.png",
    SMS: "/assets/images/sms.png",
    Platform: "/assets/images/platform.png",
    Push: "/assets/images/push.png"
}
const desktopBackgroundImages = {
    // Email: "/assets/images/gmailDesk.png",
    Whatsapp: "/assets/images/whatsappDesk.png",
    Platform: "/assets/images/platformDesk.png",
    Push: "/assets/images/pushDesk.png"
}



const colors = {
    background: ["rgb(234, 237, 240)", "rgb(157, 206, 255)", "rgb(255, 183, 183)", "rgb(41, 41, 47)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    textBox: ["rgb(255, 255, 255)", "rgb(218, 237, 255)", "rgb(255, 248, 248)", "rgb(98, 98, 109)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    text: ["rgb(19, 19, 23)", "rgb(0, 63, 164)", "rgb(147, 0, 2)", "rgb(255, 255, 255)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    link: ["rgb(0, 89, 225)", "rgb(0, 63, 164)", "rgb(147, 0, 2)", "rgb(255, 255, 255)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
};

const styles = {
    autocompleteStyle: {
        backgroundColor: 'rgb(245, 246, 250) !important',
    },
    radiobtn: {
        color: 'rgb(231 231 232)',
        '&.Mui-checked': {
            borderColor: 'rgb(231 231 232)',
            color: 'green',
        },


    },
    newticketsAutocomplete: {
        height: '32px',
        border: '1px solid #c9c9cd',
        '&:hover': {
            border: '1px solid blue !important',
        },
        '&.Mui-focused': {
            border: '1px solid blue !important',
            outline: 'none',
        },

    },
    chipAttributes: {
        height: "34px",
        margin: " 0px 20px 20px 0px",
        padding: "0px 13px",
        border: "1px solid rgb(35, 164, 85)",
        borderRadius: " 100px",
        color: " rgb(35, 164, 85)",
        fontSize: "13px",
        fontWeight: " 500",
    },
    accordionStyle: {
        boxShadow: 'none',
        border: '1px solid #e2e2e4',
        borderRadius: '8px',
        marginTop: '25px'
    },
    accordionHeading: {
        fontWeight: 600,
        fontSize: '16px',
    }

}
const NewTemplate = () => {
    const categoryOptions = ['Email', 'SMS', 'Platform', 'Whatsapp', 'Push'];
    const languageOptions = ['English (US)', 'Afrikaans', 'Albanian'];
    const buttonOptions = ['copy offer code', 'Visit website', 'Quick replies', 'Call phone']
    const secondbuttonOptions = ['Quick replies'];
    const teamOptions = ['Support Heroes(Default team)']
    const [categoryData, setCategoryData] = useState('Whatsapp');
    const [languageData, setLanguageData] = useState('English (US)');
    const [buttonData, setButtonData] = useState('Visit website');
    const [secondButtonData, setSecondButtonData] = useState('Quick replies');
    const [selectedValue, setSelectedValue] = useState("none");
    const [addReplyButton, setAddReplyButton] = useState(false);
    const [showContent, setShowContent] = useState(true);
    const [addButtonContent, setAddButtonContent] = useState([1]);
    const [secondAddButtonContent, setSecondAddButtonContent] = useState([]);
    const [firstAddButtonContent, setFirstAddButtonContent] = useState([]);
    const [text, setText] = useState("");//text
    const [previewImage, setPreviewImage] = useState(null); //preview image
    const [videoPreview, setVideoPreview] = useState(null); //preview video
    const [documentPreview, setDocumentPreview] = useState(null); //preview document
    const [textareaContent, setTextareaContent] = useState(`Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`)
    const [footerText, setFooterText] = useState("");
    const [isActive, setIsActive] = useState(true); //toggle
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isShowAddvariableModal, setIsShowAddVariableModal] = useState(false); //add variable popup modal
    const [isShowImageSelectAttribute, setIsShowImageSelectAttribute] = useState(false); //image Add variable popup modal 
    const [subjectText, setSubjectText] = useState('');//subjectText
    const [PreviewMode, setPreviewMode] = useState('mobile')
    const [teamContent, setTeamContent] = useState('');
    const editableRef = useRef(null);
    const [emailContent, setEmailContent] = useState('visual builder');
    const [isPreviewMessage, setIsPreviewMessage] = useState(true);
    const [isLogoMessage, setIsLogoMessage] = useState(true);
    const [isFooterMessage, setIsFooterMessage] = useState(true);
    const [isHtmlPreview, setIsHtmlPreview] = useState(true);
    const [selectedColors, setSelectedColors] = useState({
        background: colors.background[0],
        textBox: colors.textBox[0],
        text: colors.text[0],
        link: colors.link[0]
    });
    const [activeTab, setActiveTab] = useState("html");
    const [isAddvarModalVisible, setIsAddvarModalVisible] = useState(false);
    const [isHtmlAddvarVisible, setIsHtmlAddvarVisible] = useState(false);
    const [code, setCode] = useState("");
    const timeRef = useRef();//preview time
    const previewRef = useRef(null);
    //select broadcast title
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };
    //text
    const handleInputChange = (event) => {
        setText(event.target.value);
    };
    //email temple -->color change
    const handleColorChange = (type, color) => {
        setSelectedColors((prev) => ({ ...prev, [type]: color }));
    };
    //toggle for addvariable button
    const handleAddvarToggle = () => {
        setIsAddvarModalVisible(!isAddvarModalVisible);
    }
    const handleHtmlAddvarToggle = () => {
        setIsHtmlAddvarVisible(!isHtmlAddvarVisible)
    }


    //second add and delete reply button
    const handleSecondAddContent = () => {
        if (secondAddButtonContent.length < 3) {
            setSecondAddButtonContent(prev => [...prev, {}]);
        }
    }
    const handleFirstAddButtonContent = () => {
        if (firstAddButtonContent.length < 3) {
            setFirstAddButtonContent(prev => [...prev, {}])
        }
    }
    const handleDeletesecondAdd = (index) => {
        setSecondAddButtonContent(prev => prev.filter((_, i) => i !== index));
    }
    const handleDeleteFirstAdd = (index) => {
        setFirstAddButtonContent(prev => prev.filter((_, i) => i !== index));
    }
    //first add and delete reply button
    const handleAddReplybtn = () => {
        setShowContent(false);
        setAddReplyButton(true);
    }
    const handleAddButtonContent = () => {
        if (addButtonContent.length < 2) {
            setAddButtonContent([...addButtonContent, addButtonContent.length + 1]);

        }

    };
    const handleDeleteRow = (index) => {
        const updatedRows = addButtonContent.filter((_, i) => i !== index);
        setAddButtonContent(updatedRows);
        if (updatedRows.length === 0) {
            setShowContent(true);
        }
    };

    //preview image

    const handleImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const filePreviewUrl = URL.createObjectURL(file);
            setPreviewImage({ url: filePreviewUrl, name: file.name });

        }
    };
    const handleImageButtonClick = () => {
        document.getElementById('image-button-file').click();
    };
    //preview video
    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.type.startsWith('video')) {
                const videoPreviewUrl = URL.createObjectURL(file);
                setVideoPreview({ url: videoPreviewUrl, name: file.name });
            }
        }
    }
    const handleVideoButtonClick = () => {
        document.getElementById('video-button-file').click();
    };
    //preview document

    const handleDocumentFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.type === 'application/pdf') {
                const documentPreviewUrl = URL.createObjectURL(file);
                setDocumentPreview({ url: documentPreviewUrl, name: file.name });
            }
        }
    };

    const handleDocumentButtonClick = () => {
        document.getElementById('document-button-file').click();
    };
    // body content textarea
    const handleTextareaTextChange = (event) => {
        setTextareaContent(event.target.value);
    };
    const [isFocused, setIsFocused] = useState(false);
    const handleTextareaFocus = () => {
        setIsFocused(true);
        setShowEmojiPicker(false);
    };
    //footer text
    const handleFooterInputChange = (event) => {
        setFooterText(event.target.value);
    };
    //subject text
    const handleSubjectChange = (event) => {
        setSubjectText(event.target.value)
    }
    //toggle
    const handleToggle = () => {
        setIsActive(!isActive);
    };
    const handlePreviewToggle = () => {
        setIsPreviewMessage(!isPreviewMessage);
    }
    const handleLogoToggle = () => {
        setIsLogoMessage(!isLogoMessage);
    }
    const handleFooterToggle = () => {
        setIsFooterMessage(!isFooterMessage)
    }
    const handleHtmlPreviewToggle = () => {
        setIsHtmlPreview(!isHtmlPreview)
    }

    const handleEmojiClick = (emojiObject) => {

        setTextareaContent((prevContent) => prevContent + emojiObject.emoji);
    };
    const toggleEmojiPicker = () => {
        setShowEmojiPicker((prevState) => !prevState);
    };
    //bold,italic,strike-through
    const formatText = (startTag, endTag) => {
        const textarea = document.querySelector(".body_textarea_content");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            const selectedText = textareaContent.substring(start, end);
            const formattedText = `${startTag}${selectedText}${endTag}`;
            const updatedContent =
                textareaContent.substring(0, start) +
                formattedText +
                textareaContent.substring(end);

            setTextareaContent(updatedContent);
        }
    };

    const handleBoldIconClick = () => formatText("*", "*");
    const handleItalicIconClick = () => formatText("_", "_");
    const handleStrikeIconClick = () => formatText("~", "~");

    //Add variable popup modal
    const handleAddVariableButton = () => {
        setIsShowAddVariableModal(true);
    }
    const handleCloseAddVariable = () => {
        setIsShowAddVariableModal(false);
    }
    const handleSelectAttribute = (attribute) => {
        setTextareaContent((prevContent) => prevContent + attribute);
    };

    //image Add variable popup modal 
    const handleImageSelectAttribute = () => {
        setIsShowImageSelectAttribute(true);
    }
    const handleCloseSelectAttribute = () => {
        setIsShowImageSelectAttribute(false);
    }
    //preview time
    useEffect(() => {
        // get the current time
        const getCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        };


        if (timeRef.current) {
            timeRef.current.textContent = getCurrentTime();
            console.log('Time:', timeRef.current.textContent);
        }
    }, []);

  
   
    useEffect(() => {
        if (previewRef.current && editableRef.current) {
            previewRef.current.innerHTML = editableRef.current.innerHTML; // Sync content
        }
    });

    const handleInput = () => {
        if (previewRef.current && editableRef.current) {
            previewRef.current.innerHTML = editableRef.current.innerHTML; // Live update
        }
    };
 useEffect(() => {
        setCode(`
          <!DOCTYPE html >
          <html>
            <head>
              <title>{{ticket.subject}}</title>
              <style type="text/css">
                body {
                  width: 100% !important;
                  height: 100%;
                  margin: 0 auto;
                  line-height: 1.5em;
                  font-size: 16px;
                  background-color: #f3f7f9;
                  color: #74787e;
                  -webkit-text-size-adjust: none;
                  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
                  box-sizing: border-box;
                  margin-bottom: 25px;
                }
                a, p a, h2 a, h1 a, h3 a {
                  color: #3869d4;
                }
                .email-masthead {
                  padding: 25px 25px;
                  text-align: center;
                  background-color: #f3f7f9;
                }
                .email-masthead_name {
                  font-size: 22px;
                  font-weight: bold;
                  color: #000000;
                  text-decoration: none;
                }
                .email-body_inner {
                  width: ${PreviewMode === "mobile" ? "290px" : "360px"};
                  margin: 0 auto;
                  background-color: #ffffff;
                }
                .content-cell {
                  padding: 35px;
                  max-width: 496px;
                  overflow: hidden;
                  word-wrap: break-word;
                }
                h1 {
                  margin-top: 0;
                  color: #000000;
                  font-size: 18px;
                  font-weight: bold;
                  text-align: left;
                }
                p {
                  margin-top: 0;
                  color: #000000;
                  font-size: 16px;
                  line-height: 1.5em;
                }
              </style>
            </head>
            <body dir="auto">
              <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                          <table class="email-body_inner" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                              <td class="content-cell">
                                <h1>Hi, Earl!!</h1>
                                <p>Your case has been solved! Best regards, -- The Company</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="header">
                          <p>Previous messages:</p>
                        </td>
                      </tr>
                      <tr>
                        <td class="email-body">
                          <table class="email-body_inner history-email">
                            <tr>
                              <td class="content-cell">
                                <h2><a>earl@example.com</a> wrote:</h2>
                                <p>Hello, I have some difficult case here</p>
                                <p class="history-date">Tue, 11/17/2020, 2:25 PM UTC</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `);
    }, [PreviewMode]);

    return (
        <>
            {
                isShowAddvariableModal && (
                    <SelectAttributeModal show={isShowAddvariableModal} onClose={handleCloseAddVariable}
                        onSelectAttribute={handleSelectAttribute} />
                )
            }
            {
                isShowImageSelectAttribute && (
                    <ImageSelectAttribute show={isShowImageSelectAttribute} onClose={handleCloseSelectAttribute} />
                )
            }
            <div className="new_template_container">
                <div className="new_template_header">
                    <div className="new_template_left">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.22287 12L3.33398 8M3.33398 8L7.22287 4M3.33398 8H12.6673" stroke="#353735" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        <span className="new_template_title">New Templates</span>
                    </div>
                    <div className="new_template_right">
                        <ButtonComponent label='Save as draft' customBtn='new_template_draftbtn' />
                        <ButtonComponent label='Save and submit' />
                    </div>
                </div>
                <div className="new_template_content">
                    <div className="new_template_content_left">
                        <div className="left_header">
                            <div className="name_block_field">
                                <div className="name_block_title">Template Name</div>
                                <TextfieldComponent placeholder='Template Name' customStyle='template_input' />
                            </div>
                            <div className="name_block_field">
                                <div className="name_block_title">Channel</div>
                                <AutocompleteComponent
                                    options={categoryOptions}
                                    value={categoryData}
                                    onChange={(event, newValue) => setCategoryData(newValue)}
                                    customStyles={styles.autocompleteStyle}
                                />
                            </div>
                            <div className="name_block_field language_dropdown">
                                <div className="name_block_title">Language</div>
                                <AutocompleteComponent
                                    options={languageOptions}
                                    value={languageData}
                                    onChange={(event, newValue) => setLanguageData(newValue)}
                                    customStyles={styles.autocompleteStyle}
                                />
                            </div>
                        </div>
                        <div className="broadcast_content">
                            {
                                categoryData === 'Email' && (
                                    <>
                                        <div className="channel_email_content">
                                            <div className="email_text">How would you like to create your email template?</div>
                                            <div className="email_main_grid">
                                                <div className="visual_html_editor" onClick={() => setEmailContent("visual builder")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="64" height="64"><g stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" clip-path="url(#palette_svg__a)"><path d="M12 21a9 9 0 0 1 0-18c2.387 0 4.676.843 6.364 2.343S21 8.878 21 11c0 1.06-.474 2.078-1.318 2.828S17.694 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"></path><path fill="currentcolor" d="M7.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M12 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M16.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path></g><defs><clipPath id="palette_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
                                                    <h4 className="email_grid_heading">Use visual builder</h4>
                                                    <p className="email_grid_subtext">A visual and code-free builder</p>
                                                </div>
                                                <div className="visual_html_editor" onClick={() => setEmailContent("html editor")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="64" height="64"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 4-4 16m7-12 4 4-4 4M7 8l-4 4 4 4"></path></svg>
                                                    <h4 className="email_grid_heading">Use HTML editor</h4>
                                                    <p className="email_grid_subtext">An advanced coding editor</p>
                                                </div>
                                            </div>
                                            {
                                                emailContent === 'visual builder' && (
                                                    <>
                                                        <div className="visual_builder_container">
                                                            <div className='textbox_container'>
                                                                <label>Email template name</label>
                                                                <TextfieldComponent placeholder='Name the email template' customStyle='new_tickets_textbox' />
                                                            </div>
                                                            <div className='textbox_container'>
                                                                <label>Teams assigned to email template</label>
                                                                <AutocompleteComponent
                                                                    placeholder='select who will use the email template'
                                                                    options={teamOptions}
                                                                    value={teamContent}
                                                                    onChange={(event, newValue) => setTeamContent(newValue)}
                                                                    customStyles={styles.newticketsAutocomplete}
                                                                />
                                                            </div>
                                                            <Accordion sx={styles.accordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={styles.accordionHeading}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><g stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" clip-path="url(#palette_svg__a)"><path d="M12 21a9 9 0 0 1 0-18c2.387 0 4.676.843 6.364 2.343S21 8.878 21 11c0 1.06-.474 2.078-1.318 2.828S17.694 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"></path><path fill="currentcolor" d="M7.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M12 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M16.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path></g><defs><clipPath id="palette_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
                                                                        Appearance</div>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    {
                                                                        Object.keys(colors).map((category) => (
                                                                            <div key={category} >
                                                                                <strong>{category.charAt(0).toUpperCase() + category.slice(1)}color</strong>
                                                                                <div className="color_category_container">
                                                                                    {
                                                                                        colors[category].map((color, index) => (
                                                                                            <div key={index} className='color_category_content' style={{

                                                                                                background: color.includes("conic-gradient") ? color : color,

                                                                                            }} onClick={() => handleColorChange(category, color)}>

                                                                                                {selectedColors[category] === color && (
                                                                                                    <CheckIcon
                                                                                                        style={{
                                                                                                            color: ["background", "textBox"].includes(category) ? "black" : "white",
                                                                                                            fontSize: "20px",
                                                                                                        }}
                                                                                                    />
                                                                                                )}

                                                                                            </div>
                                                                                        ))
                                                                                    }

                                                                                </div>

                                                                            </div>
                                                                        ))
                                                                    }
                                                                    <div className="logo_container">
                                                                        <label>Show Logo
                                                                            <span className="logo_right_container">
                                                                                <button
                                                                                    type="button"
                                                                                    className={`toggle__control ${isLogoMessage ? 'active' : ''}`}
                                                                                    onClick={handleLogoToggle}
                                                                                    aria-label="Toggle"

                                                                                >
                                                                                    <div className='toggle-indicator'></div>
                                                                                </button>
                                                                            </span>
                                                                        </label>
                                                                        {
                                                                            isLogoMessage && (
                                                                                <>
                                                                                    <div className="desktop_logo_container">
                                                                                        <div>
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 15 4-4c.456-.439.973-.67 1.5-.67s1.044.231 1.5.67l5 5m-2-2 1-1c.456-.439.973-.67 1.5-.67s1.044.231 1.5.67l2 2m-5-7h.01M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"></path></svg>
                                                                                            Default HelpDesk logo
                                                                                            <span className="logo_right_container" >Upload file</span>
                                                                                        </div>

                                                                                    </div>
                                                                                    <p>Supported file formats are JPG, JPEG, and PNG. Max. file size is 1MB.</p>
                                                                                </>

                                                                            )
                                                                        }

                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                            <Accordion sx={styles.accordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={styles.accordionHeading}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h12"></path></svg>
                                                                        Content</div>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className="content_container">
                                                                        <div
                                                                            ref={editableRef}
                                                                            contentEditable
                                                                            suppressContentEditableWarning={true}
                                                                            className="accordion_content"
                                                                            onInput={handleInput}


                                                                        >
                                                                            <h1>Hi,</h1>
                                                                            <p></p>
                                                                            <div>Ticket ID:</div>
                                                                            <div>Assigned agent:</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="content_text_container">
                                                                        <div className="content_text">
                                                                            <FormatBoldIcon />
                                                                            <FormatItalicIcon />
                                                                            <FormatUnderlinedRoundedIcon />
                                                                            <StrikethroughSIcon />
                                                                            <div className="url_icon"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                                        </div>
                                                                        <div className="add_var_btn" onClick={handleAddvarToggle}>+ Add Variable</div>
                                                                        {
                                                                            isAddvarModalVisible && (
                                                                                <div className="addvariable_modal">
                                                                                    <ul>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h12"></path></svg><span>Messages<span>(required)</span></span></li>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12m6-2a3 3 0 1 0 6 0 3 3 0 0 0-6 0"></path></svg><span>Requestor Name</span></li>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7a2 2 0 0 1 2-2"></path></svg><span>Ticket short Id</span></li>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7a2 2 0 0 1 2-2"></path></svg><span>Agent Name</span></li>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7V5h13v2M10 5v14M12 19H8M15 13v-1h6v1M18 12v7M17 19h2"></path></svg><span>Subject</span></li>
                                                                                        <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"></path></svg><span>People in the Loop</span></li>
                                                                                    </ul>
                                                                                </div>
                                                                            )

                                                                        }

                                                                    </div>


                                                                    <div className="previous_msg"> <div className="add_var_btn">Show previous messages</div>
                                                                        <button
                                                                            type="button"
                                                                            className={`toggle__control ${isPreviewMessage ? 'active' : ''}`}
                                                                            onClick={handlePreviewToggle}
                                                                            aria-label="Toggle"

                                                                        >
                                                                            <div className='toggle-indicator'></div>
                                                                        </button>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                            <Accordion sx={styles.accordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={styles.accordionHeading}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 18H4m16-1H4m1 3h14c1.105 0 2-.91 2-2.032V6.032C21 4.91 20.105 4 19 4H5c-1.104 0-2 .91-2 2.032v11.936C3 19.09 3.896 20 5 20"></path></svg>
                                                                        Footer</div>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className="previous_msg">Show Footer
                                                                        <button
                                                                            type="button"
                                                                            className={`toggle__control ${isFooterMessage ? 'active' : ''}`}
                                                                            onClick={handleFooterToggle}
                                                                            aria-label="Toggle"

                                                                        >
                                                                            <div className='toggle-indicator'></div>
                                                                        </button>
                                                                    </div>
                                                                    <div className="previous_msg">Hide Help Desk Label</div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            {
                                                emailContent === 'html editor' && (
                                                    <>
                                                        <div className="html_editor">
                                                            <div className='textbox_container'>
                                                                <label>Email template name</label>
                                                                <TextfieldComponent placeholder='Name the email template' customStyle='new_tickets_textbox' />
                                                            </div>
                                                            <div className='textbox_container'>
                                                                <label>Teams assigned to email template</label>
                                                                <AutocompleteComponent
                                                                    placeholder='select who will use the email template'
                                                                    options={teamOptions}
                                                                    value={teamContent}
                                                                    onChange={(event, newValue) => setTeamContent(newValue)}
                                                                    customStyles={styles.newticketsAutocomplete}
                                                                />
                                                            </div>
                                                            <div className="html_editor_header">
                                                                <div className="html_editor_headerleft">
                                                                    <button className={`html_editor_btn ${activeTab === "html" ? "active" : ""}`}
                                                                        onClick={() => setActiveTab("html")}>Html</button>
                                                                    <button className={`html_editor_btn ${activeTab === "plain" ? "active" : ""}`}
                                                                        onClick={() => setActiveTab("plain")} >Plain text</button>
                                                                </div>
                                                                <button className="add_variable_btn" onClick={handleHtmlAddvarToggle}> + Add variable</button>
                                                                {
                                                                    isHtmlAddvarVisible && (
                                                                        <div className="addvariable_modal">
                                                                            <ul>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h12"></path></svg><span>Messages<span>(required)</span></span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12m6-2a3 3 0 1 0 6 0 3 3 0 0 0-6 0"></path></svg><span>Requestor Name</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0m0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"></path></svg><span>Requester email</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7a2 2 0 0 1 2-2"></path></svg><span>Ticket short Id</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 1 0 0-4V7a2 2 0 0 1 2-2"></path></svg><span>Agent Name</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0m0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28"></path></svg><span>Agent email</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7V5h13v2M10 5v14M12 19H8M15 13v-1h6v1M18 12v7M17 19h2"></path></svg><span>Subject</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12M12 12l3 2M12 7v5"></path></svg><span>Ticket history</span></li>
                                                                                <li><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20" color="var(--content-basic-purple)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85"></path></svg><span>People in the Loop</span></li>
                                                                            </ul>
                                                                        </div>
                                                                    )

                                                                }
                                                            </div>
                                                            {activeTab === "html" &&
                                                                <div>
                                                                    <CodeMirror
                                                                        value={code}
                                                                        options={{
                                                                            mode: "xml",
                                                                            theme: "material",
                                                                            lineNumbers: true,
                                                                            indentWithTabs: true,
                                                                            smartIndent: true,
                                                                            matchBrackets: true,
                                                                        }}
                                                                        onBeforeChange={(editor, data, value) => {
                                                                            setCode(value);
                                                                        }}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>
                                    </>
                                    // <div className="none_footer_content">
                                    //     <div className="name_block_title">Subject</div>
                                    //     <div className="footer_container">
                                    //         <TextfieldComponent placeholder='Enter Text' customStyle='template_input' value={subjectText} onChange={handleSubjectChange} />
                                    //         <div className="footer_text_count">{subjectText.length}/60</div>
                                    //     </div>
                                    // </div>
                                )
                            }
                            {["Whatsapp", "Push"].includes(categoryData) && (
                                <div className="platform_division">
                                    <div className="name_block_title">Broadcast title<span className="block_title_optional">(Optional)</span></div>
                                    <div className="block_comments">Highlight your brand here, use images or videos, to stand out</div>
                                    <div className="radios_container">
                                        <RadioGroup
                                            value={selectedValue}
                                            onChange={handleRadioChange}>
                                            <div className="checkbox_container">
                                                <FormControlLabel value="none" control={<Radio sx={styles.radiobtn} />} label="None" />
                                                <FormControlLabel value="text" control={<Radio sx={styles.radiobtn} />} label="Text" className="radio_style" />
                                                <FormControlLabel value="image" control={<Radio sx={styles.radiobtn} />} label="Image" className="radio_style" />
                                                <FormControlLabel value="video" control={<Radio sx={styles.radiobtn} />} label="Video" className="radio_style" />
                                                <FormControlLabel value="document" control={<Radio sx={styles.radiobtn} />} label="Document" className="radio_style" />
                                            </div>
                                        </RadioGroup>

                                    </div>
                                    <div>
                                        {
                                            selectedValue === "text" && <div className="footer_container">
                                                <TextfieldComponent placeholder='Enter Text' customStyle='template_input' value={text} onChange={handleInputChange} />
                                                <div className="footer_text_count">{text.length}/60</div>
                                            </div>
                                        }
                                        {selectedValue === "image" && <div>
                                            <p className="utility_header_media_type">(Image: .jpeg, .png)</p>

                                            {previewImage && (
                                                <>
                                                    <p><strong>Uploaded from PC:</strong>{previewImage.name}</p>
                                                    <img
                                                        src={previewImage.url}
                                                        style={{ height: '200px' }} alt="Preview image"

                                                    />
                                                </>
                                            )}
                                            <div className="header_media">
                                                <div className="header_media_from_url">
                                                    <div className="footer_container">
                                                        <TextfieldComponent placeholder='https://cdn.clare.ai/wati/images/WATI_logo_square_2.png' customStyle='template_input' />
                                                        <div className="footer_text_count">0/2000</div>
                                                    </div>
                                                </div>
                                                <div className="header_media_or">or</div>
                                                <ButtonComponent label='Upload Media' customBtn='new_template_draftbtn' onClick={handleImageButtonClick} />
                                                <input accept="image/jpeg, image/jpg, image/png, video/mp4, application/pdf" id="image-button-file"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={handleImageFileChange}
                                                />

                                            </div>
                                            <div className="none_add_variables_btn" onClick={handleImageSelectAttribute}><AddCircleOutlineIcon />Add Variable</div>
                                        </div>}
                                        {selectedValue === "video" && <div>
                                            <p className="utility_header_media_type">(video:.mp4)</p>
                                            {

                                                videoPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{videoPreview.name}</p>
                                                        <video
                                                            src={videoPreview.url}
                                                            controls
                                                            style={{ maxHeight: '200px' }}
                                                            alt="Preview Video"
                                                        />
                                                    </>
                                                )
                                            }
                                            <div className="header_media">
                                                <div className="header_media_from_url">
                                                    <div className="footer_container">
                                                        <TextfieldComponent placeholder='https://cdn.clare.ai/wati/videos/Wati.mp4' customStyle='template_input' />
                                                        <div className="footer_text_count">0/2000</div>
                                                    </div>
                                                </div>
                                                <div className="header_media_or">or</div>
                                                <ButtonComponent label='Upload Media' customBtn='new_template_draftbtn' onClick={handleVideoButtonClick} />
                                                <input
                                                    accept="video/mp4, video/avi, video/mkv, video/webm"
                                                    id="video-button-file"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={handleVideoFileChange}
                                                />


                                            </div>
                                        </div>}
                                        {selectedValue === "document" && <div>
                                            <p className="utility_header_media_type">(Document:.pdf)</p>
                                            {
                                                documentPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{documentPreview.name}</p>

                                                        <object
                                                            data={documentPreview.url}
                                                            title="Document Preview"
                                                        ></object>
                                                    </>
                                                )

                                            }
                                            <div className="header_media">
                                                <div className="header_media_from_url">
                                                    <div className="footer_container">
                                                        <TextfieldComponent placeholder='https://cdn.clare.ai/wati/documents/Wati.pdf' customStyle='template_input' />
                                                        <div className="footer_text_count">0/2000</div>
                                                    </div>
                                                </div>
                                                <div className="header_media_or">or</div>
                                                <ButtonComponent label='Upload Media' customBtn='new_template_draftbtn' onClick={handleDocumentButtonClick} />
                                                <input
                                                    accept=".pdf"
                                                    id="document-button-file"
                                                    type="file"
                                                    aria-label="Upload"
                                                    style={{ display: 'none' }}
                                                    onChange={handleDocumentFileChange}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            )}
                            {
                                categoryData !== 'Email' && (
                                    <div className="none_body_content">
                                        <div className="name_block_title">Body</div>
                                        <div className="block__comments">Make your messages personal using variables like
                                            <span>name</span> and get more replies!
                                        </div>
                                        <div className="none_add_variables_btn none_body_add_var_btn" onClick={handleAddVariableButton}><AddCircleOutlineIcon />Add Variable</div>
                                        <div className="none_block_template_content">
                                            <div>
                                                <div className="none_body_template_icons">
                                                    <TagFacesIcon onClick={toggleEmojiPicker} />
                                                    {showEmojiPicker && (
                                                        <div className="emoji_picker_container">
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        </div>
                                                    )}
                                                    <FormatBoldIcon className="none_bold_icon" onClick={handleBoldIconClick} />
                                                    <FormatItalicIcon onClick={handleItalicIconClick} />
                                                    <StrikethroughSIcon onClick={handleStrikeIconClick} />
                                                    <div className="url_icon"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                    <div className="toolbar_counter">{textareaContent.length}/1024</div>
                                                </div>
                                            </div>
                                            <div className="none_template_body_editor">

                                                <textarea
                                                    value={textareaContent}
                                                    onChange={handleTextareaTextChange}
                                                    onFocus={handleTextareaFocus}
                                                    rows="6"
                                                    cols="50"
                                                    className="body_textarea_content"

                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                categoryData === 'Whatsapp' && (
                                    <div className="none_footer_content">
                                        <div className="name_block_title">Footer<span className="block_title_optional">(Optional)</span></div>
                                        <div className="none_footer_comments">Footers are great to add any disclaimers or to add a thoughtful PS</div>
                                        <div className="footer_container">
                                            <TextfieldComponent placeholder='Enter Text' customStyle='template_input' value={footerText} onChange={handleFooterInputChange} />
                                            <div className="footer_text_count">{footerText.length}/60</div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                ['Whatsapp', 'Platform', 'Push'].includes(categoryData) && (
                                    <div className="none_button_content">
                                        <div className="name_block_title">Buttons<span className="block_title_optional">(Recommended)</span></div>
                                        <div className="none_button_comments">Insert buttons so your customers can take action and engage with your message! </div>
                                        <div className="button_toggle">
                                            <button
                                                type="button"
                                                className={`toggle__control ${isActive ? 'active' : ''}`}
                                                onClick={handleToggle}
                                                aria-label="Toggle"

                                            >
                                                <div className='toggle-indicator'></div>
                                            </button>
                                        </div>
                                        <div>

                                            {
                                                isActive && (
                                                    <>
                                                        <div className="none_button_group">
                                                            {firstAddButtonContent.length === 0 && (
                                                                <div className="buttondata_dropdown">
                                                                    <AutocompleteComponent
                                                                        options={buttonOptions}
                                                                        value={buttonData}
                                                                        onChange={(event, newValue) => setButtonData(newValue)}
                                                                        customStyles={styles.autocompleteStyle}
                                                                    />
                                                                </div>
                                                            )}
                                                            {
                                                                firstAddButtonContent.map((_, index) => (
                                                                    <>
                                                                        <div className="button_block_container" key={index}>
                                                                            <div className="call_action_row">
                                                                                <div className="call_action_row_btn_container">
                                                                                    <div className="buttondata_dropdown">
                                                                                        <AutocompleteComponent
                                                                                            options={buttonOptions}
                                                                                            value={buttonData}
                                                                                            onChange={(event, newValue) => setButtonData(newValue)}
                                                                                            customStyles={styles.autocompleteStyle}
                                                                                        /></div>
                                                                                    <div className="footer_container second_add_button_textbox">
                                                                                        <TextfieldComponent placeholder='Button Text' customStyle='template_input' />
                                                                                        <div className="footer_text_count">0/25</div>
                                                                                    </div>
                                                                                    <button aria-label="delete" className="cell__delete remove_add_button_text" onClick={() => handleDeleteFirstAdd(index)} >
                                                                                        <svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                                                                                    </button>

                                                                                </div>
                                                                            </div>
                                                                            <div className="call_action_row">
                                                                                <div className="call_action_row_btn_container">
                                                                                    <div className="buttondata_dropdown">
                                                                                        <AutocompleteComponent
                                                                                            options={buttonOptions}
                                                                                            value={buttonData}
                                                                                            onChange={(event, newValue) => setButtonData(newValue)}
                                                                                            customStyles={styles.autocompleteStyle}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="footer_container call_action_row_btn_textbox">
                                                                                        <TextfieldComponent placeholder="https://www.wati.io" customStyle='template_input' />
                                                                                        <div className="footer_text_count">19/2000</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))
                                                            }

                                                            <div style={firstAddButtonContent.length > 0 ? { position: 'absolute', right: '0px' } : {}}>
                                                                {firstAddButtonContent.length < 3 && (
                                                                    <ButtonComponent label='Add button' customBtn='new_template_draftbtn' onClick={handleFirstAddButtonContent} />
                                                                )}
                                                            </div>
                                                        </div>
                                                       

                                                        <div className="none_button_group">
                                                            <div className="buttondata_dropdown">
                                                                <AutocompleteComponent
                                                                    options={secondbuttonOptions}
                                                                    value={secondButtonData}
                                                                    onChange={(event, newValue) => setSecondButtonData(newValue)}
                                                                    customStyles={styles.autocompleteStyle}
                                                                />
                                                            </div>
                                                            {
                                                                secondAddButtonContent.map((_, index) => (
                                                                    <div className="none_second_add_container" key={index}>
                                                                        <div className="footer_container second_add_button_textbox">
                                                                            <TextfieldComponent placeholder='Button Text' customStyle='template_input' />
                                                                            <div className="footer_text_count">0/25</div>
                                                                        </div>
                                                                        <button aria-label="delete" className="cell__delete remove_add_button_text" onClick={() => handleDeletesecondAdd(index)} >
                                                                            <svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                                                                        </button>
                                                                    </div>
                                                                ))

                                                            }

                                                            {secondAddButtonContent.length < 3 && (
                                                                <ButtonComponent label='Add button' customBtn='new_template_draftbtn' onClick={handleSecondAddContent} />)}
                                                        </div>

                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }

                            {
                                categoryData === 'Whatsapp' && (
                                    <>
                                        {
                                            isFocused && (
                                                <div className="none_sample_content">
                                                    <div className="name_block_title">Sample Content</div>
                                                    <div className="none_sample_comments">Just enter sample content here (it doesn’t need to be exact!)</div>
                                                    <div className="none_sample_content_textbox">
                                                        <TextfieldComponent placeholder='Enter content for {{name}}' customStyle='template_input' />
                                                        <div className="none_sample_text_count">0/200</div>
                                                    </div>
                                                    <div className="none_sample_comments">Make sure not to include any actual user or customer information, and provide only sample content in your examples.</div>
                                                </div>
                                            )

                                        }
                                    </>
                                )
                            }


                        </div>
                    </div>
                    <div className="new_template_content_right">
                        <div className="preview_container">
                            <h3 className="preview_text">Preview </h3>
                            <span><StayCurrentPortraitRoundedIcon style={{ cursor: 'pointer', color: PreviewMode === 'mobile' ? 'green' : 'black' }} onClick={() => setPreviewMode('mobile')} />
                                {
                                    categoryData !== 'SMS' && (
                                        <DesktopWindowsRoundedIcon style={{ cursor: 'pointer', color: PreviewMode === 'desktop' ? 'green' : 'black' }} onClick={() => setPreviewMode('desktop')} />
                                    )
                                }
                            </span></div>
                        {
                            categoryData === 'Email' ?
                                (
                                    <>
                                        {
                                            emailContent === 'visual builder' && (
                                                <><div className="email_visual_builder"
                                                    style={{
                                                        width: PreviewMode === "mobile" ? "100%" : "100%",
                                                        maxWidth: PreviewMode === "mobile" ? "290px" : "360px",
                                                        backgroundColor: selectedColors.background || "white",
                                                        color: selectedColors.text || "white",

                                                    }}
                                                >
                                                    <div
                                                        ref={previewRef}
                                                        className="ticket_details"
                                                        style={{

                                                            backgroundColor: selectedColors.textBox || "white",
                                                            width: PreviewMode === "mobile" ? "100%" : "100%",
                                                            maxWidth: PreviewMode === "mobile" ? "266px" : "320px",

                                                        }}
                                                    >

                                                    </div>
                                                    {
                                                        isPreviewMessage && (
                                                            <div className="preview_msg_container">
                                                                <div className="preview_msg_text">Previous Messages</div>
                                                                <div className='preview_msg_content' style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: PreviewMode === "mobile" ? "266px" : "320px",

                                                                }}>
                                                                    <h2 > <a style={{ color: selectedColors.link || 'white' }}>earl@example.com</a>wrote:</h2>
                                                                    <div>Hello, I have some difficult case here</div>
                                                                    <div className="history_date">Tue, 11/17/2020, 2:25 PM UTC</div>
                                                                </div>
                                                                <div className='preview_msg_content' style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: PreviewMode === "mobile" ? "266px" : "320px",


                                                                }}>
                                                                    <h2>Agent wrote:</h2>
                                                                    <div>Thank you for your email. We'll reply as soon as we can. Your case number is J3C90R.</div>
                                                                    <div className="history_date">Tue, 11/17/2020, 2:25 PM UTC</div>
                                                                </div>
                                                                <div style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: PreviewMode === "mobile" ? "266px" : "320px",


                                                                }}>
                                                                    <h2 >John wrote:</h2>
                                                                    <div>Hello Earl, We are working to solve your case!</div>
                                                                    <div className="history_date">Tue, 11/17/2020, 2:25 PM UTC</div>
                                                                </div>
                                                            </div>

                                                        )
                                                    }

                                                </div>
                                                </>
                                            )
                                        }
                                        {
                                            emailContent === 'html editor' && (
                                                <>
                                                    <div dangerouslySetInnerHTML={{ __html: code }}></div>

                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <div className="template_preview_svg"
                                        style={{
                                            backgroundImage: `url(${PreviewMode === 'mobile' ? mobileBackgroundImages[categoryData] : desktopBackgroundImages[categoryData]})`,
                                            width: PreviewMode === 'desktop' ? "112%" : "306px",
                                            height: PreviewMode === 'desktop' ? '43%' : '570px',



                                        }}>
                                        {
                                            categoryData === 'Email' && (
                                                <div className="email_subject" style={{
                                                    left: PreviewMode === 'desktop' ? "95px" : '45px',
                                                    top: PreviewMode === 'desktop' ? "22%" : '16%',
                                                    height: PreviewMode === 'desktop' ? '13px' : '23px',
                                                    fontSize: PreviewMode === 'desktop' ? '11px' : '13px',
                                                }}>{subjectText}</div>
                                            )
                                        }

                                        <div className="preview_message">
                                            <div className="preview_message_container" style={{
                                                marginTop: categoryData === "SMS" ? PreviewMode === "desktop" ? "12px" : "248px" : PreviewMode === "desktop" ? "12px" : "75px",
                                                marginLeft: PreviewMode === "desktop" ? categoryData === "Whatsapp" ? "33%" : "67px" : "31px",
                                                width: PreviewMode === "desktop" ? categoryData === "Whatsapp" ? "214px" : "254px" : "210px",
                                                maxHeight: PreviewMode === 'desktop' ? '84px' : '',
                                                overflowY: PreviewMode === 'desktop' ? 'auto' : 'hidden',
                                                fontSize: PreviewMode === 'desktop' ? '11px' : '14px',
                                            }}>
                                                {
                                                    selectedValue === "text" &&
                                                    <div className="preview_message__header_text">{text}</div>
                                                }
                                                {
                                                    selectedValue === "image" &&
                                                    <div className="preview_header_image">
                                                        {previewImage && (
                                                            <img
                                                                src={previewImage.url}
                                                                style={{ maxWidth: '100%', minHeight: '124px' }} alt="Preview"

                                                            />
                                                        )}
                                                    </div>
                                                }
                                                {
                                                    selectedValue === "video" &&
                                                    <div className="preview_header_video">
                                                        {
                                                            videoPreview && (
                                                                <video
                                                                    src={videoPreview.url}
                                                                    controls
                                                                    style={{ width: '100%', maxHeight: '100%' }}
                                                                    alt="Preview Video"
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                }
                                                {
                                                    selectedValue === "document" &&
                                                    <div className="preview_header_doc">
                                                        {
                                                            documentPreview && (
                                                                <object
                                                                    data={documentPreview.url}
                                                                    title="Document Preview"
                                                                ></object>
                                                            )
                                                        }
                                                    </div>
                                                }
                                                {/* {isFocused && (
                <div>{textareaContent}</div>
            )} */}
                                                {isFocused && (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: textareaContent
                                                                .replace(/\*(.*?)\*/g, "<b>$1</b>")
                                                                .replace(/\_(.*?)\_/g, "<i>$1</i>")
                                                                .replace(/~(.*?)~/g, "<s>$1</s>"),
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    {
                                                        firstAddButtonContent.map((_, index) => (
                                                            <div key={index} className="preview_message_button_reply"></div>
                                                        ))
                                                    }
                                                </div>
                                                {/* {
                    addReplyButton && (
                        <div>
                            {
                                addButtonContent.map((row, index) => (
                                    <div key={index} className="preview_message_button_reply">

                                    </div>
                                ))}
                        </div>)
                } */}

                                                <div>
                                                    {secondAddButtonContent.map((_, index) => (
                                                        <div key={index} className="preview_message_secondbtn_reply"></div>
                                                    ))}
                                                </div>
                                                {/* footertext */}
                                                <div>{footerText}</div>


                                                <div className="preview_message_footer">
                                                    <time ref={timeRef} className="preview_message_time"></time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default NewTemplate;