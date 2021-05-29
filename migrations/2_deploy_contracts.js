const AdEthNFT = artifacts.require("./AdEthNFT.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(AdEthNFT, accounts[1], accounts[2], "uri", 10);
};
