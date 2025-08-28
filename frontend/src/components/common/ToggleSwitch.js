import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isOn, onToggle, label, iconOn, iconOff }) => {
  return (
    <div className="toggle-switch-container">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={onToggle}
          className="toggle-input"
        />
        <span className="toggle-slider">
          <span className="toggle-icon toggle-icon-on">{iconOn}</span>
          <span className="toggle-icon toggle-icon-off">{iconOff}</span>
        </span>
      </label>
      {label && <span className="toggle-label">{label}</span>}
    </div>
  );
};

export default ToggleSwitch;
