let xhr = new XMLHttpRequest();
xhr.open('GET','./data/adminsecurity.json');
xhr.onload = function(){
   let xhrdata = JSON.parse(xhr.responseText);
//    console.log(xhrdata);
//    console.log(xhrdata.adminName);
   let adminname = document.querySelector('#adminname');
   let adminpassword = document.querySelector('#adminpassword');
   let adminlogin = document.querySelector('#loginputton');
   adminlogin.addEventListener('click',function(){
     
     if(adminname.value == xhrdata.adminName && adminpassword.value == xhrdata.adminPassword)  {
         console.log('true');
         window.location.href = "./admin.html";
     } 
     else{
         console.log('error');
     }
   })
};
xhr.send()