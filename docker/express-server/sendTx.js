var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

web3 = new Web3(new Web3.providers.HttpProvider(process.env.FAUCET_CONFIG_ETH_NODE_URL));

// requires leading '0x' ! not the pure metamask exported key
var privateKey = process.env.FAUCET_CONFIG_PRIVKEY;
var contractOwnerAddress = '0x09c0048e162455b981a6caa2815469dfea18759d';

var contractAddress = process.env.FAUCET_CONFIG_MEDXTOKEN_CONTRACT_ADDRESS;
var recipientAddress = '0x37f1067a4c0983f9903e0e745b6990dcecfbaf31';

var medXAmount = "1000"

// Data to be sent in transaction, converted into a hex value. Normal tx's do not need this and use '0x' as default, but who wants to be normal?
var txData = web3.eth.abi.encodeFunctionCall({
  name: 'mint',
  type: 'function',
  inputs: [{
    type: 'address',
    name: '_to'
  },{
    type: 'uint256',
    name: '_amount'
  }]
}, [recipientAddress, web3.utils.toHex(medXAmount)]);

// web3.eth.estimateGas({
//      "from"      : contractOwnerAddress,
//      "to"        : contractAddress,
//      "data"      : txData
// }).then(console.log)

var rawTx = {
  to: contractAddress,
  // value: web3.utils.toHex("1000"), // adding value to send to contract throws out of gas error
  data: txData,
  gas: web3.utils.toHex(202114), // 102114
  gasPrice: web3.utils.toHex(20), // 20
  from: contractOwnerAddress
}

web3.eth.accounts.signTransaction(rawTx, privateKey).then((result) => {
  console.log(result);
  rawTx = result.rawTransaction
});

web3.eth.sendSignedTransaction(rawTx).on('transactionHash', function(a) {console.log(a)}).on('error', console.error).on('receipt', function(a) {console.log(a)}).on('confirmation', function(a) {console.log(a)});
