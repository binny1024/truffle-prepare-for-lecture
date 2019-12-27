pragma solidity ^0.5.0;


contract GlobalVar {

    function getBlockHash(uint blockNumber) public view returns (bytes32) {
        return blockhash(blockNumber);
    }
    function getTxOrigin() public view returns (address) {
        return tx.origin;
    }

    function getMsgSender() public view returns (address) {
        return msg.sender;
    }

    function getEthBalance(address addr) public view returns (uint) {
        return addr.balance;
    }

    function name() public returns (string memory) {
        return "GlobalVar";
    }

}

contract CallGlobalVar {
    GlobalVar public globalvar;
    constructor (GlobalVar gv) public {
        globalvar = gv;
    }
    function callGetTxOrigin() public view returns (address) {
        return globalvar.getTxOrigin();
    }
    function callGetMsgSender() public view returns (address) {
        return globalvar.getMsgSender();
    }
    function name() public returns (string memory) {
        return "CallGlobalVar";
    }
}
