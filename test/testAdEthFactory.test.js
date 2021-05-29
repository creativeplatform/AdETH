const Dai = artifacts.require("Dai");
const AdEthFactory = artifacts.require("AdEthFactory");

contract("AdEthFactory", (accounts) => {
  let chainId;
  let dai;
  let AdEthFactoryInstance;
  let [adEthFactoryOwner, customer, adCaller, website1, website2, visitor] = accounts;
  let cpc = 10;

  before(async () => {
    chainId = await web3.eth.getChainId();
    dai = await Dai.deployed(chainId);
    AdEthFactoryInstance = await AdEthFactory.deployed();
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const currentOwner = await AdEthFactoryInstance.owner.call();
      assert.equal(currentOwner, adEthFactoryOwner, "Current owner should be equal to adEthFactoryOwner");
    });
  });

  describe("set new fee", async () => {
    it("can set a new fee value", async () => {
      const newFee = 10;
      const initialFee = await AdEthFactoryInstance.fee.call();
      await AdEthFactoryInstance.setFee(newFee, { from: adEthFactoryOwner });
      const contractFee = await AdEthFactoryInstance.fee.call();

      assert.equal(parseInt(newFee), parseInt(contractFee), "The new fee should be set");
    });
  });

  describe("test createAdEthNFT function", async () => {
    it("can create an AdEthNFT contract and keep the fee percentage", async () => {
      const budget = 5000;
      const factoryFee = await AdEthFactoryInstance.fee.call();
      const initialFactoryBalance = await dai.balanceOf(AdEthFactoryInstance.address);
      
      await dai.mint(customer, budget * 2, { from: adEthFactoryOwner });
      
      await dai.approve(AdEthFactoryInstance.address, budget, { from: customer});
      
      await AdEthFactoryInstance.createAdEthNFT(budget, adCaller, "uri", 10, { from: customer });

      const newFactoryBalance = await dai.balanceOf(AdEthFactoryInstance.address);
      assert.equal(parseInt(newFactoryBalance), (parseInt(initialFactoryBalance) + (budget * factoryFee / 100)), "Factory erc20 balance should be the remaining fee percentage");

    })
  })

  describe("test createAdEthNFT function", async () => {
    // createAdEthNFT(uint budget, address _newAdCaller, string memory _newUri, uint256 _newCpc)
    it("the AdEthNFT created should have the budget minus fee erc20 balance", async () => {
      const budget = 5000;
      const factoryFee = await AdEthFactoryInstance.fee.call();
      
      await dai.mint(customer, 10000, { from: adEthFactoryOwner });
      
      await dai.approve(AdEthFactoryInstance.address, budget, { from: customer});
      
      await AdEthFactoryInstance.createAdEthNFT(budget, adCaller, "uri", 10, { from: customer });

      const lastId = await AdEthFactoryInstance.idCounter.call();
      const adEthNFTAddress = await AdEthFactoryInstance.AdEthNFTs.call(lastId);
      const adEthNFTBalance = await dai.balanceOf(adEthNFTAddress);
      assert.equal(parseInt(adEthNFTBalance), (budget - (budget * factoryFee / 100)), "The adEthNFT balance should be equal to the budget minus the fee percentage");
    })
  })
});