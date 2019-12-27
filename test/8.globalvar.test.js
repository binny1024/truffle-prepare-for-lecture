const GlobalVar = artifacts.require("GlobalVar");
const CallGlobalVar = artifacts.require("CallGlobalVar");
const { expectRevert, constants, BN} = require('@openzeppelin/test-helpers');
contract("GlobalVar and CallGlobalVar",  (accounts) => {

    before( async ()=>{
        this.globalvar = await GlobalVar.new();
        console.log("globalvar.address = ", this.globalvar.address);
        const name = await this.globalvar.name.call();
        assert.equal(name, "GlobalVar", "GlobalVar name is not 'GlobalVar'!");
        this.callGlobalVar = await CallGlobalVar.new(this.globalvar.address);
        console.log("callGlobalVar.address = ", this.callGlobalVar.address);
        const callername = await this.callGlobalVar.name.call();
        assert.equal(callername, "CallGlobalVar", "GlobalVar name is not 'GlobalVar'!");
        
    });
    
    describe('GlobalVar',  () => {
        it('getBlockHash correctly', async () => {
            const blockNumber = await web3.eth.getBlockNumber() - 10;
            console.log('blockNumber = ', blockNumber);
            const result = await this.globalvar.getBlockHash.call(blockNumber);
            const expected = (await web3.eth.getBlock(blockNumber)).hash;
            assert.equal(result.toString(), expected, "getBlockHash incorrectly");
        });
        it('getTxOrigin should be getTxMsgSender', async () => {
            const txOrigin = await this.globalvar.getTxOrigin.call({from: accounts[1]});
            const msgSender = await this.globalvar.getMsgSender.call({from: accounts[1]});
            const expected = accounts[1];
            assert.equal(txOrigin.toString(), expected, "getTxOrigin incorrectly");
            assert.equal(msgSender.toString(), expected, "getMsgSender incorrectly");
        });
        it('getEthBalance correctly', async () => {
            const result = await this.globalvar.getEthBalance.call(accounts[1]);
            const expected = await web3.eth.getBalance(accounts[1]);
            assert.equal(result.toString(), expected.toString(), "getEthBalance incorrectly");
        });

    });
    describe('CallGlobalVar',  () => {
        it('callGetTxOrigin corectly', async () => {
            const result = await this.callGlobalVar.callGetTxOrigin.call({from: accounts[1]});
            const expected = accounts[1];
            assert.equal(result.toString(), expected, "callGetTxOrigin incorrectly");
        });
        it('callGetMsgSender corectly', async () => {
            const result = await this.callGlobalVar.callGetMsgSender.call({from: accounts[1]});
            const expected = this.callGlobalVar.address;
            assert.equal(result.toString(), expected, "callGetMsgSender incorrectly");
        });
    });
    
})