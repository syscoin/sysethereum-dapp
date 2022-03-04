
import React, { Component } from 'react';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import CONFIGURATION from '../config';
// This function detects most providers injected at window.ethereum
import detectEthereumProvider from '@metamask/detect-provider';
import axios from 'axios';
const satoshibitcoin = require("satoshi-bitcoin");
const sjs = require('syscoinjs-lib');
const web3 = new Web3(Web3.givenProvider);
async function balanceTimerCallback (thisObj) {
  await axios.get(CONFIGURATION.FastSwapAPI + "balances")
  .then(function (response) {
      if(response.data.status === "success") {
        thisObj.state.SYSBALANCE = web3.utils.fromWei(response.data.data.sysbalance, 'ether')
        thisObj.state.sysBalanceLow = false
        if(web3.utils.toBN(response.data.data.sysbalance).lt(web3.utils.toBN(web3.utils.toWei('100', 'ether')))) {
          thisObj.state.sysBalanceLow = true
        }
        thisObj.state.NEVMBALANCE = web3.utils.fromWei(response.data.data.nevmbalance, 'ether')
        thisObj.state.nevmBalanceLow = false
        if(web3.utils.toBN(response.data.data.nevmbalance).lt(web3.utils.toBN(web3.utils.toWei('100', 'ether')))) {
          thisObj.state.nevmBalanceLow = true
        }
        thisObj.setState({SYSBALANCE: thisObj.state.SYSBALANCE,
          NEVMBALANCE: thisObj.state.NEVMBALANCE,
          nevmBalanceLow: thisObj.state.nevmBalanceLow,
          sysBalanceLow:  thisObj.state.sysBalanceLow
        })
      }
  })
  .catch(error => {
    console.error('Fast Swap balance fetch error:', error);
  });
  thisObj.balanceTimer = setTimeout(balanceTimerCallback, 10000, thisObj)
}
class Step1FS extends Component {
  constructor(props) {
    super(props);
    let storageExists = typeof(Storage) !== "undefined";
    this.state = {
      destinationAddress: "",
      amount: "",
      swapTxid: (storageExists && localStorage.getItem("swapTxid")) || "",
      buttonVal1: true,
      buttonValMsg1: "",
      buttonVal2: true,
      buttonValMsg2: "",
      buttonVal3: true,
      buttonValMsg3: "",
      working: false,
      fsDestinationAddress: "",
      fsStatus: "",
      fsAmount: "",
      fsType: "",
      fsSrcTx: "",
      fsDstTx: "",
      NEVMADDRESS: "",
      SYSADDRESS: "",
      MEMOHEADER: "",
      SYSBALANCE: "",
      NEVMBALANCE: "",
      sysBalanceLow: false,
      nevmBalanceLow: false

    };

    this.fastSwap = this.fastSwap.bind(this);
    this.sendUTXO = this.sendUTXO.bind(this);
    this.sendNEVM = this.sendNEVM.bind(this);
    this.syscoinjs = new sjs.SyscoinJSLib(null, CONFIGURATION.BlockbookAPIURL, CONFIGURATION.SysNetwork)
    if(this.balanceTimer){
      clearTimeout(this.balanceTimer)
      this.balanceTimer = null
    }
    balanceTimerCallback(this)
  }
  async componentDidMount() {
    var thisObj = this
    await axios.get(CONFIGURATION.FastSwapAPI + "settings")
    .then(function (response) {
        if(response.data.status === "success") {
          thisObj.state.NEVMADDRESS = response.data.data.NEVMADDRESS
          thisObj.state.SYSADDRESS = response.data.data.SYSADDRESS
          thisObj.state.MEMOHEADER = response.data.data.MEMO
          thisObj.setState({working: false, NEVMADDRESS: thisObj.state.NEVMADDRESS,
            SYSADDRESS: thisObj.state.SYSADDRESS,
            MEMOHEADER: thisObj.state.MEMOHEADER
          })
        } else if(response.data.status === "error") {
          thisObj.setState({working: true, buttonVal1: false, buttonValMsg1: thisObj.props.t("step1FSNoSettings"),buttonVal2: false, buttonValMsg2: thisObj.props.t("step1FSNoSettings")});
        } else {
          thisObj.setState({working: true, buttonVal1: false, buttonValMsg1: thisObj.props.t("step1FSNoSettings"),buttonVal2: false, buttonValMsg2: thisObj.props.t("step1FSNoSettings")});
        }
        
    })
    .catch(error => {
      console.error('Fast Swap settings fetch error:', error);
      thisObj.setState({working: true, buttonVal1: false, buttonValMsg1: thisObj.props.t("step1FSNoSettings"),buttonVal2: false, buttonValMsg2: thisObj.props.t("step1FSNoSettings")});
    });
  }
  componentWillUnmount() {
    clearTimeout(this.balanceTimer)
  }
  saveToLocalStorage() {
    if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      localStorage.setItem("swapTxid", this.state.swapTxid);
    } else {
      // Sorry! No Web Storage support..
    }
  }
  isString(s) {
    return (typeof s === 'string' || s instanceof String);
  }
  async sysToNEVM (amount, xpub, sysChangeAddress, destinationAddress) {
    const feeRate = new sjs.utils.BN(10)
    const memoHeader = Buffer.from( this.state.MEMOHEADER.data )
    const txOpts = { rbf: true, memo: Buffer.from(destinationAddress), memoHeader: memoHeader }
    const outputsArr = [
      { address: this.state.SYSADDRESS, value: new sjs.utils.BN(satoshibitcoin.toSatoshi(amount)) }
    ]
    const res = await this.syscoinjs.createTransaction(txOpts, sysChangeAddress, outputsArr, feeRate, xpub)
    let err = null
    if (!res) {
      err = 'Could not create transaction, not enough funds?';
      return {data: null, error: err}
    }
    const serializedResp = sjs.utils.exportPsbtToJson(res.psbt, res.assets);
    const signRes = await window.ConnectionsController.signAndSend(serializedResp);
    const unserializedResp = sjs.utils.importPsbtFromJson(signRes, CONFIGURATION.SysNetwork);
    return {swapTxid: unserializedResp.psbt.extractTransaction().getId(), error: null}
  }
  async sendUTXO() {
    if (!window.ConnectionsController) {
      this.setState({buttonVal1: false, buttonValMsg1: this.props.t("step2InstallPali")});
      return;  
    }
    let connectedAccount;
    try {
      connectedAccount = await window.ConnectionsController.getConnectedAccount()
      .catch(function(rejected){
        this.setState({buttonVal1: false, buttonValMsg1: rejected});
        return;  
      });
    } catch(e) {
      this.setState({buttonVal1: false, buttonValMsg1: e.message || e});
      return;  
    }
    const locked = await window.ConnectionsController.isLocked()
    if(locked) {
      this.setState({buttonVal1: true, buttonValMsg1: this.props.t("step2UnlockPali")});
    }
    if (!connectedAccount || locked) {
      await window.ConnectionsController.connectWallet()
    }
    let xpub;
    try {
      xpub = await window.ConnectionsController.getConnectedAccountXpub()
      .catch(function(rejected){
        this.setState({buttonVal1: false, buttonValMsg1: rejected});
        return;  
      });
    } catch(e) {
      this.setState({buttonVal1: false, buttonValMsg1: e.message || e});
      return;  
    }
    const sysChangeAddress = await window.ConnectionsController.getChangeAddress();
    if(!sysChangeAddress) {
      this.setState({buttonVal1: false, buttonValMsg1: this.props.t("step2SelectPaliAccount")});
      return;  
    }
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = userInput;
    validateNewInput.buttonVal1 = true;
    validateNewInput.buttonValMsg1 = "";
    let valid = true;
    var amount
    if(!userInput.amount || userInput.amount.toString() === "" || !userInput.destinationAddress || userInput.userInput === ""){
      validateNewInput.buttonVal1 = false;
      validateNewInput.buttonValMsg1 = this.props.t("step1FSInputMissing");
      valid = false;
    } else {
      amount = web3.utils.toWei(userInput.amount.toString(), 'ether');
      if(web3.utils.toBN(amount).gt(web3.utils.toBN(web3.utils.toWei(this.state.NEVMBALANCE, 'ether')))) {
        validateNewInput.buttonVal1 = false;
        validateNewInput.buttonValMsg1 = this.props.t("step1FSInsufficientBalanceNEVM");
        valid = false;
      }
      if (!web3.utils.isAddress(userInput.destinationAddress)) {
        validateNewInput.buttonVal1 = false;
        validateNewInput.buttonValMsg1 = this.props.t("step1FSInvalidDestination");
        valid = false;
      }
    }
    if(valid === false){
      this.setState({buttonVal1: validateNewInput.buttonVal1, buttonValMsg1: validateNewInput.buttonValMsg1});
      return;
    }
    let self = this;
    
    if(valid === true){
      this.setState({working: true});
    
      try {
        let results = await this.sysToNEVM(userInput.amount.toString(), xpub, sysChangeAddress, userInput.destinationAddress);
        if(results.error){
          validateNewInput.buttonVal1 = false;
          validateNewInput.buttonValMsg1 = results.error;
          self.setState({working: false});    
        }
        else if(results.swapTxid){
          validateNewInput.buttonVal1 = true;
          this.refs.swapTxid.value = results.swapTxid;
          this.state.swapTxid = results.swapTxid;
          validateNewInput.buttonValMsg1 = this.props.t("step3Success");
          this.setState({working: false});
          this.saveToLocalStorage();
        }
      }catch(e) {
        validateNewInput.buttonVal1 = false;
        validateNewInput.buttonValMsg1 = (e && e.message)? e.message: this.props.t("genericError");
        this.setState({working: false});
      }
      
    }
    this.setState({buttonVal1: validateNewInput.buttonVal1, buttonValMsg1: validateNewInput.buttonValMsg1}); 
  }
  async sendNEVM() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = userInput;
    validateNewInput.buttonVal2 = true;
    validateNewInput.buttonValMsg2 = "";
    let valid = true;
    var amount
    if(!userInput.amount || userInput.amount.toString() === "" || !userInput.destinationAddress || userInput.userInput === ""){
      validateNewInput.buttonVal2 = false;
      validateNewInput.buttonValMsg2 = this.props.t("step1FSInputMissing");
      valid = false;
    } else {
      amount = web3.utils.toWei(userInput.amount.toString(), 'ether');
      if(web3.utils.toBN(amount).gt(web3.utils.toBN(web3.utils.toWei(this.state.SYSBALANCE, 'ether')))) {
        validateNewInput.buttonVal2 = false;
        validateNewInput.buttonValMsg2 = this.props.t("step1FSInsufficientBalanceSYS");
        valid = false;
      }
      try {
        sjs.utils.bitcoinjs.address.toOutputScript(userInput.destinationAddress, CONFIGURATION.SysNetwork)
      } catch (e) {
        console.log('e ' + e.message, " address " + userInput.destinationAddress)
        validateNewInput.buttonVal2 = false;
        validateNewInput.buttonValMsg2 = this.props.t("step1FSInvalidDestination");
        valid = false;
      }  
    } 
    if(valid === false){
      this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
      return;
    }
    const provider = await detectEthereumProvider();
    if(!provider){
      validateNewInput.buttonVal2 = false;
      validateNewInput.buttonValMsg2 = this.props.t("step3InstallMetamask");
      this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
      return;  
    }
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      validateNewInput.buttonVal2 = false;
      validateNewInput.buttonValMsg2 = this.props.t("step3LoginMetamask");
      this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CONFIGURATION.ChainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: CONFIGURATION.ChainId,
              chainName: CONFIGURATION.ChainName,
              nativeCurrency: {
                  name: CONFIGURATION.NativeCurrencyName,
                  symbol: CONFIGURATION.NativeCurrencySymbol,
                  decimals: 18
              },
              rpcUrls: [CONFIGURATION.Web3URL],
              blockExplorerUrls: [CONFIGURATION.NEVMExplorerURL]
              }],
          });
        } catch (addError) {
          validateNewInput.buttonVal2 = false;
          validateNewInput.buttonValMsg2 = addError.message;
          this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
          return;
        }
      } else {
        validateNewInput.buttonVal2 = false;
        validateNewInput.buttonValMsg2 = switchError.message;
        this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
        return;
      }
    }
    let ChainId = await web3.eth.getChainId();
    if(ChainId !== parseInt(CONFIGURATION.ChainId, 16)){
      validateNewInput.buttonVal2 = false;
      validateNewInput.buttonValMsg2 = "Invalid network";
      this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2}); 
      return;        
    } 
    this.setState({working: true});
    validateNewInput.buttonValMsg2 = this.props.t("step3AuthMetamask");
 
    let thisObj = this;
    web3.eth.sendTransaction({from: accounts[0], gas: 400000, to: this.state.NEVMADDRESS, value: amount.toString(), input: web3.utils.asciiToHex(userInput.destinationAddress)})
      .once('transactionHash', function(hash){
        validateNewInput.buttonVal2 = true;
        validateNewInput.swapTxid = hash;
        validateNewInput.buttonValMsg2 = thisObj.props.t("step3Success");
        thisObj.setState({working: false});
        thisObj.setState({swapTxid: hash, buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2});
        thisObj.refs.swapTxid.value = hash;
        thisObj.saveToLocalStorage();
      })
      .on('error', (error) => {
        thisObj.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(message.indexOf("might still be mined") === -1) {
          validateNewInput.buttonVal2 = false;
          validateNewInput.buttonValMsg2 = message; 
          thisObj.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2});
        }
      })
      this.setState({buttonVal2: validateNewInput.buttonVal2, buttonValMsg2: validateNewInput.buttonValMsg2});
  }
  _grabUserInput() {
    return {
      destinationAddress: this.refs.destinationAddress.value,
      amount: this.refs.amount.value
    };
  }
  statusToDisplay(status) {
    if(!status) {
      return this.props.t("step1FSStatusComplete");
    } else if(status === 1) {
      return this.props.t("step1FSStatusReceived");
    } else if(status === 2) {
      return this.props.t("step1FSStatusSent");
    } else {
      return this.props.t("step1FSStatusUnknown");
    }
  }
  async fastSwap() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = userInput;
    validateNewInput.buttonVal3 = true;
    validateNewInput.buttonValMsg3 = "";
    const txid = this.refs.swapTxid.value;
    if(!txid || txid === ""){
      validateNewInput.buttonVal3 = false;
      validateNewInput.buttonValMsg3 = this.props.t("step1FSMissingTxid");
      this.setState({buttonVal3: validateNewInput.buttonVal3, buttonValMsg3: validateNewInput.buttonValMsg3});
      return;  
    }   
    let thisObj = this; 
    await axios.post(CONFIGURATION.FastSwapAPI + "/fastswap/" + txid, {txid: txid})
    .then(function (response) {
        if(response.data.status === "success") {
          thisObj.state.fsStatus = thisObj.statusToDisplay(response.data.data.status)
          thisObj.state.fsAmount = web3.utils.fromWei(response.data.data.amount, 'ether') + " SYS"
          thisObj.state.fsType = response.data.data.type
          if (thisObj.state.fsType === "utxo") {
            thisObj.state.fsSrcTx = CONFIGURATION.SyscoinTxExplorerURL + response.data.data.srctxid
            thisObj.state.fsDstTx = ""
            if(response.data.data.dsttxid) {
              thisObj.state.fsDstTx = CONFIGURATION.NEVMTxExplorerURL + response.data.data.dsttxid
            }
          } else if (thisObj.state.fsType === "nevm") {
            thisObj.state.fsSrcTx = CONFIGURATION.NEVMTxExplorerURL + response.data.data.srctxid
            thisObj.state.fsDstTx = ""
            if(response.data.data.dsttxid) {
              thisObj.state.fsDstTx = CONFIGURATION.SyscoinTxExplorerURL + response.data.data.dsttxid
            }
          }
          thisObj.state.fsDestinationAddress = response.data.data.dstaddress
          thisObj.setState({fsStatus: thisObj.state.fsStatus,
            fsAmount: thisObj.state.fsAmount,
            fsType: thisObj.state.fsType,
            fsSrcTx: thisObj.state.fsSrcTx,
            fsDstTx: thisObj.state.fsDstTx,
            fsDestinationAddress: thisObj.state.fsDestinationAddress
          })
        } else if(response.data.status === "error") {
          validateNewInput.buttonVal3 = false
          validateNewInput.buttonValMsg3 = response.data.data
        } else {
          validateNewInput.buttonVal3 = false
          validateNewInput.buttonValMsg3 = "Unknown error"
        }
        
    })
    .catch(error => {
      console.error('Fast Swap error:', error);
      if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
        error = JSON.parse(error.message.substring(error.message.indexOf("{")));
      }
      let message = error.message.toString();
      validateNewInput.buttonVal3 = false;
      validateNewInput.buttonValMsg3 = message;
    });
    this.setState({buttonVal3: validateNewInput.buttonVal3, buttonValMsg3: validateNewInput.buttonValMsg3});
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};    
    if (typeof this.state.buttonVal1 == 'undefined' || this.state.buttonVal1) {
      notValidClasses.buttonCls1 = 'has-success';
      notValidClasses.buttonValGrpCls1 = 'val-success-tooltip'; // use 'active' class if you want to actually use this (green) tooltip
    }
    else {
       notValidClasses.buttonCls1 = 'has-error';
       notValidClasses.buttonValGrpCls1 = 'val-err-tooltip';
    }   
    if (typeof this.state.buttonVal2 == 'undefined' || this.state.buttonVal2) {
      notValidClasses.buttonCls2 = 'has-success';
      notValidClasses.buttonValGrpCls2 = 'val-success-tooltip'; // use 'active' class if you want to actually use this (green) tooltip
    }
    else {
       notValidClasses.buttonCls2 = 'has-error';
       notValidClasses.buttonValGrpCls2 = 'val-err-tooltip';
    }  
    if (typeof this.state.buttonVal3 != 'undefined' && !this.state.buttonVal3) {
      notValidClasses.buttonCls3 = 'has-error';
      notValidClasses.buttonValGrpCls3 = 'val-err-tooltip';
    }
    if(this.state.sysBalanceLow) {
      notValidClasses.sysBalanceCls = "text-danger"
    } else {
      notValidClasses.sysBalanceCls = "text-success"
    }
    if(this.state.nevmBalanceLow) {
      notValidClasses.nevmBalanceCls = "text-danger"
    } else {
      notValidClasses.nevmBalanceCls = "text-success"
    }
    return (
      <div className="step Step1FS">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1>{this.props.t("step1FSHead")}</h1>
                <h3 dangerouslySetInnerHTML={{__html: this.props.t("step1FSDescription")}}></h3>
              </label>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step1FSEnterAmount")}
                </label>
                <div>
                  <input
                    ref="amount"
                    autoComplete="off"
                    type="number"
                    placeholder={this.props.t("step1FSEnterAmount")}
                    className="form-control"
                    defaultValue={this.state.amount}
                     />
                     <small className="text-muted">SYS Balance: <b className={notValidClasses.sysBalanceCls}>{this.state.SYSBALANCE}</b>    NEVM Balance: <b className={notValidClasses.nevmBalanceCls}>{this.state.NEVMBALANCE}</b></small>
                </div>
              </div>
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step1FSEnterDestination")}
                </label>
                <div>
                  <input
                    ref="destinationAddress"
                    autoComplete="off"
                    type="string"
                    placeholder={this.props.t("step1FSEnterDestination")}
                    className="form-control"
                    defaultValue={this.state.destinationAddress}
                     />
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12 btn-group">
                <div className={notValidClasses.buttonCls1}>
                    <button disabled={this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1FSSendUTXO")} onClick={this.sendUTXO}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1FSSendUTXO")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls1}>{this.state.buttonValMsg1}</div>
                </div>
                <div className={notValidClasses.buttonCls2}>
                    <button disabled={this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1FSSendNEVM")} onClick={this.sendNEVM}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1FSSendNEVM")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls2}>{this.state.buttonValMsg2}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("txidLabel")}
                </label>
                <div>
                  <input
                    ref="swapTxid"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step1FSEnterTx")}
                    className="form-control"
                    required
                    defaultValue={this.state.swapTxid}/>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-4 col-sm-12 col-centered">
                <div className={notValidClasses.buttonCls3}>
                    <button disabled={this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1FSStartButton")} onClick={this.fastSwap}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1FSStartButton")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls3}>{this.state.buttonValMsg3}</div>
                </div>
              </div>
              </div>
              <div className="row">
                  <div className="col-md-12">
                    <Tabs>
                      <TabList>
                        <Tab>{this.props.t("tabGeneral")}</Tab>
                      </TabList>
                      <TabPanel>
                        <code className="block">
                            <span className="dataname">{this.props.t("step1FSStatus")}:</span> <span className="result">{this.state.fsStatus}</span><br />
                            <span className="dataname">{this.props.t("step1FSAmount")}:</span> <span className="result">{this.state.fsAmount}</span><br />
                            <span className="dataname">{this.props.t("step1FSType")}:</span> <span className="result">{this.state.fsType}</span><br />
                            <span className="dataname">{this.props.t("step1FSDestinationAddress")}:</span> <span className="result">{this.state.fsDestinationAddress}</span><br />
                            <span className="dataname">{this.props.t("step1FSSrcTx")}:</span> <span className="result"><a href={this.state.fsSrcTx} target="_blank" rel="noopener noreferrer">{this.state.fsSrcTx}</a></span><br />
                            <span className="dataname">{this.props.t("step1FSDstTx")}:</span> <span className="result"><a href={this.state.fsDstTx} target="_blank" rel="noopener noreferrer">{this.state.fsDstTx}</a></span><br />
                        </code>
                      </TabPanel>
                    </Tabs>
                  </div>
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step1FS;
