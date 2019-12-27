const Overflow = artifacts.require("Overflow");
const { expectRevert, constants, BN} = require('@openzeppelin/test-helpers');
contract("Overflow",  () => {

    before( async ()=>{
        this.overflow = await Overflow.new();
        console.log("overflow.address = ", this.overflow.address);
        const name = await this.overflow.name.call();
        assert.equal(name, "Overflow", "Overflow name is not 'Overflow'!");
    });
    
    describe('add',  () => {
        it('add correctly', async () => {
            const a = new BN('1234');
            const b = new BN('5678');
            const c = a.add(b);
            const result = await this.overflow.add.call(a, b)
            assert.equal(result.toString(), c.toString(), "addition incorrectly");
        });
        it('add overflow', async ()=>{
            const a = constants.MAX_UINT256;
            const b = new BN('1');
            let result = await this.overflow.add.call(a, b);
            assert.notEqual(result.toString(), a.add(b).toString(), "addition should be overflow!");
            assert.equal(result.toString(), "0", "addition overflow to ZERO");
        });
        it('reverts on addition overflow', async() => {
            const a = constants.MAX_UINT256;
            const b = new BN('1');
            await expectRevert(this.overflow.safeAdd.call(a, b), 'addition overflow');
        });
    });

    describe('sub',  () => {
        it('sub correctly', async () => {
            const a = new BN('5678');
            const b = new BN('1234');
            const c = a.sub(b);
            const result = await this.overflow.sub.call(a, b)
            assert.equal(result.toString(), c.toString(), "subtraction incorrectly");
        });
        it('sub overflow', async ()=>{
            const a = new BN('1234');
            const b = new BN('5678');
            let result = await this.overflow.sub.call(a, b);
            
            // assert.equal(result.toString(), b.sub(a).sub(constants.MAX_UINT256.add(new BN('1'))).toString(), "subtraction should be overflow!");
            assert.notEqual(result.toString(), a.sub(b).toString(), "subtraction overflow ");
        });
        it('reverts on subtraction overflow', async() => {
            const a = new BN('1234');
            const b = new BN('5678');
            await expectRevert(this.overflow.safeSub.call(a, b), 'subtraction overflow');
        });
    });
    

})