
import React, { Component } from 'react';
import CONFIGURATION from '../config';
class Step6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };

  }

  componentDidMount() {
    if(!this.props.getStore().receiptObj){
      this.props.jumpToStep(4);
      return;
    }
    let baseURL = "";
    if(CONFIGURATION.testnet){
      baseURL = "https://rinkeby.etherscan.io/tx/";
    }
    else{
      baseURL = "https://etherscan.io/tx/";
    }
    this.setState({explorerLink: baseURL + this.props.getStore().receiptObj.transactionHash});
  }

  componentWillUnmount() {}

  
  
  render() {  
    return (
      <div className="step step6">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1 dangerouslySetInnerHTML={{__html: this.props.t("step6Head")}}></h1>
                <h3><div  dangerouslySetInnerHTML={{__html: this.props.t("step6Description")}}></div><a class="vivid" href={this.state.explorerLink} target="_blank" rel="noopener noreferrer">{this.state.explorerLink}</a></h3>
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step6;
