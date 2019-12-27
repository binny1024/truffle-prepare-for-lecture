const HelloWorld3 = artifacts.require("HelloWorld3");

contract("HelloWorld3", async (accounts) => {

    it(" HelloWorld3 should deployed successfully", async ()=>{
        let hw3 = await HelloWorld3.deployed();
        const initialAge = await hw3.age.call();
        assert.equal(initialAge.toNumber(), 0, "HelloWorld3 initial age is NOT 0!");
    });
    
    it("should modify age successfully", async ()=>{
        let hw3 = await HelloWorld3.deployed();
        const result = await hw3.constantViewPure();
        const age = await hw3.age.call();
        assert.equal(age.toNumber(), 29, "After modification, HelloWorld3 age is NOT 29!");
    });

    it("HelloWorld3.getAgeByView() should be okay", async ()=>{
        let hw3 = await HelloWorld3.deployed();
        const age = await hw3.getAgeByView.call();
        assert.equal(age.toNumber(), 29, "getAgeByView, HelloWorld3 age is NOT 29!");
    });

    it("HelloWorld3.getAgeByPure() should be okay", async ()=>{
        let hw3 = await HelloWorld3.deployed();
        const res = await hw3.getAgeByPure.call();
        assert.equal(res.toNumber(), 1, "getAgeByPure, HelloWorld3 age is NOT 1!");
    });

})