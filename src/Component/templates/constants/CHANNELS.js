const CHANNELS = Object.freeze([
  { id: "email",    label: "Email",    icon: "/assets/images/Email.png",    requiresApproval: false, supportsTheme: true,  supportsAttachments: true,  supportsButtons: true,  supportsSound: false },
  { id: "platform", label: "Platform", icon: "/assets/images/platform.png", requiresApproval: false, supportsTheme: true,  supportsAttachments: true,  supportsButtons: true,  supportsSound: true  },
  { id: "push",     label: "Push",     icon: "/assets/images/push.png",     requiresApproval: false, supportsTheme: true,  supportsAttachments: false, supportsButtons: true,  supportsSound: true  },
  { id: "sms",      label: "SMS",      icon: "/assets/images/sms.png",      requiresApproval: false, supportsTheme: false, supportsAttachments: false, supportsButtons: false, supportsSound: false },
  { id: "whatsapp", label: "WhatsApp", icon: "/assets/images/whatsapp.png", requiresApproval: true,  supportsTheme: true,  supportsAttachments: true,  supportsButtons: true,  supportsSound: false },
]);

export default CHANNELS;
