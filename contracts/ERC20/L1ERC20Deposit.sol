pragma solidity ^0.5.0;

import { IERC20 } from "./ERC20.interface.sol";
import { IL1CrossDomainMessenger } from "@eth-optimism/rollup-contracts/build/contracts/bridge/L1CrossDomainMessenger.interface.sol";

contract L1ERC20Deposit {
    IL1CrossDomainMessenger L1CrossDomainMessenger;
    address L2ERC20Address;
    IERC20 L1ERC20;

    constructor (
        address _L1CrossDomainMessengerAddress,
        address _L1ERC20Address,
        address _L2ERC20Address
    ) public {
        L1CrossDomainMessenger = IL1CrossDomainMessenger(_L1CrossDomainMessengerAddress);
        L1ERC20 = IERC20(_L1ERC20Address);
        L2ERC20Address = _L2ERC20Address;
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
        bytes memory messageData = abi.encodeWithSignature(
            "mint(address,uint256)",
            _depositer,
            _amount
        );
        L1CrossDomainMessenger.sendMessage(L2ERC20Address, messageData, uint32(gasleft()));
    }

    function withdraw(
        address _withdrawer,
        uint _amount
    ) public {
        require(msg.sender == address(L1CrossDomainMessenger));
        require(L1CrossDomainMessenger.xDomainMessageSender() == L2ERC20Address);
        L1ERC20.transfer(_withdrawer, _amount);
    }
}