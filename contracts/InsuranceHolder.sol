pragma solidity 0.4.24;
 
import "./HelperFunctions.sol";
import "./InsuranceClaim.sol";

contract InsuranceHolder is HelperFunctions
{
//@Dev represents each insurance holder   
//Note: The assumption here is that the holder can have any medical procedure as long as they have 
//The neccesary funds to cover that procedure
//However the contract can be modified to restrict the different procedures covered by the insurance company 


//@Dev Keeps track of all regitered Insurance holders
 mapping(address=> Holder) Holders;

InsuranceClaim InternalClaimsContract;

 //@Dev constructor
  constructor(address claimAddress) public {
  InternalClaimsContract=InsuranceClaim(claimAddress);
  }
//@Dev registers a new Insurance Holder onto the system
//NB: Users are checked against the Government database
function RegisterHolder(uint256 intialcover,address id) returns (string message)
{
  if(id==address(0))//@Dev make sure the user is not the 0th account burner account if thats the case revert transaction 
  {
      message = "Invalid Address";
      emit GeneralLogger(message);
      return message;
  }

  if(Holders[id].Activated)
  {
    message ="User already registered";
    emit GeneralLogger(message);
    return message;
  } 
  if(intialcover <0)
  {
    intialcover=0;
  }
  else
  {
    Holder memory temp =Holder(id,true,0,0,intialcover,false);
    Holders[id]=temp;
    message="Successfully registered User";
    emit GeneralLogger(message);
    return message;
  }
}

//@Dev removes the specified doctor
function Archive(address id) returns (string message)
{
    if(id==address(0))
    {
        message="Invalid address";
        emit GeneralLogger(message);
        return message;
    }
    else if(!Holders[id].Activated)
    {
     message="Holder does not exist";
     emit GeneralLogger(message);
     return message;
    }
     Holders[id].Archived=true;
    message="Holder archived";
    emit GeneralLogger(message);
}
//@Dev allows user to add money to they cover plan N.B. payable to allow users to transfer ether
function PayCover(address holderId,uint256 amount) payable returns (string message)
{
     if(holderId== address(0))
     {
         message="Invalid address";
         emit GeneralLogger(message);
         return message;
     }
     if(amount <0)
     {
         message="Invalid payment";
         emit GeneralLogger(message);
         return message;
     }
     if(!Holders[holderId].Activated)
     {
         message="Insurance Holder does not exist";
         emit GeneralLogger(message);
         return message;
     }
     Holders[holderId].AmountCoveredFor += amount;
     message="Payment for insurance cover succesfull";
     emit GeneralLogger(message);
}

//TODO
//Update Holder information
//Remove Holder
//and any other functions
//Please keep code format consistant 
}