/*
  SimpleCamShot by Christian Heilmann
  Homepage: http://codepo8.github.io/simplecamshot
  Copyright (c)2015 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
var simplecamshot = function() {

  /* Configuration object - this can be overriden on init */
  var config = {
    startLabel: 'Start Camera',
    stopLabel: 'Stop Camera',
    width: '320',
    createImage: true
  }

  /* As we resize the video in aspect ratio, we preset height as 0 */
  var height = 0;
  /*
    In order to stop the stream from the camera,
    we need to store it…
  */
  var currentstream = false;

  /* Let's do this! */
  function init(container) {

    /* If the container element does't exist, we can't do anything */
    if (!container) { return; }

    /* Sigh, browser prefixes… */
    navigator.getMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );

    /* If the browser isn't capable, leave */
    if (!navigator.mediaDevices && !navigator.getMedia) {
      button.remove();
      return;
    }

    /*
      Creating the play button. The playing expando is there to
      determine its state in the event handler
    */
    var button = document.createElement('button');
    button.playing = false;
    button.innerHTML = config.startLabel;
    container.appendChild(button);

    /*
      Create video element and canvas to store the camshot.
      Wrap the video in a button to make it keyboard accessible
    */
    var canvas = document.createElement('canvas');
    var video = document.createElement('video');
    var videobutton = document.createElement('button');
    videobutton.className = 'video';
    videobutton.appendChild(video);
    videobutton.style.display = 'none';
    container.appendChild(videobutton);

    /*
      Create an image if specified in the config.
      Cheating with an empty object to avoid
      having to keep checking that.
    */
    var photo = (config.createImage) ?
             document.createElement('img') :
             {style:{}};
    if (config.createImage) {
      container.appendChild(photo);
    }
    photo.style.display = 'none';

    /* Let's start the show on user interaction */
    button.addEventListener('click', function(ev) {

      /* If the video isn't playing yet */
      if (!button.playing) {

        // If the mediaDevices API is supported…
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          var constraints = {
            audio: false, video: {
              width: 1280, height: 720
            }
          };
          var p = navigator.mediaDevices.getUserMedia(constraints);
          p.then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            currentstream = stream;
          });

        // or use good old gUM…
        } else {
          /* Request a video */
          navigator.getMedia({
              video: true,
              audio: false
            },
            /* Browser prefixes, browser prefixes everywhere… */
            function(stream) {
              if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
              } else {
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL.createObjectURL(stream);
              }
              /* cache stream reference to stop video later */
              video.play();
              currentstream = stream;
            },

            /* If something went wrong, hide video and photo */
            function(err) {
              console.log('Bugger: ' + err);
              videobutton.style.display = 'none';
              photo.style.display = 'none';
            }
          );
        }

        /* toggle button */
        button.innerHTML = config.stopLabel;
        button.playing = true;

      /* If the video is playing, hide it and stop the stream */
      } else {
        videobutton.style.display = 'none';
        /* Really, Chrome? */
        if (!currentstream.stop) {
          currentstream.getVideoTracks()[0].stop();
        } else {
          currentstream.stop();
        }
        /* toggle button */
        button.innerHTML = config.startLabel;
        button.playing = false;
      }
      ev.preventDefault();
    });

    /* If the video can play, resize it and show it */
    video.addEventListener('canplay', function(ev) {
      /* keep aspect ratio */
      height = video.videoHeight / (video.videoWidth/+config.width);
      video.setAttribute('width', config.width);
      video.setAttribute('height', height + '');
      canvas.setAttribute('width', config.width);
      canvas.setAttribute('height', height + '');
      videobutton.style.display = 'block';
    }, false);

    /* If the user clicks the video, take a photo */
    videobutton.addEventListener('click', function(ev) {
      takepicture();
      photo.style.display = 'block';
    });

    /*
      Copy video frame to canvas, create image url and fire
      custom event with the full size image as the data
    */
    function takepicture() {
      canvas.setAttribute('width', config.width);
      canvas.setAttribute('height', height + '');
      canvas.getContext('2d').drawImage(video, 0, 0, +config.width, height);
      var data = canvas.toDataURL('image/png');
      photo.width = config.width;
      photo.height = height;
      photo.src = data;
      canvas.setAttribute('width', video.videoWidth + '');
      canvas.setAttribute('height', video.videoHeight + '');
      canvas.getContext('2d').drawImage(
        video, 0, 0, video.videoWidth, video.videoHeight
      );
      fireCustomEvent('imagetaken', canvas.toDataURL('image/png'));
    }

    /* Helper method to fire custom event */
    function fireCustomEvent(name, payload) {
      var newevent = new CustomEvent(
        name, { detail: payload }
      );
      container.dispatchEvent(newevent);
    }
  }
  return {
    config: config,
    init: init
  }
}();