var lottery = artifacts.require("./lottery.sol");
var keccak256 = require('js-sha3').keccak256;
var should = require('should');

contract('lottery', function(accounts) {
  it("should buy a full ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(8,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a full ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});


contract('lottery', function(accounts) {
  it("should not buy a full ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(7,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a half ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(4,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});


contract('lottery', function(accounts) {
  it("should not buy a half ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(3,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});

contract('lottery', function(accounts) {
  it("should buy a quarter ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(2,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});


contract('lottery', function(accounts) {
  it("should not buy a quarter ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(1,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});



contract('lottery', function(accounts) {
  it("should buy a half ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});


contract('lottery', function(accounts) {
  it("should buy a quarter ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(result ) {
        console.log(result);
    }).catch(function(e){
      console.log(e);
    });
  });
});