// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./Dai.sol";
import "./AdEthNFT.sol";

contract AdEthFactory is Ownable, ReentrancyGuard, Pausable {
  address public erc20Address;
  address[] AdEthNFTs;
  uint fee;

  event ReceivedEther(address indexed sender, uint indexed amount);
  event FactoryProduction(address indexed customer, address indexed AdEthNFT, uint budget);
  
  constructor(address _erc20Address, uint _fee) {
    erc20Address = _erc20Address;
    fee = _fee;
  }

  receive() external payable whenNotPaused {
    emit ReceivedEther(msg.sender, msg.value);
  }
  
  fallback() external payable {
    revert();
  }

  function lockContract() public onlyOwner {
    _pause();
  }

  function unlockContract() public onlyOwner {
    _unpause();
  }

  function createAdEthNFT(uint budget, address _newAdCaller, string memory _newUri, uint256 _newCpc, address _tokenAddress) public {
    Dai tokenContract = Dai(erc20Address);
    require(tokenContract.balanceOf(msg.sender) >= budget, "Insufficient erc20 balance");
    require(tokenContract.allowance(msg.sender, address(this)) >= budget, "Insufficient erc20 allowance");
    require(tokenContract.transferFrom(msg.sender, address(this), budget) == true, "Could not get tokens from customer");

    AdEthNFT newAdEthNFT = new AdEthNFT(msg.sender, _newAdCaller, _newUri, _newCpc, _tokenAddress);
    AdEthNFTs.push(address(newAdEthNFT));
    require(tokenContract.transferFrom(address(this), address(newAdEthNFT), budget));
    
    emit FactoryProduction(msg.sender, address(newAdEthNFT), budget);
  }
}