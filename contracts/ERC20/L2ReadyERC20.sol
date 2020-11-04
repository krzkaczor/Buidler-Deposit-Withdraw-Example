pragma solidity ^0.5.0;

/* Contract Imports */
import { ERC20 } from "./ERC20.sol";

/* Interface Imports */
import { IERC20 } from "./ERC20.interface.sol";
import { ICrossDomainMessenger } from "@eth-optimism/rollup-contracts/build/contracts/bridge/interfaces/CrossDomainMessenger.interface.sol";

/**
 * @title L2ReadyERC20
 */
contract L2ReadyERC20 is ERC20 {

    /*************
     * Variables *
     *************/

    ICrossDomainMessenger internal messenger;
    address internal otherERC20;


    /***************
     * Constructor *
     ***************/

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    )
        public
        ERC20(
            _initialAmount,
            _tokenName,
            _decimalUnits,
            _tokenSymbol
        )
    {}


    /********************
     * Public Functions *
     ********************/

    /**
     * Sets up the contract to be ready to interact across domains.
     * @param _messenger Address of the current domain's messenger (L1 or L2 messenger).
     * @return _otehrERC20 Address of the corresponding ERC20 on the other domain.
     */
    function init(
        address _messenger,
        address _otherERC20
    )
        public
    {
        messenger = ICrossDomainMessenger(_messenger);
        otherERC20 = _otherERC20;
    }

    /**
     * Sends a message to transfer tokens to the other domain.
     * @param _amount Amount to transfer.
     * @return _success Whether or not this operation completed successfully.
     */
    function xDomainTransfer(
        uint _amount
    )
        public
        returns (
            bool _success
        )
    {
        // Burn the amount being transferred.
        _burn(
            msg.sender,
            _amount
        );

        // Generate encoded calldata to be executed on L2.
        bytes memory message = abi.encodeWithSignature(
            "xDomainMint(address,uint256)",
            msg.sender,
            _amount
        );

        // Send the message over to the L1CrossDomainMessenger!
        messenger.sendMessage(otherERC20, message, 1000000);

        return true;
    }

    /**
     * Mints tokens on behalf of some user if called by the other ERC20 contract.
     * @param _to Address to mint tokens for.
     * @param _amount Amount to mint.
     * @return _success Whether or not this operation completed successfully.
     */
    function xDomainMint(
        address _to,
        uint256 _amount
    )
        public
        returns (
            bool _success
        )
    {
        require(
            messenger.xDomainMessageSender() == otherERC20,
            "Minting message must be sent by the other ERC20 deposit contract."
        );

        _mint(_to, _amount);

        return true;
    }
}
