import React, { useState } from 'react';
import Web3 from 'web3';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
import config from '../config/config';

const adCallerAddresss = config.web3.adCallerAddress;
const AdEthNFTAddress = config.web3.AdEthNFTAddress;
const websiteAddress = config.web3.websiteAddress;

const NFTDisplayer = () => {
  const [nft, setNft] = useState({
    name: "",
    description: "",
    imgSrc: "https://i.picsum.photos/id/159/200/300.jpg?hmac=CC6862WSVsX6F74hcV30UzS4czPi0LO6zPJDaEaQeFU",
    budget: 0,
    cpc: 0
  })

  const nftClicked = () => {
    console.log("clicked")
    const web3 = new Web3(window.ethereum);
    
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, AdEthNFTAddress);
    AdEthNFTInstance.methods.beenClicked(websiteAddress)
    .send({ from: adCallerAddresss })
    .on('receipt', (receipt) => {
      const data = receipt.events.Clicked.returnValues;
      console.log(data)
    })  
    .on('error', (err) => {
      console.log(err)
    })
  }

  return (
    <div className="NFTDisplayerContainer">
      <a onClick={() => nftClicked()} href="https://sailing-with-greenpeace.com/" target="_blank" rel="noopener noreferrer">
        <img src={nft.imgSrc} alt="display image" />
      </a>
    </div>
  )
}

export default NFTDisplayer;