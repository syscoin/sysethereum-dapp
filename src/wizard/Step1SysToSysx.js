import React, { Component } from "react";
import CONFIGURATION from "../config";
import { getSysToSysxTx } from "./utils";
const satoshibitcoin = require("satoshi-bitcoin");
const sjs = require("syscoinjs-lib");

class Step1SX extends Component {
  constructor(props) {
    super(props);
    let storageExists = typeof Storage !== "undefined";
    this.state = {
      amount:
        (storageExists && localStorage.getItem("amount")) ||
        props.getStore().amount,
      txidburn:
        (storageExists && localStorage.getItem("txidburn")) ||
        props.getStore().txidburn,
      working: false,
      storedAccount: localStorage.getItem("connectedAccount"),
      controller: localStorage.getItem("controller")
        ? localStorage.getItem("controller")
        : window.ConnectionsController,
    };

    this._validateOnDemand = true; // this flag enables onBlur validation as user fills forms
    this.getTx = this.getTx.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.isValidated = this.isValidated.bind(this);
    this.syscoinjs = new sjs.SyscoinJSLib(
      null,
      CONFIGURATION.BlockbookAPIURL,
      CONFIGURATION.SysNetwork
    );
    this.FaucetURL = CONFIGURATION.FaucetURL;
  }

  async componentDidMount() {
    const account =
      (await this.state.controller.getConnectedAccount()) ||
      localStorage.getItem("connectedAccount");

    if (this.state.storedAccount !== account) {
      localStorage.setItem("connectedAccount", account);

      this.setState({
        ...this.state,
        storedAccount: account,
      });
    }
  }

  saveToLocalStorage() {
    if (typeof Storage !== "undefined") {
      // Code for localStorage/sessionStorage.
      localStorage.setItem("amount", this.refs.amount.value);
      localStorage.setItem("txidburn", this.refs.txidburn.value);
    } else {
      // Sorry! No Web Storage support..
    }
  }
  isValidated() {
    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator
    let isDataValid = false;

    // if full validation passes then save to store and pass as valid
    if (
      Object.keys(validateNewInput).every((k) => {
        return validateNewInput[k] === true;
      })
    ) {
      if (
        this.props.getStore().amount !== userInput.amount ||
        this.props.getStore().txidburn !== userInput.txidburn
      ) {
        // only update store of something changed
        this.props.updateStore({
          ...userInput,
          savedToCloud: false, // use this to notify step3 that some changes took place and prompt the user to save again
        }); // Update store here (this is just an example, in reality you will do it via redux or flux)
      }

      isDataValid = true;
    } else {
      // if anything fails then update the UI validation state but NOT the UI Data State
      this.setState(
        Object.assign(
          userInput,
          validateNewInput,
          this._validationErrors(validateNewInput)
        )
      );
    }

    return isDataValid;
  }

  async sysToSysX(amount, xpub, sysChangeAddress) {
    const feeRate = new sjs.utils.BN(10);
    const txOpts = { rbf: true };
    const assetGuid = CONFIGURATION.SYSXAsset;
    const assetChangeAddress = sysChangeAddress;
    const assetMap = new Map([
      [
        assetGuid,
        {
          changeAddress: assetChangeAddress,
          outputs: [
            {
              value: new sjs.utils.BN(satoshibitcoin.toSatoshi(amount)),
              address: sysChangeAddress,
            },
          ],
        },
      ],
    ]);
    const res = await this.syscoinjs.syscoinBurnToAssetAllocation(
      txOpts,
      assetMap,
      sysChangeAddress,
      feeRate,
      xpub
    );
    let err = null;
    if (!res) {
      err = "Could not create transaction, not enough funds?";
      return { data: null, error: err };
    }
    const serializedResp = sjs.utils.exportPsbtToJson(res.psbt, res.assets);
    const signRes = await window.ConnectionsController.signAndSend(
      serializedResp
    );
    const unserializedResp = sjs.utils.importPsbtFromJson(
      signRes,
      CONFIGURATION.SysNetwork
    );
    return {
      txidburn: unserializedResp.psbt.extractTransaction().getId(),
      error: null,
    };
  }
  async connectWallet() {
    if (!this.state.controller || !window.ConnectionsController) {
      this.setState({
        buttonVal: false,
        buttonValMsg: this.props.t("step2InstallPali"),
      });

      sessionStorage.removeItem("connectedAccount");

      return;
    }

    await this.state.controller.connectWallet();

    const account = await this.state.controller.getConnectedAccount();

    if (this.state.storedAccount !== account) {
      localStorage.setItem("connectedAccount", account);
      this.setState({
        ...this.state,
        storedAccount: account,
      });
    }

    console.log("connected account after connect wallet", account);
  }
  async getTx() {
    await getSysToSysxTx(this);
  }
  validationCheck() {
    if (!this._validateOnDemand) return;

    const userInput = this._grabUserInput(); // grab user entered vals
    const validateNewInput = this._validateData(userInput); // run the new input against the validator

    this.setState(
      Object.assign(
        userInput,
        validateNewInput,
        this._validationErrors(validateNewInput)
      )
    );
  }

