var rpc = require("ethrpc");
var connectionConfiguration = {
  httpAddresses: [process.env.FAUCET_CONFIG_ETH_NODE_URL],
  networkID: 1234,
  connectionTimeout: 3000,
  errorHandler: function (err) { return err; }
};
rpc.connect(connectionConfiguration, function (err) {
  if (err) {
    console.error("Failed to connect to Ethereum node.");
  } else {
    console.log("Connected to Ethereum node!");
  }
});

rpc.raw("net_peerCount");

var payload = {
  to: process.env.FAUCET_CONFIG_MEDXTOKEN_CONTRACT_ADDRESS,
  name: "mint",
  signature: ["address", "uint256"],
  params: ["0x5669"], // parameter value(s)
  send: false,
  returns: "bool",
  from: '0x09C0048e162455B981a6cAa2815469dFEA18759D'
};
var callback = function(hello, there) { console.log(hello, there); return true; }
rpc.callOrSendTransaction(payload, callback);
