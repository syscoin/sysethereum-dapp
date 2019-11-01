
import React, { Component } from 'react';
import Web3 from 'web3';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import assetabi from '../SyscoinERC20I';
import tpabi from '../SyscoinTransactionProcessor';  
import CONFIGURATION from '../config';
const axios = require('axios');
const web3 = new Web3(Web3.givenProvider);
class Step1ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sysxContract: props.getStore().sysxContract,
      sysxFromAccount: props.getStore().sysxFromAccount,
      toSysAssetGUID: props.getStore().toSysAssetGUID,
      toSysAmount: props.getStore().toSysAmount,
      syscoinWitnessAddress: props.getStore().syscoinWitnessAddress,
      receiptStatus: props.getStore().receiptStatus,
      receiptTxHash: props.getStore().receiptTxHash,
      receiptTxIndex: props.getStore().receiptTxIndex,
      receiptFrom: props.getStore().receiptFrom,
      receiptTo: props.getStore().receiptTo,
      receiptBlockhash: props.getStore().receiptBlockhash, 
      receiptBlocknumber: props.getStore().receiptBlocknumber,
      receiptTotalGas: props.getStore().receiptTotalGas,
      receiptGas: props.getStore().receiptGas,
      receiptObj: props.getStore().receiptObj,
      working: false

    };
    this.submitProofs = this.submitProofs.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.setStateFromReceipt = this.setStateFromReceipt.bind(this);
    this.faucetURL = "https://faucet";
    if(CONFIGURATION.testnet){
      this.faucetURL += "-testnet";
    }
    this.faucetURL += ".syscoin.org";
    
  }

  componentDidMount() {
   
  }
  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if(this.props.getStore().receiptTxHash !== userInput.receiptTxHash || this.props.getStore().toSysAssetGUID !== userInput.toSysAssetGUID || this.props.getStore().toSysAmount !== userInput.toSysAmount ||
        this.props.getStore().sysxFromAccount !== userInput.sysxFromAccount || this.props.getStore().syscoinWitnessAddress !== userInput.syscoinWitnessAddress) { // only update store of something changed
          this.props.updateStore({
            ...userInput,
            savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
          });  // Update store here (this is just an example, in reality you will do it via redux or flux)
        }

        isDataValid = true;
    }
    else {
        // if anything fails then update the UI validation state but NOT the UI Data State
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }

    return isDataValid;
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
  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      sysxContractVal: true,
      sysxFromAccountVal: true,
      toSysAssetGUIDVal: true,
      toSysAmountVal: true,
      syscoinWitnessAddressVal: true,
      receiptStatusVal: true,
      receiptTxHashVal: true,
      receiptTxIndexVal: true,
      receiptFromVal: true,
      receiptToVal: true,
      receiptBlockhashVal: true, 
      receiptBlocknumberVal: true,
      receiptTotalGasVal: true,
      receiptGasVal: true,
      receiptObjVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      sysxFromAccountValMsg: val.sysxFromAccountVal ? '' : this.props.t("step2EthAddress"),
      toSysAssetGUIDValMsg: val.toSysAssetGUIDVal ? '' : this.props.t("step2Asset"),
      toSysAmountValMsg: val.toSysAmountVal ? '' : this.props.t("step2Amount"),
      syscoinWitnessAddressValMsg: val.syscoinWitnessAddressVal ? '' : this.props.t("step2FundingAddress"),
      receiptStatusValMsg: '',
      receiptTxHashValMsg: '',
      receiptTxIndexValMsg: '',
      receiptFromValMsg: '',
      receiptToValMsg: '',
      receiptBlockhashValMsg: '',
      receiptBlocknumberValMsg: '',
      receiptTotalGasValMsg: '',
      receiptGasValMsg: '',
      receiptObjValMsg: ''
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      sysxContract: '',
      toSysAssetGUID: this.refs.toSysAssetGUID.value,
      sysxFromAccount: this.refs.sysxFromAccount.value,
      toSysAmount: this.refs.toSysAmount.value,
      syscoinWitnessAddress: this.refs.syscoinWitnessAddress.value,
      receiptTxHash: this.state.receiptTxHash
    };
  }
  setStateFromReceipt(receipt, error, confirmation, validateNewInput) {
    if(receipt.transactionHash && this.state.receiptTxHash !== receipt.transactionHash){
      return;
    }
    if(receipt.status  && receipt.status !== "1" && receipt.status !== true && receipt.status !== "true" && receipt.status !== "0x1"){
      error = this.props.t("step5ErrorEVMCheckLog");
      return;
    }
    
    validateNewInput.receiptObj = receipt;
    validateNewInput.receiptStatus = receipt.status === true? "true":"false";
    validateNewInput.receiptTxHash = receipt.transactionHash;
    validateNewInput.receiptTxIndex = receipt.transactionIndex;
    validateNewInput.receiptFrom = receipt.from;
    validateNewInput.receiptTo = receipt.to;
    validateNewInput.receiptBlockhash = receipt.blockHash;
    validateNewInput.receiptBlocknumber = receipt.blockNumber;
    validateNewInput.receiptTotalGas = receipt.cumulativeGasUsed;
    validateNewInput.receiptGas = receipt.gasUsed;
    validateNewInput.receiptConf = confirmation;
    validateNewInput.buttonVal = error !== null? false: true;
    validateNewInput.buttonValMsg =  error !== null? error: this.props.t("step5Success");
  }
  

  byteToHex(b) {
    var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];
    return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
  }
  async getWitnessProgram(address, validateNewInput){
    if(address.length > 0){
      try {
        let results = await axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=getaddressinfo&address=' + address);
        results = results.data;
        if(results.error){
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = results.error;
          return "";
        }
        else if(results){
          let version = this.byteToHex(results.witness_version);
          return "0x" + version + results.witness_program;
        }
      }catch(e) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = e.message;
        return "";
      }
    }
    return "";
  }
  async getAssetContract(guid, validateNewInput){
    if(guid.length > 0){
      try {
        let results = await axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=assetinfo&asset_guid=' + guid);
        results = results.data;
        if(results.error){
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = results.error;
          return "";
        }
        else if(results){
          return results.contract;
        }
      }catch(e) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = e.message;
        return "";
      }
    }
    return "";
  }
  freezeBurnERC20(syscoinTP, validateNewInput, thisObj, amount, assetGUID, decimals, syscoinWitnessProgram, userInput, fromAccount) {
    thisObj.state.receiptObj = null;
    syscoinTP.methods.freezeBurnERC20(amount, assetGUID, userInput.sysxContract, decimals, syscoinWitnessProgram).send({from: fromAccount, gas: 500000})
      .on('transactionHash', function(hash){
        validateNewInput.buttonVal = true;
        validateNewInput.receiptTxHash = hash;
        validateNewInput.buttonValMsg = thisObj.props.t("step5AuthMetamask");
        thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        thisObj.setState({working: true});
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        if(thisObj.state.receiptObj === null){
          thisObj.setStateFromReceipt(receipt, null, confirmationNumber, validateNewInput);
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
          thisObj.setState({working: false});
        } else {
          validateNewInput.receiptConf = confirmationNumber;
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        }
      })
      .on('error', (error, receipt) => {
        thisObj.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          thisObj.setStateFromReceipt(receipt, message, 0, validateNewInput);
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        }
        else{
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = message;
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        }
      })
  }
  async submitProofs() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.sysxContractVal = true;
    validateNewInput.toSysAssetGUIDVal = true;
    validateNewInput.toSysAmountVal = true;
    validateNewInput.syscoinWitnessAddressVal = true;
    validateNewInput.sysxFromAccountVal = true;
    let valid = true;
    if(!userInput.toSysAssetGUID || userInput.toSysAssetGUID === ""){
      validateNewInput.toSysAssetGUIDVal = false;
      valid = false;
    }  
    if(!userInput.toSysAmount || userInput.toSysAmount === ""){
      validateNewInput.toSysAmountVal = false;
      valid = false;
    }  
    if(!userInput.syscoinWitnessAddress || userInput.syscoinWitnessAddress === ""){
      validateNewInput.syscoinWitnessAddressVal = false;
      valid = false;
    } 
    if(!userInput.sysxFromAccount || userInput.sysxFromAccount === ""){
      validateNewInput.sysxFromAccountVal = false;
      valid = false;
    } 
    if(valid === false){
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;
    }
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("step5InstallMetamask");
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;  
    }
    let chainId = await web3.eth.getChainId();
    if(CONFIGURATION.testnet && chainId !== 4){
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("stepUseTestnet");
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;        
    } else if(!CONFIGURATION.testnet && chainId !== 1){
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("stepUseMainnet");
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;        
    }
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("step5LoginMetamask");
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      if(window.ethereum){
        await window.ethereum.enable();
      }
      return;
    }
    
    this.setState({working: true});
    let syscoinWitnessProgram = await this.getWitnessProgram(userInput.syscoinWitnessAddress, validateNewInput);
    if(syscoinWitnessProgram === ""){
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      this.setState({working: false});
      return;
    }
    userInput.sysxContract = await this.getAssetContract(userInput.toSysAssetGUID, validateNewInput);
    if(userInput.sysxContract === ""){
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      this.setState({working: false});
      return;
    }
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = this.props.t("step5AuthMetamask");
    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    let syscoinTransactionProcessor = await web3.eth.Contract(tpabi,  CONFIGURATION.ERC20Manager);
    let contractBase = await web3.eth.Contract(assetabi, userInput.sysxContract);
    let fromAccount = userInput.sysxFromAccount;
    let allowance = await contractBase.methods.allowance(fromAccount, CONFIGURATION.ERC20Manager).call();
    allowance = web3.utils.toBN(allowance.toString());
    let balance = await contractBase.methods.balanceOf(fromAccount).call();
    balance = web3.utils.toBN(balance.toString());
    let decimals = await contractBase.methods.decimals().call();
    let amount = web3.utils.toBN(userInput.toSysAmount);
    amount = amount.mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));
    let assetGUID = userInput.toSysAssetGUID;
    

    let thisObj = this;
    if(amount.gt(balance)){
      // insufficient balance
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("step5InsufficientTokenBalance");
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      this.setState({working: false});
      return;
    }
    let bFirstConfirmation = true;
    // we may need to get allowance of funds
    if(allowance.lt(amount)){
      console.log("Allowance needed.");
      contractBase.methods.approve(CONFIGURATION.ERC20Manager, amount.toString()).send({from: fromAccount, gas: 500000})
      .on('transactionHash', function(hash){
        validateNewInput.buttonVal = true;
        validateNewInput.buttonValMsg = thisObj.props.t("step5AuthAllowanceMetamask");
        thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(bFirstConfirmation){
          bFirstConfirmation = false; 
          thisObj.freezeBurnERC20(syscoinTransactionProcessor, validateNewInput, thisObj, amount.toString(), assetGUID, decimals, syscoinWitnessProgram, userInput, fromAccount);
        }
      })
      .on('error', (error, receipt) => {
        thisObj.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          thisObj.setStateFromReceipt(receipt, message, 0, validateNewInput);
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        }
        else{
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = message;
          thisObj.setState(Object.assign(userInput, validateNewInput, thisObj._validationErrors(validateNewInput)));
        }
      })
    }
    else{
      thisObj.freezeBurnERC20(syscoinTransactionProcessor, validateNewInput, thisObj, amount.toString(), assetGUID, decimals, syscoinWitnessProgram, userInput, fromAccount);
    }
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
    if (typeof this.state.toSysAssetGUIDVal == 'undefined' || this.state.toSysAssetGUIDVal) {
      notValidClasses.toSysAssetGUIDCls = 'has-success';
      notValidClasses.toSysAssetGUIDValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.toSysAssetGUIDCls = 'has-error';
       notValidClasses.toSysAssetGUIDValGrpCls = 'val-err-tooltip';
    }   
    if (typeof this.state.toSysAmountVal == 'undefined' || this.state.toSysAmountVal) {
      notValidClasses.toSysAmountCls = 'has-success';
      notValidClasses.toSysAmountValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.toSysAmountCls = 'has-error';
       notValidClasses.toSysAmountValGrpCls = 'val-err-tooltip';
    }  
    if (typeof this.state.syscoinWitnessAddressVal == 'undefined' || this.state.syscoinWitnessAddressVal) {
      notValidClasses.syscoinWitnessAddressCls = 'has-success';
      notValidClasses.syscoinWitnessAddressValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.syscoinWitnessAddressCls = 'has-error';
       notValidClasses.syscoinWitnessAddressValGrpCls = 'val-err-tooltip';
    } 
    if (typeof this.state.sysxFromAccountVal == 'undefined' || this.state.sysxFromAccountVal) {
      notValidClasses.sysxFromAccountCls = 'has-success';
      notValidClasses.sysxFromAccountValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.sysxFromAccountCls = 'has-error';
       notValidClasses.sysxFromAccountValGrpCls = 'val-err-tooltip';
    }  
    
    return (
      <div className="step step1es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1>{this.props.t("step1ESHead")}</h1>
                <h3 dangerouslySetInnerHTML={{__html: this.props.t("step1ESDescription")}}></h3>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step1Faucet")}}></div> <a href={this.faucetURL} className="vivid" target="_blank" rel="noopener noreferrer">{this.faucetURL}</a></h3>
              </label>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2AssetLabel")}
                </label>
                <div className={notValidClasses.toSysAssetGUIDCls}>
                  <input
                    ref="toSysAssetGUID"
                    autoComplete="off"
                    type="number"
                    placeholder={this.props.t("step2EnterAsset")}
                    className="form-control"
                    defaultValue={this.state.toSysAssetGUID}
                     />
                  <div className={notValidClasses.toSysAssetGUIDValGrpCls}>{this.state.toSysAssetGUIDValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step1ESFromAccountLabel")}
                </label>
                <div className={notValidClasses.sysxFromAccountCls}>
                  <input
                    ref="sysxFromAccount"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step1ESEnterFromAccount")}
                    className="form-control"
                    defaultValue={this.state.sysxFromAccount}
                     />
                  <div className={notValidClasses.sysxFromAccountValGrpCls}>{this.state.sysxFromAccountValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2AmountLabel")}
                </label>
                <div className={notValidClasses.toSysAmountCls}>
                  <input
                    ref="toSysAmount"
                    autoComplete="off"
                    type="number"
                    placeholder={this.props.t("step2EnterAmount")}
                    className="form-control"
                    required
                    defaultValue={this.state.toSysAmount}
                     />
                  <div className={notValidClasses.toSysAmountValGrpCls}>{this.state.toSysAmountValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step1ESWitnessAddressLabel")}
                </label>
                <div className={notValidClasses.syscoinWitnessAddressCls}>
                  <input
                    ref="syscoinWitnessAddress"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step1ESEnterWitnessAddress")}
                    className="form-control"
                    required
                    defaultValue={this.state.syscoinWitnessAddress}
                     />
                  <div className={notValidClasses.syscoinWitnessAddressValGrpCls}>{this.state.syscoinWitnessAddressValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-4 col-sm-12 col-centered">
                
                <div className={notValidClasses.buttonCls}>
                    <button disabled={this.state.working} type="button" className="form-control btn btn-default formbtn" aria-label={this.props.t("step1ESButton")} onClick={this.submitProofs}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1ESButton")}
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
                        <Tab>{this.props.t("tabAdvanced")}</Tab>
                      </TabList>
                      <TabPanel>
                        <code className="block">
                            <span className="dataname">{this.props.t("step5ReceiptStatus")}:</span> <span className="result">{this.state.receiptStatus}</span><br />
                            <span className="dataname">{this.props.t("step5ReceiptTxHash")}:</span> <span className="result">{this.state.receiptTxHash}</span><br />
                            <span className="dataname">{this.props.t("step5ReceiptTxIndex")}:</span> <span className="result">{this.state.receiptTxIndex}</span><br />
                            <span className="dataname">{this.props.t("step5ReceiptFrom")}:</span> <span className="result">{this.state.receiptFrom}</span><br />
                            <span className="dataname">{this.props.t("step5ReceiptTo")}:</span><span className="result">{this.state.receiptTo}</span><br />
                        </code>
                      </TabPanel>
                      <TabPanel>
                        <code className="block">
                        <span className="dataname">{this.props.t("step5ReceiptBlockhash")}:</span> <span className="result">{this.state.receiptBlockhash}</span><br />
                        <span className="dataname">{this.props.t("step5ReceiptBlocknumber")}:</span> <span className="result">{this.state.receiptBlocknumber}</span><br />
                        <span className="dataname">{this.props.t("step5ReceiptTotalGas")}:</span> <span className="result">{this.state.receiptTotalGas}</span><br />
                        <span className="dataname">{this.props.t("step5ReceiptGas")}:</span> <span className="result">{this.state.receiptGas}</span><br />
                        <span className="dataname">{this.props.t("step5ReceiptConfirmations")}:</span> <span className="result">{this.state.receiptConf}</span><br />
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

export default Step1ES;
