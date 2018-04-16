var lottery = artifacts.require("./Lottery.sol");
var keccak256 = require('web3-utils').soliditySha3;
var should = require('should');

/**
 * 
 * Testing Ticket Buying Functions
 * 
 */
contract('Lottery', function(accounts) {
  const PERIOD = 20;

  it("should buy a full ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      meta = instance;
      hash  =  keccak256(9, accounts[0]);
      return meta.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(8,"finney")});
    }).then (function(tx){
      console.log(tx);
      assert.equal(tx.receipt.status,'0x01', "Error: should buy a full ticket with sufficient amount");
    });
  });

  it("should buy a full ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(tx){
      console.log(tx);
      assert.equal(tx.receipt.status,'0x01', "Error: should buy a full ticket with sufficient amount");
    });
  });

  it("should not buy a full ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyFullTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(7,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a full ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });

  it("should buy a half ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(4,"finney")});
    }).then(function(tx) {
      console.log(tx);
      assert.equal(tx.receipt.status,'0x01', "Error: should buy a full ticket with sufficient amount");
    });
  });

  it("should not buy a half ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(3,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a half ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });

  it("should buy a quarter ticket with sufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(2,"finney")});
    }).then(function(tx){
      console.log(tx);
      assert.equal(tx.receipt.status, '0x01', "Error: should buy a quarter ticket with sufficient amount");
    });
  });

  it("should not buy a quarter ticket with insufficient amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(1,"finney")});
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not buy a quarter ticket with insufficient amount")
      }else{
        assert.fail("This function should revert due to insufficient amount")
      }
    });
  });

  it("should buy a half ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyHalfTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(tx) {
      console.log(tx);
      assert.equal(tx.receipt.status,'0x01', "Error: should buy a half ticket with excessive amount")
    });
  });

  it("should buy a quarter ticket with excessive amount", function() {
    return lottery.deployed().then(function(instance) {
      hash  =  keccak256(9, accounts[0]);
      return instance.buyQuarterTicket([hash,hash,hash],{from: accounts[0],value:web3.toWei(20,"finney")});
    }).then(function(tx) {
      assert.equal(tx.receipt.status, '0x01', "Error: should buy a quarter ticket with excessive amount")
    });
  });

  it("should revert reveal attempt in submission time", function(){
    return lottery.deployed().then(function(instance){
      meta = instance;
      console.log("[DEBUG]: current block number " + web3.eth.blockNumber);
      number = 1;
      return meta.reveal([number, number, number]);
    }).then(assert.fail).catch(function(error){
      error_str = error.toString();
      if(error_str.indexOf("revert") != -1){
        console.log("Passed: should not reveal because it is not reveal time")
      }else{
        console.log(error)
        assert.fail("This function should revert due to not being in reveal time")
      }
    });
  });

  const mineOneBlock = async () => {
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [],
      id: 0,
    });
  };

  const mineNBlocks = async n => {
    for(let i=0; i<n ; i++){
      await mineOneBlock();
    }
  };

  /*it("should increase the block number", function(){
    return lottery.deployed().then(function(instance){
      meta = instance;
      mineNBlocks(PERIOD);
      return meta.getBlockNumber.call();
    }).then(function(blockNumber){
      console.log("[DEBUG]: block number = " + blockNumber.toNumber());
    });
  });*/

  it("should reveal the number passed before", function(){
    return lottery.deployed().then(function(instance){
      meta = instance;
      mineNBlocks(PERIOD);
      return meta.getBlockNumber.call();
    }).then(function(blockNumber){
      console.log("[DEBUG]: block number = " + blockNumber.toNumber());
      number = 9;
      return meta.reveal([number, number, number], {from: accounts[0], value:0});
    }).then(function(tx){
      console.log(tx);
    });
  });
});
