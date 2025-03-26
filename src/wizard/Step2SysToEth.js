
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const sjs = require('syscoinjs-lib')
class Step2 extends Component {
  constructor(props) {
    super(props);
    let storageExists = typeof(Storage) !== "undefined";
    this.state = {
      txindex: props.getStore().txindex,
      txsiblings: props.getStore().txsiblings,
      syscoinblockheader: props.getStore().syscoinblockheader,
      txbytes: props.getStore().txbytes,
      txid: (storageExists && localStorage.getItem("txid")) || props.getStore().txid,
      nevmblockhash: props.getStore().nevmblockhash,
    };
      // INPUTS:
      // enter syscoin burn txid
      // enter block hash 
      // OUTPUTS:
      // _txIndex - transaction's index within the block
      // _txSiblings - transaction's Merkle siblings
      // _syscoinBlockHeader - block header containing transaction
    // step 4: 
      // INPUTS:
      // _txBytes - transaction bytes (autofilled with getrawtransaction)
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getProofs = this.getProofs.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  async componentDidMount() {
    if(!this.props.getStore().txid){
      this.props.jumpToStep(0);
    }
  
  }

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().txindex !== userInput.txindex  || 
        this.props.getStore().txsiblings !== userInput.txsiblings ||
        this.props.getStore().syscoinblockheader !== userInput.syscoinblockheader ||
        this.props.getStore().txbytes !== userInput.txbytes ||
        this.props.getStore().blockhash !== userInput.blockhash
        ) { // only update store of something changed
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
  async getProofs() {
    let userInput = this._grabUserInput(); 
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    let failed = false;
    this.setState({working: true});
    try {
      let results = await sjs.utils.fetchBackendSPVProof(CONFIGURATION.BlockbookAPIURL, this.props.getStore().txid.toString())
      if(results.error){
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = results.error;
        failed = true;
      }
      else if(results){
        if(results.result.length === 0) {
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = "Failed to retrieve SPV Proof";
          failed = true;
        } else {
          results = JSON.parse(results.result);
          if (!results.transaction) {
            validateNewInput.buttonVal = false;
            validateNewInput.buttonValMsg = "Failed to retrieve SPV Proof";
            failed = true;
          } else {
            validateNewInput.txbytes = results.transaction;
            console.log("txbytesVal " + validateNewInput.txbytes);
            validateNewInput.syscoinblockheader = results.header;
            console.log("syscoinblockheaderVal " + validateNewInput.syscoinblockheader);
            validateNewInput.txsiblings = results.siblings;
            console.log("txsiblingsVal " + validateNewInput.txsiblings);
            validateNewInput.txindex = results.index;
            console.log("txindexVal " + validateNewInput.txindex);
            validateNewInput.nevm_blockhash = results.nevm_blockhash;
            console.log("nevm_blockhash " + validateNewInput.nevm_blockhash);
          }
        }
      }
    }catch(e) {
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = (e && e.message)? e.message: this.props.t("genericError");
      failed = true;
    }
    this.setState({working: false});
    if(failed === false){
      validateNewInput.buttonValMsg = this.props.t("step2StatusSuccess");
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
      buttonVal: true,
      txindexVal: true,
      txsiblingsVal: true,
      syscoinblockheaderVal: true,
      txbytesVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      txindexValMsg: '',
      txsiblingsValMsg: '',
      syscoinblockheaderValMsg: '',
      txbytesValMsg: ''
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      txindex: this.state.txindex,
      txsiblings: this.state.txsiblings,
      syscoinblockheader: this.state.syscoinblockheader,
      txbytes: this.state.txbytes,
      nevm_blockhash: this.state.nevm_blockhash
    };
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
    return (
      <div className="step step2">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1 dangerouslySetInnerHTML={{__html: this.props.t("step2Head")}}></h1>
                <h3 dangerouslySetInnerHTML={{__html: this.props.t("step2Description")}}></h3>
              </label>
            
            <div className="row">
              <div className="col-md-12">
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default formbtn" aria-label={this.props.t("step2Button")} onClick={this.getProofs}>
                    <span className="glyphicon glyphicon-search" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step2Button")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
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
