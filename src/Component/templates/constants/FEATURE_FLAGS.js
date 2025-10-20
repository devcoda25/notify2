const FEATURE_FLAGS = Object.freeze({
  channels: { email: true, platform: true, push: true, sms: true, whatsapp: true, rcs: false, telegram: false },
  approvals: { simulate: true },
  analytics: { enableABCompare: true, enableTimeHeatmap: true },
  themes: { enableThemeLibrary: true },
});

export default FEATURE_FLAGS;
