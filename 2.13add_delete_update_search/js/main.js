var user_info;
var show_len = 10;
var update_index = -1;

//get all record number options
var option_list = document.getElementById('recordlist').getElementsByTagName('li');
//add click function for all options;
var option_len = option_list.length;
for(var i=0;i<option_len;i++){
  option_list[i].onclick = function(){
    for(var i=0;i<option_len;i++){
      option_list[i].classList.remove('active');
    }
    this.classList.add('active');
    switch (this.innerHTML) {
      case "10":
        show_len = 10;
        updateTable(JSON.parse(localStorage.getItem("user_informations")),show_len);
        break;
      case "20":
        show_len = 20;
        updateTable(JSON.parse(localStorage.getItem("user_informations")),show_len);
        break;
      case "50":
        show_len = 50;
        updateTable(JSON.parse(localStorage.getItem("user_informations")),show_len);
        break;
      case "all":
        show_len = 10000;
        updateTable(JSON.parse(localStorage.getItem("user_informations")),show_len);
        break;
      default:

    }
  };
}


//content of search box is changed trigger the function
$('#search_info').on('paste keyup',function(){
  //get the local data
  var localInfo = JSON.parse(localStorage.getItem("user_informations"));
  //store matched data
  var resultInfo = [];

  //not search input
  if($(this).val().length==0){
    //check if there is an error info
    if($('table').next().attr('class')=='notFound'){
      //remove error
      $('table').next().remove();
    }
    //show local information
    updateTable(JSON.parse(localStorage.getItem("user_informations")),show_len);
  }else{
    for(key1 in localInfo){
      for(key in localInfo[key1]){
        if(localInfo[key1][key].indexOf($(this).val()) >= 0){
          resultInfo.push(localInfo[key1]);
          break;
        }
      }
    }
    searchResultTable(resultInfo,$(this).val());
  }
});

//show search result in table
function searchResultTable(resultArray,searchContent){
  var tableBody = document.getElementById("userTable");
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.lastChild);
  }
  //not found matched record
  if(resultArray.length == 0){
    //already showed error information update content
    if($('table').next().attr('class')=='notFound'){
      $('table').next().html("Your search \""+searchContent+"\" doesn\'t match any record.");
    }else {
      //create error div to show error
      var noMatched = "<div class='notFound'>Your search -<i>"+searchContent+"</i>- doesn\'t match any record.</div>";
      $('table').after(noMatched);
    }
  }else{//got matched record
    if($('table').next().attr('class')=='notFound'){
      $('table').next().remove();
    }
    //need to store index in array to rewrite for buttons
    showUserInfo(resultArray,show_len);
  }
}

//update table based on record number
function updateTable(tableData,slen){
  var tableBody = document.getElementById("userTable");
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.lastChild);
  }
  showUserInfo(tableData,slen);
}

//show detial infor in a new line
function showDetail(keyindex,self){
  //get information array
  var localData = JSON.parse(localStorage.getItem("user_informations"));
  //get the selected tr
  var currentselected = $('#userTable tr:not(".desc")').eq(parseInt(keyindex)+1);

  if(currentselected.next().attr('class')=='desc'){
    currentselected.next().remove();
    self.innerHTML = "SHOW";
  }else {
    $('#userTable tr.desc').remove();
    var detail = "<tr class='desc'><td colspan='6'><h3>Details</h3>Name: "+localData[parseInt(keyindex)].name+";	Email: "+localData[parseInt(keyindex)].email+
    ";	Phone number: "+localData[parseInt(keyindex)].phone+";	Address: "+localData[parseInt(keyindex)].address+"</td></tr>";
    // //$( detail ).insertAfter( currentselected );
    currentselected.after(detail);
    self.innerHTML = "HIDE";
    // console.log(parseInt(keyindex)+1);
  }
}

