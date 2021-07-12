
import React, { Component } from 'react';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import erc20Managerabi from '../SyscoinERC20Manager'; 
import rconfig from '../SyscoinRelayI'; 
import CONFIGURATION from '../config';
import { getProof } from 'bitcoin-proof'
import * as SyscoinRpc from 'syscoin-js';
const web3 = new Web3(Web3.givenProvider);
class Step1Reg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foundContract: false,
      foundErc20contract: "",
      foundErc20URL: "",
      assetTxid: "",
      receiptStatus: "",
      receiptTxHash: "",
      receiptObj: null,
      buttonVal: true,
      buttonValMsg: "",
      working: false

    };
    this.searchRegistry = this.searchRegistry.bind(this);
    this.updateRegistry = this.updateRegistry.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
  }
  componentDidMount() {
    this.syscoinClient = new SyscoinRpc.default({baseUrl: CONFIGURATION.sysRPCURL, port: CONFIGURATION.sysRPCPort, username: CONFIGURATION.sysRPCUser, password: CONFIGURATION.sysRPCPassword});

    try {
      console.log("RESULT", (await this.syscoinClient.callRpc("getblockchaininfo", [])) );
    } catch(e) {
      console.log("ERR getblockchaininfo", e);
    }
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
  async setStateFromReceipt(receipt) {
    let errorMsg = null;
    if(receipt.transactionHash && this.state.receiptTxHash !== receipt.transactionHash){
      return;
    }
    if(receipt.status !== undefined  && receipt.status !== "1" && receipt.status !== true && receipt.status !== "true" && receipt.status !== "0x1"){
      errorMsg = this.props.t("step5ErrorEVMCheckLog");
    }
    this.setState({receiptObj: receipt, receiptStatus: receipt.status === true? "true":"false", receiptTxHash: receipt.transactionHash});
    if(errorMsg !== null){
      this.setState({buttonVal: false, buttonValMsg: errorMsg}); 
    } else {
      this.setState({buttonVal: true, buttonValMsg: this.props.t("step5Success")}); 
    }
  }
  async updateRegistry() {
    const userInput = this.refs.assetTxid.value;
    if(!userInput){
      return;
    }
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5InstallMetamask")});
      return;  
    }
    let chainId = await web3.eth.getChainId();
    if(chainId !== CONFIGURATION.chainId){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseProperNetwork")});
      return;       
    }
    let SyscoinRelay = new web3.eth.Contract(rconfig.data, rconfig.contract); 
    if(!SyscoinRelay || !SyscoinRelay.methods || !SyscoinRelay.methods.relayAssetTx){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepRelay")});
      return;  
    }
    this.setState({
      receiptStatus: '',
      receiptTxHash: '',
      receiptObj: null,
      buttonVal: true, 
      buttonValMsg: ""});
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5LoginMetamask")});
      if(window.ethereum){
        await window.ethereum.enable();
      }
     
      return;
    }
    this.setState({buttonVal: true, buttonValMsg: this.props.t("step5AuthMetamask")});
    let failed = false;
    this.setState({working: true});
    var txbytes, syscoinblockheader, txsiblings, txindex, blockhash;
    try {
      let results = await this.syscoinClient.callRpc("syscoingetspvproof", [userInput]);
      results = results.data;
      if(results.error){
        this.setState({buttonVal: false, buttonValMsg: results.error});
        console.log("error " + results.error);
        failed = true;
      }
      else if(results){
        txbytes = results.transaction;
        console.log("txbytesVal " + txbytes);
        syscoinblockheader = results.header;
        console.log("syscoinblockheaderVal " + syscoinblockheader);
        txsiblings = results.siblings;
        console.log("txsiblingsVal " + txsiblings);
        txindex = results.index;
        console.log("txindexVal " + txindex);
        blockhash = results.blockhash;
        console.log("blockhash " + blockhash);
      }
    }catch(e) {
      this.setState({buttonVal: false, buttonValMsg: e.message});
      console.log("error " + e.message);
      failed = true;
    } 
    if(!txsiblings){
      return;
    }
    let _txBytes = "0x" + txbytes;
    let _txSiblings = [];
    for(let i = 0;i<txsiblings.length;i++){
      let _txSibling = "0x" + txsiblings[i];
      _txSiblings.push(_txSibling);
    }
    let merkleProof = getProof(txsiblings, txindex);
    for(let   i = 0;i<merkleProof.sibling.length;i++){
      merkleProof.sibling[i] = "0x" + merkleProof.sibling[i];
    }
    this.setState({working: true});
    let thisObj = this;
    thisObj.state.receiptObj = null;

     SyscoinRelay.methods.relayAssetTx(_txBytes, txindex, merkleProof.sibling, _syscoinBlockHeader).send({from: accounts[0], gas: 500000})
      .once('transactionHash', function(hash){
        thisObj.setState({receiptTxHash: hash, buttonVal: true, buttonValMsg: thisObj.props.t("step5PleaseWait")});
      })
      .once('confirmation', function(confirmationNumber, receipt){ 
        if(thisObj.state.receiptObj === null){
          thisObj.setStateFromReceipt(receipt, null, confirmationNumber);
          thisObj.setState({working: false});
          
        } else {
          thisObj.setState({receiptConf: confirmationNumber});
        }
      })
      .on('error', (error, receipt) => {
        thisObj.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          thisObj.setStateFromReceipt(receipt, message, 0);
        }
        else{
          thisObj.setState({buttonVal: false, buttonValMsg:  message}); 
        }
      })

  }
  async searchRegistry() {
    this.setState({foundErc20contract: "", foundErc20URL: "", searchError: ""});
    const userInput = this.refs.searchText.value;
    if(!userInput || userInput === "")
      return;

    try{ 
      let syscoinERC20Manager = new web3.eth.Contract(erc20Managerabi,  CONFIGURATION.ERC20Manager);
      let assetRegistry = await syscoinERC20Manager.methods.assetRegistry(userInput).call();
      if(assetRegistry === "" || !assetRegistry){
        this.setState({foundContract: false, searchError: this.props.t("step1RegWrongAsset")});
        return;
      }
      let _foundErc20contract = assetRegistry.erc20ContractAddress;
      let baseEthURL = CONFIGURATION.NEVMAddressExplorerURL + _foundErc20contract;
      this.setState({foundErc20contract: _foundErc20contract, foundErc20URL: baseEthURL});
      this.setState({foundContract: true});
    } catch(e){
      this.setState({foundContract: false, searchError: e.message});
      return;
    }
    
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};    
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'has-success';
      notValidClasses.buttonValGrpCls = 'val-success-tooltip'; // use 'active' class if you want to actually use this (green) tooltip
    }
    else {
       notValidClasses.buttonCls = 'has-error';
       notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }   
    
    return (
      <div className="step step1reg">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1>{this.props.t("step1RegHead")}</h1>
                <h3 dangerouslySetInnerHTML={{__html: this.props.t("step1RegDescription")}}></h3>
              </label>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step3TxidLabel")}
                </label>
                <div>
                  <input
                    ref="assetTxid"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step1RegEnterAssetTx")}
                    className="form-control"
                    required
                    defaultValue={this.state.assetTxid}/>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-4 col-sm-12 col-centered">
                <div className={notValidClasses.buttonCls}>
                    <button disabled={this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1RegUpdateButton")} onClick={this.updateRegistry}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1RegUpdateButton")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-sm-12 col-centered">
                  <div className="navbar-form" role="search">
                    <div className="input-group add-on">
                      <input
                          ref="searchText"
                          autoComplete="off"
                          type="text"
                          placeholder={this.props.t("step2EnterAsset")}
                          className="form-control"/>
                      <div className="input-group-btn">
                        <button className="btn btn-default formbtnmini" type="button" onClick={this.searchRegistry}><i className="glyphicon glyphicon-search"></i></button>
                      </div>
                    </div>
                    <div className="relaysearcherror">{this.state.searchError}</div>
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
                            <span className="dataname">{this.props.t("step1ESCERC")}:</span> <span><a href={this.state.foundErc20URL} target="_blank" rel="noopener noreferrer">{this.state.foundErc20contract}</a></span><br />
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

export default Step1Reg;
