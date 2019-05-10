
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const axios = require('axios');
class Step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txindex: props.getStore().txindex,
      txsiblings: props.getStore().txsiblings,
      syscoinblockheader: props.getStore().syscoinblockheader,
      syscoinblockindex: props.getStore().syscoinblockindex,
      superblockhash: props.getStore().superblockhash,
      syscoinblocksiblings: props.getStore().syscoinblocksiblings,
      txbytes: props.getStore().txbytes,
      untrustedtargetcontract: props.getStore().untrustedtargetcontract
    };
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
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getProofs = this.getProofs.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {
    if(!this.props.getStore().blockhash || !this.props.getStore().txid){
      this.props.jumpToStep(2);
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
        this.props.getStore().syscoinblockindex !== userInput.syscoinblockindex ||
        this.props.getStore().syscoinblocksiblings !== userInput.syscoinblocksiblings ||
        this.props.getStore().txbytes !== userInput.txbytes ||
        this.props.getStore().untrustedtargetcontract !== userInput.untrustedtargetcontract ||
        this.props.getStore().superblockhash !== userInput.superblockhash 
        ) { // only update store of something changed
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
  async getProofs() {
    let userInput = this._grabUserInput(); 
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    let failed = false;
    this.setState({working: true});
    try {
      let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=syscoingetspvproof&txid=' + this.props.getStore().txid.toString() + '&blockhash=' + this.props.getStore().blockhash.toString());
      results = results.data;
      if(results.error){
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = results.error;
        console.log("error " + results.error);
        failed = true;
      }
      else if(results){
        validateNewInput.txbytes = results.transaction;
        console.log("txbytesVal " + validateNewInput.txbytes);
        validateNewInput.syscoinblockheader = results.header;
        console.log("syscoinblockheaderVal " + validateNewInput.syscoinblockheader);
        validateNewInput.txsiblings = results.siblings;
        console.log("txsiblingsVal " + validateNewInput.txsiblings);
        validateNewInput.txindex = results.index;
        console.log("txindexVal " + validateNewInput.txindex);
        validateNewInput.untrustedtargetcontract = results.contract;
        console.log("untrustedtargetcontractVal " + validateNewInput.untrustedtargetcontract);
      }
    }catch(e) {
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = e.message;
      console.log("error " + e.message);
      failed = true;
    }
    if(failed === false){
      axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/spvproof?hash=' + (this.props.getStore().blockhash.toString()))
      .then(response => {
        this.setState({working: false});
        console.log(response);
        if(response.data.error){
          console.log("spvproof error1 " + response.data.error);
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = response.data.error;  
        }
        else{
          validateNewInput.syscoinblockindex = response.data.index;
          console.log("syscoinblockindex " + validateNewInput.syscoinblockindex);
          validateNewInput.syscoinblocksiblings = response.data.merklePath;
          console.log("syscoinblocksiblings1 " + validateNewInput.syscoinblocksiblings);
          validateNewInput.superblockhash = response.data.superBlock;
          console.log("superblockhash " + validateNewInput.superblockhash);
          validateNewInput.buttonValMsg = this.props.t("step4SbStatusSuccess");
        }
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      })
      .catch(error => {
        console.log("spvproof error2 " + error);
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = error.message; 
        this.setState({working: false});
        this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));    
      });   
    }else{
      this.setState({working: false});
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
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
      buttonVal: true,
      txindexVal: true,
      txsiblingsVal: true,
      syscoinblockheaderVal: true,
      syscoinblockindexVal: true,
      syscoinblocksiblingsVal: true,
      superblockhashVal: true,
      txbytesVal: true,
      untrustedtargetcontractVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      txindexValMsg: '',
      txsiblingsValMsg: '',
      syscoinblockheaderValMsg: '',
      syscoinblockindexValMsg: '',
      syscoinblocksiblingsValMsg: '',
      superblockhashValMsg: '',
      txbytesValMsg: '',
      untrustedtargetcontractValMsg: ''
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      txindex: this.state.txindex,
      txsiblings: this.state.txsiblings,
      syscoinblockheader: this.state.syscoinblockheader,
      syscoinblockindex: this.state.syscoinblockindex,
      syscoinblocksiblings: this.state.syscoinblocksiblings,
      superblockhash: this.state.superblockhash,
      txbytes: this.state.txbytes,
      untrustedtargetcontract: this.state.untrustedtargetcontract
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
      <div className="step step4">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step4Head")}</h1>
                <h3>{this.props.t("step4Description")}</h3>
              </label>
            
            <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step4Button")} onClick={this.getProofs}>
                    <span className="glyphicon glyphicon-search" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step4Button")}
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

export default Step4;
