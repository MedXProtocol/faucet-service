console.log('val:', process.env.FAUCET_CONFIG_PRIVKEY);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: '../faucet-service.env'})
}

console.log('val:', process.env.FAUCET_CONFIG_PRIVKEY);

var express = require('express');
var request = require('request');
var http = require('http');
var https = require('https');
// var staticServe = require('serve-static');
// var fs = require('fs');
var bodyParser = require('body-parser');
var redis = require('redis');
var redisClient = redis.createClient(6379);

// server
var app = express();

app.use(bodyParser.json()); // used for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-unlencoded

// Read the link below about express behind a proxy
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');

app.get('/', function (req, res) {
  res.send('Hello World')
  console.log(req);

})

app.listen(3000)
console.log('listening on 3000')
