
import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import web3 from '../web3';
import sbconfig from '../SyscoinSuperblocksI';
import CONFIGURATION from '../config';
const axios = require('axios');
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.searchSuperblock = this.searchSuperblock.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.sbContract = sbconfig.contract;
    this.faucetURL = "https://faucet";
    if(CONFIGURATION.testnet){
      this.faucetURL += "-testnet";
    }
    this.faucetURL += ".syscoin.org";
    
    this.sbURL = "https://";
    if(CONFIGURATION.testnet){
      this.sbURL += "rinkeby.";
    }
    this.sbURL += "etherscan.io/address/" + this.sbContract + "#events";
    
    this.state = {
      superblockApproved: false,
      superblockLastBlockHash: "",
      superblockLastBlockTime: 0,
      superblockMerkleRoot: "",
      superblockParentId: "",
      superblockLastBlockBits: 0,
      superblockHeight: 0,
      superblockId: "",
      searchError: ""
    };
  }
  handleNextClick() {
    console.log("next");
    console.log( this.state.superblockHeight+1);
    axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + (this.state.superblockHeight+1))
    .then(response => {
      console.log(response);
      if(response.data.error){
     
      }
      else{
        this.setState({superblockApproved: response.data.approved,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockLastBlockBits: response.data.lastSyscoinBlockBits,
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
    axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + (this.state.superblockHeight-1))
    .then(response => {
      console.log(response);
      if(response.data.error){
       
      }
      else{
        this.setState({superblockApproved: response.data.approved,
          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
          superblockLastBlockBits: response.data.lastSyscoinBlockBits,
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
    axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?hash=' + userInput)
      .then(response => {
        console.log(response);
        if(response.data.error){
          axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?height=' + userInput)
            .then(response => {
              console.log(response);
              if(response.data.error){
                axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblockbysyscoinblock?hash=' + userInput)
                .then(response => {
                  console.log(response);
                  if(response.data.error){
                    axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblockbysyscoinblock?height=' + userInput)
                    .then(response => {
                      console.log(response);
                      if(response.data.error){
                        this.setState({searchError: response.data.error});
                      }
                      else{
                        this.setState({superblockApproved: response.data.approved,
                          superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                          superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                          superblockLastBlockBits: response.data.lastSyscoinBlockBits,
                          superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                        });
                      }
                    })
                    .catch(error => {
                      this.setState({searchError: error.response});
                    });
                  }
                  else{
                    this.setState({superblockApproved: response.data.approved, 
                      superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                      superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                      superblockLastBlockBits: response.data.lastSyscoinBlockBits,
                      superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                    });
                  }
                })
                .catch(error => {
                  this.setState({searchError: error.response});
                });
              }
              else{
                this.setState({superblockApproved: response.data.approved, 
                  superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
                  superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
                  superblockLastBlockBits: response.data.lastSyscoinBlockBits,
                  superblockHeight: response.data.superblockHeight, superblockId:  response.data.superblockId
                });
              }
            })
            .catch(error => {
              this.setState({searchError: error.response});
            });
        }
        else{
          this.setState({superblockApproved: response.data.approved, 
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockLastBlockBits: response.data.lastSyscoinBlockBits,
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
      axios.get('https://' + CONFIGURATION.agentURL + ':' + CONFIGURATION.agentPort + '/superblock?hash=' + currentSuperBlockHash)
      .then(response => {
        if(response.data.error){
          this.setState({searchError: response.error});
        }
        else{
          this.setState({superblockApproved: response.data.approved,
            superblockLastBlockHash: response.data.lastSyscoinBlockHash, superblockLastBlockTime: response.data.lastSyscoinBlockTime,
            superblockMerkleRoot: response.data.merkleRoot, superblockParentId: response.data.parentId,
            superblockLastBlockBits: response.data.lastSyscoinBlockBits,
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
              <label className="col-md-12">
                <h1>{this.props.t("step1Head")}</h1>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step1Description")}}></div> <a href="https://github.com/syscoin/sysethereum-contracts" className="vivid" target="_blank" rel="noopener noreferrer">{this.props.t("repoUrl")}</a></h3>
                <h3><div dangerouslySetInnerHTML={{__html: this.props.t("step1Faucet")}}></div> <a href={this.faucetURL} className="vivid" target="_blank" rel="noopener noreferrer">{this.faucetURL}</a></h3>
              </label>
  

              <div className="row mb30">
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
                        <button className="btn btn-default formbtnmini" type="button" onClick={this.searchSuperblock}><i className="glyphicon glyphicon-search"></i></button>
                      </div>
                    </div>
                    <div className="superblocksearcherror">{this.state.searchError}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">

                  <Tabs>
                    <TabList>
                      <Tab>{this.props.t("tabGeneral")}</Tab>
                      <Tab>{this.props.t("tabAdvanced")}</Tab>
                    </TabList>
                    <TabPanel>
                      <code className="block">
                          <span className="dataname">{this.props.t("step1SuperblockId")}:</span> <span className="result">{this.state.superblockId}</span><br />
                          <span className="dataname">{this.props.t("step1SuperblockHeight")}:</span> <span className="result">{this.state.superblockHeight}</span><br />
                          <span className="dataname">{this.props.t("step1LastBlockTime")}:</span> <span className="result">{this.state.superblockLastBlockTime}</span><br />
                          <span className="dataname">{this.props.t("step1SuperblockApproved")}:</span> <span className="result">{this.state.superblockApproved.toString()}</span><br />
                          <span className="dataname">{this.props.t("step1SuperblockAddress")}:</span><span className="result"><a href={this.sbURL} target="_blank" rel="noopener noreferrer">{this.sbContract}</a></span><br />
                      </code>
                    </TabPanel>
                    <TabPanel>
                      <code className="block">
                      <span className="dataname">{this.props.t("step1LastBlockHash")}:</span> <span className="result">{this.state.superblockLastBlockHash}</span><br />
                      <span className="dataname">{this.props.t("step1MerkleRoot")}:</span> <span className="result">{this.state.superblockMerkleRoot}</span><br />
                      <span className="dataname">{this.props.t("step1LastBlockBits")}:</span> <span className="result">{this.state.superblockLastBlockBits}</span><br />
                      <span className="dataname">{this.props.t("step1SuperblockParentId")}:</span> <span className="result">{this.state.superblockParentId}</span><br />
                      </code>
                    </TabPanel>
                  </Tabs>

                </div>
              </div>
              <div className="row">
                
                <div className="col-md-4 col-sm-12 col-centered text-center">
                  <div className="superblockpagecontainer">
                    <div className="superblockpageicon" onClick={this.handlePrevClick}><MaterialIcon icon="arrow_left" color="#ffffff" size='large' /></div><div className="superblockpage">{this.state.superblockHeight}</div><div className="superblockpageicon" onClick={this.handleNextClick}><MaterialIcon icon="arrow_right" color="#ffffff" size='large' /></div>
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
