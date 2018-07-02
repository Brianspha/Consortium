
// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

$(document).ready(function () 
{

  
  OutputToLiveTransaction();
//@Dev Function to output log history of mined transactions
function OutputToLiveTransaction()
{
  var table = document.getElementById("liveTransactionstable");
 
  var transactionsList = JSON.parse(localStorage.getItem("TransactionsList"));
  if(transactionsList != null)
  {
    var count=transactionsList.length-1;
    for(var i=1; i<10 ;i++,count--)//place the last 10 transactions
    {
      var row = table.insertRow(table.length);
      //var cell1 = row.insertCell(0);
     // var cell2 = row.insertCell(1);
     // var cell3 = row.insertCell(2);
    //  var cell4 = row.insertCell(3);
     //var button ="<button"+"type='button'"+ "class='btn btn-primary'"+"data-toggle='modal' data-target="+ "'.bs-example-modal-lg'";
     //var addvalue="value="+transactionsList[count].TransactionHash.toString() +">Transaction Receipt</button>";     
     //var newBut=button+addvalue;
     var cell5 = row.insertCell(0);
      var cell6 = row.insertCell(1);
     // row.insertCell(newBut);
     // var cell7 = row.insertCell(2);
      var currentTransaction=transactionsList[count];
     // cell1.innerHTML =currentTransaction.Address.toString();
      //cell2.innerHTML =currentTransaction.BlockHash.toString();
      //cell3.innerHTML=currentTransaction.BlockNumber.toString();
      cell5.innerHTML=currentTransaction.TransactionHash.toString();
      cell6.innerHTML = currentTransaction.TransactionStatus.toString();
     // cell7.innerHTML =currentTransaction.Signiture.toString();
    }
  }  
} 

//@Dev gets transaction recipt based on the given hash
function waitForReceipt(hash)
{
    web3.eth.getTransactionReceipt(hash, function (err, receipt) 
    {
      if (err)
      {
        document.getElementById("ReciptAppender").innerHTML=err.toString();
      }
  
      if (receipt !== null)
      {
        // Transaction went through
          document.getElementById("ReciptAppender").innerHTML=receipt.toString();
      } 
      else
       {
        // Try again in 1 second
        window.setTimeout(function ()
        {
          waitForReceipt(hash);
        }, 1000);
      }
    });
  }
});