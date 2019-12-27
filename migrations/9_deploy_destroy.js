const destroy = artifacts.require("Destroy");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(destroy, {from:accounts[0]});
};