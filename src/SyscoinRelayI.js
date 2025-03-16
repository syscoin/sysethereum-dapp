import CONFIGURATION from './config';
const address = CONFIGURATION.RelayContract;
const abi = [
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_blockNumber",
        "type": "uint64"
      },
      {
        "internalType": "bytes",
        "name": "_txBytes",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_txIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_txSiblings",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "_syscoinBlockHeader",
        "type": "bytes"
      }
    ],
    "name": "relayTx",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
var rconfig = {
  data: abi,
  contract: address
}

export default rconfig;