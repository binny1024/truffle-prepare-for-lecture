const MyToken = artifacts.require("MyToken");

contract("MyToken", async (accounts) => {

    it("should deployed successfully", async ()=>{
        let instance = await MyToken.deployed();
        console.log("\t\tdeploying done, contract hash is", instance.address);
        const name = await instance.name.call();
        let symbol = await instance.symbol.call();
        let totalSupply = await instance.totalSupply.call();
        assert.equal(name, "MyFirstToken", "contract deployed failed -- name incorrect!");
        assert.equal(symbol, "MFT", "contract deployed failed -- symbol incorrect!");
        assert.equal(totalSupply.valueOf(), 21000000 * 10 ** 8, "contract deployed failed -- totalSupply incorrect!");
    });
    
    it("should transfer successfully", async ()=>{
        let amountToBeTransferred = 100;
        let instance = await MyToken.deployed();
        let result = await instance.transfer(accounts[1], amountToBeTransferred);
        let balance1 = await instance.balanceOf.call(accounts[1]);
        assert.equal(balance1.valueOf(), amountToBeTransferred, "acct0 transfers coins to acct1 failed!");
    });

    it("should approve successfully", async ()=>{
        let amountToBeApproved = 100;
        let instance = await MyToken.deployed();
        let result = await instance.approve(accounts[2], amountToBeApproved);
        let allowance2 = await instance.allowance.call(accounts[0], accounts[2]);
        assert.equal(allowance2.valueOf(), amountToBeApproved, "acct0 approves coins to acct2 failed!");    
    });

    
    it("should transferFrom successfully", async ()=>{
        let amountToBeTranFrom = 1;
        let instance = await MyToken.deployed();
        let allowance2_0 = await instance.allowance(accounts[0], accounts[2]);
        let result = await instance.transferFrom(accounts[0], accounts[2], amountToBeTranFrom, {from: accounts[2]});
        let allowance2_1 = await instance.allowance.call(accounts[0], accounts[2]);
        console.log('allowance2_0 = ', allowance2_0.toNumber(), '\t, allowance2_1 = ', allowance2_1.toNumber());
        assert.equal(allowance2_0.sub(allowance2_1).valueOf(), amountToBeTranFrom, "acct0 approves coins to acct2 failed!");    
    });
    

})