
class PALICONNECT {
  constructor() {
    this.connect()
  }
  async connect() {
    if (window.ConnectionsController) {
        var connectedAccount
        try {
          connectedAccount = await window.ConnectionsController.getConnectedAccount()
          .catch(function(rejected){
            console.log("paliConnect error: " + rejected)
          });
          if(!connectedAccount) {
            await window.ConnectionsController.connectWallet()
            .catch(function(rejected){
              console.log("paliConnect error: " + rejected)
            });
          }
        } catch(e) {
          console.log("paliConnect error: " + e)
        }
      }
    
  }
}
export default new PALICONNECT();