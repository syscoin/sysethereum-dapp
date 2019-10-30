import CONFIGURATION from './config';
const address = CONFIGURATION.superblockContract;
const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_blocksMerkleRoot",
        "type": "bytes32"
      },
      {
        "name": "_accumulatedWork",
        "type": "uint256"
      },
      {
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "name": "_lastHash",
        "type": "bytes32"
      },
      {
        "name": "_lastBits",
        "type": "uint32"
      },
      {
        "name": "_parentId",
        "type": "bytes32"
      },
      {
        "name": "submitter",
        "type": "address"
      }
    ],
    "name": "propose",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
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
        "name": "superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblock",
    "outputs": [
      {
        "name": "_blocksMerkleRoot",
        "type": "bytes32"
      },
      {
        "name": "_accumulatedWork",
        "type": "uint256"
      },
      {
        "name": "_timestamp",
        "type": "uint256"
      },
      {
        "name": "_lastHash",
        "type": "bytes32"
      },
      {
        "name": "_lastBits",
        "type": "uint32"
      },
      {
        "name": "_parentId",
        "type": "bytes32"
      },
      {
        "name": "_submitter",
        "type": "address"
      },
      {
        "name": "_status",
        "type": "uint8"
      },
      {
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
        "name": "_txBytes",
        "type": "bytes"
      },
      {
        "name": "_txIndex",
        "type": "uint256"
      },
      {
        "name": "_txSiblings",
        "type": "uint256[]"
      },
      {
        "name": "_syscoinBlockHeader",
        "type": "bytes"
      },
      {
        "name": "_syscoinBlockIndex",
        "type": "uint256"
      },
      {
        "name": "_syscoinBlockSiblings",
        "type": "uint256[]"
      },
      {
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "relayTx",
    "outputs": [
      {
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
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "confirm",
    "outputs": [
      {
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
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "name": "_challenger",
        "type": "address"
      }
    ],
    "name": "challenge",
    "outputs": [
      {
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
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "semiApprove",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "bytes32"
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
        "name": "_superblockHash",
        "type": "bytes32"
      },
      {
        "name": "_validator",
        "type": "address"
      }
    ],
    "name": "invalidate",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
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
    "inputs": [],
    "name": "getBestSuperblock",
    "outputs": [
      {
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
        "name": "superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockHeight",
    "outputs": [
      {
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
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockParentId",
    "outputs": [
      {
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
        "name": "_superblockHash",
        "type": "bytes32"
      }
    ],
    "name": "getSuperblockStatus",
    "outputs": [
      {
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
        "name": "_height",
        "type": "uint256"
      }
    ],
    "name": "getSuperblockAt",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
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