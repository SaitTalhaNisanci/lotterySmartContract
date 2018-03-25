var lottery = artifacts.require("./lottery.sol");

contract('lottery', function(accounts) {
  it("should put 0 coin in the first account", function() {
    return lottery.deployed().then(function(instance) {
      return instance.getBalance.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "0 wasn't in the first account");
    });
  });
});