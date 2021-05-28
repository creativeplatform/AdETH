// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./Dai.sol";

contract AdEth is Ownable, ReentrancyGuard, Pausable {
  address public erc20Address;

  event ReceivedEther(address indexed sender, uint indexed amount);
  
  constructor(address _erc20Address) {
    erc20Address = _erc20Address;
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
}