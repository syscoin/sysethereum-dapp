import React, { Component } from "react";
import CONFIGURATION from "../config";
const satoshibitcoin = require("satoshi-bitcoin");
const sjs = require("syscoinjs-lib");
class Step1XS extends Component {
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

  componentDidMount() {}

  componentWillUnmount() {}
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

  async sysXToSys(amount, xpub, sysChangeAddress) {
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
    const assetOpts = { ethaddress: Buffer.from("") };
    const res = await this.syscoinjs.assetAllocationBurn(
      assetOpts,
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
    const signRes = await window.pali.request({
      method: "sys_signAndSend",
      params: [serializedResp],
    });
    const unserializedResp = sjs.utils.importPsbtFromJson(
      signRes,
      CONFIGURATION.SysNetwork
    );
    return {
      txidburn: unserializedResp.psbt.extractTransaction().getId(),
      error: null,
    };
  }
  async getTx() {
    if (!window.pali) {
      this.setState({
        buttonVal: false,
        buttonValMsg: this.props.t("step2InstallPali"),
      });
      return;
    }
    if (!window.pali.isBitcoinBased()) {
      await window.pali.request({
        method: "sys_changeUTXOEVM",
        params: [{ chainId: 57 }],
      });
    }
    let connectedAccount;
    try {
      connectedAccount = await window.pali.request({
        method: "wallet_getAccount",
        params: [],
      });
    } catch (e) {
      this.setState({ buttonVal: false, buttonValMsg:  (e.data ? e.data.message : undefined) || e.message || e  });
      return;
    }
    // const locked = !(await window.pali.isUnlocked());
    // if (locked) {
    //   this.setState({
    //     buttonVal: true,
    //     buttonValMsg: this.props.t("step2UnlockPali"),
    //   });
    //   return;
    // }
    if (!connectedAccount) {
      await window.pali.request({ method: "sys_requestAccounts", params: [] });
    }
    let xpub;
    try {
      xpub = await window.pali.request({
        method: "wallet_getPublicKey",
        params: [],
      });
    } catch (e) {
      this.setState({ buttonVal1: false, buttonValMsg1:  (e.data ? e.data.message : undefined) || e.message || e  });
      return;
    }
    const sysChangeAddress = await window.pali.request({
      method: "wallet_getChangeAddress",
      params: [],
    });
    if (!sysChangeAddress) {
      this.setState({
        buttonVal: false,
        buttonValMsg: this.props.t("step2SelectPaliAccount"),
      });
      return;
    }
    let userInput = this._grabUserInput(); // grab user entered vals
    let validateNewInput = this._validateData(userInput); // run the new input against the validator
    validateNewInput.buttonVal = true;
    validateNewInput.buttonValMsg = "";
    validateNewInput.txidVal = true;
    validateNewInput.txidValMsg = "";
    let valid = true;
    if (!userInput.amount || userInput.amount === "") {
      validateNewInput.amountVal = false;
      valid = false;
    }
    let self = this;

    if (valid === true) {
      this.setState({ working: true });

      try {
        let results = await this.sysXToSys(
          userInput.amount.toString(),
          xpub,
          sysChangeAddress
        );
        if (results.error) {
          validateNewInput.buttonVal = false;
          validateNewInput.buttonValMsg = results.error;
          self.setState({ working: false });
          self.setState(
            Object.assign(
              userInput,
              validateNewInput,
              this._validationErrors(validateNewInput)
            )
          );
        } else if (results.txidburn) {
          validateNewInput.buttonVal = false;
          validateNewInput.txidVal = true;
          this.refs.txidburn.value = results.txidburn;
          validateNewInput.buttonValMsg = "Success!";
          self.setState({ working: false });
          self.setState(
            Object.assign(
              userInput,
              validateNewInput,
              this._validationErrors(validateNewInput)
            )
          );
          self.saveToLocalStorage();
        }
      } catch (e) {
        validateNewInput.buttonVal = false;
        validateNewInput.txidVal = false;
        validateNewInput.buttonValMsg =
          e && e.message ? e.message : this.props.t("genericError");
        this.refs.txidburn.value = "";
        self.setState({ working: false });
        self.setState(
          Object.assign(
            userInput,
            validateNewInput,
            this._validationErrors(validateNewInput)
          )
        );
      }
    }
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
      <div className="step step1xs">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step1XSHead"),
                  }}
                ></h1>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step1XSDescription"),
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
                      {this.state.buttonValMsg}
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

export default Step1XS;
