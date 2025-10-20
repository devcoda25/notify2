const QUALITY_STATUSES = Object.freeze({
  GREEN:  { id: "green",  label: "Green",  hint: "Healthy: low complaints/blocks" },
  YELLOW: { id: "yellow", label: "Yellow", hint: "Watchlist: trending down" },
  RED:    { id: "red",    label: "Red",    hint: "Problematic: action required" },
});

export default QUALITY_STATUSES;
