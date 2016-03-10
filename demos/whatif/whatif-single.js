(function(){

  var all = 0;
  var cardcontainer = document.querySelector('.cardcontainer');

  tinderesque.yepcard = function(detail) {
    liked(detail);
  }
  tinderesque.nopecard = function(detail) {
    disliked(detail);
  }

  window.addEventListener('yepcard', function(ev) {
    liked(ev.detail);
  });

  window.addEventListener('nopecard', function(ev) {
    disliked(ev.detail);
  });


  document.forms[0].addEventListener('submit', function(ev) {
    ev.preventDefault();
    seedlist();
    document.body.classList.add('sent');
  });

  document.querySelector('header ul').addEventListener('click', function(ev) {
    ev.preventDefault();
    if (ev.target.tagName === 'A') {
      document.querySelector('#request').value = ev.target.innerHTML;
    seedlist();
    document.body.classList.add('sent');
    }
  });



  window.addEventListener('load', function(ev) {
    document.body.classList.add('loaded');
  });

  function liked(detail) {

  }
  function disliked(detail) {

  }

  var img = document.querySelector('.card img');
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  c.width = 400;
  c.height = 225;
  c.hasimg = false;
  var currentthumbone = null;
  var currentthumbtwo = null;

  function seedlist() {
    c.width = img.offsetWidth;
    c.height = img.offsetHeight;
    watermark(img, c.width, c.height)
  }

  function watermark(img, x, y) {
    cx.drawImage(img, 0, 0, x, y);
    cx.fillStyle = 'rgba(0,0,0,0.6)';
    cx.fillRect(0, y-25, x, y-25);
    cx.fillStyle = '#fff';
    cx.font = '14pt Calibri';
    cx.fillText("what-if.net", 5, y - 8);
    cx.fillText("#whatif", x - 65, y - 8);
    img.src = c.toDataURL('image/jpeg', 1);
  }

  var tinderswipe = new Hammer(document.querySelector('.cardcontainer'));
  tinderswipe.on('swipeleft', function(ev) {
    document.querySelector('.but-nope').click();
  });
  tinderswipe.on('swiperight', function(ev) {
    document.querySelector('.but-yay').click();
  });

  if (document.querySelector('.build')) {
    var buildtap = new Hammer(document.querySelector('.build'));
    buildtap.on('tap', function(ev) {
      document.body.classList.toggle('tweak');
    });
  }

})();
