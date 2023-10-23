import React from 'react';

const Crypto = ({ cryptoList, selectedCrypto, onCryptoChange }) => {
  return (
    <div className="crypto-selection">
      <label htmlFor="crypto-select">Cryptocurrency: </label>
      <select id="crypto-select" onChange={onCryptoChange} value={selectedCrypto}>
        {cryptoList.map((crypto) => (
          <option key={crypto.id} value={crypto.id}>
            {crypto.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Crypto;