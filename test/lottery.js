var lottery = artifacts.require("./lottery.sol");
var keccak256 = require('js-sha3').keccak256;


contract('lottery', function(accounts) {
  it("should buy a ticket", function() {
    return lottery.deployed().then(function(instance) {
      console.log(accounts);
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket.sendTransaction([hash,hash,hash]);
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });

  });
});
