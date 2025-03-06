const sjs = require('syscoinjs-lib')
class CONFIGURATION {
  constructor() {
    this.Web3URL = "https://rpc.syscoin.org";
    this.RelayContract = "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6";
    this.ERC20Manager = "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1";
    this.TokenFreezeFunction = "0x8f3b257b2cea086a69bcfbefab36555c9e6275fc56ada0f1d8796222f6874fec";
    this.NEVMExplorerURL = "https://explorer.syscoin.org/";
    this.NEVMAddressExplorerURL = this.NEVMExplorerURL + "address/";
    this.SyscoinTxExplorerURL = "https://blockbook.elint.services/tx/";
    this.NEVMTxExplorerURL = this.NEVMExplorerURL + "tx/";
    this.FaucetURL = "https://faucet.syscoin.org/";
    this.BlockbookAPIURL = "https://blockbook.elint.services/";
    this.ChainId = "0x39"; // 5700 testnet, 57 mainnet
    this.ChainName = "Syscoin NEVM";
    this.NativeCurrencyName = "Syscoin";
    this.NativeCurrencySymbol = "SYS";
    this.SYSXAsset = "123456";
    this.TokenUnfreezeFn = '0x4f3215d035d7407ce0b19bc31b8e8e9269d0af49093fbf8ec1a11a2c58a73061';
    this.SysNetwork = sjs.utils.syscoinNetworks.mainnet;
    this.EasySwapAPI = "http://localhost:8080/api/"
  }
}
export default new CONFIGURATION();
