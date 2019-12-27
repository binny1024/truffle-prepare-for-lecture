const receiverPays = artifacts.require("ReceiverPays");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(receiverPays, {from:accounts[0]});
};