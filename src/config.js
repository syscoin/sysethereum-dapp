const sjs = require('syscoinjs-lib')
class CONFIGURATION {
  constructor() {
    this.Web3URL = "https://rpc.syscoin.org";
    this.RelayContract = "0xd714E7915362FF89388025F584726E6dF26D20f9";
    this.ERC20Manager = "0x7904299b3D3dC1b03d1DdEb45E9fDF3576aCBd5f";
    this.TokenFreezeFunction = "0x0b8914e27c9a6c88836bc5547f82ccf331142c761f84e9f1d36934a6a31eefad";
    this.NEVMExplorerURL = "https://explorer.syscoin.org/";
    this.NEVMAddressExplorerURL = this.NEVMExplorerURL + "address/";
    this.SyscoinTxExplorerURL = "https://blockbook.syscoin.org/tx/";
    this.NEVMTxExplorerURL = this.NEVMExplorerURL + "tx/";
    this.FaucetURL = "https://faucet.syscoin.org/";
    this.BlockbookAPIURL = "https://blockbook.syscoin.org/";
    this.ChainId = "0x39"; // 5700 testnet, 57 mainnet
    this.ChainName = "Syscoin NEVM";
    this.NativeCurrencyName = "Syscoin";
    this.NativeCurrencySymbol = "SYS";
    this.SYSXAsset = "123456";
    this.TokenUnfreezeFn = '0x4f3215d035d7407ce0b19bc31b8e8e9269d0af49093fbf8ec1a11a2c58a73061';
    this.SysNetwork = sjs.utils.syscoinNetworks.mainnet;
  }
}
export default new CONFIGURATION();
