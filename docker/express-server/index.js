if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../faucet-service.env' })
}
var sendSignedTransactionService = require('send-signed-transaction-service');
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

app.get('/', function (request, response) {
  response.send('Eth Faucet Up' + 'Contract address: ' + process.env.FAUCET_CONFIG_TOKEN_CONTRACT_ADDRESS +
  'FAUCET Node Url: ' + process.env.FAUCET_CONFIG_ETH_NODE_URL)
})

app.post('/drip/:ethAddress', async function (request, response) { // (\d+)0x00000000000000000000000
  new Promise(
    (resolve, reject) => {
      // await var etherReceipt = sendSignedTransactionService.sendEther(request.params.ethAddress)
      await var tokenReceipt = sendSignedTransactionService.sendToken(request.params.ethAddress)

      if (etherReceipt && tokenReceipt) {
        console.log('success')
        resolve('sent!')
      }
      else {
        console.log('error')
        reject('error!')
      }
    }
  ).then((result, b) => {
    console.log(result, b)
    response.send(request.params.ethAddress)
  })
})

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
