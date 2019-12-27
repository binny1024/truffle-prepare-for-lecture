const HelloWorld4 = artifacts.require("HelloWorld4");

contract("HelloWorld4", async (accounts) => {

    it(" HelloWorld4 should deployed successfully", async ()=>{
        let hw4 = await HelloWorld4.deployed();
        const sender = await hw4.sender.call();
        console.log('sender is ', sender);
        assert.equal(sender, accounts[1], "HelloWorld4 sender is not the deployer!");
    });
    
    it("should invoke a() successfully", async ()=>{
        let hw4 = await HelloWorld4.deployed();
        const result = await hw4.a({from: accounts[1]});
        console.log('HelloWOrld4.a transaction detail is ', result)
    });
})