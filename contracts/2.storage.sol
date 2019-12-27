pragma solidity >=0.4.33 <0.6.0;
contract HelloWorld1{
    string public a;
    constructor() public {
        a = "abc";
    }
    function updateNum() public {
        changeNum(a);
    }
    function changeNum(string memory aa) internal {
        aa = "d";
    }
}