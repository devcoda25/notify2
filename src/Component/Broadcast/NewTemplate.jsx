import React, { useState, useEffect, useRef } from "react";
import { FormControlLabel, Radio, RadioGroup, IconButton } from '@mui/material';
import ButtonComponent from "../ButtonComponent";
import TextfieldComponent from "../TextfieldComponent";
import AutocompleteComponent from "../AutocompleteComponent";
import EmojiPicker from "emoji-picker-react";
import SelectAttributeModal from "./SelectAttributeModal";
import ImageSelectAttribute from "./ImageSelectAttribute";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Controlled as CodeMirror } from "react-codemirror2";
import style from "../MuiStyles/muiStyle";
import ToggleSwitch from "../ToggleSwitch";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/theme/material.css";
import { StayCurrentPortraitRoundedIcon, CheckIcon, ExpandMoreIcon, FormatUnderlinedRoundedIcon, DesktopWindowsRoundedIcon, ArrowBackIcon, DeleteOutlineIcon, AddCircleOutlineIcon, TagFacesIcon, FormatBoldIcon, FormatItalicIcon, StrikethroughSIcon } from "../Icon";
import { AddYourTemplate, fetchChannels, fetchLanguages, getModules, UpdateTemplatemodule } from "../../Url";
import { config } from "../../Url";
import axios from "axios";


const mobileBackgroundImages = {
    // Email: "/assets/images/Email.png",
    whatsapp: "/assets/images/whatsapp.png",
    sms: "/assets/images/sms.png",
    platform: "/assets/images/platform.png",
    push: "/assets/images/push.png"
}
const desktopBackgroundImages = {
    // Email: "/assets/images/gmailDesk.png",
    whatsapp: "/assets/images/whatsappDesk.png",
    platform: "/assets/images/platformDesk.png",
    push: "/assets/images/pushDesk.png"
}



