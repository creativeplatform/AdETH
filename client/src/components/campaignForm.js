import React, { useState, useContext, useEffect } from 'react';

const CampaignForm = (props) => {
  return (
    <div>
      <h2>Start an advertising campaign:</h2>
      <label className="formLabel">Budget amount in DAI:
        <input 
          type="number" 
          name="amount" 
          id="amount" 
          // onChange={handleAmount}
          // value={newDonation.amount}
          required
        />
      </label>
      <div></div>
      <div></div>
    </div>
  )
}

export default CampaignForm;