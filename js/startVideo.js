//var WpApp;
///******/ (() => { // webpackBootstrap
//var __webpack_exports__ = {};
// require('./index.js')

var video;
var bandwidth;
var conference;
var pin;

var rtc = null;

/* ~~~ SETUP AND TEARDOWN ~~~ */

function finalise(event) {
    rtc.disconnect();
    video.src = "";
}

function remoteDisconnect(reason) {
    //cleanup();
    alert(reason);
    window.removeEventListener('beforeunload', finalise);
    //window.close();
}

function doneSetup(videoURL, pin_status) {
    console.log("PIN status: " + pin_status);
    rtc.connect(pin);
}

function connected(videoURL) {
    video.poster = "";
    if (typeof(MediaStream) !== "undefined" && videoURL instanceof MediaStream) {
        video.srcObject = videoURL;
    } else {
        video.src = videoURL;
    }
}

function initialise(node, conference, userbw, name, userpin) {
    video = document.getElementById("video");
    console.log("Bandwidth: " + userbw);
    console.log("Conference: " + conference);

    pin = userpin;
    bandwidth = parseInt(userbw);

    rtc = new PexRTC();

    window.addEventListener('beforeunload', finalise);

    rtc.onSetup = doneSetup;
    rtc.onConnect = connected;
    rtc.onError = remoteDisconnect;
    rtc.onDisconnect = remoteDisconnect;

    rtc.makeCall(node, conference, name, bandwidth);
}

function endCall() {
  console.log("User wants to end the call.");
  rtc.disconnect();
  video.srcObject = "";
}

// Video Navigation Menu

(function() {
  
  $('li').text('');
  
    var co = $('ul').find('li').each(function(){
    var $this = $(this),
        $author = $this.data('item');
    
    var author = $('<span></span>', {
      class: 'item-close',
      text: $author
    }).appendTo( $this.closest('li') );
      
  });
  
  var $close = $('.close'),
      $pop = $('.pop'),
      $iconcube = $('.icon-cube'),
      $iconbox = $('.icon-box'),
      $itemclose = $('.item-close'),
      $button = $('#btn');
  
    $($button).on('click', function() {
        $($close, $pop).toggleClass('close pop');
        $($iconcube, $iconbox).toggleClass('icon-cube icon-box');
        $($itemclose).toggleClass('item-close item-open');
        $($button).toggleClass('active');
        
    });
    
})();




//Get Media Devices

//'use strict';

//var videoElement = document.querySelector('videoSelf');
//var audioSelect = document.querySelector('select#audioSource');
//var videoSelect = document.querySelector('select#videoSource');

//audioSelect.onchange = getStream;
//videoSelect.onchange = getStream;

//getStream().then(getDevices).then(gotDevices);

//function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
//  return navigator.mediaDevices.enumerateDevices();
//}

//function gotDevices(deviceInfos) {
 // window.deviceInfos = deviceInfos; // make available to console
 // console.log('Available input and output devices:', deviceInfos);
  //for (const deviceInfo of deviceInfos) {
  //  const option = document.createElement('option');
  //  option.value = deviceInfo.deviceId;
  //  if (deviceInfo.kind === 'audioinput') {
  //    option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
  //    audioSelect.appendChild(option);
  //  } else if (deviceInfo.kind === 'videoinput') {
   //   option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
   //   videoSelect.appendChild(option);
  //  }
//  }
//}

//function getStream() {
 // if (window.stream) {
  //  window.stream.getTracks().forEach(track => {
   //   track.stop();
   // });
  //}
  //const audioSource = audioSelect.value;
  //const videoSource = videoSelect.value;
  //const constraints = {
  //  audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
  //  video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  //};
  //return navigator.mediaDevices.getUserMedia(constraints).
   // then(gotStream).catch(handleError);
//}

//function gotStream(stream) {
  //window.stream = stream; // make stream available to console
  //audioSelect.selectedIndex = [...audioSelect.options].
  //  findIndex(option => option.text === stream.getAudioTracks()[0].label);
 // videoSelect.selectedIndex = [...videoSelect.options].
  //  findIndex(option => option.text === stream.getVideoTracks()[0].label);
  //videoElement.srcObject = stream;
//}

//function handleError(error) {
//  let pre = document.createElement('PRE');
 // pre.innerText = error;
 // document.body.appendChild(pre);
 // console.error('Error: ', error);
//}


// Attach listeners to things
//try {
//  document.getElementById("end-call-link").addEventListener("click", endCall);
//} catch (error) {
//  console.error(error);
//}


// Fire things up
//window.onload = function()
//{
    /* Params: conf node, conf name, bandwidth, display name, PIN */
   // initialise("pex-gcc.com", conference, "1024", "Kiosk 101", "2021");
//}


// I can haz socket?
//const socket = new WebSocket('ws://localhost:8999');


//function createMessage(content) {
//    var message = {content: content,
//      isBroadcast: false,
//      sender: "WebClient"
//    }
//    return JSON.stringify(message);
//}


//socket.addEventListener('open', function (event) {
//    socket.send(createMessage("Hello server, I'm a PexRTC client"));
//});

// Listen for messages
//socket.addEventListener('message', function (event) {
//    console.log('Message from server ', event.data);
//    var message = JSON.parse(event.data)
//    document.getElementById('message-pane').innerText = message.content.split(':')[1].substring(1);
//});

//WpApp = __webpack_exports__;
///******/ })()
//;