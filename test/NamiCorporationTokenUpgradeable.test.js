
const {expectRevert} = require("@openzeppelin/test-helpers");
const NamiCorporationTokenUpgradeable = artifacts.require('NamiCorporationTokenUpgradeable');
const _ = require('lodash');
const BN = require('bn.js');
const chai = require('chai');
const {expectEvent, constants} = require("@openzeppelin/test-helpers");
const { expect } = chai;
chai.use(require('chai-bn')(BN));

// Start test block
contract ('NamiCorporationTokenUpgradeable', function ([owner, other, other2, other3, _other4]) {
    beforeEach(async function () {
        // Deploy a new contract for each test
        this.instance = await NamiCorporationTokenUpgradeable.new({ from: owner });
        this.instance.initialize('Nami Corporation Token', 'NAMI');
    });
    //
    // // Test case


//
    async function testMintableOfAddress(address, addressToMint) {
        const balanceBefore = await this.instance.balanceOf(addressToMint);
        const randomValueToMint = _.random(1, 100);
        const mintEvent = await this.instance.mint(addressToMint, new BN(randomValueToMint), {from: address});
        expectEvent(mintEvent, 'Transfer', {
            from: constants.ZERO_ADDRESS,
            to: addressToMint,
            value: new BN(randomValueToMint),
        })
        expect(await this.instance.balanceOf(addressToMint)).to.be.bignumber.equal(balanceBefore.add(new BN(randomValueToMint)));
    }
    describe('Check role minter', function() {
        it('non-minter role not allowed to mint', async function () {
            expectRevert(
                this.instance.mint(owner, 100, { from: other }),
                'NAMI: must have minter role to mint',
            )
        });
        it('owner is allowed to mint', async function () {
            await testMintableOfAddress.call(this, owner, other);
        });
        it('grant role to mint', async function () {
            // Grant role
            const roleEvent = await this.instance.grantRole(await this.instance.MINTER_ROLE(), other2);
            expectEvent(roleEvent, 'RoleGranted', {
                role: await this.instance.MINTER_ROLE(),
                account: other2,
                sender: owner,
            });

            await testMintableOfAddress.call(this, other2, other3);
        });
    });


    async function testPausableOfAddress(address) {
        const pauseEvent = await this.instance.pause({from: address});
        expectEvent(pauseEvent, 'Paused', {
            account: address,
        });
        await expectRevert(
            this.instance.transfer(other, 100),
            'ERC20Pausable: token transfer while paused',
        );
    }
    describe('Check role pauser', function() {
        it('non-pauser role not allowed to pause', async function () {
            await expectRevert(
                this.instance.pause({from: other}),
                'NAMI: must have pauser role to pause',
            )
        });
        it('owner is allowed to pause', async function () {
            await testPausableOfAddress.call(this, owner);
        });
        it('grant role to mint', async function () {
            // Grant role
            const roleEvent = await this.instance.grantRole(await this.instance.PAUSER_ROLE(), other3);
            expectEvent(roleEvent, 'RoleGranted', {
                role: await this.instance.PAUSER_ROLE(),
                account: other3,
                sender: owner,
            });

            await testPausableOfAddress.call(this, other3);
        });
        it('cannot transfer after paused', async function() {
            await this.instance.pause();
            await expectRevert(
                this.instance.transfer(other2, 1000),
                'ERC20Pausable: token transfer while paused',
            );
        })
        it('continue transferable after unpause', async function() {
            await this.instance.pause();
            await expectRevert(
                this.instance.transfer(other, 1000),
                'ERC20Pausable: token transfer while paused',
            );
            await this.instance.unpause();
            await this.instance.transfer(other2, 1000);
        })
    });
});
