var map;
var markers=new Array();
var message=document.getElementById("message");

function myMap(position) {
  var mapCanvas = document.getElementById("map");
  console.log(mapCanvas);
  var userCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var mapOptions = {
    center: userCenter, //from the getLocation
    zoom: 12, //0 is the earth, larger the zoom is, the map is more zoomed in.
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(mapCanvas, mapOptions);
  var marker=new google.maps.Marker({position: userCenter});
  marker.setMap(map);
  markers.push(marker);
 //console.log("push usercenter");
  searchStore(userCenter);
}

function createMarker(place){
  var l = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
  //var marker=new google.maps.Marker({position: location, animation: google.maps.Animation.BOUNCE});
  var marker=new google.maps.Marker({position: l});
  marker.setMap(map);
  markers.push(marker);
  //console.log("push store location");
  var infowindow = new google.maps.InfoWindow({
    content: place.name
  });
  infowindow.open(map,marker);
  drawpath();
}

function searchStore(position){
  var request = {
      location: position,
      radius: '500',
      query: 'Giant Eagle'
    };
    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //for (var i = 0; i < results.length; i++) {
      //var place = results[i];
      createMarker(results[0]);
     //}
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(myMap, showError);
    // myMap is the call back function, while show Error is the function
    // called if geolocation get failed.
  } else {
    alert("??");
    message.innerHTML="Geolocation is not supported by this browser.";
  }
}

function drawpath(){
  var path = new google.maps.MVCArray();
  //Intialize the Direction Service
  var service = new google.maps.DirectionsService();
  //Set the Path Stroke Color
  var poly = new google.maps.Polyline({
    map: map,
    strokeColor: '#4986E7'
  });

  var src=markers[0].position;
  //console.log(src);
  var des=markers[1].position;

  //console.log(des);
  poly.setPath(path);
  service.route({
    origin: src,
    destination: des,
    travelMode: google.maps.DirectionsTravelMode.WALKING
  }, function(results,status){
    if (status == google.maps.DirectionsStatus.OK) {
      for (var i = 0, len = results.routes[0].overview_path.length; i < len; i++) {
        path.push(results.routes[0].overview_path[i]);
      }
    }
  });
}
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      message.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      message.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      message.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      message.innerHTML = "An unknown error occurred."
      break;
  }
}
/*$(document).ready(function () {
  alert("start!");
  getLocation();
  alert("done!");
});*/