  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.agentURL = "bridge-testnet.syscoin.org";
      this.agentPort = 8443;
      this.infuraURL = "https://rinkeby.infura.io/v3/b168da11b4da49b0aee04717e7904a06";
      this.superblockContract = "0x62CCC525dDDC2768eC3386daAdC98Ea06A859ACF";
      this.ERC20Manager = "0x0765EFB302D504751C652C5B1d65E8E9EDf2E70F";
      this.tokenFreezeFunction = "0x9c6dea23fe3b510bb5d170df49dc74e387692eaa3258c691918cd3aa94f5fb74";
    }
  }
  export default new CONFIGURATION();
