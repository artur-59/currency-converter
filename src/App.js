import { useEffect, useState } from "react";
import { CurrencyRow } from "./components/CurrencyRow";
import axios from "axios";

import "./App.css";

const CURRENCIES_URL = "https://api.exchangeratesapi.io/latest";
const CURRENCY_FULL_NAME_URL = "https://restcountries.eu/rest/v2/currency/";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState(null);
  const [fromCurrencyFlag, setFromCurrencyFlag] = useState(null);
  const [fromCurrencyDetails, setFromCurrencyDetails] = useState([]);
  const [toCurrency, setToCurrency] = useState(null);
  const [toCurrencyFlag, setToCurrencyFlag] = useState(null);
  const [toCurrencyDetails, setToCurrencyDetails] = useState([]);
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [order, setOrder] = useState(true);
  // SET CURRENCY OPTIONS + FROM CURRENCY + TO CURRENCY || COMPONENT DID MOUNT
  useEffect(() => {
    axios.get(CURRENCIES_URL).then((response) => {
      let baseCurrency = response.data.base;
      setFromCurrency(baseCurrency);
      //console.log(baseCurrency)
      let remainingCurrenciesObject = response.data.rates;
      let firstCurrency = Object.keys(remainingCurrenciesObject)[0];
      setToCurrency(firstCurrency);
      //console.log(firstCurrency);
      setCurrencyOptions([
        baseCurrency,
        ...Object.keys(remainingCurrenciesObject),
      ]);
      //console.log(currencyOptions);
      setExchangeRate(response.data.rates[firstCurrency]);
    });
  }, []);
  // SET NEW EXCHANGE RATES FROM FROM CURRENCY AND TO CURRENCY CHANGES
  useEffect(() => {
    if (
      fromCurrency != null &&
      toCurrency != null &&
      fromCurrency !== toCurrency
    ) {
      axios
        .get(`${CURRENCIES_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((response) => {
          let newExchangeRateObject = response.data.rates;
          let newExchangeRate = newExchangeRateObject[toCurrency];
          setExchangeRate(newExchangeRate);
          let fromFlag = response.data.base;
          let fromCurrFlag = fromFlag.substring(0, 2);
          setFromCurrencyFlag(fromCurrFlag);
          let toFlag = response.data.rates;
          let toCFlag = Object.keys(toFlag)[0];
          let toCurrFlag = toCFlag.substring(0, 2);
          setToCurrencyFlag(toCurrFlag);
        });
    } else if (
      fromCurrency !== null &&
      toCurrency !== null &&
      fromCurrency === toCurrency &&
      amountInFromCurrency
    ) {
      fromAmount = amount;
      toAmount = fromAmount;
      setExchangeRate(1);
      if (fromCurrency === "EUR") {
        setFromCurrencyFlag("EU");
        setToCurrencyFlag("EU");
      } else {
        axios
          .get(`${CURRENCIES_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
          .then((response) => {
            let fromFlag = response.data.base;
            let fromCurrFlag = fromFlag.substring(0, 2);
            setFromCurrencyFlag(fromCurrFlag);
          });
      }
    } else if (
      fromCurrency !== null &&
      toCurrency !== null &&
      fromCurrency === toCurrency &&
      !amountInFromCurrency
    ) {
      toAmount = amount;
      fromAmount = toAmount;
      setExchangeRate(1);
      if (fromCurrency === toCurrency) {
        console.log("from: ", fromCurrency);
        console.log("to: ", toCurrency);
        setFromCurrencyFlag(fromCurrency.substring(0, 2));
        setToCurrencyFlag(toCurrency.substring(0, 2));
      } else {
        axios.get(CURRENCIES_URL).then((response) => {
          let fromFlag = response.data.rates;
          let newFromFlag = Object.keys(fromFlag).filter(
            (code) => code === fromCurrency
          );
          console.log(newFromFlag);
          let trimNewFFlag = newFromFlag[0].substring(0, 2);
          setFromCurrencyFlag(trimNewFFlag);
        });
      }
    }
  }, [fromCurrency, toCurrency]);
  // CALCULATE FROM AMOUNT AND TO AMOUNT VALUE ACCORDING TO AMOUNT IN FROM CURRENCY VALUE
  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }
  // HANDLE AMOUNT INPUT CHANGE
  const handleFromAmountChange = (e) => {
    setAmountInFromCurrency(true);
    setAmount(e.target.value);
  };
  const handleToAmountChange = (e) => {
    setAmountInFromCurrency(false);
    setAmount(e.target.value);
  };
  // GET CURRENCY FULL NAME
  useEffect(() => {
    if (fromCurrency !== null && toCurrency !== null) {
      // GET FROM CURRENCY DETAILS
      if (fromCurrency === "EUR") {
        // GET FROM CURRENCY DETAILS
        axios
          .get(`${CURRENCY_FULL_NAME_URL}${fromCurrency}`)
          .then((response) => {
            let fromCurrencyName, fromCurrencySymbol;
            fromCurrencyName = response.data[0]["currencies"][0].name;
            fromCurrencySymbol = response.data[0]["currencies"][0].symbol;
            setFromCurrencyDetails([
              { name: fromCurrencyName },
              { symbol: fromCurrencySymbol },
            ]);
          });
        // GET TO CURRENCY DETAILS
        axios.get(`${CURRENCY_FULL_NAME_URL}${toCurrency}`).then((response) => {
          let toCurrencyName, toCurrencySymbol;
          toCurrencyName = response.data[0]["currencies"][0].name;
          toCurrencySymbol = response.data[0]["currencies"][0].symbol;
          setToCurrencyDetails([
            { name: toCurrencyName },
            { symbol: toCurrencySymbol },
          ]);
        });
      } else {
        // GET FROM CURRENCY DETAILS
        axios
          .get(`${CURRENCY_FULL_NAME_URL}${fromCurrency}`)
          .then((response) => {
            let fromCurrencyName, fromCurrencySymbol;
            fromCurrencyName = response.data[0]["currencies"][0].name;
            fromCurrencySymbol = response.data[0]["currencies"][0].symbol;
            setFromCurrencyDetails([
              { name: fromCurrencyName },
              { symbol: fromCurrencySymbol },
            ]);
          });
        // GET TO CURRENCY DETAILS
        axios.get(`${CURRENCY_FULL_NAME_URL}${toCurrency}`).then((response) => {
          let toCurrencyName, toCurrencySymbol;
          toCurrencyName = response.data[0]["currencies"][0].name;
          toCurrencySymbol = response.data[0]["currencies"][0].symbol;
          setToCurrencyDetails([
            { name: toCurrencyName },
            { symbol: toCurrencySymbol },
          ]);
        });
      }
    }
  }, [fromCurrency, toCurrency]);
  const toggleOrder = () => {
    setOrder(!order);
    setExchangeRate(1 * exchangeRate);
  };
  let arrayOfBlues = [
    "EUR",
    "USD",
    "AUD",
    "ISK",
    "CZK",
    "SEK",
    "HRK",
    "THB",
    "NZD",
    "ILS",
    "GBP",
    "KRW",
    "MYR",
  ];
  let arrayOfCorals = [
    "CAD",
    "HKD",
    "PHP",
    "DKK",
    "IDR",
    "RUB",
    "JPY",
    "CHF",
    "SGD",
    "PLN",
    "TRY",
    "CNY",
    "NOK",
    "RON",
  ];
  let arrayOfDarkGreens = ["HUF", "INR", "BRL", "BGN", "ZAR", "MXN"];
  return (
    <div className="App">
      <h1>Currency Converter</h1>
      {order ? (
        <div>
          <div className="flagNName">
            <div
              className={
                arrayOfBlues.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber1"
                  : arrayOfCorals.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber2"
                  : arrayOfDarkGreens.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber3"
                  : null
              }
            >
              {fromCurrencyDetails.map((details) => details.symbol)}
            </div>
            <div className="flagName">
              {fromCurrency} -{" "}
              {fromCurrencyDetails.map((details) => details.name)}
            </div>
            <div className="flagImg">
              <img
                src={`https://www.countryflags.io/${fromCurrencyFlag}/flat/48.png`}
                alt={fromCurrency}
              />
            </div>
          </div>
          <CurrencyRow
            currencyOptions={currencyOptions}
            currentCurrency={fromCurrency}
            handleCurrencyChange={(e) => setFromCurrency(e.target.value)}
            amount={fromAmount}
            handleInputChange={handleFromAmountChange}
          />
          <div className="equalsBtnContainer">
            <button
              className={
                arrayOfBlues.includes(fromCurrency) &&
                arrayOfCorals.includes(toCurrency)
                  ? "reverseBtn BlueToCoral"
                  : arrayOfBlues.includes(fromCurrency) &&
                    arrayOfDarkGreens.includes(toCurrency)
                  ? "reverseBtn BlueToDKGreen"
                  : arrayOfCorals.includes(fromCurrency) &&
                    arrayOfBlues.includes(toCurrency)
                  ? "reverseBtn CoralToBlue"
                  : arrayOfCorals.includes(fromCurrency) &&
                    arrayOfDarkGreens.includes(toCurrency)
                  ? "reverseBtn CoralToDKGreen"
                  : arrayOfDarkGreens.includes(fromCurrency) &&
                    arrayOfBlues.includes(toCurrency)
                  ? "reverseBtn DKGreenToBlue"
                  : arrayOfDarkGreens.includes(fromCurrency) &&
                    arrayOfCorals.includes(toCurrency)
                  ? "reverseBtn DKGreenToCoral"
                  : arrayOfCorals.includes(fromCurrency) &&
                    arrayOfCorals.includes(toCurrency)
                  ? "reverseBtn CoralToCoral"
                  : arrayOfBlues.includes(fromCurrency) &&
                    arrayOfBlues.includes(toCurrency)
                  ? "reverseBtn BlueToBlue"
                  : arrayOfDarkGreens.includes(fromCurrency) &&
                    arrayOfDarkGreens.includes(toCurrency)
                  ? "reverseBtn DKGreenToDKGreen"
                  : null
              }
              onClick={toggleOrder}
            >
              Invert
            </button>
          </div>
          <div className="flagNName">
            <div
              className={
                arrayOfBlues.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber1"
                  : arrayOfCorals.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber2"
                  : arrayOfDarkGreens.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber3"
                  : null
              }
            >
              {toCurrencyDetails.map((details) => details.symbol)}
            </div>
            <div className="flagName">
              {toCurrency} - {toCurrencyDetails.map((details) => details.name)}
            </div>
            <div className="flagImg">
              <img
                src={`https://www.countryflags.io/${toCurrencyFlag}/flat/48.png`}
                alt={toCurrency}
              />
            </div>
          </div>
          <CurrencyRow
            currencyOptions={currencyOptions}
            currentCurrency={toCurrency}
            handleCurrencyChange={(e) => setToCurrency(e.target.value)}
            amount={toAmount}
            handleInputChange={handleToAmountChange}
          />
          <div className="exchRate">
            {exchangeRate !== null ? (
              fromCurrency === toCurrency ? (
                <div>Exchange Rate: -</div>
              ) : (
                <div>
                  Exchange Rate: 1
                  {fromCurrencyDetails.map((details) => details.name)} ≈{" "}
                  {exchangeRate.toFixed(2)}
                  {toCurrencyDetails.map((details) => details.name)}s
                </div>
              )
            ) : (
              <div>Exchange Rate: -</div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flagNName">
            <div
              className={
                arrayOfBlues.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber1"
                  : arrayOfCorals.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber2"
                  : arrayOfDarkGreens.includes(toCurrency)
                  ? "flagSymbol flagSymbolNumber3"
                  : null
              }
            >
              {toCurrencyDetails.map((details) => details.symbol)}
            </div>
            <div className="flagName">
              {toCurrency} - {toCurrencyDetails.map((details) => details.name)}
            </div>
            <div className="flagImg">
              <img
                src={`https://www.countryflags.io/${toCurrencyFlag}/flat/48.png`}
                alt={toCurrency}
              />
            </div>
          </div>
          <CurrencyRow
            currencyOptions={currencyOptions}
            currentCurrency={toCurrency}
            handleCurrencyChange={(e) => setToCurrency(e.target.value)}
            amount={toAmount}
            handleInputChange={handleToAmountChange}
          />
          <div className="equalsBtnContainer">
            <button
              className={
                arrayOfBlues.includes(toCurrency) &&
                arrayOfCorals.includes(fromCurrency)
                  ? "reverseBtn BlueToCoral"
                  : arrayOfBlues.includes(toCurrency) &&
                    arrayOfDarkGreens.includes(fromCurrency)
                  ? "reverseBtn BlueToDKGreen"
                  : arrayOfCorals.includes(toCurrency) &&
                    arrayOfBlues.includes(fromCurrency)
                  ? "reverseBtn CoralToBlue"
                  : arrayOfCorals.includes(toCurrency) &&
                    arrayOfDarkGreens.includes(fromCurrency)
                  ? "reverseBtn CoralToDKGreen"
                  : arrayOfDarkGreens.includes(toCurrency) &&
                    arrayOfBlues.includes(fromCurrency)
                  ? "reverseBtn DKGreenToBlue"
                  : arrayOfDarkGreens.includes(toCurrency) &&
                    arrayOfCorals.includes(fromCurrency)
                  ? "reverseBtn DKGreenToCoral"
                  : arrayOfCorals.includes(toCurrency) &&
                    arrayOfCorals.includes(fromCurrency)
                  ? "reverseBtn CoralToCoral"
                  : arrayOfBlues.includes(toCurrency) &&
                    arrayOfBlues.includes(fromCurrency)
                  ? "reverseBtn BlueToBlue"
                  : arrayOfDarkGreens.includes(toCurrency) &&
                    arrayOfDarkGreens.includes(fromCurrency)
                  ? "reverseBtn DKGreenToDKGreen"
                  : null
              }
              onClick={toggleOrder}
            >
              Invert
            </button>
          </div>
          <div className="flagNName">
            <div
              className={
                arrayOfBlues.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber1"
                  : arrayOfCorals.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber2"
                  : arrayOfDarkGreens.includes(fromCurrency)
                  ? "flagSymbol flagSymbolNumber3"
                  : null
              }
            >
              {fromCurrencyDetails.map((details) => details.symbol)}
            </div>
            <div className="flagName">
              {fromCurrency} -{" "}
              {fromCurrencyDetails.map((details) => details.name)}
            </div>
            <div className="flagImg">
              <img
                src={`https://www.countryflags.io/${fromCurrencyFlag}/flat/48.png`}
                alt={fromCurrency}
              />
            </div>
          </div>
          <CurrencyRow
            currencyOptions={currencyOptions}
            currentCurrency={fromCurrency}
            handleCurrencyChange={(e) => setFromCurrency(e.target.value)}
            amount={fromAmount}
            handleInputChange={handleFromAmountChange}
          />
          <div className="exchRate">
            {exchangeRate !== null ? (
              fromCurrency === toCurrency ? (
                <div>Exchange Rate: -</div>
              ) : (
                <div>
                  Exchange Rate: 1
                  {toCurrencyDetails.map((details) => details.name)} ≈{" "}
                  {exchangeRate.toFixed(2)}
                  {fromCurrencyDetails.map((details) => details.name)}s
                </div>
              )
            ) : (
              <div>Exchange Rate: -</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
