import React, { Component } from 'react';
import './SysethereumDApp.css';
import bridgeAnim from './imgs/bridge_diagram.svg';
import SysToEthWizardi18n from './wizard/SysToEthWizard';
import EthToSysWizardi18n from './wizard/EthToSysWizard';
import EthToSysCancelWizardi18n from './wizard/EthToSysCancelWizard';
import SPTRegistryWizardi18n from './wizard/SPTRegistryWizard';
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
import Textarea from 'react-textarea-autosize';
import axios from 'axios';
import sbconfig from './SyscoinSuperblocksI';
import CONFIGURATION from './config';
class SysethereumDApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      introDisplay: true,
      ethToSysDisplay: false,
      sysToEthDisplay: false,  
      emailName: '',
      emailSender: '',
      emailMessage: '',
      emailSent: false
    };
      
    this.onSysToEth = this.onSysToEth.bind(this);
    this.onEthToSys = this.onEthToSys.bind(this);
    this.onEthToSysCancel = this.onEthToSysCancel.bind(this);
    this.onAssetRegistry = this.onAssetRegistry.bind(this);
    this.onHome = this.onHome.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.superblockURL = "";
    if(CONFIGURATION.testnet){
      this.superblockURL += "https://rinkeby.etherscan.io/address/"+sbconfig.contract+"#code";
    }
    else{
      this.superblockURL += "https://etherscan.io/address/"+sbconfig.contract+"#code";
    }
  }


  async componentDidMount() {
  }
  onSysToEth() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  ethToSysCancelDisplay: false, assetRegistryDisplay: false, sysToEthDisplay: true});
  }
  onEthToSys() {
    this.setState({ introDisplay: false, ethToSysDisplay: true,  ethToSysCancelDisplay: false, assetRegistryDisplay: false, sysToEthDisplay: false});
  }
  onEthToSysCancel() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  ethToSysCancelDisplay: true, assetRegistryDisplay: false, sysToEthDisplay: false});
  }
  onAssetRegistry() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  ethToSysCancelDisplay: false, assetRegistryDisplay: true, sysToEthDisplay: false});
  }
  onHome() {
    this.setState({ introDisplay: true, ethToSysDisplay: false,  ethToSysCancelDisplay: false, assetRegistryDisplay: false, sysToEthDisplay: false});
  }

  handleEmailChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleEmailSubmit(evt) {
    evt.preventDefault();
    var self = this;

    axios.post('https://syscoin.org/email_sender.php', {name:this.state.emailName, email:this.state.emailSender, msg: this.state.emailMessage})
    .then(function (response) {
      if(response.data.status === 1)
        self.setState({ emailSent: true });
    });

    
  }

  render() { 
    return (
      <div>
        <div  className={(this.state.introDisplay  ? "visible" : "hidden")}>

        <div className="intro">

            <div className="left">
              <a href="https://syscoin.org/" target="_blank" rel="noopener noreferrer" className="logo"></a>
              <h1>Syscoin - Ethereum Bridge</h1>

              <div className="bottom">

                <div className="equals">

                  <div className="slide s1">
                    <div className="line">
                      <span className="blue">1</span> SYSx <span className="grey">=</span> <span className="blue">1</span> SYS    
                    </div>

                    <div className="line small">
                      <span className="blue">Σ</span> SYSx <span className="grey">+</span> <span className="blue">Σ</span> SYS <span className="grey">=</span> Circulation 
                    </div>
                  </div>

                   <div className="slide s2">
                    <div className="line">
                      <span className="blue">1</span> ERC20 <span className="grey">=</span> <span className="blue">1</span> SPT     
                    </div>

                    <div className="line small">
                      <span className="blue">Σ</span> ERC20 <span className="grey">+</span> <span className="blue">Σ</span> SPT <span className="grey">=</span> Circulation 
                    </div>
                  </div>
                  
                              
                </div>


                <a href="#how-it-works">
                  <i className="demo-icon icon-cog"></i> How it works?
                </a>

                <a href="#faq">
                  <i className="demo-icon icon-help"></i> FAQ
                </a>

                <a href="#contact">
                  <i className="demo-icon icon-comment-alt2"></i> Contact
                </a>

                <a href="#information">
                  <i className="demo-icon icon-info"></i> More information
                </a>
              </div>
              
              
              
            </div>
        
            <div className="right">

              <div className="bridge">

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

                <a className="ethtosys" href="javascript:void(0)" onClick={this.onEthToSysCancel}>
                  <div className="mybtn mybtn-two">
                    <span>Cancel Transfer</span>
                  </div>
                </a>

                <a className="ethtosys" href="javascript:void(0)" onClick={this.onAssetRegistry}>
                  <div className="mybtn mybtn-two">
                    <span>Asset Registry</span>
                  </div>
                </a>

                <object className="animation" type="image/svg+xml" data={bridgeAnim}></object>

              </div>

              <div className="links">
                <a href="https://twitter.com/syscoin" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <i className="demo-icon icon-twitter"></i>
                </a>
                <a href="https://t.me/Syscoin_Official" target="_blank" rel="noopener noreferrer" title="Telegram">
                  <i className="demo-icon icon-icon-telegram"></i>
                </a>
                <a href="https://discord.gg/RkK2AXD" target="_blank" rel="noopener noreferrer" title="Discord">
                  <i className="demo-icon icon-discord-logo-white"></i>
                </a>
                <a href="https://www.reddit.com/r/SysCoin/" target="_blank" rel="noopener noreferrer" title="Reddit">
                  <i className="demo-icon icon-reddit-alien"></i>
                </a>
                <a href="https://github.com/syscoin" target="_blank" rel="noopener noreferrer" title="Github">
                  <i className="demo-icon icon-github-circled"></i>
                </a>
                <a href="https://syscoin.org" target="_blank" rel="noopener noreferrer" title="Syscoin.org">
                  <i className="demo-icon icon-sys"></i>
                </a>
              </div>

            </div>

        </div> 
        <div className="section">
          <div className="howitworks">
            <a className="anchor" name="how-it-works"></a>
            <div className="ornament"></div>
            <h1>How it works?</h1>

            <h2>Token portability backed by cryptographic proofs.<br /> Move tokens back and forth between the Syscoin and Ethereum blockchains.</h2>

            <p className="italic">
              An industry-first, zero counterparty bridge for moving tokens back and forth between the Syscoin and Ethereum blockchains
            </p>

            <p>
              <strong>Burn tokens on the Syscoin or Ethereum blockchain</strong><br />
              Burning tokens provably removes them from the circulating supply on one chain. The proofs that result from this will be used to mint tokens on the adjacent chain.
            </p>
            <p>
              <strong>Mint tokens on the Ethereum or Syscoin blockchain</strong><br />
              Using the proof of burn from one chain, new tokens can be minted into the adjacent chain. This results in a 1:1 representation of the tokens on the new chain and empowers them with all the capabilities of that chain.
            </p>
            

            <div className="ornament intext"></div>

            <h2>Bridge any SPT to an ERC20</h2>
            <p>Move from Syscoin Platform Token to ERC20 in 3 simple steps:</p>

      
            <ol>
              <li>
                <strong>Burn SPT</strong><br />
                Provably burn SPT on the Syscoin blockchain. <a href="javascript:void(0)" onClick={this.onSysToEth}>SYS ➜ ETH</a>
              </li>
              <li>
                <strong>Mint ERC20</strong><br />
                Use proof-of-burn from the Syscoin blockchain to mint ERC20 tokens on the Ethereum blockchain 1:1 with burned SPTs from Syscoin.
              </li>
              <li>
                <strong>Leverage Ethereum Ecosystem</strong><br />
                Use SPT ERC20 with Ethereum smart contracts and the plethora of existing wallets and services that support ERC20 tokens.
              </li>
            </ol>
     

            <div className="ornament intext"></div>

            <h2>Bridge any ERC20 to an SPT</h2>
            <p>Convert any ERC20 to a Syscoin Platform Token in 3 easy steps:</p>

           
            <ol>
              <li>
                <strong>Burn SPT ERC20</strong><br />
                Provably burn ERC20 on the Ethereum blockchain. <a href="javascript:void(0)" onClick={this.onEthToSys}>ETH ➜ SYS</a>
              </li>
              <li>
                <strong>Mint SPT</strong><br />
                Use proof-of-burn from the Ethereum blockchain to mint SPT tokens on the Syscoin blockchain 1:1 with burned SPT ERC20s from Ethereum.
              </li>
              <li>
                <strong>Leverage Syscoin Ecosystem</strong><br />
                Use SPT on Syscoin for fast, scalable transactions and low transaction costs.
              </li>
            </ol>
           

            <div className="ornament intext"></div>

            <h2>The Superblock Contract</h2>

            <p className="italic">
              Linking blockchains through smart contracts
            </p>

            <p>
              A key concept of the Syscoin Ethereum bridge is called the Superblock Contract. This contract anchors block header data from the Syscoin chain onto the Ethereum blockchain creating a sidechain. The data within this sidechain is used to facilitate the minting of new SPT ERC20 tokens.
            </p>

            <p>
            This sidechain is secured by Agents. This security layer incentivizes users with an opportunity to earn rewards and fees in both ETH and SYS for helping to secure the bridge.
            </p>

            <p>
              <a href={this.superblockURL} target="_blank" rel="noopener noreferrer">Check out the Superblock contract on Rinkeby testnet</a>
            </p>

            <div className="ornament intext"></div>

            <h2>Bridge Agents</h2>

            <p>
            Agents help to secure the Superblock contract while earning rewards and fees. It costs 3 ETH to run an Agent. Agents serve two primary roles- submitting block data to Ethereum and challenging bad submissions.
            </p>

            <p>
              <strong>Earn SYS for submitting Syscoin Superblock data to Ethereum</strong>
            </p>

            <p>
            Agents are responsible for collecting block header data from the Syscoin blockchain and grouping it into 'superblocks'. Each superblock contains 1 hour of Syscoin block headers. This approach reduces GAS costs for anchoring the block data on the Ethereum blockchain.
            </p>

            <p>
            Agents earn a SYS fee for all bridge transactions contained within the superblock they are submitting once it is accepted by the Superblock contract.
            </p>

            <p>
              <strong>Earn ETH by Challenging Agents submitting bad data</strong>
            </p>

            <p>
            Agents secure the Superblock contract by watching for superblock submissions by other Agents and challenging them if the data they are submitting does not match their own. This challenge results in a game, the loser of which loses their 3 ETH bond.
            </p>

            <p>
              <a href="https://github.com/syscoin/sysethereum-contracts" target="_blank" rel="noopener noreferrer">View Contract code</a><br />
              <a href="https://github.com/syscoin/sysethereum-dapp" target="_blank" rel="noopener noreferrer">View DApp code</a><br />
              <a href="https://github.com/syscoin/sysethereum-agents" target="_blank" rel="noopener noreferrer">View Agent code</a>
            </p>

          </div>
        </div>

        <div className="section dark">
          <div className="faq">
            <a className="anchor" name="faq"></a>
            <div className="ornament none"></div>
            <h1>FAQ</h1>

            <p className="question">
            What is an SPT?
            </p>
            <p>
            Syscoin Platform Tokens (SPT) are cryptocurrency tokens that can be created quickly and easily on Syscoin Platform by anyone. This can be done using Spark wallet (GUI) or Syscoin QT using command-line. Token creation fee is 500 SYS at present.
            </p>
            
            <p className="question">
            What is SYSX?
            </p>
            <p>
            SYSX is both an SPT and Ethereum ERC20 token, backed by SYS at 1:1 ratio. You can burn your SYS and mint SYSX on the Syscoin chain, allowing you to utilize high throughput ZDAG transactions. You can then burn your SYSX (SPT) and mint a SYSX (ERC20) token, allowing you to utilize all the functionalities of the Ethereum Chain, such as Smart Contracts. This mint/burn process can also be done in reverse order; it works in both directions. 
          </p>

          <p className="question">
          How does the SYSX bridge work?
            </p>
          <p>
          The basic structure of how SYS bridge works is SYS &lt;-&gt; SYSX (SPT) &lt;-&gt; SYSX (ERC20).
          </p>
          <p>
          You will need to burn your SYS for SYSX (SPT). You can then move your SYSX (SPT) across the bridge, which will then be minted as a SYSX (ERC20).
          </p>
          <p>
          The total supply of SYS + SYSX (SPT) + SYSX (ERC20) = Total Circulating Supply.
          </p>

          <p className="question">
          Does the EVM run on Ethereum?
            </p>
          <p>
          Yes, the EVM will run on Ethereum. EVM stands for Ethereum Virtual Machine.
          </p>

          <p className="question">
          Will SPTs be transferable to Ethereum?
            </p>
          <p>
          Any Syscoin SPT can be transferred to Ethereum as an ERC20, and back, as needed, given the necessary Bridge smart contracts are in place on both the Syscoin and Ethereum blockchains pertaining to that particular SPT/ERC20.  These contracts are already in place for SYSX, and they can serve as a template for bridging other SPTs. You can reference them here: <a target="_blank" rel="noopener noreferrer" href="https://github.com/syscoin/sysethereum-contracts">https://github.com/syscoin/sysethereum-contracts</a>
          </p>

          <p className="question">
          Will this mean I can use Ledger, Myetherwallet, Metamask etc?
          </p>
          <p>
          Your SPT will become compatible with all the major service providers of Ethereum once moved across the bridge to become an ERC20 token.
          </p>

          <p className="question">
          Syscoin supply will remain the same?
          </p>
          <p>
          Yes. SYS + SYSX (SPT) + SYSX (ERC20) = Total Circulating Supply.  This supply is maintained via mint/burn as tokens move across the bridge in either direction.
          </p>

          <p className="question">
          What counterparty or custodian related risks and/or limitations do I incur when using Syscoin Bridge?
          </p>
          <p>
          None. You maintain full possession and control of your funds at all times. Furthermore, market demand (such as with atomic swap) is not required to take advantage of Syscoin Bridge. These benefits are made possible by first-class integration with Ethereum, utilizing dual smart contracts and SPV proofs on both sides.
          </p>

          <p className="question">
          Are balances and coins tracked when moving across the bridge?
          </p>
          <p>
          No. This is a zero-knowledge mechanism. They are pooled, and fungible one from another.
          </p>

          <p className="question">
          Can I have SYSX in my QT/Spark wallet?
          </p>
          <p>
          SYSX is an SPT and an ERC20 token, thus it will depend on which chain your tokens are on. If they are on Ethereum, you will need to use the Ethereum supported wallets. If they are on Syscoin, you can use Spark. Syscoin QT can also be used if you are competent with command line interface.
          </p>

          <p className="question">
          Do I need Ether to execute the smart contract, and if so how much?
          </p>
          <p>
          You will need Ether to cover the costs of executing Ethereum smart contracts. These costs will vary depending on the Ethereum network.
          </p>

          <p className="question">
          Do I need SYS to execute SPT transactions, and if so how much?
          </p>
          <p>
          SYS is required to execute any transaction within the Syscoin network, including SPT transfers.  Exact transaction costs depend on network conditions. Syscoin transaction fees are relatively inexpensive, especially in the case of SPTs which utilize Syscoin’s ZDAG protocol. Typically, thousands of SPT transfers can be funded with a single SYS, due to the unique fee market of the ZDAG network within which users usually do not require having PoW confirmation within an immediate block.
          </p>

          <p className="question">
          Are there any specific use cases for smart contracts with Syscoin?
          </p>
          <p>
          As discussed in the blogpost on the evolution of Syscoin, there are multiple ways Syscoin can leverage smart contracts. Being a two-way bridge, smart contracts on Ethereum will be able to leverage advantages unique to Syscoin such as ZDAG speed, throughput, security, and low fees. Users on Syscoin also benefit from the security of merged-mining with the Bitcoin network, and Syscoin’s compliance with Bitcoin Core. A network resilient against 51% attacks, and a proven core, are of utmost importance when choosing a base layer blockchain to store your assets.
          </p>

          <p className="question">
          Will SYSX be as fast on Ethereum, or will it be bound to Ethereum’s speed?
          </p>
          <p>
          Since SYSX ERC20 tokens reside within the EVM, transactions will bear the performance characteristics of the Ethereum network. On the other hand, SYSX (SPT), and other SPTs on the Syscoin chain, do utilize and benefit from ZDAG speed, throughput, security and low fees. 
          </p>

          <p className="question">
          Why have an SPT on Syscoin if I can have an ERC20 token?
          </p>
          <p>
          Because this delivers multiple advantages. SPTs are ZDAG enabled, which means they benefit from high-speed and high-throughput token transfers with low fees. ZDAG’s probabilistic security (offering global consensus in ten seconds or less) enables you to determine the security/speed trade-off most ideal for your particular use case. Further, each SPT transaction settles onchain with Bitcoin compliant proof of work. All of this is especially attractive for point of sale applications. You can learn more about Syscoin ZDAG here: <a href="https://syscoin.org/z-dag" target="_blank" rel="noopener noreferrer">https://syscoin.org/z-dag</a>
          </p>

          <p className="question">
          Can other ERC20 tokens be migrated to the Syscoin chain for fast transfers and Point-of-Sale applications?
          </p>
          <p>
          Yes ERC20 tokens will be able to leverage ZDAG’s advantages by burning and minting via the bridge, resulting in an SPT.  This is currently active for SYSX.  A reference implementation of the smart contracts necessary to enable your particular ERC20 with Syscoin Bridge is available here: <a href="https://github.com/syscoin/sysethereum-contracts" target="_blank" rel="noopener noreferrer">https://github.com/syscoin/sysethereum-contracts</a>
          </p>

          <p className="question">
          How is this initiative different from others?
          </p>
          <p>
          Syscoin Bridge is the first two-way interoperability solution without counterparties, a permissionless and trustless solution that leverages the security of each respective blockchain. This allows us to consider the SPT supply mechanism as a fractional supply across multiple blockchains. Users on Syscoin by extension will be able to leverage the vast toolset and network effect of Ethereum whilst Ethereum users can leverage Syscoin’s cost effective and efficient asset specific transactionality. You can read more about the technicals here: <a href="https://github.com/syscoin/sysethereum-docs" target="_blank" rel="noopener noreferrer">https://github.com/syscoin/sysethereum-docs</a>
          </p>






          </div>
        </div>


        <div className="section contact">
          <div className="contact">
            <a className="anchor" name="contact"></a>
            <div className="ornament"></div>
            <h1>Contact</h1>

            <form onSubmit={this.handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="emailaddr">Email address</label>
                <input type="email" className="form-control" id="emailaddr" required onChange={this.handleEmailChange} name="emailSender" />
              </div>

              <div className="form-group">
                <label htmlFor="yourname">Your name</label>
                <input type="text" className="form-control" id="yourname" required onChange={this.handleEmailChange} name="emailName" />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Textarea className="form-control" id="message" minRows={1} required onChange={this.handleEmailChange} name="emailMessage" />
              </div>
            
              <button type="submit" className="btn btn-default" disabled={this.state.emailSent}>Send</button>

              <div className={(this.state.emailSent  ? "visible" : "hidden")}>
                <p className="bg-success">Thank you for reaching out to us, we will get back to you as soon as possible.</p>
              </div>
  
            </form>
          </div>
        </div>


        <div className="section dark moreinfo">
          <div className="moreinfo">
            <a className="anchor" name="information"></a>
            <div className="ornament none"></div>
            <h1>More information</h1>

            <div className="links">
              <a href="https://syscoin.org" target="_blank" rel="noopener noreferrer">Syscoin.org</a>
              <a href="https://faucet.syscoin.org" target="_blank" rel="noopener noreferrer">Syscoin faucet</a>
              <a href="https://syscoin.network/syslinks/" target="_blank" rel="noopener noreferrer">Syscoin links</a>
              <a href="https://syscoin.readme.io/" target="_blank" rel="noopener noreferrer">Developer Portal</a>
              <a href="https://txp.syscoin.org/" target="_blank" rel="noopener noreferrer">Syscoin explorer</a>
              <a href="https://syscoin.org/whitepaper" target="_blank" rel="noopener noreferrer">Syscoin Whitepapers</a>
              <a href="https://github.com/syscoin" target="_blank" rel="noopener noreferrer">Syscoin Github</a>
            </div>

            <div className="linksSocial">
                <a href="https://twitter.com/syscoin" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <i className="demo-icon icon-twitter"></i>
                </a>
                <a href="https://t.me/Syscoin_Official" target="_blank" rel="noopener noreferrer" title="Telegram">
                  <i className="demo-icon icon-icon-telegram"></i>
                </a>
                <a href="https://discord.gg/RkK2AXD" target="_blank" rel="noopener noreferrer" title="Discord">
                  <i className="demo-icon icon-discord-logo-white"></i>
                </a>
                <a href="https://www.reddit.com/r/SysCoin/" target="_blank" rel="noopener noreferrer" title="Reddit">
                  <i className="demo-icon icon-reddit-alien"></i>
                </a>
                <a href="https://github.com/syscoin" target="_blank" rel="noopener noreferrer" title="Github">
                  <i className="demo-icon icon-github-circled"></i>
                </a>
                <a href="https://syscoin.org" target="_blank" rel="noopener noreferrer" title="Syscoin.org">
                  <i className="demo-icon icon-sys"></i>
                </a>
            </div>

            <div className="general">© 2019 Syscoin. All rights reserved</div>

          </div>
        </div>


        
      </div>

    <div className={(this.state.ethToSysDisplay  ? "visible" : "hidden")}>

      <div id="menu"> 
        <div className="goHome" onClick={this.onHome}></div>
        <div className="title">Walk over the Syscoin Bridge</div>
      </div>
    
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
    <div className={(this.state.ethToSysCancelDisplay  ? "visible" : "hidden")}>
    <div id="menu"> 
      <div className="goHome" onClick={this.onHome}></div>
      <div className="title">Walk over the Syscoin Bridge</div>
    </div>

    <div className="wizardTitleCont">
      <div className="wizardTitle">
        <span className="ethl">ETH</span>
        <span className="direction">➜</span>
        <span className="sysr">SYS</span>
        
      </div> 
    </div>



    <I18nextProvider i18n={i18n}>
      <EthToSysCancelWizardi18n />
    </I18nextProvider>

    <button type="button" className="close closeButton wizardCancel" aria-label="Close" onClick={this.onHome}>
    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Close
    </button>


    </div>
    <div  className={(this.state.sysToEthDisplay  ? "visible" : "hidden")}>

      <div id="menu"> 
        <div className="goHome" onClick={this.onHome}></div>
        <div className="title">Walk over the Syscoin Bridge</div>
      </div>
      

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
    <div className={(this.state.assetRegistryDisplay  ? "visible" : "hidden")}>
    <div id="menu"> 
      <div className="goHome" onClick={this.onHome}></div>
      <div className="title">Walk over the Syscoin Bridge</div>
    </div>

    <div className="wizardTitleCont">
      <div className="wizardTitle">
        <span className="sysl">SYS</span>
        <span className="direction">➜</span>
        <span className="ethr">ETH</span>
        
      </div> 
    </div>



    <I18nextProvider i18n={i18n}>
      <SPTRegistryWizardi18n />
    </I18nextProvider>

    <button type="button" className="close closeButton wizardCancel" aria-label="Close" onClick={this.onHome}>
    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Close
    </button>


    </div>
    </div>
    );
  }
}

export default SysethereumDApp;
