
import React, { Component } from 'react';
import CONFIGURATION from '../config';
class Step2SX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };

  }
  clearLocalStorage() {
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem("txidburn");
      localStorage.removeItem("amount");
    } else {
      // Sorry! No Web Storage support..
    }
    
  }
  componentDidMount() {
    if(!this.props.getStore().txidburn){
      this.props.jumpToStep(0);
      return;
    }
    let baseURL = CONFIGURATION.SyscoinTxExplorerURL;
    this.setState({explorerLink: baseURL + this.props.getStore().txidburn});
    this.clearLocalStorage();
  }

  componentWillUnmount() {}

  
  
  render() {  
    return (
      <div className="step step2sx">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12">
                <h1 dangerouslySetInnerHTML={{__html: this.props.t("step2SXHead")}}></h1>
                <h3><div  dangerouslySetInnerHTML={{__html: this.props.t("step2SXDescription")}}></div><a className="vivid" href={this.state.explorerLink} target="_blank" rel="noopener noreferrer">{this.state.explorerLink}</a></h3>
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step2SX;
