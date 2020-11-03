pragma solidity ^0.5.0;

import { IERC20 } from "./ERC20.interface.sol";
import { ERC20 } from "./ERC20.sol";
import { L1ERC20Deposit } from "./L1ERC20Deposit.sol";
import { console } from "@nomiclabs/buidler/console.sol";

contract L2ERC20 is ERC20 {
    L1ERC20Deposit l1ERC20Deposit;
    //IERC20 l1ERC20;
    bool private initalized;

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public ERC20(_initialAmount, _tokenName, _decimalUnits, _tokenSymbol) {}

    function init(
        address _L1ERC20DepositAddress
        //address _L1ERC20Address
    ) public {
        require(!initalized, "L2ERC20 instance has already been initalized");
        initalized = true;
        l1ERC20Deposit = L1ERC20Deposit(_L1ERC20DepositAddress);
        //l1ERC20 = IERC20(_L1ERC20Address);
        //console.log("called init. dep c addr: ", _L1ERC20DepositAddress);
    }

    function deposit(address _depositor, uint256 _amount) public returns (bool success) {
        _mint(_depositor, _amount);
        return true;
    }

  function withdraw(address _depositor, uint256 _amount) public { 
        console.log("to burn!", msg.sender,  _amount);
        require(msg.sender == _depositor);
        _burn(msg.sender, _amount);
        l1ERC20Deposit.withdraw(msg.sender, _amount); 
    }
}
