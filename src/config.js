const sjs = require('syscoinjs-lib')
class CONFIGURATION {
  constructor() {
    this.web3URL = "http://localhost:8101";
    this.relayContract = "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6";
    this.ERC20Manager = "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1";
    this.tokenFreezeFunction = "0x7ca654cf9212e4c3cf0164a529dd6159fc71113f867d0b09fdeb10aa65780732";
    this.NEVMAddressExplorerURL = "http://3.141.1.212:8080/address/";
    this.SyscoinTxExplorerURL = "https://blockbook-dev.elint.services/tx/";
    this.NEVMTxExplorerURL = "http://3.141.1.212:8080/tx/";
    this.faucetURL = "http://3.15.216.66:8080/#faucet"
    this.blockbookAPIURL = "https://blockbook-dev.elint.services/"
    this.chainId = 58; // tanenbaum 57 = mainnet
    this.SYSXAsset = "123456";
    this.TokenUnfreezeFn = '0xb925ba840e2f36bcb317f8179bd8b5ed01aba4a22abf5f169162c0894dea87ab';
    this.sysNetwork = sjs.utils.syscoinNetworks.testnet
  }
}
export default new CONFIGURATION();
