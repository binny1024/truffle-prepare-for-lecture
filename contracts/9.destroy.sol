pragma solidity ^0.5.0;


contract Destroy {

    function destroy(address payable forwardFundsAddr) public {
        selfdestruct(forwardFundsAddr);
    }

    function () payable external {

    }
    function name() public returns (string memory) {
        return "Destroy";
    }

}
