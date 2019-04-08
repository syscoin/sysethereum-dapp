
import React, { Component } from 'react';
import * as SyscoinRpc from 'syscoin-js';
import web3 from '../web3';
import tpabi from '../SyscoinTransactionProcessor';
import hsabi from '../HumanStandardToken';
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
      receiptObj: props.getStore().receiptObj

    };
    this.submitProofs = this.submitProofs.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.setStateFromReceipt = this.setStateFromReceipt.bind(this);
    this.syscoinClient = new SyscoinRpc.default({baseUrl: "localhost", port: "8370", username: "u", password: "p"});
  }

  componentDidMount() {
    
  }
  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().sysxContract !== userInput.sysxContract  || 
        this.props.getStore().sysxFromAccount !== userInput.sysxFromAccount || 
        this.props.getStore().toSysAssetGUID !== userInput.toSysAssetGUID || 
        this.props.getStore().toSysAmount !== userInput.toSysAmount || 
        this.props.getStore().syscoinWitnessAddress !== userInput.syscoinWitnessAddress ||
        this.props.getStore().receiptStatus !== userInput.receiptStatus || 
        this.props.getStore().receiptTxHash !== userInput.receiptTxHash || 
        this.props.getStore().receiptTxIndex !== userInput.receiptTxIndex || 
        this.props.getStore().receiptFrom !== userInput.receiptFrom || 
        this.props.getStore().receiptTo !== userInput.receiptTo || 
        this.props.getStore().receiptBlockhash !== userInput.receiptBlockhash || 
        this.props.getStore().receiptBlocknumber !== userInput.receiptBlocknumber || 
        this.props.getStore().receiptTotalGas !== userInput.receiptTotalGas || 
        this.props.getStore().receiptGas !== userInput.receiptGas  || 
        this.props.getStore().receiptObj !== userInput.receiptObj ) { // only update store of something changed
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
      sysxContractValMsg: val.sysxContractVal ? '' : this.props.t("step1SEContract"),
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
      sysxContract: this.refs.sysxContract.value,
      toSysAssetGUID: this.refs.toSysAssetGUID.value,
      sysxFromAccount: this.refs.sysxFromAccount.value,
      toSysAmount: this.refs.toSysAmount.value,
      syscoinWitnessAddress: this.refs.syscoinWitnessAddress.value
    };
  }
  setStateFromReceipt(receipt, error, confirmation, validateNewInput) {
    if(receipt.transactionHash && this.state.receiptTxHash !== receipt.transactionHash){
      return;
    }
    if(receipt.events && receipt.events.RelayTransaction && receipt.events.RelayTransaction.returnValues && receipt.events.RelayTransaction.returnValues[0]){
      if(receipt.events.RelayTransaction.returnValues[0] == 0 || receipt.events.RelayTransaction.returnValues[1] == 0){
        error = this.props.t("step5ErrorCheckLog");
      }
    }
    else{
      error = this.props.t("step5ErrorCheckLog");
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
  async getWitnessProgram(address, validateNewInput){
    if(address.length > 0){
      const args = [address];
      try {
        let results = await this.syscoinClient.callRpc("getaddressinfo", args);
        if(results){
          return "0x" + results.witness_version.toString(16) + results.witness_program;
        }
      }catch(e) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = e.message;
        return "";
      }
    }
    return "";
  }
  async submitProofs() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.sysxContractVal = true;
    validateNewInput.sysxContractValMsg = "";
    validateNewInput.toSysAssetGUIDVal = true;
    validateNewInput.toSysAssetGUIDValMsg = "";
    validateNewInput.toSysAmountVal = true;
    validateNewInput.toSysAmountValMsg = "";
    validateNewInput.syscoinWitnessAddressVal = true;
    validateNewInput.syscoinWitnessAddressValMsg = "";
    validateNewInput.sysxFromAccountVal = true;
    validateNewInput.sysxFromAccountValMsg = "";
    let valid = true;
    if(!userInput.sysxContract || userInput.sysxContract === ""){
      validateNewInput.sysxContractVal = false;
      valid = false;
    }
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
    let syscoinWitnessProgram = await this.getWitnessProgram(userInput.syscoinWitnessAddress, validateNewInput);
    if(syscoinWitnessProgram === ""){
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;
    }
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = this.props.t("step5AuthMetamask");
    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    let contract = await web3.eth.Contract(tpabi, userInput.sysxContract /*"0x0ddc3d46509e2add333c80dc28f837b88cf50ec0"*/);
    
    let contractBase = await web3.eth.Contract(hsabi, userInput.sysxContract /*"0x0ddc3d46509e2add333c80dc28f837b88cf50ec0"*/);
    
    let decimals = await contractBase.methods.decimals().call();
    
    let assetGUID = userInput.toSysAssetGUID /*1702063431*/;
    let amount = userInput.toSysAmount*Math.pow(10, decimals);
    let fromAccount = userInput.sysxFromAccount/*"0x5a714c3ed4ce4f297679e733f3c476b24d8895e5"*/;

    
    let thisObj = this;
      contract.methods.burn(amount, assetGUID, syscoinWitnessProgram).send({from: fromAccount, gas: 500000})
      .on('transactionHash', function(hash){
        validateNewInput.buttonVal = true;
        validateNewInput.receiptTxHash = hash;
        validateNewInput.buttonValMsg = this.props.t("step5AuthMetamask");
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        thisObj.setStateFromReceipt(receipt, null, confirmationNumber, validateNewInput);
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        })
      .on('error', (error, receipt) => {
        if(error.message.length <= 512){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          thisObj.setStateFromReceipt(receipt, message, 0, validateNewInput);
          this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        }
        else{
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = message;
          this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        }
      })
      
  }

 


  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};    
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'has-success';
      notValidClasses.buttonValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.buttonCls = 'has-error';
       notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }   
    if (typeof this.state.toSysAssetGUIDVal == 'undefined' || this.state.toSysAssetGUIDVal) {
      notValidClasses.toSysAssetGUIDCls = 'has-success';
      notValidClasses.toSysAssetGUIDValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.toSysAssetGUIDCls = 'has-error';
       notValidClasses.toSysAssetGUIDValGrpCls = 'val-err-tooltip';
    }   
    if (typeof this.state.sysxContractVal == 'undefined' || this.state.sysxContractVal) {
      notValidClasses.sysxContractCls = 'has-success';
      notValidClasses.sysxContractValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.sysxContractCls = 'has-error';
       notValidClasses.sysxContractValGrpCls = 'val-err-tooltip';
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
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step1ESHead")}</h1>
                <h3>{this.props.t("step1ESDescription")}</h3>
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
                  {this.props.t("step1ESContractLabel")}
                </label>
                <div className={notValidClasses.sysxContractCls}>
                  <input
                    ref="sysxContract"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step1ESEnterContract")}
                    className="form-control"
                    defaultValue={this.state.sysxContract}
                     />
                  <div className={notValidClasses.sysxContractValGrpCls}>{this.state.sysxContractValMsg}</div>
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
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" className="form-control btn btn-default" aria-label={this.props.t("step1ESButton")} onClick={this.submitProofs}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step1ESButton")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step5ReceiptStatus")}: {this.state.receiptStatus}<br />
                        {this.props.t("step5ReceiptTxHash")}: {this.state.receiptTxHash}<br />
                        {this.props.t("step5ReceiptTxIndex")}: {this.state.receiptTxIndex}<br />
                        {this.props.t("step5ReceiptFrom")}: {this.state.receiptFrom}<br />
                        {this.props.t("step5ReceiptTo")}: {this.state.receiptTo}<br />
                    </code>
                  </div>
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step5ReceiptBlockhash")}: {this.state.receiptBlockhash}<br />
                        {this.props.t("step5ReceiptBlocknumber")}: {this.state.receiptBlocknumber}<br />
                        {this.props.t("step5ReceiptTotalGas")}: {this.state.receiptTotalGas}<br />
                        {this.props.t("step5ReceiptGas")}: {this.state.receiptGas}<br />
                        {this.props.t("step5ReceiptConfirmations")}: {this.state.receiptConf}<br />
                    </code>
                  </div>
                </div>
                </div>
                <div className="row">
                <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                  <div>
                    <button type="button" disabled={!this.state.receiptObj} className="form-control btn btn-default" aria-label={this.props.t("step5Download")} onClick={this.downloadReceipt}>
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
