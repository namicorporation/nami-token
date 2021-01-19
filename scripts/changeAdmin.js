const NamiCorporationTokenUpgradeable = artifacts.require("NamiCorporationTokenUpgradeable");

module.exports = async function() {
    let instance = await NamiCorporationTokenUpgradeable.deployed();
    let accounts = await web3.eth.getAccounts();
    const result = await instance.changeAdmin('0x4A5F22DDfC58B65059D49FDf64F62574337374A8');
    console.log('>> result', result);
}