//edit selected record in a form
function editDetail(keyindex){
  var localData = JSON.parse(localStorage.getItem("user_informations"));

  //remove conflicts which caused by my own fadein/out class
  $('#user_form').removeClass('fadein');
  $('#user_form').removeClass('fadeout');
  //show the form area
  $('#user_form').slideDown().fadeIn("slow");

  $('#save').val("UPDATE");
  //get selected info
  update_index = parseInt(keyindex);
  $('#name').val(localData[update_index].name);
  $('#email').val(localData[update_index].email);
  $('#phone').val(localData[update_index].phone);
  $('#address').val(localData[update_index].address);

}

//delete selected record from local storage
function deleteDetail(keyindex){
  //read information from local storage
  var localData = JSON.parse(localStorage.getItem("user_informations"));
  //remove the selected one from array
  localData.splice(keyindex,1);
  //store the new array back to local storage
  localStorage.setItem("user_informations", JSON.stringify(localData));
  //add fade out animation make sure keyindex is number instead of string
  $('#userTable tr:not(".desc")').eq(parseInt(keyindex)+1).fadeOut("slow",function(){
    updateTable(localData,show_len);
  });

}

//show user information in tables
var showUserInfo = function(tableData,slen){
  var tableBody = document.getElementById("userTable");
  //var tableBody = document.createElement('tbody');

  //check if there is information in tableData
  var len = tableData.length;

  if(len > 0){
    //set the table head
    var row = document.createElement('tr');
    for (key in tableData[0]) {
      var cell = document.createElement('th');
      cell.appendChild(document.createTextNode(key));
      row.appendChild(cell);
    }
    var additionalCell = document.createElement('th');
    additionalCell.append("option");
    row.append(additionalCell);
    tableBody.appendChild(row);

    //get all objects
    for(key1 in tableData) {
      var row = document.createElement('tr');
      //get each element in object
      for(key in tableData[key1]){
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(tableData[key1][key]));
        row.appendChild(cell);
      }
      var additionalCell = document.createElement('td');

      // create show button
      var showButton = document.createElement('button');
      //add text to button
      showButton.innerHTML = "SHOW";
      //create value attribute
      var att = document.createAttribute("value");
      //store the index of record
      att.value = key1;
      //add value attribute
      showButton.setAttributeNode(att);
      showButton.classList.add('showbutton');
      //add click event listener
      showButton.onclick = function(){
        showDetail(this.getAttribute('value'),this);
      };
      //add show button to table cell
      additionalCell.append(showButton);

      //add edit button
      var editButton = document.createElement('button');
      editButton.innerHTML = "EDIT";
      var att = document.createAttribute("value");       // Create a "class" attribute
      att.value = key1;
      editButton.setAttributeNode(att);
      editButton.classList.add('editbutton');
      editButton.onclick = function(){
        editDetail(this.getAttribute('value'));
      };
      additionalCell.append(editButton);

      //add delete button
      var deleteButton = document.createElement('button');
      deleteButton.innerHTML = "DELETE";
      var att = document.createAttribute("value");       // Create a "class" attribute
      att.value = key1;
      deleteButton.setAttributeNode(att);
      deleteButton.classList.add('deletebutton');
      deleteButton.onclick = function(){
        deleteDetail(this.getAttribute('value'));
      };
      additionalCell.append(deleteButton);

      row.append(additionalCell);

      tableBody.appendChild(row);
      if(key1>=slen-1){
        break;
      }
    }

    //table.appendChild(tableBody);
  }
}

