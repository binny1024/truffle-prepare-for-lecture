pragma solidity ^0.5.0;


contract Overflow {

    function safeAdd(uint256 a, uint256 b) public view returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "addition overflow");

        return c;
    }
    function add(uint256 a, uint256 b) public view returns (uint256) {
        uint256 c = a + b;
        return c;
    }
    function safeSub(uint256 a, uint256 b) public view returns (uint256) {
        require(b <= a, "subtraction overflow");
        uint256 c = a - b;
        return c;
    }

    function sub(uint256 a, uint256 b) public view returns (uint256) {
        uint256 c = a - b;
        return c;
    }
    function name() public returns (string memory) {
        return "Overflow";
    }

}
