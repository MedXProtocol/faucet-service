const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.FAUCET_CONFIG_ETH_NODE_URL));

// requires leading '0x' ! not the pure metamask exported key
const PRIVATE_KEY = process.env.FAUCET_CONFIG_PRIVKEY;
const contractOwnerAddress = '0x09c0048e162455b981a6caa2815469dfea18759d';

const contractAddress = process.env.FAUCET_CONFIG_TOKEN_CONTRACT_ADDRESS;
const recipientAddress = '0xc5dc4aadf45a8c8cfa5460f2a14175c45ac8528d';

const tokenAmount = "1000"

const mintFunctionName = 'mint'

const mintFunctionSignature = [{
    type: 'address',
    name: '_to'
  },{
    type: 'uint256',
    name: '_amount'
  }]


function encodeFunctionCall(recipientAddress, tokenAmount) {
  return web3.eth.abi.encodeFunctionCall({
    name: mintFunctionName,
    type: 'function',
    inputs: mintFunctionSignature
  }, [
    recipientAddress,
    web3.utils.toHex(tokenAmount)
  ]);
}


// web3.eth.estimateGas({
//      "from"      : contractOwnerAddress,
//      "to"        : contractAddress,
//      "data"      : txData
// }).then(console.log)

function buildContractTxObject(recipientAddress, tokenAmount) {
  let data = encodeFunctionCall(recipientAddress, tokenAmount)
  console.log(data)
  const txObject = {
    to: contractAddress,
    // value: web3.utils.toHex("1000"), // adding value to send to contract throws out of gas error
    data: data,
    gas: web3.utils.toHex(202114), // 102114
    gasPrice: web3.utils.toHex(20), // 20
    from: contractOwnerAddress
  }
  console.log('built txObject: ' + txObject.toString())

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

  console.log('rawTx is: ' + rawTx);

  return rawTx
}

async function sendSignedTransaction(rawTx) {
  let promiEvent = web3.eth.sendSignedTransaction(rawTx)
    .on('transactionHash', function(txHash) {
      console.log("txHash is: " + txHash)
      return txHash
    })
    .on('error', console.error)
    .on('receipt', function(a) {console.log(a)})
    .on('confirmation', function(a) {console.log(a)})
    .catch(error => {
      console.error(error);
    });


  console.log('promiEvent is: ' + promiEvent);

  return promiEvent;
}

let sendSignedTokenTransaction = async function(ethAddress) {
  const amount = 1000

  const txObject = buildContractTxObject(ethAddress, amount);
  const rawTx = await signTransaction(txObject)
  const promiEvent = await sendSignedTransaction(rawTx);

  return promiEvent;
}

sendSignedTokenTransaction(recipientAddress)

module.exports = {
  sendEther: function(ethAddress) {
    return "HELLO";
  },

  sendToken: sendSignedTokenTransaction
};
