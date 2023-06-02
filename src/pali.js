class PALICONNECT {
  constructor() {
    this.connect();
  }
  async connect() {
    let provider;
    if (window.pali) {
      let connectedAccount;
      provider = window.pali;
      try {
        await provider
          .request({ method: "sys_requestAccounts", params: [] })
          .then(async () => {
            try {
              connectedAccount = await provider.request({
                method: "wallet_getAccount",
                params: [],
              });
            } catch (error) {
              console.log("paliConnect error: " + error);
            }
          });

        if (!connectedAccount) {
          console.log(`paliConnect error: wallet isn't connected. Try again.`)
        }
      } catch (e) {
        console.log("paliConnect error: " + e);
      }
    }
  }
}
export default new PALICONNECT();
