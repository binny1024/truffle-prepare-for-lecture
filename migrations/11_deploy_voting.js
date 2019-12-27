const ballot = artifacts.require("Ballot");

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts();
    await deployer.deploy(ballot, [
        web3.utils.fromAscii("hockey"),
        web3.utils.fromAscii("badminton"),
        web3.utils.fromAscii("baseball"),
        web3.utils.fromAscii("basketball"),
        web3.utils.fromAscii("football")
    ], {from:accounts[0]});
};