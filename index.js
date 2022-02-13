firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    document.getElementById("user_div").style.display = "block";
    document.getElementById("forgot_div").style.display = "none";

    var user = firebase.auth().currentUser;

    if(user != null){

      var email_id = user.email;
      document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;

    }

  } else {
    // No user is signed in.

    document.getElementById("user_div").style.display = "none";
    document.getElementById("forgot_div").style.display = "block";

  }
});

function forgotPassword(){

  var userEmail = document.getElementById("l_email_field").value;
  var userCode = document.getElementById("l_code_field").value;
  var userId = userEmail.substring(0, userEmail.lastIndexOf("@"));;
  var password;
  var dbBlogs = firebase.database().ref().child("comments");

  dbBlogs.on("value", function(blogs){
    if(blogs.exists()){
        blogs.forEach(function(singleBlog){
          console.log(singleBlog.val());
        })
    }
  })
 /* firebase.database().ref('users/'+userId).on('value', function(snapshot){
    password = snapshot.val().password;
    console.log(password);
  }) */
  window.alert("Password : " + password);
}

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function signUp(){

  var userEmail = document.getElementById("s_email_field").value;
  var userPass = document.getElementById("s_password_field").value;
  var userCode = document.getElementById("code_field").value;
  var userId = userEmail.substring(0, userEmail.lastIndexOf("@"));

  firebase.database().ref('users/'+userId).set({
    emailId : userEmail,
    password : userPass,
    secretCode : userCode
  });

}

function logout(){
  firebase.auth().signOut();
}





/************************************************* */

window.onload = function() {
  loadData();
  loadCommentsDB();
};

var userDB=[];
var commentsDB =[];

var loginBox = document.getElementById("login");
var regBox = document.getElementById("register");
var forgetBox = document.getElementById("forgot");

var loginTab = document.getElementById("lt");
var regTab = document.getElementById("rt");

function regTabFun(){
    event.preventDefault();

    regBox.style.visibility="visible";
    loginBox.style.visibility="hidden";
    forgetBox.style.visibility="hidden";

    regTab.style.backgroundColor="rgb(12, 132, 189)";
    loginTab.style.backgroundColor="rgba(11, 177, 224, 0.82)";
}
function loginTabFun(){
    event.preventDefault();

    regBox.style.visibility="hidden";
    loginBox.style.visibility="visible";
    forgetBox.style.visibility="hidden";

    loginTab.style.backgroundColor="rgb(12, 132, 189)";
    regTab.style.backgroundColor="rgba(11, 177, 224, 0.82)";
}
function forTabFun(){
    event.preventDefault();

    regBox.style.visibility="hidden";
    loginBox.style.visibility="hidden";
    forgetBox.style.visibility="visible";

    regTab.style.backgroundColor="rgba(11, 177, 224, 0.82)";
    loginTab.style.backgroundColor="rgba(11, 177, 224, 0.82)";

}

async function loadData(){
  userDB = [];
  if(Object.keys(userDB).length === 0){
    var leadsRef = firebase.database().ref('users');
    leadsRef.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          userDB.push(childData);
        });
        console.log(userDB);
    });
    
  }
  
}

async function loadCommentsDB(){
  commentsDB = [];
  if(Object.keys(commentsDB).length === 0){
    var leadsRef = firebase.database().ref('comments');
    leadsRef.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          commentsDB.push(childData);
        });
        console.log(commentsDB);
    });
    
  }
  
}


function register(){
    event.preventDefault();

    if(Object.keys(userDB).length === 0){
      loadData();
    }

    var email = document.getElementById("re").value;
    var password = document.getElementById("rp").value;
    var code = document.getElementById("rrp").value;

    if (email == ""){
        alert("Email required.");
        return ;
    }
    else if (password == ""){
        alert("Password required.");
        return ;
    }
    else if (code == ""){
        alert("Secret code required.");
        return ;
    }
    else if (checkIfUserExists(email,password,true)){
      alert(email + " is already register.");
      return ;
    }
    var userId = email.substring(0, email.lastIndexOf("@"));

    firebase.database().ref('users/'+userId).set({
      emailId : email,
      password : password,
      secretCode : code
    });

    loadData();
    console.log(userDB);
        alert(email + "  Thanks for registration. \nTry to login Now");

        document.getElementById("re").value ="";
        document.getElementById("rp").value="";
        document.getElementById("rrp").value="";
    
        loginTabFun();
}

