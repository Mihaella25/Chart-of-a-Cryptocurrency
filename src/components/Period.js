import React from 'react';

const Period = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="period-selection">
      <label>Time interval: </label>
      <select id="crypto-select" onChange={(event) => onPeriodChange(event.target.value)} value={selectedPeriod}>
        <option value="1d">1 Day</option>
        <option value="7d">7 Days</option>
        <option value="30d">1 Month</option>
        <option value="90d">3 Months</option>
        <option value="180d">6 Months</option>
        <option value="365d">1 Year</option>
      </select>
    </div>
  );
};

export default Period;
