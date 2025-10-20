import React, { useState } from 'react'
import { Grid, Slider } from '@mui/material';
import NewTemplate from '../Broadcast/NewTemplate';
import AddKeywordModalComponent from './PopupModal/KeywordAction/AddKeywordModalComponent';
import Nextstep from './Nextstep';
import ButtonComponent from '../ButtonComponent';
import SearchboxComponent from '../SearchboxComponent';
import CustomPagination from '../CustomPagination';
import TableComponent from '../TableComponent';
import DeleteModal from '../DeleteModal'
import { ArrowBackIcon } from '../Icon';
import style from '../MuiStyles/muiStyle';


const columns = [
  { id: "keywords", label: "Keyword" },
  { id: "triggered", label: "Triggered" },
  { id: "matchingMethod", label: "Matching method" },
  { id: "replyMaterial", label: "Reply material" },

];
const initialData = [
  {
    id: 1,
    keywords: ["charge", "charging", "charger", "charge car", "charge vehicle", "battery", "empty battery", "ev charge"],
    triggered: 16,
    matchingMethod: "Fuzzy matching (80%)",
    replyMaterial: ["Chatbots: Charging"]
  },
  {
    id: 2,
    keywords: [
      "hy", "hey", "Hello", "Hey", "Hi", "i want to book a ride", "i want a cab",
      "car", "book", "ca hire", "EV", "Vehicle", "Electric vehicle", "car rental",
      "transport", "electric", "van", "tuk", "tuk tuk", "boda", "boda boda",
    ],
    triggered: 1397,
    matchingMethod: "Exact matching",
    replyMaterial: ["Templates: welcome_text"]
  },
  {
    id: 3,
    keywords: [
      "charge owner", "charge point owner", "charging owner", "charging point owner", "own a charge point", "get charge point", "become a charge point owner", "charge for others", "charger for other", "charging for others", "boss charge", "charge point boss"
    ],
    triggered: 0,
    matchingMethod: 'Fuzzy matching (80%)',
    replyMaterial: ['Chatbots: Chargepoint owner ship']
  },
  {
    id: 4,
    keywords: [
      "fleet", "fleet owner", "fleet ownership", "own a fleet", "own cars", "group cars", "fleet boss", "boss of a fleet", "corporate fleet"
    ],
    triggered: 3,
    matchingMethod: "Fuzzy matching  (90%)",
    replyMaterial: ['Chatbots: Fleet_ownership']
  },
  {
    id: 5,
    keywords: ["investor", "investiment", "invest car", "investor boss", "become investor", "investiment", "make an investiment", "make investiment", "other investiment", "do invest", "do investiment", "investment", "invest"],
    triggered: 5,
    matchingMethod: "Fuzzy matching  (89%)",
    replyMaterial: ["Chatbots: Investors"]
  },
  {
    id: 6,
    keywords: ["driver",
      "become a driver",
      "take people",
      "drive car",
      "driver others",
      "driver someone",
      "driving",
      "get a driver",
      "join driver",
      "drive many people"],
    triggered: 4,
    matchingMethod: 'Fuzzy matching (90%)',
    replyMaterial: ['Chatbots: Become a driver']
  },
  {
    id: 7,
    keywords: ["agent",
      "become an agent",
      "enroll to an agent",
      "agent driving",
      "agent drive",
      "register an agent",
      "regester an agent",
      "agent registration",
      "agent banking"],
    triggered: 22,
    matchingMethod: "Fuzzy matching (80%)",
    replyMaterial: ["Chatbots: Agent enrollment"]
  },
  {
    id: 8,
    keywords: ['Book a Ride', 'Ride'],
    triggered: 681,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: rides-flow']
  },
  {
    id: 9,
    keywords: ['EV Charging'],
    triggered: 60,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: Charging']
  },
  {
    id: 10,
    keywords: ['Other Option', 'More Options/Help', 'More Options'],
    triggered: '141',
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: Other_Options'],
  },
  {
    id: 11,
    keywords: ['0', 'O', 'o', 'Zero', 'ZERO', 'zero', 'zERO'],
    triggered: 2,
    matchingMethod: 'Exact matching',
    replyMaterial: []

  },
  {
    id: 12,
    keywords: ["HELP",
      "Help",
      "help",
      "hELP",
      "HElp",
      "heLP",
      "helP",
      "hELP",
      "HELp",
      "hELp",
      "HelP",
      "Emergency",
      "emergency",
      "EMERGENCY"],
    triggered: 15,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Templates: emergency_update']
  },
  {
    id: 13,
    keywords: ["Yes , wait for agent",
      "Yes, wait for agent",
      "Yes , wait for Agent",
      "Yes, wait for Agent"],
    triggered: 3,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Send Notification: send message to jeho', 'Assign to User: first-response']
  },
  {
    id: 14,
    keywords: ['Proceed with Payment', 'Change Pay Method', 'Try Again'],
    triggered: 84,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: payment_process']
  },
  {
    id: 15,
    keywords: ['reschedule', 'Reschedule', 'RESCHEDULE', 're-schedule', 'Re-schedule', 'RE-SCHEDULE'],
    triggered: 17,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: reschedule_order']
  },
  {
    id: 16,
    keywords: ['CANCEL', 'cancel', 'Cancel', 'Cancell', 'cancell', 'CANCELL'],
    triggered: 117,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: cancel_order']
  },
  {
    id: 17,
    keywords: ['Confirm Order', 'confirm order', 'confirmed'],
    triggered: 106,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Text: confirmed order']
  },
  {
    id: 18,
    keywords: ['Rate Us Now'],
    triggered: 17,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: ratings']
  },
  {
    id: 19,
    keywords: ['Rate Us Later'],
    triggered: 18,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Text: Rating']
  },
  {
    id: 20,
    keywords: ['PAY NOW', 'pay now', 'pay', 'pay for service', 'payment', 'PAY', 'Pay'],
    triggered: 59,
    matchingMethod: 'Exact matching',
    replyMaterial: ['Chatbots: payment_process']
  }
]