function checkIfUserExists( emailId, pass, checkOnlyMail){

  var emailFlag = false;
  var passFlag = false;
  for(var i =0;i< userDB.length;i++){

    if(userDB[i].emailId == emailId){
      emailFlag = true;
    }
    if(checkOnlyMail && emailFlag){
      return emailFlag;
    }
    if(userDB[i].password == pass){
      passFlag = true;
    }
    if(emailFlag && passFlag){
      break;
    }
    emailFlag = false;
    passFlag = false;
  };

    return emailFlag && passFlag;


}

function login(){
    event.preventDefault();
    if(Object.keys(userDB).length === 0){
      loadData();
    }
    
    var email = document.getElementById("se").value;
    var password = document.getElementById("sp").value;

    if(email.length <=0){
      alert("Email required.");
      return ;
    }
    if(password.length <=0){
      alert("Password required.");
      return ;
    }
    
    if(checkIfUserExists(email,password)){
        alert("Logged In");
        loadCommentsPage(email);
        document.getElementById("se").value ="";
        document.getElementById("sp").value="";
    }else{
      alert("Invalid Credentials");
    }

}
function forgot(){
    event.preventDefault();
    if(Object.keys(userDB).length === 0){
      loadData();
    }
    var email = document.getElementById("fe").value;
    var code = document.getElementById("fc").value;
    if (email == ""){
         alert("Email required.");
        return ;
    }
    var emailFlag = false;
    var passFlag = false;
    for(var i =0;i< userDB.length;i++){

      if(userDB[i].emailId == email){
        emailFlag = true;
      }
      if(userDB[i].secretCode == code){
        passFlag = true;
      }
      if(emailFlag && passFlag){
        alert("Your password is: "+userDB[i].password);
        break;
      }
      emailFlag = false;
      passFlag = false;
    };
       
    document.getElementById("fe").value ="";
    document.getElementById("fc").value ="";
    loginTabFun();
}

function loadCommentsPage(currentUser){

  document.getElementById("commentsDiv").style.display = "block";
  document.getElementById("container").style.display = "none";
  window.localStorage.setItem('curr_user', currentUser);
  displayComments();
}

function addCommentstoDB(){
  var comment = document.getElementById("commentText").value;
  var user = window.localStorage.getItem('curr_user');
  var commentId = Math.floor(Math.random() * 1000);
  firebase.database().ref('comments/'+commentId).set({
    comment : comment,
    user : user
  });
  
  displayComments();
  console.log(commentsDB);
}

function displayComments(){
  if(Object.keys(commentsDB).length === 0){
    loadCommentsDB();
  }
  var initialComment = document.getElementById("displayComments");
  initialComment.innerHTML="";
  for(var i=0;i<commentsDB.length;i++){
    var email = document.createElement("div");
    email.innerHTML = commentsDB[i].user;
    email.style.cssText = 'padding: 10px 15px;font-size: 16px;';
    var comment = document.createElement("div");
    comment.innerHTML = commentsDB[i].comment;
    comment.style.cssText = 'padding: 10px 15px;font-size: 1.3em;color: black;';
    var finalComment = document.createElement('div');
    finalComment.style.cssText = 'display: inline-flex;padding: 2%; min-width:80%';
    finalComment.appendChild(email);
    finalComment.appendChild(comment);
    initialComment.appendChild(finalComment);

  }
}

  function filterComments(){
    if(Object.keys(commentsDB).length === 0){
      loadCommentsDB();
     
    }
    var initialComment = document.getElementById("displayComments");
    initialComment.innerHTML="";
    for(var i=0;i<commentsDB.length;i++){
      if(commentsDB[i].user == localStorage.getItem('curr_user')){
        var email = document.createElement("div");
        email.innerHTML = commentsDB[i].user;
        email.style.cssText = 'padding: 10px 15px;font-size: 16px;';
        var comment = document.createElement("div");
        comment.innerHTML = commentsDB[i].comment;
        comment.style.cssText = 'padding: 10px 15px;font-size: 1.3em;color: black;';
        var finalComment = document.createElement('div');
        finalComment.style.cssText = 'display: inline-flex;padding: 2%; min-width:80%';
        finalComment.appendChild(email);
        finalComment.appendChild(comment);
        initialComment.appendChild(finalComment);
      }
  
    }
  }


