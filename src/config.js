  class CONFIGURATION {
    constructor() {
      this.testnet = true;
      this.syscoinRpcURL = "localhost";
      this.syscoinRpcPort = 18370;
      this.syscoinRpcUser = "u";
      this.syscoinRpcPassword = "p";
      this.agentURL = "localhost";
      this.agentPort = 8000;
      this.infuraURL = "https://rinkeby.infura.io/v3/d178aecf49154b12be98e68e998cfb8d";
    }
  }
  export default new CONFIGURATION();