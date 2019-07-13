import React, { Component } from 'react';
import './SysethereumDApp.css';
import bridgeAnim from './imgs/bridge_diagram.svg';
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
      <div className="mycol intro">
      
          <div className="mycontainer">

            <h1>Official Syscoin Ethereum Bridge</h1>
            
            <a className="systoeth" href="javascript:void(0)" onClick={this.onSysToEth}>
              <div className="mybtn mybtn-two">
              <span>SYS ➜ ETH</span>
              </div>
            </a>

            <a className="ethtosys" href="javascript:void(0)" onClick={this.onEthToSys}>
            <div className="mybtn mybtn-two">
              <span>ETH ➜ SYS</span>
            </div>
            </a>

            <object className="animation" type="image/svg+xml" data={bridgeAnim}></object>

          </div>

          <div className="introText">
            <p>
              In Syscoin 4.0 we introduce a brand-new addition to Syscoin Platform: a unique blockchain bridging technology called Syscoin Interoptibility Bridge, which establishes a trustless and permissionless two-way transaction channel between Syscoin and other blockchains. Making a bridge work like this has been a point of focus for the blockchain industry since Satoshi spoke about SPV (Simplified Payment Verification) in the original Bitcoin whitepaper.
            </p>

            <p>This type of bridge has never been seen before and is unique in that it allows for Syscoin tokens to transfer to and exist on other blockchains; It is zero-sum meaning the total circulating supply of the asset moving over the bridge remains unchanged.</p>

          </div>


        </div> 
    </div>
    </div>
    <div className={(this.state.ethToSysDisplay  ? "visible" : "hidden")}>
    
      <div className="wizardTitleCont">
        <div className="wizardTitle">
          <span className="ethl">ETH</span>
          <span className="direction">➜</span>
          <span className="sysr">SYS</span>
          
        </div> 
      </div>
     

    
      <I18nextProvider i18n={i18n}>
        <EthToSysWizardi18n />
      </I18nextProvider>

      <button type="button" className="close closeButton wizardCancel" aria-label="Close" onClick={this.onHome}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Close
      </button>


    </div>
    <div  className={(this.state.sysToEthDisplay  ? "visible" : "hidden")}>
      

      <div className="wizardTitleCont">
        <div className="wizardTitle">
          <span className="sysl">SYS</span>
          <span className="direction">➜</span>
          <span className="ethr">ETH</span>
        </div> 
      </div>

      <I18nextProvider i18n={i18n}>
        <SysToEthWizardi18n />
      </I18nextProvider>

      <button type="button" className="close closeButton wizardCancel" aria-label="Close" onClick={this.onHome}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span> Close
      </button>


    </div>
    </div>
    );
  }
}

export default SysethereumDApp;
