import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import AdEthNFTContract from '../contracts/AdEthNFT.json';
// import config from '../config/config';

// const adCallerAddress = config.web3.adCallerAddress;
// const adEthNFTAddress = config.web3.adEthNFTAddress;
// const websiteAddress = config.web3.websiteAddress;

const NFTDisplayer = (props) => {
  const [nft, setNft] = useState({
    name: "",
    description: "",
    imgSrc: "",
    budget: 0,
    cpc: 0
  })
  const [uri, setUri] = useState("");

  useEffect(() => {
    const getUri = async () => {
      const web3 = new Web3(window.ethereum);
      const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, props.adEthNFTAddress);
      const response = await AdEthNFTInstance.methods.uri().call();
      setUri(response);
    };
    getUri();
  }, [props.adEthNFTAddress]);

  const nftClicked = async () => {
    console.log("clicked")
    const web3 = new Web3(window.ethereum);
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, props.adEthNFTAddress);
    const uri = await AdEthNFTInstance.methods.uri().call();
    console.log(uri)
    // AdEthNFTInstance.methods.beenClicked(websiteAddress)
    // .send({ from: adCallerAddress })
    // .on('receipt', (receipt) => {
    //   const data = receipt.events.Clicked.returnValues;
    //   console.log(data)
    // })  
    // .on('error', (err) => {
    //   console.log(err)
    // })
  }

  return (
    <div className="NFTDisplayerContainer">
      {/* <a onClick={() => nftClicked()} href="https://sailing-with-greenpeace.com/" target="_blank" rel="noopener noreferrer"> */}
      <a onClick={() => nftClicked()} >
        <img src={nft.imgSrc} alt="display nft file" />
      </a>
    </div>
  )
}

export default NFTDisplayer;