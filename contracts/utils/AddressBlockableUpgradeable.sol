// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts-upgradeable/utils/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

/**
 * @dev Contract module that allows blocking addresses from transferring
 */
abstract contract AddressBlockableUpgradeable is Initializable, ERC20Upgradeable, AccessControlUpgradeable {
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
    using AddressUpgradeable for address;

    // Members
    EnumerableSetUpgradeable.AddressSet private _blacklistedAddresses;
    bytes32 public constant BLACKLIST_MANAGER_ROLE = keccak256("BLACKLIST_MANAGER_ROLE");

    // Events
    event BlacklistAdded(address account, address indexed sender);
    event BlacklistRemoved(address account, address indexed sender);


    function __AddressBlockable_init() internal initializer {
        __AccessControl_init_unchained();
        __AddressBlockable_init_unchained();
    }

    function __AddressBlockable_init_unchained() internal initializer {
    }

    /**
     * @dev Add an address to blacklist
     *
     * Requirements:
     *
     * - the caller must have ``role``'s blacklist manager role.
     */
    function addToBlacklist(address account) public {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to add");

        if (_blacklistedAddresses.add(account)) {
            emit BlacklistAdded(account, _msgSender());
        }
    }

    /**
     * @dev Remove an address from blacklist
     *
     * Requirements:
     *
     * - the caller must have ``role``'s blacklist manager role.
     */
    function removeFromBlacklist(address account) public {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to remove");

        if (_blacklistedAddresses.remove(account)) {
            emit BlacklistRemoved(account, _msgSender());
        }
    }

    /**
     */
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklistedAddresses.contains(account);
    }

    /**
     * @dev Returns the number of accounts those are in blacklist
     */
    function getBlacklistedMemberCount() public view returns (uint256) {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to view");

        return _blacklistedAddresses.length();
    }

    /**
     * @dev Returns the number of accounts those are in blacklist
     */
    function getBlacklistedMemberAt(uint256 index) public view returns (address) {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to view");

        return _blacklistedAddresses.at(index);
    }

    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!isBlacklisted(from) && !isBlacklisted(to), "AddressBlockable: invalid sender or recipient");
    }

    uint256[50] private __gap;
}
