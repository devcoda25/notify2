// Path: src/Component/templates/core/channelCapabilities.js

/**
 * Static capabilities and soft limits per channel (frontend reference).
 * These are used by validators, hints, and the create wizard.
 */
const CAPABILITIES = Object.freeze({
  email: {
    label: "Email",
    supportsTheme: true,
    supportsAttachments: true,
    supportsButtons: true,
    supportsSound: false,
    limits: {
      subjectMax: 150, // soft UI limit
    },
  },
  platform: {
    label: "Platform",
    supportsTheme: true,
    supportsAttachments: true,
    supportsButtons: true,
    supportsSound: true,
    limits: {},
  },
  push: {
    label: "Push",
    supportsTheme: true,
    supportsAttachments: false,
    supportsButtons: true,
    supportsSound: true,
    limits: {
      titleMax: 60,
      bodyMax: 140,
    },
  },
  sms: {
    label: "SMS",
    supportsTheme: false,
    supportsAttachments: false,
    supportsButtons: false,
    supportsSound: false,
    limits: {
      gsmSingle: 160,
      gsmConcat: 153,
      ucs2Single: 70,
      ucs2Concat: 67,
    },
  },
  whatsapp: {
    label: "WhatsApp",
    supportsTheme: true,
    supportsAttachments: true,
    supportsButtons: true,
    supportsSound: false,
    limits: {
      headerMax: 60,
      bodyMax: 1024,
      footerMax: 60,
      buttonsMax: 3,
    },
  },
});

/** Detect basic GSM-7 vs UCS-2 to estimate SMS segments */
export function estimateSmsSegments(text = "") {
  const gsm7 =
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ" +
    " !\"#¤%&'()*+,-./" +
    "0123456789:;<=>?" +
    "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿" +
    "abcdefghijklmnopqrstuvwxyzäöñüà";
  const isGsm7 = [...text].every((ch) => gsm7.includes(ch));
  const caps = CAPABILITIES.sms.limits;
  const single = isGsm7 ? caps.gsmSingle : caps.ucs2Single;
  const concat = isGsm7 ? caps.gsmConcat : caps.ucs2Concat;
  const len = [...text].length;
  if (len <= single) return { encoding: isGsm7 ? "GSM-7" : "UCS-2", segments: 1, perSegment: single };
  return {
    encoding: isGsm7 ? "GSM-7" : "UCS-2",
    segments: Math.ceil(len / concat),
    perSegment: concat,
  };
}

export default CAPABILITIES;
