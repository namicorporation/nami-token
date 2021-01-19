
// Use 'chai'
const chai = require('chai');
const { expect } = chai;
const BN = require('bn.js');
const {expectRevert, expectEvent} = require("@openzeppelin/test-helpers");
chai.use(require('chai-bn')(BN));
const NamiCorporationTokenUpgradeable = artifacts.require('NamiCorporationTokenUpgradeable');

// Start test block
contract ('NamiCorporationTokenUpgradeable', function ([ owner, other, other2 ]) {
    beforeEach(async function () {
        // Deploy a new contract for each test
        this.instance = await NamiCorporationTokenUpgradeable.new({ from: owner });
        this.instance.initialize('Nami Corporation Token', 'NAMI');
    });
    //
    // // Test case

    //
    const ADDRESS = '0x9F336FBC915e30948134e9Ec11eeAe08ea3558c2';
    describe('Check add to blacklist', function() {
        it('add to blacklist', async function () {
            const addReceipt = await this.instance.addToBlacklist(ADDRESS, { from: owner });
            expectEvent(addReceipt, 'BlacklistAdded', {
                account: ADDRESS,
                sender: owner,
            });
            expect(await this.instance.isBlacklisted(ADDRESS)).to.equal(true);
            expect(await this.instance.getBlacklistedAddressesCount()).to.be.bignumber.equal(new BN('1'));
            expect(await this.instance.getBlacklistedAddressAt(0)).to.equals(ADDRESS);
        });
        it('add to blacklist from non-role address', async function () {
            await expectRevert(
                this.instance.addToBlacklist(ADDRESS, { from: other }),
                'AddressBlockable: must have blacklist manager role to add',
            );
        });
    });
    describe('Check remove from blacklist', function() {
        it('remove from blacklist', async function () {
            await this.instance.addToBlacklist(ADDRESS, { from: owner });
            const removeReceipt = await this.instance.removeFromBlacklist(ADDRESS);
            expectEvent(removeReceipt, 'BlacklistRemoved', {
                account: ADDRESS,
                sender: owner,
            });
            expect(await this.instance.isBlacklisted(ADDRESS)).to.equal(false);
            expect(await this.instance.getBlacklistedAddressesCount()).to.be.bignumber.equal(new BN(0));
            await expectRevert(
                this.instance.getBlacklistedAddressAt(0),
                'AddressBlockable: index exceeds length',
            );
        });
        it('remove from blacklist from non-role address', async function () {
            await this.instance.addToBlacklist(ADDRESS, { from: owner });
            await expectRevert(
                this.instance.removeFromBlacklist(ADDRESS, { from: other }),
                'AddressBlockable: must have blacklist manager role to remove',
            );
        });
    });
    describe('Check transfer', () => {
        it('transfer from blacklisted address', async function () {
            await this.instance.addToBlacklist(other);
            await expectRevert(
                this.instance.transfer(owner, 1, { from: other }),
                'AddressBlockable: invalid sender or recipient',
            );
        });
        it('transfer to blacklisted address', async function () {
            await this.instance.addToBlacklist(other);
            await expectRevert(
                this.instance.transfer(other, 1, { from: owner }),
                'AddressBlockable: invalid sender or recipient',
            );
        });
        it('transfer ok to non blacklisted address', async function () {
            await this.instance.addToBlacklist(other);
            const balanceBefore = await this.instance.balanceOf(other2);
            this.instance.transfer(other2, 5, { from: owner });
            expect(await this.instance.balanceOf(other2)).to.be.bignumber.equal(balanceBefore.add(new BN(5)));
        });
    });
});
