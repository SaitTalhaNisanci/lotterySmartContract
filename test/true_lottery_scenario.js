var lottery = artifacts.require("./Lottery.sol");
var keccak256 = require('web3-utils').soliditySha3;
var should = require('should');
var randomInt = require('random-int');

contract('Lottery', function(accounts){
  const PERIOD = 20;

  it("should submit tickets", async function(){
    let meta = await lottery.deployed();
    
    let initialBlockNumber = await meta.getInitialBlockNumber.call();
    let currBlockNumber = await meta.getBlockNumber.call();

    buyersAndRandomNumbers = [];
    numOfTicketsBought = PERIOD - (currBlockNumber.toNumber()-initialBlockNumber.toNumber());
    console.log("[DEBUG]: the number of tickets for first round = " + numOfTicketsBought);
    for(let i=0; i<PERIOD; i++){
      let buyer = randomInt(9);
      
      let number1 = randomInt(5, 15);
      let number2 = randomInt(20, 30);
      let number3 = randomInt(35, 45);

      let hash1 = keccak256(number1, accounts[buyer]);
      let hash2 = keccak256(number2, accounts[buyer]);
      let hash3 = keccak256(number3, accounts[buyer]);

      let hashArray = [hash1, hash2, hash3];
      let tx = await meta.buyFullTicket(hashArray, {from: accounts[buyer], value: web3.toWei(8, "finney")});
      assert.equal(tx.receipt.status, '0x01', "Error: something went wrong when " + accounts[buyer] + " buys ticket");
      buyersAndRandomNumbers.push([buyer, number1, number2, number3]);
    }

  });

  it("should the collected money be price times number of tickets at the end of submission period", async function(){
    let meta = await lottery.deployed();
    let collectedMoney = await meta.getCollectedMoney.call();
    console.log("[DEBUG]: collected money = " + collectedMoney.toNumber());
    assert.equal(collectedMoney.toNumber(), web3.toWei(numOfTicketsBought*8, "finney"), "Error: collected money should be price times number of tickets bought in the submission period");

  });

  it("should reveal all the tickets that buyers bought", async function(){
    let meta = await lottery.deployed();

    let currBlockNumber = await meta.getBlockNumber.call();
    console.log("[DEBUG]: block number = " + currBlockNumber.toNumber());

    let numberOfAccounts = accounts.length;
    for(let i=0; i<numberOfAccounts; i++){
      let profit = await meta.getProfit.call({from: accounts[i]});
      console.log("[DEBUG]: " + accounts[i] + ": " + profit.toNumber());
      assert.equal(profit.toNumber(), 0, "Error: profits should be 0 initially");
    }

    let numberOfTickets = buyersAndRandomNumbers.length;

    for(let i = 0; i<numberOfTickets; i++){
      let numbersArray = [buyersAndRandomNumbers[i][1], buyersAndRandomNumbers[i][2], buyersAndRandomNumbers[i][3]];
      let buyer = buyersAndRandomNumbers[i][0];
      let tx = await meta.reveal(numbersArray, {from: accounts[buyer]});
      assert.equal(tx.receipt.status, '0x01', "Error: something went wrong when " + accounts[buyersAndRandomNumbers[i][0]] + " reveals ticket");
    }

    currBlockNumber = await meta.getBlockNumber.call();
    console.log("[DEBUG]: block number = " + currBlockNumber.toNumber());

    let numWinners = 0;
    for(let i=0; i<numberOfAccounts; i++){
      let profit = await meta.getProfit.call({from: accounts[i]});
      console.log("[DEBUG]: " + accounts[i] + ": " + profit.toNumber());
      if(profit.toNumber() > 0) numWinners++;
    }
    assert.notEqual(numWinners, 0, "Error: There should be at least 1 winner");
  });
});
