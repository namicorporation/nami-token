
// Use 'chai'
// const { expect } = require('chai');

const NamiCorporationTokenUpgradeable = artifacts.require('NamiCorporationTokenUpgradeable');

// Start test block
contract ('NamiCorporationTokenUpgradeable', function () {
    beforeEach(async function () {
        // Deploy a new contract for each test
        this.instance = await NamiCorporationTokenUpgradeable.new();
    });
    //
    // // Test case
    // it('retrieve returns a value previously stored', async function () {
    //     // Store a value
    //     await this.instance.store(42);
    //
    //     // Test if the returned value is the same one
    //     // Note that we need to use strings to compare the 256 bit integers
    //     expect((await this.instance.retrieve()).toString()).to.equal('42');
    // });
});
