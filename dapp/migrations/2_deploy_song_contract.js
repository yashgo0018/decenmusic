const DecenSong = artifacts.require("DecenSong");

module.exports = function (deployer) {
  const signer = "0xA612F142d557ED165FBE465A45b7CAD59A8894a7";
  deployer.deploy(DecenSong, signer);
};
