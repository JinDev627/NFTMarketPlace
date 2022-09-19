# NFT Marketplace

This is the frontend and smartcontract to implement small NFT Marketplace.
This will be used for the Bublr item Marketplace.



<h4> Smart Contract </h4> 

- Implemented functions
    1. Create an ERC721 token
    2. Manage user's sale list
    3. Buy Function
    4. Burn token
    5. Remove token from the sale list
    7. Manage ownership

- Construct a building environment
    1. Install truffle
        > npm install -g truffle
    2. Compile the Smart Contract
        > truffle compile
    3. Run Truffle on local testnet(need to install Ganash)
        > truffle development
    4. Run Truffle on Mumbai testnet
        > truffle testnet
    5. Deploy Smart contract
        > migrate

<h4> Frontend </h4> 

The frontend was built using pure JS and Jquery.
Web3.js is integrated to comunicate with smart contract

- Before testing 
You have to edit the js/abi.js place your new abi data and the address of contract.
- Implemented functions
    1. NFT minting page with IPFS uploading
    2. Register Sale 
    3. Buy NFT
    4. Check my NFT details

