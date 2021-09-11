const sjs = require('syscoinjs-lib')
class CONFIGURATION {
  constructor() {
    this.Web3URL = "http://localhost:8101";
    this.RelayContract = "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6";
    this.ERC20Manager = "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1";
    this.TokenFreezeFunction = "0x7ca654cf9212e4c3cf0164a529dd6159fc71113f867d0b09fdeb10aa65780732";
    this.NEVMAddressExplorerURL = "http://tanenbaum.io/address/";
    this.SyscoinTxExplorerURL = "https://explorer.syscoin.tk/tx/";
    this.NEVMTxExplorerURL = "http://tanenbaum.io/tx/";
    this.FaucetURL = "http://faucet.tanenbaum.io/"
    this.BlockbookAPIURL = "https://explorer.syscoin.tk/"
    this.ChainId = 5700; // tanenbaum 57 is mainnet
    this.SYSXAsset = "123456";
    this.TokenUnfreezeFn = '0x8561b3bd1c885cb9cea8df62881a35fe7335336cd5450fd96d14176100c4657d';
    this.SysNetwork = sjs.utils.syscoinNetworks.testnet
  }
}
export default new CONFIGURATION();
