const purchase = artifacts.require("Purchase");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(purchase, {from:accounts[0], value: web3.utils.toWei('1', 'ether')});
};