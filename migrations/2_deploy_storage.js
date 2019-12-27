const storage = artifacts.require("HelloWorld1");

module.exports = async function(deployer) {
    deployer.deploy(storage);
};