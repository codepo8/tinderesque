(function(){

  var all = 0;
  var results = document.querySelector('#results');


  document.body.addEventListener('yepcard', function(ev) {
    results.innerHTML += '<li>'+ev.detail.card.innerHTML+'</li>';
    updatecounter();
  });

  document.body.addEventListener('nopecard', function(ev) {
  });

  document.body.addEventListener('deckempty', function(ev) {
    results.classList.add('live');
    ev.detail.container.style.display = 'none';
  });

  window.addEventListener('load', function(ev) {
    // check if template is supported
    // browsers without it wouldn't need to
    // do the content shifting
/*
    if ('content' in document.createElement('template')) {
      // get the template
      var t = document.querySelector('template');
      // get its parent element
      var list = t.parentNode;
      // cache the template content
      var contents = t.innerHTML;
      // kill the template
      list.removeChild(t);
      // add the cached content to the parent
      list.innerHTML += contents;
    }
*/
    all = document.body.querySelectorAll('.card').length + 1;
  });

var hammertime = new Hammer(document.querySelector('.cardcontainer'));
hammertime.on('swipeleft', function(ev) {
  document.querySelector('.but-nope').click();
});
hammertime.on('swiperight', function(ev) {
  document.querySelector('.but-yay').click();
});

})();