const colors = {
    background: ["rgb(234, 237, 240)", "rgb(157, 206, 255)", "rgb(255, 183, 183)", "rgb(41, 41, 47)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    textBox: ["rgb(255, 255, 255)", "rgb(218, 237, 255)", "rgb(255, 248, 248)", "rgb(98, 98, 109)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    text: ["rgb(19, 19, 23)", "rgb(0, 63, 164)", "rgb(147, 0, 2)", "rgb(255, 255, 255)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
    link: ["rgb(0, 89, 225)", "rgb(0, 63, 164)", "rgb(147, 0, 2)", "rgb(255, 255, 255)", "conic-gradient(rgb(0, 255, 255), rgb(255, 0, 255), rgb(255, 255, 0), rgb(0, 255, 255))"],
};

const categoryOptions = ['email', 'sms', 'platform', 'whatsapp', 'push'];
// const categoryOptions = ["email", "sms", "push", "webhook", "slack", "discord"];
const ticketTypeOptions = ['red', 'blue', 'green', 'yellow']
// const languageOptions = ['English (US)', 'Afrikaans', 'Albanian'];
const buttonOptions = ['copy offer code', 'Visit website', 'Quick replies', 'Call phone']
const secondbuttonOptions = ['Quick replies'];
const teamOptions = ['Support Heroes(Default team)']

const NewTemplate = ({setIsOpenTemplateMessage, selectedTemplate, setSelectedTemplate, fetchAllTemplates}) => {
    const [state, setState] = useState({
        categoryData: categoryOptions[0],
        ticketTypeData: ticketTypeOptions[0],
        languageData: "english",
        buttonData: buttonOptions[1],
        secondButtonData: secondbuttonOptions[0],
        selectedValue: 'none',
        addReplyButton: false,
        showContent: true,
        addButtonContent: [1],
        secondAddButtonContent: [],
        firstAddButtonContent: [],
        text: '', //text
        previewImage: null, //previewimage
        videoPreview: null,//previewvideo
        documentPreview: null, //previewdocument
        textareaContent: `Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`,
        footerText: '',
        isActive: true, //toggle
        showEmojiPicker: false,
        isShowAddvariableModal: false, //add variable popupmodal
        isShowImageSelectAttribute: false, //image add variable popup modal
        subjectText: '', //subject text
        PreviewMode: 'mobile',
        teamContent: '',
        emailContent: 'visual builder',
        isPreviewMessage: true,
        isLogoMessage: true,
        isFooterMessage: true,
        isHtmlPreview: true,
        activeTab: 'html',
        isAddvarModalVisible: false,
        isHtmlAddvarVisible: false,
        code: '',
        // plainText:'',
        isFocused: false,
        languageData: null 
    });

    
    const defaultTemplateData = {
        template_name: "",
        channel_id: 1,
        ticket_type: "red",
        template_type: "plaintext",
        language_id: 1,
        };

const defaultEmailTemplateData = {
  subject: "",
  HtmlText: `
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
                  width: ${state.PreviewMode === "mobile" ? "290px" : "360px"};
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
         `,
  PlainText: ""
};

const defaultSmsTemplateData = {
  content: `Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
};

const defaultPlatformTemplateData = {
  content: `Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
};

const defaultPushTemplateData = {
  subject: `Hi {{name}}`,
  content: `Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
};

const defaultWhatsappTemplateData = {
  subject: `Hi {{name}}`,
  content: `Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`,
  footer: "",
  header: ""
};

    const [templateData, setTemplateData]= useState({
        template_name:"",
        channel_id:1,
        ticket_type:"red",
        template_type:"plaintext",
        language_id:1,
        module_code:"",
    })

    const [emailTemplateData, setEmailTemplateData]= useState({
        subject:"",
        HtmlText: `
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
                  width: ${state.PreviewMode === "mobile" ? "290px" : "360px"};
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
         `,
        PlainText:""
    });

    const [smsTemplateData, setSmsTemplateData]= useState({
        content:`Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
    })

    const [PlatformTemplateData, setPlatformTemplateData]= useState({
        content:`Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
    })

    const [PushTemplateData, setPushTemplateData]= useState({
        subject:`Hi {{name}}`,
        content:`Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`
    })

    const [WhatsappTemplateData, setWhatsappTemplateData]= useState({
        subject:`Hi {{name}}`,
        content:`Hi {{name}},\n\nReminder to confirm your appointment with us! Please click the link below.\n\nThank you`,
        footer:"",
        // header:""
    })

    
    
    const [selectedColors, setSelectedColors] = useState({
        background: colors.background[0],
        textBox: colors.textBox[0],
        text: colors.text[0],
        link: colors.link[0]
    });

    const timeRef = useRef();
    const previewRef = useRef(null);
    const editableRef = useRef(null);

    const updateState = (updates) => {
        setState((prevState) => ({
            ...prevState,
            ...updates,
        }));
    };

 const [languageOptions, setLanguageOptions] = useState([]);
 const [channelOptions, setChannelOptions] = useState([]);
 const [moduleOptions, setModuleOptions] = useState([]);


const fetchLanguageData = async () => {
  try {
    const res = await axios.get(fetchLanguages(), config);
    const languageValues = res.data?.data?.values || [];

    const options = languageValues.map((lang) => ({
      label: lang.name,
      id: lang.id,
    }));

    setLanguageOptions(options);
  } catch (error) {
    console.error('Error fetching languages:', error);
  }
};


 const fetchChannelData = async () => {
  try {
    const res = await axios.get(fetchChannels(), config);
    const channelValues = res.data?.data?.values || [];

    const filtered = channelValues.filter(
      (channel) => channel.type !== 'web' && channel.type !== 'api'
    );

    const options = filtered.map((channel) => ({
        label: channel.type,
        id: channel.id,
    }));

    setChannelOptions(options);
  } catch (error) {
    console.log('fetch error', 'Failed to load data');
  }
};


const fetchModules = async()=>{
    try {
        const res = await axios.get(getModules(), config);
        const modulesData = res.data?.data || [];
        // console.log("modulesData", modulesData)

       const options = modulesData.map((module) => ({
        id: module.code, 
        label: module.name, 
        code: module.code, 
        }))
        setModuleOptions(options)
    } catch (error) {
        console.log("error", error)
    }
}


    useEffect(() => {
  fetchLanguageData();
  fetchChannelData();
  fetchModules();
}, []);


useEffect(() => {
  if (selectedTemplate) {
    const channel = selectedTemplate.channel?.name?.toLowerCase() || "";
    console.log("channel name", channel)
    const parsedContent =
      channel === "email" && selectedTemplate.content
        ? JSON.parse(selectedTemplate.content)
        : { html: "", plain: "" };

    setTemplateData({
      template_name: selectedTemplate.template?.name || "",
      subject: selectedTemplate.subject || "",
      content: selectedTemplate.content || "",
      ticket_type: selectedTemplate.ticket_type || "",
      language_id: selectedTemplate.language?.id || "",
      channel_type: selectedTemplate.channel?.name || "",
      channel_id: selectedTemplate.channel?.id || "",
      module_code: selectedTemplate.module_code || "",
    });

    setState((prev) => ({
      ...prev,
      categoryData: channel, 
    }));

    if (channel === "email") {
      setEmailTemplateData({
        subject: selectedTemplate.subject || "",
        HtmlText: parsedContent.html || "",
        PlainText: parsedContent.plain || "",
      });
    } else if (channel === "sms") {
      setSmsTemplateData({
        content: selectedTemplate.content || "",
      });
    } else if (channel === "push notification") {
      setPushTemplateData({
        subject: selectedTemplate.subject || "",
        content: selectedTemplate.content || "",
      });
    } else if (channel === "platform") {
      setPlatformTemplateData({
        content: selectedTemplate.content || "",
      });
    } else if (channel === "whatsapp") {
      setWhatsappTemplateData({
        subject: selectedTemplate.subject || "",
        content: selectedTemplate.content || "",
        footer: selectedTemplate.footer || "",
        header: selectedTemplate.header || "",
      });
    }
  }
}, [selectedTemplate]);


const [formErrors, setFormErrors] = useState({});

// Add Functions

const AddEmailTemplate = async () => {
  try {
    const payload = {
      ...templateData,
      subject: emailTemplateData.subject.trim(),
      content: JSON.stringify({
        html: emailTemplateData.HtmlText,
        plain: emailTemplateData.PlainText
      })
    };

    await axios.post(AddYourTemplate(), payload, config);

    setTemplateData(defaultTemplateData);
    fetchAllTemplates();
    setEmailTemplateData(defaultEmailTemplateData);
    setFormErrors({}); 

  } catch (error) {
    if (
      error.response?.data?.error?.template_name?.length > 0
    ) {
      setFormErrors({
        template_name: "Template name already exists."
      });
    } else {
      console.log("Error Adding Email Template", error);
    }
  }
};

const AddSmsTemplate = async () => {
  try {
    const payload = { ...templateData, ...smsTemplateData };
    await axios.post(AddYourTemplate(), payload, config);

    setTemplateData(defaultTemplateData);
    setSmsTemplateData(defaultSmsTemplateData);
    setFormErrors({});  // Clear errors on success
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Adding Sms Template", error);
    }
  }
};

const AddPlatformTemplate = async () => {
  try {
    const payload = { ...templateData, ...PlatformTemplateData };
    await axios.post(AddYourTemplate(), payload, config);

    setTemplateData(defaultTemplateData);
    setPlatformTemplateData(defaultPlatformTemplateData);
    setFormErrors({});
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Adding Platform Template", error);
    }
  }
};

const AddPushTemplate = async () => {
  try {
    const payload = { ...templateData, ...PushTemplateData };
    await axios.post(AddYourTemplate(), payload, config);

    setTemplateData(defaultTemplateData);
    setPushTemplateData(defaultPushTemplateData);
    setFormErrors({});
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Adding Push Template", error);
    }
  }
};

const AddWhatsappTemplate = async () => {
  try {
    const payload = { ...templateData, ...WhatsappTemplateData };
    await axios.post(AddYourTemplate(), payload, config);

    setTemplateData(defaultTemplateData);
    setWhatsappTemplateData(defaultWhatsappTemplateData);
    setFormErrors({});
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Adding Whatsapp Template", error);
    }
  }
};


// Update Functions

const updateEmailTemplate = async () => {
  try {
    const payload = {
      id: selectedTemplate.id,
      ...templateData,
      subject: emailTemplateData.subject.trim(),
      content: JSON.stringify({
        html: emailTemplateData.HtmlText,
        plain: emailTemplateData.PlainText,
      }),
    };
    console.log("payload",payload)

    await axios.post(UpdateTemplatemodule(selectedTemplate.id), payload, config);

    setTemplateData(defaultTemplateData);
    fetchAllTemplates();
    setEmailTemplateData(defaultEmailTemplateData);
    setFormErrors({});
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({
        template_name: "Template name already exists.",
      });
    } else {
      console.log("Error Updating Email Template", error);
    }
  }
};

const updateSmsTemplate = async () => {
  try {
    console.log("update sms hitting");

    if (!selectedTemplate?.id) {
      console.error("Template ID is missing for update.");
      return;
    }

    const payload = {
      ...templateData,
      ...smsTemplateData,
      id: selectedTemplate.id,
      subject:"Welcome to Our Service, {{var:user_name}}!", 
    };

    await axios.post(UpdateTemplatemodule(selectedTemplate.id), payload, config);

    setTemplateData(defaultTemplateData);
    setSmsTemplateData(defaultSmsTemplateData);
    setFormErrors({});
    fetchAllTemplates();
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else if (error.response?.data?.error?.id?.length > 0) {
      console.error("ID error:", error.response.data.error.id);
      setFormErrors({ id: "Template ID is required for update." });
    } else if (error.response?.data?.error?.subject?.length > 0) {
      setFormErrors({ subject: "Subject must be a valid string." });
    } else {
      console.log("Error Updating SMS Template", error);
    }
  }
};

const updatePushTemplate = async () => {
  try {

    console.log("push api hitting")
    if (!selectedTemplate?.id) {
      console.error("Missing Template ID");
      return;
    }

    const payload = {
      ...templateData,
      ...PushTemplateData,
      id: selectedTemplate.id,
    };

    await axios.post(UpdateTemplatemodule(selectedTemplate.id), payload, config);

    setTemplateData(defaultTemplateData);
    setPushTemplateData({
      subject: "",
      content: "",
    });
    setFormErrors({});
    fetchAllTemplates();
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Updating Push Template", error);
    }
  }
};

const updatePlatformTemplate = async () => {
  try {
    console.log("Updating Platform Template...");

    if (!selectedTemplate?.id) {
      console.error("Template ID is missing for update.");
      return;
    }

    const payload = {
      ...templateData,
      ...PlatformTemplateData,
      id: selectedTemplate.id,
      subject:"Subject Name",
    };

    await axios.post(UpdateTemplatemodule(selectedTemplate.id), payload, config);

    setTemplateData(defaultTemplateData);
    setPlatformTemplateData(defaultPlatformTemplateData);
    setFormErrors({});
    fetchAllTemplates();
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else if (error.response?.data?.error?.id?.length > 0) {
      setFormErrors({ id: "Template ID is required for update." });
    } else if (error.response?.data?.error?.subject?.length > 0) {
      setFormErrors({ subject: "Subject must be a valid string." });
    } else {
      console.log("Error Updating Platform Template", error);
    }
  }
};

const updateWhatsappTemplate = async () => {
  try {

    console.log("update whatsapp hitting")
    if (!selectedTemplate?.id) {
      console.error("Missing Template ID");
      return;
    }

    const payload = {
      ...templateData,
      ...WhatsappTemplateData,
      id: selectedTemplate.id,
    };

    await axios.post(UpdateTemplatemodule(selectedTemplate.id), payload, config);

    setTemplateData(defaultTemplateData);
    setWhatsappTemplateData({
      subject: "",
      content: "",
      header: "",
      footer: "",
    });
    setFormErrors({});
    fetchAllTemplates();
  } catch (error) {
    if (error.response?.data?.error?.template_name?.length > 0) {
      setFormErrors({ template_name: "Template name already exists." });
    } else {
      console.log("Error Updating WhatsApp Template", error);
    }
  }
};

// console.log("channel_id", templateData.channel_id)
// console.log("categoryData",state.categoryData)
// console.log("languageId", templateData.language_id)

const handleSaveTemplate = () => {
  switch (state.categoryData) {
    case "email":
      AddEmailTemplate();
      break;
    case "sms":
      AddSmsTemplate();
      break;
    case "platform":
      AddPlatformTemplate();
      break;
    case "whatsapp":
      AddWhatsappTemplate();
      break;
    case "push notification":
      AddPushTemplate();
      break;
    default:
      AddEmailTemplate();
  }
};

const handleUpdateTemplate=()=>{
    console.log("category data",state.categoryData)
    switch (state.categoryData) {
        case "email":
            updateEmailTemplate();
            break;
        case "sms":
            updateSmsTemplate();
            break;
        case "push notification":
            updatePushTemplate();
            break;
        case "platform":
            updatePlatformTemplate();
            break;
        case "whatsapp":
            updateWhatsappTemplate();
            break;
        default:
            break;
    }
}


    const handleBack=()=>{
        setSelectedTemplate(null);
        setIsOpenTemplateMessage(false);
    }

    // email template format text
    const handleFormat = (command) => {
        document.execCommand(command, false, null);
    };
    //select broadcast title

    const handleRadioChange = (event) => {
        updateState({ selectedValue: event.target.value });
    };
    //text

    const handleInputChange = (event) => {
        updateState({ text: event.target.value });
    };

    //email temple -->color change
    const handleColorChange = (type, color) => {
        setSelectedColors((prev) => ({ ...prev, [type]: color }));
    };
    //toggle for addvariable button


    const handleAddvarToggle = () => {
        updateState({ isAddvarModalVisible: !state.isAddvarModalVisible });
    };

    const handleHtmlAddvarToggle = () => {
        updateState({ isHtmlAddvarVisible: !state.isHtmlAddvarVisible });
    };
    //second add and delete reply button


    const handleSecondAddContent = () => {
        if (state.secondAddButtonContent?.length < 3) {
            updateState({ secondAddButtonContent: [...state.secondAddButtonContent, {}] });
        }
    };

    const handleFirstAddButtonContent = () => {
        if (state.firstAddButtonContent?.length < 3) {
            updateState({ firstAddButtonContent: [...state.firstAddButtonContent, {}] });
        }
    };

    const handleDeletesecondAdd = (index) => {
        updateState({
            secondAddButtonContent: state.secondAddButtonContent.filter((_, i) => i !== index),
        });
    };

    const handleDeleteFirstAdd = (index) => {
        updateState({
            firstAddButtonContent: state.firstAddButtonContent.filter((_, i) => i !== index),
        });
    };
    //first add and delete reply button
    // const handleAddReplybtn = () => {
    //     setShowContent(false);
    //     setAddReplyButton(true);
    // }
    // const handleAddButtonContent = () => {
    //     if (addButtonContent.length < 2) {
    //         setAddButtonContent([...addButtonContent, addButtonContent.length + 1]);

    //     }

    // };
    // const handleDeleteRow = (index) => {
    //     const updatedRows = addButtonContent.filter((_, i) => i !== index);
    //     setAddButtonContent(updatedRows);
    //     if (updatedRows.length === 0) {
    //         setShowContent(true);
    //     }
    // };

    //preview image


    const handleImageFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const filePreviewUrl = URL.createObjectURL(file);
            updateState({ previewImage: { url: filePreviewUrl, name: file.name } });
        }
    };

    const handleImageButtonClick = () => {
        document.getElementById('image-button-file').click();
    };
    //preview video

    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];
        if (file?.type.startsWith('video')) {
            const videoPreviewUrl = URL.createObjectURL(file);
            updateState({ videoPreview: { url: videoPreviewUrl, name: file.name } });
        }
    };
    const handleVideoButtonClick = () => {
        document.getElementById('video-button-file').click();
    };
    //preview document


    const handleDocumentFileChange = (event) => {
        const file = event.target.files[0];
        if (file?.type === 'application/pdf') {
            const documentPreviewUrl = URL.createObjectURL(file);
            updateState({ documentPreview: { url: documentPreviewUrl, name: file.name } });
        }
    };


    const handleDocumentButtonClick = () => {
        document.getElementById('document-button-file').click();
    };
    // body content textarea

    const handleTextareaTextChange = (event) => {
        updateState({ textareaContent: event.target.value });
    };

    const handleTextareaFocus = () => {
        updateState({ isFocused: true, showEmojiPicker: false });
    };

    //footer text

    const handleFooterInputChange = (event) => {
        updateState({ footerText: event.target.value });
    };
    //subject text

    // const handleSubjectChange = (event) => {
    //     updateState({ subjectText: event.target.value });
    // };
    //toggle

    const handleToggle = () => {
        updateState({ isActive: !state.isActive });
    };

    const handlePreviewToggle = () => {
        updateState({ isPreviewMessage: !state.isPreviewMessage });
    };

    const handleLogoToggle = () => {
        updateState({ isLogoMessage: !state.isLogoMessage });
    };

    const handleFooterToggle = () => {
        updateState({ isFooterMessage: !state.isFooterMessage });
    };

    // const handleHtmlPreviewToggle = () => {
    //     updateState({ isHtmlPreview: !state.isHtmlPreview });
    // };

    const handleEmojiClick = (emojiObject) => {
        updateState({ textareaContent: state.textareaContent + emojiObject.emoji });
    };

    const toggleEmojiPicker = () => {
        updateState({ showEmojiPicker: !state.showEmojiPicker });
    };

    const formatText = (startTag, endTag) => {
        const textarea = document.querySelector(".body_textarea_content");
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start !== end) {
            const selectedText = state.textareaContent.substring(start, end);
            const formattedText = `${startTag}${selectedText}${endTag}`;
            const updatedContent =
                state.textareaContent.substring(0, start) +
                formattedText +
                state.textareaContent.substring(end);
            updateState({ textareaContent: updatedContent });
        }
    };

    const handleBoldIconClick = () => formatText("*", "*");
    const handleItalicIconClick = () => formatText("_", "_");
    const handleStrikeIconClick = () => formatText("~", "~");


    //Add variable popup modal

    const handleAddVariableButton = () => {
        updateState({ isShowAddvariableModal: true });
    };

    const handleCloseAddVariable = () => {
        updateState({ isShowAddvariableModal: false });
    };


    const handleSelectAttribute = (attribute) => {
        updateState({ textareaContent: state.textareaContent + attribute });
    };


    //image Add variable popup modal 

    const handleImageSelectAttribute = () => {
        updateState({ isShowImageSelectAttribute: true });
    };

    const handleCloseSelectAttribute = () => {
        updateState({ isShowImageSelectAttribute: false });
    };
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            updateState({ savedRange: selection.getRangeAt(0) });
        }
    };
   
    const handleInsertLink = () => {
        const url = prompt("Enter the URL:");
        if (!url) return;
    
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    
        const editable = editableRef.current;
        editable.focus(); 
    
        const selection = window.getSelection();
        const range = document.createRange();
       range.selectNodeContents(editable);
        range.collapse(false); //end
    
        selection.removeAllRanges();
        selection.addRange(range);
    
        // Create anchor element
        const anchor = document.createElement("a");
        anchor.href = formattedUrl;
        anchor.textContent = formattedUrl;
        anchor.style.color = "blue";
        anchor.style.textDecoration = "underline";
        anchor.style.cursor = "pointer";
        anchor.style.fontSize = "13px";
    
        anchor.onclick = (e) => {
            e.preventDefault();
            window.open(formattedUrl, "_blank");
        };
    
        // Insert the anchor
        range.insertNode(document.createTextNode(" ")); 
        range.insertNode(anchor);
    
        
        range.setStartAfter(anchor);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    
        updateState({ savedRange: null });
    };
    
    const handleTemplateInsertLink = () => {
        const url = prompt("Enter the URL:");
        if (!url) return;
      
        const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      
        const textarea = document.querySelector(".body_textarea_content");
      
        if (!textarea) return;
      
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
      
        const linkText = selectedText || formattedUrl;
      
        const linked = `<a href="${formattedUrl}" target="_blank" style="color:blue; text-decoration:underline; font-size:13px">${linkText}</a>`;
      
        const newText =
          textarea.value.substring(0, start) +
          linked +
          textarea.value.substring(end);
      
        setState(prev => ({
          ...prev,
          textareaContent: newText,
        }));
      
      };
      
   
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
        updateState({
            code: `
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
                  width: ${state.PreviewMode === "mobile" ? "290px" : "360px"};
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
         `
        });
    }, [state.PreviewMode]);
    return (
        <>
            {
                state.isShowAddvariableModal && (
                    <SelectAttributeModal show={state.isShowAddvariableModal} onClose={handleCloseAddVariable}
                        onSelectAttribute={handleSelectAttribute} />
                )
            }
            {
                state.isShowImageSelectAttribute && (
                    <ImageSelectAttribute show={state.isShowImageSelectAttribute} onClose={handleCloseSelectAttribute} />
                )
            }
            <div className="new_template_container">
                <div className="new_template_header">
                    <div onClick={handleBack} className="new_template_left">

                        <ArrowBackIcon />
                        <span className="new_template_title">New Templates</span>

                    </div>
                    <div className="new_template_right">
                        <ButtonComponent label='Save as draft' customBtn='new_template_draftbtn' />
                        <ButtonComponent
                        onClick={selectedTemplate ? handleUpdateTemplate : handleSaveTemplate}
                        label={selectedTemplate ? "Update Template" : "Save and Submit"}
                        />
                    </div>
                </div>
                <div className="new_template_content">
                    <div className="new_template_content_left">
                        <div className="left_header">
                            {/* <div className="name_block_field">
                                <div className="name_block_title">Template Name</div>
                                <TextfieldComponent placeholder='Template Name' customStyle='template_input' 
                                value= {templateData.template_name}
                                onChange={(e) =>setTemplateData((prev) => ({ ...prev, template_name: e.target.value }))}
                                 />
                            </div> */}

                            <div className="name_block_field">
                                <div className="name_block_title">Template Name</div>
                                <TextfieldComponent
                                    placeholder="Template Name"
                                    customStyle="template_input"
                                    value={templateData.template_name}
                                    onChange={(e) => {
                                    setTemplateData((prev) => ({ ...prev, template_name: e.target.value }));
                                    setFormErrors((prev) => ({ ...prev, template_name: '' }));
                                    }}
                                />
                                {formErrors.template_name && (
                                    <p style={{ color: 'red', fontSize:"12px" }}>{formErrors.template_name}</p>
                                )}
                                </div>

                            {/* <div className="name_block_field">
                                <div className="name_block_title">Module Name</div>
                                <TextfieldComponent placeholder='Module Name' customStyle='template_input' />
                            </div> */}
                                <div className="name_block_field">
                                <div className="name_block_title">Module Code</div>
                                   <AutocompleteComponent
                                options={moduleOptions}
                                getOptionLabel={(option) => option?.label || ''}  
                                value={
                                    moduleOptions.find(opt => opt.id === templateData.module_code) || null
                                }
                                onChange={(event, newValue) => {
                                    setTemplateData((prev) => ({
                                    ...prev,
                                    module_code: newValue?.id || ''
                                    }));
                                }}
                                placeholder="Select a module"
                                customStyles={style.templateAutocompleteStyle}
                                />

                                    </div>

                            <div className="name_block_field">
                                <div className="name_block_title">Channel</div>
                               
                               {/* <AutocompleteComponent
                                    options={channelOptions}
                                    getOptionLabel={(option) => option.label || ''}
                                    value={channelOptions.find(opt => opt.id === templateData.channel_id) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                        setTemplateData((prev) => ({
                                            ...prev,
                                            channel_id: newValue.id,
                                        }));
                                        setState((prev) => ({
                                            ...prev,
                                            categoryData: newValue.label,
                                        }));
                                        } else {
                                        setTemplateData((prev) => ({ ...prev, channel_id: null }));
                                        setState((prev) => ({ ...prev, categoryData: '' }));
                                        }
                                    }}
                                    customStyles={style.templateAutocompleteStyle}
                                    />*/}

                                    <AutocompleteComponent
                                        options={channelOptions}
                                        getOptionLabel={(option) => option.label || ''}
                                        value={channelOptions.find(opt => opt.id === templateData.channel_id) || null}
                                        onChange={(event, newValue) => {
                                            if (!selectedTemplate && newValue) { 
                                            setTemplateData((prev) => ({
                                                ...prev,
                                                channel_id: newValue.id,
                                            }));
                                            setState((prev) => ({
                                                ...prev,
                                                categoryData: newValue.label,
                                            }));
                                            }
                                        }}
                                        disabled={Boolean(selectedTemplate)} 
                                        customStyles={style.templateAutocompleteStyle}
                                        />



                            </div>
                            <div className="name_block_field">
                                <div className="name_block_title">Ticket Type</div>
                                <AutocompleteComponent
                                    options={ticketTypeOptions}
                                    // value={state.ticketTypeData}
                                    value={templateData.ticket_type}
                                    // onChange={(e)=>setEmailTemplateData({TicketType:e.target.value})}
                                    onChange={(event, newValue) =>setTemplateData((prev) => ({ ...prev, ticket_type: newValue }))}
                                    customStyles={style.templateAutocompleteStyle}
                                />
                            </div>
                            <div className="name_block_field language_dropdown">
                                <div className="name_block_title">Language</div>
                                {/* <AutocompleteComponent
                                    options={languageOptions}
                                    value={state.languageData}
                                    onChange={(event, newValue) => updateState({ languageData: newValue })}
                                    customStyles={style.templateAutocompleteStyle}
                                /> */}
                                {/* <AutocompleteComponent
                                options={languageOptions}
                                // value={state.languageData}
                                    value={templateData.language_id}
                                    // onChange={(e)=>setEmailTemplateData({Language:e.target.value})}
                                    onChange={(event, newValue) =>setTemplateData((prev) => ({ ...prev, Language: newValue }))}
                                customStyles={style.templateAutocompleteStyle}
                                /> */}
                                <AutocompleteComponent
                                    options={languageOptions}
                                    value={languageOptions.find((lang) => lang.id === templateData.language_id) || null}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                        setTemplateData((prev) => ({
                                            ...prev,
                                            language_id: newValue.id,
                                        }));
                                        } else {
                                        setTemplateData((prev) => ({
                                            ...prev,
                                            language_id: null,
                                        }));
                                        }
                                    }}
                                    customStyles={style.templateAutocompleteStyle}
                                    />


                            </div>
                        </div>
                        <div className="broadcast_content">
                            {
                                // state.categoryData === 'Email' && (
                                // templateData.channel_id === 'Email' && (
                                state.categoryData === 'email' && (

                                    <>
                                        <div className="channel_email_content">
                                            <div className="email_text">How would you like to create your email template?</div>
                                            <div className="email_main_grid">
                                                <div className={`visual_html_editor ${state.emailContent === "visual builder" ? "active" : ""}`} onClick={() => updateState({ emailContent: "visual builder" })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="64" height="64"><g stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" clip-path="url(#palette_svg__a)"><path d="M12 21a9 9 0 0 1 0-18c2.387 0 4.676.843 6.364 2.343S21 8.878 21 11c0 1.06-.474 2.078-1.318 2.828S17.694 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"></path><path fill="currentcolor" d="M7.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M12 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M16.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path></g><defs><clipPath id="palette_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
                                                    <h4 className="email_grid_heading">Use visual builder</h4>
                                                    <p className="email_grid_subtext">A visual and code-free builder</p>
                                                </div>
                                                <div className={`visual_html_editor ${state.emailContent === "html editor" ? "active" : ""}`} onClick={() => updateState({ emailContent: "html editor" })} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="64" height="64"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14 4-4 16m7-12 4 4-4 4M7 8l-4 4 4 4"></path></svg>
                                                    <h4 className="email_grid_heading">Use HTML editor</h4>
                                                    <p className="email_grid_subtext">An advanced coding editor</p>
                                                </div>
                                            </div>
                                            {
                                                state.emailContent === 'visual builder' && (
                                                    <>
                                                        <div className="visual_builder_container">
                                                            <div className='textbox_container'>
                                                                {/* <label>Email template name</label> */}
                                                                <label>Subject</label>
                                                                <TextfieldComponent 
                                                                 placeholder='Name the email template' 
                                                                 customStyle='new_tickets_textbox'

                                                                  />
                                                            </div>
                                                            {/* <div className='textbox_container'>
                                                                <label>Teams assigned to email template</label>
                                                                <AutocompleteComponent
                                                                    placeholder='select who will use the email template'
                                                                    options={teamOptions}
                                                                    value={state.teamContent}
                                                                    onChange={(event, newValue) => updateState({ teamContent: newValue })}
                                                                    customStyles={style.newticketsAutocomplete}
                                                                />
                                                            </div> */}
                                                            <Accordion sx={style.templateAccordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={style.templateAccordionHeading}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><g stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" clip-path="url(#palette_svg__a)"><path d="M12 21a9 9 0 0 1 0-18c2.387 0 4.676.843 6.364 2.343S21 8.878 21 11c0 1.06-.474 2.078-1.318 2.828S17.694 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"></path><path fill="currentcolor" d="M7.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M12 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M16.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"></path></g><defs><clipPath id="palette_svg__a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
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
                                                                                <ToggleSwitch isActive={state.isLogoMessage} onToggle={handleLogoToggle} />

                                                                            </span>
                                                                        </label>
                                                                        {
                                                                            state.isLogoMessage && (
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
                                                            <Accordion sx={style.templateAccordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={style.templateAccordionHeading}>
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
                                                                            onMouseUp={saveSelection}
                                                                            onKeyUp={saveSelection}

                                                                        >
                                                                            <h1>Hi,</h1>
                                                                            <p></p>
                                                                            <div>Ticket ID:</div>
                                                                            <div>Assigned agent:</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="content_text_container">
                                                                        <div className="content_text">
                                                                            <FormatBoldIcon onClick={() => handleFormat('bold')} />
                                                                            <FormatItalicIcon onClick={() => handleFormat('italic')} />
                                                                            <FormatUnderlinedRoundedIcon onClick={() => handleFormat('underline')} />
                                                                            <StrikethroughSIcon onClick={() => handleFormat('strikeThrough')} />
                                                                            <div className="url_icon" onClick={handleInsertLink}><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                                        </div>
                                                                        <div className="add_var_btn" onClick={handleAddvarToggle}>+ Add Variable</div>
                                                                        {
                                                                            state.isAddvarModalVisible && (
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

                                                                        <ToggleSwitch isActive={state.isPreviewMessage} onToggle={handlePreviewToggle} />
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                            <Accordion sx={style.templateAccordionStyle}>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}

                                                                >
                                                                    <div component="span" style={style.templateAccordionHeading}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 18H4m16-1H4m1 3h14c1.105 0 2-.91 2-2.032V6.032C21 4.91 20.105 4 19 4H5c-1.104 0-2 .91-2 2.032v11.936C3 19.09 3.896 20 5 20"></path></svg>
                                                                        Footer</div>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className="previous_msg">Show Footer
                                                                        <ToggleSwitch isActive={state.isFooterMessage} onToggle={handleFooterToggle} />

                                                                    </div>
                                                                    <div className="previous_msg">Hide Help Desk Label</div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            {
                                                state.emailContent === 'html editor' && (
                                                    <>
                                                        <div className="html_editor">
                                                            <div className='textbox_container'>
                                                                {/* <label>Email template name</label> */}
                                                                <label>Subject</label>
                                                                <TextfieldComponent 
                                                                placeholder='Name the email template'
                                                                 customStyle='new_tickets_textbox'
                                                                  value={emailTemplateData.subject}
                                                                  onChange={(event, newValue) =>setEmailTemplateData((prev) => ({ ...prev, subject: event.target.value }))}
                                                                 />
                                                            </div>
                                                            {/* <div className='textbox_container'>
                                                                <label>Teams assigned to email template</label>
                                                                <AutocompleteComponent
                                                                    placeholder='select who will use the email template'
                                                                    options={teamOptions}
                                                                    value={state.teamContent}
                                                                    onChange={(event, newValue) => updateState({ teamContent: newValue })}
                                                                    customStyles={style.newticketsAutocomplete}
                                                                />
                                                            </div> */}
                                                            <div className="html_editor_header">
                                                                <div className="html_editor_headerleft">
                                                                    <button className={`html_editor_btn ${state.activeTab === "html" ? "active" : ""}`}
                                                                        onClick={() => updateState({ activeTab: "html" })}>Html</button>
                                                                    <button className={`html_editor_btn ${state.activeTab === "plain" ? "active" : ""}`}
                                                                        onClick={() => updateState({ activeTab: "plain" })} >Plain text</button>
                                                                </div>
                                                                {/* <ButtonComponent label='+ Add variable' onClick={handleHtmlAddvarToggle} /> */}

                                                                {/* {
                                                                    state.isHtmlAddvarVisible && (
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

                                                                } */}
                                                            </div >
                                                            <div className='htmleditor_code_container' >
                                                                <div className="htmleditor_code_status">
                                                                    <div>Template Status:</div><span className='status_checked'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16" color="var(--action-positive-default)"><path stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 12 2 2 4-4M3 12a9 9 0 1 0 18.001 0A9 9 0 0 0 3 12"></path></svg></span>
                                                                    <span>{state.activeTab === 'html' ? 'Ok' : 'Add “Message” parameter'}</span>
                                                                </div>
                                                                {state.activeTab === "html" &&

                                                                    <div>
                                                                        <CodeMirror
                                                                        value={emailTemplateData.HtmlText}
                                                                        options={{
                                                                            mode: "xml",
                                                                            theme: "material",
                                                                            lineNumbers: true,
                                                                            indentWithTabs: true,
                                                                            smartIndent: true,
                                                                            matchBrackets: true,
                                                                        }}
                                                                        onBeforeChange={(editor, data, value) => {
                                                                            setEmailTemplateData((prev) => ({ ...prev, HtmlText: value }));
                                                                        }}
                                                                        />

                                                                    </div>

                                                                }
                                                                {
                                                                    state.activeTab === 'plain' && (
                                                                        <div>
                                                                            <textarea style={{
                                                                                height:"100px", width:"300px"
                                                                            }} name="" id="" 
                                                                            // value={state.plainText}
                                                                            // onChange={(event, newValue)=>updateState({plainText: newValue})}
                                                                            value={emailTemplateData.PlainText}
                                                                            onChange={(event, newValue) =>setEmailTemplateData((prev) => ({ ...prev, PlainText: event.target.value }))}
                                                                            >

                                                                            </textarea>
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
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
                            {/* {["Whatsapp", "Push"].includes(state.categoryData) && ( */}
                            {state.categoryData === "push notification" && (
                                <div className="platform_division">
                                    <div className="name_block_title">Broadcast title<span className="block_title_optional">(Optional)</span></div>
                                    <div className="block_comments">Highlight your brand here, use images or videos, to stand out</div>
                                    <div className="radios_container">
                                        <RadioGroup
                                            value={state.selectedValue}
                                            onChange={handleRadioChange}>
                                            <div className="checkbox_container">
                                                {/* <FormControlLabel value="none" control={<Radio sx={style.newTemplateRadiobtn} />} label="None" /> */}
                                                <FormControlLabel value="text" control={<Radio sx={style.newTemplateRadiobtn} />} label="Text" className="radio_style" />
                                                {/* <FormControlLabel value="image" control={<Radio sx={style.newTemplateRadiobtn} />} label="Image" className="radio_style" /> */}
                                                {/* <FormControlLabel value="video" control={<Radio sx={style.newTemplateRadiobtn} />} label="Video" className="radio_style" /> */}
                                                {/* <FormControlLabel value="document" control={<Radio sx={style.newTemplateRadiobtn} />} label="Document" className="radio_style" /> */}
                                            </div>
                                        </RadioGroup>

                                    </div>
                                    <div>
                                        {state.selectedValue === "text" && (
                                            <div className="footer_container">
                                                <TextfieldComponent
                                                placeholder="Enter Text"
                                                customStyle="template_input"
                                                value={PushTemplateData.subject}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPushTemplateData((prev) => ({ ...prev, subject: value }));
                                                }}
                                                />
                                                <div className="footer_text_count">
                                                {PushTemplateData?.subject?.length}/60
                                                </div>
                                            </div>
                                            )}

                                        {state.selectedValue === "image" && <div>
                                            <p className="utility_header_media_type">(Image: .jpeg, .png)</p>

                                            {state.previewImage && (
                                                <>
                                                    <p><strong>Uploaded from PC:</strong>{state.previewImage.name}</p>
                                                    <img
                                                        src={state.previewImage.url}
                                                        style={{ height: '200px' }} alt="Preview"

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
                                            {/* <div className="none_add_variables_btn" onClick={handleImageSelectAttribute}><AddCircleOutlineIcon />Add Variable</div> */}
                                        </div>}
                                        {state.selectedValue === "video" && <div>
                                            <p className="utility_header_media_type">(video:.mp4)</p>
                                            {

                                                state.videoPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{state.videoPreview.name}</p>
                                                        <video
                                                            src={state.videoPreview.url}
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
                                        {state.selectedValue === "document" && <div>
                                            <p className="utility_header_media_type">(Document:.pdf)</p>
                                            {
                                                state.documentPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{state.documentPreview.name}</p>

                                                        <object
                                                            data={state.documentPreview.url}
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

                            {state.categoryData === "whatsapp" && (
                                <div className="platform_division">
                                    <div className="name_block_title">Broadcast title<span className="block_title_optional">(Optional)</span></div>
                                    <div className="block_comments">Highlight your brand here, use images or videos, to stand out</div>
                                    <div className="radios_container">
                                        <RadioGroup
                                            value={state.selectedValue}
                                            onChange={handleRadioChange}>
                                            <div className="checkbox_container">
                                                {/* <FormControlLabel value="none" control={<Radio sx={style.newTemplateRadiobtn} />} label="None" /> */}
                                                <FormControlLabel value="text" control={<Radio sx={style.newTemplateRadiobtn} />} label="Text" className="radio_style" />
                                                {/* <FormControlLabel value="image" control={<Radio sx={style.newTemplateRadiobtn} />} label="Image" className="radio_style" /> */}
                                                {/* <FormControlLabel value="video" control={<Radio sx={style.newTemplateRadiobtn} />} label="Video" className="radio_style" /> */}
                                                {/* <FormControlLabel value="document" control={<Radio sx={style.newTemplateRadiobtn} />} label="Document" className="radio_style" /> */}
                                            </div>
                                        </RadioGroup>

                                    </div>
                                    <div>
                                        {state.selectedValue === "text" && (
                                            <div className="footer_container">
                                                <TextfieldComponent
                                                placeholder="Enter Text"
                                                customStyle="template_input"
                                                value={WhatsappTemplateData.subject}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setWhatsappTemplateData((prev) => ({ ...prev, subject: value }));
                                                }}
                                                />
                                                <div className="footer_text_count">
                                                {WhatsappTemplateData?.subject?.length}/60
                                                </div>
                                            </div>
                                            )}

                                        {state.selectedValue === "image" && <div>
                                            <p className="utility_header_media_type">(Image: .jpeg, .png)</p>

                                            {state.previewImage && (
                                                <>
                                                    <p><strong>Uploaded from PC:</strong>{state.previewImage.name}</p>
                                                    <img
                                                        src={state.previewImage.url}
                                                        style={{ height: '200px' }} alt="Preview"

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
                                            {/* <div className="none_add_variables_btn" onClick={handleImageSelectAttribute}><AddCircleOutlineIcon />Add Variable</div> */}
                                        </div>}
                                        {state.selectedValue === "video" && <div>
                                            <p className="utility_header_media_type">(video:.mp4)</p>
                                            {

                                                state.videoPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{state.videoPreview.name}</p>
                                                        <video
                                                            src={state.videoPreview.url}
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
                                        {state.selectedValue === "document" && <div>
                                            <p className="utility_header_media_type">(Document:.pdf)</p>
                                            {
                                                state.documentPreview && (
                                                    <>
                                                        <p><strong>Uploaded from PC:</strong>{state.documentPreview.name}</p>

                                                        <object
                                                            data={state.documentPreview.url}
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
                                // state.categoryData !== 'Email' && (
                                // templateData.channel_id === 'SMS' && (
                                state.categoryData === 'sms' && (
                                    <div className="none_body_content">
                                        <div className="name_block_title">Body</div>
                                        <div className="block__comments">Make your messages personal using variables like
                                            <span>name</span> and get more replies!
                                        </div>
                                        {/* <div className="none_add_variables_btn none_body_add_var_btn" onClick={handleAddVariableButton}><AddCircleOutlineIcon />Add Variable</div> */}
                                        <div className="none_block_template_content">
                                            <div>
                                                <div className="none_body_template_icons">
                                                    <TagFacesIcon onClick={toggleEmojiPicker} />
                                                    {state.showEmojiPicker && (
                                                        <div className="emoji_picker_container">
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        </div>
                                                    )}
                                                    <FormatBoldIcon className="none_bold_icon" onClick={handleBoldIconClick} />
                                                    <FormatItalicIcon onClick={handleItalicIconClick} />
                                                    <StrikethroughSIcon onClick={handleStrikeIconClick} />
                                                    <div className="url_icon" onClick={handleTemplateInsertLink} ><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                    <div className="toolbar_counter">{smsTemplateData?.content?.length}/1024</div>
                                                </div>
                                            </div>
                                            <div className="none_template_body_editor">

                                                <textarea
                                                    value={smsTemplateData?.content}
                                                    onChange={(e, prev)=>setSmsTemplateData((prev) => ({ ...prev, content: e.target.value }))}
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
                                // state.categoryData !== 'Email' && (
                                state.categoryData === 'platform' && (
                                    <div className="none_body_content">
                                        <div className="name_block_title">Body</div>
                                        <div className="block__comments">Make your messages personal using variables like
                                            <span>name</span> and get more replies!
                                        </div>
                                        {/* <div className="none_add_variables_btn none_body_add_var_btn" onClick={handleAddVariableButton}><AddCircleOutlineIcon />Add Variable</div> */}
                                        <div className="none_block_template_content">
                                            <div>
                                                <div className="none_body_template_icons">
                                                    <TagFacesIcon onClick={toggleEmojiPicker} />
                                                    {state.showEmojiPicker && (
                                                        <div className="emoji_picker_container">
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        </div>
                                                    )}
                                                    <FormatBoldIcon className="none_bold_icon" onClick={handleBoldIconClick} />
                                                    <FormatItalicIcon onClick={handleItalicIconClick} />
                                                    <StrikethroughSIcon onClick={handleStrikeIconClick} />
                                                    <div className="url_icon" onClick={handleTemplateInsertLink} ><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                    <div className="toolbar_counter">{PlatformTemplateData?.content?.length}/1024</div>
                                                </div>
                                            </div>
                                            <div className="none_template_body_editor">

                                                <textarea
                                                    value={PlatformTemplateData?.content}
                                                    onChange={(e, prev)=>setPlatformTemplateData((prev) => ({ ...prev, content: e.target.value }))}
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
                                // state.categoryData !== 'Email' && (
                                state.categoryData === 'whatsapp' && (
                                    <div className="none_body_content">
                                        <div className="name_block_title">Body</div>
                                        <div className="block__comments">Make your messages personal using variables like
                                            <span>name</span> and get more replies!
                                        </div>
                                        {/* <div className="none_add_variables_btn none_body_add_var_btn" onClick={handleAddVariableButton}><AddCircleOutlineIcon />Add Variable</div> */}
                                        <div className="none_block_template_content">
                                            <div>
                                                <div className="none_body_template_icons">
                                                    <TagFacesIcon onClick={toggleEmojiPicker} />
                                                    {state.showEmojiPicker && (
                                                        <div className="emoji_picker_container">
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        </div>
                                                    )}
                                                    <FormatBoldIcon className="none_bold_icon" onClick={handleBoldIconClick} />
                                                    <FormatItalicIcon onClick={handleItalicIconClick} />
                                                    <StrikethroughSIcon onClick={handleStrikeIconClick} />
                                                    <div className="url_icon" onClick={handleTemplateInsertLink} ><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                    <div className="toolbar_counter">{WhatsappTemplateData?.content?.length}/1024</div>
                                                </div>
                                            </div>
                                            <div className="none_template_body_editor">

                                                <textarea
                                                    value={WhatsappTemplateData?.content}
                                                    onChange={(e, prev)=>setWhatsappTemplateData((prev) => ({ ...prev, content: e.target.value }))}
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
                                // state.categoryData !== 'Email' && (
                                state.categoryData === "push notification" && (
                                    <div className="none_body_content">
                                        <div className="name_block_title">Body</div>
                                        <div className="block__comments">Make your messages personal using variables like
                                            <span>name</span> and get more replies!
                                        </div>
                                        {/* <div className="none_add_variables_btn none_body_add_var_btn" onClick={handleAddVariableButton}><AddCircleOutlineIcon />Add Variable</div> */}
                                        <div className="none_block_template_content">
                                            <div>
                                                <div className="none_body_template_icons">
                                                    <TagFacesIcon onClick={toggleEmojiPicker} />
                                                    {state.showEmojiPicker && (
                                                        <div className="emoji_picker_container">
                                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                        </div>
                                                    )}
                                                    <FormatBoldIcon className="none_bold_icon" onClick={handleBoldIconClick} />
                                                    <FormatItalicIcon onClick={handleItalicIconClick} />
                                                    <StrikethroughSIcon onClick={handleStrikeIconClick} />
                                                    <div className="url_icon" onClick={handleTemplateInsertLink} ><svg xmlns="http://www.w3.org/2000/svg" width="34" height="11" viewBox="0 0 34 11" fill="none"><path d="M8.9 5.30859C8.9 3.59859 10.29 2.20859 12 2.20859H16V0.308594H12C10.6739 0.308594 9.40215 0.835378 8.46447 1.77306C7.52678 2.71074 7 3.98251 7 5.30859C7 6.63468 7.52678 7.90645 8.46447 8.84413C9.40215 9.78181 10.6739 10.3086 12 10.3086H16V8.40859H12C10.29 8.40859 8.9 7.01859 8.9 5.30859ZM13 6.30859H21V4.30859H13V6.30859ZM22 0.308594H18V2.20859H22C23.71 2.20859 25.1 3.59859 25.1 5.30859C25.1 7.01859 23.71 8.40859 22 8.40859H18V10.3086H22C23.3261 10.3086 24.5979 9.78181 25.5355 8.84413C26.4732 7.90645 27 6.63468 27 5.30859C27 3.98251 26.4732 2.71074 25.5355 1.77306C24.5979 0.835378 23.3261 0.308594 22 0.308594Z" fill="#666666"></path><path d="M-7.80005e-08 6.99656L-1.74695e-07 4.78444L2.94949 4.78444L2.94949 3L5.84 5.8905L2.9495 8.78101L2.94949 6.99656L-7.80005e-08 6.99656Z" fill="#666666"></path><path d="M34 6.99656L34 4.78444L31.0505 4.78444L31.0505 3L28.16 5.8905L31.0505 8.78101L31.0505 6.99656L34 6.99656Z" fill="#666666"></path></svg></div>
                                                    <div className="toolbar_counter">{PushTemplateData?.content?.length}/1024</div>
                                                </div>
                                            </div>
                                            <div className="none_template_body_editor">

                                                <textarea
                                                    value={PushTemplateData?.content}
                                                    onChange={(e, prev)=>setPushTemplateData((prev) => ({ ...prev, content: e.target.value }))}
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
                                // state.categoryData === 'Whatsapp' && (
                                state.categoryData === 'whatsapp' && (
                                    <div className="none_footer_content">
                                        <div className="name_block_title">Footer<span className="block_title_optional">(Optional)</span></div>
                                        <div className="none_footer_comments">Footers are great to add any disclaimers or to add a thoughtful PS</div>
                                        <div className="footer_container">
                                            <TextfieldComponent placeholder='Enter Text' customStyle='template_input' value={WhatsappTemplateData.footer} 
                                            onChange={(e)=>setWhatsappTemplateData((prev)=>({...prev, footer: e.target.value}))} />
                                            <div className="footer_text_count">{WhatsappTemplateData?.footer?.length}/60</div>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                // ['Whatsapp', 'Platform', 'Push'].includes(state?.categoryData) && (
                                ['whatsapp', 'platform', 'push'].includes(templateData?.TicketType) && (
                                    <div className="none_button_content">
                                        <div className="name_block_title">Buttons<span className="block_title_optional">(Recommended)</span></div>
                                        <div className="none_button_comments">Insert buttons so your customers can take action and engage with your message! </div>
                                        <div className="button_toggle">
                                            <ToggleSwitch isActive={state.isActive} onToggle={handleToggle} />

                                        </div>
                                        <div>

                                            {
                                                state.isActive && (
                                                    <>
                                                        <div className="none_button_group">
                                                            {state?.firstAddButtonContent?.length === 0 && (
                                                                <div className="buttondata_dropdown">
                                                                    <AutocompleteComponent
                                                                        options={buttonOptions}
                                                                        value={state.buttonData}
                                                                        onChange={(event, newValue) => updateState({ buttonData: newValue })}
                                                                        customStyles={style.templateAutocompleteStyle}
                                                                    />
                                                                </div>
                                                            )}
                                                            {
                                                                state.firstAddButtonContent.map((_, index) => (
                                                                    <>
                                                                        <div className="button_block_container" key={index}>
                                                                            <div className="call_action_row">
                                                                                <div className="call_action_row_btn_container">
                                                                                    <div className="buttondata_dropdown">
                                                                                        <AutocompleteComponent
                                                                                            options={buttonOptions}
                                                                                            value={state.buttonData}
                                                                                            onChange={(event, newValue) => updateState({ buttonData: newValue })}
                                                                                            customStyles={style.templateAutocompleteStyle}
                                                                                        /></div>
                                                                                    <div className="footer_container second_add_button_textbox">
                                                                                        <TextfieldComponent placeholder='Button Text' customStyle='template_input' />
                                                                                        <div className="footer_text_count">0/25</div>
                                                                                    </div>
                                                                                    <IconButton
                                                                                        onClick={() => handleDeleteFirstAdd(index)}
                                                                                        sx={[style.tableIconBtn, style.tabledeleteHover]} >
                                                                                        <DeleteOutlineIcon />
                                                                                    </IconButton>


                                                                                </div>
                                                                            </div>
                                                                            <div className="call_action_row">
                                                                                <div className="call_action_row_btn_container">
                                                                                    <div className="buttondata_dropdown">
                                                                                        <AutocompleteComponent
                                                                                            options={buttonOptions}
                                                                                            value={state.buttonData}
                                                                                            onChange={(event, newValue) => updateState({ buttonData: newValue })}
                                                                                            customStyles={style.templateAutocompleteStyle}
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

                                                            <div style={state.firstAddButtonContent?.length > 0 ? { position: 'absolute', right: '0px' } : {}}>
                                                                {state.firstAddButtonContent?.length < 3 && (
                                                                    <ButtonComponent label='Add button' customBtn='new_template_draftbtn' onClick={handleFirstAddButtonContent} />
                                                                )}
                                                            </div>
                                                        </div>


                                                        <div className="none_button_group">
                                                            <div className="buttondata_dropdown">
                                                                <AutocompleteComponent
                                                                    options={secondbuttonOptions}
                                                                    value={state.secondButtonData}
                                                                    onChange={(event, newValue) => updateState({ secondButtonData: newValue })}
                                                                    customStyles={style.templateAutocompleteStyle}
                                                                />
                                                            </div>
                                                            {
                                                                state.secondAddButtonContent.map((_, index) => (
                                                                    <div className="none_second_add_container" key={index}>
                                                                        <div className="footer_container second_add_button_textbox">
                                                                            <TextfieldComponent placeholder='Button Text' customStyle='template_input' />
                                                                            <div className="footer_text_count">0/25</div>
                                                                        </div>
                                                                        <IconButton
                                                                            onClick={() => handleDeletesecondAdd(index)}
                                                                            sx={[style.tableIconBtn, style.tabledeleteHover]} >
                                                                            <DeleteOutlineIcon />
                                                                        </IconButton>

                                                                    </div>
                                                                ))

                                                            }

                                                            {state?.secondAddButtonContent?.length < 3 && (
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
                                state.categoryData === 'whatsapp' && (
                                // templateData.channel_id === 'Whatsapp' && (
                                    <>
                                        {
                                            state.isFocused && (
                                                <div className="none_sample_content">
                                                    <div className="name_block_title">Sample Content</div>
                                                    <div className="none_sample_comments">Just enter sample content here (it doesn't need to be exact!)</div>
                                                    <div className="none_sample_content_textbox">
                                                        <TextfieldComponent value={WhatsappTemplateData.header} 
                                                        onChange={(e)=>setWhatsappTemplateData((prev)=>({...prev, header: e.target.value}))}
                                                        placeholder='Enter content for {{name}}' customStyle='template_input' />
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
                            <span><StayCurrentPortraitRoundedIcon style={{ cursor: 'pointer', color: state.PreviewMode === 'mobile' ? 'green' : 'black' }} onClick={() => updateState({ PreviewMode: "mobile" })} />
                                {
                                    // state.categoryData !== 'SMS' && (
                                    state.categoryData !== 'sms' && (
                                        <DesktopWindowsRoundedIcon style={{ cursor: 'pointer', color: state.PreviewMode === 'desktop' ? 'green' : 'black' }} onClick={() => updateState({ PreviewMode: 'desktop' })} />
                                    )
                                }
                            </span></div>
                        {
                            // state.categoryData === 'Email' ?
                            state.categoryData === 'email' ?
                                (
                                    <>
                                        {
                                            state.emailContent === 'visual builder' && (
                                                <><div className="email_visual_builder"
                                                    style={{
                                                        width: state.PreviewMode === "mobile" ? "100%" : "100%",
                                                        maxWidth: state.PreviewMode === "mobile" ? "290px" : "360px",
                                                        backgroundColor: selectedColors.background || "white",
                                                        color: selectedColors.text || "white",

                                                    }}
                                                >
                                                    <div
                                                        ref={previewRef}
                                                        className="ticket_details"
                                                        style={{

                                                            backgroundColor: selectedColors.textBox || "white",
                                                            width: state.PreviewMode === "mobile" ? "100%" : "100%",
                                                            maxWidth: state.PreviewMode === "mobile" ? "266px" : "320px",

                                                        }}
                                                    >

                                                    </div>
                                                    {
                                                        state.isPreviewMessage && (
                                                            <div className="preview_msg_container">
                                                                <div className="preview_msg_text">Previous Messages</div>
                                                                <div className='preview_msg_content' style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: state.PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: state.PreviewMode === "mobile" ? "266px" : "320px",

                                                                }}>
                                                                    <h2 > <a href="#demo" style={{ color: selectedColors.link || 'white' }}>earl@example.com</a>wrote:</h2>
                                                                    <div>Hello, I have some difficult case here</div>
                                                                    <div className="history_date">Tue, 11/17/2020, 2:25 PM UTC</div>
                                                                </div>
                                                                <div className='preview_msg_content' style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: state.PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: state.PreviewMode === "mobile" ? "266px" : "320px",


                                                                }}>
                                                                    <h2>Agent wrote:</h2>
                                                                    <div>Thank you for your email. We'll reply as soon as we can. Your case number is J3C90R.</div>
                                                                    <div className="history_date">Tue, 11/17/2020, 2:25 PM UTC</div>
                                                                </div>
                                                                <div style={{

                                                                    backgroundColor: selectedColors.textBox || "white",
                                                                    width: state.PreviewMode === "mobile" ? "100%" : "100%",
                                                                    maxWidth: state.PreviewMode === "mobile" ? "266px" : "320px",


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
                                            state.emailContent === 'html editor' && (
                                                <>
                                                    <div dangerouslySetInnerHTML={{ __html: state.code }}></div>

                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <div className="template_preview_svg"
                                        style={{
                                            // backgroundImage: `url(${state.PreviewMode === 'mobile' ? mobileBackgroundImages[state.categoryData] : desktopBackgroundImages[state.categoryData]})`,
                                            backgroundImage: `url(${state.PreviewMode === 'mobile' ? mobileBackgroundImages[state.categoryData] : desktopBackgroundImages[state.categoryData]})`,
                                            width: state.PreviewMode === 'desktop' ? "112%" : "306px",
                                            height: state.PreviewMode === 'desktop' ? '43%' : '570px',



                                        }}>
                                        {
                                            // state.categoryData === 'Email' && (
                                            state.categoryData === 'email' && (
                                                <div className="email_subject" style={{
                                                    left: state.PreviewMode === 'desktop' ? "95px" : '45px',
                                                    top: state.PreviewMode === 'desktop' ? "22%" : '16%',
                                                    height: state.PreviewMode === 'desktop' ? '13px' : '23px',
                                                    fontSize: state.PreviewMode === 'desktop' ? '11px' : '13px',
                                                }}>{state.subjectText}</div>
                                            )
                                        }

                                        <div className="preview_message">
                                            <div className="preview_message_container" style={{
                                                marginTop: state.categoryData === "sms" ? state.PreviewMode === "desktop" ? "12px" : "248px" : state.PreviewMode === "desktop" ? "12px" : "75px",
                                                marginLeft: state.PreviewMode === "desktop" ? state.categoryData === "whatsapp" ? "33%" : "67px" : "31px",
                                                width: state.PreviewMode === "desktop" ? state.categoryData === "whatsapp" ? "214px" : "254px" : "210px",
                                                maxHeight: state.PreviewMode === 'desktop' ? '84px' : '',
                                                overflowY: state.PreviewMode === 'desktop' ? 'auto' : 'hidden',
                                                fontSize: state.PreviewMode === 'desktop' ? '11px' : '14px',
                                            }}>
                                                {
                                                    state.selectedValue === "text" &&
                                                    <div className="preview_message__header_text">{state.text}</div>
                                                }
                                                {
                                                    state.selectedValue === "image" &&
                                                    <div className="preview_header_image">
                                                        {state.previewImage && (
                                                            <img
                                                                src={state.previewImage.url}
                                                                style={{ maxWidth: '100%', minHeight: '124px' }} alt="Preview"

                                                            />
                                                        )}
                                                    </div>
                                                }
                                                {
                                                    state.selectedValue === "video" &&
                                                    <div className="preview_header_video">
                                                        {
                                                            state.videoPreview && (
                                                                <video
                                                                    src={state.videoPreview.url}
                                                                    controls
                                                                    style={{ width: '100%', maxHeight: '100%' }}
                                                                    alt="Preview Video"
                                                                />
                                                            )
                                                        }
                                                    </div>
                                                }
                                                {
                                                    state.selectedValue === "document" &&
                                                    <div className="preview_header_doc">
                                                        {
                                                            state.documentPreview && (
                                                                <object
                                                                    data={state.documentPreview.url}
                                                                    title="Document Preview"
                                                                ></object>
                                                            )
                                                        }
                                                    </div>
                                                }
                                                {/* {isFocused && (
                <div>{textareaContent}</div>
            )} */}
                                                {state.isFocused && (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: smsTemplateData.content
                                                                .replace(/\*(.*?)\*/g, "<b>$1</b>")
                                                                .replace(/(.*?)/g, "<i>$1</i>")
                                                                .replace(/~(.*?)~/g, "<s>$1</s>"),
                                                        }}
                                                    />
                                                )}
                                                <div>
                                                    {
                                                        state.firstAddButtonContent.map((_, index) => (
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
                                                    {state.secondAddButtonContent.map((_, index) => (
                                                        <div key={index} className="preview_message_secondbtn_reply"></div>
                                                    ))}
                                                </div>
                                                {/* footertext */}
                                                <div>{state.footerText}</div>


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