const SimpleAuction = artifacts.require("SimpleAuction");
const { expectRevert, expectEvent, constants, BN} = require('@openzeppelin/test-helpers');
contract("SimpleAuction",  (accounts) => {
    const ENDTIME = 30;
    const GASPRICE = new BN('20000000000');
    before( async ()=>{
        this.simpleAuction = await SimpleAuction.new(ENDTIME, accounts[0], {from:accounts[0]});

        this.auctionEndTime = await this.simpleAuction.auctionEndTime.call();
        const now = Math.floor(Date.now() / 1000);
        assert.isAbove(this.auctionEndTime.toNumber(), now, "auctionEndTime error")
        this.beneficiary = await this.simpleAuction.beneficiary.call();
        console.log('this.beneficiary = ', this.beneficiary);
    });

    describe('bid',  () => {
        it('account 1 should bid with 1 ether successfully', async () => {
            const bidder = accounts[1];
            const bidAmount = web3.utils.toWei('1', "ether");
            const {logs} = await this.simpleAuction.bid( {from: bidder, value: bidAmount} );
            const highestBidder = await this.simpleAuction.highestBidder.call();
            const highestBid = await this.simpleAuction.highestBid.call();
            assert.equal(highestBidder, bidder, "highestBidder should be accounts[2]!");
            assert.equal(highestBid, bidAmount, "highestBid should be 2 ether!");
            expectEvent.inLogs(logs, 'HighestBidIncreased', {
                bidder: bidder,
                amount: bidAmount,
            });
        });
        it('account 2 should bid with 2 ether successfully', async () => {
            const bidder = accounts[2];
            const bidAmount = web3.utils.toWei('2', "ether");
            const {logs} = await this.simpleAuction.bid( {from: bidder, value: bidAmount} );
            const highestBidder = await this.simpleAuction.highestBidder.call();
            const highestBid = await this.simpleAuction.highestBid.call();
            assert.equal(highestBidder, bidder, "highestBidder should be accounts[2]!");
            assert.equal(highestBid, bidAmount, "highestBid should be 2 ether!");
            expectEvent.inLogs(logs, 'HighestBidIncreased', {
                bidder: bidder,
                amount: bidAmount,
            });
        });
        it('account 3 trys to bid with 2 ether, which should be reverted', async () => {
            await expectRevert(this.simpleAuction.bid( {from: accounts[3], value: web3.utils.toWei('2', "ether")}), "There already is a higher bid.");
        });
    });
    describe('withdraw',  () => {
        it('account 1 should withdraw 1 ether successfully', async () => {
            const b1 = await web3.eth.getBalance(accounts[1]);
            const tx = await this.simpleAuction.withdraw( {from: accounts[1]} );
            const expected = (new BN(b1)).add(
                (new BN(web3.utils.toWei('1', 'ether')))
                ).sub(
                    (new BN(tx.receipt.gasUsed)).mul(GASPRICE)
                ).toString();
            const result = await web3.eth.getBalance(accounts[1]);
            assert.equal(result, expected, "accounts[1] balance should increase by 1 ether!");
            
        });
    });
    describe('auctionEnd',  () => {
        it('auctionEnd should be reverted since not end', async () => {
            await expectRevert(this.simpleAuction.auctionEnd( {from: accounts[1]} ), "Auction not yet ended.");
        });
        it('auctionEnd should be successful', async () => {
            await sleep((ENDTIME)*1000);
            const b0 = await web3.eth.getBalance(accounts[0]);
            await this.simpleAuction.auctionEnd( {from: accounts[1]} );
            const expected = (new BN(b0)).add((new BN(web3.utils.toWei('2', 'ether')))).toString();
            const result = await web3.eth.getBalance(accounts[0]);
            assert.equal(result, expected, "accounts[0]-- the beneficiary balance should increase by 2 ether!");
        });
        it('auctionEnd should be reverted since already ended', async () => {
            await expectRevert(this.simpleAuction.auctionEnd( {from: accounts[1]} ), "auctionEnd has already been called.");
        });
        it('account 3 trys to bid with 3 ether, which should be reverted', async () => {
            await expectRevert(this.simpleAuction.bid( {from: accounts[3], value: web3.utils.toWei('3', "ether")}), "Auction already ended.");
        });
    });

    
})

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}