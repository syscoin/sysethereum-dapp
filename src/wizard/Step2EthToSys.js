
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const sjs = require('syscoinjs-lib')
class Step2ES extends Component {
  constructor(props) {
    super(props);
    let storageExists = typeof(Storage) !== "undefined";
    this.state = {
      minttxid: (storageExists && localStorage.getItem("minttxid")) || props.getStore().minttxid,
      ethburntxid: (storageExists && localStorage.getItem("receiptTxHash")) || this.props.getStore().receiptTxHash,
      working: false
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getMintTx = this.getMintTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.syscoinjs = new sjs.SyscoinJSLib(null, CONFIGURATION.BlockbookAPIURL, CONFIGURATION.SysNetwork)
  }
  saveToLocalStorage() {
    if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      localStorage.setItem("receiptTxHash", this.refs.ethburntxid.value);
      localStorage.setItem("minttxid", this.refs.minttxid.value);
    } else {
      // Sorry! No Web Storage support..
    }
  }
  componentDidMount() {
  }
  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if(this.props.getStore().minttxid !== userInput.minttxid || this.props.getStore().ethburntxid !== userInput.ethburntxid) { // only update store of something changed
          this.props.updateStore({
            ...userInput,
            savedToCloud: false // use this to notify step3 that some changes took place and prompt the user to save again
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
  async assetMintToSys(ethTXID, xpub, sysChangeAddress) {
    const feeRate = new sjs.utils.BN(10)
    const txOpts = { rbf: true }
    // web3 URL + ID and nevm burn txid
    const assetOpts = {
      web3url: CONFIGURATION.Web3URL,
      ethtxid: ethTXID
    }
    // will be auto filled based on ethtxid eth-proof
    const assetMap = null
    const res = await this.syscoinjs.assetAllocationMint(assetOpts, txOpts, assetMap, sysChangeAddress, feeRate, xpub)
    let err = null
    if (!res) {
      err = 'Could not create transaction, not enough funds?'
      return {data: null, error: err}
    }
    const serializedResp = sjs.utils.exportPsbtToJson(res.psbt, res.assets);
    const signRes = await window.ConnectionsController.signAndSend(serializedResp);
    const unserializedResp = sjs.utils.importPsbtFromJson(signRes, CONFIGURATION.SysNetwork);
    return {txid: unserializedResp.psbt.extractTransaction().getId(), error: null}
  }
  async getMintTx() {
    if (!window.ConnectionsController) {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step2InstallPali")});
      return;  
    }
    let connectedAccount;
    try {
      connectedAccount = await window.ConnectionsController.getConnectedAccount();
    } catch(e) {
      this.setState({buttonVal: false, buttonValMsg: e.message || e});
      return;  
    }
    if (!connectedAccount) {
      await window.ConnectionsController.connectWallet()
    }
    let xpub;
    try {
      xpub = await window.ConnectionsController.getConnectedAccountXpub();
    } catch(e){
      this.setState({buttonVal: false, buttonValMsg: e.message || e});
      return;  
    }
    // we don't need change address but we get it for pali compatibility, inside syscoinjs lib it will override change with the destination sys address
    const sysChangeAddress = await window.ConnectionsController.getChangeAddress();
    if(!sysChangeAddress) {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step2SelectPaliAccount")});
      return;  
    }
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.minttxidVal = true;  
    if(!userInput.ethburntxid || userInput.ethburntxid === ""){
      validateNewInput.ethburntxidVal = false;
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;
    }  
    let self = this;
    this.setState({working: true});
    let ethTXID = userInput.ethburntxid;
    
    try {
      let results = await this.assetMintToSys(ethTXID, xpub, sysChangeAddress)
      if(results.error){
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = results.error;
        self.setState({working: false});
        self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      }
      else if(results.txid){
        validateNewInput.buttonVal = false;
        validateNewInput.minttxidVal = true;
        this.refs.minttxid.value = results.txid;
        userInput.minttxid = results.txid;
        validateNewInput.buttonValMsg = "Success!";
        self.setState({working: false});
        self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
        this.saveToLocalStorage();
      }
    }catch(e) {
      validateNewInput.minttxidVal = false;  
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = (e && e.message)? e.message: this.props.t("genericError");
      self.setState({working: false});
      self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    }
    this.setState({working: false});
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
      ethburntxidVal: true,
      minttxidVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      ethburntxidValMsg: val.ethburntxidVal && val.ethburntxidVal === true ? '' : this.props.t("step2ESTxid"),
      minttxidValMsg: val.minttxidVal ? '' : this.props.t("step2RawTx")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      ethburntxid: this.refs.ethburntxid.value,
      minttxid: this.refs.minttxid.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.ethburntxidVal == 'undefined' || this.state.ethburntxidVal) {
      notValidClasses.ethburntxidCls = 'no-error';
    }
    else {
      notValidClasses.ethburntxidCls = 'has-error';
      notValidClasses.ethburntxidValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.minttxidVal == 'undefined' || this.state.minttxidVal) {
      notValidClasses.minttxidCls = 'no-error ';
    }
    else {
      notValidClasses.minttxidCls = 'has-error';
      notValidClasses.minttxidValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error';
    }
    else if (this.state.minttxidVal) {
      notValidClasses.buttonCls = 'has-success';
      notValidClasses.buttonValGrpCls = 'val-success-tooltip active';
    }
    else {
      notValidClasses.buttonCls = 'has-error';
      notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step2es">
        <div className="row">
          <form id="Form" >
            <div className="form-group">

              <label className="col-md-12">
                  <h1 dangerouslySetInnerHTML={{__html: this.props.t("step2ESHead")}}></h1>
                  <h3 dangerouslySetInnerHTML={{__html: this.props.t("step2ESDescription")}}></h3>
              </label>
             
                <div className="row">
                <div className="col-md-12">
                    <label className="control-label col-md-4">
                      {this.props.t("txidLabel")}
                    </label>
                    <div className={notValidClasses.ethburntxidCls}>
                      <input
                        ref="ethburntxid"
                        autoComplete="off"
                        type="text"
                        placeholder={this.props.t("step2ESEnterTxid")}
                        className="form-control"
                        required
                        defaultValue={this.state.ethburntxid}
                        />
                      <div className={notValidClasses.ethburntxidValGrpCls}>{this.state.ethburntxidValMsg}</div>
                    </div>
                  </div>
                </div> 


                <div className="row">
                <div className="col-md-4 col-sm-12 col-centered">
  
                  <div className={notValidClasses.buttonCls}>
                      <button type="button" disabled={this.state.working} className="form-control btn btn-default formbtn" aria-label={this.props.t("step2Button")} onClick={this.getMintTx}>
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
                    {this.props.t("step2TxLabel")}
                  </label>  
                  <div className={notValidClasses.minttxidCls}>
                    <textarea
                      rows="3"
                      ref="minttxid"
                      autoComplete="off"
                      type="text"
                      placeholder={this.props.t("step2EnterTx")}
                      className="form-control"
                      required
                      defaultValue={this.state.minttxid}
                      />
                    <div className={notValidClasses.minttxidValGrpCls}>{this.state.minttxidValMsg}</div>
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

export default Step2ES;
