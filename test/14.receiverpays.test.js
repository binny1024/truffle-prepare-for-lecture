const ReceiverPays = artifacts.require("ReceiverPays");
const { expectRevert, expectEvent, constants, BN} = require('@openzeppelin/test-helpers');
const utils = require('ethereumjs-utils');
const abi = require('ethereumjs-abi');

contract("ReceiverPays",  (accounts) => {
    const Amount = new BN(web3.utils.toWei("0.001", "ether"));
    const TOTALETHER = Amount.mul(new BN('3'));
    const GASPRICE = new BN('20000000000');
    before( async ()=>{
        this.receiverPays = await ReceiverPays.new({from:accounts[0], value: TOTALETHER.toString()});
        this.owner = await this.receiverPays.owner.call();
        assert.equal(this.owner, accounts[0], "ReceiverPays owner should be the account 0!")
        


    });

    describe('claimPayment',  () => {
        it ('getHash', async () => {
            const msgsender = accounts[1];
            const amount = Amount;
            const nonce = new BN('10');
            const cHash = await this.receiverPays.getHash.call(amount, nonce, {from: msgsender});
            console.log('cHash is ', cHash);
            const hash = getHash(msgsender, amount, nonce, this.receiverPays.address);
            // assert.equal(cHash, hash, "on-chain and off-chain hash should be the same!");
        });
        it ('getMessage', async () => {
            const msgsender = accounts[1];
            const amount = Amount;
            const nonce = new BN('10');
            const cMessage = await this.receiverPays.getMessage.call(amount, nonce, {from: msgsender});
            console.log('cMessage is ', cMessage);
            const message = getMessage(msgsender, amount, nonce, this.receiverPays.address);
            // assert.equal(cMessage, message, "on-chain and off-chain message should be the same!");
        });
        it ('web3.eth.accounts.recover() successfully', async () => {
            const msgsender = accounts[1];
            const amount = Amount;
            const nonce = new BN('10');
            const sig = await signPayment(msgsender, amount, nonce, this.receiverPays.address);
            const message = getMessage(msgsender, amount, nonce, this.receiverPays.address);
            // const m = web3.utils.asciiToHex(message);
            const recoverdAddr = await web3.eth.accounts.recover(message, sig);
            console.log('recoverdAddr ', recoverdAddr);
            // assert.equal(recoverdAddr, accounts[0], "web3.eth.accounts.recover(m, s) should be accounts [0] !")
        });
        it ('splitSignature and web3.eth.accounts.recover() successfully', async ()=>{
            const msgsender = accounts[1];
            const amount = Amount;
            const nonce = new BN('10');
            const sig = await signPayment(msgsender, amount, nonce, this.receiverPays.address);
            const message = getMessage(msgsender, amount, nonce, this.receiverPays.address);
            const res = await this.receiverPays.splitSignature(sig);
            const v = '0x' + (res.v.toNumber() + 27).toString(16);
            console.log('v, r, s = ', v, res.r, res.s);
            // const m = web3.utils.asciiToHex(message);
            const recoverdAddr = await web3.eth.accounts.recover(message, v, res.r, res.s);
            console.log('recoverdAddr ', recoverdAddr);
            // assert.equal(recoverdAddr, accounts[0], "with contract splitSignature, web3.eth.accounts.recover(m, s) should be accounts [0] !")
        });
        // // TODO
        // it('claim fail since ', async () => {
        //     const msgsender = accounts[1];
        //     const amount = Amount;
        //     const nonce = new BN('10');
        //     const sig = await signPayment(msgsender, amount, nonce, this.receiverPays.address);
        //     const tx = await this.receiverPays.claimPayment(amount, nonce, sig);
        //     console.log("tx is ", tx);
        // });
    });
    function getHash(recipient, amount, nonce, contractAddress) {
        
        var hash = "0x" + abi.soliditySHA3(
            ["address", "uint256", "uint256", "address"],
            [recipient, amount, nonce, contractAddress]
        ).toString("hex");
        console.log('hash = ', hash);
        return hash;
    }
    function getMessage(recipient, amount, nonce, contractAddress) {
        const hash = getHash(recipient, amount, nonce, contractAddress);
        const message =  "0x" + abi.soliditySHA3(
            ["string", "bytes32"],
            ["\x19Ethereum Signed Message:\n32", hash]
        ).toString("hex");
        console.log('message = ', message);
        // return web3.utils.hexToUtf8(message);
        // return web3.utils.hexToAscii(message);
        return message;
    }
    async function signPayment(recipient, amount, nonce, contractAddress) {
        // npm install ethereumjs-abi --save
        const message = getMessage(recipient, amount, nonce, contractAddress);
        const sig =  await web3.eth.sign(message, accounts[0]);
        
        const sig1 = web3.eth.accounts.sign(message, "0xd30359f84be1cc8882241f0d4e3f5b6eed7ab6c14ca77a56806586e50b2282b4");
        console.log('sig1 = ', sig1);
        const recoverdAddr = web3.eth.accounts.recover(message, sig1);
        console.log('sig1 recovered addr is ', recoverdAddr);
        console.log('sig = ', sig);
        console.log('msg = ', message);
        console.log('sgr = ', accounts[0]);
        
        return sig;
    }
    async function recAddrFromVRS(m, v, r, s) {
    
        pub = utils.ecrecover(m, v, r, s)
        addr = '0x' + utils.pubToAddress(pub).toString('hex')
        return addr;
    }
    
    
})

