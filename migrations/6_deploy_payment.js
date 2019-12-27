const payment = artifacts.require("Payment");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    let deployTx = await deployer.deploy(payment, {from:accounts[0]});
};