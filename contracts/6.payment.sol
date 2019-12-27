import "./zeplin_lib/payment/escrow/Escrow.sol";
contract Payment is Escrow {
    function name () public returns (string memory) {
        return "Payment";
    }
}