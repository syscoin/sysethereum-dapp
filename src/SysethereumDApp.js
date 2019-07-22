import React, { Component } from 'react';
import './SysethereumDApp.css';
import bridgeAnim from './imgs/bridge_diagram.svg';
import SysToEthWizardi18n from './wizard/SysToEthWizard';
import EthToSysWizardi18n from './wizard/EthToSysWizard';
import { I18nextProvider } from "react-i18next";
import i18n from "./wizard/i18n";
import Textarea from 'react-textarea-autosize';

class SysethereumDApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      introDisplay: true,
      ethToSysDisplay: false,
      sysToEthDisplay: false,
  
    };
      
    this.onSysToEth = this.onSysToEth.bind(this);
    this.onEthToSys = this.onEthToSys.bind(this);
    this.onHome = this.onHome.bind(this);
  }


  async componentDidMount() {
  }
  onSysToEth() {
    this.setState({ introDisplay: false, ethToSysDisplay: false,  sysToEthDisplay: true});
  }
  onEthToSys() {
    this.setState({ introDisplay: false, ethToSysDisplay: true,  sysToEthDisplay: false});
  }
  onHome() {
    this.setState({ introDisplay: true, ethToSysDisplay: false,  sysToEthDisplay: false});
  }
  render() { 
    return (
      <div>
        <div  className={(this.state.introDisplay  ? "visible" : "hidden")}>

        <div className="intro">
        
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

                <object className="animation" type="image/svg+xml" data={bridgeAnim}></object>

              </div>

              <div className="links">
                <a href="#">
                  <i className="demo-icon icon-twitter"></i>
                </a>
                <a href="#">
                  <i className="demo-icon icon-icon-telegram"></i>
                </a>
                <a href="#">
                  <i className="demo-icon icon-discord-logo-white"></i>
                </a>
                <a href="#">
                  <i className="demo-icon icon-reddit-alien"></i>
                </a>
                <a href="#">
                  <i className="demo-icon icon-github-circled"></i>
                </a>
                <a href="#">
                  <i className="demo-icon icon-sys"></i>
                </a>
              </div>
                

             
          

            </div>

            <div className="left">
              <a href="https://syscoin.org/" target="_blank" className="logo"></a>
              <h1>Syscoin - Ethereum Bridge</h1>

              <div className="bottom">

                <div className="equals">

                  <div className="line">
                    <span className="blue">1</span> SYSx <span className="grey">=</span> <span className="blue">1</span> SYS    
                  </div>

                  <div className="line small">
                    <span className="blue">Σ</span> SYSx <span className="grey">+</span> <span className="blue">Σ</span> SYS <span className="grey">=</span> Circulation 
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



        </div> 
        <div className="section">
          <div className="howitworks">
            <a className="anchor" name="how-it-works"></a>
            <div className="ornament"></div>
            <h1>How it works?</h1>

            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tellus sed quam consectetur ultrices. Sed iaculis eget elit id imperdiet. Vivamus ex ligula, commodo sit amet ullamcorper et, facilisis non nisi. Etiam ornare aliquam vestibulum. Fusce quis lacus vitae enim egestas egestas luctus sit amet odio. Suspendisse fringilla commodo tellus, id scelerisque enim porta vel. Phasellus tempus, quam et maximus luctus, mi ante sodales sapien, eget rutrum nibh urna sit amet augue.
            </p>
            
            <p>
          Aliquam erat volutpat. Proin et ex et felis auctor consectetur. Praesent imperdiet, eros elementum semper pulvinar, quam nisl luctus ipsum, ac mattis mi quam id ipsum. Maecenas nec augue quis tellus aliquam commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum facilisis felis vitae orci condimentum congue. Nulla facilisi.
          </p>
          <p>
          Suspendisse erat dolor, ultricies vel aliquam molestie, fermentum non arcu. Mauris erat metus, cursus non posuere at, commodo ac orci. Duis luctus massa dolor. Duis luctus dolor ultrices, feugiat turpis nec, venenatis ex. Suspendisse dictum ipsum nec libero volutpat, ut posuere tortor ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus mollis non felis vitae consequat. Donec faucibus, nisl at vulputate congue, neque justo pretium velit, non porttitor massa justo eu sapien. Ut dapibus tincidunt malesuada. Aenean at vestibulum velit, tristique tempor ex. Aliquam quis turpis interdum, consectetur felis ut, molestie est. Praesent lobortis, ligula quis pharetra laoreet, nibh orci suscipit neque, finibus viverra mauris felis in augue. Aliquam tortor nulla, porta facilisis tempus sed, dapibus non libero.
          </p>
          <p>
          Morbi placerat massa ac iaculis dapibus. Maecenas id nisi sit amet lorem vestibulum sagittis. Nam sit amet vestibulum ipsum. Nunc tincidunt purus eget ex scelerisque vestibulum. Donec lobortis, velit a porttitor pellentesque, diam dolor feugiat velit, quis rutrum nibh magna ut velit. Ut varius arcu consectetur ligula aliquet fermentum id ut lorem. Nunc sed leo et arcu molestie tincidunt.
          </p>
          <p>
          Nunc pulvinar sed lacus ut malesuada. Duis volutpat ante pretium ipsum iaculis porttitor. Proin venenatis sed diam eget porta. Pellentesque ultrices, libero vitae dictum ultricies, ante sapien scelerisque metus, et egestas sapien ipsum in quam. Suspendisse et metus eget turpis suscipit pharetra ac et tortor. Quisque erat mi, condimentum sed magna vel, ultricies mollis est. Maecenas venenatis dolor quis augue faucibus vestibulum. Proin sodales sed metus aliquet dictum. Pellentesque mi neque, fringilla et metus sed, dictum euismod orci. In molestie eu nunc ut aliquam. Etiam tempus purus ac eros semper placerat. In maximus fermentum augue, ut interdum tortor consequat ac. Suspendisse suscipit facilisis consectetur. Praesent id eleifend dui. Suspendisse imperdiet ex non consectetur volutpat. Praesent hendrerit fermentum mi, sed laoreet turpis elementum vel.
          </p>
          </div>
        </div>

        <div className="section dark">
          <div className="faq">
            <a className="anchor" name="faq"></a>
            <div className="ornament none"></div>
            <h1>FAQ</h1>

            <p className="question">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
            <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non tellus sed quam consectetur ultrices. Sed iaculis eget elit id imperdiet. Vivamus ex ligula, commodo sit amet ullamcorper et, facilisis non nisi. Etiam ornare aliquam vestibulum. Fusce quis lacus vitae enim egestas egestas luctus sit amet odio. Suspendisse fringilla commodo tellus, id scelerisque enim porta vel. Phasellus tempus, quam et maximus luctus, mi ante sodales sapien, eget rutrum nibh urna sit amet augue.
            </p>
            
            <p className="question">
            Praesent imperdiet, eros elementum semper pulvinar, quam nisl luctus ipsum, ac mattis mi quam id ipsum. Maecenas nec augue quis tellus aliquam commodo.
            </p>
            <p>
          Aliquam erat volutpat. Proin et ex et felis auctor consectetur. Praesent imperdiet, eros elementum semper pulvinar, quam nisl luctus ipsum, ac mattis mi quam id ipsum. Maecenas nec augue quis tellus aliquam commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum facilisis felis vitae orci condimentum congue. Nulla facilisi.
          </p>

          <p className="question">
          Quisque erat mi, condimentum sed magna vel, ultricies mollis est
            </p>
          <p>
          Suspendisse erat dolor, ultricies vel aliquam molestie, fermentum non arcu. Mauris erat metus, cursus non posuere at, commodo ac orci. Duis luctus massa dolor. Duis luctus dolor ultrices, feugiat turpis nec, venenatis ex. Suspendisse dictum ipsum nec libero volutpat, ut posuere tortor ultricies. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus mollis non felis vitae consequat. Donec faucibus, nisl at vulputate congue, neque justo pretium velit, non porttitor massa justo eu sapien. Ut dapibus tincidunt malesuada. Aenean at vestibulum velit, tristique tempor ex. Aliquam quis turpis interdum, consectetur felis ut, molestie est. Praesent lobortis, ligula quis pharetra laoreet, nibh orci suscipit neque, finibus viverra mauris felis in augue. Aliquam tortor nulla, porta facilisis tempus sed, dapibus non libero.
          </p>

          <p className="question">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </p>
          <p>
          Morbi placerat massa ac iaculis dapibus. Maecenas id nisi sit amet lorem vestibulum sagittis. Nam sit amet vestibulum ipsum. Nunc tincidunt purus eget ex scelerisque vestibulum. Donec lobortis, velit a porttitor pellentesque, diam dolor feugiat velit, quis rutrum nibh magna ut velit. Ut varius arcu consectetur ligula aliquet fermentum id ut lorem. Nunc sed leo et arcu molestie tincidunt.
          </p>

          <p className="question">
          Morbi placerat massa ac iaculis dapibus. Maecenas id nisi sit amet lorem vestibulum sagittis.
            </p>
          <p>
          Nunc pulvinar sed lacus ut malesuada. Duis volutpat ante pretium ipsum iaculis porttitor. Proin venenatis sed diam eget porta. Pellentesque ultrices, libero vitae dictum ultricies, ante sapien scelerisque metus, et egestas sapien ipsum in quam. Suspendisse et metus eget turpis suscipit pharetra ac et tortor. Quisque erat mi, condimentum sed magna vel, ultricies mollis est. Maecenas venenatis dolor quis augue faucibus vestibulum. Proin sodales sed metus aliquet dictum. Pellentesque mi neque, fringilla et metus sed, dictum euismod orci. In molestie eu nunc ut aliquam. Etiam tempus purus ac eros semper placerat. In maximus fermentum augue, ut interdum tortor consequat ac. Suspendisse suscipit facilisis consectetur. Praesent id eleifend dui. Suspendisse imperdiet ex non consectetur volutpat. Praesent hendrerit fermentum mi, sed laoreet turpis elementum vel.
          </p>
          </div>
        </div>


        <div className="section contact">
          <div className="contact">
            <a className="anchor" name="contact"></a>
            <div className="ornament"></div>
            <h1>Contact</h1>

            <form action="#" name="contact" method="post">
              <div className="form-group">
                <label htmlFor="emailaddr">Email address</label>
                <input type="email" className="form-control" id="emailaddr" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="yourname">Your name</label>
                <input type="text" className="form-control" id="yourname" name="name" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <Textarea className="form-control" id="message" name="msg" minRows="1" required />
              </div>
            
              <button type="submit" className="btn btn-default">Send</button>
  
            </form>
          </div>
        </div>


        
      </div>

    <div className={(this.state.ethToSysDisplay  ? "visible" : "hidden")}>

      <div id="menu"> 
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
    <div  className={(this.state.sysToEthDisplay  ? "visible" : "hidden")}>

      <div id="menu"> 
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
    </div>
    );
  }
}

export default SysethereumDApp;
