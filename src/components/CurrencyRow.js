import React from "react";

import "./CurrencyRow.css";

export const CurrencyRow = ({
  currencyOptions,
  currentCurrency,
  handleCurrencyChange,
  amount,
  handleInputChange,
}) => {
  return (
    <div className="inputContainer">
      <input type="number" value={amount} onChange={handleInputChange} className="currInput"/>
      <select value={currentCurrency} onChange={handleCurrencyChange} className="currSelect">
        {currencyOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
