const Dai = artifacts.require("Dai");
const AdEthNFT = artifacts.require("AdEthNFT");

contract("AdEthNFT", (accounts) => {
  let chainId;
  let dai;
  let AdEthNFTInstance;
  let [adEthFactoryAddress, newOwner, website1, website2, caller, visitor] = accounts;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    // AdEthNFTInstance = await AdEthNFT.deployed(newOwner, caller, "uri", 10);
    AdEthNFTInstance = await AdEthNFT.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const currentOwner = await AdEthNFTInstance.owner.call();
      assert.equal(currentOwner, newOwner, "Current owner should be equal to the new owner");
    });
  });

  describe("test whitelisting function", async () => {
    it("can whitelist an address", async () => {
      await AdEthNFTInstance.whitelistAddress(website1, { from: newOwner });
   
      const isWhitelisted = await AdEthNFTInstance.whitelist.call(website1);
      assert.equal(isWhitelisted, true, "The website1 should be whitelisted");
    });
    
    it("can blacklist an address", async () => {
      await AdEthNFTInstance.blacklistAddress(website1, { from: newOwner });
   
      const isWhitelisted = await AdEthNFTInstance.whitelist.call(website1);
      assert.equal(isWhitelisted, false, "The website1 should be blacklisted");
    });
  });
});