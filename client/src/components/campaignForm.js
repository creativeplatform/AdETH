import React, { useState, useContext, useEffect } from 'react';

const CampaignForm = (props) => {
  const [campaign, setCampaign] = useState({
    name: "",
    description: "",
    file: "https://i.picsum.photos/id/159/200/300.jpg?hmac=CC6862WSVsX6F74hcV30UzS4czPi0LO6zPJDaEaQeFU",
    budget: 0,
    cpc: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prevCampaign => ({
      ...prevCampaign,
      [name]: value,
    }));
    console.log(campaign)
  };

  const createNFT = () => {
    console.log("create NFT");
    console.log(campaign)
    console.log(props)
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
    </div>
  )
}

export default CampaignForm;