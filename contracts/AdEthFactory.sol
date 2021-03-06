// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./Dai.sol";
import "./AdEthNFT.sol";

contract AdEthFactory is Ownable, ReentrancyGuard, Pausable {
  address public erc20Address;
  uint public idCounter;
  uint public fee;
  uint public ethTank;

  mapping(uint => address) public AdEthNFTs;

  event ReceivedEther(address indexed sender, uint indexed amount);
  event FactoryProduction(address indexed customer, address indexed AdEthNFT, uint indexed budget);
  event NewFeeSet(uint indexed _newFee);
  event NewEthTankAmountSet(uint indexed _newTankAmount);
  
  constructor(address _erc20Address, uint _fee) {
    erc20Address = _erc20Address;
    idCounter = 0;
    fee = _fee;
    ethTank = 100000000000000000;
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

  function setFee(uint _newFee) public onlyOwner {
    fee = _newFee;
    emit NewFeeSet(_newFee);
  }

  function setEthTank(uint _newTankAmount) public onlyOwner {
    ethTank = _newTankAmount;
    emit NewEthTankAmountSet(_newTankAmount);
  }

  function createAdEthNFT(uint256 budget, address payable _newAdCaller, string memory _newUri, uint256 _newCpc) public {
    Dai tokenContract = Dai(erc20Address);
    require(tokenContract.balanceOf(msg.sender) >= budget, "Insufficient erc20 balance");
    require(tokenContract.allowance(msg.sender, address(this)) >= budget, "Insufficient erc20 allowance");
    require(tokenContract.transferFrom(msg.sender, address(this), budget) == true, "Could not get tokens from customer");

    AdEthNFT newAdEthNFT = new AdEthNFT(msg.sender, _newAdCaller, _newUri, _newCpc, erc20Address);
    idCounter += 1;
    AdEthNFTs[idCounter] = address(newAdEthNFT);
    uint budgetMinusFee = budget - (budget * fee / 100);
    require(tokenContract.transferFrom(address(this), address(newAdEthNFT), budgetMinusFee));
    (bool sent, bytes memory data) = _newAdCaller.call{value: ethTank}("");
    require(sent, "Failed to send Ether");
    emit FactoryProduction(msg.sender, address(newAdEthNFT), budget);
  }
}