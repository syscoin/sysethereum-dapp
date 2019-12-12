
import React, { Component } from 'react';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import tpabi from '../SyscoinTransactionProcessor';  
import CONFIGURATION from '../config';
const axios = require('axios');
const web3 = new Web3(Web3.givenProvider);
class Step1ESC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptStatus: '',
      receiptTxHash: '',
      receiptObj: '',
      bridgeTransferId: '',
      requesttimestamp: '',
      value: '',
      freezer: '',
      erc: '', 
      spt: '',
      status: '',
      working: false,
      allowNewCancel: false,
      allowTimeout: false,
      buttonVal: true,
      buttonValMsg: "",
      searchError: ""
    };
    this.searchBridgeTransfer = this.searchBridgeTransfer.bind(this);
    this.cancelBridgeTransaction = this.cancelBridgeTransaction.bind(this);
    this.timeoutBridgeTransaction = this.timeoutBridgeTransaction.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
    this.setStateFromReceipt = this.setStateFromReceipt.bind(this);
  }
  componentDidMount() {
    
  }
  componentWillUnmount() {}
  downloadReceipt () {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(this.state.receiptObj, null, "   ")], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "receipt.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }


  async setStateFromReceipt(receipt, error) {
    if(receipt.transactionHash && this.state.receiptTxHash !== receipt.transactionHash){
      return;
    }
    if(receipt.status  && receipt.status !== "1" && receipt.status !== true && receipt.status !== "true" && receipt.status !== "0x1"){
      error = this.props.t("step5ErrorEVMCheckLog");
      return;
    }
    this.setState({receiptObj: receipt, receiptStatus: receipt.status === true? "true":"false", receiptTxHash: receipt.transactionHash});
    if(error !== null){
      this.setState({buttonVal: false, buttonValMsg: error}); 
    }
    await this.getBridgeTransferDetails(this.state.bridgeTransferId, error === null);
  }

  
  async cancelBridgeTransaction() {
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5InstallMetamask")});
      return;  
    }
    let chainId = await web3.eth.getChainId();
    if(CONFIGURATION.testnet && chainId !== 4){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseTestnet")});
      return;        
    } else if(!CONFIGURATION.testnet && chainId !== 1){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseMainnet")});
      return;        
    }
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5LoginMetamask")});
      if(window.ethereum){
        await window.ethereum.enable();
      }
      return;
    }
    
    this.setState({working: true});
    this.state.receiptObj = null;
    let syscoinTransactionProcessor = new web3.eth.Contract(tpabi,  CONFIGURATION.ERC20Manager);
    syscoinTransactionProcessor.methods.cancelTransferRequest(this.state.bridgeTransferId).send({from: this.state.freezer, gas: 500000})
      .on('transactionHash', function(hash){
        this.setState({working: true, receiptTxHash: hash, buttonVal: false, buttonValMsg: this.props.t("step5AuthMetamask")});
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        if(this.state.receiptObj === null){
          this.setStateFromReceipt(receipt, null);
          this.setState({working: false});
        }
      })
      .on('error', (error, receipt) => {
        this.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          this.setStateFromReceipt(receipt, message);
        }
        else{
          this.setState({buttonVal: false, buttonValMsg: message});
        }
      })
  }
  async timeoutBridgeTransaction() {
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5InstallMetamask")});
      return;  
    }
    let chainId = await web3.eth.getChainId();
    if(CONFIGURATION.testnet && chainId !== 4){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseTestnet")});
      return;        
    } else if(!CONFIGURATION.testnet && chainId !== 1){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseMainnet")});
      return;        
    }
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5LoginMetamask")});
      if(window.ethereum){
        await window.ethereum.enable();
      }
      return;
    }
    
    this.setState({working: true});
    this.state.receiptObj = null;
    let syscoinTransactionProcessor = new web3.eth.Contract(tpabi,  CONFIGURATION.ERC20Manager);
    syscoinTransactionProcessor.methods.cancelTransferSuccess(this.state.bridgeTransferId).send({from: this.state.freezer, gas: 500000})
      .on('transactionHash', function(hash){
        this.setState({working: true, receiptTxHash: hash, buttonVal: false, buttonValMsg: this.props.t("step5AuthMetamask")});
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        if(this.state.receiptObj === null){
          this.setStateFromReceipt(receipt, null);
          this.setState({working: false});
        }
      })
      .on('error', (error, receipt) => {
        this.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          this.setStateFromReceipt(receipt, message);
        }
        else{
          this.setState({buttonVal: false, buttonValMsg: message});
        }
      })
  }
  getStatus(status){
    if(status === 0){
      return "Unitialized";
    } else if(status === 1){
      return "Ok";
    } else if(status === 2){
      return "CancelRequested";
    } else if(status === 3){
      return "CancelChallenged";
    } else if(status === 4){
      return "CancelOk";
    }
  }
  async getBridgeTransferDetails(setButtonState){
    let syscoinTransactionProcessor = new web3.eth.Contract(tpabi,  CONFIGURATION.ERC20Manager);
    const bridgeTransferDetails = await syscoinTransactionProcessor.methods.getBridgeTransfer(this.state.bridgeTransferId).call();
    let statusValue = this.getStatus(bridgeTransferDetails.status);
    let buttonTimeoutVal = false;
    let buttonNewCancelVal = false;
    let buttonVal = false;
    let buttonValMsg = "";
    if(statusValue === "CancelRequested"){
      if(Date.now() - bridgeTransferDetails.timestamp < 3600){
        buttonVal = true;
        buttonValMsg = this.props.t("step1ESCWaitOneHr");
      }
      else{
        buttonTimeoutVal = true;
        buttonVal = true;
        buttonValMsg = this.props.t("step1ESCCancellRequested");
      }
    }
    else if(statusValue === "CancelChallenged"){
      buttonVal = false;
      buttonValMsg = this.props.t("step1ESCCancelChallenged");
    }
    else if(statusValue === "CancelOk"){
      buttonVal = true;
      buttonValMsg = this.props.t("step1ESCCancelOk");
    }
    else if(statusValue === "Ok"){
      if(Date.now() - bridgeTransferDetails.timestamp < (CONFIGURATION.testnet? 36000: 907200)){
        buttonVal = false;
        buttonValMsg = this.props.t("step1ESCWaitOneHalfWeek");
      }
      else{
        buttonNewCancelVal = true;
        buttonVal = true;
        buttonValMsg = this.props.t("step1ESCOk");
      }
    }
    else{
      buttonVal = false;
      buttonValMsg = this.props.t("step1ESCUnknown");
    }
    this.setState({allowTimeout: buttonTimeoutVal, allowNewCancel: buttonNewCancelVal, bridgeTransferId: this.state.bridgeTransferId, requesttimestamp: bridgeTransferDetails.timestamp, value: bridgeTransferDetails.value, erc: bridgeTransferDetails.erc20, spt: bridgeTransferDetails.assetGUID, freezer: bridgeTransferDetails.tokenFreezer, status: statusValue });
    if(setButtonState){
      this.setState({buttonVal: buttonVal, buttonValMsg: buttonValMsg});
    }
  }
  async searchBridgeTransfer() {
    this.setState({searchError: ""});
    const userInput = this.refs.searchText.value;
    if(!userInput || userInput === "")
      return;
    let bridgeTransferId = 0;

    try{ 
      let txReceipt = await web3.eth.getTransactionReceipt(userInput);
      if(txReceipt.logs.length != 3){
        this.setState({searchError: this.props.t("step1ESCWrongTransaction")});
        return;
      }
      
      for(var i =0;i<txReceipt.logs.length;i++){
        if(txReceipt.logs[i].topics && txReceipt.logs[i].topics.length != 1){
          continue;
        }
        // event TokenFreeze(address freezer, uint value, uint32 bridgetransferid);
        if(txReceipt.logs[i].topics[0] === CONFIGURATION.tokenFreezeFunction && txReceipt.logs[i].address === CONFIGURATION.ERC20Manager){
          let paramResults = web3.eth.abi.decodeParameters([{
            type: 'address',
            name: 'freezer'
          },{
              type: 'uint256',
              name: 'value'
          },{
            type: 'uint32',
            name: 'bridgetransferid'
          }], txReceipt.logs[i].data);
          bridgeTransferId = paramResults.bridgetransferid;
          break;
        }
      }
    } catch(e){
      this.setState({searchError: e.message});
      return;
    }
    if(bridgeTransferId === 0){
      this.setState({searchError: this.props.t("step1ESCWrongTransaction")});
      return;
    }
    axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=syscoincheckmint&bridgetransferid=' + bridgeTransferId)
      .then(response => {
        console.log(response);
        if(response.data.error){
          this.getBridgeTransferDetails(bridgeTransferId, true);
        }
        else{
          this.setState({searchError: this.props.t("step1ESCExists")});
        }
      })
      .catch(error => {
        this.setState({searchError: error.response});
      });
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};    
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'has-success';
      notValidClasses.buttonValGrpCls = 'val-success-tooltip mb30'; // use 'active' class if you want to actually use this (green) tooltip
    }
    else {
       notValidClasses.buttonCls = 'has-error';
       notValidClasses.buttonValGrpCls = 'val-err-tooltip mb30';
    }   
 
    
    return (
      <div className="step step1esc">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1>{this.props.t("step1ESCHead")}</h1>
                <h3 dangerouslySetInnerHTML={{__html: this.props.t("step1ESCDescription")}}></h3>
              </label>
              <div className="row mb30">
                <div className="col-md-8 col-md-offset-2">
                  <div className="navbar-form" role="search">
                    <div className="input-group add-on">
                      <input
                          ref="searchText"
                          autoComplete="off"
                          type="text"
                          placeholder={this.props.t("step1ESCSearchBox")}
                          className="form-control"/>
                      <div className="input-group-btn">
                        <button className="btn btn-default formbtnmini" type="button" onClick={this.searchBridgeTransfer}><i className="glyphicon glyphicon-search"></i></button>
                      </div>
                    </div>
                    <div className="superblocksearcherror">{this.state.searchError}</div>
                  </div>
                </div>
              </div>
              <div className="row">
              <div className="col-md-4 col-sm-12 col-centered">
                
                <div className={notValidClasses.buttonCls}>
                    <button disabled={!this.state.allowNewCancel || this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1ESCCancelButton")} onClick={this.cancelBridgeTransaction}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1ESCCancelButton")}
                    </button>
                    <button disabled={!this.state.allowTimeout || this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1ESCTimeoutButton")} onClick={this.timeoutBridgeTransaction}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1ESCTimeoutButton")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
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
                            <span className="dataname">{this.props.t("step5ReceiptStatus")}:</span> <span className="result">{this.state.receiptStatus}</span><br />
                            <span className="dataname">{this.props.t("step5ReceiptTxHash")}:</span> <span className="result">{this.state.receiptTxHash}</span><br />
                            <span className="dataname">{this.props.t("step1ESCBridgeTransferId")}:</span> <span className="result">{this.state.bridgeTransferId}</span><br />
                            <span className="dataname">{this.props.t("step1ESCTimestamp")}:</span> <span className="result">{this.state.requesttimestamp}</span><br />
                            <span className="dataname">{this.props.t("step1ESCValue")}:</span><span className="result">{this.state.value}</span><br />
                            <span className="dataname">{this.props.t("step1ESCERC")}:</span><span className="result">{this.state.erc}</span><br />
                            <span className="dataname">{this.props.t("step1ESCFreezer")}:</span><span className="result">{this.state.freezer}</span><br />
                            <span className="dataname">{this.props.t("step1ESCSPT")}:</span><span className="result">{this.state.spt}</span><br />
                            <span className="dataname">{this.props.t("step1ESCStatus")}:</span><span className="result">{this.state.status}</span><br />
                        </code>
                      </TabPanel>
                    </Tabs>

                  </div>
            
                </div>
                <div className="row">
                <div className="col-md-4 col-sm-12 col-centered">
                  <div>
                    <button type="button" disabled={!this.state.receiptObj || this.state.working} className="form-control btn btn-default formbtn" aria-label={this.props.t("step5Download")} onClick={this.downloadReceipt}>
                    <span className="glyphicon glyphicon-download" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step5Download")}
                    </button>
                  </div>
                 </div>
                 </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step1ESC;
