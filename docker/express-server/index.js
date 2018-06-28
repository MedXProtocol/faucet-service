if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../faucet-service.env' })
}
console.log(process.env.FAUCET_CONFIG_PRIVKEY)
console.log('0x975edfccd8918b08f1969ff41e34c99e13c1667cd3b7c155efe124173eded5fc'.length)
var sendSignedTransactionService = require('./send-signed-transaction-service');
var request = require('request');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var redis = require('redis');
var redisClient = redis.createClient(6379, 'redis');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.get('/', function (request, response) {
  response.send('Eth Faucet Up' + 'Contract address: ' + process.env.FAUCET_CONFIG_TOKEN_CONTRACT_ADDRESS +
  'FAUCET Node Url: ' + process.env.FAUCET_CONFIG_ETH_NODE_URL)
})

// app.post('/drip/:ethAddress', function (request, response) { // (\d+)0x00000000000000000000000
//   new Promise(
//     async (resolve, reject) => {

//       // var etherReceipt = await sendSignedTransactionService.sendEther(request.params.ethAddress)
//       var tokenReceipt = await sendSignedTransactionService.sendToken(request.params.ethAddress)

//       if (etherReceipt && tokenReceipt) {
//         console.log('success')
//         resolve('sent!')
//       }
//       else {
//         console.log('error')
//         reject('error!')
//       }
//     }
//   ).then((result, b) => {
//     console.log(result, b)
//     response.send(request.params.ethAddress)
//   })
// })

http.createServer(app).listen(process.env.PORT || 8080, function() {
  console.log('Listening on port ' + (process.env.PORT || 8080));
});
