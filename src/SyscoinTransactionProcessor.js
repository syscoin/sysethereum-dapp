const tpabi = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "txHash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "destinationAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "superblockSubmitterAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "erc20ContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "assetGUID",
        "type": "uint32"
      },
      {
        "internalType": "uint8",
        "name": "precision",
        "type": "uint8"
      }
    ],
    "name": "processTransaction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "assetGUID",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "erc20ContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "precision",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "syscoinAddress",
        "type": "bytes"
      }
    ],
    "name": "freezeBurnERC20",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint32",
        "name": "bridgeTransferId",
        "type": "uint32"
      }
    ],
    "name": "cancelTransferRequest",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint32",
        "name": "bridgeTransferId",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "challengerAddress",
        "type": "address"
      }
    ],
    "name": "cancelTransferSuccess",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint32",
        "name": "bridgeTransferId",
        "type": "uint32"
      },
      {
        "internalType": "address payable",
        "name": "challengerAddress",
        "type": "address"
      }
    ],
    "name": "processCancelTransferFail",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
  export default tpabi;