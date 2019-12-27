const HelloWorld2 = artifacts.require("HelloWorld2");
const Test = artifacts.require("Test");

contract("HelloWorld2AndTest", async (accounts) => {

    it("Test and HelloWorld2 should deployed successfully", async ()=>{
        let hw2 = await HelloWorld2.deployed();
        let test = await Test.deployed();
        const hw2Name = await hw2.name.call();
        const testName = await test.name.call();
        assert.equal(hw2Name, 'HelloWorld2', "HelloWorld2 contract deployed failed -- name incorrect!");
        assert.equal(testName, 'Test', "Test contract deployed failed -- name incorrect!");
    });
    
    it("Test.publicFunc() should be okay", async ()=>{
        let test = await Test.deployed();
        const result = await test.publicFunc();
        console.log("publicFunc() transaction detail is: ", result);
    });

    it("Test.callFunc() should be okay", async ()=>{
        let test = await Test.deployed();
        const result = await test.callFunc();
        console.log("callFunc() transaction detail is: ", result);
    });

    it("Test.externalFunc() should be okay", async ()=>{
        let test = await Test.deployed();
        const result = await test.externalFunc();
        console.log("externalFunc() transaction detail is: ", result);
    });


    it("HelloWorld2.externalCall() should be okay", async ()=>{
        let hw2 = await HelloWorld2.deployed();
        let test = await Test.deployed();
        const result = await hw2.externalCall(test.address);
        console.log("HelloWorld2.externalFunc() transaction detail is: ", result);
    });
    

})