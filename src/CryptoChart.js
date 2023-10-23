import axios from 'axios';
import Crypto from './components/Crypto';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Period from './components/Period';
import React, { useState, useEffect } from 'react';

const CryptoChart = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [selectedPeriod, setSelectedPeriod] = useState('1d');
  const [chartOptions, setChartOptions] = useState({});
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);

  const fetchTopCryptos = () => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then((response) => {
        const topCryptos = response.data;
        const numberOfCryptosToDisplay = 50; 
        const displayedCryptos = topCryptos.slice(0, numberOfCryptosToDisplay);

        setCryptoList(displayedCryptos);
      })
      .catch((error) => {
        console.error('Error fetching top cryptocurrencies: ', error);
      });
  };

  useEffect(() => {
    fetchTopCryptos();
  }, []);

  useEffect(() => {
    const fetchCryptoData = () => {
      axios
        .get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=${selectedPeriod}`)
        .then((response) => {
          const prices = response.data.prices.map((price) => [price[0], price[1]]);
          setChartOptions({
            title: { text: `${selectedCrypto.toUpperCase()} PRICE` },
            xAxis: { type: 'datetime' },
            yAxis: { title: { text: 'Price (USD)' } },
            series: [{ name: selectedCrypto, data: prices }],
          });
        })
        .catch((error) => {
          console.error('Error fetching crypto data: ', error);
        });
    };

    const fetchTopPerformers = () => {
      axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then((response) => {
          const filteredData = response.data.filter((crypto) => {
            const priceChange = crypto.price_change_percentage_24h;
            return !isNaN(priceChange);
          });

          filteredData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

          const topGainersData = filteredData.slice(0, 5);
          const topLosersData = filteredData.slice(-5).reverse();

          setTopGainers(topGainersData);
          setTopLosers(topLosersData);
        })
        .catch((error) => {
          console.error('Error fetching top performers data: ', error);
        });
    };
    fetchCryptoData();
    fetchTopPerformers();
  }, [selectedCrypto, selectedPeriod]);

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const getPriceChange = (crypto) => {
    return `${crypto.price_change_percentage_24h}%`;
  };

  return (
    <div className="crypto-chart">
      <h1 className="title">CRYPTOCURRENCY STATISTICS</h1>
      <div className="options">
        <Crypto cryptoList={cryptoList} selectedCrypto={selectedCrypto} onCryptoChange={handleCryptoChange} />
        <Period selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
      </div>
      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
      <div className="top-performers">
  <div className="top-gainers">
    <h2>Top 5 Gainers</h2>
    <ul>
      {topGainers.map((crypto) => (
        <li key={crypto.id}>
          {crypto.name}: {getPriceChange(crypto)}
        </li>
      ))}
    </ul>
  </div>
  <div className="top-losers">
    <h2>Top 5 Losers</h2>
    <ul>
      {topLosers.map((crypto) => (
        <li key={crypto.id}>
          {crypto.name}: {getPriceChange(crypto)}
        </li>
      ))}
    </ul>
  </div>
</div>
    </div>
  );
};

export default CryptoChart;
