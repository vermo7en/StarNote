import Web3 from "web3";
import StarNoteArtifact from "../../build/contracts/StarNote.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // Get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StarNoteArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        StarNoteArtifact.abi,
        deployedNetwork.address,
      );
      // Get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  lookUp: async function (){
    const { lookUpTokenIdToStarInfo } = this.meta.methods;
    const id = document.getElementById("lookId").value;
    const name = await lookUpTokenIdToStarInfo(id).call();
    if (name === "") {
      App.setStatus("Star with id " + id + " is not known.");
    } else {
      App.setStatus("Star name is " + name + ".");
    }
  }
};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // Use MetaMask provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // Permission to access accounts
  } else {
    // Fallback
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});