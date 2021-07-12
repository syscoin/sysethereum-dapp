
import React, { Component } from 'react';
import "react-tabs/style/react-tabs.css";
import rconfig from '../SyscoinRelayI';
import CONFIGURATION from '../config';
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.rContract = rconfig.contract;
    this.faucetURL = CONFIGURATION.faucetURL
    this.rURL = CONFIGURATION.NEVMAddressExplorerURL + this.rContract;
    
    this.state = {
      searchError: ""
    };
  }
  async componentDidMount() {

  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  render() {
    return (
      <div className="step step1">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1>{this.props.t("step1Head")}</h1>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step1Description")}}></div> <a href="https://github.com/syscoin/sysethereum-contracts" className="vivid" target="_blank" rel="noopener noreferrer">{this.props.t("repoUrl")}</a></h3>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step1Faucet")}}></div> <a href={this.faucetURL} className="vivid" target="_blank" rel="noopener noreferrer">{this.faucetURL}</a></h3>
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step1;
