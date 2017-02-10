var counter = 0;
var interval_to;

function button_clicked(direction){
  switch (direction) {
    case 'to_left':
      clearInterval(interval_to);
      interval_to = setInterval(function(){
        var left_len = left_box.value.length;
        var right_len = right_box.value.length;
        if(right_len > 0){
          left_box.value = right_box.value[right_len-1] + left_box.value;
          right_box.value = right_box.value.slice(0, right_len-1);
        }
      },1000);
      break;
    case 'to_right':
      clearInterval(interval_to);
      interval_to = setInterval(function(){
        var left_len = left_box.value.length;
        var right_len = right_box.value.length;
        if(left_len > 0){
          right_box.value = right_box.value + left_box.value[0];
          left_box.value = left_box.value.slice(1, left_len);
        }
      },1000);
      break;
    default:
      clearInterval(interval_to);
  }
}
