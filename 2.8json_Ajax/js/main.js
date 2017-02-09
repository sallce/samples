var user_info;

//show user information in tables
var showUserInfo = function(tableData){
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
    tableBody.appendChild(row);

    //get all objects
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
      //get each element in object
      for(key in rowData){
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(rowData[key]));
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    });

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
    showUserInfo(table_array);
  },function(err){
    document.write(err);
  });

}else{
  //the local storage already stored the information, we can just
  //get user info from local storage
  var table_array = JSON.parse(localStorage.getItem("user_informations"));
  //call show user table function
  showUserInfo(table_array);
}

//get the add button
var add_button = document.getElementById('add');

var form_area = document.getElementById('user_form');
//show add user info form
add_button.onclick = function(){
  form_area.classList.remove('fadeout');
  form_area.style.display="block";
  form_area.classList.add('fadein');
  //clear form info
  var user_form = document.getElementById("new_user");
  user_form.reset();
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
    //add new object to the array
    table_array.push(new_user_info);
    //storage the object array to local storage
    localStorage.setItem("user_informations", JSON.stringify(table_array));
    //show new table
    addrow(new_user_info);
  }
  return false;

};

//add new row to tableBody
function addrow(new_row){

  var tableBody = document.getElementById("userTable");

    var row = document.createElement('tr');
    for (key in new_row) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(new_row[key]));
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
}
