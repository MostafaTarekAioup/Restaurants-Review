

// var fs = require('fs');
// var data = fs.readFileSync('data/restaurants.json');
// var dataread = JSON.parse(data);
// console.log(dataread);
// type="module";

var xhr = new XMLHttpRequest();
xhr.open('GET','./data/restaurants.json');
xhr.onload = function(){
    let xhrdata = JSON.parse(xhr.responseText);
    // console.log(xhrdata.restaurants[0].id);
    // console.log(xhr.responseText)

    let namein = document.querySelector('#namein');
    let ratein = document.querySelector('#ratein');
    let submit = document.querySelector('#submit');
    let reviewcontainer = document.querySelector('#reviews-list')
    let textar = document.querySelector('#textar');
    let modallink = document.querySelector('#modellink');
    let modallink2 = document.querySelector('#modellink2');
    let modallink3 = document.querySelector('#modellink3');
    let commentid = document.querySelector('#commentid');


submit.addEventListener('click',function(e){

    // e.preventDefault()
     if(!namein.value){
        // alert("Please Add Your Name");
        modallink3.click();
    }
    else if(ratein.value > 5 || !ratein.value){
        // alert("Please Rating Value Is between 1 and 5");
        modallink2.click();
    }

    else{
            const li = document.createElement('li');
            const heading = document.createElement('div');
            heading.className = 'review-heading';
            li.appendChild(heading);
            ////////////////////////
            const name = document.createElement('p');
            name.innerHTML = namein.value;
            name.className = 'name';
            heading.appendChild(name);
            ////////////////////////
            const date = document.createElement('p');
            date.innerHTML = "1 Second Ago";
            date.className = 'date';
            heading.appendChild(date);
            ////////////////////////////
            const rating = document.createElement('p');
            rating.innerHTML = `Rating: ${ratein.value}`;
            rating.className = 'rating';
            li.appendChild(rating);
            ////////////////////////////////
            const comments = document.createElement('p');
            comments.innerHTML = textar.value;
            comments.className = 'comment';
            li.appendChild(comments);
            ///////////////////////////
            reviewcontainer.appendChild(li);

            //  remove reviwe putton

            // submit.parentNode.removeChild(submit);

            let currentid = 0;
            let reslink = window.location.search.toString();
            // console.log(reslink);
            let linkurl = "?id=";
            for(let e = 0 ; e <= xhrdata.restaurants.length ; e++){
                linkurl = `?id=${e}`;
                if(linkurl == reslink){
                        console.log(e);
                        console.log(linkurl);
                        currentid = e;
                            let newdata = {
                            "name":`${namein.value}`,
                            "date": "3 Days Ago",
                            "rating": `${ratein.value}`,
                            "comments": `${textar.value}`
                        }
                        xhrdata.restaurants[e-1].reviews.push(newdata);
                }
                
            }
                modallink.click();
                console.log(currentid);
                console.log(xhrdata.restaurants[currentid-1].reviews);
                commentid.value = currentid;
                console.log(commentid);
                // console.log(xhrdata.restaurants);
        }
    

    })

}
xhr.send();

// let namein = document.querySelector('#namein');
// let ratein = document.querySelector('#ratein');
// let submit = document.querySelector('#submit');
// let reviewcontainer = document.querySelector('#reviews-list')
// let textar = document.querySelector('#textar');
// let modallink = document.querySelector('#modellink');
// let modallink2 = document.querySelector('#modellink2');
// let modallink3 = document.querySelector('#modellink3');


// submit.addEventListener('click',function(){

    
//      if(!namein.value){
//         // alert("Please Add Your Name");
//         modallink3.click();
//     }
//     else if(ratein.value > 5 || !ratein.value){
//         // alert("Please Rating Value Is between 1 and 5");
//         modallink2.click();
//     }

//     else{
//         const li = document.createElement('li');
//     const heading = document.createElement('div');
//     heading.className = 'review-heading';
//     li.appendChild(heading);
//     ////////////////////////
//     const name = document.createElement('p');
//     name.innerHTML = namein.value;
//     name.className = 'name';
//     heading.appendChild(name);
//     ////////////////////////
//     const date = document.createElement('p');
//     date.innerHTML = "1 Second Ago";
//     date.className = 'date';
//     heading.appendChild(date);
//     ////////////////////////////
//     const rating = document.createElement('p');
//     rating.innerHTML = `Rating: ${ratein.value}`;
//     rating.className = 'rating';
//     li.appendChild(rating);
//     ////////////////////////////////
//     const comments = document.createElement('p');
//     comments.innerHTML = textar.value;
//     comments.className = 'comment';
//     li.appendChild(comments);
//     ///////////////////////////
//     reviewcontainer.appendChild(li);
//     // submit.parentNode.removeChild(submit);
//     modallink.click();
//     }

//   console.log('clicked')
//   console.log(xhrdata.restaurants[0].id);
// })

