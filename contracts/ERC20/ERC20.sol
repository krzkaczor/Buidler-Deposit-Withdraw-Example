pragma solidity ^0.5.0;

import 'hardhat/console.sol';

import {IERC20} from './ERC20.interface.sol';

contract ERC20 is IERC20 {
  uint256 private constant MAX_UINT256 = 2**256 - 1;
  mapping(address => uint256) public balances;
  mapping(address => mapping(address => uint256)) public allowed;

  string public name;
  uint8 public decimals;
  string public symbol;

  constructor(
    uint256 _initialAmount,
    string memory _tokenName,
    uint8 _decimalUnits,
    string memory _tokenSymbol
  ) public {
    balances[msg.sender] = _initialAmount;
    totalSupply = _initialAmount;
    name = _tokenName;
    decimals = _decimalUnits;
    symbol = _tokenSymbol;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balances[msg.sender] >= _value);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) public returns (bool success) {
    uint256 allowance = allowed[_from][msg.sender];
    console.log('_from', _from);
    console.log('allowance', allowance);
    console.log('balances[_from]', balances[_from]);
    require(balances[_from] >= _value && allowance >= _value, 'allowance');
    balances[_to] += _value;
    balances[_from] -= _value;
    if (allowance < MAX_UINT256) {
      allowed[_from][msg.sender] -= _value;
    }
    emit Transfer(_from, _to, _value);
    return true;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    console.log('Setting up allowance from, spender, value', msg.sender, _spender, _value);

    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

  function _mint(address _owner, uint256 _value) internal returns (bool success) {
    balances[_owner] += _value;
    totalSupply += _value;
    return true;
  }

  function _burn(address _owner, uint256 _value) internal returns (bool success) {
    require(balances[_owner] >= _value, "Account doesn't have enough coins to burn");
    balances[_owner] -= _value;
    totalSupply -= _value;
    return true;
  }
}
