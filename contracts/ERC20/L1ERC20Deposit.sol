pragma solidity ^0.5.0;

import { IERC20 } from "./ERC20.interface.sol";

contract L1ERC20Deposit {
    IERC20 L2ERC20;
    IERC20 L1ERC20;

    constructor (
        address _L1ERC20Address,
        address _L2ERC20Address
    ) public {
        L1ERC20 = IERC20(_L1ERC20Address);
        L2ERC20 = IERC20(_L2ERC20Address);
    }

    function deposit(
        address _depositer,
        uint _amount
    ) public {
        L1ERC20.transferFrom(
            _depositer,
            address(this),
            _amount
        );
        //TODO Mint on L2!
    }

    function withdraw(
        address _withdrawer,
        uint _amount
    ) public {
        L1ERC20.transfer(_withdrawer, _amount);
    }
}