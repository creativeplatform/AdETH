import React, { Component } from "react";
import AdEthFactoryContract from "./contracts/AdEthFactory.json";
import getWeb3 from "./getWeb3";
import CampaignForm from  "./components/campaignForm";

import "./App.css";

class App extends Component {
  state = { feeValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdEthFactoryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AdEthFactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.setFee(10).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const currentFee = await contract.methods.fee().call();
    console.log(currentFee)
    // Update state with the result.
    this.setState({ feeValue: currentFee });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>AdEth</h1>
        <h2>Onboarding the advertising industrie into web3</h2>
        <p>
          Create an NFT with your add and provide a budget.
          Websites gets paid automatically on each clic.
        </p>
        <p>
          Transactions are made in DAI only.
        </p>
        <div>Current AdEth fee value is {this.state.feeValue} %</div>

        <CampaignForm></CampaignForm>
      </div>
    );
  }
}

export default App;
