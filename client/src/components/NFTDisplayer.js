import React, { useState } from 'react';
import Web3 from 'web3';
// import erc20Contract from '../contracts/Dai.json';
// import AdEthFactoryContract from '../contracts/AdEthFactory.json';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
import config from '../config/config';

// const erc20Address = config.web3.erc20Address;
// const AdEthFactoryAddress = config.web3.AdEthFactoryAddress;
const adCallerAddresss = config.web3.adCallerAddresss;

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
  }

  return (
    <div className="NFTDisplayerContainer">
      <div onClick={() => nftClicked()}>
        <img src={nft.imgSrc} alt="display image" />
      </div>
    </div>
  )
}

export default NFTDisplayer;