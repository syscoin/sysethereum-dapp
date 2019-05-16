
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const axios = require('axios');
class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: props.getStore().asset,
      fundingaddress: props.getStore().fundingaddress,
      amount: props.getStore().amount,
      ethaddress: props.getStore().ethaddress,
      sysrawtxunsigned: props.getStore().sysrawtxunsigned,
      working: false
    };
    
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getBurnTx = this.getBurnTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
   
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().asset !== userInput.asset || this.props.getStore().fundingaddress !== userInput.fundingaddress  || 
        this.props.getStore().amount !== userInput.amount || this.props.getStore().ethaddress !== userInput.ethaddress
        || this.props.getStore().sysrawtxunsigned !== userInput.sysrawtxunsigned) { // only update store of something changed
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
  async getBurnTx() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.sysrawtxunsignedVal = true;
    validateNewInput.sysrawtxunsignedValMsg = "";
    let valid = true;
    if(!userInput.fundingaddress || userInput.fundingaddress === ""){
      validateNewInput.fundingaddressVal = false;
      valid = false;
    }
    if(!userInput.amount || userInput.amount === ""){
      validateNewInput.amountVal = false;
      valid = false;
    }  
    if(!userInput.ethaddress || userInput.ethaddress === ""){
      validateNewInput.ethaddressVal = false;
      valid = false;
    }         
    let self = this;
    
    if(valid === true){
      this.setState({working: true});
      let fundingAddress = userInput.fundingaddress.toString();
      if(userInput.asset.length > 0 && userInput.asset !== 0 && userInput.asset !== "0"){
        let assetGuid = userInput.asset.toString();
        
        let ethAddressStripped = userInput.ethaddress.toString();
        if(ethAddressStripped && ethAddressStripped.startsWith("0x")){
          ethAddressStripped = ethAddressStripped.substr(2, ethAddressStripped.length);
        }
        try {
          let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=assetallocationburn&asset_guid=' + assetGuid + '&address=' + fundingAddress + '&amount=' + userInput.amount.toString() + '&ethereum_destination_address=' + ethAddressStripped);
          results = results.data;
          if(results.error){
            validateNewInput.buttonVal = false;
            validateNewInput.buttonValMsg = results.error;
            self.setState({working: false});      
          }
          else if(results && results.hex){
            validateNewInput.sysrawtxunsignedVal = true;
            this.refs.sysrawtxunsigned.value = results.hex;
            self.setState({working: false});
            self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
          }
        }catch(e) {
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = e.message;
          self.setState({working: false});
          self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        }
      }
      else{
        let ethAddressStripped = userInput.ethaddress.toString();
        if(ethAddressStripped && ethAddressStripped.startsWith("0x")){
          ethAddressStripped = ethAddressStripped.substr(2, ethAddressStripped.length);
        }
        try {
          let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=syscoinburn&address=' + fundingAddress + '&amount=' + userInput.amount.toString() + '&ethereum_destination_address=' + ethAddressStripped);
          results = results.data;
          if(results.error){
            validateNewInput.buttonVal = false;
            validateNewInput.buttonValMsg = results.error;
            self.setState({working: false});      
          }
          else if(results && results.hex){
            validateNewInput.sysrawtxunsignedVal = true;
            this.refs.sysrawtxunsigned.value = results.hex;
            self.setState({working: false});
            self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
          }
        
        }catch(e) {
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = e.message;
          self.setState({working: false});
          self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        }
      }
    } 

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
      assetVal: true,
      fundingaddressVal: true,
      amountVal: true,
      ethaddressVal: true, 
      sysrawtxunsignedVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      assetValMsg: val.assetVal ? '' : this.props.t("step2Asset"),
      fundingaddressValMsg: val.fundingaddressVal && val.fundingaddressVal === true ? '' : this.props.t("step2FundingAddress"),
      amountValMsg: val.amountVal && val.amountVal === true ? '' : this.props.t("step2Amount"),
      ethaddressValMsg: val.ethaddressVal ? '' : this.props.t("step2EthAddress"),
      sysrawtxunsignedValMsg: val.sysrawtxunsignedVal ? '' : this.props.t("step2RawTx")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      asset: this.refs.asset.value,
      fundingaddress: this.refs.fundingaddress.value,
      amount: this.refs.amount.value,
      ethaddress: this.refs.ethaddress.value,
      sysrawtxunsigned: this.refs.sysrawtxunsigned.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.assetVal == 'undefined' || this.state.assetVal) {
      notValidClasses.assetCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.assetCls = 'has-error col-md-8';
       notValidClasses.assetValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.fundingaddressVal == 'undefined' || this.state.fundingaddressVal) {
      notValidClasses.fundingaddressCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.fundingaddressCls = 'has-error col-md-8';
      notValidClasses.fundingaddressValGrpCls = 'val-err-tooltip';
    }

    if (typeof this.state.amountVal == 'undefined' || this.state.amountVal) {
        notValidClasses.amountCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.amountCls = 'has-error col-md-8';
       notValidClasses.amountValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.ethaddressVal == 'undefined' || this.state.ethaddressVal) {
      notValidClasses.ethaddressCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.ethaddressCls = 'has-error col-md-8';
      notValidClasses.ethaddressValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.sysrawtxunsignedVal == 'undefined' || this.state.sysrawtxunsignedVal) {
      notValidClasses.sysrawtxunsignedCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.sysrawtxunsignedCls = 'has-error col-md-8';
      notValidClasses.sysrawtxunsignedValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.buttonCls = 'has-error col-md-8';
      notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step2">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
            <label className="col-md-12 control-label">
                <h1>{this.props.t("step2Head")}</h1>
                <h3>{this.props.t("step2Description")}</h3>
              </label>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2AssetLabel")}
                </label>
                <div className={notValidClasses.assetCls}>
                  <input
                    ref="asset"
                    autoComplete="off"
                    type="number"
                    placeholder={this.props.t("step2EnterAsset")}
                    className="form-control"
                    defaultValue={this.state.asset}
                     />
                  <div className={notValidClasses.assetValGrpCls}>{this.state.assetValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2FundingAddressLabel")}
                </label>
                <div className={notValidClasses.fundingaddressCls}>
                  <input
                    ref="fundingaddress"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2EnterFundingAddress")}
                    className="form-control"
                    defaultValue={this.state.fundingaddress}
                     />
                  <div className={notValidClasses.fundingaddressValGrpCls}>{this.state.fundingaddressValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2AmountLabel")}
                </label>
                <div className={notValidClasses.amountCls}>
                  <input
                    ref="amount"
                    autoComplete="off"
                    type="number"
                    placeholder={this.props.t("step2EnterAmount")}
                    className="form-control"
                    required
                    defaultValue={this.state.amount}
                     />
                  <div className={notValidClasses.amountValGrpCls}>{this.state.amountValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2EthAddressLabel")}
                </label>
                <div className={notValidClasses.ethaddressCls}>
                  <input
                    ref="ethaddress"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2EnterEthAddress")}
                    className="form-control"
                    required
                    defaultValue={this.state.ethaddress}
                     />
                  <div className={notValidClasses.ethaddressValGrpCls}>{this.state.ethaddressValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step2Button")} onClick={this.getBurnTx}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step2Button")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
              </div>

              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step2RawTxLabel")}
                </label>  
                <div className={notValidClasses.sysrawtxunsignedCls}>
                  <textarea
                    rows="3"
                    ref="sysrawtxunsigned"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2EnterRawTx")}
                    className="form-control"
                    required
                    defaultValue={this.state.sysrawtxunsigned}
                     />
                  <div className={notValidClasses.sysrawtxunsignedValGrpCls}>{this.state.sysrawtxunsignedValMsg}</div>
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

export default Step2;
