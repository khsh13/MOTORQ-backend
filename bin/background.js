const cron = require('node-cron');
const axios = require('axios');
const { updateCache } = require('./utils/cache'); // Adjust the path
//const Airtable = require('airtable'); // Uncomment if using AirTable

// Fetch coin details and update cache
function updateCoinDetails() {
  axios.get('https://api.coingecko.com/api/v3/coins/list')
    .then(response => {
      const coins = response.data.slice(0, 20); // Top 20 coins
      // Update the cache with coin details
      coins.forEach(coin => {
        updateCache(coin.id, coin); // Assuming coin.id as the key
      });
    })
    .catch(error => {
      console.error('Error fetching coin details:', error);
    });
}

// Schedule background jobs
cron.schedule('*/10 * * * *', updateCoinDetails); // Every 10 minutes
