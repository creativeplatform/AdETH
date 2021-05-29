const AdEthNFT = artifacts.require("AdEthNFT");

contract("AdEthNFT", (accounts) => {
  let dai;
  let AdEthNFTInstance;
  let [adEthFactoryAddress, newOwner, caller, visitor] = accounts;

  before(async () => {
    AdEthNFTInstance = await AdEthNFT.deployed(newOwner, caller, "uri", 10);
  });

  describe("get owner", async () => {
    it("can fetch the owner of the contract", async () => {
      const currentOwner = await AdEthNFTInstance.owner.call();
      assert.equal(currentOwner, newOwner, "Current owner should be equal to the new owner");
    });
  });

  // describe("transfer ownership", async () => {
  //   it("can transfer the ownership of the contract", async () => {
  //     await irrigate.transferOwnership(newOwner, { from: originalOwner });
   
  //     const owner = await irrigate.owner();
  //     assert.equal(owner, newOwner, "The owner should be equal to newOwner");
  //   });
    
  //   it("should reverts transferOwnership when sender is not authorized", async () => {
  //     await expectRevert(irrigate.transferOwnership(originalOwner, { from: originalOwner }), "Ownable: caller is not the owner");
  //   });
  // });
});