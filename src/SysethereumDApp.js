import React, { Component } from "react";
import "./SysethereumDApp.css";
// import bridgeAnim from "./imgs/bridge_diagram.svg";
import SysToEthWizardi18n from "./wizard/SysToEthWizard";
import EthToSysWizardi18n from "./wizard/EthToSysWizard";
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
import Textarea from "react-textarea-autosize";
import rconfig from "./SyscoinRelayI";
import CONFIGURATION from "./config";
import axios from "axios";
class SysethereumDApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      introDisplay: true,
      ethToSysDisplay: false,
      sysToEthDisplay: false,
      emailName: "",
      emailSender: "",
      emailMessage: "",
      emailSent: false,
      isInstalled: false,
      controller: null,
    };

    this.onSysToEth = this.onSysToEth.bind(this);
    this.onEthToSys = this.onEthToSys.bind(this);
    this.onHome = this.onHome.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.relayURL = CONFIGURATION.NEVMAddressExplorerURL + rconfig.contract;
  }

  async componentDidMount() {
    const callback = (event) => {
      console.log({ event });
      if (event.detail.pali) {
        this.setState({
          ...this.state,
          isInstalled: true,
        });

        console.log("syscoin is installed");

        if (event.detail.pali) {
          console.log("componentDidMount: controller is set");
          this.setState({
            ...this.state,
            controller: window.pali,
          });

          return;
        }

        return;
      }

      window.removeEventListener("SyscoinStatus", callback);
    };


    window.addEventListener("SyscoinStatus", callback);
  }
  onSysToEth() {
    this.setState({
      introDisplay: false,
      ethToSysDisplay: false,
      sysToEthDisplay: true,
    });
  }
  onEthToSys() {
    this.setState({
      introDisplay: false,
      ethToSysDisplay: true,
      sysToEthDisplay: false,
    });
  }
  onHome() {
    this.setState({
      introDisplay: true,
      ethToSysDisplay: false,
      sysToEthDisplay: false,
    });
  }

  handleEmailChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleEmailSubmit(evt) {
    evt.preventDefault();
    var self = this;

    axios
      .post("https://syscoin.org/email_sender.php", {
        name: this.state.emailName,
        email: this.state.emailSender,
        msg: this.state.emailMessage,
      })
      .then(function (response) {
        if (response.data.status === 1) self.setState({ emailSent: true });
      });
  }

  render() {
    return (
      <div>
        <div className={this.state.introDisplay ? "visible" : "hidden"}>
          <div className="intro">
            <div className="left">
              <a
                href="https://syscoin.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="logo"
              ></a>
              <h1>Syscoin - NEVM Bridge</h1>

              <div className="bottom">
                <div className="equals">
                  <div className="slide s1">
                    <div className="line">
                      <span className="blue">1</span> SYS UTXO{" "}
                      <span className="grey">=</span>{" "}
                      <span className="blue">1</span> SYS NEVM
                    </div>

                    <div className="line small">
                      <span className="blue">Σ</span> SYS UTXO{" "}
                      <span className="grey">+</span>{" "}
                      <span className="blue">Σ</span> SYS NEVM{" "}
                      <span className="grey">=</span> Circulation
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

                <a className="systoeth" href="#" onClick={this.onSysToEth}>
                  <div className="mybtn mybtn-two">
                    <span>UTXO ➜ NEVM</span>
                  </div>
                </a>

                <a className="ethtosys" href="#" onClick={this.onEthToSys}>
                  <div className="mybtn mybtn-two">
                    <span>NEVM ➜ UTXO</span>
                  </div>
                </a>

                {/* <object
                  className="animation"
                  type="image/svg+xml"
                  data={bridgeAnim}
                ></object> */}
              </div>

              <div className="links">
                <a
                  href="https://twitter.com/syscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <i className="demo-icon icon-twitter"></i>
                </a>
                <a
                  href="https://t.me/Syscoin_Official"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                >
                  <i className="demo-icon icon-icon-telegram"></i>
                </a>
                <a
                  href="https://discord.gg/RkK2AXD"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Discord"
                >
                  <i className="demo-icon icon-discord-logo-white"></i>
                </a>
                <a
                  href="https://www.reddit.com/r/SysCoin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Reddit"
                >
                  <i className="demo-icon icon-reddit-alien"></i>
                </a>
                <a
                  href="https://github.com/syscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Github"
                >
                  <i className="demo-icon icon-github-circled"></i>
                </a>
                <a
                  href="https://syscoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Syscoin.org"
                >
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

              <h2>
                Token portability backed by cryptographic proofs.
                <br /> Move tokens back and forth between the Syscoin and NEVM
                blockchains.
              </h2>

              <p className="italic">
                An industry-first, zero counterparty bridge for moving tokens
                back and forth between the Syscoin and NEVM blockchains
              </p>

              <p>
                <strong>Burn tokens on the Syscoin or NEVM blockchain</strong>
                <br />
                Burning tokens provably removes them from the circulating supply
                on one chain. The proofs that result from this will be used to
                mint tokens on the adjacent chain.
              </p>
              <p>
                <strong>Mint tokens on the NEVM or Syscoin blockchain</strong>
                <br />
                Using the proof of burn from one chain, new tokens can be minted
                into the adjacent chain. This results in a 1:1 representation of
                the tokens on the new chain and empowers them with all the
                capabilities of that chain.
              </p>


              <div className="ornament intext"></div>

              <h2>The relay Contract</h2>

              <p className="italic">
                Linking blockchains through smart contracts
              </p>

              <p>
                A key concept of the Syscoin NEVM bridge is called the relay
                Contract. This contract takes in an SPV proof and uses a custom
                sysblockhash precompile as well as the proof data to facilitate the
                transfer of SYS tokens on NEVM.
              </p>

              <p>
                <a
                  href={this.relayURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check out the relay contract on Syscoin NEVM
                </a>
              </p>

              <div className="ornament intext"></div>

              <p>
                <a
                  href="https://github.com/syscoin/sysethereum-contracts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Contract code
                </a>
                <br />
                <a
                  href="https://github.com/syscoin/sysethereum-dapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View DApp code
                </a>
                <br />
              </p>
            </div>
          </div>

          <div className="section dark">
            <div className="faq">
              <a className="anchor" name="faq"></a>
              <div className="ornament none"></div>
              <h1>FAQ</h1>

              <p className="question">What is an Syscoin?</p>
              <p>
                Syscoin is a decentralized blockchain that offers Bitcoin
                security with a UTXO-based token platform aswell as an EVM tied
                to the main Syscoin ledger through Proof-Of-Work consensus which
                is merge-mmined with Bitcoin. You can think of it as Bitcoin and
                Ethereum combined into one system. Expressivness of the EVM
                powered by the security of Bitcoin we combine both gold
                standards into one. Our vision to scale computation is through
                zero-knowledge proofs, you can read more about our design here:{" "}
                <a
                  href="https://jsidhu.medium.com/a-design-for-an-efficient-coordinated-financial-computing-platform-ab27e8a825a0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  A Design For An Efficient Coordinated Financial Computing
                  Platform.
                </a>
              </p>
              
              <p className="question">How does the SYS bridge work?</p>
              <p>
                The basic structure of how SYS bridge works is SYS &lt;-&gt;
                SYS (UTXO) &lt;-&gt; SYS (NEVM).
              </p>
              <p>
                You will need to burn your SYS on UTXO for SYS on NEVM. You can then move
                your SYS across the bridge.
              </p>
              <p>The total supply of SYS remains the same.</p>

              <p className="question">Does the NEVM run on Ethereum?</p>
              <p>
                The NEVM will run on an Ethereum version that is integrated into
                Syscoin that leverages PoW of Bitcoin to secure its chain. NEVM
                stands for Network-enhanced Ethereum Virtual Machine.
              </p>

              <p className="question">
                Will this mean I can use Ledger, Myetherwallet, Metamask etc?
              </p>
              <p>
                Your SYS on NEVM will become compatible with all the major service
                providers using EVM once moved across the bridge.
              </p>

              <p className="question">Syscoin supply will remain the same?</p>
              <p>
                Yes. SYS (UTXO) + SYS (NEVM) = Total Circulating Supply.
                This supply is maintained via mint/burn as tokens move across
                the bridge in either direction.
              </p>

              <p className="question">
                What counterparty or custodian related risks and/or limitations
                do I incur when using Syscoin Bridge?
              </p>
              <p>
                None. You maintain full possession and control of your funds at
                all times. Furthermore, market demand (such as with atomic swap)
                is not required to take advantage of Syscoin Bridge. These
                benefits are made possible by first-class integration with the
                NEVM layer through a custom precompile (sysblockhash) and utilizing
                dual smart contracts and SPV proofs on both sides.
              </p>

              <p className="question">
                Are balances and coins tracked when moving across the bridge?
              </p>
              <p>
                No. This is a zero-knowledge mechanism. They are pooled, and
                fungible one from another.
              </p>


              <p className="question">
                Do I need gas to execute the smart contract, and if so how much?
              </p>
              <p>
                You will need SYS gas on the NEVM to cover the costs of
                executing NEVM smart contracts. These costs will vary depending
                on the NEVM network.
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
                  <input
                    type="email"
                    className="form-control"
                    id="emailaddr"
                    required
                    onChange={this.handleEmailChange}
                    name="emailSender"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="yourname">Your name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="yourname"
                    required
                    onChange={this.handleEmailChange}
                    name="emailName"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <Textarea
                    className="form-control"
                    id="message"
                    minRows={1}
                    required
                    onChange={this.handleEmailChange}
                    name="emailMessage"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-default"
                  disabled={this.state.emailSent}
                >
                  Send
                </button>

                <div className={this.state.emailSent ? "visible" : "hidden"}>
                  <p className="bg-success">
                    Thank you for reaching out to us, we will get back to you as
                    soon as possible.
                  </p>
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
                <a
                  href="https://syscoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin.org
                </a>
                <a
                  href="https://faucet.syscoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin faucet
                </a>
                <a
                  href="https://syscoin.network/syslinks/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin links
                </a>
                <a
                  href="https://syscoin.readme.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Developer Portal
                </a>
                <a
                  href="https://blockbook.elint.services/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin explorer
                </a>
                <a
                  href="https://syscoin.org/whitepaper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin Whitepapers
                </a>
                <a
                  href="https://github.com/syscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Syscoin Github
                </a>
              </div>

              <div className="linksSocial">
                <a
                  href="https://twitter.com/syscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                >
                  <i className="demo-icon icon-twitter"></i>
                </a>
                <a
                  href="https://t.me/Syscoin_Official"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Telegram"
                >
                  <i className="demo-icon icon-icon-telegram"></i>
                </a>
                <a
                  href="https://discord.gg/RkK2AXD"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Discord"
                >
                  <i className="demo-icon icon-discord-logo-white"></i>
                </a>
                <a
                  href="https://www.reddit.com/r/SysCoin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Reddit"
                >
                  <i className="demo-icon icon-reddit-alien"></i>
                </a>
                <a
                  href="https://github.com/syscoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Github"
                >
                  <i className="demo-icon icon-github-circled"></i>
                </a>
                <a
                  href="https://syscoin.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Syscoin.org"
                >
                  <i className="demo-icon icon-sys"></i>
                </a>
              </div>

              <div className="general">© 2022 Syscoin. All rights reserved</div>
            </div>
          </div>
        </div>
        <div className={this.state.ethToSysDisplay ? "visible" : "hidden"}>
          <div id="menu">
            <div className="goHome" onClick={this.onHome}></div>
            <div className="title">Walk over the Syscoin Bridge</div>
          </div>

          <div className="wizardTitleCont">
            <div className="wizardTitle">
              <span className="ethl">NEVM</span>
              <span className="direction">➜</span>
              <span className="sysr">UTXO</span>
            </div>
          </div>

          <I18nextProvider i18n={i18n}>
            <EthToSysWizardi18n />
          </I18nextProvider>

          <button
            type="button"
            className="close closeButton wizardCancel"
            aria-label="Close"
            onClick={this.onHome}
          >
            <span
              className="glyphicon glyphicon-remove"
              aria-hidden="true"
            ></span>{" "}
            Close
          </button>
        </div>

        <div className={this.state.sysToEthDisplay ? "visible" : "hidden"}>
          <div id="menu">
            <div className="goHome" onClick={this.onHome}></div>
            <div className="title">Walk over the Syscoin Bridge</div>
          </div>

          <div className="wizardTitleCont">
            <div className="wizardTitle">
              <span className="sysl">UTXO</span>
              <span className="direction">➜</span>
              <span className="ethr">NEVM</span>
            </div>
          </div>

          <I18nextProvider i18n={i18n}>
            <SysToEthWizardi18n />
          </I18nextProvider>

          <button
            type="button"
            className="close closeButton wizardCancel"
            aria-label="Close"
            onClick={this.onHome}
          >
            <span className="glyphicon glyphicon-remove" aria-hidden="true">
              &nbsp;
            </span>{" "}
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default SysethereumDApp;
