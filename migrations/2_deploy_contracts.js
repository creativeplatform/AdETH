// const AdEthNFT = artifacts.require("./AdEthNFT.sol");

// module.exports = function(deployer, network, accounts) {
//   deployer.deploy(AdEthNFT, accounts[1], accounts[2], "uri", 10);
// };

const Dai = artifacts.require("./Dai.sol");
const AdEthNFT = artifacts.require("./AdEthNFT.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Dai, 1337)
  .then(() => {
    return deployer.deploy(AdEthNFT, accounts[1], accounts[2], "uri", 10, Dai.address)
  });
};