const buttonData = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M3.07347 13.7954L3.80365 13.6242L3.07347 13.7954ZM3.07347 8.20456L3.80365 8.37584L3.07347 8.20456ZM18.9265 8.20457L18.1964 8.37584L18.9265 8.20457ZM18.9265 13.7954L19.6567 13.9667L18.9265 13.7954ZM13.7954 18.9265L13.6242 18.1963L13.7954 18.9265ZM8.20457 18.9265L8.03329 19.6567L8.20457 18.9265ZM8.20456 3.07347L8.37584 3.80365L8.20456 3.07347ZM13.7954 3.07347L13.6242 3.80365L13.7954 3.07347ZM10.25 13.8607C10.25 14.275 10.5858 14.6107 11 14.6107C11.4142 14.6107 11.75 14.275 11.75 13.8607H10.25ZM8.13925 7.38925C7.72504 7.38925 7.38925 7.72504 7.38925 8.13925C7.38925 8.55346 7.72504 8.88925 8.13925 8.88925V7.38925ZM13.8608 8.88925C14.275 8.88925 14.6108 8.55346 14.6108 8.13925C14.6108 7.72504 14.275 7.38925 13.8608 7.38925V8.88925ZM3.80365 13.6242C3.39878 11.8981 3.39878 10.1019 3.80365 8.37584L2.34329 8.03328C1.88557 9.98461 1.88557 12.0154 2.34329 13.9667L3.80365 13.6242ZM18.1964 8.37584C18.6012 10.1019 18.6012 11.8981 18.1964 13.6242L19.6567 13.9667C20.1144 12.0154 20.1144 9.98461 19.6567 8.03329L18.1964 8.37584ZM13.6242 18.1963C11.8981 18.6012 10.1019 18.6012 8.37584 18.1963L8.03329 19.6567C9.98461 20.1144 12.0154 20.1144 13.9667 19.6567L13.6242 18.1963ZM8.37584 3.80365C10.1019 3.39878 11.8981 3.39878 13.6242 3.80365L13.9667 2.34329C12.0154 1.88557 9.98461 1.88557 8.03329 2.34329L8.37584 3.80365ZM8.37584 18.1963C6.10719 17.6642 4.33581 15.8928 3.80365 13.6242L2.34329 13.9667C3.00555 16.79 5.21 18.9945 8.03329 19.6567L8.37584 18.1963ZM13.9667 19.6567C16.79 18.9945 18.9945 16.79 19.6567 13.9667L18.1964 13.6242C17.6642 15.8928 15.8928 17.6642 13.6242 18.1963L13.9667 19.6567ZM13.6242 3.80365C15.8928 4.3358 17.6642 6.10719 18.1964 8.37584L19.6567 8.03329C18.9945 5.21 16.79 3.00554 13.9667 2.34329L13.6242 3.80365ZM8.03329 2.34329C5.20999 3.00554 3.00555 5.20999 2.34329 8.03328L3.80365 8.37584C4.33581 6.10719 6.10719 4.3358 8.37584 3.80365L8.03329 2.34329ZM10.25 8.13925V13.8607H11.75V8.13925H10.25ZM11 7.38925H8.13925V8.88925H11V7.38925ZM11 8.88925H13.8608V7.38925H11V8.88925Z"></path>
      </svg>
    ),
    name: "Text",
    value: 'Text'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-linecap="round" stroke-width="1.5" stroke="#666666" d="M8.25 8.25H11.9167M8.25 13.75H11M8.25 11H13.75"></path>
        <path stroke-width="1.5" stroke="#666666" d="M3.07347 8.20456C3.67068 5.65859 5.65859 3.67067 8.20456 3.07347C10.0432 2.64218 11.9568 2.64218 13.7954 3.07347C16.3414 3.67067 18.3293 5.65859 18.9265 8.20457C19.3578 10.0432 19.3578 11.9568 18.9265 13.7954C18.3293 16.3414 16.3414 18.3293 13.7954 18.9265C11.9568 19.3578 10.0432 19.3578 8.20457 18.9265C5.65859 18.3293 3.67068 16.3414 3.07347 13.7954C2.64218 11.9568 2.64218 10.0432 3.07347 8.20456Z"></path>
      </svg>
    ),
    name: "Document",
    value: 'Document'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <rect stroke-width="1.5" stroke="#666666" rx="1.83333" height="3.66667" width="3.66667" y="6.41699" x="11.917"></rect>
        <path fill="#666666" d="M3.07347 13.7954L2.34329 13.9667L3.07347 13.7954ZM3.07347 8.20456L2.34329 8.03328L3.07347 8.20456ZM18.9265 8.20457L18.1964 8.37584L18.9265 8.20457ZM18.9265 13.7954L18.1964 13.6242L18.9265 13.7954ZM13.7954 18.9265L13.6242 18.1963L13.7954 18.9265ZM8.20457 18.9265L8.37584 18.1963L8.20457 18.9265ZM8.20456 3.07347L8.37584 3.80365L8.20456 3.07347ZM13.7954 3.07347L13.6242 3.80365L13.7954 3.07347ZM3.79459 15.2376C3.50169 15.5305 3.50169 16.0054 3.79459 16.2982C4.08748 16.5911 4.56235 16.5911 4.85525 16.2982L3.79459 15.2376ZM5.9189 14.1739L5.38857 13.6436L5.9189 14.1739ZM11.3132 14.1739L10.7829 14.7043H10.7829L11.3132 14.1739ZM13.5528 15.1223L14.0832 15.6526L13.5528 15.1223ZM14.7608 18.6822C15.0537 18.9751 15.5286 18.9751 15.8215 18.6822C16.1143 18.3893 16.1143 17.9144 15.8215 17.6215L14.7608 18.6822ZM17.7734 15.3137L17.1972 15.7938L17.7734 15.3137ZM17.5757 16.2481C17.8409 16.5663 18.3138 16.6093 18.632 16.3441C18.9502 16.0789 18.9932 15.606 18.728 15.2878L17.5757 16.2481ZM3.80365 13.6242C3.39878 11.8981 3.39878 10.1019 3.80365 8.37584L2.34329 8.03328C1.88557 9.98461 1.88557 12.0154 2.34329 13.9667L3.80365 13.6242ZM18.1964 8.37584C18.6012 10.1019 18.6012 11.8981 18.1964 13.6242L19.6567 13.9667C20.1144 12.0154 20.1144 9.98461 19.6567 8.03329L18.1964 8.37584ZM13.6242 18.1963C11.8981 18.6012 10.1019 18.6012 8.37584 18.1963L8.03329 19.6567C9.98461 20.1144 12.0154 20.1144 13.9667 19.6567L13.6242 18.1963ZM8.37584 3.80365C10.1019 3.39878 11.8981 3.39878 13.6242 3.80365L13.9667 2.34329C12.0154 1.88557 9.98461 1.88557 8.03329 2.34329L8.37584 3.80365ZM8.37584 18.1963C6.10719 17.6642 4.33581 15.8928 3.80365 13.6242L2.34329 13.9667C3.00555 16.79 5.21 18.9945 8.03329 19.6567L8.37584 18.1963ZM13.9667 19.6567C16.79 18.9945 18.9945 16.79 19.6567 13.9667L18.1964 13.6242C17.6642 15.8928 15.8928 17.6642 13.6242 18.1963L13.9667 19.6567ZM13.6242 3.80365C15.8928 4.3358 17.6642 6.10719 18.1964 8.37584L19.6567 8.03329C18.9945 5.21 16.79 3.00554 13.9667 2.34329L13.6242 3.80365ZM8.03329 2.34329C5.20999 3.00554 3.00555 5.20999 2.34329 8.03328L3.80365 8.37584C4.33581 6.10719 6.10719 4.3358 8.37584 3.80365L8.03329 2.34329ZM4.85525 16.2982L6.44923 14.7043L5.38857 13.6436L3.79459 15.2376L4.85525 16.2982ZM10.7829 14.7043L12.3768 16.2982L13.4375 15.2376L11.8435 13.6436L10.7829 14.7043ZM13.4375 16.2982L14.0832 15.6526L13.0225 14.5919L12.3768 15.2376L13.4375 16.2982ZM12.3768 16.2982L14.7608 18.6822L15.8215 17.6215L13.4375 15.2376L12.3768 16.2982ZM17.1972 15.7938L17.5757 16.2481L18.728 15.2878L18.3495 14.8336L17.1972 15.7938ZM14.0832 15.6526C14.9608 14.7749 16.4026 14.8403 17.1972 15.7938L18.3495 14.8336C16.9903 13.2025 14.5238 13.0906 13.0225 14.5919L14.0832 15.6526ZM6.44923 14.7043C7.64593 13.5076 9.58615 13.5076 10.7829 14.7043L11.8435 13.6436C10.061 11.8611 7.17105 11.8611 5.38857 13.6436L6.44923 14.7043Z"></path>
      </svg>
    ),
    name: 'Image',
    value: 'Image'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.5" stroke="#666666" d="M2.69912 7.59383C3.04134 6.07289 4.2211 4.87558 5.74464 4.50301C7.82149 3.99514 10.0151 4.00095 12.092 4.50882C13.5964 4.87671 14.7918 6.04398 15.1703 7.53624L15.1932 7.62658C15.7549 9.84093 15.7549 12.1591 15.1932 14.3734L15.1703 14.4638C14.7918 15.956 13.5964 17.1233 12.092 17.4912C10.0151 17.9991 7.82149 18.0049 5.74465 17.497C4.2211 17.1244 3.04134 15.9271 2.69912 14.4062L2.64261 14.155C2.17512 12.0773 2.17512 9.9227 2.64261 7.84497L2.69912 7.59383Z"></path>
        <path stroke-width="1.5" stroke="#666666" d="M15.275 14.0327L15.4556 14.0924C15.5025 14.108 15.5483 14.1268 15.5926 14.1488L17.1361 14.9154C18.318 15.5023 19.7087 14.6487 19.7087 13.3362L19.7087 8.99262C19.7087 7.60585 18.1729 6.7604 16.9889 7.49539L15.6271 8.34082C15.56 8.38248 15.4978 8.43157 15.4419 8.48715L15.3915 8.53715C15.7236 10.3563 15.6847 12.2252 15.275 14.0327Z"></path>
      </svg>
    ),
    name: 'Video',
    value: 'Video'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M3.07347 13.5774L3.80288 13.4029L3.07347 13.5774ZM3.07347 8.09689L3.80288 8.27144L3.07347 8.09689ZM18.9265 8.0969L18.1971 8.27144L18.9265 8.0969ZM18.9265 13.5774L18.1971 13.4029L18.9265 13.5774ZM13.7954 18.6072L13.6274 17.8763L13.7954 18.6072ZM8.20457 18.6072L8.0365 19.3382L8.20457 18.6072ZM8.20456 3.06709L8.37263 3.79801L8.20456 3.06709ZM13.7954 3.06709L13.6274 3.79801L13.7954 3.06709ZM3.80288 13.4029C3.39904 11.7152 3.39904 9.95907 3.80288 8.27144L2.34406 7.92235C1.88531 9.83947 1.88531 11.8348 2.34406 13.752L3.80288 13.4029ZM18.1971 8.27144C18.601 9.95907 18.601 11.7152 18.1971 13.4029L19.6559 13.752C20.1147 11.8348 20.1147 9.83947 19.6559 7.92236L18.1971 8.27144ZM13.6274 17.8763C11.8993 18.2736 10.1007 18.2736 8.37263 17.8763L8.0365 19.3382C9.98577 19.7864 12.0142 19.7864 13.9635 19.3382L13.6274 17.8763ZM8.37263 3.79801C10.1007 3.40066 11.8993 3.40066 13.6274 3.79801L13.9635 2.33616C12.0142 1.88795 9.98577 1.88795 8.0365 2.33616L8.37263 3.79801ZM8.37263 17.8763C6.09787 17.3532 4.33229 15.6153 3.80288 13.4029L2.34406 13.752C3.00906 16.531 5.21932 18.6904 8.0365 19.3382L8.37263 17.8763ZM13.9635 19.3382C16.7807 18.6904 18.9909 16.531 19.6559 13.752L18.1971 13.4029C17.6677 15.6153 15.9021 17.3532 13.6274 17.8763L13.9635 19.3382ZM13.6274 3.79801C15.9021 4.32107 17.6677 6.05903 18.1971 8.27144L19.6559 7.92236C18.9909 5.14333 16.7807 2.98394 13.9635 2.33616L13.6274 3.79801ZM8.0365 2.33616C5.21932 2.98394 3.00906 5.14332 2.34406 7.92235L3.80288 8.27144C4.33229 6.05903 6.09787 4.32107 8.37263 3.79801L8.0365 2.33616ZM13.6572 19.25C13.6572 17.9064 13.6588 16.9757 13.7549 16.2749C13.8479 15.5971 14.0163 15.2471 14.2701 14.9984L13.22 13.9272C12.6359 14.4998 12.3854 15.2215 12.2689 16.071C12.1555 16.8975 12.1572 17.9497 12.1572 19.25H13.6572ZM18.6287 12.8914C17.3009 12.8914 16.2311 12.8899 15.3917 13.0005C14.5322 13.1138 13.8021 13.3566 13.22 13.9272L14.2701 14.9984C14.5259 14.7476 14.8891 14.5797 15.5876 14.4877C16.3063 14.393 17.2593 14.3914 18.6287 14.3914V12.8914Z"></path>
      </svg>
    ),
    name: "Sticker",
    value: 'Sticker'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M3.07347 13.7954L2.34329 13.9667L3.07347 13.7954ZM3.07347 8.20456L2.34329 8.03328L3.07347 8.20456ZM18.9265 8.20457L18.1964 8.37584L18.9265 8.20457ZM18.9265 13.7954L18.1964 13.6242L18.9265 13.7954ZM13.7954 18.9265L13.6242 18.1964H13.6242L13.7954 18.9265ZM8.20457 18.9265L8.37584 18.1964L8.20457 18.9265ZM8.20456 3.07347L8.37584 3.80365L8.20456 3.07347ZM13.7954 3.07347L13.6242 3.80365L13.7954 3.07347ZM7.38925 13.8608C7.38925 14.275 7.72504 14.6108 8.13925 14.6108C8.55346 14.6108 8.88925 14.275 8.88925 13.8608H7.38925ZM8.88925 10.0464C8.88925 9.6322 8.55346 9.29642 8.13925 9.29642C7.72504 9.29642 7.38925 9.6322 7.38925 10.0464H8.88925ZM13.1107 13.8608C13.1107 14.275 13.4465 14.6108 13.8607 14.6108C14.275 14.6108 14.6107 14.275 14.6107 13.8608H13.1107ZM14.6107 11C14.6107 10.5858 14.275 10.25 13.8607 10.25C13.4465 10.25 13.1107 10.5858 13.1107 11H14.6107ZM10.25 12.9072C10.25 13.3214 10.5858 13.6572 11 13.6572C11.4142 13.6572 11.75 13.3214 11.75 12.9072H10.25ZM11.75 8.13925C11.75 7.72504 11.4142 7.38925 11 7.38925C10.5858 7.38925 10.25 7.72504 10.25 8.13925H11.75ZM3.80365 13.6242C3.39878 11.8981 3.39878 10.1019 3.80365 8.37584L2.34329 8.03328C1.88557 9.98461 1.88557 12.0154 2.34329 13.9667L3.80365 13.6242ZM18.1964 8.37584C18.6012 10.1019 18.6012 11.8981 18.1964 13.6242L19.6567 13.9667C20.1144 12.0154 20.1144 9.98461 19.6567 8.03329L18.1964 8.37584ZM13.6242 18.1964C11.8981 18.6012 10.1019 18.6012 8.37584 18.1964L8.03329 19.6567C9.98461 20.1144 12.0154 20.1144 13.9667 19.6567L13.6242 18.1964ZM8.37584 3.80365C10.1019 3.39878 11.8981 3.39878 13.6242 3.80365L13.9667 2.34329C12.0154 1.88557 9.98461 1.88557 8.03329 2.34329L8.37584 3.80365ZM8.37584 18.1964C6.10719 17.6642 4.33581 15.8928 3.80365 13.6242L2.34329 13.9667C3.00555 16.79 5.21 18.9945 8.03329 19.6567L8.37584 18.1964ZM13.9667 19.6567C16.79 18.9945 18.9945 16.79 19.6567 13.9667L18.1964 13.6242C17.6642 15.8928 15.8928 17.6642 13.6242 18.1964L13.9667 19.6567ZM13.6242 3.80365C15.8928 4.3358 17.6642 6.10719 18.1964 8.37584L19.6567 8.03329C18.9945 5.21 16.79 3.00554 13.9667 2.34329L13.6242 3.80365ZM8.03329 2.34329C5.20999 3.00554 3.00555 5.20999 2.34329 8.03328L3.80365 8.37584C4.33581 6.10719 6.10719 4.3358 8.37584 3.80365L8.03329 2.34329ZM8.88925 13.8608V10.0464H7.38925V13.8608H8.88925ZM14.6107 13.8608V11H13.1107V13.8608H14.6107ZM11.75 12.9072V8.13925H10.25V12.9072H11.75Z"></path>
      </svg>
    ),
    name: "Chatbots",
    value: 'Chatbots'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="20" width="20">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M3.33301 17.5003V11.667"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M3.33301 8.33333V2.5"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M10 17.5V10"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M10 6.66667V2.5"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M16.667 17.4997V13.333"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M16.667 10V2.5"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M0.833008 11.667H5.83301"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M7.5 6.66699H12.5"></path>
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.66667" stroke="#666666" d="M14.167 13.333H19.167"></path>
      </svg>
    ),
    name: "Sequences",
    value: 'Sequences'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 23" height="23" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M4.58301 17.6243C4.58301 15.4123 6.13889 13.5282 8.25338 13.1796L8.44384 13.1482C10.137 12.869 11.8623 12.869 13.5555 13.1482L13.746 13.1796C15.8605 13.5282 17.4163 15.4123 17.4163 17.6243C17.4163 18.5804 16.6661 19.3555 15.7406 19.3555H6.25879C5.33328 19.3555 4.58301 18.5804 4.58301 17.6243Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M14.7427 6.46484C14.7427 8.45825 13.0669 10.0742 10.9997 10.0742C8.93246 10.0742 7.25664 8.45825 7.25664 6.46484C7.25664 4.47144 8.93246 2.85547 10.9997 2.85547C13.0669 2.85547 14.7427 4.47144 14.7427 6.46484Z"></path>
      </svg>
    ),
    name: "Contact Attributes",
    value: 'Contact'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.125" stroke="#666666" d="M3.37133 8.13925H18.6287M11 8.61604L11 18.6287M3.07347 13.7954C2.64218 11.9568 2.64218 10.0432 3.07347 8.20456C3.67068 5.65859 5.65859 3.67067 8.20456 3.07347C10.0432 2.64218 11.9568 2.64218 13.7954 3.07347C16.3414 3.67067 18.3293 5.65859 18.9265 8.20457C19.3578 10.0432 19.3578 11.9568 18.9265 13.7954C18.3293 16.3414 16.3414 18.3293 13.7954 18.9265C11.9568 19.3578 10.0432 19.3578 8.20457 18.9265C5.65859 18.3293 3.67068 16.3414 3.07347 13.7954Z"></path>
      </svg>
    ),
    name: 'Templates',
    value: 'Templates'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M5.52548 7.91321L6.18905 8.093V8.093L5.52548 7.91321ZM9.31185 3.94371L9.09985 3.28971V3.28971L9.31185 3.94371ZM5.48439 8.06487L4.82081 7.88507H4.82081L5.48439 8.06487ZM5.3071 11.7952L5.98474 11.6791H5.98474L5.3071 11.7952ZM5.32773 11.9156L4.65009 12.0317H4.65009L5.32773 11.9156ZM5.76362 16.0024L5.90086 15.3287L5.76362 16.0024ZM6.10059 16.071L6.23783 15.3974L6.23783 15.3974L6.10059 16.071ZM15.8994 16.071L15.7622 15.3974V15.3974L15.8994 16.071ZM16.2364 16.0024L16.3736 16.6761L16.2364 16.0024ZM16.6762 11.8925L17.3539 12.0086V12.0086L16.6762 11.8925ZM16.6981 11.7647L16.0205 11.6487V11.6487L16.6981 11.7647ZM16.5382 8.09072L15.8732 8.26519V8.26519L16.5382 8.09072ZM16.481 7.87265L17.146 7.69818V7.69818L16.481 7.87265ZM12.8031 3.94934L13.0187 3.29653H13.0187L12.8031 3.94934ZM16.8236 12.1924L16.4879 12.7923L16.8236 12.1924ZM5.19564 12.1818L4.8664 11.5782L5.19564 12.1818ZM11.6875 2.75C11.6875 2.3703 11.3797 2.0625 11 2.0625C10.6203 2.0625 10.3125 2.3703 10.3125 2.75H11.6875ZM10.3125 3.67101C10.3125 4.05071 10.6203 4.35851 11 4.35851C11.3797 4.35851 11.6875 4.05071 11.6875 3.67101H10.3125ZM8.25834 16.4114L8.33515 15.7282L7.5126 15.6358L7.57266 16.4613L8.25834 16.4114ZM13.7417 16.4114L14.4273 16.4613L14.4874 15.6358L13.6648 15.7282L13.7417 16.4114ZM13.6585 16.9374L14.3261 17.1016V17.1016L13.6585 16.9374ZM13.5833 17.243L12.9157 17.0789L13.5833 17.243ZM11.6452 19.1739L11.8052 19.8425L11.8052 19.8425L11.6452 19.1739ZM10.3548 19.1739L10.1948 19.8425H10.1948L10.3548 19.1739ZM8.41667 17.243L7.74906 17.4072L8.41667 17.243ZM8.34153 16.9374L9.00915 16.7733L9.00915 16.7733L8.34153 16.9374ZM6.18905 8.093C6.63598 6.44353 7.90214 5.12339 9.52384 4.59771L9.09985 3.28971C7.03955 3.95756 5.43124 5.63215 4.86191 7.73341L6.18905 8.093ZM6.14796 8.24467L6.18905 8.093L4.86191 7.73341L4.82081 7.88507L6.14796 8.24467ZM5.98474 11.6791C5.78902 10.536 5.84474 9.36376 6.14796 8.24467L4.82081 7.88507C4.46534 9.19703 4.40003 10.5712 4.62946 11.9112L5.98474 11.6791ZM6.00537 11.7996L5.98474 11.6791L4.62946 11.9112L4.65009 12.0317L6.00537 11.7996ZM4.8125 13.9887C4.8125 13.4687 5.10019 13.017 5.52488 12.7853L4.8664 11.5782C4.01568 12.0423 3.4375 12.948 3.4375 13.9887H4.8125ZM5.90086 15.3287C5.26986 15.2002 4.8125 14.6415 4.8125 13.9887H3.4375C3.4375 15.2907 4.35064 16.4162 5.62639 16.6761L5.90086 15.3287ZM6.23783 15.3974L5.90086 15.3287L5.62639 16.6761L5.96335 16.7447L6.23783 15.3974ZM15.7622 15.3974C12.6194 16.0376 9.38064 16.0376 6.23783 15.3974L5.96335 16.7447C9.28729 17.4219 12.7127 17.4219 16.0367 16.7447L15.7622 15.3974ZM16.0991 15.3287L15.7622 15.3974L16.0367 16.7447L16.3736 16.6761L16.0991 15.3287ZM17.1875 13.9887C17.1875 14.6415 16.7301 15.2002 16.0991 15.3287L16.3736 16.6761C17.6494 16.4162 18.5625 15.2907 18.5625 13.9887H17.1875ZM16.4879 12.7923C16.9056 13.0261 17.1875 13.474 17.1875 13.9887H18.5625C18.5625 12.9585 17.9959 12.0605 17.1593 11.5924L16.4879 12.7923ZM16.0205 11.6487L15.9986 11.7765L17.3539 12.0086L17.3757 11.8808L16.0205 11.6487ZM15.8732 8.26519C16.1629 9.36939 16.2132 10.5233 16.0205 11.6487L17.3757 11.8808C17.6015 10.5621 17.5427 9.21012 17.2032 7.91625L15.8732 8.26519ZM15.816 8.04712L15.8732 8.26519L17.2032 7.91625L17.146 7.69818L15.816 8.04712ZM12.5875 4.60216C14.1737 5.126 15.3896 6.42193 15.816 8.04712L17.146 7.69818C16.602 5.62461 15.0493 3.96714 13.0187 3.29653L12.5875 4.60216ZM9.52384 4.59771C10.5178 4.2755 11.5984 4.27549 12.5875 4.60216L13.0187 3.29653C11.749 2.87716 10.3688 2.87837 9.09985 3.28971L9.52384 4.59771ZM17.1593 11.5924C17.2907 11.6659 17.3855 11.8239 17.3539 12.0086L15.9986 11.7765C15.9257 12.2021 16.1439 12.5999 16.4879 12.7923L17.1593 11.5924ZM4.65009 12.0317C4.61614 11.8334 4.71819 11.6591 4.8664 11.5782L5.52488 12.7853C5.86364 12.6005 6.07607 12.2126 6.00537 11.7996L4.65009 12.0317ZM10.3125 2.75V3.67101H11.6875V2.75H10.3125ZM8.18154 17.0946C10.0546 17.3052 11.9454 17.3052 13.8185 17.0946L13.6648 15.7282C11.8938 15.9274 10.1062 15.9274 8.33515 15.7282L8.18154 17.0946ZM14.3261 17.1016C14.3778 16.8913 14.4116 16.6771 14.4273 16.4613L13.056 16.3616C13.0459 16.5003 13.0241 16.638 12.9909 16.7733L14.3261 17.1016ZM14.2509 17.4072L14.3261 17.1016L12.9909 16.7733L12.9157 17.0789L14.2509 17.4072ZM11.8052 19.8425C13.0116 19.5539 13.9544 18.6131 14.2509 17.4072L12.9157 17.0789C12.7414 17.7876 12.1884 18.337 11.4853 18.5053L11.8052 19.8425ZM10.1948 19.8425C10.7242 19.9692 11.2758 19.9692 11.8052 19.8425L11.4853 18.5053C11.1662 18.5816 10.8338 18.5816 10.5147 18.5053L10.1948 19.8425ZM7.74906 17.4072C8.04559 18.6131 8.98837 19.5539 10.1948 19.8425L10.5147 18.5053C9.81156 18.337 9.25857 17.7876 9.08428 17.0789L7.74906 17.4072ZM7.67392 17.1016L7.74906 17.4072L9.08428 17.0789L9.00915 16.7733L7.67392 17.1016ZM7.57266 16.4613C7.58835 16.6771 7.6222 16.8913 7.67392 17.1016L9.00915 16.7733C8.97589 16.638 8.95412 16.5003 8.94403 16.3616L7.57266 16.4613Z"></path>
      </svg>
    ),
    name: 'Send Notification',
    value: 'SendNotification'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M4.58301 17.5188C4.58301 15.3068 6.13889 13.4227 8.25338 13.0741L8.44384 13.0427C10.137 12.7635 11.8623 12.7635 13.5555 13.0427L13.746 13.0741C15.8605 13.4227 17.4163 15.3068 17.4163 17.5188C17.4163 18.4749 16.6661 19.25 15.7406 19.25H6.25879C5.33328 19.25 4.58301 18.4749 4.58301 17.5188Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M14.7427 6.35938C14.7427 8.35278 13.0669 9.96875 10.9997 9.96875C8.93246 9.96875 7.25664 8.35278 7.25664 6.35938C7.25664 4.36597 8.93246 2.75 10.9997 2.75C13.0669 2.75 14.7427 4.36597 14.7427 6.35938Z"></path>
      </svg>
    ),
    name: 'Assign to User',
    value: 'AssigntoUser'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M2.75 16.8973C2.75 15.0619 4.08361 13.4986 5.89603 13.2093L6.05929 13.1833C7.51058 12.9517 8.98942 12.9517 10.4407 13.1833L10.604 13.2093C12.4164 13.4986 13.75 15.0619 13.75 16.8973C13.75 17.6906 13.1069 18.3337 12.3136 18.3337H4.18639C3.39309 18.3337 2.75 17.6906 2.75 16.8973Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M11.4583 6.87533C11.4583 8.64724 10.0219 10.0837 8.25 10.0837C6.47809 10.0837 5.04167 8.64724 5.04167 6.87533C5.04167 5.10341 6.47809 3.66699 8.25 3.66699C10.0219 3.66699 11.4583 5.10341 11.4583 6.87533Z"></path>
        <path stroke-linecap="round" stroke-width="1.375" stroke="#666666" d="M13.75 10.0837C15.5219 10.0837 16.9583 8.64724 16.9583 6.87533C16.9583 5.10341 15.5219 3.66699 13.75 3.66699M15.9407 18.3337H17.8136C18.6069 18.3337 19.25 17.6906 19.25 16.8973C19.25 15.0619 17.9164 13.4986 16.104 13.2093V13.2093C15.9953 13.192 15.8852 13.1833 15.7752 13.1833C15.4821 13.1833 15.391 13.1833 14.8877 13.1833"></path>
      </svg>
    ),
    name: 'Assign to Team',
    value: 'AssigntoTeam'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#23A455" d="M7.7986 6.33756C8.10982 5.02631 9.28844 4.0509 10.6949 4.0509C12.1013 4.0509 13.2799 5.02631 13.5912 6.33756H7.7986ZM6.39255 6.33756C6.72324 4.25933 8.52356 2.6709 10.6949 2.6709C12.8662 2.6709 14.6665 4.25933 14.9972 6.33756H17.1116C18.5051 6.33756 19.6349 7.4673 19.6349 8.8609V17.1109C19.6349 18.5045 18.5051 19.6342 17.1116 19.6342H4.27822C2.88462 19.6342 1.75488 18.5045 1.75488 17.1109V8.8609C1.75488 7.4673 2.88462 6.33756 4.27822 6.33756H6.39255ZM3.13488 8.8609C3.13488 8.22945 3.64677 7.71757 4.27822 7.71757H17.1116C17.743 7.71757 18.2549 8.22945 18.2549 8.8609V17.1109C18.2549 17.7423 17.743 18.2542 17.1116 18.2542H4.27822C3.64677 18.2542 3.13488 17.7423 3.13488 17.1109V8.8609Z" clip-rule="evenodd" fill-rule="evenodd"></path>
      </svg>
    ),
    name: 'Catalog',
    value: 'Catalog'
  }
]

