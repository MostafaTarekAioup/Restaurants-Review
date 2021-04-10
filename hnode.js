
//  import 'nodejs-model';
  import { readFileSync } from 'fs';
  
  var data = readFileSync('data/restaurants.json');
  var dataread = JSON.parse(data);
  console.log(dataread);
// type="module";
// var sup = document.querySelector('#submit');
// sup.addEventListener('click',function(){
  
//   console.log("adadadaadada");
// })
