const BublrNftToken = artifacts.require("BublrNftToken");

module.exports = function (deployer) {
  deployer.deploy(BublrNftToken);
};
