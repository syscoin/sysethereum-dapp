import React, { Component } from 'react';
import './SysethereumDApp.css';
import SysToEthWizardi18n from './wizard/SysToEthWizard';
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
class SysethereumDApp extends Component {
  state = {
  };

  async componentDidMount() {
  }

  render() {
    return (
          <I18nextProvider i18n={i18n}>
            <SysToEthWizardi18n />
          </I18nextProvider>
    );
  }
}

export default SysethereumDApp;
