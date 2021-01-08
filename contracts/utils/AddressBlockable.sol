// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Contract module that allows children to implement role-based access
 * control mechanisms.
 *
 * Roles are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique. The best way to achieve this is by
 * using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
 * ```
 *
 * Roles can be used to represent a set of permissions. To restrict access to a
 * function call, use {hasRole}:
 *
 * ```
 * function foo() public {
 *     require(hasRole(MY_ROLE, msg.sender));
 *     ...
 * }
 * ```
 *
 */
abstract contract AddressBlockable is ERC20, AccessControl {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Address for address;

    // Members
    EnumerableSet.AddressSet private _blacklistedAddresses;
    bytes32 public constant BLACKLIST_MANAGER_ROLE = keccak256("BLACKLIST_MANAGER_ROLE");

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
}
