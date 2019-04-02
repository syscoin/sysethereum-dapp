
import React, { Component } from 'react';
import SyscoinSuperblocks from '../SyscoinSuperblocks';
import { getProof } from 'bitcoin-proof'
import web3 from '../web3';
class Step5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
 
    };
    this.submitProofs = this.submitProofs.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }

  componentDidMount() {
    if(!this.props.getStore().superblockhash){
      this.props.jumpToStep(3);
    }
    else if(!this.props.getStore().ethaddress || !this.props.getStore().amount){
      this.props.jumpToStep(1);
    }
    else if(!this.props.getStore().blockhash || !this.props.getStore().txid){
      this.props.jumpToStep(2);
    }
  }

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    
    return isDataValid;
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
      buttonVal: true
    }
  }
  _validationErrors(val) {
    const errMsgs = {
    }
    return errMsgs;
  }
  async submitProofs() {
    let _txBytes = "0x" + this.props.getStore().txbytes;
    let _txSiblings = [];
    for(var i = 0;i<this.props.getStore().txsiblings.length;i++){
      let _txSibling = "0x" + this.props.getStore().txsiblings[i];
      _txSiblings.push(_txSibling);
    }
    let _syscoinBlockHeader = "0x" + this.props.getStore().syscoinblockheader;
    let _syscoinBlockSiblings = [];
    for(var i = 0;i<this.props.getStore().syscoinblocksiblings.length;i++){
      let _blockSibling = "0x" + this.props.getStore().syscoinblocksiblings[i];
      _syscoinBlockSiblings.push(_blockSibling);
    }  
    let _superblockHash = "0x" + this.props.getStore().superblockhash;
    let merkleProof = getProof(this.props.getStore().txsiblings, this.props.getStore().txindex);
    for(var i = 0;i<merkleProof.sibling.length;i++){
      merkleProof.sibling[i] = "0x" + merkleProof.sibling[i];
    }
    console.log("merkleProof" + merkleProof.toString());
    let recpt = await SyscoinSuperblocks.methods.relayTx(_txBytes, this.props.getStore().txindex, merkleProof.sibling, _syscoinBlockHeader, 
    this.props.getStore().syscoinblockindex, _syscoinBlockSiblings, _superblockHash, this.props.getStore().untrustedtargetcontract).send({gas: 1000000,from: "0x2f038a7306449dc9bcde25d8399dba36ee8ad6bf"});
     console.log("recpt " + recpt);
  }

 


  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};    
    if (typeof this.state.buttonVal == 'undefined' || this.state.buttonVal) {
      notValidClasses.buttonCls = 'has-success col-md-8';
      notValidClasses.buttonValGrpCls = 'val-success-tooltip';
    }
    else {
       notValidClasses.buttonCls = 'has-error col-md-8';
       notValidClasses.buttonValGrpCls = 'val-err-tooltip';
    }   
    return (
      <div className="step step5">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step5Head")}</h1>
              </label>
            </div>
            <div className="row content">
              <div className="col-md-12">
                {this.props.t("step5Description")}
              </div>
            </div>
            <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                </label>  
                <div className={notValidClasses.buttonCls}>
                    <button type="button" className="form-control btn btn-default" aria-label={this.props.t("step5Button")} onClick={this.submitProofs}>
                    <span className="glyphicon glyphicon-send" aria-hidden="true">&nbsp;</span>
                    {this.props.t("step5Button")}
                    </button>
                  <div className={notValidClasses.buttonValGrpCls}>{this.state.buttonValMsg}</div>
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step5;
