pragma solidity >=0.4.22 <0.6.0;
contract Test {
    function publicFunc() public {}
    function callFunc() public {
        publicFunc();
        this.publicFunc();
    }
    function internalFunc() internal {}
    function externalFunc() external {}
    function name() public view returns (string memory) {
        return "Test";
    }
}

contract HelloWorld2 {
    function externalCall(Test ft) public {
        ft.publicFunc();
        ft.externalFunc();
        // ft.internalFunc();
    }
    function name() public view returns (string memory) {
        return "HelloWorld2";
    }
}