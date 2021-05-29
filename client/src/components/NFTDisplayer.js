import React, { useState } from 'react';
import Web3 from 'web3';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
import config from '../config/config';

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
      <a onClick={() => nftClicked()} href="https://sailing-with-greenpeace.com/" target="_blank">
        <img src={nft.imgSrc} alt="display image" />
      </a>
    </div>
  )
}

export default NFTDisplayer;