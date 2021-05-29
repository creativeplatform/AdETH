const Dai = artifacts.require("./Dai.sol");
const AdEthFactory = artifacts.require("./AdEthFactory.sol");
const AdEthNFT = artifacts.require("./AdEthNFT.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Dai, 1337)
  .then(() => {
    deployer.deploy(AdEthFactory, Dai.address, 1000)
  })
  .then(() => {
    return deployer.deploy(AdEthNFT, accounts[1], accounts[2], "uri", 10, Dai.address)
  });
};
