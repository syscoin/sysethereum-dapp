import CONFIGURATION from './config';
const address = CONFIGURATION.superblockContract;
const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_blocksMerkleRoot",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_mtpTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_lastHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "_lastBits",
        "type": "uint32"
      },
      {
        "internalType": "bytes32",
        "name": "_parentId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "propose",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblock",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "_blocksMerkleRoot",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_mtpTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_lastHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "_lastBits",
        "type": "uint32"
      },
      {
        "internalType": "bytes32",
        "name": "_parentId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_submitter",
        "type": "address"
      },
      {
        "internalType": "enum SyscoinSuperblocksI.Status",
        "name": "_status",
        "type": "uint8"
      },
      {
        "internalType": "uint32",
        "name": "_height",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
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
      },
      {
        "internalType": "uint256",
        "name": "_syscoinBlockIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_syscoinBlockSiblings",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
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
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "confirm",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_challenger",
        "type": "address"
      }
    ],
    "name": "challenge",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "semiApprove",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "invalidate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBestSuperblock",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getChainHeight",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockHeight",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockParentId",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockStatus",
    "outputs": [
      {
        "internalType": "enum SyscoinSuperblocksI.Status",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_height",
        "type": "uint256"
      }
    ],
    "name": "getSuperblockAt",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockMedianTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
var sbconfig = {
  data: abi,
  contract: address
}

export default sbconfig;