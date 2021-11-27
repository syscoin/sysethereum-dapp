const sjs = require('syscoinjs-lib')
class CONFIGURATION {
  constructor() {
    this.Web3URL = "https://rpc.syscoin.org";
    this.RelayContract = "0xD822557aC2F2b77A1988617308e4A29A89Cb95A6";
    this.ERC20Manager = "0xA738a563F9ecb55e0b2245D1e9E380f0fE455ea1";
    this.TokenFreezeFunction = "0x7ca654cf9212e4c3cf0164a529dd6159fc71113f867d0b09fdeb10aa65780732";
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
    this.TokenUnfreezeFn = '0x8561b3bd1c885cb9cea8df62881a35fe7335336cd5450fd96d14176100c4657d';
    this.SysNetwork = sjs.utils.syscoinNetworks.mainnet;
  }
}
export default new CONFIGURATION();
