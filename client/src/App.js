import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdEthFactoryContract from "./contracts/AdEthFactory.json";
import getWeb3 from "./getWeb3";
import CampaignForm from  "./components/campaignForm";
import Trendy from "./pages/Trendy";

import "./App.css";

class App extends Component {
  state = { feeValue: 0, web3: null, accounts: null, contract: null };

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

      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    const { contract } = this.state;

    // await contract.methods.setFee(10).send({ from: accounts[0] });

    const currentFee = await contract.methods.fee().call();
    this.setState({ feeValue: currentFee });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact component={() => {
              return (
                <div>
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
              )
            }} />
            <Route path="/trendy" exact component={() => <Trendy />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
