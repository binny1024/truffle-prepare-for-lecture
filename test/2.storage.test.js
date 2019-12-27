const HelloWorld1 = artifacts.require("HelloWorld1");

contract("HelloWorld1", async (accounts) => {

    it("should deployed successfully", async ()=>{
        let instance = await HelloWorld1.deployed();
        // console.log("\t\tdeploying done, contract hash is", instance.address);
        const a = await instance.a();
        assert.equal(a, 'abc', "contract deployed failed -- a incorrect!");
    });
    
    it("should NOT change a", async ()=>{
        let instance = await HelloWorld1.deployed();
        // console.log("\t\tdeploying done, contract hash is", instance.address);
        const result = await instance.updateNum();
        const a = await instance.a.call();
        assert.equal(a, 'abc', "a changed!!!");
    });
    

})