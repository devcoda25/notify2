import React from "react";


const ToggleSwitch = ({ isActive, onToggle, leftLabel, rightLabel }) => {
  return (
    <div className="holidaytoggle" style={{ width: '210px' }}>
      {leftLabel && <label className="toggle-label">{leftLabel}</label>}
      
      <button
        type="button"
        className={`toggle__control ${isActive ? "active" : ""}`}
        onClick={onToggle}>
        <div className="toggle-indicator"></div>
      </button>

      {rightLabel && <label className="toggle-label">{rightLabel}</label>}
    </div>
  );
};

export default ToggleSwitch;
