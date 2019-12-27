const { contract } = require('@openzeppelin/test-environment');
const { BN, constants, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Overflow = contract.fromArtifact('Overflow')


describe("Overflow",  () => {
    beforeEach(async function() {
        this.overflow = await Overflow.new();
        console.log('Overflow.address = ', this.overflow.address);
        console.log('name = ', await this.overflow.name());
    });
    
    async function testCommutative (fn, lhs, rhs, expected) {
        expect(await fn(lhs, rhs)).to.be.bignumber.equal(expected);
        expect(await fn(rhs, lhs)).to.be.bignumber.equal(expected);
    }

    async function testFailsCommutative (fn, lhs, rhs, reason) {
        await expectRevert(fn(lhs, rhs), reason);
        await expectRevert(fn(rhs, lhs), reason);
    }
    describe('add', function() {
        it('add correctly', async ()=>{
            const a = new BN('1234');
            const b = new BN('5678');
            const c = a.add(b);
            console.log('c = ', c.toString());
            console.log('add. Overflow.address = ', this.overflow.address);
            console.log('add. name = ', await this.overflow.name());
            console.log('add. name = ', await this.overflow.add(1, 2));
            // await testCommutative(this.overflow.add, a, b, a.add(b))
            await expect(await this.overflow.add(a, b)).to.be.bignumber.equal(c);
        });
        it('add overflow', async ()=>{
            const a = constants.MAX_UINT256;
            const b = new BN('1');
            let result = await this.overflow.add(a, b);
            assert.notEqual(result.toString(), a.add(b), "addition NO overflow!");
            console.log("result.toString() = ", result.toString());
            assert.equal(result.toString(), "0", "addition overflow to ZERO");
        });
        it('reverts on addition overflow', async() => {
            const a = constants.MAX_UINT256;
            const b = new BN('1');
            await testFailsCommutative(this.overflow.safeAdd, a, b, 'addition overflow');
        });
    });
    describe('sub', function () {
        it('subtracts correctly', async function () {
          const a = new BN('5678');
          const b = new BN('1234');
          expect(await this.overflow.sub(a, b)).to.be.bignumber.equal(a.sub(b));
        });
    
        it('reverts if subtraction result would be negative', async function () {
          const a = new BN('1234');
          const b = new BN('5678');
          await expectRevert(this.overflow.safeSub(a, b), 'subtraction overflow');
        });
    });

})