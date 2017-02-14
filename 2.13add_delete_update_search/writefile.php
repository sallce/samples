<?php
$file = fopen("userInfo.json","w");

$text = '';
for ($i = 0; $i < 100; $i++) {
  $text = $text.'{
    "name":"Yachao_'.$i.'",
    "email":"yachaocs'.$i.'@gmail.com",
    "phone":"2987645109",
    "address":"Piscataway'.$i.'"
  },';
}

fwrite($file,$text);
echo $text;

fclose($file);
?>
