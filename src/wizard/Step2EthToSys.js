
import React, { Component } from 'react';
import CONFIGURATION from '../config';
const sjs = require('syscoinjs-lib')
const axios = require('axios');
class Step2ES extends Component {
  constructor(props) {
    super(props);
    let storageExists = typeof(Storage) !== "undefined";
    this.state = {
      mintsysrawtxunsigned: (storageExists && localStorage.getItem("mintsysrawtxunsigned")) || props.getStore().mintsysrawtxunsigned,
      ethburntxid: (storageExists && localStorage.getItem("receiptTxHash")) || this.props.getStore().receiptTxHash,
      working: false
    };
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getMintTx = this.getMintTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }
  saveToLocalStorage() {
    if (typeof(Storage) !== "undefined") {
      // Code for localStorage/sessionStorage.
      localStorage.setItem("receiptTxHash", this.refs.ethburntxid.value);
      localStorage.setItem("mintsysrawtxunsigned", this.refs.mintsysrawtxunsigned.value);
    } else {
      // Sorry! No Web Storage support..
    }
  }
  componentDidMount() {}
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
    let ethTXID = userInput.ethburntxid;
    
    try{
      const buildEthProof = await sjs.utils.buildEthProof({infuraurl: CONFIGURATION.infuraURL, ethtxid: ethTXID});
       
      let tx_hex = buildEthProof.txvalue;
      let txmerkleproof_hex = buildEthProof.txparentnodes;
      let txmerkleproofpath_hex = buildEthProof.txpath;
      let blockNumber = buildEthProof.blocknumber;

      let receipt_hex = buildEthProof.receiptvalue;
      let receiptmerkleproof_hex =  buildEthProof.receiptparentnodes;
      let bridgeTransferId = buildEthProof.bridgetransferid;
      let toSysAssetGUID = buildEthProof.assetguid ;
      let toSysAmount =  buildEthProof.amount
      let syscoinWitnessAddress =  buildEthProof.destinationaddress
      console.log("tx_hex: " + tx_hex);
      console.log("txmerkleproof_hex: " + txmerkleproof_hex);
      console.log("txmerkleproofpath_hex: " + txmerkleproofpath_hex);
      
      console.log("receipt_hex: " + receipt_hex);
      console.log("receiptmerkleproof_hex: " + receiptmerkleproof_hex);
      console.log("block number: " + blockNumber);
      try {
        let results = await axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/syscoinrpc?method=assetallocationmint&asset=' + toSysAssetGUID + '&address=' + syscoinWitnessAddress + '&amount=' + toSysAmount + '&blocknumber=' + blockNumber + '&bridgetransferid=' + bridgeTransferId + '&tx_hex=' + tx_hex + '&txmerkleproof_hex=' + txmerkleproof_hex + '&txmerkleproofpath_hex=' + txmerkleproofpath_hex + '&receipt_hex=' + receipt_hex + '&receiptroot_hex=' + receiptmerkleproof_hex);
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
          this.saveToLocalStorage();
        }
      }catch(e) {
        validateNewInput.buttonVal = false;
        validateNewInput.buttonValMsg = e.message;
        self.setState({working: false});
        self.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
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
      notValidClasses.ethburntxidCls = 'no-error';
    }
    else {
      notValidClasses.ethburntxidCls = 'has-error';
      notValidClasses.ethburntxidValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.mintsysrawtxunsignedVal == 'undefined' || this.state.mintsysrawtxunsignedVal) {
      notValidClasses.mintsysrawtxunsignedCls = 'no-error ';
    }
    else {
      notValidClasses.mintsysrawtxunsignedCls = 'has-error';
      notValidClasses.mintsysrawtxunsignedValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'no-error ';
    }
    else {
      notValidClasses.buttonCls = 'has-error ';
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
                      {this.props.t("step3TxidLabel")}
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
