const hw4 = artifacts.require("HelloWorld4");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    let deployTx = await deployer.deploy(hw4,{from:accounts[1]});
    // console.log("Hellow4 deployTx is ", deployTx);
};