const MyToken = artifacts.require("MyToken");

contract("MyToken", async (accounts) => {
    beforeEach(async function () {
        // for the same contract 
        this.instance = await MyToken.deployed();
        // // for different contract 
        // this.instance = await MyToken.new();
        // console.log("\t\tdeploying new contract done, contract hash is", this.instance.address);
    });

    describe('test MyToken', function () {

        it('should get name successfully', async function () {
            // console.log("contract hash is", this.instance.address);
            let name = await this.instance.name();
            assert.equal(name, "MyFirstToken", "get mame failed!")
        });


        it('should get symbol successfully', async function () {
            // console.log("contract hash is", this.instance.address);
            let symbol  = await this.instance.symbol();
            assert.equal(symbol, "MFT", "get symbol failed!")
        });

        it('should get totalSupply successfully', async function () {
            let supply  = await this.instance.totalSupply();
            assert.equal(supply.valueOf(), 21000000 * 10 ** 8, "get totalSupply failed!")
        });

    });

    // describe('getsymbol1', function () {

    //     it('getsymbol correctly1', async function () {
    //         console.log("contract hash is", this.instance.address);
    //         const b1 = await this.instance.symbol();
    //         console.log('describe symbol is ', b1);
    //     });

    // });


})