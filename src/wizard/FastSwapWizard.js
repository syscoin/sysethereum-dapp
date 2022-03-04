

import React, { Component } from 'react';
import StepZilla from "react-stepzilla";
import Step1FS from './Step1FastSwap';
import { withNamespaces } from 'react-i18next';
import './css/wizard.css';
import './css/i18n.css';

class FastSwapWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.sampleStore = {
      savedToCloud: false
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getStore() {
    return this.sampleStore;
  }

  updateStore(update) {
    this.sampleStore = {
      ...this.sampleStore,
      ...update,
    }
  }

  render() {

    const { t, i18n } = this.props;

    const steps =
    [
      {name: t("step1fs"), component: <Step1FS t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />}
    ]

    return (
      <div className='EthToSysWizard'>
        <div className='step-progress'>
         
        <div className='languageButtons'>
          <div className="dropdown">
            <button className="dropbtn"><i className="glyphicon glyphicon-globe"></i><span className="selectedLang">{ i18n.language }</span></button>
            <div className="dropdown-content">
              <button onClick={() =>  i18n.changeLanguage("en")}>EN</button>
              <button onClick={() =>  i18n.changeLanguage("es")}>ES</button>
              <button onClick={() =>  i18n.changeLanguage("fr")}>FR</button>
            </div>
          </div>
        </div>

          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            startAtStep={window.sessionStorage.getItem('stepfs') ? parseFloat(window.sessionStorage.getItem('stepfs')) : 0}
           />
        </div>
      </div>
    )
  }
}

export default withNamespaces("translations")(FastSwapWizard);
