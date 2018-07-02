pragma solidity 0.4.24;
import "./HelperFunctions.sol";
import "./ExtendedERC721Token.sol";
//@Dev Keeps track of every resident that lives in South Africa
//Used to check if a specific user is either alive or dead 
contract GovernmentLedger is HelperFunctions
{
   
mapping(address => Person) People; //@Used to store every resident that lives in South Africa

ExtendedERC721Token InternalToken;

 //@Dev Constructor
 constructor(address tokenAddress) public {
 InternalToken =ExtendedERC721Token(tokenAddress);
 emit AddressLogger(tokenAddress);
 }

function RegisterPerson(string name,string sname,string lat,string long,address id) returns (string message)
{
    if(id==address(0))
    {
     message = "Invalid Address";
     emit GeneralLogger(message);
     return message;
    }
    if(isStringNullorEmpty(name)||isStringNullorEmpty(sname)||isStringNullorEmpty(lat) || isStringNullorEmpty(long))
    {
        message="Please Enter all required information";
        emit GeneralLogger(message);
        return message;
    }
    Address memory hAddress = Address(lat,long);  
    InternalToken.PurchaseToken(id);
    People[id]=Person(id,name,sname,hAddress,InternalToken.GetLatestTokenIndex(id),true,true);
    message="Registered Citizen Succesfully";
    emit GeneralLogger(message);
}
//@Dev updates the specified Persons details using the address
function UpdatePersonName(string name,address id) returns (string message)
{
    if(id== address(0))
    {
        message ="Invalid address";
        emit GeneralLogger(message);
        return message;
    }
    if(isStringNullorEmpty(name))
    {
        message="Name cannot be empty";
        emit GeneralLogger(message);
        return message;
    }
    else if(!People[id].Activated || !People[id].Alive)
    {
        message="User is Deceased or is not an resident of the country";
        emit GeneralLogger(message);
        return message;
    }
    People[id].Name=name;
    message="Citizens name updated";
    emit GeneralLogger(message);
}

//@Dev updates the specified Persons details using the address
function UpdatePersonSurname(string sname,address id) returns (string message)
{
    if(id== address(0))
    {
        message ="Invalid address";
        emit GeneralLogger(message);
        return message;
    }
    if(isStringNullorEmpty(sname))
    {
        message="Surname cannot be empty";
        emit GeneralLogger(message);
        return message;
    }
    else if(!People[id].Activated|| !People[id].Alive)
    {
        message="User is Deceased or is not a resident of the country";
        emit GeneralLogger(message);
        return message;
    }
    People[id].Surname=sname;
    message="Citizens Surname updated";
    emit GeneralLogger(message);
}

//@Dev checks if a specifc resident exists or not
function CitizenExists(address id) view returns (bool exists)
{
    require(id != address(0));
    return People[id].Activated&&People[id].Alive?true:false;
}

//@Dev Gets the specfied Person using the given
function GetPersonInternal(address id) view returns  (string name,string sname,address Id)
{
  if(id==address(0))
  {
    return ("Invalid address","",id);
    emit GeneralLogger("Invalid address");
  } 
  if(!People[id].Activated)
  {
    return ("Person does not exist","",id);
    emit GeneralLogger("Person does not exist");
  }  
  name=People[id].Name;
  sname=People[id].Surname;
  Id=People[id].ID;

}
//@Dev Gets the specfied Person using the given used by external contracts
//Passing of strings between smart contracts not permitted
function GetPerson(address id) view returns  (bytes32 name,bytes32 sname,address Id)
{
  if(id==address(0))
  {
    emit GeneralLogger("Invalid address");
    return ("Invalid address","",id);
  } 
  if(!People[id].Activated)
  {
    emit GeneralLogger("Person does not exist");
    return ("Person does not exist","",id);
  }  
  name=stringToBytes32(People[id].Name);
  sname=stringToBytes32(People[id].Surname);
  Id=People[id].ID;
}

}