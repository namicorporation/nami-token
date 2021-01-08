const NamiCorporationToken = artifacts.require("NamiCorporationToken");

module.exports = function (deployer) {
  deployer.deploy(NamiCorporationToken, 'Nami Corporation Token', 'NAMI');
};
