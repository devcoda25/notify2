export const WhatsAppRules = {
  sessionWindowHours: 24,
  interactive: {
    replyButtonsInSessionMax: 3
  },
  template: {
    quickReplyMax: 10,
    totalButtonsMax: 10,
    ctaLimits: { urlMax: 2, phoneMax: 1, promoMax: 1 },
    quickReplyLabelMaxChars: 25
  },
  listMessage: {
    optionsMax: 10
  }
};

export const CHANNELS = [
  'whatsapp', 'sms', 'email', 'push', 'voice',
  'slack', 'teams', 'telegram'
];