import React, { Component } from 'react';
import './SysethereumDApp.css';
import web3 from './web3';
import SysToEthWizardi18n from './wizard/SysToEthWizard';
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
import * as SyscoinRpc from 'syscoin-js';
class SysethereumDApp extends Component {
  // intro paragraph
  // choice a: walk to ethereum
    // step 1: create syscoin burn tx or skip if manual mode
      // INPUTS:
      // enter asset guid if applicable
      // enter funding address
      // enter amount
      // enter ethereum address to receive
      // OUTPUT: 
      // raw transaction, call syscointxfund with funding address, then get user to 
    // step 2: sign syscoin burn tx
      // INPUTS:
        // raw transaction (autofilled)
      // OUTPUTS:
        // get user to open syscoind and sign/send
    // step 3: get syscoin spv proof
      // INPUTS:
      // enter syscoin burn txid
      // enter block hash 
      // OUTPUTS:
      // _txIndex - transaction's index within the block
      // _txSiblings - transaction's Merkle siblings
      // _syscoinBlockHeader - block header containing transaction
    // step 4: get superblock spv proof
      // INPUTS:
      // enter block hash (auto fill from step 3) (show approval status of superblock, and how many superblocks to go to approve)
      // OUTPUTS:
      // _syscoinBlockIndex - block's index withing superblock
      // _syscoinBlockSiblings - block's merkle siblings
      // _superblockHash - superblock containing block header
    // step 5: 
      // INPUTS:
      // _txBytes - transaction bytes (autofilled with getrawtransaction)
      // _untrustedTargetContract - the contract that is going to process the transaction (input from assetinfo or genesis param)
      // OUTPUTS:
      // in loop, balance of ethereum address in target contract updated by "amount"
      // success or fail message
  // choice b: walk to syscoin
  state = {
        // @param _txBytes - transaction bytes
    // @param _txIndex - transaction's index within the block
    // @param _txSiblings - transaction's Merkle siblings
    // @param _syscoinBlockHeader - block header containing transaction
    // @param _syscoinBlockIndex - block's index withing superblock
    // @param _syscoinBlockSiblings - block's merkle siblings
    // @param _superblockHash - superblock containing block header
    // @param _untrustedTargetContract - the contract that is going to process the transaction
  };

  async componentDidMount() {
    let syscoinClient = new SyscoinRpc.default({baseUrl: "localhost", port: "8368", username: "u", password: "p"});

    try {
      console.log("RESULT", (await syscoinClient.callRpc("getinfo", [])) );
    }catch(e) {
      console.log("ERR getinfo", e);
    }
  }

  onAuctionToEthereum = async (event) => {
    event.preventDefault();
    // get syscoin spv proof from syscoin rpc
    // get superblock spv proof from agent
    const accounts = await web3.eth.getAccounts();
    /*await currentSuperblock.methods.relayTx(this.state.currentSuperblock).send({
      from: accounts[0]
    });*/

  }
  onCreateSyscoinBurnTx = async (event) => {
    event.preventDefault();
    //
    // get syscoin spv proof from syscoin rpc
    // get superblock spv proof from agent

  }
  onGetProofsForEthereum = async (event) => {
    event.preventDefault();
    //
    // get syscoin spv proof from syscoin rpc
    // get superblock spv proof from agent
  
  }
  render() {
    return (
          <I18nextProvider i18n={i18n}>
            <SysToEthWizardi18n />
          </I18nextProvider>
    );
  }
}

export default SysethereumDApp;
