const Purchase = artifacts.require("Purchase");
const { expectRevert, expectEvent, constants, BN} = require('@openzeppelin/test-helpers');
contract("Purchase",  (accounts) => {
    const VALUE = new BN(web3.utils.toWei("0.1", "ether"));
    const MSGVALUE = VALUE.mul(new BN('2'));
    const GASPRICE = new BN('20000000000');
    beforeEach( async ()=>{
        this.purchase = await Purchase.new({from:accounts[0], value: MSGVALUE.toString()});
        this.seller = await this.purchase.seller.call();
        assert.equal(this.seller, accounts[0], "Purchase seller should be the account 0!")
        
    });

    describe('abort',  () => {
        it('after abort, value should be returned to seller, and buyer should not be able to confirmPurchase', async () => {
            const sellerBalanceOriginal = new BN(await web3.eth.getBalance(this.seller));
            const tx = await this.purchase.abort();
            const txFee = (new BN(tx.receipt.gasUsed)).mul(GASPRICE);
            const sellerBalanceResult = new BN(await web3.eth.getBalance(this.seller));
            const sellerBalanceExpected = sellerBalanceOriginal.add(MSGVALUE).sub(txFee);

            assert.equal(sellerBalanceResult.toString(), sellerBalanceExpected.toString(), "seller should receive the 0.1 ether after 'abort'!");
            this.buyer = accounts[1];
            await expectRevert(this.purchase.confirmPurchase({from: this.buyer, value: MSGVALUE.toString()}), "Invalid state.");
            const state = await this.purchase.state.call();
            assert.equal(state.toString(), '2', "state should be Inactive!");
        });
    });
    describe('confirmPurchase', ()=> {
        it('buyer confirmPurchase failed since msg.value != 2 * value', async () => {
            const state = await this.purchase.state.call();
            assert.equal(state.toString(), '0', "state should be Inactive!");
            this.buyer = accounts[1];
            await expectRevert(this.purchase.confirmPurchase({from: this.buyer, value : VALUE.mul(new BN('2')).add(new BN('1'))}), "State condition not satisfied");
        });
        it('buyer confirmPurchase successfully with msg.value == 2 * value and state = Created', async () => {
            const state = await this.purchase.state.call();
            assert.equal(state.toString(), '0', "state should be Inactive!");
            this.buyer = accounts[1];
            const {logs } = await this.purchase.confirmPurchase({from: this.buyer, value : VALUE.mul(new BN('2')).toString()});
            expectEvent.inLogs(logs, 'PurchaseConfirmed', {
            });
            const state1 = await this.purchase.state.call();
            assert.equal(state1.toString(), '1', "state should be Inactive!");
            const buyer = await this.purchase.buyer.call();
            assert.equal(buyer, this.buyer, "buyer should account 1!");
            const contractBalance = await web3.eth.getBalance(this.purchase.address);
            const expectedContractBalance = VALUE.mul(new BN('4')).toString();
            assert.equal(contractBalance.toString(), expectedContractBalance, "contract balance should be 3 X VALUE!")
        });
    });
    describe('confirmReceived', ()=>{
        it('buyer confirmReceived Successfully', async ()=>{
            this.buyer = accounts[1];
            const buyerBalanc0 = new BN(await web3.eth.getBalance(this.buyer));
            const tx1 = await this.purchase.confirmPurchase({from: this.buyer, value : VALUE.mul(new BN('2'))});
            const buyerBalanc1 = new BN(await web3.eth.getBalance(this.buyer));
            const expectedBalance1 = buyerBalanc0.sub(VALUE.mul(new BN('2'))).sub((new BN(tx1.receipt.gasUsed)).mul(GASPRICE));
            assert.equal(buyerBalanc1.toString(), expectedBalance1.toString(), "the balance of buyer should be balanced after 'confirmPurchase'!")
            const tx2 = await this.purchase.confirmReceived({from: this.buyer});
            const logs = tx2.logs;
            expectEvent.inLogs(logs, 'ItemReceived', {});
            const buyerBalanc2 = new BN(await web3.eth.getBalance(this.buyer));
            const expectedBalance2 = buyerBalanc1.sub((new BN(tx2.receipt.gasUsed).mul(GASPRICE))).add(VALUE);
            assert.equal(buyerBalanc2.toString(), expectedBalance2.toString(), "the balance of buyer should be balanced after 'confirmReceived'!")
        });
    });

    
})
