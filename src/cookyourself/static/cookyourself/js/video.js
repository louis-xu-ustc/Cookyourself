// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');


tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  var play = document.getElementById('player');
  var vid= play.getAttribute("data-video")
  player = new YT.Player('player', {
    height: '480',
    width: '640',
    videoId: vid,
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      iv_load_policy: 3,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  // event.target.playVideo();
  var container = document.getElementsByClassName('video-container');
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}
function stopVideo() {
  player.stopVideo();
}
