const meme  = artifacts.require("meme");

module.exports = function(deployer) {
  deployer.deploy(meme);
};
