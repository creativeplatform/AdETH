import React, { useState } from 'react';
import Web3 from 'web3';
import erc20Contract from '../contracts/Dai.json';
import AdEthFactoryContract from '../contracts/AdEthFactory.json';
import config from '../config/config';

const erc20Address = config.web3.erc20Address;
const AdEthFactoryAddress = config.web3.AdEthFactoryAddress;
const adCallerAddresss = config.web3.adCallerAddresss;

const CampaignForm = () => {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    // file: "https://i.picsum.photos/id/159/200/300.jpg?hmac=CC6862WSVsX6F74hcV30UzS4czPi0LO6zPJDaEaQeFU",
    file: "uri",
    budget: 0,
    cpc: 0
  })
  const [NFTdata, setNFTData ] = useState({
    NFTaddress: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prevCampaign => ({
      ...prevCampaign,
      [name]: value,
    }));
    console.log(campaign)
  };

  const createNFT = async () => {
    console.log("create NFT");
    console.log(campaign)
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);
    
    const erc20Instance = new web3.eth.Contract(erc20Contract.abi, erc20Address);
    erc20Instance.methods.approve(AdEthFactoryAddress, campaign.budget)
    .send({ from: accounts[0] })
    .on('receipt', async () => {
      const AdEthFactory = new web3.eth.Contract(AdEthFactoryContract.abi, AdEthFactoryAddress);
      AdEthFactory.methods.createAdEthNFT(campaign.budget, adCallerAddresss, campaign.file, campaign.cpc)
      .send({ from: accounts[0] })
      .on('receipt', async (receipt) => {
        const data = receipt.events.FactoryProduction.returnValues;
        console.log(data)
        setNFTData({NFTaddress: data.AdEthNFT})
      })
      .on('error', (err) => {
        console.log(err)
      })
    })  
    .on('error', (err) => {
      console.log(err)
    })  
  }



  return (
    <div className="campaignFormContainer">
      <h2>Start an advertising campaign:</h2>
      <label className="formLabel">NFT name:
        <input 
          type="test" 
          name="name" 
          id="name" 
          onChange={handleChange}
          // value={newDonation.amount}
          required
        />
      </label>
      <label className="formLabel">Campaign description:
        <input 
          type="test" 
          name="description" 
          id="description" 
          onChange={handleChange}
          // value={newDonation.amount}
          required
        />
      </label>
      <label className="formLabel">File:
        <input 
          type="file" 
          name="file" 
          id="file" 
          onChange={handleChange}
          // value={newDonation.amount}
          required
        />
      </label>
      <label className="formLabel">Budget amount in DAI:
        <input 
          type="number" 
          name="budget" 
          id="budget" 
          onChange={handleChange}
          // value={newDonation.amount}
          required
        />
      </label>
      <label className="formLabel">Cost Per Clic in DAI:
        <input 
          type="number" 
          name="cpc" 
          id="cpc" 
          onChange={handleChange}
          // value={newDonation.amount}
          required
        />
      </label>
      <button className="introduction-button irrigateFormButton" onClick={() => createNFT()}>Generate NFT</button>
      {NFTdata.NFTaddress !== "" ?
      <div>
        Your NFT address is : {NFTdata.NFTaddress}
      </div>
      :
      <div>

      </div>
      }
    </div>
  )
}

export default CampaignForm;