
// Event handlers
document.getElementById("btnDeleteQuote").addEventListener("click", deleteQuote);
document.getElementById("btnUploadQuotes").addEventListener("click", uploadQuotes);
document.getElementById("btnAddQuote").addEventListener("click", addQuote);
document.getElementById("btnRandomQuote").addEventListener("click", randomQuote);
document.getElementById("quoteList").addEventListener("click", populateQuote);


// Initialise quotes list
document.addEventListener("DOMContentLoaded", function(){
    console.log("calling clearEntry")
    clearEntry();
    console.log("calling getQuotes")
    getQuotes();
});


/**
*  Returns a unique id
*/
function getId(){
  var id = 'id' + (new Date()).getTime();
  return id;
}


/**
*  Retrieve the JSON file of quotes
*  creates a new li element and sets the attributes from the json file
*  appends the new element into the "quoteList" element
*/
function getQuotes(){
  console.log("Getting quotes");

  let request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    let response = "";

    if(this.readyState == 4 && this.status == 200){
      response = JSON.parse(this.responseText).quotes;

      for (let item of response){
        // Create list item and set attributes
        let newEntry = document.createElement("li");
        newEntry.id = String(item.id);
        newEntry.setAttribute("source", String(item.source));
        newEntry.setAttribute("quote", String(item.quote));
        newEntry.innerText = String(item.quote) + " - " + String(item.source);
        document.getElementById("quoteList").appendChild(newEntry);
      }
      console.log("Quotes received")
    }else{
      response = "Error " + this.statusText;
      console.log(response);
    }
  }

  request.open("GET", "/api/quotes", true);
  request.send();
}


/**
*  Clears all text from the "displayArea" section boxes
*/
function clearEntry(){
  document.getElementById("sourceDisplay").value = "";
  document.getElementById("quoteDisplay").value = "";
  document.getElementById("idDisplay").value = "";  
}


/**
*  Gets the data for a single quote from the target element paramater
*  extract the individual pieces of data from the element
*  put each piece of information into the text fields in the "displayArea" section
*  @param {EventObject} e - clicked list item in the "quoteList"
*/
function populateQuote(e){
  console.log("Populating Quote");
  clearEntry();

  let idDis = e.target.id
  let sourceDis = e.target.getAttribute("source");
  let quoteDis = e.target.getAttribute("quote");

  document.getElementById("idDisplay").value = idDis;
  document.getElementById("sourceDisplay").value = sourceDis;
  document.getElementById("quoteDisplay").value = quoteDis;
}


/**
*  Retrieve the JSON file of quotes
*  extracts the id's from the JSON file and puts them into an array
*  selects a random id from the array
*  extract the individual pieces of data from the element with the random id
*  put each piece of information into the text fields in the "displayArea" section
*/
function randomQuote(){
  console.log("getting random quote");
  clearEntry();

  let request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    let response = "";

    if(this.readyState == 4 && this.status == 200){
      response = JSON.parse(this.responseText).quotes;

      let quoteIdArray = [];
      for (let item of response){
        quoteIdArray.push(String(item.id));
      }

    // Selecting a random id from the array
    let randomId = quoteIdArray[Math.floor(Math.random() * quoteIdArray.length)];

    let sourceDis = document.getElementById(randomId).getAttribute("source")
    let quoteDis = document.getElementById(randomId).getAttribute("quote")

    document.getElementById("idDisplay").value = randomId;
    document.getElementById("sourceDisplay").value = sourceDis;
    document.getElementById("quoteDisplay").value = quoteDis;

    }else{
      response = "Error " + this.statusText;
      console.log(response);      
    }
  }

  request.open("GET", "/api/quotes", true);
  request.send();
}


/**
*  create a new li element
*  call getId() and set as the id of the new element
*  set source attribute,  quote attribute and inner text of the list item from the text that has been inputted into the "sourceAdd" and "quoteAdd" text boxes
*  append the new element into the "quoteList"
*/
function addQuote(){
  console.log("Add quote");

  let newSource = document.getElementById("sourceAdd").value;
  let newQuote = document.getElementById("quoteAdd").value;
  let newId = getId();

  if(newSource == "" || newQuote == ""){
    alert("Please enter values in the source and quote inputs.")
  }else{
    let newEntry = document.createElement("li");
    newEntry.id = newId;
    newEntry.setAttribute("source", newSource);
    newEntry.setAttribute("quote", newQuote);
    newEntry.innerText = newQuote + " - " + newSource;
    
    document.getElementById("quoteList").appendChild(newEntry);
    alert("New quote added to clientside list. Upload to save the list.");    
  }

  document.getElementById("sourceAdd").value = "";
  document.getElementById("quoteAdd").value = "";
}


/**
*  Delete the clicked quote list item from the HTML page
*/
function deleteQuote(){
  console.log("Deleting quote")
  let idToDelete = document.getElementById("idDisplay").value;
  if(idToDelete != ""){
    document.getElementById(idToDelete).remove();

    clearEntry();
    alert("Journal entry deleted on clientside. Upload to save changes.");
  }else{
    alert("Please select an entry to delete.");
  }
}


/**
*  Get the data from the "quoteList" on the html page
*  put the entries from the list into a collection
*  convert the collection into a JSON object
*  send JSON object to the url in the flask api
*  and handle the response
*/
function uploadQuotes(){
  console.log("Upload quotes");

  let uploadList = document.getElementById("quoteList");
  var quotesList = uploadList.getElementsByTagName("li");

  let uploadObject = {};
  uploadObject.quotes = [];

  for (let i = 0; i < quotesList.length; i++){
    let objEntry = {};
    objEntry.id = quotesList[i].id;
    objEntry.source = quotesList[i].getAttribute("source");
    objEntry.quote = quotesList[i].getAttribute("quote");
    
    uploadObject.quotes.push(objEntry);
  }

  let request = new XMLHttpRequest();
  let url = "api/quotes";
  request.onreadystatechange = function(){
    let strResponse = "Error: no response";
    if(this.readyState == 4 && this.status == 200){
      strResponse = JSON.parse(this.responseText);
      alert(strResponse.message)
    }
  }
  request.open("PUT", url, true);
  var data = JSON.stringify(uploadObject)
  request.setRequestHeader("Content-Type", "application/json");
  request.send(data);  
}