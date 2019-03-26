
import React, { Component } from 'react';

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      asset: props.getStore().asset,
      amount: props.getStore().amount,
      ethaddress: props.getStore().ethaddress,
      sysrawtxunsigned: props.getStore().sysrawtxunsigned
    };
    
    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms

    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    
  }

  componentDidMount() {}

  componentWillUnmount() {}

  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (Object.keys(validateNewInput).every((k) => { return validateNewInput[k] === true })) {
        if (this.props.getStore().asset !== userInput.asset || this.props.getStore().amount !== userInput.amount || this.props.getStore().ethaddress !== userInput.ethaddress
        || this.props.getStore().sysrawtxunsigned !== userInput.sysrawtxunsigned) { // only update store of something changed
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

  validationCheck() {
    if (!this._validateOnDemand)
      return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(Object.assign(userInput, validateNewInput, this._validationErrors(validateNewInput)));
  }

   _validateData(data) {
    return  {
      assetVal: true, // not-required: regex for positive integer
      amountVal: true,// required: regex for positive integer
      ethaddressVal: true, // required: regex hex string
      sysrawtxunsignedVal: true
    }
  }

  _validationErrors(val) {
    const errMsgs = {
      assetValMsg: val.assetVal ? '' : this.props.t("step2Asset"),
      amountValMsg: val.amountVal && val.amountVal == true ? '' : this.props.t("step2Amount"),
      ethaddressValMsg: val.ethaddressVal ? '' : this.props.t("step2EthAddress"),
      sysrawtxunsignedValMsg: val.sysrawtxunsignedVal ? '' : this.props.t("step2RawTx")
    }
    return errMsgs;
  }

  _grabUserInput() {
    return {
      asset: this.refs.asset,
      amount: this.refs.amount,
      ethaddress: this.refs.ethaddress,
      sysrawtxunsigned: this.refs.sysrawtxunsigned
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.assetVal == 'undefined' || this.state.assetVal) {
      notValidClasses.assetCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.assetCls = 'has-error col-md-8';
       notValidClasses.assetValGrpCls = 'val-err-tooltip';
    }

    if (typeof this.state.amountVal == 'undefined' || this.state.amountVal) {
        notValidClasses.amountCls = 'no-error col-md-8';
    }
    else {
       notValidClasses.amountCls = 'has-error col-md-8';
       notValidClasses.amountValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.ethaddressVal == 'undefined' || this.state.ethaddressVal) {
      notValidClasses.ethaddressCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.ethaddressCls = 'has-error col-md-8';
      notValidClasses.ethaddressValGrpCls = 'val-err-tooltip';
    }
    if (typeof this.state.sysrawtxunsignedVal == 'undefined' || this.state.sysrawtxunsignedVal) {
      notValidClasses.sysrawtxunsignedCls = 'no-error col-md-8';
    }
    else {
      notValidClasses.sysrawtxunsignedCls = 'has-error col-md-8';
      notValidClasses.sysrawtxunsignedValGrpCls = 'val-err-tooltip';
    }
    return (
      <div className="step step2">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step2Head")}</h1>
              </label>
            </div>
            <div className="row content">
              <div className="col-md-12">
                {this.props.t("step2Description")}
              </div>
            </div>
            <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Asset GUID
                </label>
                <div className={notValidClasses.assetCls}>
                  <input
                    ref="asset"
                    autoComplete="off"
                    type="number"
                    placeholder="Enter Asset GUID here if applicable..."
                    className="form-control"
                    defaultValue={this.state.asset}
                     />
                  <div className={notValidClasses.assetValGrpCls}>{this.state.assetValMsg}</div>
                </div>
              </div>
              <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Amount
                </label>
                <div className={notValidClasses.amountCls}>
                  <input
                    ref="amount"
                    autoComplete="off"
                    type="number"
                    placeholder="Amount to transfer..."
                    className="form-control"
                    required
                    defaultValue={this.state.amount}
                     />
                  <div className={notValidClasses.amountValGrpCls}>{this.state.amountValMsg}</div>
                </div>
              </div>
              <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Ethereum Address
                </label>
                <div className={notValidClasses.ethaddressCls}>
                  <input
                    ref="ethaddress"
                    autoComplete="off"
                    type="text"
                    placeholder="Ethereum address of recipient..."
                    className="form-control"
                    required
                    defaultValue={this.state.ethaddress}
                     />
                  <div className={notValidClasses.ethaddressValGrpCls}>{this.state.ethaddressValMsg}</div>
                </div>
              </div>
              <button type="button" class="btn btn-default">
                <span class="glyphicon glyphicon-send"></span>
              </button>
              <div className="form-group col-md-12 content form-block-holder">
                <label className="control-label col-md-4">
                  Raw Transaction
                </label>
                <div className={notValidClasses.sysrawtxunsignedCls}>
                  <input
                    ref="sysrawtxunsigned"
                    autoComplete="off"
                    type="text"
                    placeholder="Syscoin raw unsigned transaction..."
                    className="form-control"
                    required
                    defaultValue={this.state.sysrawtxunsigned}
                     />
                  <div className={notValidClasses.sysrawtxunsignedValGrpCls}>{this.state.sysrawtxunsignedValMsg}</div>
                </div>
              </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step2;
