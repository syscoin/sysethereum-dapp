
import React, { Component } from 'react';
import CONFIGURATION from '../config';
import EthProof from 'eth-proof';
const rlp = require('rlp');
const axios = require('axios');
class Step2ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mintsysrawtxunsigned: props.getStore().mintsysrawtxunsigned,
      ethburntxid: this.props.getStore().ethburntxid,
      working: false
    };
    
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getMintTx = this.getMintTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {
    if((!this.props.getStore().toSysAssetGUID && !this.props.getStore().toSysAssetGUID == 0) ||
    !this.props.getStore().toSysAmount ||
    !this.props.getStore().syscoinWitnessAddress){
      this.props.jumpToStep(0);
    }
    if(this.props.getStore().receiptTxHash){
      this.state.ethburntxid = this.props.getStore().receiptTxHash;
    }
  }


  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if(this.props.getStore().mintsysrawtxunsigned !== userInput.mintsysrawtxunsigned || this.props.getStore().ethburntxid !== userInput.ethburntxid) { // only update store of something changed
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
  async getMintTx() {
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.mintsysrawtxunsignedVal = true; 
    if(!userInput.ethburntxid || userInput.ethburntxid === ""){
      validateNewInput.ethburntxidVal = false;
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      return;
    } 
       
    let self = this;
    this.setState({working: true});

    let toSysAssetGUID = this.props.getStore().toSysAssetGUID ;
    let toSysAmount =  this.props.getStore().toSysAmount.toString();
    let syscoinWitnessAddress =  this.props.getStore().syscoinWitnessAddress;
    let ethTXID = userInput.ethburntxid;

    const buildEthProof = new EthProof(CONFIGURATION.infuraURL);
    try{
        let result = await buildEthProof.getTransactionProof(ethTXID);
        let tx_hex = rlp.encode(result.value).toString('hex');
        let tx_root_hex = rlp.encode(result.header[4]).toString('hex') ;
        let txmerkleproof_hex =  rlp.encode(result.parentNodes).toString('hex');
        let txmerkleproofpath_hex = result.path.toString('hex');
        let blockNumber = result.blockNumber || this.props.getStore().receiptBlocknumber;

        result = await buildEthProof.getReceiptProof(ethTXID);
        let receipt_hex = rlp.encode(result.value).toString('hex');
        let receipt_root_hex = rlp.encode(result.header[5]).toString('hex') ;
        let receiptmerkleproof_hex =  rlp.encode(result.parentNodes).toString('hex');

        console.log("tx_root_hex " + tx_root_hex);
        console.log("tx_hex: " + tx_hex);
        console.log("txmerkleproof_hex: " + txmerkleproof_hex);
        console.log("txmerkleproofpath_hex: " + txmerkleproofpath_hex);
        
        console.log("receipt_root_hex " + receipt_root_hex);
        console.log("receipt_hex: " + receipt_hex);
        console.log("receiptmerkleproof_hex: " + receiptmerkleproof_hex);
        console.log("block number: " + blockNumber);
        if(toSysAssetGUID.length > 0 && toSysAssetGUID !== "0" && toSysAssetGUID !== 0){
          
          try {
            // [asset] [address] [amount] [tx_hex] [txroot_hex] [txmerkleproof_hex] [txmerkleroofpath_hex] [receipt_hex] [receiptroot_hex] [receiptmerkleproof_hex] [receiptmerkleroofpath_hex] [witness]
            let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=assetallocationmint&asset=' + toSysAssetGUID + '&address=' + syscoinWitnessAddress + '&amount=' + toSysAmount + '&blocknumber=' + blockNumber + '&tx_hex=' + tx_hex + '&txroot_hex=' + tx_root_hex + '&txmerkleproof_hex=' + txmerkleproof_hex + '&txmerkleproofpath_hex=' + txmerkleproofpath_hex + '&receipt_hex=' + receipt_hex + '&receiptroot_hex=' + receipt_root_hex + '&receiptmerkleproof_hex=' + receiptmerkleproof_hex + "&witness=''");
            results = results.data;
            if(results.error){
              validateNewInput.buttonVal = false;
              validateNewInput.buttonValMsg = results.error;
              console.log("error " + results.error);
              self.setState({working: false});
            }
            else if(results && results.hex){
              validateNewInput.mintsysrawtxunsignedVal = true;
              this.refs.mintsysrawtxunsigned.value = results.hex;
              userInput.mintsysrawtxunsigned = results.hex;
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
          
          try {
            //  [address] [amount] [tx_hex] [txroot_hex] [txmerkleproof_hex] [txmerkleproofpath_hex] [receipt_hex] [receiptroot_hex] [receiptmerkleproof_hex] [receiptmerkleroofpath_hex] [witness]
            let results = await axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=syscoinmint&address=' + syscoinWitnessAddress + '&amount=' + toSysAmount + '&blocknumber=' + blockNumber + '&tx_hex=' + tx_hex + '&txroot_hex=' + tx_root_hex + '&txmerkleproof_hex=' + txmerkleproof_hex + '&txmerkleproofpath_hex=' + txmerkleproofpath_hex + '&receipt_hex=' + receipt_hex + '&receiptroot_hex=' + receipt_root_hex + '&receiptmerkleproof_hex=' + receiptmerkleproof_hex + "&witness=''");
            results = results.data;
            if(results.error){
              validateNewInput.buttonVal = false;
              validateNewInput.buttonValMsg = results.error;
              self.setState({working: false});
            }
            else if(results && results.hex){
              validateNewInput.mintsysrawtxunsignedVal = true;
              this.refs.mintsysrawtxunsigned.value = results.hex;
              userInput.mintsysrawtxunsigned = results.hex;
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

        this.setState({working: false});
    }catch(e){      
      validateNewInput.buttonVal = false;
      validateNewInput.buttonValMsg = this.props.t("step2ESInvalidProof") + e;
      this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
      this.setState({working: false});
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
      ethburntxidVal: true,
      mintsysrawtxunsignedVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      ethburntxidValMsg: val.ethburntxidVal && val.ethburntxidVal === true ? '' : this.props.t("step2ESTxid"),
      mintsysrawtxunsignedValMsg: val.mintsysrawtxunsignedVal ? '' : this.props.t("step2ESRawTx")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      ethburntxid: this.refs.ethburntxid.value,
      mintsysrawtxunsigned: this.refs.mintsysrawtxunsigned.value
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.ethburntxidVal == 'undefined' || this.state.ethburntxidVal) {
      notValidClasses.ethburntxidCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.ethburntxidCls = 'has-error col-md-8';
      notValidClasses.ethburntxidValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.mintsysrawtxunsignedVal == 'undefined' || this.state.mintsysrawtxunsignedVal) {
      notValidClasses.mintsysrawtxunsignedCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.mintsysrawtxunsignedCls = 'has-error col-md-8';
      notValidClasses.mintsysrawtxunsignedValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.buttonCls = 'has-error col-md-8';
      notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step2es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
            <label className="col-md-12 control-label">
                <h1>{this.props.t("step2ESHead")}</h1>
                <h3>{this.props.t("step2ESDescription")}</h3>
              </label>
             
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                  {this.props.t("step3TxidLabel")}
                </label>
                <div className={notValidClasses.ethburntxidCls}>
                  <input
                    ref="ethburntxid"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2ESEnterTxid")}
                    className="form-control"
                    defaultValue={this.state.ethburntxid}
                    required
                     />
                  <div className={notValidClasses.ethburntxidValGrpCls}>{this.state.ethburntxidValMsg}</div>
                </div>
              </div>
              </div>          
              <div className="row">
              <div className="col-md-12">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step2Button")} onClick={this.getMintTx}>
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
                <div className={notValidClasses.mintsysrawtxunsignedCls}>
                  <textarea
                    rows="3"
                    ref="mintsysrawtxunsigned"
                    autoComplete="off"
                    type="text"
                    placeholder={this.props.t("step2EnterRawTx")}
                    className="form-control"
                    required
                    defaultValue={this.state.mintsysrawtxunsigned}
                     />
                  <div className={notValidClasses.mintsysrawtxunsignedValGrpCls}>{this.state.mintsysrawtxunsignedValMsg}</div>
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
