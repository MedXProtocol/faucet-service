const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.FAUCET_CONFIG_ETH_NODE_URL));

// requires leading '0x' ! not the pure metamask exported key
const PRIVATE_KEY = process.env.FAUCET_CONFIG_PRIVKEY;
const CONTRACT_OWNER_ADDRESS = '0x09c0048e162455b981a6caa2815469dfea18759d';

const CONTRACT_ADDRESS = process.env.FAUCET_CONFIG_TOKEN_CONTRACT_ADDRESS;

const TOKEN_AMOUNT = "1000"

const MINT_FUNCTION_NAME = 'mint'

const MINT_FUNCTION_INPUTS = [{
    type: 'address',
    name: '_to'
  },{
    type: 'uint256',
    name: '_amount'
  }]


function encodeFunctionCall(recipientAddress) {
  return web3.eth.abi.encodeFunctionCall({
    name: MINT_FUNCTION_NAME,
    type: 'function',
    inputs: MINT_FUNCTION_INPUTS
  }, [
    recipientAddress,
    web3.utils.toHex(TOKEN_AMOUNT)
  ]);
}


// web3.eth.estimateGas({
//      "from"      : CONTRACT_OWNER_ADDRESS,
//      "to"        : CONTRACT_ADDRESS,
//      "data"      : txData
// }).then(console.log)

function buildEtherTxObject(recipientAddress) {
  const txObject = {
    to: recipientAddress,
    value: web3.utils.toHex("1000"), // adding value to send to contract throws out of gas error
    gas: web3.utils.toHex(21000), // 21000 is expected gas for an ETH value transfer
    gasPrice: web3.utils.toHex(20), // 20
    from: CONTRACT_OWNER_ADDRESS
  }
  console.log('buildEtherTxObject: ' + JSON.stringify(txObject, null, 4));

  return txObject
}

function buildContractTxObject(recipientAddress) {
  let data = encodeFunctionCall(recipientAddress)
  console.log(data)
  const txObject = {
    to: CONTRACT_ADDRESS,
    // value: web3.utils.toHex("1000"), // adding value to send to contract throws out of gas error
    data: data,
    gas: web3.utils.toHex(122114), // 102114
    gasPrice: web3.utils.toHex(90), // 20
    from: CONTRACT_OWNER_ADDRESS
  }
  console.log('built txObject: ' + JSON.stringify(txObject, null, 4));

  return txObject
}

async function signTransaction(txObject) {
  let rawTx

  await web3.eth.accounts.signTransaction(txObject, PRIVATE_KEY)
    .then(result => {
      console.log(result);
      rawTx = result.rawTransaction
    })
    .catch(error => {
      console.error(error);
    });

  return rawTx
}

async function sendSignedTransaction(rawTx) {
  let promiEvent = web3.eth.sendSignedTransaction(rawTx)
    .on('transactionHash', function(txHash) {
      console.log("txHash is: " + txHash)
      return txHash
    })
    // .on('receipt', function(a) {console.log(a)})
    // .on('confirmation', function(a) {console.log(a)})
    .catch(error => {
      console.error(error);
    });

  console.log('promiEvent is: ' + promiEvent);

  return promiEvent;
}

// Sending data to a contract's function
let sendSignedTokenTransaction = async function(ethAddress) {
  const txObject = buildContractTxObject(ethAddress);
  const rawTx = await signTransaction(txObject)
  const promiEvent = await sendSignedTransaction(rawTx);

  return promiEvent;
}

// Sending pure value of ether
let sendEtherTransaction = async function(ethAddress) {
  const txObject = buildEtherTxObject(ethAddress);
  const rawTx = await signTransaction(txObject)
  const promiEvent = await sendSignedTransaction(rawTx);

  return promiEvent;
}

const recipientAddress = '0xc5dc4aadf45a8c8cfa5460f2a14175c45ac8528d';
sendSignedTokenTransaction(recipientAddress)
// sendEtherTransaction(recipientAddress)

module.exports = {
  sendEther: sendEtherTransaction,
  sendToken: sendSignedTokenTransaction
};
