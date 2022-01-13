import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
import itemManagerContract from "./contracts/ItemManager.json";
import itemContract from "./contracts/Item.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {loaded: false, cost:0, itemName:"example_1"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        itemManagerContract.abi,
        itemManagerContract.networks[this.networkId] && itemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        itemContract.abi,
        itemContract.networks[this.networkId] && itemContract.networks[this.networkId].address,
      );

      this.listenToPaymentEvent();
      this.setState({ loaded: true}, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
      console.log(evt);
      let itemObj = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
      alert("Item " + itemObj._identifier + " was paid, deliver it now");
    });
  }
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked: target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = async() => {
    const {cost, itemName} = this.state;
    console.log(cost, itemName, this.itemManager);
    let result = await this.itemManager.methods.createItem(itemName, cost).send({from:this.accounts[0]});
    console.log(result);
    alert("send" + cost + "wei to " + result.events.SupplyChainStep.returnValues._itemAddress);
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Event Trigger/ supply chain Example</h1>
        <h2>items</h2>
        <h2>add items</h2>
        cost in Wei: <input type = "text" name = "cost" value ={this.state.cost} onChange ={this.handleInputChange} />
        item identifier: <input type = "text" name = "itemName" value ={this.state.itemName} onChange ={this.handleInputChange} />
        <button type ="button" onClick = {this.handleSubmit}> create new item</button>
      </div>
    );
  }
}

export default App;
