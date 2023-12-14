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