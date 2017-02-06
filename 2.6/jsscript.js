var left_box = document.getElementById('left_box');
var right_box = document.getElementById('right_box');
var counter = 0;
var interval_to_right;
var interval_to_left;

function to_right_clicked(){

  clearInterval(interval_to_left);
  interval_to_right = setInterval(function(){
    var left_len = left_box.value.length;
    var right_len = right_box.value.length;
    if(left_len > 0){
      right_box.value = right_box.value + left_box.value[0];
      left_box.value = left_box.value.slice(1, left_len);
    }
  },1000);

}

function to_left_clicked(){
  clearInterval(interval_to_right);
  interval_to_left = setInterval(function(){
    var left_len = left_box.value.length;
    var right_len = right_box.value.length;
    if(right_len > 0){
      left_box.value = right_box.value[right_len-1] + left_box.value;
      right_box.value = right_box.value.slice(0, right_len-1);
    }
  },1000);

}

function pause_clicked(){
  clearInterval(interval_to_left);
  clearInterval(interval_to_right);
}
