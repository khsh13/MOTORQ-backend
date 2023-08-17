const cache = {}; // This object will act as our in-memory cache

// Update coin price in the cache
function updateCache(coinId, price) {
  cache[coinId] = price;
}

// Get coin price from the cache
function getFromCache(coinId) {
  return cache[coinId];
}

module.exports = { updateCache, getFromCache };
