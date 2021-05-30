import React, { useEffect } from 'react';
import Web3 from 'web3';
import Provider from '@truffle/hdwallet-provider';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
import config from '../config/config';

const adEthNFTAddress = config.web3.adEthNFTAddress;
const websiteAddress = config.web3.websiteAddress;

const NFTDisplayer = (props) => {
  useEffect(() => {
    props.getUri();
    props.getAdCaller();
  })

  const nftClicked = async () => {
    console.log("clicked");
    const provider = new Provider(config.web3.adCallerPrivateKey, window.ethereum)
    const web3 = new Web3(provider);
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, adEthNFTAddress);

    console.log(props);
    const receipt = await AdEthNFTInstance.methods.beenClicked(websiteAddress).send({ from: props.adCaller, nonce: 0 })
    console.log(`Transaction hash: ${receipt.transactionHash}`);
  };

  return (
    <div className="NFTDisplayerContainer">
      <a onClick={() => nftClicked()} href={props.adDestination} target="_blank" rel="noopener noreferrer">
        <img src={props.imageUrl} alt="display nft file" />
      </a>
    </div>
  )
}

export default NFTDisplayer;