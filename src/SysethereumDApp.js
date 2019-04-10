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
    this.onHome = this.onHome.bind(this);
  }


  async componentDidMount() {
  }
  onSysToEth() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  sysToEthDisplay: true});
  }
  onEthToSys() {
    this.setState({ introDisplay: false, ethToSysDisplay: true,  sysToEthDisplay: false});
  }
  onHome() {
    this.setState({ introDisplay: true, ethToSysDisplay: false,  sysToEthDisplay: false});
  }
  render() { 
    return (
      <div>
      <div  className={(this.state.introDisplay  ? "visible" : "hidden")}>
      <div className="step">
      <div className="mycol">
          <div className="mycontainer">
            <a href="javascript:void(0)" onClick={this.onSysToEth}>
              <div className="mybtn mybtn-two">
              <span>SYS=>ETH</span>
              </div>
            </a>

        &nbsp;&nbsp;&nbsp;

            <a href="javascript:void(0)" onClick={this.onEthToSys}>
            <div className="mybtn mybtn-two">
              <span>ETH=>SYS</span>
            </div>
            </a>
          </div>
        </div> 
    </div>
    </div>
    <div className={(this.state.ethToSysDisplay  ? "visible" : "hidden")}>
    <button type="button" className="close closeButton" aria-label="Close" onClick={this.onHome}>
      <span aria-hidden="true">&times;</span>
    </button>
      <I18nextProvider i18n={i18n}>
        <EthToSysWizardi18n />
      </I18nextProvider>
    </div>
    <div  className={(this.state.sysToEthDisplay  ? "visible" : "hidden")}>
      <button type="button" className="close closeButton" aria-label="Close" onClick={this.onHome}>
        <span aria-hidden="true">&times;</span>
      </button>
      <I18nextProvider i18n={i18n}>
        <SysToEthWizardi18n />
      </I18nextProvider>
    </div>
    </div>
    );
  }
}

export default SysethereumDApp;
