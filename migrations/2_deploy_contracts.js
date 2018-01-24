var UltimatePickFive = artifacts.require("./UltimatePickFive.sol");

module.exports = function(deployer) {
  const startBlock = web3.eth.blockNumber + 2 // blockchain block number where the crowdsale will commence. Here I just taking the current block that the contract and setting that the crowdsale starts two block after
  //const endBlock = startBlock + 300  // blockchain block number where it will end. 300 is little over an hour.
  const wallet = web3.eth.accounts[0] // the address that will hold the fund. Recommended to use a multisig one for security.
  const duration = 3600;
  const ticketprice = 1000000000000000000;
  // 1000000000000000000 one ether in wei

  //deployer.deploy(PickFive, ticketprice);
  deployer.deploy(UltimatePickFive);
};
