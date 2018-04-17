var Lottery = artifacts.require("Lottery");

module.exports = function(deployer){
    deployer.deploy(Lottery, {gas: 3000000});
};