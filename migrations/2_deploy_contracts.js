var itemManager = artifacts.require("./itemManager.sol");

module.exports = function(deployer) {
  deployer.deploy(itemManager);
};
