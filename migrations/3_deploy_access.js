const test = artifacts.require("Test");
const hw2 = artifacts.require("HelloWorld2");

module.exports = async function(deployer) {
    deployer.deploy(test);
    deployer.deploy(hw2);
};