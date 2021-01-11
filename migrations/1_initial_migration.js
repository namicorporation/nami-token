const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const NamiCorporationTokenUpgradeable = artifacts.require("NamiCorporationTokenUpgradeable");

module.exports = async function (deployer) {
  const instance = await deployProxy(NamiCorporationTokenUpgradeable, ['Nami Corporation Token', 'NAMI'], {
    deployer,
    unsafeAllowCustomTypes: true,
  });
  console.log("NamiCorporationToken deployed to:", instance.address);
};
