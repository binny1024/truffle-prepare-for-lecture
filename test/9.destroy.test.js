const Destroy = artifacts.require("Destroy");
const { expectRevert, constants, BN} = require('@openzeppelin/test-helpers');
contract("Destroy",  (accounts) => {

    before( async ()=>{
        this.destroy = await Destroy.new();
        console.log("destroy.address = ", this.destroy.address);
        const name = await this.destroy.name.call();
        assert.equal(name, "Destroy", "Destroy name is not 'Destroy'!");
    });
    
    describe('destroy',  () => {
        it('send ether to contract correctly', async () => {
            const tx = await web3.eth.sendTransaction({from: accounts[0], to: this.destroy.address, value: web3.utils.toWei('0.1', "ether")});
            const result = await web3.eth.getBalance(this.destroy.address);
            assert.equal(result, web3.utils.toWei('0.1', 'ether'), "invoke contract payable incorrectly");
        });
        it('destroy successfully and ether is balanced', async () => {
            const b2 = await web3.eth.getBalance(accounts[2]);
            const tx = await this.destroy.destroy(accounts[2], {from: accounts[1]});
            const result = await web3.eth.getBalance(accounts[2]);
            const expected = (new BN(b2)).add((new BN(web3.utils.toWei('0.1', 'ether'))));
            assert.equal(result, expected.toString(), "ether is not balanced");
            await expectRevert(this.destroy.name.call(), 'Returned values aren\'t valid, did it run Out of Gas?')
        });
    });

    
})