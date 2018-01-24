pragma solidity ^0.4.15;
//pragma solidity experimental ABIEncoderV2;

//import 'zeppelin-solidity/contracts/math/SafeMath.sol';
//import "zeppelin-solidity/contracts/ownership/Ownable.sol";

library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner public {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

/**
 * @title True Pick-Five Lottery System
 */
contract UltimatePickFive is Ownable {
  using SafeMath for uint256;

  string private contractName = "Ultimate PickFive";

  // Private vars
  uint256 private releasePauseDuration;// = 600; // 600
  uint256 private housePay;// = 10 * 10**16; // 10% to the house
  uint256 private seedPay;//  = 10 * 10**16; // 10% to the house
  uint256 private oldPayout;// = 7776000;

  // Public vars
  uint256 private ticketPrice;
  uint256 private roundNumber;
  uint256 private ticketStartTime;
  uint256 private ticketDuration;
  uint256 private ticketEndTime;
  uint256 private releasePauseStartTime;
  uint256 private releasePauseEndTime;
  uint256 private totalTickets;
  uint256 private outstandingPayouts;
  bool    private halted = false;

  uint256 private maxNumber;
  bool private started;

  enum RunStates { Loaded, WaitingToStart, Running, WaitingToRelease, Released, Won, Restarting, Stopped }
  RunStates private runState = RunStates.Loaded;

  // List of purchased numbers and which addresses purchased them.
  // Key is the ticket number & round number as sha3
  struct ticketNumberPurchases{ bool exists; uint256 roundNumber; address[] players; }
  mapping(bytes32 => ticketNumberPurchases) private ticketNumbers;

  // list of bets, for info only to players
  struct ticket{ uint256 date; uint256[] numbers; }
  struct ticketAddressPurchases{ bool exists; uint256 roundNumber; ticket[] tickets; }
  mapping(bytes32 => ticketAddressPurchases) private ticketPlayers;

  // payout object
  struct payout{ uint256 date; uint256 amount; }
  // List of payout per address, just in case
  // a game has a small number set and one person
  // wins many rounds, but doesn't claim then right away.
  struct winnerPayouts{ bool exists; payout[] payouts; }
  mapping(address => winnerPayouts) private winnerAccounts;
  address[] winnerAddresses;

  // events
  event LogRunStateChanged(RunStates indexed CurrentState, string Description); // Event
  //event LogTicketPurchased(address indexed Buyer, uint256 Number1, uint256 Number2, uint256 Number3, uint256 Number4, uint256 Number5); // Event
  event LogTicketPurchased(address indexed Buyer, string Numbers); // Event
  event LogPayout(address indexed Winner, string Title, uint256 Amount); // Event
  event LogNewRound(string Note); // Event
  //event LogRelease(uint256 Round, uint256 Number1, uint256 Number2, uint256 Number3, uint256 Number4, uint256 Number5); // Event
  event LogRelease(uint256 Round, string Numbers); // Event
  event LogWon(uint256 Round, string Message); // Event

  ///////////////////////////////////////////////////////////////////
  //     Construct the Lottory
  ///////////////////////////////////////////////////////////////////
  function UltimatePickFive()
  {
    owner = msg.sender;
    setState(RunStates.WaitingToStart);
  }

  ///////////////////////////////////////////////////////////////////
  //     Get balance
  ///////////////////////////////////////////////////////////////////
  function getEstimatedJackpotSize() private constant returns (uint256 potSize){

    // net ether after
    uint256 netEther = this.balance.sub(outstandingPayouts);

    // payout to owner
    uint256 houseVal = netEther.mul(housePay).div(1 ether);

    // retention to seed next round
    uint256 seedVal = netEther.mul(seedPay).div(1 ether);

    // total pot
    uint256 potVal = netEther.sub(houseVal).sub(seedVal);

    return potVal;
  }

  // ///////////////////////////////////////////////////////////////////
  // //     Get current state detail
  // ///////////////////////////////////////////////////////////////////
  function CurrentState() public constant returns ( string  runStateDescription,
                                                    uint256 estimatedPotSizeInWei,
                                                    uint256 ticketPriceInWei,
                                                    uint256 currentRoundNumber,
                                                    uint256 ticketsSoldThisRound,
                                                    uint256 tickSalesStartTimeInUtc,
                                                    uint256 tickSalesEndTimeInUtc,//){//,
                                                    //string  encryptedWinningNumbers,
                                                    //string  decryptionKeyForNumbers,
                                                    //string  winningNumbers,
                                                    uint256 unclaimedPayouts){//],
                                                    //bool    EmergencyStopped){

    return (getStateDesc(),
            getEstimatedJackpotSize(),
            ticketPrice,
            roundNumber,
            totalTickets,
            ticketStartTime,
            ticketEndTime,//);//,
            //winningNumber_Hidden,
            //decryptionKey,
            //winningNumber_Open,
            outstandingPayouts);//,
            //halted);
  }

  function Instructions() public constant returns ( string Name,
                                                    string HowItWorks,
                                                    string HowToPlay,
                                                    string ReleasingNumbers,
                                                    string Winning,
                                                    string Notice){

    return (contractName,
            "This is a pick-five number guessing game. Players are allowed to submit guesses while the game is running. When the timelimit has been reached, the game waits approx. 1 hr to release the winning numbers. If there are no winners then the game restarts and the pot rolls into the new game.  If there is a winner, the pot is placed into a payout account for that player.  If there are multiple winners then the pot is split evenly. The pot is always 80% of the total contract value because some Ether is retained to seed future rounds and for contract fees."
            "You must call the function [Deposit Number] to enter the game. Your deposit must exactly match the ticket price.  Valid numbers are 1 to 32 inclusively (wrong = 05-10-25-30-36, 36 is too big).  You may enter numbers in any order, but they will be automatically will be reordered to ascending order.",
            "Anyone may call the [Release Numbers] function to release winning numbers as long as the pause period has expired (approx. 1 hr).  The game will automatically restart.",
            "If you win a round, your portion of the pot is placed in a payouts account.  You MUST call the function [Get Your Payout] to have the Ether transferred to your account. Winnings not claimed in 30 days will be reclaimed for future games.",
            "This game is for entertainment purposes only.  If you lose Ether in the game, by typing numbers incorrectly or for any other reason, nobody can help you.  The contract is automated and the internal workings of the contract cannot be altered after it is launched. Once started, it is not possible to modify the game functions or your ticket entries, even for the contract owner.");
  }

  ///////////////////////////////////////////////////////////////////
  //     Get current State
  ///////////////////////////////////////////////////////////////////
  function getStateDesc() internal constant returns (string){

    if (halted) return "Emergency Halted";

    if(runState == RunStates.Loaded)
    {
      return "Contract Loaded";

    } else if (runState == RunStates.WaitingToStart)
    {
      return "Waiting to start";

    } else if (runState == RunStates.Running)
    {
      if (ticketEndTime < now){
        if (releasePauseEndTime < now){
          return "Please call [Release Numbers]! Pause is over!  ";
        }else{
          return "Game is closed, pausing 1 hr for number release.";
        }
      }else{
        return "Game is open to deposits.";
      }
    } else if (runState == RunStates.WaitingToRelease)
    {
      if (releasePauseEndTime < now){
        return "Ready for release. Please call [Release Numbers] !!  ";
      }else{
        return "Game is closed, pausing 1 hr for number release.";
      }
    } else if (runState == RunStates.Released)
    {
      return "Numbers and key released";

    } else if (runState == RunStates.Won)
    {
      return "Game was won!  yay!";

    } else if (runState == RunStates.Stopped)
    {
      return "Game has stopped";

    } else if (runState == RunStates.Restarting)
    {
      return "Restarting";
    } // end case if
  }

  ///////////////////////////////////////////////////////////////////
  //     Set the current state
  ///////////////////////////////////////////////////////////////////
  function setState(RunStates _state) internal {

    // base off the current state
    if(runState == RunStates.Loaded)
    {
      // You can only go to "WaitingToStart" from here...
      // We only include waiting so contructor will emit an event
      if (_state == RunStates.WaitingToStart)
      {
        // assign state
        runState = _state;

        // emit event
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(_state == RunStates.WaitingToStart);  // throw error
      }

    } else if (runState == RunStates.WaitingToStart)
    {
      // You can only go to "Running" from here...
      if(_state == RunStates.Running)
      {
        // record the start time
        ticketStartTime = now;

        // select end time
        ticketEndTime = ticketStartTime.add(ticketDuration);

        // record the pause start time
        releasePauseStartTime = ticketEndTime;

        // select end time
        releasePauseEndTime = releasePauseStartTime.add(releasePauseDuration);

        // assign state
        runState = _state;

        // emit event
        //LogRunStateChanged(runState, getStateDesc());

      }else{
        assert(_state == RunStates.Running);  // throw error
      }
    } else if (runState == RunStates.Running)
    {
      // you can only go to "WaitingToRelease" from here
      if(_state == RunStates.WaitingToRelease)
      {
        // assign state
        runState = _state;

        // emit event
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(_state == RunStates.WaitingToRelease);  // throw error
      }

    } else if (runState == RunStates.WaitingToRelease)
    {
      // you can only go to "Released" from here
      if(_state == RunStates.Released)
      {
        runState = _state;
        //LogRelease(winningNumber_Open, decryptionKey, winningNumber_Hidden);
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(_state == RunStates.Released);  // throw error
      }
    } else if (runState == RunStates.Released)
    {
      // you can only go to "Won" or "Restarting" from here
      if(_state == RunStates.Won || _state == RunStates.Restarting)
      {
        runState = _state;
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(false);  // throw error
      }
    } else if (runState == RunStates.Won)
    {
        //LogWon("The game has been won!");

      // you can only go to "Restarting" from here
      if(_state == RunStates.Restarting)
      {
        runState = _state;
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(false);  // throw error
      }

    } else if (runState == RunStates.Stopped)
    {
        // If its already stopped there is nowhere to go anymore
        // do nothing
    } else if (runState == RunStates.Restarting)
    {
      // Nobody won this round, so we can set to restart
      // you can only go to "WaitingToStart" from here
      if(_state == RunStates.WaitingToStart)
      {
        //LogNewRound("Starting a new round!");
        runState = _state;
        //LogRunStateChanged(runState, getStateDesc());
      }else{
        assert(_state == RunStates.WaitingToStart);  // throw error
      }
    }else{
      assert(false);
    } // end case if
  }

  ///////////////////////////////////////////////////////////////////
  //     Show Numbers
  ///////////////////////////////////////////////////////////////////
  function yourNumbers() constant returns(string NumbersYouDepositedOn){
    return checkNumbersForAddress(msg.sender);
  }

  function checkNumbersForAddress(address account) constant returns(string NumbersDepositedOn){

    bytes32 playerString = sha3(account, roundNumber);

    //NumbersDepositedOn = strConcat(toString(ticketPlayers[playerString].tickets[0].numbers), ", ", "", "", "");
    NumbersDepositedOn = toString(ticketPlayers[playerString].tickets[0].numbers);

    for(uint256 i = 1; i < ticketPlayers[playerString].tickets.length; i++){

      //ticket memory t = ticketPlayers[playerString].tickets[i];
      //uint256[] memory n = t.numbers;
      //string memory s = toString(ticketPlayers[playerString].tickets[i].numbers);

      NumbersDepositedOn = strConcat(NumbersDepositedOn, ", ", toString(ticketPlayers[playerString].tickets[i].numbers), "", "");
    }
  }

  ///////////////////////////////////////////////////////////////////
  //     Check stats on a specific number
  ///////////////////////////////////////////////////////////////////
  function checkStatsForNumber(uint256 number1, uint256 number2, uint256 number3, uint256 number4, uint256 number5) constant returns(uint256 HowManyPeopleDepositedOnThisNumber, uint256 HowManyTimesDidYouDepositOnThisNumber){

    uint256[] memory numbers = new uint256[](5);
    numbers[0] = number1;
    numbers[1] = number2;
    numbers[2] = number3;
    numbers[3] = number4;
    numbers[4] = number5;

    sort(numbers);

    uint256 yourBets = 0;
    uint256 totalBets = 0;
    //string memory numberString = strConcat(numberToCheck, "^", uintToString(roundNumber));
    bytes32 numberString =  sha3(numbers, roundNumber);

      totalBets = ticketNumbers[numberString].players.length;

      for(uint256 i = 0; i < ticketNumbers[numberString].players.length; i++){
        if (ticketNumbers[numberString].players[i] == msg.sender) yourBets++;
      }

    return (totalBets, yourBets);
  }

  ///////////////////////////////////////////////////////////////////
  //     Show your payouts
  ///////////////////////////////////////////////////////////////////
  function yourPayouts() constant returns(uint256 wins, uint256 total){
    return checkPayoutsForAddress(msg.sender);
  }

  ///////////////////////////////////////////////////////////////////
  //     Check payouts for another address
  ///////////////////////////////////////////////////////////////////
  function checkPayoutsForAddress(address account) constant returns(uint256 wins, uint256 total){

    // winning counts for user
    uint256 accountCount = winnerAccounts[account].payouts.length;

    // Add them up
    if (accountCount > 0){

      uint256 wincount = 0;
      uint256 totalval = 0;

      for (uint256 i = 0; i < accountCount; i++) {
        wincount++;
        totalval += winnerAccounts[account].payouts[i].amount;
      }
      return (wincount,totalval);
    }else{
      return (0,0);
    }
  }

  ///////////////////////////////////////////////////////////////////
  //     Start the Lottory
  ///////////////////////////////////////////////////////////////////
  function startGame(string _name, uint256 _ticketPrice, uint256 _numberMax, uint256 _duration, uint256 _pauseDuration) onlyOwner{
    // check inputs
    require(_ticketPrice > 0);
    require(_numberMax  > 0 && _numberMax < 33);
    require(_duration >= 0);
    require(_pauseDuration >= 0);
    require(bytes(_name).length > 0);

    // conditions
    require(runState == RunStates.WaitingToStart);
    require(started == false);

    contractName = _name;
    started = true;
    ticketPrice = _ticketPrice;
    //releasePauseDuration = 600; // 600
    housePay = 10 * 10**16; // 10% to the house//function startGame(uint256 _duration, uint256 _pauseDuration, string _hiddenNumbers) onlyOwner{
    seedPay  = 10 * 10**16; // 10% to the house
    //uint256 private constant oldPayout = 7776000;
    oldPayout = 2629822;
    maxNumber = _numberMax;//function startGame(uint256 _duration, uint256 _pauseDuration, string _hiddenNumbers) onlyOwner{
    totalTickets = 0;
    ticketDuration = _duration;
    releasePauseDuration = _pauseDuration;
    roundNumber++;

    // set the state to running
    setState(RunStates.Running);
  }

  ///////////////////////////////////////////////////////////////////
  //     Halt the Lottory
  ///////////////////////////////////////////////////////////////////
  function haltGame() onlyOwner{
    halted = true;
  }

  ///////////////////////////////////////////////////////////////////
  //     Un-halt the Lottory
  ///////////////////////////////////////////////////////////////////
  function unhaltGame() onlyOwner{
    halted = false;
  }

  ///////////////////////////////////////////////////////////////////
  //     Forward balance to new lotto address
  ///////////////////////////////////////////////////////////////////
  function pushToNewGame(address newAddress) onlyOwner{
    newAddress.transfer(this.balance);
  }

  ///////////////////////////////////////////////////////////////////
  //     Buy a ticket
  ///////////////////////////////////////////////////////////////////
  function depositNumber (uint256 _firstNumber, uint256 _SecondNumber, uint256 _thirdNumber, uint256 _fourthNumber, uint256 _fifthNumber) payable {
    require(!halted);
    require(runState == RunStates.Running);
    require(ticketEndTime > now);
    require(msg.value == ticketPrice);
    //require(bytes(_numbers).length == 14);
    require(_firstNumber > 0 && _firstNumber <= maxNumber);
    require(_SecondNumber > 0 && _SecondNumber <= maxNumber);
    require(_thirdNumber > 0 && _thirdNumber <= maxNumber);
    require(_fourthNumber > 0 && _fourthNumber <= maxNumber);
    require(_fifthNumber > 0 && _fifthNumber <= maxNumber);

    uint256[] memory numbers = new uint256[](5);
    numbers[0] = _firstNumber;
    numbers[1] = _SecondNumber;
    numbers[2] = _thirdNumber;
    numbers[3] = _fourthNumber;
    numbers[4] = _fifthNumber;
    //numbers

    sort(numbers);

    bytes32 numberString = sha3(numbers, roundNumber);
    bytes32 playerString = sha3(msg.sender, roundNumber);

    ticketNumbers[numberString].exists = true;
    ticketNumbers[numberString].players.push(msg.sender);

    ticket memory newTicket;
    newTicket.date = now;
    newTicket.numbers = numbers;

    ticketPlayers[playerString].exists = true;
    ticketPlayers[playerString].tickets.push(newTicket);
    //ticketPlayers[playerString].numbers = numbers;

    totalTickets++;
    //LogTicketPurchased(msg.sender, numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]);
    LogTicketPurchased(msg.sender, toString(numbers));
    //LogTicketPurchased(msg.sender, numbers, totalTickets);

  }

  ///////////////////////////////////////////////////////////////////
  //     Cleanup  old deposits
  ///////////////////////////////////////////////////////////////////
  function CleanOldWinnerData() onlyOwner{

    uint256 amountOut = 0;

    for (uint256 k = 0; k < winnerAddresses.length; k++) {

      address account = winnerAddresses[k];
      // winning counts for user
      uint256 payoutCount = winnerAccounts[account].payouts.length;
      uint256 leftOver = 0;

      for (uint256 j = 0; j < payoutCount; j++) {

        if(winnerAccounts[account].payouts[j].date + oldPayout < now){

          amountOut += winnerAccounts[account].payouts[j].amount;
          winnerAccounts[account].payouts[j].amount = 0;
        }else{
          leftOver += winnerAccounts[account].payouts[j].amount;
        }
      }

      if (leftOver == 0 && payoutCount > 0){
        delete winnerAccounts[account].payouts;
        //winnerAccounts[account].payouts.length = 0;
      }
    }

    if (amountOut > 0)
    {
      outstandingPayouts -= amountOut;
      owner.transfer(amountOut);
    }
  }

  /*function XOR(uint256 n1, uint256 n2) constant internal returns(uint256 result){
      assembly{
        result := xor(n1, n2)
      }
  }*/

  function makeOneNumber(uint256 blockNumber) constant internal returns(uint256){

    bytes32 b = sha3(block.blockhash(blockNumber),
                     block.blockhash(blockNumber-1),
                     block.blockhash(blockNumber-2),
                     block.blockhash(blockNumber-3),
                     block.blockhash(blockNumber-4),
                     block.blockhash(blockNumber-5),
                     block.blockhash(blockNumber-6),
                     block.blockhash(blockNumber-7),
                     block.blockhash(blockNumber-8),
                     block.blockhash(blockNumber-9),
                     now
                     );

    //return uint256(sha3(z1, z2));
    return uint256(b);

  }

  function makeNumbers() constant internal returns (uint256[]){

    uint256[] memory numbers = new uint256[](5);
    uint256 position = 0;
    uint256 num = 0;

    // start skip at 1
    uint256 skip = 1;

    // loop until all positions are filled
    while(position < 5){

      // try offset if to high
      if (skip > 200) skip = 2;

      // make a number
      num = makeOneNumber(block.number-skip);

      // only use it if its not zero
      if (num != 0)
      {
        // convert to our number scale
        num = num%maxNumber + 1;

        // check if it exists
        bool exists = false;
        for(uint256 i = 0; i < 5; i++){
            if(numbers[i] == num){
              exists = true;
            }
        }

        // use it if it does not exists already
        if(!exists){
          numbers[position] = num;
          position++;
        }
      }
      // skip blocks behind
      skip += 10;
    }

    // sort our numbers and return
    sort(numbers);
    return numbers;
  }

  ///////////////////////////////////////////////////////////////////
  //     Release the numbers and pay winners or roll over
  ///////////////////////////////////////////////////////////////////
  function releaseNumbers() {
    require(now > releasePauseEndTime);
    setState(RunStates.WaitingToRelease);

    uint256[] memory numbers = makeNumbers();
    //LogRelease(roundNumber, numbers[0], numbers[1], numbers[2], numbers[3], numbers[4]);
    LogRelease(roundNumber, toString(numbers));
    bytes32 numberString = sha3(numbers, roundNumber);

    // find the winners
    setState(RunStates.Released);

    // does the number exist in the list at all?
    if (ticketNumbers[numberString].exists)// && ticketNumbers[_winningNumbers].roundNumber == roundNumber)
    {
      // WE HAVE AT LEAST ONE WINNER!!!
      uint256 winnercount = ticketNumbers[numberString].players.length;

      uint256 netEther = this.balance.sub(outstandingPayouts);

      // payout to owner
      uint256 houseVal = netEther.mul(housePay).div(1 ether);

      // salary to the owner
      owner.transfer(houseVal);

      // retention to seed next round
      uint256 seedVal = netEther.mul(seedPay).div(1 ether);

      // total pot
      uint256 potVal = netEther.sub(houseVal).sub(seedVal);

      // value to each player
      uint256 playerVal = potVal.div(winnercount);

      // yay!, add the players to winning accounts
      for (uint256 i = 0; i < winnercount; i++) {

        payout memory p;
        p.date = now;
        p.amount = playerVal;
        winnerAccounts[ticketNumbers[numberString].players[i]].payouts.push(p);
        outstandingPayouts += playerVal;
        winnerAddresses.push(ticketNumbers[numberString].players[i]);
        //LogWon(ticketNumbers[numberString].players[i], playerVal);
       }

       LogWon(roundNumber, "This round was won, check your payouts!");
      //setState(RunStates.Won);
    }

    roundNumber++;
    totalTickets = 0;

    setState(RunStates.Restarting);
    setState(RunStates.WaitingToStart);
    setState(RunStates.Running);
  }

  ///////////////////////////////////////////////////////////////////
  //     Get payout for caller
  ///////////////////////////////////////////////////////////////////
  function getYourPayout(){
    return getSinglePayoutForAddress(msg.sender);
  }

  ///////////////////////////////////////////////////////////////////
  //     Get payout for specific address
  ///////////////////////////////////////////////////////////////////
  function getSinglePayoutForAddress(address account){
    require(!halted);
    require(winnerAccounts[account].payouts.length > 0);

    // winning counts for user
    uint256 accountCount = winnerAccounts[account].payouts.length;

    // amount of the last win
    uint256 amountOut = 0;//winnerAccounts[msg.sender].payouts[accountCount-1].amount;

    for (uint256 i = 0; i < accountCount; i++) {
      amountOut += winnerAccounts[account].payouts[i].amount;
    }

    // delete the record
    delete winnerAccounts[account].payouts;

    if (amountOut > 0){
      outstandingPayouts -= amountOut;
      account.transfer(amountOut);
      LogPayout(account, "Win", amountOut);
    }
  }

  function toString(uint256[] data) constant internal returns (string Numbers){

    uint n = data.length;
    uint i;

    Numbers = digitToString(data[0]);
    for(i=1; i<n; i++) {
      Numbers = strConcat(Numbers, "-", digitToString(data[i]), "", "");
    }
  }

  function digitToString(uint256 digit)constant internal returns (string Number){

    if (digit < 1 || digit > 32){Number = "00";}
    if (digit == 1){Number = "01";}
    if (digit == 2){Number = "02";}
    if (digit == 3){Number = "03";}
    if (digit == 4){Number = "04";}
    if (digit == 5){Number = "05";}
    if (digit == 6){Number = "06";}
    if (digit == 7){Number = "07";}
    if (digit == 8){Number = "08";}
    if (digit == 9){Number = "09";}
    if (digit == 10){Number = "10";}
    if (digit == 11){Number = "11";}
    if (digit == 12){Number = "12";}
    if (digit == 13){Number = "13";}
    if (digit == 14){Number = "14";}
    if (digit == 15){Number = "15";}
    if (digit == 16){Number = "16";}
    if (digit == 17){Number = "17";}
    if (digit == 18){Number = "18";}
    if (digit == 19){Number = "19";}
    if (digit == 20){Number = "20";}
    if (digit == 21){Number = "21";}
    if (digit == 22){Number = "22";}
    if (digit == 23){Number = "23";}
    if (digit == 24){Number = "24";}
    if (digit == 25){Number = "25";}
    if (digit == 26){Number = "26";}
    if (digit == 27){Number = "27";}
    if (digit == 28){Number = "28";}
    if (digit == 29){Number = "29";}
    if (digit == 30){Number = "30";}
    if (digit == 31){Number = "31";}
    if (digit == 32){Number = "32";}

  }

  function sort(uint256[] data) constant internal{

    uint n = data.length;
    uint[] memory arr = new uint[](n);
    uint i;

    for(i=0; i<n; i++) {
      arr[i] = data[i];
    }

    uint[] memory stack = new uint[](n+2);

    //Push initial lower and higher bound
    uint top = 1;
    stack[top] = 0;
    top = top + 1;
    stack[top] = n-1;

    //Keep popping from stack while is not empty
    while (top > 0) {

      uint h = stack[top];
      top = top - 1;
      uint l = stack[top];
      top = top - 1;

      i = l;
      uint x = arr[h];

      for(uint j=l; j<h; j++){
        if  (arr[j] <= x) {
          //Move smaller element
          (arr[i], arr[j]) = (arr[j],arr[i]);
          i = i + 1;
        }
      }
      (arr[i], arr[h]) = (arr[h],arr[i]);
      uint p = i;

      //Push left side to stack
      if (p > l + 1) {
        top = top + 1;
        stack[top] = l;
        top = top + 1;
        stack[top] = p - 1;
      }

      //Push right side to stack
      if (p+1 < h) {
        top = top + 1;
        stack[top] = p + 1;
        top = top + 1;
        stack[top] = h;
      }
    }

    for(i=0; i<n; i++) {
      data[i] = arr[i];
    }
  }

  function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string) {
      bytes memory _ba = bytes(_a);
      bytes memory _bb = bytes(_b);
      bytes memory _bc = bytes(_c);
      bytes memory _bd = bytes(_d);
      bytes memory _be = bytes(_e);
      string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
      bytes memory babcde = bytes(abcde);
      uint k = 0;
      for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
      for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
      for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
      for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
      for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
      return string(babcde);
    }

}
