window.addEventListener('load', function(e) {
  document.querySelector('#output-text').innerHTML = frenchToSms('Bonjour monsieur, comment allez-vous ?');
  document.querySelector('#input-text').focus();
});


document.querySelector('#input-text').addEventListener('keyup', function(e) {
  var input = e.target.value;

  if (input) {
    document.querySelector('#output-text').innerHTML = frenchToSms(input);
  } else {
    document.querySelector('#output-text').innerHTML = '';
  }
});
