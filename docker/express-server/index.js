if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../faucet-service.env' })
}

var express = require('express');
var request = require('request');
var http = require('http');
var https = require('https');
// var staticServe = require('serve-static');
// var fs = require('fs');
var bodyParser = require('body-parser');
var redis = require('redis');
var redisClient = redis.createClient(6379, 'redis');

// server
var app = express();

app.use(bodyParser.json()); // used for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-unlencoded

// Read the link below about express behind a proxy
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.get('/', function (req, res) {
  res.send('Eth Faucet Up' + 'Contract address: ' + process.env.FAUCET_CONFIG_MEDXTOKEN_CONTRACT_ADDRESS +
  'FAUCET Node Url: ' + process.env.FAUCET_CONFIG_ETH_NODE_URL)
  console.log(req);
})

app.post('/drip/:ethAddress', function (req, res) { // (\d+)0x00000000000000000000000
  res.send(req.params)
  console.log(req.params)
  res.send('Hello World')
  console.log(req);
})

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
