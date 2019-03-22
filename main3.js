/*
Changes in this version
Make it a proper cryptocurrency
1. Block can contain multiple transactions
2. Add reward for miners
*/

/**
 * 1. Add mining reward
 * 2. We need a space to store pending transactions
 * 3. Method to mine a new block for the pending transaction
 * 
 * We need Pending transactions storage because we only create blocks after a certain interval ( Fixed number of blocks per unit time)
 */

const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        // In case of currency, The details of transaction are stored in Data
        // Previous hash ensures integrity of blockchain
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.transactions = transactions;
        // Add one more property
        this.hash = this.calculateHash();; // Hash of our block
    }

    // Takes properties of block and returns its hash
    calculateHash() {
        // SHA256 not available in JS by default
        // npm install --save crypto-js
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
        // Had to toString because the library returns Javascript Object
    }

    mineBlock(difficulty) {
        // While loop keeps running till has starts with a particular number of zeros
        // Make the hash of the block begin with a certain amount of zeros
        // Make a string of zeros that is exactly the length of difficulty
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) { //array.join(separator)
            this.nonce++; // Increment nonce as long as hash does not start with enough zeros
            this.hash = this.calculateHash();
        }
        console.log("Block mined " + this.hash);
        // nonce - does not have anything to do with block, can be changed to anything random
    }
}

class Blockchain {
    constructor() { // Responsible for initializing the blockchain
        this.chain = [this.createGenesisBlock()]; // Array of blocks
        // Genesis block to be added manually
        this.difficulty = 2; // Has to change with time in real life
        this.pendingTransactions = [];
        this.miningReward = 100; // Has to change with time in real life
    }

    createGenesisBlock() { // Done manually
        return new Block("05/07/1997", "Kshitij Vengurlekar", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Old addBlock method
    /*addBlock(newBlock) { // Needs to be updated for proof of work
        // Set the previous hash property
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty); 
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
        // In reality a new block is not added so easily
    }*/

    // New Add Block method
    // As we are not using a P2P network, One can tweak this method to increase the mining reward
    minePendingTransactions(miningRewardAddress) { // Will receive Mining reward address
        let block = new Block(Date.now(), this.pendingTransactions); // Adding all transactions not possible in real life in bitcoin
        // In reality miners have to pick transactions they want to include
        block.mineBlock(this.difficulty);
        console.log('Block Successfully Mined');
        this.chain.push(block);

        // Reset the transactions array and provide the miner his reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward) // Reward transaction does not have FROM address that is why 'null'
        ];
    }

    // This method will receive transactions and add it to the pending transactions array
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    //
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        // This function will return false if the chain is invalid, Else true
        for (let i = 1; i < this.chain.length; i++) {

            // Iterate over each block and check if its hash is valid and the hash of previous hash is valid
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if hash of block is valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check if Block points to correct Previous hash
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            /*
            console.log(currentBlock.hash);
            console.log(currentBlock.calculateHash());
            console.log(currentBlock.previousHash);
            console.log(previousBlock.hash);
            */
        }
        return true;
    }
}

let coin = new Blockchain();

coin.createTransaction(new Transaction('address1', 'address2', 100));
coin.createTransaction(new Transaction('address2', 'address1', 50));
// These will be in pending transcation array

// We need a miner to create a block for them

console.log('\n Starting the miner...');
coin.minePendingTransactions('Miner1');
console.log('Balance of Miner 1 is', coin.getBalanceOfAddress('Miner1'));
// The balance will be zero, Because after the minePendingTransaction method one more transaction will be created and will get added to the transaction pool to be mined in the next block

// The mining reward will only be sent when the next block is mined

console.log('\n Starting the miner again...');
coin.minePendingTransactions('Miner1');
console.log('Updated Balance of Miner 1 is', coin.getBalanceOfAddress('Miner1'));



// Methods to roll back chain
// Lacks Proof of Work
// Lacks Peer to peer network
// Does not check if you had funds to make transaction

// Second part
/**
 * What if someone changes the content of a block and recalculates the contents of all blocks after that
 * Then we will end up with a valid chain even though we tampered with it
 *
 * Proof of work solves this issue
 * The user has to prove that he has put in a lot of computing power to make a block
 * Also known as 'mining'
 *
 *
*/
