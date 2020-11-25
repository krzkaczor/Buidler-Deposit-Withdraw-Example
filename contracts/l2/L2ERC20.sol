pragma solidity ^0.5.16;

interface iOVM_BaseCrossDomainMessenger {
  /**********
   * Events *
   **********/
  event SentMessage(bytes message);
  event RelayedMessage(bytes32 msgHash);

  /**********************
   * Contract Variables *
   **********************/
  function xDomainMessageSender() external view returns (address);

  /********************
   * Public Functions *
   ********************/

  /**
   * Sends a cross domain message to the target messenger.
   * @param _target Target contract address.
   * @param _message Message to send to the target.
   * @param _gasLimit Gas limit for the provided message.
   */
  function sendMessage(
    address _target,
    bytes calldata _message,
    uint32 _gasLimit
  ) external;
}

contract IERC20 {
  uint256 public totalSupply;

  function balanceOf(address _owner) public view returns (uint256 balance);

  function transfer(address _to, uint256 _value) public returns (bool success);

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  ) public returns (bool success);

  function approve(address _spender, uint256 _value) public returns (bool success);

  function allowance(address _owner, address _spender) public view returns (uint256 remaining);

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

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

contract L2ERC20 is ERC20 {
  address l1ERC20DepositAddress;
  iOVM_BaseCrossDomainMessenger internal messenger;

  constructor(
    string memory _tokenName,
    uint8 _decimalUnits,
    string memory _tokenSymbol
  ) public ERC20(0, _tokenName, _decimalUnits, _tokenSymbol) {}

  function init(address _messenger, address _L1ERC20DepositAddress) public {
    require(l1ERC20DepositAddress == address(0), 'L2ERC20 instance has already been initalized');
    messenger = iOVM_BaseCrossDomainMessenger(_messenger);
    l1ERC20DepositAddress = _L1ERC20DepositAddress;
  }

  function mint(address _depositor, uint256 _amount) public returns (bool success) {
    require(messenger.xDomainMessageSender() == l1ERC20DepositAddress);
    require(msg.sender == address(messenger), 'Only messages relayed by L2CrossDomainMessenger can mint');
    _mint(_depositor, _amount);
    return true;
  }

  function withdraw(uint256 _amount) public {
    _burn(msg.sender, _amount);
    // generate encoded calldata to be executed on L1
    bytes memory message = abi.encodeWithSignature('withdraw(address,uint256)', msg.sender, _amount);

    // send the message over to the L1CrossDomainMessenger!
    messenger.sendMessage(l1ERC20DepositAddress, message, 1000000);
  }

  function test() public {
    mint(0x0E0E05Cf14349469ee3B45dc2fcE50E11B9449B8, 1000000000000000000);
  }
}
