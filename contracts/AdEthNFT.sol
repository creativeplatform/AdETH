// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Dai.sol";

contract AdEthNFT {
  address public owner;
  address public factory;
  address public adCaller;
  string public uri;
  uint256 public cpc;
  address public tokenAddress;
  
  mapping(address => bool) public whitelist;
  
  event Whitelisted(address newAddress);
  event Blacklisted(address newAddress);
  event Clicked(address websiteAddress, uint256 cpc);

  constructor(address _newOwner, address _newAdCaller, string memory _newUri, uint256 _newCpc, address _tokenAddress) {
    factory = msg.sender;
    owner = _newOwner;
    adCaller = _newAdCaller;
    uri = _newUri;
    cpc = _newCpc;
    tokenAddress = _tokenAddress;
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  modifier onlyAdCaller {
    require(msg.sender == adCaller);
    _;
  }

  function whitelistAddress(address _newAddress) public onlyOwner {
    require(_newAddress != address(0), "Address 0");
    require(whitelist[_newAddress] == false, "Address already whitelisted");
    
    whitelist[_newAddress] = true;
    
    emit Whitelisted(_newAddress);
  }

  function blacklistAddress(address _newAddress) public onlyOwner {
    require(_newAddress != address(0), "Address 0");
    require(whitelist[_newAddress] == true, "Address already blacklisted");
    
    whitelist[_newAddress] = false;
    
    emit Blacklisted(_newAddress);
  }

  function beenClicked(address websiteAddress) public onlyAdCaller {
    require(whitelist[websiteAddress] == true, "Website address not whitelisted");

    Dai tokenContract = Dai(tokenAddress);
    require(tokenContract.balanceOf(address(this)) >= cpc, "Insufficient erc20 balance");
    require(tokenContract.transferFrom(address(this), websiteAddress, cpc) == true, "Could not send tokens to the website");
    emit Clicked(websiteAddress, cpc);
  }

  //function callerBalance()
}