const Payment = artifacts.require("Payment");
const { expectRevert } = require('@openzeppelin/test-helpers');
contract("Payment", async (accounts) => {

    it(" Payment should deployed successfully", async ()=>{
        let payment = await Payment.deployed();
        console.log("payment.address = ", payment.address);
        const name = await payment.name.call();
        
        const primary = await payment.primary.call();
        assert.equal(name, "Payment", "Payment name is not 'Payment'!");
        assert.equal(primary, accounts[0], "Payment.primary is not accounts[0]!");
    });
    
    it("should invoke deposit() successfully", async ()=>{
        let payment = await Payment.deployed();
        const result = await payment.deposit(accounts[0], {from: accounts[0], value: web3.utils.toWei('1', "ether")});
        const b0 = await payment.depositsOf.call(accounts[0]);
        const b1 = await payment.depositsOf.call(accounts[1]);
        assert.equal(b0.toString(), web3.utils.toWei('1', "ether").toString(), "Payment primary balance is NOT 1 ether!");
        assert.equal(b1.toString(), "0", "Payment.depositOf(accounts[1]) is NOT ZERO!");
    });
    it("should invoke transferPrimary() and withdraw() successfully", async ()=>{
        let payment = await Payment.deployed();
        const result = await payment.transferPrimary(accounts[1], {from: accounts[0]});
        const primary = await payment.primary.call();
        assert.equal(primary, accounts[1], "Payment.primary is not accounts[1]!");
    });
    it("should revert when invoking deposit()", async ()=>{
        let payment = await Payment.deployed();
        await expectRevert(payment.deposit(accounts[0], {from: accounts[0], value: web3.utils.toWei('1', "ether")}), 'Secondary: caller is not the primary account');
        // const primary = await payment.primary.call();
        // assert.equal(primary, accounts[1], "Payment.primary is not accounts[1]!");
    });

})