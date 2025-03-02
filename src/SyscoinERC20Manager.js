const erc20Managerabi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_trustedRelayerContract",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_sysxGuid",
        "type": "uint32"
      },
      {
        "internalType": "address",
        "name": "_erc20ContractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "assetGUID",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "freezer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "precisions",
        "type": "uint256"
      }
    ],
    "name": "TokenFreeze",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "assetGuid",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "erc20ContractAddress",
        "type": "address"
      }
    ],
    "name": "TokenRegistry",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "assetGUID",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "receipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "TokenUnfreeze",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "assetBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "name": "assetRegistry",
    "outputs": [
      {
        "internalType": "address",
        "name": "erc20ContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint64",
        "name": "height",
        "type": "uint64"
      },
      {
        "internalType": "uint8",
        "name": "precision",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "trustedRelayerContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "txHash",
        "type": "uint256"
      }
    ],
    "name": "wasSyscoinTxProcessed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
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
        "internalType": "uint32",
        "name": "assetGUID",
        "type": "uint32"
      }
    ],
    "name": "processTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_txHash",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "_assetGUID",
        "type": "uint32"
      },
      {
        "internalType": "uint64",
        "name": "_height",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "_erc20ContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_precision",
        "type": "uint8"
      }
    ],
    "name": "processAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
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
        "internalType": "string",
        "name": "syscoinAddress",
        "type": "string"
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
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  }
]
  export default erc20Managerabi;