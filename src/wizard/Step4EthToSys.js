
import React, { Component } from 'react';
class Step4ES extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explorerLink: "",
    };

  }

  componentDidMount() {
    if(!this.props.getStore().mintblockhash || !this.props.getStore().minttxid){
      this.props.jumpToStep(3);
      return;
    }
    let baseURL = "";
    
    baseURL = "http://explorer.blockchainfoundry.co/tx/" + this.props.getStore().minttxid;
    
    this.setState({explorerLink: baseURL});
  }

  componentWillUnmount() {}

  
  
  render() {  
    return (
      <div className="step step4es">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step4ESHead")}</h1>
                <h3>{this.props.t("step4ESDescription")}<a href={this.state.explorerLink} target="_blank" rel="noopener noreferrer">{this.state.explorerLink}</a></h3>
              </label>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step4ES;
