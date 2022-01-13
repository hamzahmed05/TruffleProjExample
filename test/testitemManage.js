const itemManager = artifacts.require("./itemManager.sol");

contract("itemManager test", accounts => {
    it("...should be able to add an item", async function(){
        const itemManagerInstance = await itemManager.deployed();
        const itemName = "test1";
        const itemPrice = 500;

        const result = await itemManagerInstance.createItem(itemName, itemPrice, {from: accounts[0]});
        assert.equal(result.logs[0].args._itemIndex, 0, "it's not the first item");
        const item = await itemManagerInstance.items(0);

        assert.equal(item._identifier, itemName, "identifier was different");
    })
})