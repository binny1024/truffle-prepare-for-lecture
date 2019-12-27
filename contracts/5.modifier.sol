pragma solidity >=0.4.22 <0.6.0;
contract HelloWorld4 {
    address public sender;
    constructor() public {
        sender = msg.sender;
    }
    modifier onlyOwner() {
        if(msg.sender != sender) revert();
        _;
    }
    function a() onlyOwner public {

    }
}
