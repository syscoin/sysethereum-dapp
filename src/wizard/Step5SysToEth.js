
import React, { Component } from 'react';
import SyscoinSuperblocks from '../SyscoinSuperblocks';
import { getProof } from 'bitcoin-proof'
import web3 from '../web3';
class Step5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptStatus: '',
      receiptTxHash: '',
      receiptTxIndex: '',
      receiptFrom: '',
      receiptTo: '',
      receiptBlockhash: '', 
      receiptBlocknumber: '',
      receiptTotalGas: '',
      receiptGas: '',
      receiptObj: null,

    };
    this.submitProofs = this.submitProofs.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
    this.setStateFromReceipt = this.setStateFromReceipt.bind(this);
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
  downloadReceipt () {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(this.state.receiptObj, null, "   ")], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "receipt.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
    
    return isDataValid;
  }
  setStateFromReceipt(receipt, error, confirmation) {
    if(receipt.events && receipt.events.RelayTransaction && receipt.events.RelayTransaction.returnValues && receipt.events.RelayTransaction.returnValues[0]){
      const bigNum = web3.utils.toBN(receipt.events.RelayTransaction.returnValues[0]);
      if(bigNum === web3.utils.toBN(0)){
        error = this.props.t("step5ErrorCheckLog");
      }
    }
    else{
      error = this.props.t("step5ErrorCheckLog");
    }
    this.setState({
      receiptObj: receipt,
      receiptStatus: receipt.status === true? "true":"false",
      receiptTxHash: receipt.transactionHash,
      receiptTxIndex: receipt.transactionIndex,
      receiptFrom: receipt.from,
      receiptTo: receipt.to,
      receiptBlockhash: receipt.blockHash, 
      receiptBlocknumber: receipt.blockNumber,
      receiptTotalGas: receipt.cumulativeGasUsed,
      receiptGas: receipt.gasUsed,
      receiptConf: confirmation,
      buttonVal: error !== null? false: true, 
      buttonValMsg:  error !== null? error: this.props.t("step5Success")}); 
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
    this.setState({
      receiptStatus: '',
      receiptTxHash: '',
      receiptTxIndex: '',
      receiptFrom: '',
      receiptTo: '',
      receiptBlockhash: '', 
      receiptBlocknumber: '',
      receiptTotalGas: '',
      receiptGas: '',
      receiptConf: 0,
      receiptObj: null,
      buttonVal: true, 
      buttonValMsg: ""});
    let accounts = await web3.eth.getAccounts();
    if(!accounts || !accounts[0] || accounts[0] === 'undefined')
    {
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5LoginMetamask")});
      return;
    }
    this.setState({buttonVal: true, buttonValMsg: this.props.t("step5AuthMetamask")});
    let _txBytes = "0x" + this.props.getStore().txbytes;
    let _txSiblings = [];
    for(let i = 0;i<this.props.getStore().txsiblings.length;i++){
      let _txSibling = "0x" + this.props.getStore().txsiblings[i];
      _txSiblings.push(_txSibling);
    }
    let _syscoinBlockHeader = "0x" + this.props.getStore().syscoinblockheader;
    let _syscoinBlockSiblings = [];
    for(let i = 0;i<this.props.getStore().syscoinblocksiblings.length;i++){
      let _blockSibling = "0x" + this.props.getStore().syscoinblocksiblings[i];
      _syscoinBlockSiblings.push(_blockSibling);
    }  
    let _superblockHash = "0x" + this.props.getStore().superblockhash;
    let merkleProof = getProof(this.props.getStore().txsiblings, this.props.getStore().txindex);
    for(let   i = 0;i<merkleProof.sibling.length;i++){
      merkleProof.sibling[i] = "0x" + merkleProof.sibling[i];
    }

    let thisObj = this;
     SyscoinSuperblocks.methods.relayTx(_txBytes, this.props.getStore().txindex, merkleProof.sibling, _syscoinBlockHeader, 
      this.props.getStore().syscoinblockindex, _syscoinBlockSiblings, _superblockHash, this.props.getStore().untrustedtargetcontract).send({from: accounts[0], gas: 500000})
      .on('transactionHash', function(hash){
        thisObj.setState({receiptTxHash: hash, buttonVal: true, buttonValMsg: thisObj.props.t("step5PleaseWait")});
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        thisObj.setStateFromReceipt(receipt, null, confirmationNumber);
        })
      .on('error', (error, receipt) => {
        if(receipt){
          thisObj.setStateFromReceipt(receipt, error.message.substring(0, 40), 0);
        }
        else{
          thisObj.setState({buttonVal: false, buttonValMsg:  error.message.substring(0, 40)}); 
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
    return (
      <div className="step step5">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step5Head")}</h1>
                <h3>{this.props.t("step5Description")}</h3>
              </label>
              <div className="row">
              <div className="col-md-12">
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

export default Step5;
