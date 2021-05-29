// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract AdEthNFT {
  address public owner;
  address public factory;
  address public adCaller;
  string public uri;
  uint8 public cpc;
  
  mapping(address => bool) public whitelist;
  
  event Whitelisted(address newAddress);

  constructor(address _newOwner, address _newAdCaller, string memory _newUri, uint8 _newCpc) {
    factory = msg.sender;
    owner = _newOwner;
    adCaller = _newAdCaller;
    uri = _newUri;
    cpc = _newCpc;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }
  
  //functions
  //function beenClicked()
  function whitelistAddress(address _newAddress) public onlyOwner {
    require(_newAddress != address(0), "Address 0");
    require(whitelist[_newAddress] == false, "Address already whitelisted");
    whitelist[_newAddress] = true;
    emit Whitelisted(_newAddress);
  }
  //function blacklistAddress()
  //function callerBalance()
}