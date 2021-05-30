import React, { Component } from "react";
import AdEthFactoryContract from "./contracts/AdEthFactory.json";
import getWeb3 from "./getWeb3";
import CampaignForm from  "./components/campaignForm";
import logo from "./logo/AdEth_logo.png";
import "./App.css";

class App extends Component {
  state = { feeValue: 0, web3: null, accounts: null, contract: null, adCallerAddress: null, adCallerPrivateKey: null };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AdEthFactoryContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AdEthFactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const newAccount = web3.eth.accounts.create(web3.utils.randomHex(32));

      this.setState({ 
        web3, 
        accounts, 
        contract: instance, 
        adCallerAddress: newAccount.address, 
        adCallerPrivateKey: newAccount.privateKey
      }, this.getCurrentFee);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getCurrentFee = async () => {
    const { contract } = this.state;
    const currentFee = await contract.methods.fee().call();
    this.setState({ feeValue: currentFee });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <img src={logo} alt="adEth logo title"></img>
          <h2>Onboarding the advertising industrie into web3</h2>
          <p>
            Create an NFT with your add and provide a budget.
            Websites gets paid automatically on each clic.
          </p>
          <p>
            Transactions are made in DAI only.
          </p>
          <div>Current AdEth fee value is {this.state.feeValue} %</div>
          <CampaignForm
            params = {this.state}
          ></CampaignForm>
        </div>
      </div>
    );
  }
}

export default App;
