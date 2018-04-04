pragma solidity ^0.4.19; 

contract Lottery {
    
    /*  Constants   */
    uint constant fullTicketPrice = 8 finney ;
    uint constant halfTicketPrice = 4 finney ;
    uint constant quarterTicketPrice = 2 finney ;
    
    /*
    Number of random to be submitted when buying a new ticket.
    If callers submit less or more the call will be reverted.
    */
    uint constant numberOfRandoms = 3;
    /*
    Number of blocks until the round ends.
    There are two rounds, submission and reveal.
    */
    uint constant roundPeriod = 4;
    /* 
    Second winner will get 1/secondWinnerCof of the relative price.
    */
    uint constant secondWinnerCof = 2;
    
    /* 
    Third winner will get 1/thirdWinnerCof of the relative price.
    */
    uint constant thirdWinnerCof = 4;
    
    
    uint collected_money;
    
    /* 
    When buying a ticket, users submit keccak256(N,address) to the conract.
    These hashes are stored in this mapping so that they can later be verified 
    during the reveal process.
    More precisely during the reveal process callers will submit 'numberOfRandoms'
    random numbers that were submitted when buying a ticket. The hash will be
    verified in the contract.
    */
    mapping(address=>bytes32[]) hashes;
    
    /* 
    Users prizes will be stored in this mapping so that they can withdraw their 
    winnings any time they want to.
    */
    mapping(address=>uint) profits;
    
    /*
    participants is the array of all buyers in the current lottery. Note that 
    the same address can buy more than one ticket, they will all be added to this
    array.
    */
    buyer[] participants;
    
    /*
    isSubmissionTime is used to check if it is submission or reveal time.
    */
    bool isSubmissionTime; 
    
    /*
    roundStartBlockNumber is used to determine if it is time to switch between 
    submission and reveal periods.
    */
    uint roundStartBlockNumber;
    
    int firstHash; // firstHash is the hash used to determine the first winner
    int secondHash; // secondHash is the hash used to determine the second winner
    int thirdHash; // thirdHash is the hash used to determine the third winner
    
    function Lottery () public {
        isSubmissionTime = true; // We start with the submission period.
        roundStartBlockNumber = block.number; // Let the current block be the startBlock.
    }
    
    struct buyer {
        address buyersAddress;
        uint8 ticketCoeffecient; // 2 -> Full 4 -> Half 8-> Quarter
    }
    
    modifier noEthSent(){
        if (msg.value>0) {
            revert();
        }
        _;
    }
    
    modifier canSubmit(){
        if (!isSubmissionTime) revert();
        _;
    }
    modifier canReveal(){
        if (isSubmissionTime) revert();
        _;
    }
    
    modifier FullTicket() {
        if (msg.value < fullTicketPrice) {
            revert();
        }
        _;
    }
    
    modifier HalfTicket() {
        if (msg.value < halfTicketPrice) {
            revert();
        }
        _;
    }
    
    modifier QuarterTicket() {
        if (msg.value < quarterTicketPrice) {
            revert();
        }
        _;
    }
    
    // withdraw lets winners withdraw their winnings.
    // This method first subtracts the amount to be withdrawn from the account
    // so that DOA (recursive calls) are not dangerous for the contract. After 
    // subtracting the relevant amount the send call is executed. Note that if 
    // caller tries to withdraw more than his winnings it will be reverted.
    function withdraw(uint amount) public {
        if (profits[msg.sender] <= 0) revert();
        if (profits[msg.sender] >= amount) {
            profits[msg.sender] -= amount;
            if (!msg.sender.send(amount)) revert();
        }
    }
    
    function sendTheRemainingMoney(uint ticketPrice) private {
        if (msg.value > ticketPrice) {
            if (!msg.sender.send(msg.value-ticketPrice))  revert();
        }
    }    

    function checkHashes(bytes32[] expectedHashes,bytes32[] givenHashes) private pure returns(bool){
        for(uint i = 0; i< givenHashes.length ; i++){
            bool found = false;
            for(uint k = 0 ; k < expectedHashes.length;k++){
                if (givenHashes[i]==expectedHashes[k]){
                    found =true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }
    
    function isEndOfReveal() private view returns(bool){
        return block.number >= roundStartBlockNumber + roundPeriod;
    }
    
    function isEndOfSubmission() private view returns (bool){
        return block.number >= roundStartBlockNumber + roundPeriod;
    }
    
    function updateRandomHashes(int[] numbers) private {
        firstHash ^= numbers[0];
        secondHash ^= numbers[1];
        thirdHash ^= numbers[2];
    }
    
    function findWinnersAndGivePrizes() private{
        uint numberOfParticipants = participants.length;
        
        // Take the mod with the numberOfParticipants so that it is guaranteed
        // that there will be a winner.
        // TODO:: make sure winners are different indexes.
        uint firstWinnerIndex = uint(firstHash)%numberOfParticipants;
        uint secondWinnerIndex = uint(secondHash)%numberOfParticipants;
        uint thirdWinnerIndex = uint(thirdHash)%numberOfParticipants;
         
        // Calculate the prizes based on the position and ticket type.
        uint firstPrize = collected_money/participants[firstWinnerIndex].ticketCoeffecient; 
        uint secondPrize = collected_money/participants[secondWinnerIndex].ticketCoeffecient/secondWinnerCof;
        uint thirdPrize = collected_money/participants[thirdWinnerIndex].ticketCoeffecient/thirdWinnerCof;
        
        // Store the profits so that later on winners can withdraw them.
        profits[participants[firstWinnerIndex].buyersAddress] += firstPrize;
        profits[participants[secondWinnerIndex].buyersAddress] += secondPrize ;
        profits[participants[thirdWinnerIndex].buyersAddress] += thirdPrize ;
        // Update the collected_money.
        collected_money -= firstPrize + secondPrize + thirdPrize;
        // Delete the participants for the next round.
        delete participants;
         
    }
    
    function reveal(int[] numbers) public canReveal noEthSent {
        // Check if numbers are exactly 'numberOfRandoms'. Otherwise revert.
        if (!hasExactlyXElementsIntArray(numberOfRandoms,numbers)) revert();
        bytes32[] memory givenHashes = new bytes32[](numberOfRandoms);
        // Calculate the hashes with the given number and the senders address
        for (uint i = 0 ; i < numbers.length;i++){
            givenHashes[i]=(keccak256(numbers[i],msg.sender));
        }
        // Check if the submission and reveal hashes are matched. Otherwise revert.
        if (!checkHashes(hashes[msg.sender],givenHashes)) revert();
        // Update the hashes to determine the winners.
        updateRandomHashes(numbers);
        // Check if it is time to find winners. If so switch to the submission period.
        if (isEndOfReveal()){
            isSubmissionTime = true;
            // Give the prizes.
            findWinnersAndGivePrizes();
            roundStartBlockNumber = block.number + 1;
        }
        
    }
    function hasExactlyXElements(uint x,bytes32[] hashArray) private pure returns(bool){
        return hashArray.length == x;
    }
    
    function hasExactlyXElementsIntArray(uint x,int[] intArray) private pure returns(bool){
        return intArray.length == x;
    }
    function buyFullTicket(bytes32[] hashArray) public FullTicket canSubmit payable returns (bool bought){
        buyTicket(fullTicketPrice,hashArray,2);
        return true;
    }
    
    function buyHalfTicket(bytes32[] hashArray) public HalfTicket canSubmit payable returns (bool bought){
        buyTicket(halfTicketPrice,hashArray,4);
        return true;
    }
    
    function buyQuarterTicket(bytes32[] hashArray) public QuarterTicket canSubmit payable returns (bool bought){
        buyTicket(quarterTicketPrice,hashArray,8);
        return true;
    }
    
    function buyTicket(uint ticketPrice,bytes32[] hashArray,uint8 ticketCoefficient) private {
        // Check if there are exactly 'numberOfRandoms' hashes. Otherwise revert.
        if (!hasExactlyXElements(numberOfRandoms,hashArray)) revert();
        // Record the hashes of the sender to verify later
        // TODO:: same address multiple tickets
        hashes[msg.sender] = hashArray;
        // Add the caller to the participants
        participants.push(buyer(msg.sender, ticketCoefficient));
        collected_money += ticketPrice;
        // Send the excessive amount
        sendTheRemainingMoney(ticketPrice);
        // Check if it is time to switch to the reveal period
        if (isEndOfSubmission()) {
            isSubmissionTime = false;
            roundStartBlockNumber = block.number + 1;
        }
    }

    function getCollectedMoney() public view returns(uint){
        return collected_money;
    }
    
    function getBlockNumber() public view returns(uint){
        return block.number;
    }
    
    function getRound() public view returns(uint){
        return block.number;
    }
    function getHash(address x) public pure returns(bytes32){
        return keccak256(int(9),x);
    }
}
