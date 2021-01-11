const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');


const NamiCorporationTokenUpgradeable = artifacts.require("NamiCorporationTokenUpgradeable");

module.exports = async function (deployer) {
  return;
  await upgradeProxy('0x510ebF28D1AcB5db573d38D51CEA8B9Eb8da55EC', NamiCorporationTokenUpgradeable, { deployer });
};
