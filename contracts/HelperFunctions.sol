pragma solidity 0.4 .24;

//@Dev this Contract sole purpose is to contain functions that will aid other contracts with certain
//Tasks like checking if a string is null or empty
//Created for abstraction purposes
contract HelperFunctions {
    //@Dev responsible for logging different things that occur in functions
    //Used by front end to output transaction recipt
    event GeneralLogger(string message);
    event BooleanLogger(bool test);
    event AddressLogger(address id);
    //@Dev this functions tests if a given string is null or empty by converting it to a type bytes and checking
    //if the length of the bytes is greater than zero   
    function isStringNullorEmpty(string value) returns(bool success) {
        bytes memory tester = bytes(value); //@Dev Uses memory
        success = tester.length == 0;
        return success;
    }

    //@Dev Represents a street address in Lat/Long format
    struct Address {
        string Longitude;
        string Latitude;
    }

    struct Record {
        address DoctorID; //@Dev Identifies the doctor responsible for the medical examination
        address PatientID; //@Dev Identifies the Patient whos record this is
        string Examination; //@Dev full report of the examination
        uint256 Cost; //@Dev Price billed for examination
        string Type; //@Dev Indicates the type of procedure that was performed i.e. 
        //@Dev checkup, heart surgery etc will be used by oracle service 
    }
    struct Patient {
        address pId;
        uint256 Count; //@Dev keeps track of how many records the patient has used for indexing
        mapping(uint256 => Record) PRecords;
    }

    struct Claim {
        uint256 Reference; //@Dev unique value for each claim
        address ClaimerId; //@Dev used to identify recipient whos claim this is
        uint256 amount; //@Dev the amount that was paid out
        uint256 State; //@Dev indicates whether or not the claim has been approved or not 
        // state is a value from 1 to 4. 
        //1 = holding 
        //2 = pending payout 
        //3 = paid out
        //4 = expired
    }
    //@Dev represents an insurance company
    struct InsuranceCompnay {
        address ID;
        bool Activated;
        string name; //@Dev the name associated with the ID for instance discovery
    }
    struct Holder {
        address Identifier; //@Dev this will be the non fungible address of the insurance holder which maps to the erc721 token
        bool Activated; //@Dev Keeps track of whether the current holder is active or not
        uint256 AmountCoveredFor; //@Dev Keeps track of how much the holder is covered for or how much he/she has in their account
        uint256 ClaimsCount;
        uint256 PaidClaimsCount;
        bool Archived;
        mapping(uint256 => Claim) Claims; //@Dev Keeps a record of all the claims made by the user
        mapping(uint256 => Claim) PaidOutClaims; //@Dev Keeps track of all claims paid out by Discovery
    }

    //@Dev represents a South African Citizen
    struct Person {
        address ID; //@Dev unique identifier to be used to query to the ledger
        string Name;
        string Surname;
        Address HomeAddress;
        uint256 TokenIndex; //@Dev Used to uniquely identify each Person 
        bool Alive; //@Dev Used to check if person is alive or not
        bool Activated;
    }
    struct Doctor {
        address ID;
        uint256 TokenIndex; //@Dev Used to uniquely identify each doctor that has submitted a claim to discovery
        bool Activated;
    }
    //@Dev represents a South African Citizen
    struct Institution {
        address ID; //@Dev unique identifier to be used to query to the ledger
        string Name;
        Address InstitutionAddress;
        uint256 TokenIndex; //@Dev Used to uniquely identify each Person 
        bool Activated;
        mapping(address => Doctor) Doctors; //@Dev Keeps track of all doctors treating patients within the institution
    }

    //@Dev Converts bytes32 to string
    function bytes32ToString(bytes32 x) constant returns(string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
    //@Dev Converts a string to bytes 32 

    function stringToBytes32(string memory x) returns(bytes32 result) {
        require(isStringNullorEmpty(x)); //@Dev ensure that the string is not null
        bytes memory newString = bytes(x);
        assembly {
            result: = mload(add(newString, 32))
        }
    }
}