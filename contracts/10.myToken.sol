pragma solidity ^0.5.0;

import "./zeplin_lib/token/ERC20/ERC20Detailed.sol";
import "./zeplin_lib/GSN/Context.sol";
import "./zeplin_lib/token/ERC20/ERC20.sol";

contract MyToken is Context, ERC20, ERC20Detailed {

    address public minter; // here minter should be set as the ETH cross chain managing contract 
    address public manager;
    mapping(uint64 => bytes) public contractAddrBindChainId;

    event BindContractAddrWithChainIdEvent(uint64 chainId, bytes contractAddr);
    event SetMinterEvent(address minter);

    
    modifier onlyMinter() {
        require(_msgSender() == minter) ;
        _;
    }

    modifier onlyManager() {
        require(_msgSender() == manager) ;
        _;
    }
    
    constructor () public ERC20Detailed("MyFirstToken", "MFT", 8) {
        _mint(_msgSender(), 21000000 * (10 ** uint256(decimals())));
        manager = _msgSender();
    }


    /* @notice              Mint amount of tokens to the account
    *  @param account       The account which will receive the minted tokens
    *  @param amount        The amount of tokens to be minted
    */
    function mint(address account, uint256 amount) public onlyMinter returns (bool) {
        _mint(account, amount);
        return true;
    }
    
    /* @notice              Burn amount of tokens from the msg.sender's balance
    *  @param amount        The amount of tokens to be burnt
    */
    function burn(uint256 amount) public returns (bool) {
        _burn(_msgSender(), amount);
        return true;
    }
    
    /* @notice                              Set the ETH cross chain contract as the minter such that the ETH cross chain contract 
    *                                       will be able to mint tokens to the designated account after a certain amount of tokens
    *                                       are locked in the source chain
    *  @param ethCrossChainContractAddr     The ETH cross chain management contract address
    */
    function setMinter(address ethCrossChainContractAddr) onlyManager public {
        minter = ethCrossChainContractAddr;
        emit SetMinterEvent(ethCrossChainContractAddr);
    }
    
    /* @notice              Bind the target chain with the target chain id
    *  @param chainId       The target chain id
    *  @param contractAddr  The specific contract address in bytes format in the target chain
    */
    function bindContractAddrWithChainId(uint64 chainId, bytes memory contractAddr) onlyManager public {
        require(chainId >= 0, "chainId illegal!");
        contractAddrBindChainId[chainId] = contractAddr;
        emit BindContractAddrWithChainIdEvent(chainId, contractAddr);
    }
    

}