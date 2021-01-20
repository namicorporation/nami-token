
// Use 'chai'
const chai = require('chai');
const { expect } = chai;
const BN = require('bn.js');
const {expectRevert} = require("@openzeppelin/test-helpers");
chai.use(require('chai-bn')(BN));
const Migrations = artifacts.require('Migrations');

// Start test block
contract ('Migrations', function ([ owner, other, other2 ]) {
    beforeEach(async function () {
        // Deploy a new contract for each test
        this.instance = await Migrations.new({ from: owner });
    });

    it('Change owner', async function() {
        await expectRevert(
            this.instance.changeOwner(other, {from: other2}),
            "This function is restricted to the contract's owner",
        );
        await this.instance.changeOwner(other);
        await expectRevert(
            this.instance.changeOwner(other2, {from: owner}),
            "This function is restricted to the contract's owner",
        );
        await this.instance.setCompleted(10, {from: other});
        expect(await this.instance.last_completed_migration()).to.be.bignumber.equal(new BN(10));
    });
});
