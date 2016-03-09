(function(){

  var all = 0;
  var cardcontainer = document.querySelector('.cardcontainer');

  window.addEventListener('yepcard', function(ev) {
    console.log(ev);
  });

  window.addEventListener('nopecard', function(ev) {
  });

  window.addEventListener('deckempty', function(ev) {
    seedlist();
  });

  window.addEventListener('load', function(ev) {
    seedlist();
  });

  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  c.width = 250;
  c.height = 300;
  c.hasimg = false;
  var currentthumbone = null;
  var currentthumbtwo = null;

  function seedlist() {
    var tinderlist = document.querySelector('.cardlist');
    var firstthumbs = document.querySelectorAll('.thumbs-one img');
    var secondthumbs = document.querySelectorAll('.thumbs-two img');
    var all = firstthumbs.length;
    var out = '';
    for (var i = 0; i < all; i++) {
      out += '<li class="';
      out += (i > 0) ? 'card' : 'card current';
      out += '"><img src="' + miximages(firstthumbs[i], secondthumbs[i]) + '" alt=""></li>';
    }
    tinderlist.innerHTML = out;
  }

  function miximages(img1, img2) {
    cx.clearRect(0, 0, 250, 300);
    cx.drawImage(img1, 0, 0, 250, 300);
    cx.drawImage(img2, 0, 150, 250, 300);
    watermark();
    return c.toDataURL('image/jpeg', 0.5);
  }

  function addtocanvas(img, clear) {
    if (img.tagName === 'IMG') {
      if (clear) {
        cx.clearRect(0, 0, 250, 300);
      }
      var y = clear ? 0 : 150;
      cx.drawImage(img, 0, y, 250, 300);
      if (!clear) {
        watermark();
      }
    }
  }
  function watermark() {
    cx.fillStyle = 'rgba(0,0,0,0.6)';
    cx.fillRect(0, 270, 250, 320);
    cx.fillStyle = '#fff';
    cx.font = '14pt Calibri';
    cx.fillText("what-if.net", 5, 290);
    cx.fillText("#whatif", 180, 290);
  }

  var tinderswipe = new Hammer(document.querySelector('.cardlist'));
  tinderswipe.on('swipeleft', function(ev) {
    console.log(ev);
    document.querySelector('.but-nope').click();
  });
  tinderswipe.on('swiperight', function(ev) {
    console.log(ev);
    document.querySelector('.but-yay').click();
  });

  if (document.querySelector('.build')) {
    var buildtap = new Hammer(document.querySelector('.build'));
    buildtap.on('tap', function(ev) {
      document.body.classList.toggle('tweak');
    });
  }

})();
