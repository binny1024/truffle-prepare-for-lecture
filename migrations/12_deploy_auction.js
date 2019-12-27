const simpleAuction = artifacts.require("SimpleAuction");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(simpleAuction, 60, accounts[0], {from:accounts[0]});
};