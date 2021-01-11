// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Contract module that allows blocking addresses from transferring
 */
abstract contract AddressBlockable is ERC20, AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Address for address;

    EnumerableSet.AddressSet private _blacklistedAddresses;
    bytes32 public constant BLACKLIST_MANAGER_ROLE = keccak256("BLACKLIST_MANAGER_ROLE");

    // Events
    event BlacklistAdded(address account, address indexed sender);
    event BlacklistRemoved(address account, address indexed sender);

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
    function getBlacklistedAddressesCount() public view returns (uint256) {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to view");

        return _blacklistedAddresses.length();
    }

    /**
     * @dev Returns the number of accounts those are in blacklist
     */
    function getBlacklistedAddressAt(uint256 index) public view returns (address) {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to view");
        require(index < getBlacklistedAddressCount(), "AddressBlockable: index exceeds length");
        return _blacklistedAddresses.at(index);
    }

    /**
     * @dev Returns all Addresses inside blacklist
     */
    function getBlacklistedAddresses() public view returns (address[] memory) {
        require(hasRole(BLACKLIST_MANAGER_ROLE, _msgSender()), "AddressBlockable: must have blacklist manager role to view");

        address[] allAddresses;
        uint256 count = getBlacklistedAddressesCount();
        for (uint256 i = 0; i < count; ++i) {
            allAddresses.push(_blacklistedAddresses.at(i));
        }
        return allAddresses;
    }

    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!isBlacklisted(from) && !isBlacklisted(to), "AddressBlockable: invalid sender or recipient");
    }
}
