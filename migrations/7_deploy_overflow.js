const overflow = artifacts.require("Overflow");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    let deployTx = await deployer.deploy(overflow, {from:accounts[0]});
};