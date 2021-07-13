  class CONFIGURATION {
    constructor() {
      this.sysRPCURL = "127.0.0.1";
      this.sysRPCPort = 18368;
      this.sysRPCUser = "u";
      this.sysRPCPassword = "p";
      this.web3URL = "http://localhost:8101";
      this.relayContract = "0x9e2F4561e63c2312181E49d6142FBddE8DBe9974";
      this.ERC20Manager = "0x58a628D012E76263031ef8DBF1d75e9CdA216671";
      this.tokenFreezeFunction = "0x7ca654cf9212e4c3cf0164a529dd6159fc71113f867d0b09fdeb10aa65780732";
      this.NEVMAddressExplorerURL = "https://etherscan.io/address/";
      this.SyscoinTxExplorerURL = "https://sys1.bcfn.ca/tx/";
      this.NEVMTxExplorerURL = "https://etherscan.io/tx/";
      this.faucetURL = "https://faucet.syscoin.org/"
      this.blockbookAPIURL = "https://sys-explorer.tk/"
      this.chainId = 58; // tanenbaum 57 = mainnet
      this.SYSXAsset = "123456";
    }
  }
  export default new CONFIGURATION();
