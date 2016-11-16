/**
 * Created by yunpengx on 10/28/16.
 */

$(document).ready(function () {
    document.getElementById("timestamp").innerHTML = String(new Date().getFullYear());
    default_url=document.getElementById("portrait").src; 
    $("#fb-login").on("click", function( event ) { 
        FB.login(function(response){
           // Handle the response object
              checkLoginState();
              getUserInfo(response);
        }, {scope: 'public_profile,email'});
   });
    $("#fb-signup").on("click", function( event ) { 
        FB.login(function(response){
           // Handle the response object
              checkLoginState();
              getUserInfo(response);
        }, {scope: 'public_profile,email'});
   });
    $("#fb-logout").on("click", function( event ) {
        $("#fb-login").show();
        $("#fb-logout").hide(); 
        FB.logout(function(response){
           // Handle the response object
              console.log("user now logged out");
              document.getElementById("user_photo").src="";
              var url=document.getElementById("user_photo").src;
              console.log("picture has changed to: "+ url);   
        }); 
   });
   
});

function getUserInfo(response) {
  var token = response.authResponse.accessToken;
  var username;
  var p_url;

  if (response.authResponse) {
      FB.api('/me', 'get', { access_token: token, fields: 'name,gender' }, function(response) {
        console.log(response);
        username=response.name;
      });
      FB.api("/me/picture", { redirect: 0 }, function (response) {
      if (response && !response.error) {
        /* handle the result */
        console.log(JSON.stringify(response));
        p_url=response.data['url'];
        document.getElementById("portrait").src = p_url; 
      }
      });
      
      alert("before post");
      $.post("/cookyourself/add_user",
      {
        token: token,
        username: username,
        url: p_url
      })
      .success(function() { alert("second success"); })
      .error(function() { alert("error"); })
      .complete(function() { alert("complete"); });
      alert("after post");
  }
}
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      $("#fb-logout").show(); 
      $("#fb-login").hide(); 
      $("#fb-signup").hide(); 
      FB.api("/me/picture", { redirect: 0 }, function (response) {
      if (response && !response.error) {
        /* handle the result */
        console.log(JSON.stringify(response));
        var p_url=response.data['url'];
        document.getElementById("portrait").src = p_url; 
      }
    });
      console.log(response.authResponse.accessToken);
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
      $("#fb-signup").show(); 
      document.getElementById("user_photo").src="";  

    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
        $("#fb-signup").show(); 
        $("#fb-login").show();
        $("#fb-logout").hide(); 
        document.getElementById("user_photo").src="";  
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '945239262274790',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.


  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    /*FB.api('/me', function(response) {
      var token = response.authResponse.accessToken;
      var uid = response.authResponse.userID;
      console.log('Successful login for: ' + response.name);
      console.log(JSON.stringify(response));
      FB.api(
      '/'+response.id,
      function (resp) {
      if (response && !response.error) {
        console.log(JSON.stringify(resp));
        /* handle the result */
      /*}
    }
);
    });*/
  }