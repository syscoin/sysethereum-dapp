
import React, { Component } from 'react';
import sbconfig from '../SyscoinSuperblocks';
import { getProof } from 'bitcoin-proof'
import Web3 from 'web3';
import CONFIGURATION from '../config';
const web3 = new Web3(Web3.givenProvider);
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
      working: false

    };
    this.submitProofs = this.submitProofs.bind(this);
    this.downloadReceipt = this.downloadReceipt.bind(this);
    this.setStateFromReceipt = this.setStateFromReceipt.bind(this);
    this.isValidated = this.isValidated.bind(this);
  }
  isValidated() {
    if(this.state.receiptObj === null){
      return false;
    }
    this.props.updateStore({
      ...this.state,
      savedToCloud: false // use this to notify step4 that some changes took place and prompt the user to save again
    });
    return true;
  }
  componentDidMount() {
    if(!this.props.getStore().superblockhash){
      this.props.jumpToStep(3);
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
 
  setStateFromReceipt(receipt, error, confirmation) {
    if(receipt.transactionHash && this.state.receiptTxHash !== receipt.transactionHash){
      return;
    }
    if(receipt.events && receipt.events.RelayTransaction && receipt.events.RelayTransaction.returnValues && receipt.events.RelayTransaction.returnValues[0]){
      if(receipt.events.RelayTransaction.returnValues[0] === 0 || receipt.events.RelayTransaction.returnValues[1] === 0){
        error = this.props.t("step5ErrorEVMCheckLog");
      }
    }
    else if(receipt.logs){
      for(let i = 0;i< receipt.logs.length;i++){
        if(receipt.logs[i].address.toLowerCase() === CONFIGURATION.superblockContract.toLowerCase()){
          let topic1 = "0x" + receipt.logs[i].data.substring(2, 66);
          let topic2 = "0x" + receipt.logs[i].data.substring(66, 130);
          if(parseInt(topic1) === 0 || parseInt(topic2) === 0){
            error = this.props.t("step5ErrorEVMCheckLog");
            break;
          }
        }
      }
    }
    else{
      error = this.props.t("step5ErrorEventCheckLog");
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

  async submitProofs() {
    if(!web3 || !web3.currentProvider || web3.currentProvider.isMetaMask === false){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("step5InstallMetamask")});
      return;  
    }
    let chainId = await web3.eth.getChainId();
    if(CONFIGURATION.testnet && chainId !== 4){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseTestnet")});
      return;       
    }
    else if(!CONFIGURATION.testnet && chainId !== 1){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepUseMainnet")});
      return;       
    }
    let SyscoinSuperblocks = new web3.eth.Contract(sbconfig.data, sbconfig.contract); 
    if(!SyscoinSuperblocks || !SyscoinSuperblocks.methods || !SyscoinSuperblocks.methods.relayTx){
      this.setState({buttonVal: false, buttonValMsg: this.props.t("stepSuperblock")});
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
      if(window.ethereum){
        await window.ethereum.enable();
      }
     
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
    this.setState({working: true});
    let thisObj = this;
    thisObj.state.receiptObj = null;

     SyscoinSuperblocks.methods.relayTx(_txBytes, this.props.getStore().txindex, merkleProof.sibling, _syscoinBlockHeader, 
      this.props.getStore().syscoinblockindex, _syscoinBlockSiblings, _superblockHash, this.props.getStore().untrustedtargetcontract).send({from: accounts[0], gas: 500000})
      .on('transactionHash', function(hash){
        thisObj.setState({receiptTxHash: hash, buttonVal: true, buttonValMsg: thisObj.props.t("step5PleaseWait")});
      })
      .on('confirmation', function(confirmationNumber, receipt){ 
        if(thisObj.state.receiptObj === null){
          thisObj.setStateFromReceipt(receipt, null, confirmationNumber);
          thisObj.setState({working: false});
          
        } else {
          thisObj.setState({receiptConf: confirmationNumber});
        }
      })
      .on('error', (error, receipt) => {
        thisObj.setState({working: false});
        if(error.message.length <= 512 && error.message.indexOf("{") !== -1){
          error = JSON.parse(error.message.substring(error.message.indexOf("{")));
        }
        let message = error.message.toString();
        if(receipt){
          thisObj.setStateFromReceipt(receipt, message, 0);
        }
        else{
          thisObj.setState({buttonVal: false, buttonValMsg:  message}); 
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
                    <button type="button" disabled={this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step5Button")} onClick={this.submitProofs}>
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
                    <button type="button" disabled={!this.state.receiptObj || this.state.working} className="form-control btn btn-default" aria-label={this.props.t("step5Download")} onClick={this.downloadReceipt}>
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
