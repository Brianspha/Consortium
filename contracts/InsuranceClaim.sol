 pragma solidity 0.4 .24;
 import "./HelperFunctions.sol";

 //@Dev Keeps track of every insurance claim made 

 contract InsuranceClaim is HelperFunctions {
     //TO Edit add insurance company with which the claim is being submitted to
     mapping(uint256 => Claim) Claims; //@Dev Keeps track of all claims paidout
     uint256 TotalClaims;
     uint256 PendingApprovalsCount;
     constructor() {
         TotalClaims = 0;
         PendingApprovalsCount = 0;
         GeneralLogger("InsuranceClaims Ledger created succesfully");
     }

     function AddClaim(address claimerId, uint256 Type) payable public returns(string message) {
         if (claimerId == address(0)) {
             message = "Invalid Claimer ID";
             emit GeneralLogger(message);
             return message;
         }
      //   Claims[PendingApprovalsCount++] = Claim(claimerId, amount, CompanyId, false);

         message = "Succesfully paid out claim";
         emit GeneralLogger(message);
         return message;
     }
     //@Dev Change a policy to make a claim for theft of the item. fails if the state of the claim is something other than holding.
     function TheftClaim(uint256 Reference) public returns(string message) {
         Claim temp = Claims[Reference];
         temp.State = 2;
         if (temp.State == 1) {
             message = "Claim is now pending. \nOnce an affidavit written by the police has been received by internal resources, the claim will be paid out.";
         } else {
             message = "This claim has either been paid out, expired or is already pending.";

         }
        emit GeneralLogger(message);
         return message;

     }

     //@Dev Change a policy to make a claim for damage of the item. fails if the state of the claim is something other than holding.
     function DamageClaim(uint256 Reference) public returns(string message) {
         Claim temp = Claims[Reference];
         if (temp.State == 1) {
             temp.State = 2;
             message = "Claim is now pending. \nOnce the shop where the item was purchased has confirmed the damage, the claim will be paid out.";
         } else {
             message = "This claim has either been paid out, expired or is already pending.";

         }
         emit GeneralLogger(message);
         return message;
     }
     //@Dev this function is a stub. It will simply change the state of a claim received to paid out if state = 2
     function Validification(uint256 Reference) public returns(string message) {
         Claim temp = Claims[Reference];
         if (temp.State == 2) {
             temp.State = 3;
             message = "Proof has been received.     \nThe claim will now be paid out in full to the customer";
             return message;
         } else {
             message = "This policy has either been paid out already or no claim has been made on it.\nNo changes made.";
             return message;
         }
         emit GeneralLogger(message);
         return message;
     }

     //TODO Add other functions
     //Like approving claims
     //discarding claims cause of fraudulant activity
     //Keep it simple
 }