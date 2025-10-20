// Path: src/Component/templates/core/routingProfiles.defaults.js

const defaults = Object.freeze({
  red: {
    Emergency: ["platform", "push", "sms"],
    "Account Verification": ["sms", "email"],
    "3rd-Party Authentication": ["platform", "push"],
    MFA: ["platform", "push", "email"],
    "Failed Activity": ["platform", "push", "email", "whatsapp"],
    Rejections: ["platform", "email"],
    "Bad Activity": ["platform", "push", "email"],
    _default: ["platform", "push", "email"],
  },
  blue: {
    "Credential Access/share": ["platform", "email"],
    "Update notices": ["platform", "email"],
    "Helper tours": ["platform"],
    Transactions: ["platform", "email"],
    _default: ["platform", "email"],
  },
  green: {
    Approvals: ["platform", "push", "email"],
    Lifts: ["platform", "push", "email"],
    "success activity": ["platform", "email"],
    _default: ["platform", "email"],
  },
  yellow: {
    marketing: ["platform", "email", "whatsapp", "sms"],
    surveys: ["platform", "whatsapp", "email"],
    "Interactive Prompts": ["platform", "whatsapp"],
    _default: ["platform", "email", "whatsapp"],
  },
});

export default defaults;
