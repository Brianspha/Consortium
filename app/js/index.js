import EmbarkJS from 'Embark/EmbarkJS';
import InsuranceHolder from 'Embark/contracts/InsuranceHolder';
import GovernmentLedger from 'Embark/contracts/GovernmentLedger';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

$(document).ready(function () 
{
  //@Dev all the required modules will be place at the beggining 
  var slayer = require('slayer');
   InsuranceHolder.setProvider(new web3.providers.HttpProvider('http://localhost:8545')); // 8080 for cpp/AZ, 8545 for go/mist
   GovernmentLedger.setProvider(new web3.providers.HttpProvider('http://localhost:8545')); // 8080 for cpp/AZ, 8545 for go/mist
  
   //@Dev for some odd reason this project does not detect the localhost instance so i have to set it manually usually embark does it automatically sigh
  //const abiDecoder = require('abi-decoder'); // NodeJS
  var Data = GenerateUserData(11);
  RegisterCitizens(Data);
  var Institutions=GenerateHealthInstitution(5);
  //var Docs=GenerateDoctors(Data);
  //RegisterDoctors(Docs);
  RegisterInstitutions(Institutions);
  //DetectAnomlyUsingUsingDistance();
  //todo create smart contract to keep track of fradulent claims 
 // AppendClaims(3);
  window.setTimeout(AppendClaims(3), 60000)

//@Dev append claims made 
function AppendClaims(count)
{
  for(var i=0; i <count;i++)
 { 
  var line1= "<div class='col-md-4 col-sm-4 col-xs-12 profile_details'><div class='right col-xs-5 text-center'><img src='images/img.jpg'  class='img-circle img-responsive'></div>";
  var line2 ="<div class='well profile_view'><h4 class='brief'> <b>"
  var claimantName="Chats Med";
  var line3="</b></h4>";
  var line4="<ul class='list-unstyled'>";
  var line5="<div class='panel'>";
  var line6="<a class='panel-heading collapsed' role='ab' id='headingTwo' data-toggle='collapse' data-parent='#accordion' href="; 
  var line7="aria-expanded='false' aria-controls='collapseTwo'> <h4 class='btn btn-primary btn-xs'> <i class='fa fa-info'> </i> View more details </h4>";
  var line8="<div id=";
  var id=""; 
  var line9=" class='panel-collapse collapse' role='tabpanel' aria-labelledby='headingTwo' aria-expanded='false' style='height: 0px;'>";
  var line10="<div class='panel-body'><ul class='list-unstyled'> <li><i class='fa fa-spinner'><strong>Status: ";  
  var status="Wainting for additional info";
  var line11="</strong></i></li><li><i class='fa fa-newspaper-o'><strong> Description: ";
  var Description="Operation";
  var line12="</strong></i></li></ul></div></div></div></ul></div></div>";
  var profile=line1+line2+claimantName+line3+line4+line5+line6+"'" +"#"+i.toString() +"'"+line7+line8+"'"+i.toString()+"'"+line9+line10+status+line11+Description+line12;
  document.getElementById('pageContentMain').innerHTML+=profile;
 }
}
 //@Dev Function registers the generated patients onto the system
 function RegisterCitizens(Data)
 {
  for(var i =0; i < Data.length;i++)//PatientData.length some odd reason this doesnt work 
  {
    var patient = Data[i];
    var lat=patient.Location.Latitude.toString()
    var Long=patient.Location.Longitude.toString()
    GovernmentLedger.methods.RegisterPerson(patient.Name,patient.SurName,lat,Long,(patient.ID)).send({gas:4000000,from:(patient.ID)}).then(function(value,err)
    {
      console.log(err)
      outputTransactionRecipt(value);
    })

    InsuranceHolder.methods.RegisterHolder(parseInt(patient.IntialCover),patient.ID).send({gas:4000000,from:(patient.ID)}).then(function(value,err)
    {
        console.log(err)
        outputTransactionRecipt(value);
    }) 
  }
 }
 //@Dev Function Creates Insurance Policity for generated Citizens
 function CreateInsurancePolicy(user)
 {
  InsuranceHolder.methods.RegisterHolder(parseInt(user.IntialCover),user.ID).send({gas:4000000,from:(user.ID)}).then(function(value,err)
    {
      console.log(err)
      outputTransactionRecipt(value);
    })
 }

 //@Dev Generates Insititutions
 function GenerateHealthInstitution(count)
 {
  count=count<0?1:count; //ensure that we always have a positive number
  var HealthData=[];
  for(var i=0; i < count;i++)
  {
    HealthData.push({Name:GetCity(i) +" " +GetHospital(i),ID:GetInstitutionAccount(i),Location:GetHospitalLocation(i)});
  }
  return HealthData;
 }

 //@Dev Generates count Doctors
 //Each Doctor is associated with a Specific Institution
 function GenerateDoctors(Data)
 {
  var Doctors =[];
  for(var i=7; i < Data.length;i++)
  {
    Doctors.push({Address:Data[i].ID})
  } 
  return Doctors;
 }

 //@Dev Register Institutions
 function RegisterInstitutions(Data)
 {
   for(var i =0; i < Data.length;i++)
   {
     var inst = Data[i];
     HealthInstitutionLedger.methods.RegisterHealthInstitution(inst.Name.toString(),inst.Location.Latitude.toString(),inst.Location.Longitude.toString(),inst.ID).send({gas:4000000,from:(inst.ID)}).then(function(value,err)
    {
      console.log(err);
      outputTransactionRecipt(value);
    })
  
   }
 }

 //@Dev Registers Doctors on to the Public Ledger
 function RegisterDoctors(Data)
 {
   for(var i =0; i < Data.length;i++)
   {
     var doc=Data[0];
     var id=doc.Address;
     DoctorContract.methods.RegisterDoctor(id).send({from:id,gas:4000000}).then(function(value,err)
    {
      console.log(err);
      outputTransactionRecipt(value);
    })
   }
 }
  //@Dev Checks for irregularities using the patients address treated by a specific medical institution
 //Used for to analayze the distance ratio of patients treated by a specific medical institution
  function DetectAnomlyUsingUsingDistance()
  {
   
  console.log(result);
  
  }
  //@Dev Generates Insurance Holder data 
  //
  function GenerateUserData(count)
  {
    var Data=[];
    for(var i=1;i < count;i++)
    {
      Data.push({Name:GetName(i),SurName:GetSurname(i),ID:GetAccount(i),IntialCover:0,Location:GetLocation(i)})
    }
    return Data;
  }
  //@Dev Generates random ID number
  function GenerateID ()
  {
    var ID ="19";
    ID+=(Math.floor(Math.random()*(99-40+1)+40)).toString()
    for(var i=0; i < 13;i++)
    {
     ID+=(Math.floor(Math.random()*10)+1).toString()
    }
    return ID;
  }
  //@Dev returns account at specified index
  //These Accounts are used for registering doctors and patients
  function GetAccount(index)
  {
    var Accounts=[ 
      "0xd21ba2a2e3a10beaea3509cf5d8cf35c0c4c0a6a", 
      "0xf02068b95b6d59dfd682cf4539e2b9e4f2a6d287", 
      "0xb1d1969da607c9ef00743cbde41f4d3f85428a35", 
      "0xe2a5572eefbfd2a8d42dd665d3fdb244bf1ca8fc", 
      "0x3a44cefcbbea87875d8b4eefd14f3e6963b71700", 
      "0xad2b1f1e136b94597baff0d959d47273faf9d5cb", 
      "0xdbc4322583c259738891d5dda0b37f3f097118d7", 
      "0x4abf2b03406f65e0570a0c3cdf4955f5d15a8f45", 
      "0x823ec900cf97db36fc95e3c7618cfe0a9557baa3", 
      "0x092e563ead5800168278ccbc9c10231323fb13df", 
      "0x3a3844867bfce739cb338914eb8b8f691e676d27", 
      "0x7819a0079e90c45803820b17b1c566f21c9d1de4", 
      "0x51910a42dcf14ae53f4727db81f292b6e99abdda", 
      "0x24e456e916aa5301af46c36aaf65e5b1b1020d2b", 
      "0x8c96101317f956eac0f27b95e8fe9685de9b7999", 
      "0x7cc12bf5879aaff9caab9cdd0ac956045e428f41", 
      "0xdfcc802b71ba2d57c7eb58b2a2a786ddc265ff6b", 
      "0x656c89b7b761caacb95be95ea3193dec0a26ca74", 
      "0x1854c1d4c35a5803f02fc364ce9be56542ee61e0", 
      "0x89246ec275d2b1ba7f50f7617765a533ef1e7a2a", 
      "0x43a1471331d0ae75e28652e9ce44b44aaf62ef95", 
      "0x4d4b45bb92be44f24abaa1835d7febf435a3be78", 
      "0x3b9bb1cb7d7eaf71cb36967e3d7605ff9bfdb324", 
      "0x80bbfe0f42dfe3b1785e68be0cf5b3a93acb7b30", 
      "0xaae714f07e705159c3b39c58e633ebff4b385631", 
      "0x576934c04a9e47310918d766162c3a3f49f72045", 
      "0x60653bc658d9bd369ec99400af0c37f97cd71134", 
      "0x9132ac774a0109d88ae7feb0a2040e26f6bd8107", 
      "0xd6e76c94046d6dd9b2d5bf38b82a3e82a1ad6636"
      ]
      return index>=Accounts.length?Accounts[0]:Accounts[index];
  }
  //@Dev  accounts reserved for Hospital/Private practice institution
  //Each institution is indentified by an account
  function GetInstitutionAccount(index)
  {
    var Accounts=[
      "0x349d53bff4d503430a37f6b51523b9b79b581153", 
      "0x4badbdac3ebf0df5418d1d19d324e5f362b20fd5", 
      "0xaf8a41a7e9ae98cbc165f67d5fc2a96ae186b465", 
      "0xf02bd8b17b576f35ac0b1799e9abd9594be499a0", 
      "0x71236dc79fbb1c649ecfb9a3dce555ac59a61b18", 
      "0x6c2fde74681ca5e8aa03c3f0cea3d4dac8946379", 
      "0x583972d0d31a6168675b912e82052c1fc1cd33b3", 
      "0xad7df0abaa244377c019c6f2638233503c2f081f", 
      "0xa672794f4c24128c995c1c9f7a52150c85dd2af2", 
      "0x282bf5f8eaa9499ac378f6d7119f79159d87aef2", 
      "0x4725983ee59a2c4d93dd5d922cafbdfeb0f36b7c", 
      "0x7ee00e67826ed2cc082b5f453085dd7611b33d11", 
      "0x5d06ed67c1bc4b0976f153b0a070c3d6769ea6eb", 
      "0x0bdb39e666429218c4688d62832921475c16d83e", 
      "0x0de8f53cf07feef1b3650367eef9359419a06bcf", 
      "0x684b523c9c4850fdb533f01576fe4817396479f8", 
      "0xb71b8e886438f20aae580b7a8e76f28d94bcd884", 
      "0xcd5b402afdb5da8a2d6105427deb9f6fc594f7b9", 
      "0x7c176cf00f9f85f0f33de425b8732fff7dc6b3be", 
      "0x32a3eee3b7d537b42dc6412be01feab030976b8a", 
      "0xa948de3c9b3d87c60602795b3cd2001d94c95d5d"
    ];
    return index>=Accounts.length ?Accounts[0]:Accounts[index];
  }
  function GetPrescription(index)
  {
    var prescriptions=[ 
      "Alamnap - medium-sized, pentagonal, yellow pills.", 
      "Alimat - tiny, hexagonal, white pills.", 
      "Anarnar - small, octagonal, red pills.", 
      "Apiredem - huge, pentagonal, golden pills.", 
      "Bicixi - large, hexagonal, gray pills.", 
      "Cefular - huge, square, crimson pills.", 
      "Delner - huge, octagonal, brown pills.", 
      "Enusex - medium-sized, oblong, emerald pills.", 
      "Foxnen - medium-sized, pentagonal, green pills.", 
      "Irinan - medium-sized, pentagonal, golden pills.", 
      "Nixxan - small, octagonal, red pills.", 
      "Otenled - medium-sized, oblong, orange pills.", 
      "Patoxot - tiny, triangular, yellow pills.", 
      "Pilaz - large, pentagonal, azure pills.", 
      "Sifalir - small, pentagonal, green pills.", 
      "Tanirur - small, hexagonal, purple pills.", 
      "Uxanot - huge, rectangular, emerald pills.", 
      "Xepenac - large, pentagonal, azure pills.", 
      "Xonotal - huge, triangular, green pills.", 
      "Yopixir - tiny, round, golden pills.", 
      "Abacpan - tiny, square, silver pills.", 
      "Alitxas - large, oblong, green pills.", 
      "Anotal - medium-sized, pentagonal, red pills.", 
      "Cilit - medium-sized, pentagonal, gray pills.", 
      "Ecaposal - small, round, golden pills.", 
      "Enanap - tiny, rectangular, brown pills.", 
      "Iposezac - medium-sized, oblong, black pills.", 
      "Isezat - medium-sized, rectangular, emerald pills.", 
      "Itecpar - huge, triangular, emerald pills.", 
      "Lamob - small, hexagonal, silver pills.", 
      "Lecos - large, octagonal, azure pills.", 
      "Masapo - medium-sized, triangular, white pills.", 
      "Nalayan - large, pentagonal, purple pills.", 
      "Onorarol - tiny, triangular, purple pills.", 
      "Oxalsax - small, rectangular, violet pills.", 
      "Pavepa - small, round, green pills.", 
      "Pedop - large, oblong, silver pills.", 
      "Robet - medium-sized, square, black pills.", 
      "Ticena - huge, round, emerald pills.", 
      "Vipic - medium-sized, square, purple pills.", 
      "Atixmoz - medium-sized, rectangular, golden pills.", 
      "Ebabifap - tiny, square, crimson pills.", 
      "Enamer - tiny, square, red pills.", 
      "Ixapnar - huge, pentagonal, green pills.", 
      "Lanxal - huge, octagonal, violet pills.", 
      "Linnim - medium-sized, pentagonal, green pills.", 
      "Lisrop - tiny, square, yellow pills.", 
      "Lizlap - large, square, emerald pills.", 
      "Madrim - large, triangular, emerald pills.", 
      "Nabpat - huge, rectangular, red pills.", 
      "Naside - medium-sized, oblong, brown pills.", 
      "Nulaba - small, pentagonal, azure pills.", 
      "Petgon - small, square, ivory pills.", 
      "Ranec - small, rectangular, gray pills.", 
      "Ranetal - medium-sized, rectangular, silver pills.", 
      "Renozo - medium-sized, oblong, white pills.", 
      "Safexa - large, oblong, ivory pills.", 
      "Sibmot - small, octagonal, blue pills.", 
      "Tapox - large, rectangular, golden pills.", 
      "Xacani - tiny, rectangular, black pills.", 
      ];
      return index>=prescriptions.length?prescriptions[0]:prescriptions[index];
  }
  //@Dev returns location at specified index
  function GetLocation(index)
  {
    var Locations=[ 
      {Latitude:-32.81029585 , Longitude:23.41661026}, 
      {Latitude:-34.30556328 , Longitude:24.57424098}, 
      {Latitude:-35.01139717 , Longitude:24.59448873}, 
      {Latitude:-34.92981742 , Longitude:27.87734988}, 
      {Latitude:-30.63100454 , Longitude:26.85619438}, 
      {Latitude:-33.8225256 , Longitude:28.94145955}, 
      {Latitude:-33.27594783 , Longitude:29.17384642}, 
      {Latitude:-32.49410415 , Longitude:27.34306854}, 
      {Latitude:-32.02463713 , Longitude:25.7454042}, 
      {Latitude:-33.46270848 , Longitude:29.6162619}, 
      {Latitude:-28.90785065 , Longitude:31.23863359},  
      ]; 
    return index>=Location.length?Locations[0]:Locations[index];    
  }
  //@Dev Locations reserved for Hospitals/ instituitons
function GetHospitalLocation(index)
{
  var locations=[ 
    {Latitude:-28.90785065 , Longitude:31.23863359}, 
    {Latitude:-29.96485323 , Longitude:30.81120154}, 
    {Latitude:-29.88886801 , Longitude:30.54078203}, 
    {Latitude:-29.14085505 , Longitude:31.14753158}, 
    {Latitude:-29.03814548 , Longitude:30.83440985}, 
    {Latitude:-29.67179 , Longitude:30.70619166}, 
    {Latitude:-30.16694365 , Longitude:31.66086388}, 
    {Latitude:-29.23274146 , Longitude:31.65742613}, 
    {Latitude:-29.70428658 , Longitude:30.91733003}, 
    {Latitude:-29.14267225 , Longitude:30.99155375}, 
    {Latitude:-24.69804152 , Longitude:39.09055314}, 
    {Latitude:-23.0452693 , Longitude:17.60139063}, 
    {Latitude:-21.22942971 , Longitude:30.7983636}, 
    {Latitude:-24.86342353 , Longitude:41.0049305}, 
    {Latitude:-23.80342285 , Longitude:22.66518153}, 
    {Latitude:-25.10670152 , Longitude:38.03472862}, 
    {Latitude:-29.2652688 , Longitude:39.96132028}, 
    {Latitude:-35.79735865 , Longitude:22.69603759}, 
    {Latitude:-26.2294903 , Longitude:25.01990026}, 
    {Latitude:-37.92446584 , Longitude:28.86488473}];
    return index>=locations.length?locations[0]:locations[index];
}  
  //@Dev return a Specific city at specified Index
  function GetCity(index)
  {
    var SACities=[ 
      "Lotlapa", 
      "Pacaltsdrop", 
      "Tooseng", 
      "Gqiba", 
      "Langley", 
      "KwaNcani", 
      "Masekwameng", 
      "Mbhokota", 
      "Sobabili", 
      "Sandvlakte", 
      "Ntswanahatshe", 
      "Ku-Mvezo", 
      "Dolwana", 
      "Martlesham", 
      "Umzumbe", 
      "Halfpadrivier", 
      "Riversdaie", 
      "Mhalamhala", 
      "Ebulawa", 
      "Ngewene", 
      "Roggeveld", 
      "Bracefield", 
      "Nhlazatshe", 
      "Molen Drift", 
      "Olievenkop", 
      "Ivaura Estates", 
      "Tyityane", 
      "Shoongezicht", 
      "Dzarani", 
      "Hwelesangeng", 
      "Saaipoort", 
      "Entafufu", 
      "Reamour", 
      "Maipeeng", 
      "Randjesfontein", 
      "Ga-Phasha", 
      "Sixambust", 
      "Skerploenpunt", 
      "Mogoto", 
      "Ga-Dikgale", 
      "KuMgawuli", 
      "Ntlolas", 
      "KwaKati", 
      "Bhetani", 
      "Mitford Park", 
      "Qaqane", 
      "Mboxo School", 
      "Mauluma", 
      "Struishoek", 
      "Chatwell"
      ];
      return index>=SACities.length?SACities[0]:SACities[index];
  }
  //@Dev returns Hospital Types at specified index
  function GetHospital(index)
  {
    var MedicalInstitutionTypes=["General Practioner","Optometrist","Optician","Surgery","Ambulatory Surgical Center"];
    return index>=MedicalInstitutionTypes.length?MedicalInstitutionTypes[0]:MedicalInstitutionTypes[index];
  }
  //@Dev returns name at specified index
  function GetName(index)
  {
    var firstNames = [
      'Leanne', 'Edward', 'Haydee', 'Lyle', 'Shea', 'Curtis', 'Roselyn', 'Marcus', 'Lyn', 'Lloyd',
      'Isabelle', 'Francis', 'Olivia', 'Roman', 'Myong', 'Jamie', 'Alexis', 'Vernon', 'Chloe', 'Max',
      'Kirstie', 'Tyler', 'Katelin', 'Alejandro', 'Hannah', 'Gavin', 'Lynetta', 'Russell', 'Neida',
      'Kurt', 'Dannielle', 'Aiden', 'Janett', 'Vaughn', 'Michelle', 'Brian', 'Maisha', 'Theo', 'Emma',
      'Cedric', 'Jocelyn', 'Darrell', 'Grace', 'Ivan', 'Rikki', 'Erik', 'Madeleine', 'Rufus',
      'Florance', 'Raymond', 'Jenette', 'Danny', 'Kathy', 'Michael', 'Layla', 'Rolf', 'Selma', 'Anton',
      'Rosie', 'Craig', 'Victoria', 'Andy', 'Lorelei', 'Drew', 'Yuri', 'Miles', 'Raisa', 'Rico',
      'Rosanne', 'Cory', 'Dori', 'Travis', 'Joslyn', 'Austin', 'Haley', 'Ian', 'Liza', 'Rickey',
      'Susana', 'Stephen', 'Richelle', 'Lance', 'Jetta', 'Heath', 'Juliana', 'Rene', 'Madelyn', 'Stan',
      'Eleanore', 'Jason', 'Alexa', 'Adam', 'Jenna', 'Warren', 'Cecilia', 'Benito', 'Elaine', 'Mitch',
      'Raylene', 'Cyrus'
    ];
    return index>=firstNames.length?firstNames[0]:firstNames[index];
  }
  //@Dev returns Surname at specified Index
  function GetSurname(index)
  {
    var lastNames = [
      'Flinn', 'Bryd', 'Milligan', 'Keesee', 'Mercer', 'Chapman', 'Zobel', 'Carter', 'Pettey',
      'Starck', 'Raymond', 'Pullman', 'Drolet', 'Higgins', 'Matzen', 'Tindel', 'Winter', 'Charley',
      'Schaefer', 'Hancock', 'Dampier', 'Garling', 'Verde', 'Lenihan', 'Rhymer', 'Pleiman', 'Dunham',
      'Seabury', 'Goudy', 'Latshaw', 'Whitson', 'Cumbie', 'Webster', 'Bourquin', 'Young', 'Rikard',
      'Brier', 'Luck', 'Porras', 'Gilmore', 'Turner', 'Sprowl', 'Rohloff', 'Magby', 'Wallis', 'Mullens',
      'Correa', 'Murphy', 'Connor', 'Gamble', 'Castleman', 'Pace', 'Durrett', 'Bourne', 'Hottle',
      'Oldman', 'Paquette', 'Stine', 'Muldoon', 'Smit', 'Finn', 'Kilmer', 'Sager', 'White', 'Friedrich',
      'Fennell', 'Miers', 'Carroll', 'Freeman', 'Hollis', 'Neal', 'Remus', 'Pickering', 'Woodrum',
      'Bradbury', 'Caffey', 'Tuck', 'Jensen', 'Shelly', 'Hyder', 'Krumm', 'Hundt', 'Seal', 'Pendergast',
      'Kelsey', 'Milling', 'Karst', 'Helland', 'Risley', 'Grieve', 'Paschall', 'Coolidge', 'Furlough',
      'Brandt', 'Cadena', 'Rebelo', 'Leath', 'Backer', 'Bickers', 'Cappel'
    ];
  return index>=lastNames.length?lastNames[0]:lastNames[index];    
  }
//@Dev calculates the distance between to locations using their lat/long
  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2)
  {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  //@Dev calculates the distance between to locations using their lat/long
  function distance(lat1, lon1, lat2, lon2)
  {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
  
  //@Dev converts degrees to radians
  function deg2rad(deg) 
  {
    return deg * (Math.PI/180)
  }
//@Dev Parses lat/long in to individual components i.e. degrees minutes seconds etc  
function ParseDMS(input) 
{
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    var lng = ConvertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
}
//@Dev converts the lat/long into decimal form
function ConvertDMSToDD(degrees, minutes, seconds, direction)
{
  var dd = degrees + minutes/60 + seconds/(60*60);

  if (direction == "S" || direction == "W")
  {
      dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}
//@Dev responsible for outputting the transaction recipt each time a contract call is made
function outputTransactionRecipt(value)
{
    var test = value.events;
    var latest = test.GeneralLogger[test.GeneralLogger.length-1];
    var returnedVal="";
    if(!latest)
    {
        returnedVal+=test.GeneralLogger.returnValues.message +"\n";
      var string="Address: "+test.GeneralLogger.address +"\n blockHash: "+ test.GeneralLogger.blockHash +"\n BlockNumber: "+ test.GeneralLogger.blockNumber +"\n event: "+ test.GeneralLogger.event +"\n Id: "+test.GeneralLogger.id + "\n Value/s returned: "+returnedVal;
      string+="\n Gasused: " +test.GeneralLogger.gasUsed + "\n TransactionHash :" +test.GeneralLogger.transactionHash +"\n Transactionstatus: " + test.GeneralLogger.type;
      console.log(string);
      var transactionsList = JSON.parse(localStorage.getItem("TransactionsList"));
      if(transactionsList == null)
      {
        transactionsList=[];
        transactionsList.push({Signiture: test.GeneralLogger.signature,Address:test.GeneralLogger.address,BlockHash:test.GeneralLogger.blockHash,BlockNumber:test.GeneralLogger.blockNumber,GasUsed:test.GeneralLogger.gasUsed,TransactionHash:test.GeneralLogger.transactionHash,TransactionStatus:test.GeneralLogger.type});
        localStorage.setItem("TransactionsList",JSON.stringify(transactionsList));
        return;
      }
      transactionsList.push({Signiture: test.GeneralLogger.signature,Address:test.GeneralLogger.address,BlockHash:test.GeneralLogger.blockHash,BlockNumber:test.GeneralLogger.blockNumber,GasUsed:test.GeneralLogger.gasUsed,TransactionHash:test.GeneralLogger.transactionHash,TransactionStatus:test.GeneralLogger.type});
      localStorage.setItem("TransactionsList",JSON.stringify(transactionsList));
     return;
    }
    returnedVal=latest.returnValues !=null?latest.returnValues.message:"couldnt determine returned value!";
    var string="Address: "+latest.address +"\n blockHash: "+ latest.blockHash +"\n BlockNumber: "+ latest.blockNumber +"\n event: "+ latest.event +"\n Id: "+latest.id + "\n Value returned: "+ latest.returnValues[0];
    string+="\n Gasused: " +latest.gasUsed + "\n TransactionHash :" +latest.transactionHash +"\n Transactionstatus: " + latest.type;
    console.log(string);
    var transactionsList = JSON.parse(localStorage.getItem("TransactionsList"));
    if(transactionsList == null)
    {
      transactionsList=[];
      transactionsList.push({Signiture:latest.signature,Address:latest.address,BlockHash:latest.blockHash,BlockNumber:latest.blockNumber,GasUsed:latest.gasUsed,TransactionHash:latest.transactionHash,TransactionStatus:latest.type});
      localStorage.setItem("TransactionsList",JSON.stringify(transactionsList));
      return;
    }
    transactionsList.push({Signiture:latest.signature,Address:latest.address,BlockHash:latest.blockHash,BlockNumber:latest.blockNumber,GasUsed:latest.gasUsed,TransactionHash:latest.transactionHash,TransactionStatus:latest.type});
    localStorage.setItem("TransactionsList",JSON.stringify(transactionsList));
   
  }    
});
