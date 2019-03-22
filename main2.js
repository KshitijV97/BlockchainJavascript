const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        // In case of currency, The details of transaction are stored in Data
        // Previous hash ensures integrity of blockchain
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;

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
        this.difficulty = 4;
    }

    createGenesisBlock() { // Done manually
        return new Block(0, "05/07/1997", "Kshitij Vengurlekar", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) { // Needs to be updated for proof of work
        // Set the previous hash property
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty); 
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
        // In reality a new block is not added so easily
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

console.log('Mining block 1...');
coin.addBlock(new Block(1, "22/03/2019", { amount: 4 }));

console.log('Mining block 2...');
coin.addBlock(new Block(2, "22/03/2019", { amount: 5 }));



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
