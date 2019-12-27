const globalVar = artifacts.require("GlobalVar");
const callGlobalVar = artifacts.require("CallGlobalVar");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(globalVar, {from:accounts[0]});
    await deployer.deploy(callGlobalVar, globalVar.address, {from: accounts[0]});
};