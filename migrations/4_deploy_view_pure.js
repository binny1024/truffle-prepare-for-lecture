const hw3 = artifacts.require("HelloWorld3");

module.exports = async function(deployer) {
    deployer.deploy(hw3);
};