  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.agentURL = "bridge-testnet.syscoin.org";
      this.agentPort = 8443;
      this.infuraURL = "https://rinkeby.infura.io/v3/b168da11b4da49b0aee04717e7904a06";
      this.superblockContract = "0x0c206e62dB7478C7D55B5a8C39cACe72FCa29ef7";
      this.ERC20Manager = "0x443d9a14fb6ba2A45465bEC3767186f404Ccea25";
    }
  }
  export default new CONFIGURATION();
