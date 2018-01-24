var MetaCoin = artifacts.require("./PickFive.sol");


contract('PickFive', function(accounts) {

    var numbers = "jYqFUHFwoZ2fxSqdsP++dwaQIPpmXXEMXoBqJ9Cn06Q=";

    var outputTicketCount = 0;

    var ticketprice = 1000000000000000000;

    var moment = require('moment');

    function waitForTimeStamp(waitForTimeStamp) {
        var currentTimeStamp = moment().utc().unix();
        var wait =  waitForTimeStamp - currentTimeStamp;
        wait = wait < 0 ? 0 : wait;
        console.log("    ... waiting ", wait, "seconds ...");

        return new Promise( resolve => {
                setTimeout(function () {
                    var blockTimeStamp = web3.eth.getBlock( web3.eth.blockNumber).timestamp;
                    if( blockTimeStamp < waitForTimeStamp ) {
                        web3.eth.sendTransaction({from: web3.eth.accounts[0]}, function(error, res) {
                            if (error) {
                                console.log("waitForTimeStamp() web3.eth.sendTransaction() error")
                                reject(error);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        resolve();
                    }
                }, wait * 1000);
        });

    } // waitForTimeStamp()

    it("should make numbers...", function() {
      return MetaCoin.deployed().then(function(instance) {
        return instance.makeNumbers();
      }).then(function(vari) {
        console.log("    Make Numbers " + vari);
        //assert.equal(state, "Waiting to start", "wasn't the state, state was - " + state);
      });
    });
      it("should FAIL to sell a ticket...", function() {
        var meta;
        return MetaCoin.deployed().then(function(instance) {
          meta = instance;
          return instance.depositNumber.sendTransaction(11,12,13,14,15, {value: 100000000000000000, from: accounts[1]});
        }).then(assert.fail).catch(function(error) {
          console.log("    ->" + error.message);
          assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
        });
      });
        it("should wait until ticket duration has passed", () => {
        //     //  your instance setup here...

             return MetaCoin.deployed().then( res => {
                 var waitLength = 30; // in seconds
                 var waitUntil = moment().utc().unix() + waitLength;
                 return waitForTimeStamp(waitUntil);
             }).then( res => {
        //         //done();
             });
         });
    it("should make numbers...", function() {
      return MetaCoin.deployed().then(function(instance) {
        return instance.makeNumbers();
      }).then(function(vari) {
        console.log("    Make Numbers " + vari);
        //assert.equal(state, "Waiting to start", "wasn't the state, state was - " + state);
      });
    });
    it("should FAIL to sell a ticket...", function() {
      var meta;
      return MetaCoin.deployed().then(function(instance) {
        meta = instance;
        return instance.depositNumber.sendTransaction(11,12,13,14,15,  {value: 100000000000000000, from: accounts[1]});
      }).then(assert.fail).catch(function(error) {
        console.log("    ->" + error.message);
        assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
      });
    });
    it("should wait until ticket duration has passed", () => {
    //     //  your instance setup here...

         return MetaCoin.deployed().then( res => {
             var waitLength = 30; // in seconds
             var waitUntil = moment().utc().unix() + waitLength;
             return waitForTimeStamp(waitUntil);
         }).then( res => {
    //         //done();
         });
     });
    it("should make numbers...", function() {
      return MetaCoin.deployed().then(function(instance) {
        return instance.makeNumbers();
      }).then(function(vari) {
        console.log("    Make Numbers " + vari);
        //assert.equal(state, "Waiting to start", "wasn't the state, state was - " + state);
      });
    });

//
//   it("should start in waiting to start state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting to start", "wasn't the state, state was - " + state);
//     });
//   });
//
//   it("should be round 0...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.roundNumber.call();
//     }).then(function(round) {
//       assert.equal(round, 0, "0 wasn't the round, round was " + round);
//     });
//   });
//
//
//   ////////////////////////////////////////////////////////////////
//   ////////////////////////////////////////////////////////////////
//
//   // it("should FAIL to sell a ticket...", function() {
//   //   var meta;
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     meta = instance;
//   //     return instance.buyTicket.sendTransaction("31-12-13-44-15", {value: 100000000000000000, from: accounts[1]});
//   //   }).then(assert.fail).catch(function(error) {
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//   // it("should FAIL trigger waiting for numbers...", function() {
//   //   var meta;
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     meta = instance;
//   //     return instance.PauseForNumbers.sendTransaction();
//   //   }).then(assert.fail).catch(function(error) {
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//   // it("should FAIL to process winners...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.releaseNumbers.sendTransaction("10-12-13-14-15", "dfgdfgdfg");
//   //   }).then(assert.fail).catch(function(error) {
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//
//   ////////////////////////////////////////////////////////////////
//   ////////////////////////////////////////////////////////////////
//
//
//
//   it("should activate lottery correctly...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.startLotto.sendTransaction(numbers);
//       //return instance.GetState.call();
//     //}).then(function(state) {
//     }).then(function(result) {
//       //assert.equal(state, 1, "1 wasn't the state, state was " + state);
//       console.log("    ->" + result);
//     });
//   });
//
//     it("should be in running state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Lottery is running", "wasn't the state, state was " + state);
//     });
//   });
//
//
//   it("should have a start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("11-12-13-14-15", {value: ticketprice, from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("13-12-13-14-15", {value: ticketprice, from: accounts[2]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-32-13-14-15", {value: ticketprice, from: accounts[3]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-33-14-15", {value: ticketprice, from: accounts[4]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-34-15", {value: ticketprice, from: accounts[5]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-14-35", {value: ticketprice, from: accounts[6]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("05-12-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-44-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should count tickets...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.totalTickets.call();
//     }).then(function(tc) {
//       outputTicketCount = tc;
//       assert.equal(tc, 8, " ticketcount was wrong - was " + tc);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//   it("should wait until ticket duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 45; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   // it("should FAIL to sell a ticket...", function() {
//   //   var meta;
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     meta = instance;
//   //     return instance.buyTicket.sendTransaction("31-12-13-44-15", {value: 100000000000000000, from: accounts[1]});
//   //   }).then(assert.fail).catch(function(error) {
//   //     //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//   it("should trigger waiting for numbers...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.PauseForNumbers.sendTransaction();
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should be in waiting to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting 16 mins to release...", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should have a release start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a release end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   // it("should FAIL to sell a ticket...", function() {
//   //   var meta;
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     meta = instance;
//   //     return instance.buyTicket.sendTransaction("31-12-13-44-15", {value: 100000000000000000, from: accounts[1]});
//   //   }).then(assert.fail).catch(function(error) {
//   //     //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//   it("should wait until duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 45; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should process winners...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releaseNumbers.sendTransaction("10-12-13-14-15", "dfgdfgdfg");
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should be round 1...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.roundNumber.call();
//     }).then(function(round) {
//       assert.equal(round, 1, "1 wasn't the round, round was " + round);
//     });
//   });
//
//   it("should be left in waiting to start state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting to start", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Payouts: " + result);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//
//   it("should activate lottery correctly...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.startLotto.sendTransaction(numbers);
//       //return instance.GetState.call();
//     //}).then(function(state) {
//     }).then(function(result) {
//       //assert.equal(state, 1, "1 wasn't the state, state was " + state);
//       console.log("    ->" + result);
//     });
//   });
//
//
//     it("should be in running state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Lottery is running", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should have a start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("11-12-13-14-15", {value: ticketprice, from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("13-12-13-14-15", {value: ticketprice, from: accounts[2]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-32-13-14-15", {value: ticketprice, from: accounts[3]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-33-14-15", {value: ticketprice, from: accounts[4]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-34-15", {value: ticketprice, from: accounts[5]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-14-35", {value: ticketprice, from: accounts[6]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-42-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("05-12-13-14-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//   it("should wait until ticket duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 45; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should trigger waiting for numbers...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.PauseForNumbers.sendTransaction();
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should be in waiting to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting 16 mins to release...", "wasn't the state, state was " + state);
//     });
//   });
//
//
//   it("should have a release start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a release end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should wait until duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 60; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should be in waiting state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Releasing numbers shortly...", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should process winners...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releaseNumbers.sendTransaction("06-12-13-14-15", "dfgdfgdfg");
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//
// /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//
//   it("should activate lottery correctly...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.startLotto.sendTransaction(numbers);
//       //return instance.GetState.call();
//     //}).then(function(state) {
//     }).then(function(result) {
//       //assert.equal(state, 1, "1 wasn't the state, state was " + state);
//       console.log("    ->" + result);
//     });
//   });
//
//
//     it("should be in running state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Lottery is running", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should have a start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("11-12-13-14-15", {value: ticketprice, from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("13-12-13-14-15", {value: ticketprice, from: accounts[2]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-32-13-14-15", {value: ticketprice, from: accounts[3]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-33-14-15", {value: ticketprice, from: accounts[4]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-34-15", {value: ticketprice, from: accounts[5]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-14-35", {value: ticketprice, from: accounts[6]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-42-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("05-12-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("05-12-13-14-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("05-12-13-14-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//
//   it("should wait until ticket duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 45; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should trigger waiting for numbers...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.PauseForNumbers.sendTransaction();
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should be in waiting to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting 16 mins to release...", "wasn't the state, state was " + state);
//     });
//   });
//
//
//   it("should have a release start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a release end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should wait until duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 60; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should be in overtime to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Releasing numbers shortly...", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should process winners...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releaseNumbers.sendTransaction("05-12-13-14-15", "dfgdfgdfg");
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   //   it("should be in won state...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.getStateDesc();
//   //   }).then(function(state) {
//   //     console.log("    ->" + state);
//   //     assert.equal(state, "Lottery was won!  yay!", "wasn't the state, state was " + state);
//   //   });
//   // });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Payouts 1: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Payouts 7: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Payouts 8: " + result);
//     });
//   });
//
// /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//
//
//
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//
//
//
//   it("should have outstanding payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.outstandingPayouts.call();
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Outstanding Payouts: " + result);
//     });
//   });
//
//
//   // it("should fail to get payout...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.getSinglePayout({from: accounts[1]});
//   //   }).then(assert.fail).catch(function(error) {
//   //     console.log("    ->" + error.message);
//   //     assert(error.message.indexOf('invalid opcode') >= 0, 'Expected throw, but got: ' + error);
//   //   });
//   // });
//
//   it("should try to get payout...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getSinglePayout({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Get Payout: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Payouts 8: " + result);
//     });
//   });
//
//   // it("should try to get payout...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.getSinglePayout({from: accounts[8]});
//   //   }).then(function(result) {
//   //     console.log("    ->Get Payout: " + result);
//   //   });
//   // });
//
//   it("should have outstanding payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.outstandingPayouts.call();
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Outstanding Payouts: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[7]});
//     }).then(function(result) {
//       console.log("    ->Payouts: " + result);
//     });
//   });
//
//   it("should try to get payout...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getSinglePayout({from: accounts[7]});
//     }).then(function(result) {
//       console.log("    ->Get Payout: " + result);
//     });
//   });
//
//   it("should have outstanding payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.outstandingPayouts.call();
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Outstanding Payouts: " + result);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
// /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////////////////
//
//   it("should activate lottery correctly...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return meta.startLotto.sendTransaction(numbers);
//       //return instance.GetState.call();
//     //}).then(function(state) {
//     }).then(function(result) {
//       //assert.equal(state, 1, "1 wasn't the state, state was " + state);
//       console.log("    ->" + result);
//     });
//   });
//
//
//     it("should be in running state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Lottery is running", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should have a start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.ticketEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("11-12-13-14-15", {value: ticketprice, from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("13-12-13-14-15", {value: ticketprice, from: accounts[2]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-32-13-14-15", {value: ticketprice, from: accounts[3]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-33-14-15", {value: ticketprice, from: accounts[4]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-34-15", {value: ticketprice, from: accounts[5]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-12-13-14-35", {value: ticketprice, from: accounts[6]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("31-42-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("07-12-13-14-15", {value: ticketprice, from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("07-12-13-14-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should sell a ticket...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.buyTicket.sendTransaction("07-12-13-14-15", {value: ticketprice, from: accounts[8]});
//     }).then(function(result) {
//       //assert.equal(HiddenNum, numfive, numfive + " wasn't the fist number - was " + HiddenNum);
//       console.log("    ->" + result);
//     });
//   });
//
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });
//
//
//   it("should wait until ticket duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 45; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should trigger waiting for numbers...", function() {
//     var meta;
//     return MetaCoin.deployed().then(function(instance) {
//       meta = instance;
//       return instance.PauseForNumbers.sendTransaction();
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   it("should be in waiting to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Waiting 16 mins to release...", "wasn't the state, state was " + state);
//     });
//   });
//
//
//   it("should have a release start time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseStartTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->Start Time: " + time);
//     });
//   });
//
//   it("should have a release end time...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releasePauseEndTime.call();
//     }).then(function(time) {
//       //assert.equal(state, 2, "2 wasn't the state, state was " + state);
//       console.log("    ->End Time: " + time);
//     });
//   });
//
//   it("should wait until duration has passed", () => {
//   //     //  your instance setup here...
//
//        return MetaCoin.deployed().then( res => {
//            var waitLength = 60; // in seconds
//            var waitUntil = moment().utc().unix() + waitLength;
//            return waitForTimeStamp(waitUntil);
//        }).then( res => {
//   //         //done();
//        });
//    });
//
//   it("should be in overtime to release state...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getStateDesc();
//     }).then(function(state) {
//       console.log("    ->" + state);
//       assert.equal(state, "Releasing numbers shortly...", "wasn't the state, state was " + state);
//     });
//   });
//
//   it("should process winners...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.releaseNumbers.sendTransaction("07-12-13-14-15", "dfgdfgdfg");
//     }).then(function(result) {
//       console.log("    ->" + result);
//     });
//   });
//
//   //   it("should be in won state...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.getStateDesc();
//   //   }).then(function(state) {
//   //     console.log("    ->" + state);
//   //     assert.equal(state, "Lottery was won!  yay!", "wasn't the state, state was " + state);
//   //   });
//   // });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[1]});
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Payouts 1: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[7]});
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Payouts 7: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Payouts 8: " + result);
//     });
//   });
//
//   it("should try to get payout...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getSinglePayout({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Get Payout: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[8]});
//     }).then(function(result) {
//       console.log("    ->Payouts 8: " + result);
//     });
//   });
//
//   // it("should try to get payout...", function() {
//   //   return MetaCoin.deployed().then(function(instance) {
//   //     return instance.getSinglePayout({from: accounts[8]});
//   //   }).then(function(result) {
//   //     console.log("    ->Get Payout: " + result);
//   //   });
//   // });
//
//   it("should have outstanding payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.outstandingPayouts.call();
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Outstanding Payouts: " + result);
//     });
//   });
//
//   it("should check payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.checkPayouts({from: accounts[7]});
//     }).then(function(result) {
//       console.log("    ->Payouts: " + result);
//     });
//   });
//
//   it("should try to get payout...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getSinglePayout({from: accounts[7]});
//     }).then(function(result) {
//       console.log("    ->Get Payout: " + result);
//     });
//   });
//
//   it("should have outstanding payouts...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.outstandingPayouts.call();
//     }).then(function(result) {
//       //assert.equal(balance.valueOf(), 500000000, "500000000 wasn't in the first account");
//       console.log("    ->Outstanding Payouts: " + result);
//     });
//   });
//
//   it("should have a pot size...", function() {
//     return MetaCoin.deployed().then(function(instance) {
//       return instance.getEstimatedJackpotSize();
//     }).then(function(amount) {
//       console.log("    ->Jackpot Size: " + amount);
//     });
//   });


});
