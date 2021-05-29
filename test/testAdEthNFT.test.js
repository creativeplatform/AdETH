const Dai = artifacts.require("Dai");
const AdEthNFT = artifacts.require("AdEthNFT");

contract("AdEthNFT", (accounts) => {
  let chainId;
  let dai;
  let AdEthNFTInstance;
  let [adEthFactoryAddress, newOwner, adCaller, website1, website2, visitor] = accounts;
  let cpc = 10;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
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

  describe("test click function", async () => {
    it("transfers cpc amount of erc20 to website address ", async () => {
      await AdEthNFTInstance.whitelistAddress(website1, { from: newOwner });
      await dai.mint(AdEthNFTInstance.address, 1000, { from: adEthFactoryAddress });
      const initialWebsite1Balance = await dai.balanceOf(website1);
      const initialNFTBalance = await dai.balanceOf(AdEthNFTInstance.address);
      console.log("NFTBalance", parseInt(initialNFTBalance));

      await AdEthNFTInstance.beenClicked(website1, { from: adCaller });
      
      const finalWebsite1Balance = await dai.balanceOf(website1)
      assert.equal(parseInt(finalWebsite1Balance), (parseInt(initialWebsite1Balance) + cpc), "The website1 erc20 balance should be added by one cpc");
    });
  });
});