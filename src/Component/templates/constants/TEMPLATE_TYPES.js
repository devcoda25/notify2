const TEMPLATE_TYPES = Object.freeze({
  RED:    { id: "red",    label: "Red",    description: "High priority (Emergency, MFA, Rejections)", soundRequired: true,  color: "#ef4444" },
  BLUE:   { id: "blue",   label: "Blue",   description: "Informational (Updates, Helper tours, Transactions)", soundRequired: false, color: "#3b82f6" },
  GREEN:  { id: "green",  label: "Green",  description: "Success (Approvals, Lifts, Success activity)", soundRequired: true,  color: "#16a34a" },
  YELLOW: { id: "yellow", label: "Yellow", description: "Marketing (Ads, Surveys, Interactive prompts)", soundRequired: false, color: "#f59e0b" },
});

export default TEMPLATE_TYPES;
