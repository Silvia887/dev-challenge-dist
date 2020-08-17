/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

require('./site/index.html')
require('./site/style.css')


// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url);
const tableContainer = document.getElementById("biddingTableDiv");
const table = document.createElement('TABLE');
const tableBody = document.createElement('TBODY');
const columns = ['name','bestBid','bestAsk','openBid','openAsk','lastChangeAsk','lastChangeBid'];
const sparks = document.getElementById('sparklineDiv');
const midPriceArray = [];

client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}
// const $tbody = $('#bidding-table');    JQUERY IMPLEMENTATION

function connectCallback() {
  var subscription = client.subscribe("/fx/prices", createBidTableRows);
  createBidTableHeader();
  setInterval(displaySparkline, 30000);
}

client.connect({}, connectCallback, function(error) {
  console.log(error.headers.message)
})

createBidTableRows = function(message) {
    
  // JQUERY IMPLEMENATION FOR CREATING TABLE
  // if (message.body) {
  //     const bid = JSON.parse(message.body);
  //     let tblRow = '<tr>';
  //     tblRow += '<td>'+bid.name+'</td>';
  //     tblRow += '<td>'+bid.bestBid+'</td>';
  //     tblRow += '<td>'+bid.bestAsk+'</td>';
  //     tblRow += '<td>'+bid.openBid+'</td>';
  //     tblRow += '<td>'+bid.openAsk+'</td>';
  //     tblRow += '<td>'+bid.lastChangeAsk+'</td>';
  //     tblRow += '<td>'+bid.lastChangeBid+'</td>';
  //     tblRow += '<td><span>'+'yess'+'</span></td>';
  //     tblRow += '</tr>';
      
  //     $tbody.append(tblRow);
  //     $tbody.show();
  //     sortBidData();
  //   } else {
  //     console.log("No Messages, sorry!!!");
  //   }
  
  if (message.body) {
    const bid = JSON.parse(message.body);
    const tr = document.createElement('TR');
    tableBody.appendChild(tr);
    columns.forEach(function(item,index){
      const td = document.createElement('TD');
      td.width='75';
      td.appendChild(document.createTextNode(bid[item]));
      tr.appendChild(td);
    });
    tableContainer.appendChild(table);
    sortBidData();

    const midPrice = (bid.bestBid + bid.bestAsk)/ 2;
    midPriceArray.push(midPrice);
  } 
};

// Function to create Table Header
function createBidTableHeader() {
    
    table.appendChild(tableBody);
    const headerRow = document.createElement('TR');
    
    columns.forEach(function(item,index){
      const th = document.createElement('TH');
      th.appendChild(document.createTextNode(item.toLocaleUpperCase()));
      headerRow.appendChild(th);
    });
    tableBody.appendChild(headerRow);
}

// // JQUERY IMPLEMENATION FOR SORTING TABLE 
// function sortBidData() {
//   const $tbody = $('#biddingTableDiv table');
//   $tbody.find('tr:not(:first-child)').sort(function(a,b){ 
//     var tda = $(a).find('td:eq(6)').text();
//     var tdb = $(b).find('td:eq(6)').text(); 
            
//     return tda < tdb ? 1  : tda > tdb ? -1 : 0;           
//   }).appendTo($tbody);
// }

// Function to sort the Bidding Table
function sortBidData() { 
  let sorted, i, a, b, sortFlag;
  const filterTable = document.querySelector('table');
  const rows = filterTable.rows;

  sorted = true;
  while (sorted) {
     sorted = false;
     
     for (i = 1; i < rows.length - 1; i++) {
        sortFlag = false;
        a = rows[i].getElementsByTagName("TD")[6];
        b = rows[i + 1].getElementsByTagName("TD")[6];
        if (a.innerHTML < b.innerHTML) {
           sortFlag = true;
           break;
        }
     }
     if (sortFlag) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        sorted = true;
     }
  }
}

// Function to display Sparkline
function displaySparkline() { 
  Sparkline.draw(sparks,midPriceArray.slice(midPriceArray.length-5));
}

