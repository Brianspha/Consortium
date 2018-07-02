 pragma solidity 0.4.24;
import "./HelperFunctions.sol";

//@Dev Keeps track of every insurance claim made 
contract InsuranceClaim is HelperFunctions
{
 //TO Edit add insurance company with which the claim is being submitted to
    mapping(uint256 => Claim) Claims;//@Dev Keeps track of all claims paidout
    mapping (uint256 => Claim) ToBeApproved;//@Dev pending claims that need approval
    uint256 TotalClaims;
    uint256 PendingApprovalsCount;
    ClaimsValidatorLedger InternalValidator;//@Dev used for delagating the verification of claims
    constructor ()
    {
      require(validtorAddress != address(0));//ensure valid address  
      TotalClaims=0;
      PendingApprovalsCount=0;
      GeneralLogger("InsuranceClaims Ledger created succesfully");
    }
    function AddClaim(address claimerId,uint256 Type) payable returns (string message)
    {
     if(claimerId == address(0))
     {
         message ="Invalid Claimer ID";
         emit GeneralLogger(message);
         return message;
     }
     if(CompanyId == address(0))
     {
         message ="Invalid Claimer ID";
         emit GeneralLogger(message);
         return message;
     }    
     else if(amount <0)
     {
         message="Amount cannot be negative";
        emit GeneralLogger(message);
         return message;
     }
     ToBeApproved[PendingApprovalsCount++]=Claim(claimerId,amount,CompanyId,false);
     
     message="Succesfully paid out claim";
     emit GeneralLogger(message);
     return message;
    }
    //@Dev function that returns all the values


    //TODO Add other functions
    //Like approving claims
    //discarding claims cause of fraudulant activity
    //Keep it simple
}