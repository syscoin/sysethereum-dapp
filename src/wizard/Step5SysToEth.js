
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
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5InstallMetamask")});
      return;  
    }
    this.setState({buttonVal: true, buttonValMsg: ""});
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5LoginMetamask")});
      return;
    }
    this.setState({buttonVal: true, buttonValMsg: this.props.t("step5AuthMetamask")});
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
    try{
      let recpt = await SyscoinSuperblocks.methods.relayTx(_txBytes, this.props.getStore().txindex, merkleProof.sibling, _syscoinBlockHeader, 
      this.props.getStore().syscoinblockindex, _syscoinBlockSiblings, _superblockHash, this.props.getStore().untrustedtargetcontract).send({from: accounts[0], gas: 1000000});
      console.log("recpt " + recpt);
    }
    catch(error){
      this.setState({buttonVal: false, buttonValMsg: error.message});
      return;
    }
     this.setState({buttonVal: true, buttonValMsg:  this.props.t("step5Success")});
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
