

import React, { Component } from 'react';
import StepZilla from "react-stepzilla";
import Step1 from './Step1SysToEth';
import Step2 from './Step2SysToEth';
import Step3 from './Step3SysToEth';
import Step4 from './Step4SysToEth';
import { withNamespaces } from 'react-i18next';
import './css/wizard.css';
import './css/i18n.css';

import { Beforeunload } from 'react-beforeunload';

class SysToEthWizard extends Component {
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
      {name: t("step1"), component: <Step1 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step2"), component: <Step2 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step3"), component: <Step3 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
      {name: t("step4"), component: <Step4 t={t} getStore={() => (this.getStore())} updateStore={(u) => {this.updateStore(u)}} />},
   
    ]

    return (
      <div className='SysToEthWizard'>
        <Beforeunload onBeforeunload={() => "Do you want to leave this page? You'll lose your data!"} />
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
            nextTextOnFinalActionStep={t("nextTextOnFinalActionStep")}
            nextButtonText={t("nextButtonText")}
            backButtonText={t("backButtonText")}
            startAtStep={window.sessionStorage.getItem('step') ? parseFloat(window.sessionStorage.getItem('step')) : 0}
            onStepChange={(step) => window.sessionStorage.setItem('step', step)}
           />
        </div>
      </div>
    )
  }
}

export default withNamespaces("translations")(SysToEthWizard);
