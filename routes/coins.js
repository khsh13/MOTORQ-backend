const express = require('express');
const router = express.Router();
const { updateCache, getFromCache } = require('../utils/cache');
const axios = require('axios');

// GET /coins/price/:coinId
router.get('/price/:coinId', function(req, res, next) {
  const coinId = req.params.coinId;
  const coingeckoPriceApiUrl = `https://api.coingecko.com/api/v3/simple/price`;

  axios.get(coingeckoPriceApiUrl)
    .then(response => {
      const fetchedPrice = response.data[coinId].usd; // Assuming the response structure
      updateCache(coinId, fetchedPrice);

      res.json({ coinId, price: fetchedPrice });
    })
    .catch(error => {
      console.error('Error fetching coin price:', error);
      res.status(500).json({ error: 'An error occurred while fetching coin price.' });
    });
});

// GET /coins/market
router.get('/market', function(req, res, next) {
  const coingeckoMarketApiUrl = 'https://api.coingecko.com/api/v3/coins/markets';

  axios.get(coingeckoMarketApiUrl)
    .then(response => {
      const marketDetails = response.data; // Assuming the response structure
      res.json(marketDetails);
    })
    .catch(error => {
      console.error('Error fetching market details:', error);
      res.status(500).json({ error: 'An error occurred while fetching market details.' });
    });
});

module.exports = router;
