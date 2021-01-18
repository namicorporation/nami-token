
// Use 'chai'
const chai = require('chai');
const { expect } = chai;
const BN = require('bn.js');
const {expectRevert, expectEvent} = require("@openzeppelin/test-helpers");
chai.use(require('chai-bn')(BN));
const NamiCorporationTokenUpgradeable = artifacts.require('NamiCorporationTokenUpgradeable');

// Start test block
contract ('NamiCorporationTokenUpgradeable', function ([ owner, _other ]) {
    beforeEach(async function () {
        // Deploy a new contract for each test
        this.instance = await NamiCorporationTokenUpgradeable.new({ from: owner });
        this.instance.initialize('Nami Corporation Token', 'NAMI');
    });
    //
    // // Test case

    //
    const ADDRESS = '0x9F336FBC915e30948134e9Ec11eeAe08ea3558c2';
    // it('add to blacklist', async function () {
    //     console.log(11111111)
    //     const addReceipt = await this.instance.addToBlacklist(ADDRESS, { from: owner });
    //     expectEvent(addReceipt, 'BlacklistAdded', {
    //         account: ADDRESS,
    //         sender: owner,
    //     });
    //     expect(await this.instance.isBlacklisted(ADDRESS)).to.equal(true);
    //     expect(await this.instance.getBlacklistedAddressesCount()).to.be.bignumber.equal(new BN('1'));
    //     expect(await this.instance.getBlacklistedAddressAt(0)).to.equals(ADDRESS);
    //
    //     console.log('-------11111111')
    // });
    it('remove from blacklist', async function () {
        const removeReceipt = await this.instance.removeFromBlacklist(ADDRESS);
        expectEvent(removeReceipt, 'BlacklistRemoved', ADDRESS, owner);
        expect(await this.instance.isBlacklisted(ADDRESS)).to.equal(false);
        expect(await this.instance.getBlacklistedAddressesCount()).to.be.bignumber.equal(new BN(0));
        await expectRevert(
            this.instance.getBlacklistedAddressAt(0),
            'AddressBlockable: index exceeds length',
        );
    });
});