  _validateData(data) {
    return {
      amountVal: true,
      txidVal: true,
    };
  }

  _validationErrors(val) {
    const errMsgs = {
      amountValMsg:
        val.amountVal && val.amountVal === true
          ? ""
          : this.props.t("step2Amount"),
      txidValMsg: val.txidVal ? "" : this.props.t("step2RawTx"),
    };
    return errMsgs;
  }

  _grabUserInput() {
    return {
      amount: this.refs.amount.value,
      txidburn: this.refs.txidburn.value,
    };
  }

  render() {
    // explicit class assigning based on validation
    let notValidClasses = {};

    if (typeof this.state.amountVal == "undefined" || this.state.amountVal) {
      notValidClasses.amountCls = "no-error";
    } else {
      notValidClasses.amountCls = "has-error";
      notValidClasses.amountValGrpCls = "val-err-tooltip";
    }
    if (typeof this.state.txidVal == "undefined" || this.state.txidVal) {
      notValidClasses.txidCls = "no-error";
    } else {
      notValidClasses.txidCls = "has-error";
      notValidClasses.txidValGrpCls = "val-err-tooltip";
    }
    if (typeof this.state.buttonVal == "undefined" || this.state.buttonVal) {
      notValidClasses.buttonCls = "no-error";
    } else if (this.state.txidVal) {
      notValidClasses.buttonCls = "has-success";
      notValidClasses.buttonValGrpCls = "val-success-tooltip active";
    } else {
      notValidClasses.buttonCls = "has-error";
      notValidClasses.buttonValGrpCls = "val-err-tooltip";
    }
    return (
      <div className="step step1sx">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step1SXHead"),
                  }}
                ></h1>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step1SXDescription"),
                  }}
                ></h3>
              </label>
              <div className="row">
                <div className="col-md-12">
                  <label className="control-label col-md-4">
                    {this.props.t("step2AmountLabel")}
                  </label>
                  <div className={notValidClasses.amountCls}>
                    <input
                      ref="amount"
                      autoComplete="off"
                      type="number"
                      placeholder={this.props.t("step2EnterAmount")}
                      className="form-control"
                      required
                      defaultValue={this.state.amount}
                    />
                    <div className={notValidClasses.amountValGrpCls}>
                      {this.state.amountValMsg}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className={notValidClasses.buttonCls}>
                    <button
                      type="button"
                      disabled={this.state.working}
                      className="form-control btn btn-default formbtn"
                      aria-label={this.props.t("step1Button")}
                      onClick={this.getTx}
                    >
                      <span
                        className="glyphicon glyphicon-send"
                        aria-hidden="true"
                      >
                        &nbsp;
                      </span>
                      {this.props.t("step1Button")}
                    </button>
                    <div className={notValidClasses.buttonValGrpCls}>
                      {localStorage.getItem("connectedAccount") ||
                      this.state.storedAccount
                        ? this.state.buttonValMsg
                        : "Connect Pali"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label className="control-label col-md-4">
                    {this.props.t("step2TxLabel")}
                  </label>
                  <div className={notValidClasses.txidCls}>
                    <input
                      ref="txidburn"
                      autoComplete="off"
                      type="text"
                      placeholder={this.props.t("step2EnterTx")}
                      className="form-control"
                      required
                      defaultValue={this.state.txidburn}
                    />
                    <div className={notValidClasses.txidValGrpCls}>
                      {this.state.txidValMsg}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Step1SX;
