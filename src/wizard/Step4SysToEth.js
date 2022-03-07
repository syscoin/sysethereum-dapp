import React, { Component } from "react";
import CONFIGURATION from "../config";
class Step4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };
  }
  clearLocalStorage() {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("asset");
      localStorage.removeItem("amount");
      localStorage.removeItem("ethaddress");
      localStorage.removeItem("txid");
      localStorage.removeItem("blockhash");
      localStorage.removeItem("connectedAccount");
      localStorage.removeItem("controller");
    } else {
      // Sorry! No Web Storage support..
    }
  }
  componentDidMount() {
    if (
      !this.props.getStore().receiptObj ||
      this.props.getStore().receiptStatus !== "true"
    ) {
      this.props.jumpToStep(2);
      return;
    }
    let baseURL = CONFIGURATION.NEVMTxExplorerURL;
    this.setState({
      explorerLink: baseURL + this.props.getStore().receiptObj.transactionHash,
    });
    this.clearLocalStorage();
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="step step4">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step4Head"),
                  }}
                ></h1>
                <h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.t("step4Description"),
                    }}
                  ></div>
                  <a
                    className="vivid"
                    href={this.state.explorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.state.explorerLink}
                  </a>
                </h3>
              </label>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Step4;
