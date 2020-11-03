pragma solidity ^0.5.0;

import { IERC20 } from "./ERC20.interface.sol";
import { L2ERC20 } from "./L2ERC20.sol";
import { console } from "@nomiclabs/buidler/console.sol";



contract L1ERC20Deposit {
    L2ERC20 l2ERC20;
    IERC20 l1ERC20;

    constructor (
        address _L1ERC20Address,
        address _L2ERC20Address
    ) public {
        l1ERC20 = IERC20(_L1ERC20Address);
        l2ERC20 = L2ERC20(_L2ERC20Address);
    }

    function deposit(
        address _depositer,
        uint _amount
    ) public {
        l1ERC20.transferFrom(
            _depositer,
            address(this),
            _amount
        );
        l2ERC20.deposit(_depositer, _amount);
    }

    function withdraw( 
        address _withdrawer,
        uint _amount
    ) public {
        require(address(l2ERC20) == msg.sender); // this is authenticated
        l1ERC20.transfer(_withdrawer, _amount);
    }

    //function balance() public view returns (uint256 amount) {
    //    return l1ERC20.balanceOf(address(this));
    //}
 
}