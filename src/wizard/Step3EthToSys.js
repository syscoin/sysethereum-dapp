import React, { Component } from "react";
import CONFIGURATION from "../config";
class Step3ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };
  }
  clearLocalStorage() {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("sysxContract");
      localStorage.removeItem("sysxFromAccount");
      localStorage.removeItem("toSysAssetGUID");
      localStorage.removeItem("toSysAmount");
      localStorage.removeItem("syscoinWitnessAddress");
      localStorage.removeItem("receiptTxHash");
      localStorage.removeItem("minttxid");
    } else {
      // Sorry! No Web Storage support..
    }
  }
  componentDidMount() {
    if (!this.props.getStore().minttxid) {
      this.props.jumpToStep(1);
      return;
    }

    const baseURL =
      CONFIGURATION.SyscoinTxExplorerURL + this.props.getStore().minttxid;
    this.setState({ explorerLink: baseURL });
    this.clearLocalStorage();
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="step step3es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("step3ESHead"),
                  }}
                ></h1>
                <h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.t("step3ESDescription"),
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

export default Step3ES;
