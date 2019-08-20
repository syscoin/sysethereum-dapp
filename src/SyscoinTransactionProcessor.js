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