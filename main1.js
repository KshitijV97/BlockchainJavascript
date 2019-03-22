// Shortcomings - 
// No methods to roll back chain after tampering
// Lacks Proof of Work
// Lacks Peer to peer network
// Does not check if you had funds to make transaction

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        // In case of currency, The details of transaction are stored in Data
        // Previous hash ensures integrity of blockchain
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;

        // Add one more property
        this.hash = this.calculateHash();; // Hash of our block
    }

    // Takes properties of block and returns its hash
    calculateHash() {
        // SHA256 not available in JS by default
        // npm install --save crypto-js
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
        // Had to toString because the library returns Javascript Object
    }
}

class Blockchain {
    constructor() { // Responsible for initializing the blockchain
        this.chain = [this.createGenesisBlock()]; // Array of blocks
        // Genesis block to be added manually
    }

    createGenesisBlock() { // Done manually
        return new Block(0, "05/07/1997", "Kshitij Vengurlekar", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        // Set the previous hash property
        newBlock.previousHash = this.getLatestBlock().hash;
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

coin.addBlock(new Block(1, "22/03/2019", { amount: 4 }));
coin.addBlock(new Block(2, "22/03/2019", { amount: 5 }));

console.log(JSON.stringify(coin, null, 4));
console.log('Is Blockchain valid? ' + coin.isChainValid());

coin.chain[1].data = { amount: 100 }; // Tampered
console.log('Is Blockchain valid? ' + coin.isChainValid());

// No methods to roll back chain after tampering
// Lacks Proof of Work
// Lacks Peer to peer network
// Does not check if you had funds to make transaction
