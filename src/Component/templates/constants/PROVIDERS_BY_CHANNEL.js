// Path: src/Component/templates/constants/PROVIDERS_BY_CHANNEL.js

// Strings are used directly by views/drawers.
// We include "Internal Review" as a fallback for channels without external providers.
const PROVIDERS_BY_CHANNEL = {
  whatsapp: ["WATI", "Meta"],
  sms: ["Submail", "SMS.to", "Africa's Talking"],
  push: ["FCM"],
  email: ["Internal Review"],
  platform: ["Internal Review"],
};

export default PROVIDERS_BY_CHANNEL;

// Default internal approver queues you can reuse in views
export const INTERNAL_APPROVERS = [
  "compliance@corp",
  "marketing@corp",
  "legal@corp",
];

/**
 * Optional richer metadata for future enhancements (portal links / required fields).
 */
export const PROVIDER_DETAILS = {
  wati: {
    id: "wati",
    channel: "whatsapp",
    label: "WATI",
    portalUrl: "https://app.wati.io/",
    requires: { languages: true, category: true, namespace: false },
  },
  meta: {
    id: "meta",
    channel: "whatsapp",
    label: "Meta (WhatsApp Cloud API)",
    portalUrl: "https://business.facebook.com/",
    requires: { languages: true, category: true, namespace: false },
  },
  submail: {
    id: "submail",
    channel: "sms",
    label: "Submail",
    portalUrl: "https://www.mysubmail.com/",
    requires: { senderId: true, msgType: true },
  },
  smsto: {
    id: "smsto",
    channel: "sms",
    label: "SMS.to",
    portalUrl: "https://sms.to/",
    requires: { senderId: true, msgType: true },
  },
  africastalking: {
    id: "africastalking",
    channel: "sms",
    label: "Africa's Talking",
    portalUrl: "https://account.africastalking.com/",
    requires: { senderId: true, msgType: true },
  },
  fcm: {
    id: "fcm",
    channel: "push",
    label: "Firebase Cloud Messaging (FCM)",
    portalUrl: "https://console.firebase.google.com/",
    requires: { topic: false },
  },
  internal: {
    id: "internal",
    channel: "internal",
    label: "Internal Review",
    requires: {},
  },
};
