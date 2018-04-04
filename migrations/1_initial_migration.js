var Migrations = artifacts.require("./Migrations.sol");
var lottery = artifacts.require("./lottery.sol");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(lottery);
};
