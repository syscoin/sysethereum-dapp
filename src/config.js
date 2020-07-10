  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.agentURL = "bridge-testnet.syscoin.org";
      this.agentPort = 8443;
      this.infuraURL = "https://rinkeby.infura.io/v3/b168da11b4da49b0aee04717e7904a06";
      this.superblockContract = "0xFEfc4F2DCcABb3922962271aD4bC50e362B8de0d";
      this.ERC20Manager = "0x9CFA7e6Bf7F45d3CA675fb2Fcea3F01FFf72a339";
      this.tokenFreezeFunction = "0xaabab1db49e504b5156edf3f99042aeecb9607a08f392589571cd49743aaba8d";
    }
  }
  export default new CONFIGURATION();
