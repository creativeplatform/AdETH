import React, { useState } from 'react';
import Web3 from 'web3';
import erc20Contract from '../contracts/Dai.json';
import AdEthFactoryContract from '../contracts/AdEthFactory.json';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
import config from '../config/config';
import { NFTStorage, File } from 'nft.storage';

const client = new NFTStorage({ token: config.filecoin.nftStorage })

const CampaignForm = (props) => {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    destination: "",
    file: "",
    budget: 0,
    cpc: 0
  })
  const [NFTdata, setNFTData ] = useState({
    NFTaddress: "",
    adCallerPrivateKey: ""
  })
  const [websiteAddress, setWebsiteAddress] = useState("")
  const [whitelisted, setWhitelisted] = useState(null);
  const erc20Address = config.web3.erc20Address;
  const adEthFactoryAddress = config.web3.adEthFactoryAddress;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prevCampaign => ({
      ...prevCampaign,
      [name]: value,
    }));
  };

  const handleFileChange = () => {
    let filesSelected = (document.getElementById("file-uploaded")).files;
    if (filesSelected != null) {
      let fileSize = filesSelected[0].size;
      if (filesSelected.length > 0 && fileSize <= 50000) {
        setCampaign({...campaign, file: filesSelected[0]})
      } else {
        alert('File size too big, image must be less than 50kb');
      };
    };
  };

  const createNFT = async () => {
    console.log("create NFT");
    console.log(campaign)
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);
    
    const erc20Instance = new web3.eth.Contract(erc20Contract.abi, erc20Address);
    erc20Instance.methods.approve(adEthFactoryAddress, campaign.budget)
    .send({ from: accounts[0] })
    .on('receipt', async () => {
      // const metadata = await client.store({
      await client.store({
        name: campaign.name,
        description: campaign.description,
        budget: campaign.budget,
        cpc: campaign.cpc,
        image: new File([campaign.file], campaign.name + ".jpg", { type: 'image/jpg' })
      })
      .then((res) => {
        console.log(res)
        const nftUri = "https://" + res.ipnft + ".ipfs.dweb.link/metadata.json";
        const AdEthFactory = new web3.eth.Contract(AdEthFactoryContract.abi, adEthFactoryAddress);
        const adCaller = props.params.adCallerAddress;
        AdEthFactory.methods.createAdEthNFT(campaign.budget, adCaller, nftUri, campaign.cpc)
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
      // const endUrl = ".ipfs.dweb.link";
      // const nftUri = `https://${metadata.ipnft}.ipfs.dweb.link/metadata.json`;
      // console.log(`https://${metadata.ipnft}.ipfs.dweb.link/metadata.json`)
      // if (metadata.url !== "") {
        // const AdEthFactory = new web3.eth.Contract(AdEthFactoryContract.abi, adEthFactoryAddress);
        // const daiBudget = campaign.budget * 10 ** 18;
        // const daiCpc = campaign.cpc * 10 ** 18;
        // console.log("campaign.budget", campaign.budget)
        // console.log("props.params.adCallerAddress", props.params.adCallerAddress)
        // console.log("nftUri", nftUri)
        // console.log("campaign.cpc", campaign.cpc)

        // AdEthFactory.methods.createAdEthNFT(campaign.budget, props.params.adCallerAddress, nftUri, campaign.cpc)
        // .send({ from: accounts[0] })
        // .on('receipt', async (receipt) => {
        //   const data = receipt.events.FactoryProduction.returnValues;
        //   console.log(data)
        //   setNFTData({NFTaddress: data.AdEthNFT})
        // })
        // .on('error', (err) => {
        //   console.log(err)
        // })
      // }
    })  
    .on('error', (err) => {
      console.log(err)
    })  
  }

  const handleWebsiteAddress = (e) => {
    const { value } = e.target;
    setWebsiteAddress(value);
  };

  const whitelist = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);
    
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, NFTdata.NFTaddress);
    AdEthNFTInstance.methods.whitelistAddress(websiteAddress)
    .send({ from: accounts[0] })
    .on('receipt', async () => {
      console.log("success")
      setWhitelisted(true)
    })
  }

  const blacklist = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);
    
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, NFTdata.NFTaddress);
    AdEthNFTInstance.methods.blacklistAddress(websiteAddress)
    .send({ from: accounts[0] })
    .on('receipt', async () => {
      console.log("success")
      setWhitelisted(false)
    })
  }

  const isWhitelisted = async () => {
    const web3 = new Web3(window.ethereum);
    
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, NFTdata.NFTaddress);
    const status = await AdEthNFTInstance.methods.whitelist(websiteAddress).call()
    console.log(status)
    setWhitelisted(status);
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
          required
        />
      </label>
      <label className="formLabel">Campaign description:
        <input 
          type="test" 
          name="description" 
          id="description" 
          onChange={handleChange}
          required
        />
      </label>
      <label className="formLabel">Destination url after click:
        <input 
          type="test" 
          name="destination" 
          id="destination" 
          onChange={handleChange}
          required
        />
      </label>
      <label className="formLabel">File:
        <input 
          type="file" 
          name="file" 
          id="file-uploaded" 
          onChange={handleFileChange}
          required
        />
      </label>
      <label className="formLabel">Budget amount in DAI:
        <input 
          type="number" 
          name="budget" 
          id="budget" 
          onChange={handleChange}
          required
        />
      </label>
      <label className="formLabel">Cost Per Clic in DAI:
        <input 
          type="number" 
          name="cpc" 
          id="cpc" 
          onChange={handleChange}
          required
        />
      </label>
      <button className="introduction-button irrigateFormButton" onClick={() => createNFT()}>Generate NFT</button>
      {NFTdata.NFTaddress !== "" ?
      <div>
        <div className="formLabel">
          Your NFT address is : {NFTdata.NFTaddress}
        </div>
        <div className="formLabel">
          Your private key to share with partner websites is : {props.params.adCallerPrivateKey}
        </div>
        <label className="formLabel">Whitelist a website address:
          <input 
            type="text" 
            name="websiteAddress" 
            id="whitelistAddress" 
            onChange={handleWebsiteAddress}
            required
          />
        </label>
        <button className="introduction-button irrigateFormButton" onClick={() => whitelist()}>Whitelist Address</button>
        <label className="formLabel">Blacklist a website address:
          <input 
            type="text" 
            name="websiteAddress" 
            id="blacklistAddress" 
            onChange={handleWebsiteAddress}
            required
          />
        </label>
        <button className="introduction-button irrigateFormButton" onClick={() => blacklist()}>Blacklist Address</button>
        <label className="formLabel">Get website address status:
          <input 
            type="text" 
            name="websiteAddress" 
            id="websiteAddress" 
            onChange={handleWebsiteAddress}
            required
          />
        </label>
        <button className="introduction-button irrigateFormButton" onClick={() => isWhitelisted()}>Get Address Status</button>
        {websiteAddress !== "" ?
          whitelisted !== null ?
          <div>Address Status: {whitelisted.toString()}</div>
          :
          <></>  
        :
        <></>  
        }
      </div>
      :
      <></>
      }
    </div>
  )
}

export default CampaignForm;