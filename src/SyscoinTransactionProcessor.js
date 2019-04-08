const tpabi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "txHash",
        "type": "uint256"
      },
      {
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "destinationAddress",
        "type": "address"
      },
      {
        "name": "_assetGUID",
        "type": "uint32"
      },
      {
        "name": "superblockSubmitterAddress",
        "type": "address"
      }
    ],
    "name": "processTransaction",
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
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_assetGUID",
        "type": "uint32"
      },
      {
        "name": "syscoinWitnessProgram",
        "type": "bytes"
      }
    ],
    "name": "burn",
    "outputs": [
      {
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
]
  export default tpabi;