//use promise and ajax to load json
var loadUserInfo = function(){
  var xhttp;
  if(window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  var promise = new Promise(function(resolve,reject){
    xhttp.onreadystatechange = function(){
      if(xhttp.readyState == 4 && xhttp.status == 200){
        user_info = xhttp.responseText;
        resolve(user_info);
      }
    };
  });

  xhttp.open('GET','./js/user_info.json');
  xhttp.send();
  return promise;
};

//check if it is already stored
if (localStorage.getItem("user_informations") === null) {
  //take care of json information and promise
  var user_promise = loadUserInfo();

  var read_promise =  new Promise(function(resolve,reject){
    user_promise.then(function(success_resp) {
      //parse json to array
      var user_array = JSON.parse(success_resp);

      //check if local storage is supported
      if(typeof(Storage) != undefined){
        //store array in localstorage
        localStorage.setItem("user_informations", JSON.stringify(user_array));
        resolve();
      }
    }, function(err) {
      reject("Local storage issue!"+err);
    })
  });
  //get local storage info in promise
  read_promise.then(function(success){
    var table_array = JSON.parse(localStorage.getItem("user_informations"));
    //call show user table function
    showUserInfo(table_array,show_len);
  },function(err){
    document.write(err);
  });

}else{
  //the local storage already stored the information, we can just
  //get user info from local storage
  var table_array = JSON.parse(localStorage.getItem("user_informations"));
  //call show user table function
  showUserInfo(table_array,show_len);
}

//get the add button
var add_button = document.getElementById('add');

var form_area = document.getElementById('user_form');
//show add user info form
add_button.onclick = function(){
  $('#save').val("SAVE");
  form_area.classList.remove('fadeout');
  form_area.style.display="block";
  form_area.classList.add('fadein');
  //clear form info
  var user_form = document.getElementById("new_user");
  user_form.reset();
  //set it not a update
  update_index = -1;
};

//get close form button
var close_button = document.getElementById('close_button');
//add onlick function to fade out form
close_button.onclick = function(){
  form_area.classList.remove('fadein');
  form_area.classList.add('fadeout');
  setTimeout(function(){ form_area.style.display="none"; }, 1000);
};

//set onsubmit function
function invalidate(){

  //get all fields
  var name = document.getElementById('name');
  var email = document.getElementById('email');
  var phone = document.getElementById('phone');
  var address = document.getElementById('address');

  //flag varible
  var invalid = false;

  //remove old errors
  var errs = document.querySelectorAll(".err");
  var len = errs.length;
  if(len>0){
    for(var i=0;i<len;i++){
     // formu.removechild(errs[i]);
     errs[i].remove();
   }
  }
  //test if name is empty or undefined
  if(name.value == '' || name.value == undefined){
    invalid = true;
    name.insertAdjacentHTML('afterend', '<div class="err">invalid name</div>');
  }

  //check address
  if(address.value == '' || address.value == undefined){
    invalid = true;
    address.insertAdjacentHTML('afterend', '<div class="err">invalid address</div>');
  }

  //check if email is correct email format
  if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) || email.value == '')
  {
    invalid = true;
    email.insertAdjacentHTML('afterend', '<div class="err">invalid email</div>');
  }

  //check phone number
  if(! /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/.test(phone.value) || phone.value == ''){
    invalid = true;
    phone.insertAdjacentHTML('afterend', '<div class="err">invalid phone number</div>');
  }

  //passed the validation
  if(!invalid){
    //hide form
    form_area.classList.remove('fadein');
    form_area.classList.add('fadeout');
    setTimeout(function(){ form_area.style.display="none"; }, 1000);

    //store the form info in object
    var new_user_info = {
      "name":name.value,
      "email":email.value,
      "phone":phone.value,
      "address":address.value
    };
    //get info array from local storage
    var table_array = JSON.parse(localStorage.getItem("user_informations"));

    //aad new one
    if(update_index == -1){
      //add new object to the array
      table_array.unshift(new_user_info);
    }else{//update
      table_array[update_index] = new_user_info;
    }
    //storage the object array to local storage
    localStorage.setItem("user_informations", JSON.stringify(table_array));
    //show new table
    updateTable(table_array,show_len);

  }
  return false;

};

//add new row to tableBody
// function addrow(new_row){
//
//   var tableBody = document.getElementById("userTable");
//
//     var row = document.createElement('tr');
//     for (key in new_row) {
//       var cell = document.createElement('td');
//       cell.appendChild(document.createTextNode(new_row[key]));
//       row.appendChild(cell);
//     }
//     tableBody.appendChild(row);
// }
