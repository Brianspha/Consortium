pragma solidity 0.4.24;
import "./InsuranceClaim.sol";
import "./HelperFunctions.sol";

//@Dev Validates Claims made by specific persons using embeded business rules 
//Also by consulting the public Insurance claims Ledger
contract ClaimsValidatorLedger is HelperFunctions
{
    InsuranceClaim internalInsuranceClaimsLedger;
    //@Dev constructor
    constructor(address ledgerAddress )
    { 
        internalInsuranceClaimsLedger = InsuranceClaim(ledgerAddress);
    }
    function TheftClaim (uint256 Reference) returns (bool valid)
    {
        unit256 Reference; //@Dev unique value for each claim
        address ClaimerId;//@Dev used to identify recipient whos claim this is
        uint256 amount;//@Dev the amount that was paid out
        bool Approved;//@Dev indicates whether or not the claim has been approved or not 
        
    }

}