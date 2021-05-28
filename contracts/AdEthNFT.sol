// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract AdEthNFT {
  //variables
  address public owner;
  address public factory;
  address public adCaller;
  string public uri;
  uint8 public cpc;
  
  mapping(address => bool) public whitelist;
  
  //events

  //constructor
  constructor(address _newOwner, address _newAdCaller, string memory _newUri, uint8 _newCpc) {
    factory = msg.sender;
    owner = _newOwner;
    adCaller = _newAdCaller;
    uri = _newUri;
    cpc = _newCpc;
  }

  //functions
  //function beenClicked()
  //function whitelistAddress()
  //function blacklistAddress()
  //function callerBalance()
}