const InitialLoadingData = 'Text'
const KeywordAction = () => {

  const [state, setState] = useState({
    // search keywords
    searchKeyword: '',
    rowIndexToDelete: null,
    //deletemodal state 
    isOpenDeleteModal: false,
    //editpage 
    isOpenEditPage: false,
    selectedRadioMethod: '',
    selectedEditRow: null,
    hasChanges: false,
    editSliderValue: 80,
    // addkeywordmodal --> editpage
    addKeywordInput: '',
    addKeywordOpenModal: false,
    //Addpage
    isAddOpenPage: false,
    addSelectedRadioMethod: 'Fuzzy matching',
    //addkeywordmodal--> add page
    addKeyword: '',
    keywordList: [],
    nextStepModal: false,
    //new Template --> template
    isOpenYourTemplate: false,
    showError: false,
    sliderValue: 80,
    //table and pagination 
    data: initialData,
    page: 0,
    rowsPerPage: 5,

  });

  const [isMaterialCheckedEdit, setIsMaterialCheckedEdit] = useState({
    Text: [],
    Document: [],
    Image: [],
    Video: [],
    Sticker: [],
    Chatbots: [],
    Sequences: [],
    Contact: [],
    Templates: [],
    SendNotification: [],
    AssigntoUser: [],
    AssigntoTeam: [],

  });

  const [isMaterialCheckedAdd, setIsMaterialCheckedAdd] = useState({
    Text: [],
    Document: [],
    Image: [],
    Video: [],
    Sticker: [],
    Chatbots: [],
    Sequences: [],
    Contact: [],
    Template: [],
    SendNotification: [],
    AssigntoUser: [],
    AssigntoTeam: []
  });


  //handle nextstep checkbox

  const handleCheckboxToggle = (title, type) => {
    if (state.isOpenEditPage) {
      setIsMaterialCheckedEdit(prev => {
        const currentSelections = prev[type] || [];
        if (currentSelections.includes(title)) {
          return { ...prev, [type]: currentSelections.filter(item => item !== title) };
        } else {
          return { ...prev, [type]: [...currentSelections, title] };
        }
      });
    } else if (state.isAddOpenPage) {
      setIsMaterialCheckedAdd(prev => {
        const currentSelections = prev[type] || [];
        if (currentSelections.includes(title)) {
          return { ...prev, [type]: currentSelections.filter(item => item !== title) };
        } else {
          return { ...prev, [type]: [...currentSelections, title] };
        }
      });
    }
  };

  const handleInputChange = (e) => {
    setState(prev => ({
      ...prev,
      addKeyword: e.target.value,
    }));
  };

  //addkeywordmodal-->editpage
  const handleKeywordInputChange = (e) => {
    setState(prev => ({
      ...prev,
      addKeywordInput: e.target.value,
      hasChanges: true,
    }));
  };

  // const filterKeywords = data.filter(row => row.keywords.some(keyword => keyword.toLowerCase().includes(searchKeyword.toLowerCase())))

  //addkeywordmodal --> close

  const handleCloseKeyword = () => {
    setState(prev => ({
      ...prev,
      addKeywordOpenModal: false,
    }));
  };
  //addpage--open
  const handleAddOpenPage = () => {
    setState(prev => ({
      ...prev,
      isAddOpenPage: true,
      isOpenEditPage: false,
    }));
    setIsMaterialCheckedAdd({});
  };

  //add page-->addkeyword modal
  const handleAddKeywordList = () => {
    if (state.addKeyword.trim()) {
      setState(prev => ({
        ...prev,
        addKeyword: '',
        keywordList: [...prev.keywordList, prev.addKeyword.trim()],
        addKeywordOpenModal: false,
        showError: false,
      }));
    }
  };

  //delete modal 
  const handleDeleteOpenModal = (index) => {
    setState(prev => ({
      ...prev,
      rowIndexToDelete: index,
      isOpenDeleteModal: true,
    }));
  };

  const handleDeleteCloseModal = () => {
    setState(prev => ({
      ...prev,
      rowIndexToDelete: null,
      isOpenDeleteModal: false,
    }));
  };

  const handleDeleteConfirm = () => {
    if (state.rowIndexToDelete !== null) {
      setState(prev => ({
        ...prev,
        data: prev.data.filter((_, index) => index !== prev.rowIndexToDelete),
        rowIndexToDelete: null,
        isOpenDeleteModal: false,
      }));
    }
  };

  //open and close edit page
  const handleEditOpenPage = (row) => {
    setIsMaterialCheckedEdit({});

    const method = row.matchingMethod;
    let selectedRadioMethod = '';
    let editSliderValue = 0;

    if (method.startsWith('Fuzzy matching')) {
      const percentage = parseInt(method.match(/\d+/)[0], 10);
      selectedRadioMethod = 'Fuzzy matching';
      editSliderValue = percentage;
    } else {
      selectedRadioMethod = method;
      editSliderValue = 0;
    }

    setState(prev => ({
      ...prev,
      selectedEditRow: row,
      isAddOpenPage: false,
      isOpenEditPage: true,
      selectedRadioMethod,
      editSliderValue,
    }));
  };

  const handleEditClosePage = () => {
    setState(prev => ({
      ...prev,
      selectedEditRow: null,
      isOpenEditPage: false,
      isAddOpenPage: false,
    }));
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    setState(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleChangeRowPerPage = (event) => {
    setState(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    }));
  };


  // const paginatedData = filterKeywords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  //edit page --> remove keywords 
  const handleRemoveKeyword = (keywordToRemove) => {
    const updatedKeywords = state.selectedEditRow.keywords.filter(
      (keyword) => keyword !== keywordToRemove
    );

    setState(prev => ({
      ...prev,
      selectedEditRow: {
        ...prev.selectedEditRow,
        keywords: updatedKeywords,
      },
      hasChanges: true,
    }));
  };

  //edit page -->handleradiomethod
  const handleRadioMethodSelection = (method) => {
    setState(prev => ({
      ...prev,
      selectedRadioMethod: method,
      hasChanges: true,
    }));
  };

  //add page --> handleradiomethod
  const handleAddRadioMethodSelection = (method) => {
    setState(prev => ({
      ...prev,
      addSelectedRadioMethod: method,
    }));
  };

  const handleAddKeyword = () => {
    setState(prev => ({
      ...prev,
      addKeywordOpenModal: true,
      hasChanges: true,
    }));
  };


  const handleRemoveAddKeyword = (index) => {
    const newKeywords = [...state.keywordList];
    newKeywords.splice(index, 1);

    setState(prev => ({
      ...prev,
      keywordList: newKeywords,
    }));
  };

  // addkeyword to editlist
  const handleAddkeywordToEditlist = () => {
    if (state.addKeywordInput.trim()) {
      const updatedKeywords = [
        ...state.selectedEditRow.keywords,
        state.addKeywordInput.trim()
      ];

      setState(prev => ({
        ...prev,
        selectedEditRow: {
          ...prev.selectedEditRow,
          keywords: updatedKeywords,
        },
        addKeywordInput: '',
        hasChanges: true,
        addKeywordOpenModal: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        addKeywordOpenModal: false,
      }));
    }
  };


  //editpage --savechanges
  const handleSaveChanges = () => {
    if (state.selectedEditRow) {
      const updatedRow = {
        ...state.selectedEditRow,
        matchingMethod:
          state.selectedRadioMethod === 'Fuzzy matching'
            ? `${state.selectedRadioMethod} (${state.editSliderValue}%)`
            : state.selectedRadioMethod,
      };

      const rowExists = state.data.some(row => row.id === updatedRow.id);
      const updatedData = rowExists
        ? state.data.map((row) =>
          row.id === updatedRow.id ? updatedRow : row
        )
        : [...state.data, updatedRow];

      setState(prev => ({
        ...prev,
        data: updatedData,
        isOpenEditPage: false,
        hasChanges: false,
      }));
    }
  };

  const handleNextStepModal = () => {
    if (state.isAddOpenPage) {
      if (state.keywordList.length === 0) {
        setState(prev => ({
          ...prev,
          showError: true,
        }));
      } else {
        console.log("Keywords:", state.keywordList);
        console.log("Selected Matching Method:", state.addSelectedRadioMethod);

        setState(prev => ({
          ...prev,
          showError: false,
          nextStepModal: true,
        }));
      }
    }

    if (state.isOpenEditPage) {
      setState(prev => ({
        ...prev,
        nextStepModal: true,
      }));
    }
  };


  const handleBackbtnNextStepModal = () => {
    setState(prev => ({
      ...prev,
      nextStepModal: false,
      isAddOpenPage: prev.isAddOpenPage,
      isOpenEditPage: !prev.isAddOpenPage,
    }));
  };

  const handleCancelBtn = () => {
    setState(prev => ({
      ...prev,
      nextStepModal: false,
      isAddOpenPage: false,
      isOpenEditPage: false,
    }));
  };


  // const handleSaveBtn=()=>{
  //   // console.log("Keywords:", keywordList);
  //   // console.log("Selected Matching Method:", addSelectedRadioMethod);
  //   // console.log("Checked Materials:", isMaterialChecked);
  //  if(isMaterialChecked.length>0){

  //   const matchingMethod =
  //   addSelectedRadioMethod === 'Fuzzy matching'
  //     ? `Fuzzy matching (${sliderValue}%)`
  //     : addSelectedRadioMethod;
  //   const newEntry = {
  //     keywords: keywordList, 
  //     triggered: 0, 
  //     matchingMethod: matchingMethod,
  //     replyMaterial: isMaterialChecked
  //   };
  //   setData((prevData) => [...prevData, newEntry]);
  //   setNextStepModal(false);
  //   setAddOpenPage(false);
  //  }
  // }

  const handleSaveBtn = () => {
    const isValidAdd = state.isAddOpenPage && state.isMaterialCheckedAdd && Object.keys(state.isMaterialCheckedAdd).length > 0;
    const isValidEdit = state.isOpenEditPage && state.isMaterialCheckedEdit && Object.keys(state.isMaterialCheckedEdit).length > 0;

    if (isValidAdd || isValidEdit) {
      let matchingMethod;
      let newEntry;

      if (state.isAddOpenPage) {
        matchingMethod =
          state.addSelectedRadioMethod === 'Fuzzy matching'
            ? `Fuzzy matching (${state.sliderValue}%)`
            : state.addSelectedRadioMethod;

        const replyMaterial = Object.entries(state.isMaterialCheckedAdd).flatMap(([type, items]) =>
          items.map(item => `${type}: ${item}`)
        );

        newEntry = {
          keywords: state.keywordList,
          triggered: 0,
          matchingMethod,
          replyMaterial
        };

        setState(prev => ({
          ...prev,
          data: [...prev.data, newEntry],
          nextStepModal: false,
          isAddOpenPage: false,
          isOpenEditPage: false,
        }));
      } else if (state.isOpenEditPage) {
        matchingMethod =
          state.selectedRadioMethod === 'Fuzzy matching'
            ? `${state.selectedRadioMethod} (${state.editSliderValue}%)`
            : state.selectedRadioMethod;

        const existingEntry = state.data.find(entry =>
          JSON.stringify(entry.keywords) === JSON.stringify(state.selectedEditRow.keywords)
        );
        const existingReplyMaterial = existingEntry ? existingEntry.replyMaterial : [];

        const replyMaterial = [
          ...existingReplyMaterial,
          ...Object.entries(state.isMaterialCheckedEdit).flatMap(([type, items]) =>
            items.map(item => `${type}: ${item}`)
          )
        ];

        newEntry = {
          keywords: state.selectedEditRow.keywords,
          triggered: state.selectedEditRow.triggered || 0,
          matchingMethod,
          replyMaterial: Array.from(new Set(replyMaterial))
        };

        const updatedData = state.data.map(entry =>
          JSON.stringify(entry.keywords) === JSON.stringify(state.selectedEditRow.keywords)
            ? newEntry
            : entry
        );

        setState(prev => ({
          ...prev,
          data: updatedData,
          nextStepModal: false,
          isAddOpenPage: false,
          isOpenEditPage: false,
        }));
      }
    }
  };

  // const handleSaveBtn = () => {

  //   if (
  //     (isAddOpenPage && isMaterialCheckedAdd && Object.keys(isMaterialCheckedAdd).length > 0) ||
  //     (isOpenEditPage && isMaterialCheckedEdit && Object.keys(isMaterialCheckedEdit).length > 0)
  //   ) {
  //     let matchingMethod;
  //     let newEntry;

  //     if (isAddOpenPage) {
  //       matchingMethod =
  //         addSelectedRadioMethod === 'Fuzzy matching'
  //           ? `Fuzzy matching (${sliderValue}%)`
  //           : addSelectedRadioMethod;

  //       const replyMaterial = Object.entries(isMaterialCheckedAdd).flatMap(([type, items]) =>
  //         items.map(item => `${type}: ${item}`)
  //       );

  //       newEntry = {
  //         keywords: keywordList,
  //         triggered: 0,
  //         matchingMethod: matchingMethod,
  //         replyMaterial: replyMaterial
  //       };

  //       console.log("replyMaterial:", newEntry.replyMaterial);
  //       setData((prevData) => [...prevData, newEntry]);
  //     } else if (isOpenEditPage) {
  //       matchingMethod =
  //         selectedRadioMethod === 'Fuzzy matching'
  //           ? `${selectedRadioMethod} (${editSliderValue}%)`
  //           : selectedRadioMethod;

  //       // Get existing replyMaterial for the selected row
  //       const existingEntry = data.find(entry => entry.keywords === selectedEditRow.keywords);
  //       const existingReplyMaterial = existingEntry ? existingEntry.replyMaterial : [];

  //       const replyMaterial = [
  //         ...existingReplyMaterial,
  //         ...Object.entries(isMaterialCheckedEdit).flatMap(([type, items]) =>
  //           items.map(item => `${type}: ${item}`)
  //         )
  //       ];

  //       newEntry = {
  //         keywords: selectedEditRow.keywords,
  //         triggered: selectedEditRow.triggered || 0,
  //         matchingMethod: matchingMethod,
  //         replyMaterial: Array.from(new Set(replyMaterial))
  //       };

  //       setData((prevData) =>
  //         prevData.map((entry) =>
  //           entry.keywords === selectedEditRow.keywords ? newEntry : entry
  //         )
  //       );
  //     }

  //     setNextStepModal(false);
  //     setAddOpenPage(false);
  //     setOpenEditPage(false);
  //   }
  // };

  const handleSliderChange = (event, newValue) => {
    setState(prev => ({
      ...prev,
      sliderValue: newValue,
    }));
  };

  const handleDeleteMaterial = (material) => {
    if (state.selectedEditRow) {
      const updatedMaterials = state.selectedEditRow.replyMaterial.filter((m) => m !== material);

      setState(prev => ({
        ...prev,
        selectedEditRow: {
          ...prev.selectedEditRow,
          replyMaterial: updatedMaterials,
        },
      }));
    }
  };


  const customRenderCell = (row, column) => {
    if (column.id === "keywords") {
      return row.keywords.map((keyword, i) => (
        <div key={i} className="keywordaction_keywords">{keyword}</div>
      ));
    }

    if (column.id === "replyMaterial") {
      return row.replyMaterial.map((reply, i) => (
        <div key={i} className="keywordaction_replymaterial">{reply}</div>
      ));
    }

    if (column.id === "triggered") {
      return <span>{row.triggered}</span>;
    }


    return row[column.id];
  };

  return (
    <>
      {
        state.isOpenDeleteModal && (<DeleteModal show={state.isOpenDeleteModal} onClose={handleDeleteCloseModal}
          onConfirm={handleDeleteConfirm} msg='Do you want to remove this keyword action?' />)
      }

      <div className='keyword_action_container'>

        {
          state.isOpenYourTemplate ? (
            // <NewTemplate />
            <div> hy </div>
          )
            : state.nextStepModal ? (
              <>
                <div className='keyword_editor'>
                  <div className='editor_btn_container' onClick={handleBackbtnNextStepModal}>
                    <ArrowBackIcon />
                    <ButtonComponent label='Back' customBtn='generation_backbutton keyword_backbtn' />

                  </div>
                  <div className='status_container'>
                    <div>
                      <Grid container className='status_grid_container'>
                        <Grid item xs={4}>
                          <div className='status__step status__step1'>
                            <div className='status__check-circle'>
                              <svg className='ticksvg' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckIcon"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                            </div>
                            <div class="check__circle__label">Trigger Keyword</div>
                          </div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className='status__divider'></div>
                        </Grid>
                        <Grid item xs={4}>
                          <div className='status__step status__step2'>
                            <div className='status_check_circle check_circle_active'>2</div>
                            <div className='check__circle__label'>Reply Action</div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>

                  <Nextstep
                    buttonData={buttonData}
                    InitialLoadingData={InitialLoadingData}
                    isOpenEditPage={state.isOpenEditPage}
                    selectedEditRow={state.selectedEditRow}
                    isMaterialCheckedEdit={isMaterialCheckedEdit}
                    isMaterialCheckedAdd={isMaterialCheckedAdd}
                    handleDeleteMaterial={handleDeleteMaterial}
                    handleCheckboxToggle={handleCheckboxToggle}
                    handleCancelBtn={handleCancelBtn}
                    handleSaveBtn={handleSaveBtn}
                    isAddOpenPage={state.isAddOpenPage}
                    showCheckboxes={true}
                    setIsOpenYourTemplate={(value) =>
                      setState((prev) => ({ ...prev, isOpenYourTemplate: value }))
                    }
                  />
                </div>
              </>
            )
              : state.isAddOpenPage ? (
                <>
                  <div className='keyword_editor'>
                    <div className='editor_btn_container' onClick={handleEditClosePage}>
                      <ArrowBackIcon />
                      <ButtonComponent label='Back' customBtn='generation_backbutton keyword_backbtn' />

                    </div>
                    <div className='status_container'>
                      <div>
                        <Grid container className='status_grid_container'>
                          <Grid item xs={4}>
                            <div className='status_step status_step1'>
                              <div className='status_check_circle check_circle_active'>1</div>
                              <div className='status_check_circle_label'>Trigger Keyword</div>
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            <div className='status__divider'></div>
                          </Grid>
                          <Grid item xs={4}>
                            <div className='status_step status_step2'>
                              <div className='status_check_circle check_circle_disable'>2</div>
                              <div className='status_check_circle_label'>Reply Action</div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <div className='editor__container'>
                      <div>
                        <div className='keyword_edit_cont'>
                          <div className='keyword_title'>
                            <div>Keywords(s)</div>
                            <div>:</div>
                          </div>
                          <div className='keyword__list'>
                            {
                              state.keywordList.map((addkey, index) => (
                                <button key={index} className='custom_chip'>
                                  <span className='custom_chip_label'>{addkey}</span>
                                  <svg className="custom_chip_delete_icon" focusable="false" onClick={() => handleRemoveAddKeyword(index)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                </button>
                              ))

                            }

                          </div>
                          <ButtonComponent label='Add Keyword +' onClick={handleAddKeyword} customBtn='keyword__add__btn' />

                        </div>
                      </div>
                      <div>
                        <div className='matchkeword__container'>
                          <div className='match__title'>Message matching methods:</div>

                          <div className='match__methods'>
                            <div className='match__method__fuzzy'>
                              <button type="button" className={`match__radio ${state.addSelectedRadioMethod === 'Fuzzy matching' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('Fuzzy matching')}><i class="match__radio__style"></i><span>Fuzzy matching</span></button>
                            </div>
                            <button type="button" className={`match__radio ${state.addSelectedRadioMethod === 'Exact matching' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('Exact matching')}><i class="match__radio__style"></i><span>Exact matching</span></button>
                            <button type="button" className={`match__radio ${state.addSelectedRadioMethod === 'Contains' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('Contains')}><i class="match__radio__style"></i><span>Contains</span></button>
                          </div>

                          {state.addSelectedRadioMethod === 'Fuzzy matching' && (
                            <div className='match__slider'>
                              <div className='slider__mark'>0%</div>

                              <Slider
                                defaultValue={80}
                                value={state.sliderValue}
                                onChange={handleSliderChange}
                                sx={style.keywordSlider}
                                valueLabelDisplay="on"
                              />
                              <div className='slider__mark'>100%</div>
                            </div>
                          )
                          }

                        </div>

                      </div>
                      <div>
                        {
                          state.showError && (
                            <Grid container style={{ padding: '10px' }}>
                              <Grid item xs={4} />
                              <Grid item xs={4}>
                                {/* Error Message */}
                                <div className="error__msg">
                                  <div className="content">
                                    <div className="header">Please add a keyword first.</div>
                                  </div>
                                </div>
                              </Grid>
                              <Grid item xs={4} />
                            </Grid>
                          )
                        }

                        <div className='keyword__edit__footer'></div>
                        <ButtonComponent label='Next step' onClick={handleNextStepModal} />
                        <ButtonComponent
                          label="Save Changes"
                          disabled={true}
                          customBtn={`save__changes__btn ${true ? 'disabled' : ''}`}
                        />

                      </div>
                    </div>
                    {
                      state.addKeywordOpenModal && (
                        <>
                          <AddKeywordModalComponent
                            show={state.addKeywordOpenModal}
                            onClose={handleCloseKeyword}
                            inputValue={state.addKeyword}
                            onInputChange={handleInputChange}
                            onAddClick={handleAddKeywordList}
                          />

                        </>
                      )
                    }

                  </div>

                </>
              ) :

                state.isOpenEditPage ? (
                  <div className='keyword_editor'>
                    <div className='editor_btn_container' onClick={handleEditClosePage}>
                      <ArrowBackIcon />
                      <ButtonComponent label='Back' customBtn='generation_backbutton keyword_backbtn' />
                    </div>
                    <div className='status_container'>
                      <div>
                        <Grid container className='status_grid_container'>
                          <Grid item xs={4}>
                            <div className='status_step status_step1'>
                              <div className='status_check_circle check_circle_active'>1</div>
                              <div className='status_check_circle_label'>Trigger Keyword</div>
                            </div>
                          </Grid>
                          <Grid item xs={4}>
                            <div className='status__divider'></div>
                          </Grid>
                          <Grid item xs={4}>
                            <div className='status_step status_step2'>
                              <div className='status_check_circle check_circle_disable'>2</div>
                              <div className='status_check_circle_label'>Reply Action</div>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                    <div className='editor__container'>
                      <div>
                        <div className='keyword_edit_cont'>
                          <div className='keyword_title'>
                            <div>Keywords(s)</div>
                            <div>:</div>
                          </div>
                          <div className='keyword__list'>
                            {state.selectedEditRow.keywords.map((keyword, index) => (
                              <button key={index} className='custom_chip'>
                                <span className='custom_chip_label'>{keyword}</span>
                                <svg className="custom_chip_delete_icon" onClick={() => handleRemoveKeyword(keyword)} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                              </button>
                            ))

                            }

                          </div>
                          <ButtonComponent label='Add Keyword +' onClick={handleAddKeyword} customBtn='keyword__add__btn' />

                        </div>
                      </div>
                      <div>
                        <div className='matchkeword__container'>
                          <div className='match__title'>Message matching methods:</div>

                          <div className='match__methods'>
                            <div className='match__method__fuzzy'>
                              <button type="button" className={`match__radio ${state.selectedRadioMethod === 'Fuzzy matching' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('Fuzzy matching')}><i class="match__radio__style"></i><span>Fuzzy matching</span></button>
                            </div>
                            <button type="button" className={`match__radio ${state.selectedRadioMethod === 'Exact matching' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('Exact matching')}><i class="match__radio__style"></i><span>Exact matching</span></button>
                            <button type="button" className={`match__radio ${state.selectedRadioMethod === 'Contains' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('Contains')}><i class="match__radio__style"></i><span>Contains</span></button>
                          </div>

                          {state.selectedRadioMethod === 'Fuzzy matching' && (
                            <div className='match__slider'>
                              <div className='slider__mark'>0%</div>

                              <Slider
                                value={state.editSliderValue}
                                onChange={(e, newValue) => setState(prev => ({ ...prev, editSliderValue: newValue }))}
                                defaultValue={80}
                                sx={style.keywordSlider}
                                valueLabelDisplay="on"
                              />
                              <div className='slider__mark'>100%</div>
                            </div>
                          )
                          }

                        </div>
                      </div>
                      <div>
                        <div className='keyword__edit__footer'></div>
                        <ButtonComponent label='Next step' onClick={handleNextStepModal} />
                        <ButtonComponent
                          label="Save Changes"
                          onClick={handleSaveChanges}
                          disabled={!state.hasChanges}
                          customBtn={`save__changes__btn ${!state.hasChanges ? 'disabled' : ''}`}
                        />

                      </div>
                    </div>
                    {
                      state.addKeywordOpenModal && (
                        <>
                          <AddKeywordModalComponent
                            show={state.addKeywordOpenModal}
                            onClose={handleCloseKeyword}
                            inputValue={state.addKeywordInput}
                            onInputChange={handleKeywordInputChange}
                            onAddClick={handleAddkeywordToEditlist}
                          />

                        </>
                      )
                    }
                  </div>
                )
                  : (
                    <>
                      <div className='header__bar'>
                        <div className='add__keyword__action'>
                          <a href="https://www.youtube.com/watch?v=vTUPzLQbK5I" target="_blank" className='note-watch-tutorial'><div class="watch-tutorial-content"><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="13.5" cy="13.5" r="13.5" fill="#269CFE"></circle><path d="M17.8691 12.6344C18.5358 13.0193 18.5358 13.9815 17.8691 14.3664L12.0648 17.7176C11.3981 18.1025 10.5648 17.6214 10.5648 16.8516L10.5648 10.1493C10.5648 9.37948 11.3981 8.89836 12.0648 9.28326L17.8691 12.6344Z" fill="white"></path></svg><span class="watch-tutorial__text">Watch Tutorial</span></div></a>
                          <ButtonComponent label='Add Keyword action' onClick={handleAddOpenPage} />

                        </div>
                        <div className='header__text'>
                          <h1 className='header__title'>Add Keyword Action List</h1>
                          <strong>Note: </strong>
                          <span>When the message matches the keyword, automatically reply</span>
                        </div>
                        <div className='header__search'>
                          <div className='search__input'>
                            <SearchboxComponent value={state.searchKeyword} onChange={(e) => setState((prev) => ({ ...prev, searchKeyword: e.target.value }))} customSearch='custom__search_box' placeholder='Search...' />
                          </div>
                        </div>
                      </div>
                      <div className='keyword__body__content'>
                        <div className='keyword__list__table'>
                          <TableComponent
                            columns={columns}
                            data={state.data}
                            customRenderCell={customRenderCell}
                            onEdit={(index) => handleEditOpenPage(state.data[index])}
                            onDelete={handleDeleteOpenModal}
                            actionHeaderLabel="Actions"
                            customStyle={{
                              headerCell: { fontWeight: '400', fontSize: '17px', padding: '35px 20px' },
                            }}
                          />

                          <div className='keyword__pagination'>
                            <CustomPagination
                              count={state.data.length}
                              rowsPerPage={state.rowsPerPage}
                              page={state.page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowPerPage}
                            />

                          </div>
                        </div>
                      </div> </>)
        }

      </div>
    </>
  )
}
export default KeywordAction;