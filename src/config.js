  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.agentURL = "bridge-testnet.syscoin.org";
      this.agentPort = 8443;
      this.infuraURL = "https://rinkeby.infura.io/v3/b168da11b4da49b0aee04717e7904a06";
      this.superblockContract = "0xd745BC855e72e8535a929B13Aaa630894d43A2bd";
      this.ERC20Manager = "0x38945d8004cf4671c45686853452A6510812117c";
    }
  }
  export default new CONFIGURATION();
