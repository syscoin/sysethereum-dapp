
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const axios = require('axios');
class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sysrawtxunsigned: props.getStore().sysrawtxunsigned,
      txid: props.getStore().txid,
      blockhash: props.getStore().blockhash,
      working: false
    };
    
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getBlockhash = this.getBlockhash.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
   
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
        if (this.props.getStore().txid !== userInput.txid  || 
        this.props.getStore().blockhash !== userInput.blockhash) { // only update store of something changed
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
  async getBlockhash() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.blockhashVal = true;
    validateNewInput.blockhashValMsg = "";
    let valid = true;
    if(!userInput.txid || userInput.txid === ""){
      validateNewInput.txidVal = false;
      valid = false;
    }        
    if(valid === true){
      this.setState({working: true});
      let txid = userInput.txid.toString();
      try {
        let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=getblockhashbytxid&txid=' + txid);
        results = results.data;
        if(results.error){
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = results.error;
          this.setState({working: false});
          console.log("error " + results.error);
        }
        else if(results && results.hex){
          validateNewInput.blockhashVal = true;
          this.refs.blockhash.value = results.hex;
          this.setState({working: false});
        }
      }catch(e) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = e.message;
        this.setState({working: false});
        console.log("error " + e.message);
      }
    } 
    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));

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
      txidVal: true,
      blockhashVal: data.blockhash && data.blockhash !== ""? true: false,
      buttonVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      txidValMsg: val.txidVal && val.txidVal === true ? '' : this.props.t("step3Txid"),
      blockhashValMsg: val.blockhashVal && val.blockhashVal === true ? '' : this.props.t("step3Blockhash")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      txid: this.refs.txid.value,
      blockhash: this.refs.blockhash.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.txidVal == 'undefined' || this.state.txidVal) {
      notValidClasses.txidCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.txidCls = 'has-error col-md-8';
      notValidClasses.txidValGrpCls = 'val-err-tooltip';
    }

    if (typeof this.state.blockhashVal == 'undefined' || this.state.blockhashVal) {
        notValidClasses.blockhashCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.blockhashCls = 'has-error col-md-8';
       notValidClasses.blockhashValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.buttonCls = 'has-error col-md-8';
      notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step3">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step3Head")}</h1>
                <h3>{this.props.t("step3Description")}</h3>
              </label>
           
            <div className="row">
            <div className="col-md-12 ">
                <label className="control-label col-md-4">
                  {this.props.t("step2RawTxLabel")}
                </label>  
                <div className="col-md-8">
                    <textarea
                      rows="3"
                      autoComplete="off"
                      type="text"
                      className="form-control"
                      defaultValue={this.state.sysrawtxunsigned}
                      />
                </div>
              </div>
            </div>
            <div className="row">
            <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step3TxidLabel")}
                </label>
                <div className={notValidClasses.txidCls}>
                  <input
                    ref="txid"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step3EnterTxid")}
                    className="form-control"
                    defaultValue={this.state.txid}
                    required
                     />
                  <div className={notValidClasses.txidValGrpCls}>{this.state.txidValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step3Button")} onClick={this.getBlockhash}>
                    <span className="glyphicon glyphicon-search" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step3Button")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step3BlockhashLabel")}
                </label>
                <div className={notValidClasses.blockhashCls}>
                  <input
                    ref="blockhash"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step3EnterBlockHash")}
                    className="form-control"
                    defaultValue={this.state.blockhash}
                     />
                  <div className={notValidClasses.blockhashValGrpCls}>{this.state.blockhashValMsg}</div>
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

export default Step3;
