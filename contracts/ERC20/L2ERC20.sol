pragma solidity ^0.5.0;

import { IERC20 } from "./ERC20.interface.sol";
import { ERC20 } from "./ERC20.sol";

contract L2ERC20 is ERC20 {
    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public ERC20(_initialAmount, _tokenName, _decimalUnits, _tokenSymbol) {}

    function _mint(address _owner, uint256 _value) public returns (bool success) {
        balances[_owner] += _value;
        totalSupply += _value;
        return true;
    }

    function _burn(address _owner, uint256 _value) internal returns (bool success) {
        require(balances[_owner] >= _value, "account doesn't have enough coins to burn");
        balances[_owner] -= _value;
        totalSupply -= _value;
        return true;
    }

    function withdraw(uint256 _amount) public {
        _burn(msg.sender, _amount);
        // TODO send L1 ERC20 funds back to msg.sender
    }
}
