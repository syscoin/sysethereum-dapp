const sjs = require('syscoinjs-lib');

class CONFIGURATION {
  constructor(useTestnet = false) {
    if (useTestnet) {
      // 🧪 TESTNET SETTINGS
      this.Web3URL = "https://rpc.tanenbaum.io";
      this.NEVMExplorerURL = "https://explorer.tanenbaum.io/";
      this.FaucetURL = "https://faucet.syscoin.org/";
      this.BlockbookAPIURL = "https://sys-test.org/";
      this.ChainId = "0x1644"; // 5700
      this.NativeCurrencySymbol = "tSYS";
      this.SysNetwork = sjs.utils.syscoinNetworks.testnet;
    } else {
      // ✅ MAINNET SETTINGS
      this.Web3URL = "https://rpc.syscoin.org";
      this.NEVMExplorerURL = "https://explorer.syscoin.org/";
      this.FaucetURL = ""; // No faucet on mainnet
      this.BlockbookAPIURL = "https://blockbook.syscoin.org/";
      this.ChainId = "0x39"; // 57
      this.NativeCurrencySymbol = "SYS";
      this.SysNetwork = sjs.utils.syscoinNetworks.mainnet;
    }

    this.NEVMAddressExplorerURL = this.NEVMExplorerURL + "address/";
    this.NEVMTxExplorerURL = this.NEVMExplorerURL + "tx/";
    this.SyscoinTxExplorerURL = this.BlockbookAPIURL + "tx/";
    
    // Shared
    this.RelayContract = "0xd714E7915362FF89388025F584726E6dF26D20f9"; 
    this.ERC20Manager = "0x7904299b3D3dC1b03d1DdEb45E9fDF3576aCBd5f"; 
    this.TokenFreezeFunction = "0x0b8914e27c9a6c88836bc5547f82ccf331142c761f84e9f1d36934a6a31eefad";
    this.SYSXAsset = "123456";
    this.TokenUnfreezeFn = "0xb27598a6740f5e57c905fdf107266796e030a0739a6e06cee3b5b74c69d0545e";
    this.ChainName = "Syscoin NEVM";
    this.NativeCurrencyName = "Syscoin";
  }
}

export default new CONFIGURATION(process.env.REACT_APP_USE_TESTNET === 'true');
