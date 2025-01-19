const TodoContract = artifacts.require("TodoContract");

module.exports = function(deployer, network, accounts) {
  if (accounts.length < 1) {
    console.error("No accounts found in the network");
    return;
  }

  deployer.deploy(TodoContract, { from: accounts[0] });
};