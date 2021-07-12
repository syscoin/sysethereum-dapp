  class CONFIGURATION {
    constructor() {
      this.sysRPCURL = "https://localhost";
      this.sysRPCPort = 8443;
      this.sysRPCUser = "u";
      this.sysRPCPassword = "p";
      this.web3URL = "https://localhost:8545";
      this.relayContract = "0x62CCC525dDDC2768eC3386daAdC98Ea06A859ACF";
      this.ERC20Manager = "0x0765EFB302D504751C652C5B1d65E8E9EDf2E70F";
      this.tokenFreezeFunction = "0x9c6dea23fe3b510bb5d170df49dc74e387692eaa3258c691918cd3aa94f5fb74";
      this.NEVMAddressExplorerURL = "https://etherscan.io/address/";
      this.SyscoinTxExplorerURL = "https://sys1.bcfn.ca/tx/";
      this.NEVMTxExplorerURL = "https://etherscan.io/tx/";
      this.faucetURL = "https://faucet.syscoin.org/"
      this.chainId = 58; // tanenbaum 57 = mainnet
    }
  }
  export default new CONFIGURATION();
