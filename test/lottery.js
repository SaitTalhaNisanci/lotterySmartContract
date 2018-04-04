var lottery = artifacts.require("./lottery.sol");
var keccak256 = require('js-sha3').keccak256;
var should = require('should');

contract('lottery', function(accounts) {
  it("should buy a full ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(8,"finney")});
    }).then(function(result){
      assert.isTrue(result, "Error: should buy a full ticket with sufficient amount");
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a full ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result){
      assert.isTrue(result, "Error: should buy a full ticket with excessive amount");
    })
  });
});


contract('lottery', function(accounts) {
  it("should not buy a full ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(7,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a full ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a half ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(4,"finney")});
    }).then(function(result ) {
        assert.isTrue(result, "Error: should buy a half ticket with sufficient amount");
    });
  });
});


contract('lottery', function(accounts) {
  it("should not buy a half ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(3,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a half ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a quarter ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(2,"finney")});
    }).then(function(result ) {
      assert.isTrue(result, "Error: should buy a quarter ticket with sufficient amount");
    });
  });
});


contract('lottery', function(accounts) {
  it("should not buy a quarter ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(1,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a quarter ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });
});



contract('lottery', function(accounts) {
  it("should buy a half ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result ) {
      assert.isTrue(result, "Error: should buy a half ticket with excessive amount")
    });
  });
});


contract('lottery', function(accounts) {
  it("should buy a quarter ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket.call([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result) {
      assert.isTrue(result, "Error: should buy a quarter ticket with excessive amount")
    });
  });
});