(function(){
  var b=document.querySelector('.sh-burger'), n=document.getElementById('mnav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});}
  var d=document.querySelector('.sh-nav details');
  if(d){document.addEventListener('click',function(e){if(d.open&&!d.contains(e.target))d.open=false;});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){d.open=false;if(n){n.classList.remove('open');b&&b.setAttribute('aria-expanded','false');}}});}
})();
