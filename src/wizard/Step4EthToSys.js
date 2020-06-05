
import React, { Component } from 'react';
import CONFIGURATION from '../config';
class Step4ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };

  }
  clearLocalStorage() {
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem("sysxContract");
      localStorage.removeItem("sysxFromAccount");
      localStorage.removeItem("toSysAssetGUID");
      localStorage.removeItem("toSysAmount");
      localStorage.removeItem("syscoinWitnessAddress");
      localStorage.removeItem("receiptTxHash");
      localStorage.removeItem("mintsysrawtxunsigned");
    } else {
      // Sorry! No Web Storage support..
    }
    
  }
  componentDidMount() {
    if(!this.props.getStore().mintblockhash || !this.props.getStore().minttxid){
      this.props.jumpToStep(3);
      return;
    }

    let baseURL = "https://sys1";
    if(CONFIGURATION.testnet){
      baseURL += "-testnet"
    }
    baseURL += ".bcfn.ca/tx/" + this.props.getStore().minttxid;
    this.setState({explorerLink: baseURL});
    this.clearLocalStorage();
  }

  componentWillUnmount() {}

  
  
  render() {  
    return (
      <div className="step step4es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                
                <h1 dangerouslySetInnerHTML={{__html: this.props.t("step4ESHead")}}></h1>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step4ESDescription")}}></div><a className="vivid" href={this.state.explorerLink} target="_blank" rel="noopener noreferrer">{this.state.explorerLink}</a></h3>
                
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step4ES;
