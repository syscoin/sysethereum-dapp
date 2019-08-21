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
        "name": "superblockSubmitterAddress",
        "type": "address"
      },
      {
        "name": "erc20ContractAddress",
        "type": "address"
      },
      {
        "name": "assetGUID",
        "type": "uint32"
      },
      {
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
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "assetGUID",
        "type": "uint32"
      },
      {
        "name": "erc20ContractAddress",
        "type": "address"
      },
      {
        "name": "precision",
        "type": "uint8"
      },
      {
        "name": "syscoinAddress",
        "type": "bytes"
      }
    ],
    "name": "freezeBurnERC20",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
  export default tpabi;