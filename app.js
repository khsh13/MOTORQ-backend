var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rateLimit = require('express-rate-limit');
var cron = require('node-cron');
var axios = require('axios');
var { updateCache } = require('./utils/cache');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var coinsRouter = require('./routes/coins'); // Import the coins API route

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/coins', coinsRouter); // Use the coins API route

// Background Job: Update coin details every 10 minutes
cron.schedule('*/10 * * * *', function() {
  updateCoinDetails(); // Call the function to update coin details
});

// Background Job: Update current prices every 1 minute
cron.schedule('* * * * *', function() {
  updateCurrentPrices(); // Call the function to update current prices
});

// Background Job: Update market details every 10 minutes
cron.schedule('*/10 * * * *', function() {
  updateMarketDetails(); // Call the function to update market details
});

// Function to update coin details
function updateCoinDetails() {
  axios.get('https://api.coingecko.com/api/v3/simple/price')
    .then(response => {
      const coins = response.data.slice(0, 20); // Top 20 coins
      coins.forEach(coin => {
        updateCache(coin.id, coin); // Assuming coin.id as the key
      });
    })
    .catch(error => {
      console.error('Error fetching coin details:', error);
    });
}

// Function to update current prices
function updateCurrentPrices() {
  // Fetch current prices from CoinGecko API
  // Update cache
}

// Function to update market details
function updateMarketDetails() {
  axios.get('https://api.coingecko.com/api/v3/coins/markets')
    .then(response => {
      // Assuming response.data contains market details
      // Update your cache or database with market details
    })
    .catch(error => {
      console.error('Error fetching market details:', error);
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
