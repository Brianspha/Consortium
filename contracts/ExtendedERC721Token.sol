pragma solidity 0.4.24;
import "./ERC721Token.sol";

//@Dev extended ERC721 token contract to allow user to buy a token
contract ExtendedERC721Token is ERC721Token
{
 uint256 TokenIndex;
 event GeneralLogger(string message);
 struct TokenOwner //!@Dev used to keep track of each token purchased
 {
     address ID;
     uint256 TokensBought;
     mapping(uint256 => uint256) TokenIndexes;
     uint256 LatestTokenIndex;//Keeps track of the latest index bought by user
     bool Activated;
 }
 mapping(address=>  TokenOwner) TokenOwners;
 mapping(address=> TokenOwner) Doctors; //used to keep track of every doctor 
 mapping(address=> TokenOwner) HealthInstitutions; //used to keep track of every HealthInstitution 

//@Dev Constructor called when contract is mined
 constructor ()
 {
  TokenIndex=0;
  emit GeneralLogger("Initialised contract");
 }
//@Dev each user will be identified by a token each token is unique
function PurchaseToken(address to) payable returns (string message)
{
    if(to==address(0))
    {
     message="Invalid address";
     emit GeneralLogger(message);
     return message;
    }
    message="Purchased Token Succesfully";
    if(TokenOwners[to].Activated)
    {
     TokenOwners[to].TokenIndexes[TokenOwners[to].TokensBought-1]=TokenIndex;
     TokenOwners[to].TokensBought++;
    }
    else
    {
     TokenOwners[to]= TokenOwner(to,1,TokenIndex,true);
    }
    emit GeneralLogger(message);
    addTokenTo(to,TokenIndex++);
}

//@Dev each user will be identified by a token each token is unique
//I used the same struct as a normal Token purely cause of laziness to restrict it to specifically working for 
//Doctors i ensured a doctor has only one token
function PurchaseTokenDoctor(address to) payable returns (string message)
{
    if(to==address(0))
    {
     message="Invalid address";
     emit GeneralLogger(message);
     return message;
    }
    if(Doctors[to].Activated && Doctors[to].TokensBought>=1)
    {
         message="Purchase of Token Failed Doctor already has Token assigned";
         emit GeneralLogger(message);
         return message;
    }
    else
    {
     Doctors[to]= TokenOwner(to,1,TokenIndex,true);
    }
    emit GeneralLogger(message);
    addTokenTo(to,TokenIndex++);
}

//@Dev each user will be identified by a token each token is unique
//I used the same struct as a normal Token purely cause of laziness to restrict it to specifically working for 
//Doctors i ensured a doctor has only one token
function PurchaseTokenHealthInstitution(address to) payable returns (string message)
{
    if(to==address(0))
    {
     message="Invalid address";
     emit GeneralLogger(message);
     return message;
    }
    if(Doctors[to].Activated && Doctors[to].TokensBought>=1)
    {
         message="Purchase of Token Failed HealthInstitution already has Token assigned";
         emit GeneralLogger(message);
         return message;
    }
    else
    {
     HealthInstitutions[to]= TokenOwner(to,1,TokenIndex,true);
    }
    emit GeneralLogger(message);
    addTokenTo(to,TokenIndex++);
}

//@Dev returns the latest TokenIndex Bought
function GetLatestTokenIndex(address user) view returns (uint256 index)
{
    if(!TokenOwners[user].Activated)
    {
        return uint256(-1);
    }
    return TokenOwners[user].LatestTokenIndex;
}
//@Dev returns the latest TokenIndex Bought
function GetLatestTokenIndexDoctor(address user) view returns (uint256 index)
{
    if(!Doctors[user].Activated)
    {
        return uint256(-1);
    }
    return Doctors[user].LatestTokenIndex;
}

//@Dev returns the latest TokenIndex Bought
function GetLatestTokenIndexHealthInstitution(address user) view returns (uint256 index)
{
    if(!Doctors[user].Activated)
    {
        return uint256(-1);
    }
    return HealthInstitutions[user].LatestTokenIndex;
}
}