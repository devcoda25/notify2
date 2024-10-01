import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Grid, Slider } from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import CancelIcon from '@mui/icons-material/Cancel'


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
      "delivery", "courier", "cargo", "pick up", "drop off", "drop", "rental",
      "transfer", "evzone", "ev ride", "airport", "yo", "ye", "abeeno", "motoka",
      "ambulance", "eyo", "waguan", "yoyo", "hullo", "yello", "elo", "helo",
      "hel", "ello", "hulo", "Hi EV zone", "Home", "HOME", "home", "Start Again"
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
    name: "Text"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-linecap="round" stroke-width="1.5" stroke="#666666" d="M8.25 8.25H11.9167M8.25 13.75H11M8.25 11H13.75"></path>
        <path stroke-width="1.5" stroke="#666666" d="M3.07347 8.20456C3.67068 5.65859 5.65859 3.67067 8.20456 3.07347C10.0432 2.64218 11.9568 2.64218 13.7954 3.07347C16.3414 3.67067 18.3293 5.65859 18.9265 8.20457C19.3578 10.0432 19.3578 11.9568 18.9265 13.7954C18.3293 16.3414 16.3414 18.3293 13.7954 18.9265C11.9568 19.3578 10.0432 19.3578 8.20457 18.9265C5.65859 18.3293 3.67068 16.3414 3.07347 13.7954C2.64218 11.9568 2.64218 10.0432 3.07347 8.20456Z"></path>
      </svg>
    ),
    name: "Document"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <rect stroke-width="1.5" stroke="#666666" rx="1.83333" height="3.66667" width="3.66667" y="6.41699" x="11.917"></rect>
        <path fill="#666666" d="M3.07347 13.7954L2.34329 13.9667L3.07347 13.7954ZM3.07347 8.20456L2.34329 8.03328L3.07347 8.20456ZM18.9265 8.20457L18.1964 8.37584L18.9265 8.20457ZM18.9265 13.7954L18.1964 13.6242L18.9265 13.7954ZM13.7954 18.9265L13.6242 18.1963L13.7954 18.9265ZM8.20457 18.9265L8.37584 18.1963L8.20457 18.9265ZM8.20456 3.07347L8.37584 3.80365L8.20456 3.07347ZM13.7954 3.07347L13.6242 3.80365L13.7954 3.07347ZM3.79459 15.2376C3.50169 15.5305 3.50169 16.0054 3.79459 16.2982C4.08748 16.5911 4.56235 16.5911 4.85525 16.2982L3.79459 15.2376ZM5.9189 14.1739L5.38857 13.6436L5.9189 14.1739ZM11.3132 14.1739L10.7829 14.7043H10.7829L11.3132 14.1739ZM13.5528 15.1223L14.0832 15.6526L13.5528 15.1223ZM14.7608 18.6822C15.0537 18.9751 15.5286 18.9751 15.8215 18.6822C16.1143 18.3893 16.1143 17.9144 15.8215 17.6215L14.7608 18.6822ZM17.7734 15.3137L17.1972 15.7938L17.7734 15.3137ZM17.5757 16.2481C17.8409 16.5663 18.3138 16.6093 18.632 16.3441C18.9502 16.0789 18.9932 15.606 18.728 15.2878L17.5757 16.2481ZM3.80365 13.6242C3.39878 11.8981 3.39878 10.1019 3.80365 8.37584L2.34329 8.03328C1.88557 9.98461 1.88557 12.0154 2.34329 13.9667L3.80365 13.6242ZM18.1964 8.37584C18.6012 10.1019 18.6012 11.8981 18.1964 13.6242L19.6567 13.9667C20.1144 12.0154 20.1144 9.98461 19.6567 8.03329L18.1964 8.37584ZM13.6242 18.1963C11.8981 18.6012 10.1019 18.6012 8.37584 18.1963L8.03329 19.6567C9.98461 20.1144 12.0154 20.1144 13.9667 19.6567L13.6242 18.1963ZM8.37584 3.80365C10.1019 3.39878 11.8981 3.39878 13.6242 3.80365L13.9667 2.34329C12.0154 1.88557 9.98461 1.88557 8.03329 2.34329L8.37584 3.80365ZM8.37584 18.1963C6.10719 17.6642 4.33581 15.8928 3.80365 13.6242L2.34329 13.9667C3.00555 16.79 5.21 18.9945 8.03329 19.6567L8.37584 18.1963ZM13.9667 19.6567C16.79 18.9945 18.9945 16.79 19.6567 13.9667L18.1964 13.6242C17.6642 15.8928 15.8928 17.6642 13.6242 18.1963L13.9667 19.6567ZM13.6242 3.80365C15.8928 4.3358 17.6642 6.10719 18.1964 8.37584L19.6567 8.03329C18.9945 5.21 16.79 3.00554 13.9667 2.34329L13.6242 3.80365ZM8.03329 2.34329C5.20999 3.00554 3.00555 5.20999 2.34329 8.03328L3.80365 8.37584C4.33581 6.10719 6.10719 4.3358 8.37584 3.80365L8.03329 2.34329ZM4.85525 16.2982L6.44923 14.7043L5.38857 13.6436L3.79459 15.2376L4.85525 16.2982ZM10.7829 14.7043L12.3768 16.2982L13.4375 15.2376L11.8435 13.6436L10.7829 14.7043ZM13.4375 16.2982L14.0832 15.6526L13.0225 14.5919L12.3768 15.2376L13.4375 16.2982ZM12.3768 16.2982L14.7608 18.6822L15.8215 17.6215L13.4375 15.2376L12.3768 16.2982ZM17.1972 15.7938L17.5757 16.2481L18.728 15.2878L18.3495 14.8336L17.1972 15.7938ZM14.0832 15.6526C14.9608 14.7749 16.4026 14.8403 17.1972 15.7938L18.3495 14.8336C16.9903 13.2025 14.5238 13.0906 13.0225 14.5919L14.0832 15.6526ZM6.44923 14.7043C7.64593 13.5076 9.58615 13.5076 10.7829 14.7043L11.8435 13.6436C10.061 11.8611 7.17105 11.8611 5.38857 13.6436L6.44923 14.7043Z"></path>
      </svg>
    ),
    name: 'Image'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.5" stroke="#666666" d="M2.69912 7.59383C3.04134 6.07289 4.2211 4.87558 5.74464 4.50301C7.82149 3.99514 10.0151 4.00095 12.092 4.50882C13.5964 4.87671 14.7918 6.04398 15.1703 7.53624L15.1932 7.62658C15.7549 9.84093 15.7549 12.1591 15.1932 14.3734L15.1703 14.4638C14.7918 15.956 13.5964 17.1233 12.092 17.4912C10.0151 17.9991 7.82149 18.0049 5.74465 17.497C4.2211 17.1244 3.04134 15.9271 2.69912 14.4062L2.64261 14.155C2.17512 12.0773 2.17512 9.9227 2.64261 7.84497L2.69912 7.59383Z"></path>
        <path stroke-width="1.5" stroke="#666666" d="M15.275 14.0327L15.4556 14.0924C15.5025 14.108 15.5483 14.1268 15.5926 14.1488L17.1361 14.9154C18.318 15.5023 19.7087 14.6487 19.7087 13.3362L19.7087 8.99262C19.7087 7.60585 18.1729 6.7604 16.9889 7.49539L15.6271 8.34082C15.56 8.38248 15.4978 8.43157 15.4419 8.48715L15.3915 8.53715C15.7236 10.3563 15.6847 12.2252 15.275 14.0327Z"></path>
      </svg>
    ),
    name: 'Video'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M3.07347 13.5774L3.80288 13.4029L3.07347 13.5774ZM3.07347 8.09689L3.80288 8.27144L3.07347 8.09689ZM18.9265 8.0969L18.1971 8.27144L18.9265 8.0969ZM18.9265 13.5774L18.1971 13.4029L18.9265 13.5774ZM13.7954 18.6072L13.6274 17.8763L13.7954 18.6072ZM8.20457 18.6072L8.0365 19.3382L8.20457 18.6072ZM8.20456 3.06709L8.37263 3.79801L8.20456 3.06709ZM13.7954 3.06709L13.6274 3.79801L13.7954 3.06709ZM3.80288 13.4029C3.39904 11.7152 3.39904 9.95907 3.80288 8.27144L2.34406 7.92235C1.88531 9.83947 1.88531 11.8348 2.34406 13.752L3.80288 13.4029ZM18.1971 8.27144C18.601 9.95907 18.601 11.7152 18.1971 13.4029L19.6559 13.752C20.1147 11.8348 20.1147 9.83947 19.6559 7.92236L18.1971 8.27144ZM13.6274 17.8763C11.8993 18.2736 10.1007 18.2736 8.37263 17.8763L8.0365 19.3382C9.98577 19.7864 12.0142 19.7864 13.9635 19.3382L13.6274 17.8763ZM8.37263 3.79801C10.1007 3.40066 11.8993 3.40066 13.6274 3.79801L13.9635 2.33616C12.0142 1.88795 9.98577 1.88795 8.0365 2.33616L8.37263 3.79801ZM8.37263 17.8763C6.09787 17.3532 4.33229 15.6153 3.80288 13.4029L2.34406 13.752C3.00906 16.531 5.21932 18.6904 8.0365 19.3382L8.37263 17.8763ZM13.9635 19.3382C16.7807 18.6904 18.9909 16.531 19.6559 13.752L18.1971 13.4029C17.6677 15.6153 15.9021 17.3532 13.6274 17.8763L13.9635 19.3382ZM13.6274 3.79801C15.9021 4.32107 17.6677 6.05903 18.1971 8.27144L19.6559 7.92236C18.9909 5.14333 16.7807 2.98394 13.9635 2.33616L13.6274 3.79801ZM8.0365 2.33616C5.21932 2.98394 3.00906 5.14332 2.34406 7.92235L3.80288 8.27144C4.33229 6.05903 6.09787 4.32107 8.37263 3.79801L8.0365 2.33616ZM13.6572 19.25C13.6572 17.9064 13.6588 16.9757 13.7549 16.2749C13.8479 15.5971 14.0163 15.2471 14.2701 14.9984L13.22 13.9272C12.6359 14.4998 12.3854 15.2215 12.2689 16.071C12.1555 16.8975 12.1572 17.9497 12.1572 19.25H13.6572ZM18.6287 12.8914C17.3009 12.8914 16.2311 12.8899 15.3917 13.0005C14.5322 13.1138 13.8021 13.3566 13.22 13.9272L14.2701 14.9984C14.5259 14.7476 14.8891 14.5797 15.5876 14.4877C16.3063 14.393 17.2593 14.3914 18.6287 14.3914V12.8914Z"></path>
      </svg>
    ),
    name: "Stickers"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M3.07347 13.7954L2.34329 13.9667L3.07347 13.7954ZM3.07347 8.20456L2.34329 8.03328L3.07347 8.20456ZM18.9265 8.20457L18.1964 8.37584L18.9265 8.20457ZM18.9265 13.7954L18.1964 13.6242L18.9265 13.7954ZM13.7954 18.9265L13.6242 18.1964H13.6242L13.7954 18.9265ZM8.20457 18.9265L8.37584 18.1964L8.20457 18.9265ZM8.20456 3.07347L8.37584 3.80365L8.20456 3.07347ZM13.7954 3.07347L13.6242 3.80365L13.7954 3.07347ZM7.38925 13.8608C7.38925 14.275 7.72504 14.6108 8.13925 14.6108C8.55346 14.6108 8.88925 14.275 8.88925 13.8608H7.38925ZM8.88925 10.0464C8.88925 9.6322 8.55346 9.29642 8.13925 9.29642C7.72504 9.29642 7.38925 9.6322 7.38925 10.0464H8.88925ZM13.1107 13.8608C13.1107 14.275 13.4465 14.6108 13.8607 14.6108C14.275 14.6108 14.6107 14.275 14.6107 13.8608H13.1107ZM14.6107 11C14.6107 10.5858 14.275 10.25 13.8607 10.25C13.4465 10.25 13.1107 10.5858 13.1107 11H14.6107ZM10.25 12.9072C10.25 13.3214 10.5858 13.6572 11 13.6572C11.4142 13.6572 11.75 13.3214 11.75 12.9072H10.25ZM11.75 8.13925C11.75 7.72504 11.4142 7.38925 11 7.38925C10.5858 7.38925 10.25 7.72504 10.25 8.13925H11.75ZM3.80365 13.6242C3.39878 11.8981 3.39878 10.1019 3.80365 8.37584L2.34329 8.03328C1.88557 9.98461 1.88557 12.0154 2.34329 13.9667L3.80365 13.6242ZM18.1964 8.37584C18.6012 10.1019 18.6012 11.8981 18.1964 13.6242L19.6567 13.9667C20.1144 12.0154 20.1144 9.98461 19.6567 8.03329L18.1964 8.37584ZM13.6242 18.1964C11.8981 18.6012 10.1019 18.6012 8.37584 18.1964L8.03329 19.6567C9.98461 20.1144 12.0154 20.1144 13.9667 19.6567L13.6242 18.1964ZM8.37584 3.80365C10.1019 3.39878 11.8981 3.39878 13.6242 3.80365L13.9667 2.34329C12.0154 1.88557 9.98461 1.88557 8.03329 2.34329L8.37584 3.80365ZM8.37584 18.1964C6.10719 17.6642 4.33581 15.8928 3.80365 13.6242L2.34329 13.9667C3.00555 16.79 5.21 18.9945 8.03329 19.6567L8.37584 18.1964ZM13.9667 19.6567C16.79 18.9945 18.9945 16.79 19.6567 13.9667L18.1964 13.6242C17.6642 15.8928 15.8928 17.6642 13.6242 18.1964L13.9667 19.6567ZM13.6242 3.80365C15.8928 4.3358 17.6642 6.10719 18.1964 8.37584L19.6567 8.03329C18.9945 5.21 16.79 3.00554 13.9667 2.34329L13.6242 3.80365ZM8.03329 2.34329C5.20999 3.00554 3.00555 5.20999 2.34329 8.03328L3.80365 8.37584C4.33581 6.10719 6.10719 4.3358 8.37584 3.80365L8.03329 2.34329ZM8.88925 13.8608V10.0464H7.38925V13.8608H8.88925ZM14.6107 13.8608V11H13.1107V13.8608H14.6107ZM11.75 12.9072V8.13925H10.25V12.9072H11.75Z"></path>
      </svg>
    ),
    name: "Chatbots"
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
    name: "Sequences"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 23" height="23" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M4.58301 17.6243C4.58301 15.4123 6.13889 13.5282 8.25338 13.1796L8.44384 13.1482C10.137 12.869 11.8623 12.869 13.5555 13.1482L13.746 13.1796C15.8605 13.5282 17.4163 15.4123 17.4163 17.6243C17.4163 18.5804 16.6661 19.3555 15.7406 19.3555H6.25879C5.33328 19.3555 4.58301 18.5804 4.58301 17.6243Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M14.7427 6.46484C14.7427 8.45825 13.0669 10.0742 10.9997 10.0742C8.93246 10.0742 7.25664 8.45825 7.25664 6.46484C7.25664 4.47144 8.93246 2.85547 10.9997 2.85547C13.0669 2.85547 14.7427 4.47144 14.7427 6.46484Z"></path>
      </svg>
    ),
    name: "Contact Attributes"
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.125" stroke="#666666" d="M3.37133 8.13925H18.6287M11 8.61604L11 18.6287M3.07347 13.7954C2.64218 11.9568 2.64218 10.0432 3.07347 8.20456C3.67068 5.65859 5.65859 3.67067 8.20456 3.07347C10.0432 2.64218 11.9568 2.64218 13.7954 3.07347C16.3414 3.67067 18.3293 5.65859 18.9265 8.20457C19.3578 10.0432 19.3578 11.9568 18.9265 13.7954C18.3293 16.3414 16.3414 18.3293 13.7954 18.9265C11.9568 19.3578 10.0432 19.3578 8.20457 18.9265C5.65859 18.3293 3.67068 16.3414 3.07347 13.7954Z"></path>
      </svg>
    ),
    name: 'Templates'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#666666" d="M5.52548 7.91321L6.18905 8.093V8.093L5.52548 7.91321ZM9.31185 3.94371L9.09985 3.28971V3.28971L9.31185 3.94371ZM5.48439 8.06487L4.82081 7.88507H4.82081L5.48439 8.06487ZM5.3071 11.7952L5.98474 11.6791H5.98474L5.3071 11.7952ZM5.32773 11.9156L4.65009 12.0317H4.65009L5.32773 11.9156ZM5.76362 16.0024L5.90086 15.3287L5.76362 16.0024ZM6.10059 16.071L6.23783 15.3974L6.23783 15.3974L6.10059 16.071ZM15.8994 16.071L15.7622 15.3974V15.3974L15.8994 16.071ZM16.2364 16.0024L16.3736 16.6761L16.2364 16.0024ZM16.6762 11.8925L17.3539 12.0086V12.0086L16.6762 11.8925ZM16.6981 11.7647L16.0205 11.6487V11.6487L16.6981 11.7647ZM16.5382 8.09072L15.8732 8.26519V8.26519L16.5382 8.09072ZM16.481 7.87265L17.146 7.69818V7.69818L16.481 7.87265ZM12.8031 3.94934L13.0187 3.29653H13.0187L12.8031 3.94934ZM16.8236 12.1924L16.4879 12.7923L16.8236 12.1924ZM5.19564 12.1818L4.8664 11.5782L5.19564 12.1818ZM11.6875 2.75C11.6875 2.3703 11.3797 2.0625 11 2.0625C10.6203 2.0625 10.3125 2.3703 10.3125 2.75H11.6875ZM10.3125 3.67101C10.3125 4.05071 10.6203 4.35851 11 4.35851C11.3797 4.35851 11.6875 4.05071 11.6875 3.67101H10.3125ZM8.25834 16.4114L8.33515 15.7282L7.5126 15.6358L7.57266 16.4613L8.25834 16.4114ZM13.7417 16.4114L14.4273 16.4613L14.4874 15.6358L13.6648 15.7282L13.7417 16.4114ZM13.6585 16.9374L14.3261 17.1016V17.1016L13.6585 16.9374ZM13.5833 17.243L12.9157 17.0789L13.5833 17.243ZM11.6452 19.1739L11.8052 19.8425L11.8052 19.8425L11.6452 19.1739ZM10.3548 19.1739L10.1948 19.8425H10.1948L10.3548 19.1739ZM8.41667 17.243L7.74906 17.4072L8.41667 17.243ZM8.34153 16.9374L9.00915 16.7733L9.00915 16.7733L8.34153 16.9374ZM6.18905 8.093C6.63598 6.44353 7.90214 5.12339 9.52384 4.59771L9.09985 3.28971C7.03955 3.95756 5.43124 5.63215 4.86191 7.73341L6.18905 8.093ZM6.14796 8.24467L6.18905 8.093L4.86191 7.73341L4.82081 7.88507L6.14796 8.24467ZM5.98474 11.6791C5.78902 10.536 5.84474 9.36376 6.14796 8.24467L4.82081 7.88507C4.46534 9.19703 4.40003 10.5712 4.62946 11.9112L5.98474 11.6791ZM6.00537 11.7996L5.98474 11.6791L4.62946 11.9112L4.65009 12.0317L6.00537 11.7996ZM4.8125 13.9887C4.8125 13.4687 5.10019 13.017 5.52488 12.7853L4.8664 11.5782C4.01568 12.0423 3.4375 12.948 3.4375 13.9887H4.8125ZM5.90086 15.3287C5.26986 15.2002 4.8125 14.6415 4.8125 13.9887H3.4375C3.4375 15.2907 4.35064 16.4162 5.62639 16.6761L5.90086 15.3287ZM6.23783 15.3974L5.90086 15.3287L5.62639 16.6761L5.96335 16.7447L6.23783 15.3974ZM15.7622 15.3974C12.6194 16.0376 9.38064 16.0376 6.23783 15.3974L5.96335 16.7447C9.28729 17.4219 12.7127 17.4219 16.0367 16.7447L15.7622 15.3974ZM16.0991 15.3287L15.7622 15.3974L16.0367 16.7447L16.3736 16.6761L16.0991 15.3287ZM17.1875 13.9887C17.1875 14.6415 16.7301 15.2002 16.0991 15.3287L16.3736 16.6761C17.6494 16.4162 18.5625 15.2907 18.5625 13.9887H17.1875ZM16.4879 12.7923C16.9056 13.0261 17.1875 13.474 17.1875 13.9887H18.5625C18.5625 12.9585 17.9959 12.0605 17.1593 11.5924L16.4879 12.7923ZM16.0205 11.6487L15.9986 11.7765L17.3539 12.0086L17.3757 11.8808L16.0205 11.6487ZM15.8732 8.26519C16.1629 9.36939 16.2132 10.5233 16.0205 11.6487L17.3757 11.8808C17.6015 10.5621 17.5427 9.21012 17.2032 7.91625L15.8732 8.26519ZM15.816 8.04712L15.8732 8.26519L17.2032 7.91625L17.146 7.69818L15.816 8.04712ZM12.5875 4.60216C14.1737 5.126 15.3896 6.42193 15.816 8.04712L17.146 7.69818C16.602 5.62461 15.0493 3.96714 13.0187 3.29653L12.5875 4.60216ZM9.52384 4.59771C10.5178 4.2755 11.5984 4.27549 12.5875 4.60216L13.0187 3.29653C11.749 2.87716 10.3688 2.87837 9.09985 3.28971L9.52384 4.59771ZM17.1593 11.5924C17.2907 11.6659 17.3855 11.8239 17.3539 12.0086L15.9986 11.7765C15.9257 12.2021 16.1439 12.5999 16.4879 12.7923L17.1593 11.5924ZM4.65009 12.0317C4.61614 11.8334 4.71819 11.6591 4.8664 11.5782L5.52488 12.7853C5.86364 12.6005 6.07607 12.2126 6.00537 11.7996L4.65009 12.0317ZM10.3125 2.75V3.67101H11.6875V2.75H10.3125ZM8.18154 17.0946C10.0546 17.3052 11.9454 17.3052 13.8185 17.0946L13.6648 15.7282C11.8938 15.9274 10.1062 15.9274 8.33515 15.7282L8.18154 17.0946ZM14.3261 17.1016C14.3778 16.8913 14.4116 16.6771 14.4273 16.4613L13.056 16.3616C13.0459 16.5003 13.0241 16.638 12.9909 16.7733L14.3261 17.1016ZM14.2509 17.4072L14.3261 17.1016L12.9909 16.7733L12.9157 17.0789L14.2509 17.4072ZM11.8052 19.8425C13.0116 19.5539 13.9544 18.6131 14.2509 17.4072L12.9157 17.0789C12.7414 17.7876 12.1884 18.337 11.4853 18.5053L11.8052 19.8425ZM10.1948 19.8425C10.7242 19.9692 11.2758 19.9692 11.8052 19.8425L11.4853 18.5053C11.1662 18.5816 10.8338 18.5816 10.5147 18.5053L10.1948 19.8425ZM7.74906 17.4072C8.04559 18.6131 8.98837 19.5539 10.1948 19.8425L10.5147 18.5053C9.81156 18.337 9.25857 17.7876 9.08428 17.0789L7.74906 17.4072ZM7.67392 17.1016L7.74906 17.4072L9.08428 17.0789L9.00915 16.7733L7.67392 17.1016ZM7.57266 16.4613C7.58835 16.6771 7.6222 16.8913 7.67392 17.1016L9.00915 16.7733C8.97589 16.638 8.95412 16.5003 8.94403 16.3616L7.57266 16.4613Z"></path>
      </svg>
    ),
    name: 'Send Notification'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M4.58301 17.5188C4.58301 15.3068 6.13889 13.4227 8.25338 13.0741L8.44384 13.0427C10.137 12.7635 11.8623 12.7635 13.5555 13.0427L13.746 13.0741C15.8605 13.4227 17.4163 15.3068 17.4163 17.5188C17.4163 18.4749 16.6661 19.25 15.7406 19.25H6.25879C5.33328 19.25 4.58301 18.4749 4.58301 17.5188Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M14.7427 6.35938C14.7427 8.35278 13.0669 9.96875 10.9997 9.96875C8.93246 9.96875 7.25664 8.35278 7.25664 6.35938C7.25664 4.36597 8.93246 2.75 10.9997 2.75C13.0669 2.75 14.7427 4.36597 14.7427 6.35938Z"></path>
      </svg>
    ),
    name: 'Assign to User'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path stroke-width="1.375" stroke="#666666" d="M2.75 16.8973C2.75 15.0619 4.08361 13.4986 5.89603 13.2093L6.05929 13.1833C7.51058 12.9517 8.98942 12.9517 10.4407 13.1833L10.604 13.2093C12.4164 13.4986 13.75 15.0619 13.75 16.8973C13.75 17.6906 13.1069 18.3337 12.3136 18.3337H4.18639C3.39309 18.3337 2.75 17.6906 2.75 16.8973Z"></path>
        <path stroke-width="1.375" stroke="#666666" d="M11.4583 6.87533C11.4583 8.64724 10.0219 10.0837 8.25 10.0837C6.47809 10.0837 5.04167 8.64724 5.04167 6.87533C5.04167 5.10341 6.47809 3.66699 8.25 3.66699C10.0219 3.66699 11.4583 5.10341 11.4583 6.87533Z"></path>
        <path stroke-linecap="round" stroke-width="1.375" stroke="#666666" d="M13.75 10.0837C15.5219 10.0837 16.9583 8.64724 16.9583 6.87533C16.9583 5.10341 15.5219 3.66699 13.75 3.66699M15.9407 18.3337H17.8136C18.6069 18.3337 19.25 17.6906 19.25 16.8973C19.25 15.0619 17.9164 13.4986 16.104 13.2093V13.2093C15.9953 13.192 15.8852 13.1833 15.7752 13.1833C15.4821 13.1833 15.391 13.1833 14.8877 13.1833"></path>
      </svg>
    ),
    name: 'Assign to Team'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" height="22" width="22">
        <path fill="#23A455" d="M7.7986 6.33756C8.10982 5.02631 9.28844 4.0509 10.6949 4.0509C12.1013 4.0509 13.2799 5.02631 13.5912 6.33756H7.7986ZM6.39255 6.33756C6.72324 4.25933 8.52356 2.6709 10.6949 2.6709C12.8662 2.6709 14.6665 4.25933 14.9972 6.33756H17.1116C18.5051 6.33756 19.6349 7.4673 19.6349 8.8609V17.1109C19.6349 18.5045 18.5051 19.6342 17.1116 19.6342H4.27822C2.88462 19.6342 1.75488 18.5045 1.75488 17.1109V8.8609C1.75488 7.4673 2.88462 6.33756 4.27822 6.33756H6.39255ZM3.13488 8.8609C3.13488 8.22945 3.64677 7.71757 4.27822 7.71757H17.1116C17.743 7.71757 18.2549 8.22945 18.2549 8.8609V17.1109C18.2549 17.7423 17.743 18.2542 17.1116 18.2542H4.27822C3.64677 18.2542 3.13488 17.7423 3.13488 17.1109V8.8609Z" clip-rule="evenodd" fill-rule="evenodd"></path>
      </svg>
    ),
    name: 'Catalog'
  }
]
const cardData = [
  {
    title: "Offline_message",
    content: "Dear {{name}} we're unavailable right now"
  },
  {
    title:'confirmed order',
    content:'Your Order was confirmed and processed already 😊'
  },
  {
    title:'Rating',
    content:"Thank you again 🤝 {{Name}}. We hope to serve you again soon. Goodbye ! 👋Incase you havent save this WhatsApp number, kindly add +256393249612 to your address book to avoid inconvinience in your future bookings via WhatsApp Visit www.evzone.app to view our other services"
  }
]
const DeleteModal = ({ show, onClose, onConfirm }) => {
  return (
    <>
      <Modal show={show} dialogClassName="keyword__delete__modal">
        <div className='keyword__delete__content'>
          <Modal.Header className='keyword__delete__header'>
            <Modal.Title >Confirm</Modal.Title>
          </Modal.Header>
          <ModalBody className='keyword__body__deletecontent'>
            <div class="delete__confirm__msg">Do you want to remove this keyword action?</div>
            <div class="keywordfooter__delete"><button target="_self" className='footer__cancel__btn delete__cancel__btn' onClick={onClose} >Cancel</button><button target="_self" className='delete__confirm__btn' onClick={onConfirm}>Yes</button></div>
          </ModalBody>
        </div>
      </Modal>
    </>
  )
}
const KeywordAction = () => {

  // search keywords 
  const [searchKeyword, setSearchKeyword] = useState('');
  const [rowIndexToDelete, setRowIndexToDelete] = useState(null);
  //deletemodal state 
  const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
  //editpage 
  const [isOpenEditPage, setOpenEditPage] = useState(false);
  const [selectedRadioMethod, setSelectedRadioMethod] = useState('')
  const [selectedEditRow, setSelectedEditRow] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  // addkeywordmodal --> editpage
  const [addKeywordInput, setAddKeywordInput] = useState('');
  const [addKeywordOpenModal, setAddKeywordOpenModal] = useState(false);

  //Addpage
  const [isAddOpenPage, setAddOpenPage] = useState(false);
  const [addSelectedRadioMethod, setAddSelectedRadioMethod] = useState('fuzzy');
  //addkeywordmodal--> add page
  const [addKeyword, setAddKeyword] = useState('');
  const [keywordList, setKeywordList] = useState([]);
  const [nextStepModal, setNextStepModal] = useState(false);
  const [isMaterialChecked, setIsMaterialChecked] = useState(false);
  //table pagination 
  const [page, setPage] = useState(0);
  const [rowsPerPage, SetRowsPerPage] = useState(5);

  // table data 
  const [data, setData] = useState(initialData);

  //handle nextstep checkbox
  const handleCheckboxToggle = () => {
    setIsMaterialChecked(!isMaterialChecked);
  }
  // addkeywordmodal--> addpage
  const handleInputChange = (e) => {
    setAddKeyword(e.target.value)
  }
  //addkeywordmodal-->editpage
  const handleKeywordInputChange = (e) => {
    setAddKeywordInput(e.target.value);
    setHasChanges(true);
  }

  const filterKeywords = data.filter(row => row.keywords.some(keyword => keyword.toLowerCase().includes(searchKeyword.toLowerCase())))

  //addkeywordmodal --> close
  const handleCloseKeyword = () => {
    setAddKeywordOpenModal(false)
  }
  //addpage--open
  const handleAddOpenPage = () => {
    setAddOpenPage(true);
  }
  //add page-->addkeyword modal
  const handleAddKeywordList = () => {
    if (addKeyword.trim()) {
      setAddKeyword('');
      setKeywordList([...keywordList, addKeyword.trim()]);
      setAddKeywordOpenModal(false)
    }
  }
  //delete modal 
  const handleDeleteOpenModal = (index) => {
    setRowIndexToDelete(index)
    setOpenDeleteModal(true);
  }
  const handleDeleteCloseModal = () => {
    setRowIndexToDelete(null);
    setOpenDeleteModal(false)
  }
  const handleDeleteConfirm = () => {
    if (rowIndexToDelete !== null) {
      setData(prev => prev.filter((_, index) => index !== rowIndexToDelete))
    }
    handleDeleteCloseModal();

  }
  //open and close edit page
  const handleEditOpenPage = (row) => {
    setSelectedEditRow(row);
    setOpenEditPage(true);

  }
  const handleEditClosePage = () => {
    setSelectedEditRow(null);
    setOpenEditPage(false);
    setAddOpenPage(false);

  }
  //pagination

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowPerPage = (event) => {
    SetRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
    }
  };
  const handleNextPage = () => {
    if (page < Math.ceil(data.length / rowsPerPage) - 1) {
      setPage(prev => prev + 1)
    }
  }
  const paginatedData = filterKeywords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  //edit page --> remove keywords 
  const handleRemoveKeyword = (keywordToRemove) => {
    // setSelectedEditRow((prev) => ({
    //   ...prev,
    //   keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    // }));
    const updatedKeywords = selectedEditRow.keywords.filter((keyword) => keyword !== keywordToRemove);
    setSelectedEditRow({ ...selectedEditRow, keywords: updatedKeywords });
    setHasChanges(true);
  };
  //edit page -->handleradiomethod
  const handleRadioMethodSelection = (method) => {
    setSelectedRadioMethod(method);
    setHasChanges(true);
  }
  //add page --> handleradiomethod
  const handleAddRadioMethodSelection = (method) => {
    setAddSelectedRadioMethod(method)
  }

  const handleAddKeyword = () => {
    setAddKeywordOpenModal(true);
    setHasChanges(true);
  }
  const handleRemoveAddKeyword = (index) => {
    const newKeywords = [...keywordList];
    newKeywords.splice(index, 1);
    setKeywordList(newKeywords);
  }
  // addkeyword to editlist
  const handleAddkeywordToEditlist = () => {
    if (addKeywordInput.trim()) {
      const updatedKeywords = [...selectedEditRow.keywords, addKeywordInput.trim()];
      setSelectedEditRow({ ...selectedEditRow, keywords: updatedKeywords });

      setAddKeywordInput('');
    }
    setHasChanges(true);
    setAddKeywordOpenModal(false);
  }
  //editpage --savechanges
  const handleSaveChanges = () => {
    if (selectedEditRow) {
      const updatedData = data.map((row) =>
        row.id === selectedEditRow.id ? selectedEditRow : row
      );

      setData(updatedData);
      setOpenEditPage(false);
      setHasChanges(false);
    }
  };
  //nextstepmodal
  const handleNextStepModal = () => {
    setNextStepModal(true);
  }
  const handleBackbtnNextStepModal = () => {
    setAddOpenPage(true);
    setNextStepModal(false);
  }
  return (
    <>
      {
        isOpenDeleteModal && (<DeleteModal show={isOpenDeleteModal} onClose={handleDeleteCloseModal}
          onConfirm={handleDeleteConfirm} />)
      }

      <div className='keyword_action_container'>

        {
          nextStepModal ? (
            <>
              <div className='keyword_editor'>
                <div className='editor_btn_container'>
                  <button className='backbtn' onClick={handleBackbtnNextStepModal}>
                    <span className='back__arrow'><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                    Back
                  </button>
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
                <div className='nextstep__editor__container'>
                  <div className='nextstep_left_container'>
                    {
                      buttonData.map((btn, index) => (
                        <button key={index} className='nextstep__btn__container'>
                          <span class="tab-item__icon">{btn.icon}</span>
                          <span class="tab-item__name">{btn.name}</span>
                        </button>
                      ))
                    }

                  </div>
                  <div className='nextstep_right_container'>
                    <div className='materials__header'>
                      <div className='materials__search'>
                        <div className='material__inputbox'>
                          <div className='material__searchcontainer'>
                            <div className='material__input__wrap'>
                              <input placeholder="Search..." className='search__input' />
                              <div className='material_search_icon'><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='select__material'>
                        <label className='selected__items'>Selected material :</label>

                      </div>
                      <div className='material_btn_container'>
                        <button target="_self" class="material__cancel__btn">Cancel</button>
                        <button target="_self" class="material__save__btn">Save</button>
                        <button className='keyword__add__btn'>Add</button>
                      </div>
                    </div>
                    <div className='materials__action__item'>
                      <div className='action__item__'>
                        <div className='action__cards'>
                          {
                            cardData.map((data, index) => (
                              <div  key={index} className='material__action__cards'>
                                <div className='action__edit'>
                                  <div className='action__edit__check'>
                                    <div
                                      className={`${isMaterialChecked ? 'checkbox_checked' : 'checkbox_unchecked'}`}

                                      role="checkbox"
                                      onClick={handleCheckboxToggle}

                                    >
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth="0"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        height="1em"
                                        width="1em"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <button aria-label="edit" className='material__btn cell__edit' ><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                  <button aria-label="delete" className=' material__btn cell__delete' ><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                </div>

                                <div className='material__action__title'>{data.title}</div>
                                <div className='material__action__content'>{data.content}</div>
                              </div>
                            ))
                          }

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )
            : isAddOpenPage ? (
              <>
                <div className='keyword_editor'>
                  <div className='editor_btn_container'>
                    <button className='backbtn' onClick={handleEditClosePage}>
                      <span className='back__arrow'><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                      Back
                    </button>
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
                            keywordList.map((addkey, index) => (
                              <button key={index} className='custom_chip'>
                                <span className='custom_chip_label'>{addkey}</span>
                                <svg className="custom_chip_delete_icon" focusable="false" onClick={() => handleRemoveAddKeyword(index)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                              </button>
                            ))

                          }

                        </div>
                        <button className='keyword__add__btn' onClick={handleAddKeyword}>Add Keyword +</button>
                      </div>
                    </div>
                    <div>
                      <div className='matchkeword__container'>
                        <div className='match__title'>Message matching methods:</div>

                        <div className='match__methods'>
                          <div className='match__method__fuzzy'>
                            <button type="button" className={`match__radio ${addSelectedRadioMethod === 'fuzzy' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('fuzzy')}><i class="match__radio__style"></i><span>Fuzzy matching</span></button>
                          </div>
                          <button type="button" className={`match__radio ${addSelectedRadioMethod === 'exact' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('exact')}><i class="match__radio__style"></i><span>Exact matching</span></button>
                          <button type="button" className={`match__radio ${addSelectedRadioMethod === 'contains' ? 'active' : ''}`} onClick={() => handleAddRadioMethodSelection('contains')}><i class="match__radio__style"></i><span>Contains</span></button>
                        </div>

                        {addSelectedRadioMethod === 'fuzzy' && (
                          <div className='match__slider'>
                            <div className='slider__mark'>0%</div>

                            <Slider
                              defaultValue={100}
                              sx={{
                                height: 8,
                                maxWidth: '540px',
                                margin: '0px 10px',
                                color: 'rgb(35, 164, 85)',
                                '& .MuiSlider-rail': {
                                  opacity: 0.38,
                                  height: 'inherit',
                                  backgroundColor: 'currentColor',
                                  borderRadius: 'inherit',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                },
                                '& .MuiSlider-track': {
                                  borderRadius: '4px',
                                  height: 8,
                                },
                                '& .MuiSlider-thumb': {
                                  height: 25,
                                  width: 25,
                                  backgroundColor: '#fff',
                                  border: '7px solid rgb(35, 164, 85)',
                                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: '0px 0px 0px 8px rgba(35, 164, 85, 0.16)',
                                  },
                                  '&::after': {
                                    position: 'absolute',
                                    content: '""',
                                    width: 42,
                                    height: 42,
                                    borderRadius: '50%',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  },
                                },
                                '& .MuiSlider-valueLabel': {
                                  left: 'calc(-50% + 6px)',
                                  marginTop: '-8px',
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Inter',
                                  background: 'rgb(233, 246, 238)',
                                  border: '1px solid rgb(35, 164, 85)',
                                  color: 'rgb(35, 164, 85)',
                                  boxSizing: 'border-box',
                                  borderRadius: '5px',
                                  position: 'relative',
                                  fontWeight: 500,
                                  fontSize: 12,
                                  lineHeight: '18px',
                                  padding: '6px 12px',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 'calc(100% - 1px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderTop: '10px solid rgb(35, 164, 85)',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    width: 0,
                                    height: 0,
                                    borderRadius: '5px',
                                  },
                                  '&::after': {
                                    content: '""',
                                    top: 'calc(100% - 3px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    position: 'absolute',
                                    borderTop: '10px solid rgb(233, 246, 238)',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    width: 0,
                                    height: 0,
                                    borderRadius: '5px',
                                  },
                                },
                                '& .MuiSlider-valueLabel span': {
                                  width: 'auto',
                                  height: 'auto',
                                  translate: 'none',
                                  background: 'none',
                                  color: 'rgb(35, 164, 85)',
                                },
                              }}
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
                      <button className="btn btn-success next__step__btn" onClick={handleNextStepModal}>Next step</button>
                      <button className='save__changes__btn'>Save Changes</button>
                    </div>
                  </div>
                  {
                    addKeywordOpenModal && (
                      <>
                        <Modal show={addKeywordOpenModal} onHide={handleCloseKeyword} dialogClassName="keyword__add__modal">
                          <div className='keyword__add__content'>
                            <Modal.Header className='keyword__add__header' closeButton >
                              <Modal.Title >Add Keyword</Modal.Title>
                            </Modal.Header>
                            <ModalBody className='keyword__body__addcontent'>
                              <input placeholder='Please input a keywords.' className='keyword__add__input' value={addKeyword} onChange={handleInputChange} />
                              <div class="keywordfooter__add"><button target="_self" onClick={handleAddKeywordList} className={`keyword__add ${addKeyword.trim() ? 'enabled' : 'disabled'}`} disabled={!addKeyword.trim()} >Add</button></div>
                            </ModalBody>
                          </div>
                        </Modal>
                      </>
                    )
                  }
                </div>

              </>
            ) :

              isOpenEditPage ? (
                <div className='keyword_editor'>
                  <div className='editor_btn_container'>
                    <button className='backbtn' onClick={handleEditClosePage}>
                      <span className='back__arrow'><svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 5L1.5 5M1.5 5L6.08824 9M1.5 5L6.08824 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                      Back
                    </button>
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
                          {selectedEditRow.keywords.map((keyword, index) => (
                            <button key={index} className='custom_chip'>
                              <span className='custom_chip_label'>{keyword}</span>
                              <svg className="custom_chip_delete_icon" onClick={() => handleRemoveKeyword(keyword)} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                            </button>
                          ))

                          }

                        </div>
                        <button className='keyword__add__btn' onClick={handleAddKeyword}>Add Keyword +</button>
                      </div>
                    </div>
                    <div>
                      <div className='matchkeword__container'>
                        <div className='match__title'>Message matching methods:</div>

                        <div className='match__methods'>
                          <div className='match__method__fuzzy'>
                            <button type="button" className={`match__radio ${selectedRadioMethod === 'fuzzy' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('fuzzy')}><i class="match__radio__style"></i><span>Fuzzy matching</span></button>
                          </div>
                          <button type="button" className={`match__radio ${selectedRadioMethod === 'exact' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('exact')}><i class="match__radio__style"></i><span>Exact matching</span></button>
                          <button type="button" className={`match__radio ${selectedRadioMethod === 'contains' ? 'active' : ''}`} onClick={() => handleRadioMethodSelection('contains')}><i class="match__radio__style"></i><span>Contains</span></button>
                        </div>

                        {selectedRadioMethod === 'fuzzy' && (
                          <div className='match__slider'>
                            <div className='slider__mark'>0%</div>

                            <Slider
                              defaultValue={100}
                              sx={{
                                height: 8,
                                maxWidth: '540px',
                                margin: '0px 10px',
                                color: 'rgb(35, 164, 85)',
                                '& .MuiSlider-rail': {
                                  opacity: 0.38,
                                  height: 'inherit',
                                  backgroundColor: 'currentColor',
                                  borderRadius: 'inherit',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                },
                                '& .MuiSlider-track': {
                                  borderRadius: '4px',
                                  height: 8,
                                },
                                '& .MuiSlider-thumb': {
                                  height: 25,
                                  width: 25,
                                  backgroundColor: '#fff',
                                  border: '7px solid rgb(35, 164, 85)',
                                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: '0px 0px 0px 8px rgba(35, 164, 85, 0.16)',
                                  },
                                  '&::after': {
                                    position: 'absolute',
                                    content: '""',
                                    width: 42,
                                    height: 42,
                                    borderRadius: '50%',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  },
                                },
                                '& .MuiSlider-valueLabel': {
                                  left: 'calc(-50% + 6px)',
                                  marginTop: '-8px',
                                  fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, Inter',
                                  background: 'rgb(233, 246, 238)',
                                  border: '1px solid rgb(35, 164, 85)',
                                  color: 'rgb(35, 164, 85)',
                                  boxSizing: 'border-box',
                                  borderRadius: '5px',
                                  position: 'relative',
                                  fontWeight: 500,
                                  fontSize: 12,
                                  lineHeight: '18px',
                                  padding: '6px 12px',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 'calc(100% - 1px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderTop: '10px solid rgb(35, 164, 85)',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    width: 0,
                                    height: 0,
                                    borderRadius: '5px',
                                  },
                                  '&::after': {
                                    content: '""',
                                    top: 'calc(100% - 3px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    position: 'absolute',
                                    borderTop: '10px solid rgb(233, 246, 238)',
                                    borderLeft: '5px solid transparent',
                                    borderRight: '5px solid transparent',
                                    width: 0,
                                    height: 0,
                                    borderRadius: '5px',
                                  },
                                },
                                '& .MuiSlider-valueLabel span': {
                                  width: 'auto',
                                  height: 'auto',
                                  translate: 'none',
                                  background: 'none',
                                  color: 'rgb(35, 164, 85)',
                                },
                              }}
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
                      <button className="btn btn-success next__step__btn">Next step</button>
                      <button className={`save__changes__btn ${!hasChanges ? 'disabled' : ''}`} disabled={!hasChanges} onClick={handleSaveChanges}  >Save Changes</button>
                    </div>
                  </div>
                  {
                    addKeywordOpenModal && (
                      <>
                        <Modal show={addKeywordOpenModal} onHide={handleCloseKeyword} dialogClassName="keyword__add__modal">
                          <div className='keyword__add__content'>
                            <Modal.Header className='keyword__add__header' closeButton >
                              <Modal.Title >Add Keyword</Modal.Title>
                            </Modal.Header>
                            <ModalBody className='keyword__body__addcontent'>
                              <input placeholder='Please input a keywords.' className='keyword__add__input' value={addKeywordInput} onChange={handleKeywordInputChange} />
                              <div class="keywordfooter__add"><button target="_self" onClick={handleAddkeywordToEditlist} className={`keyword__add ${addKeywordInput.trim() ? 'enabled' : 'disabled'}`} disabled={!addKeywordInput.trim()} >Add</button></div>
                            </ModalBody>
                          </div>
                        </Modal>
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
                        <button class="btn btn-success keyword__btn" onClick={handleAddOpenPage}>Add Keyword action</button>
                      </div>
                      <div className='header__text'>
                        <h1 className='header__title'>Add Keyword Action List</h1>
                        <strong>Note: </strong>
                        <span>When the message matches the keyword, automatically reply</span>
                      </div>
                      <div className='header__search'>
                        <div className='search__input'>
                          <div className='input__wrap'>
                            <input placeholder="Search..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                            <div tabindex="0" class="header__search__icon"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='keyword__body__content'>
                      <div className='keyword__list__table'>
                        <Table className='keyword__table'>
                          <TableHead className='keywordtable__head'>
                            <TableRow className='keywordtable__row'>
                              <TableCell className='keywordtable__cell alignleft firstcell'>Keyword</TableCell>
                              <TableCell className='keywordtable__cell'>Triggered</TableCell>
                              <TableCell className='keywordtable__cell alignleft'>Matching method</TableCell>
                              <TableCell className='keywordtable__cell alignleft'>Reply material</TableCell>
                              <TableCell className='keywordtable__cell lastcell'>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className='keyword__table__body'>
                            {
                              paginatedData.map((row, index) => (
                                <TableRow key={index} className='keyword__body__row'>
                                  <TableCell className='keyword__body__cell body_first_cell'>
                                    {
                                      row.keywords.map((keyword, i) => (
                                        <div key={i} className='keyword__field'>{keyword}</div>
                                      ))
                                    }
                                  </TableCell>
                                  <TableCell className='keyword__body__cell trigger_text'>{row.triggered}</TableCell>
                                  <TableCell className='keyword__body__cell'>{row.matchingMethod}</TableCell>
                                  <TableCell className='keyword__body__cell'>
                                    {
                                      row.replyMaterial.map((replymaterial, idx) => (
                                        <div key={idx} className='keyword__replymaterial_field'>{replymaterial}</div>
                                      ))
                                    }
                                  </TableCell>
                                  <TableCell className='keyword__body__cell keywordactions'>
                                    <button aria-label="edit" className='cell__edit' onClick={() => handleEditOpenPage(row)}><svg className='editsvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg></button>
                                    <button aria-label="delete" className='cell__delete' onClick={() => handleDeleteOpenModal(index)}><svg className='deletesvg' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg></button>
                                  </TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                        <div className='keyword__pagination'>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 100]}
                            component='div'
                            count={filterKeywords.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowPerPage}
                            ActionsComponent={() => (
                              <div className='tablepagination__action'>
                                {/* Previous Button */}
                                <div>
                                  <p onClick={handlePreviousPage} aria-label="Go to previous page" title="Go to previous page">
                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1.02698 11.9929L5.26242 16.2426L6.67902 14.8308L4.85766 13.0033L22.9731 13.0012L22.9728 11.0012L4.85309 11.0033L6.6886 9.17398L5.27677 7.75739L1.02698 11.9929Z" fill="currentColor"></path>
                                    </svg>
                                    <span className="pagination_previousnextcont" style={{ fontSize: '1.2rem', color: 'black' }}>Previous</span>
                                  </p>
                                </div>

                                {/* Next Button */}
                                <div>
                                  <p onClick={handleNextPage} aria-label="Go to next page" title="Go to next page">
                                    <span className="pagination_previousnextcont" >Next</span>
                                    <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" className="leftRightArrow" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M23.0677 11.9929L18.818 7.75739L17.4061 9.17398L19.2415 11.0032L0.932469 11.0012L0.932251 13.0012L19.2369 13.0032L17.4155 14.8308L18.8321 16.2426L23.0677 11.9929Z" fill="currentColor"></path>
                                    </svg>
                                  </p>
                                </div>
                              </div>
                            )}
                            sx={{
                              '.MuiTablePagination-displayedRows': {
                                fontSize: '1.2rem',
                                margin: '0px',
                                color: 'rgb(51, 51, 51)'
                              },
                              '.MuiSelect-nativeInput': {
                                padding: '0px 1rem',
                                height: '3rem',
                                margin: '0 0 8px 0px',
                              },
                              '.MuiInputBase-root': {
                                fontSize: '1.2rem',
                                paddingRight: '0',
                              },
                              '.MuiTablePagination-selectLabel': {
                                fontSize: '1.2rem',
                                margin: '0px',
                                color: 'rgb(51, 51, 51)',
                              },
                            }}
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