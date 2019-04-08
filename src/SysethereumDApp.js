import React, { Component } from 'react';
import './SysethereumDApp.css';
import SysToEthWizardi18n from './wizard/SysToEthWizard';
import EthToSysWizardi18n from './wizard/EthToSysWizard';
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
class SysethereumDApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      introDisplay: true,
      ethToSysDisplay: false,
      sysToEthDisplay: false,
  
    };
      
    this.onSysToEth = this.onSysToEth.bind(this);
    this.onEthToSys = this.onEthToSys.bind(this);
  }


  async componentDidMount() {
  }
  onSysToEth() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  sysToEthDisplay: true});
  }
  onEthToSys() {
    this.setState({ introDisplay: false, ethToSysDisplay: true,  introDisplay: false});
  }
  render() { 
    return (
      <div>
      <div  className={(this.state.introDisplay  ? "visible" : "hidden")}>
      <div className="step">
      <div className="row">
        <form id="Form" className="form-horizontal">
          <div className="form-group">
          
          <div className="row">
            <div className="col-md-12">
              <label className="control-label col-md-4">
              </label>  
              <div>
                  <button type="button" className="form-control btn btn-default" onClick={this.onSysToEth}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true">&nbsp;</span>
                  Syscoin To Ethereum
                  </button>
              </div>
              <div>
                  <button type="button" className="form-control btn btn-default" onClick={this.onEthToSys}>
                  <span className="glyphicon glyphicon-search" aria-hidden="true">&nbsp;</span>
                  Ethereum To Syscoin
                  </button>
              </div>
            </div>
          </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    <div className={(this.state.ethToSysDisplay  ? "visible" : "hidden")}>
      <I18nextProvider i18n={i18n}>
        <EthToSysWizardi18n />
      </I18nextProvider>
    </div>
    <div  className={(this.state.sysToEthDisplay  ? "visible" : "hidden")}>
      <I18nextProvider i18n={i18n}>
        <SysToEthWizardi18n />
      </I18nextProvider>
    </div>
    </div>
    );
  }
}

export default SysethereumDApp;
