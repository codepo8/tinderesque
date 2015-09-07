(function(){

  var all = 0;
  var results = document.querySelector('#results');
  var counter = document.querySelector('#counter');

  function updatecounter() {
    --all;
    counter.innerHTML = all;
  }

  document.body.addEventListener('yepcard', function(ev) {
    results.innerHTML += '<li>'+ev.detail.card.innerHTML+'</li>';
    updatecounter();
  });

  document.body.addEventListener('nopecard', function(ev) {
    updatecounter();
  });

  document.body.addEventListener('deckempty', function(ev) {
    results.classList.add('live');
    ev.detail.container.style.display = 'none';
  });

  window.addEventListener('load', function(ev) {
    all = document.body.querySelectorAll('.card').length + 1;
    updatecounter();
  });

})();
