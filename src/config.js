  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.agentURL = "bridge-testnet.syscoin.org";
      this.agentPort = 8443;
      this.infuraURL = "https://mainnet.infura.io/v3/b168da11b4da49b0aee04717e7904a06";
      this.superblockContract = "0xa0Fe740Ed57C9FCB0A04E330824aD8aD574bc54c";
      this.ERC20Manager = "0xFF957eA28b537b34E0c6E6B50c6c938668DD28a0";
      this.tokenFreezeFunction = "0xaabab1db49e504b5156edf3f99042aeecb9607a08f392589571cd49743aaba8d";
    }
  }
  export default new CONFIGURATION();
