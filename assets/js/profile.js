// here we will be fetching the url

var id = window.location.href;
id = id.substring(id.indexOf('profile')+8);
console.log(id);
window.localStorage.setItem("user_id",id); 
document.cookie = "user_id"+id;

var userId = document.getElementById("userId");
userId.value = id;

var logout = document.getElementById("logout");
logout.addEventListener("click", function(){
    window.localStorage.removeItem("user_id");
    document.cookie = "user_id" + '=;expires=Thu, 01 jan 1970 00:00:01 GMT;';
    window.location.href = "http://localhost:3000/auth/logout/?user_id="+id;
})

var verify_mobile_link = document.getElementById("verify_mobile_link");
verify_mobile_link.setAttribute("href", "/auth/verify-mobile/?user_id="+id);



function displayNotes(data){
    var notes = data.data;
    var showNotes = document.getElementById("showNotes");
    showNotes.innerHTML = "";
    for(var i=0; i<notes.length; i++){
    var fileLocation = notes[i].fileLocation;
    fileLocation = fileLocation.substring(fileLocation.indexOf("assets")+7)
    showNotes.innerHTML += `<span>
    <h4>${notes[i].name}</h4>
    <p>${notes[i].about}</p>
    <a target="_blank" href="http://localhost:3000/${fileLocation}">go to notes</a>
    </span>`
   }
}

var fetchNotes = document.getElementById("fetchNotes");
    fetchNotes.addEventListener("click", function(){
fetch('http://localhost:3000/notes/get-all-notes/?user_id='+id,{
    method: 'GET',
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // },
    // body: data
 })
 .then(response => response.json())
 .then(data => displayNotes(data))
 .catch(error => console.error(error));
});