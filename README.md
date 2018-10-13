# MOAC blockchain dashboard

This is a simple visualization project for MOAC ERC20 demo/prototype.

It is based on chain3.js and communicates directly with the local MOAC node running on your machine with default RPC port.

``` sh
moac --dev --rpc --rpccorsdomain "*"
```

In order to allow the browser to communicate with the RPC API.

To build the project, need to install the packages first.
This requires both bower and npm. 
If you don't have npm or bower installed, you need to install them first:

``` sh
npm install
bower install
```

Also need to install browserify to compile the erc20call.js for index.html to use:

``` sh
npm install -g browserify
```

Then generate the erc20call.js by run:

``` sh
browserify mcsample.js -o erc20call.js
```

## Setup

You need to change the `account` variable to your account address, and `contractAddress` to the address of the ERC20 smart contract deployed on your blockchain. If you don't have the contract address, deploy one using the erc20token.sol.

If your MOAC client's RPC port is different than the default, change the following line:

``` javascript
var chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
```

`erc20abi.js` contains the ABI for the ERC20 smart contract.

## Run the sample

Start the MOAC node, deploy the erc


## How it works

The chain3 API is used to display some information about the account:

- mc balance
- Current block number

There is a sample erc20 token contract in  smart contract functions are called to display specific information:

- source account balance
- dest account balance

Then a filter is set up to scan all new blocks for transactions and display their contents.

`getFunctionHashes()` and `findFunctionByHash()` are used to decode the function hash found in the `input` parameter for the transaction. Then, chain3's `SolidityCoder` internal class is used to decode the parameters for the function. This allows us to display the details of the ERC20 smart contract functions.
