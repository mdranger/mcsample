// NOTE: Need to compile with browserify mcexample.js -o main.js
// REquire to install the chain3 lib
var SolidityCoder = require("chain3/lib/solidity/coder.js");
var Chain3 = require('chain3/index.js');

//var account = '0x4cf24bf15bfead008b22ea33b7c99a82326031a7'; // Pi
//ERC20 contract address
// Used with erc20abi.js
var account = '0xa8863fc8ce3816411378685223c03daae9770ebb'; // Dev
var acc2 = '0x7312f4b8a4457a36827f185325fd6b66a3f8bb8b';
var contractAddress = '0x67e572c24220fc76c19e3f143bc3183007d19880';

var chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

chain3.mc.defaultAccount = account;

// Assemble function hashes

var functionHashes = getFunctionHashes(abiArray);

// Get hold of contract instance

var contract = chain3.mc.contract(abiArray).at(contractAddress);

// Setup filter to watch transactions

var filter = chain3.mc.filter('latest');

filter.watch(function(error, result){
  if (error) return;
  
  var block = chain3.mc.getBlock(result, true);
  console.log('block #' + block.number);

  console.dir(block.transactions);

  for (var index = 0; index < block.transactions.length; index++) {
    var t = block.transactions[index];

    // Decode from
    var from = t.from==account ? "me" : t.from;

    // Decode function
    var func = findFunctionByHash(functionHashes, t.input);

    if (func == 'transfer') {
      // This is the transfer() method
      var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
      console.dir(inputData);
      $('#transactions').append('<tr><td>' + t.blockNumber + 
        '</td><td>' + from + 
        '</td><td>' + "MOAC token" + 
        '</td><td>transfer(' + inputData[0].toString() + ')</td></tr>');
    } else if (func == 'approve') {
      // This is the approve() method
      var inputData = SolidityCoder.decodeParams(["uint256"], t.input.substring(10));
      console.dir(inputData);
      $('#transactions').append('<tr><td>' + t.blockNumber + 
        '</td><td>' + from + 
        '</td><td>' + "MOAC token" + 
        '</td><td>approve(' + inputData[0].toString() + ')</td></tr>');
    } else {
      // Default log
      $('#transactions').append('<tr><td>' + t.blockNumber + '</td><td>' + from + '</td><td>' + t.to + '</td><td>' + t.input + '</td></tr>')
    }
  }
});

// Update labels every second

setInterval(function() {

  // Account balance in Mc
  var balanceSha = chain3.mc.getBalance(account).toNumber();
  var balance = chain3.fromSha(balanceSha, 'mc');
  $('#label1').text(balance);

  // Block number
  var number = chain3.mc.blockNumber;
  if ($('#label2').text() != number)
    $('#label2').text(number).effect("highlight");

  // Contract coin balance: call (not state changing)
  var coinBalance = contract.balanceOf(account).toString(10);//getCoinAccount.call();
  $('#label3').text(coinBalance);

  // Contract energy balance: call (not state changing)
  var desBalance = contract.balanceOf(acc2).toString(10);
  $('#label4').text(desBalance);

}, 3000);

// Get function hashes
// TODO: also extract input parameter types for later decoding

function getFunctionHashes(abi) {
  var hashes = [];
  for (var i=0; i<abi.length; i++) {
    var item = abi[i];
    if (item.type != "function") continue;
    var signature = item.name + "(" + item.inputs.map(function(input) {return input.type;}).join(",") + ")";
    var hash = chain3.sha3(signature);
    console.log(item.name + '=' + hash);
    hashes.push({name: item.name, hash: hash});
  }
  return hashes;
}

function findFunctionByHash(hashes, functionHash) {
  for (var i=0; i<hashes.length; i++) {
    if (hashes[i].hash.substring(0, 10) == functionHash.substring(0, 10))
      return hashes[i].name;
  }
  return null;
}