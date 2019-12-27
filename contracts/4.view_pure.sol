pragma solidity >=0.4.22 <0.6.0;
contract HelloWorld3 {
    uint public age;
    function constantViewPure() public {
        age = 29;
    }

    function getAgeByView() public view returns (uint) {
        // age += 1;  //compiling should be error
        return age;
    }
    function getAgeByPure() public pure returns (uint) {
        // return age; // compiling should be error;
        return 1;
    }
}
