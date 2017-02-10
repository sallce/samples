// Code goes here
//set drag start event for all image boxes
document.getElementById('img1').addEventListener('dragstart',function(event){
  //use dataTransfer to store the id info
  event.dataTransfer.setData('img_id',this.getAttribute('id'));
});

document.getElementById('img2').addEventListener('dragstart',function(event){
  event.dataTransfer.setData('img_id',this.getAttribute('id'));
});

document.getElementById('img3').addEventListener('dragstart',function(event){
  event.dataTransfer.setData('img_id',this.getAttribute('id'));
});

//add dragover to image showing area
document.getElementById('divCntr').addEventListener('dragover',function(event){
  //remove the default effect
  event.preventDefault();
});

document.getElementById('divCntr').addEventListener('drop',function(event){
  // var img_id = event.dataTransfer.getData('img_id'),
  //     img_src = document.getElementById(img_id).getAttribute('src'),
  //     img_html = "<img style='width:50%;' src='"+img_src+"' />";
  //     console.log(img_src);

  // document.getElementById('divCntr').insertAdjacentHTML('afterbegin',img_html);

  //get image box id
  var img_box = event.dataTransfer.getData('img_id');
  //create new image box object
  var new_box = document.createElement('div');
  //create new image object
  var new_img = document.createElement('img');
  //create new label for image
  var new_label = document.createElement('label');
  //create close span
  var close_span = document.createElement('span');
  close_span.innerHTML = "×";
  close_span.style.display="block";
  //set src attribute to new image
  new_img.setAttribute('src',document.getElementById(img_box).childNodes[1].getAttribute('src'));
  //set label content
  new_label.textContent = document.getElementById(img_box).getElementsByTagName('label')[0].textContent;
  //set css style to image box
  new_box.classList.add('img_box');
  new_box.style.width="42%";
  //add image to image box
  new_box.appendChild(new_img);
  //add label to image box
  new_box.appendChild(new_label);
  //add label to image box
  new_box.appendChild(close_span);

  this.appendChild(new_box);

  close_span.addEventListener('click',function(){
    document.getElementById('divCntr').removeChild(new_box);
  });

});
