
import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import web3 from '../web3';
import sbconfig from '../SyscoinSuperblocks';
import CONFIGURATION from '../config';
const axios = require('axios');
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.searchSuperblock = this.searchSuperblock.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.sbContract = sbconfig.contract;
    this.sbURL = "https://";
    if(CONFIGURATION.testnet){
      this.sbURL += "rinkeby.";
    }
    this.sbURL += "etherscan.io/address/" + this.sbContract + "#events";
    
    this.state = {
      superblockApproved: false,
      superblockBlockHeight: 0,
      superblockLastBlockHash: "",
      superblockLastBlockTime: 0,
      superblockMerkleRoot: "",
      superblockParentId: "",
      superblockPreviousBlockBits: 0,
      superblockPreviousBlockTime: 0,
      superblockHeight: 0,
      superblockId: "",
      searchError: ""
    };
  }
  handleNextClick() {
    console.log("next");
    console.log( this.state.superblockHeight+1);
    axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + (this.state.superblockHeight+1))
    .then(response => {
      console.log(response);
      if(response.data.error){
     
      }
      else{
        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
        });
      }
    })
    .catch(error => {
  
    });
  }
  handlePrevClick() {
    console.log("prev");
    console.log( this.state.superblockHeight-1);
    axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + (this.state.superblockHeight-1))
    .then(response => {
      console.log(response);
      if(response.data.error){
       
      }
      else{
        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
        });
      }
    })
    .catch(error => {
     
    });
  }
  searchSuperblock() {
    this.setState({searchError: ""});
    const userInput = this.refs.searchText.value;
    if(!userInput || userInput === "")
      return;
    axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?hash=' + userInput)
      .then(response => {
        console.log(response);
        if(response.data.error){
          axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + userInput)
            .then(response => {
              console.log(response);
              if(response.data.error){
                axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblockbysyscoinblock?hash=' + userInput)
                .then(response => {
                  console.log(response);
                  if(response.data.error){
                    axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblockbysyscoinblock?height=' + userInput)
                    .then(response => {
                      console.log(response);
                      if(response.data.error){
                        this.setState({searchError: response.data.error});
                      }
                      else{
                        this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                          superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                        });
                      }
                    })
                    .catch(error => {
                      this.setState({searchError: error.response});
                    });
                  }
                  else{
                    this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                      superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                      superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                      superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                      superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                    });
                  }
                })
                .catch(error => {
                  this.setState({searchError: error.response});
                });
              }
              else{
                this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
                  superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                  superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                  superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
                  superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                });
              }
            })
            .catch(error => {
              this.setState({searchError: error.response});
            });
        }
        else{
          this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
            superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
          });
        }
      })
      .catch(error => {
        this.setState({searchError: error.response});
      });
  }
    async componentDidMount() {
      let SyscoinSuperblocks = new web3.eth.Contract(sbconfig.data, sbconfig.contract); 
      if(!SyscoinSuperblocks || !SyscoinSuperblocks.methods || !SyscoinSuperblocks.methods.getBestSuperblock){
        this.setState({searchError: this.props.t("stepSuperblock")});
        return;  
      }
      const currentSuperBlockHash = await SyscoinSuperblocks.methods.getBestSuperblock().call();
      axios.get('http://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?hash=' + currentSuperBlockHash)
      .then(response => {
        if(response.data.error){
          this.setState({searchError: response.error});
        }
        else{
          this.setState({superblockApproved: response.data.approved, superblockBlockHeight: response.data.blockHeight,
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockPreviousBlockBits: response.data.previousSyscoinBlockBits,superblockPreviousBlockTime: response.data.previousSyscoinBlockTime,
            superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
          });
        }
      })
      .catch(error => {
        this.setState({searchError: error.response});
      });
  }

  componentWillUnmount() {}

  // not required as this component has no forms or user entry
  // isValidated() {}

  render() {
    return (
      <div className="step step1">
        <div className="row">
          <form id="Form" className="form-horizontal">
            <div className="form-group">
              <label className="col-md-12 control-label">
                <h1>{this.props.t("step1Head")}</h1>
                <h3>{this.props.t("step1Description")} <a href="https://github.com/syscoin/sysethereum-contracts" target="_blank" rel="noopener noreferrer">{this.props.t("repoUrl")}</a></h3>
              </label>
  

              <div className="row">
                <div className="col-md-8 col-md-offset-2">
                  <div className="navbar-form" role="search">
                    <div className="input-group add-on">
                      <input
                          ref="searchText"
                          autoComplete="off"
                          type="text"
                          placeholder={this.props.t("step1SearchBox")}
                          className="form-control"/>
                      <div className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.searchSuperblock}><i className="glyphicon glyphicon-search"></i></button>
                      </div>
                    </div>
                    <div className="superblocksearcherror">{this.state.searchError}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step1SuperblockId")}: {this.state.superblockId}<br />
                        {this.props.t("step1SuperblockBlockHeight")}: {this.state.superblockBlockHeight}<br />
                        {this.props.t("step1SuperblockHeight")}: {this.state.superblockHeight}<br />
                        {this.props.t("step1LastBlockTime")}: {this.state.superblockLastBlockTime}<br />
                        {this.props.t("step1SuperblockApproved")}: {this.state.superblockApproved.toString()}<br />
                        {this.props.t("step1SuperblockAddress")}: <a href={this.sbURL} target="_blank" rel="noopener noreferrer">{this.sbContract}</a><br />
                    </code>
                  </div>
                  <div className="col-md-6">
                    <code>
                        {this.props.t("step1LastBlockHash")}: {this.state.superblockLastBlockHash}<br />
                        {this.props.t("step1MerkleRoot")}: {this.state.superblockMerkleRoot}<br />
                        {this.props.t("step1PreviousBlockTime")}: {this.state.superblockPreviousBlockTime}<br />
                        {this.props.t("step1PreviousBlockBits")}: {this.state.superblockPreviousBlockBits}<br />
                        {this.props.t("step1SuperblockParentId")}: {this.state.superblockParentId}<br />
                    </code>
                  </div>
                </div>
                
                <div className="col-8 col-md-offset-5 col-sm-offset-5 col-lg-offset-5">
                  <div className="superblockpagecontainer">
                    <div className="superblockpageicon" onClick={this.handlePrevClick}><MaterialIcon icon="arrow_left" size='large' /></div><div className="superblockpage">{this.state.superblockHeight}</div><div className="superblockpageicon" onClick={this.handleNextClick}><MaterialIcon icon="arrow_right" size='large' /></div>
                </div>
               </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Step1;
