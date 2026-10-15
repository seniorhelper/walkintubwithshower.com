/* Quote form: FormSubmit AJAX, honeypot, time trap, one POST per send. */
(function(){
  var form = document.getElementById('qf');
  if (!form) return;
  var PHONE = '1-888-779-2284';
  var loadedAt = Date.now();
  var sending = false, done = false;
  var status = form.querySelector('.qstatus');
  var btn = form.querySelector('button[type="submit"]');
  var btnText = btn.textContent;

  function dest(){ return atob(form.dataset.a) + String.fromCharCode(64) + atob(form.dataset.b); }
  function say(cls, html){ status.className = 'qstatus ' + cls; status.innerHTML = html; }
  var tel = '<a href="tel:' + PHONE + '">' + PHONE + '</a>';

  // Answers handed over from the decision helper or the fit checker
  try {
    var note = localStorage.getItem('wits_note');
    var msg = form.elements['notes'];
    if (note && msg && !msg.value) msg.value = note + '\n\n';
    if (note) localStorage.removeItem('wits_note');
  } catch (e) {}

  form.addEventListener('input', function(){ if (done) { done = false; if (!sending) { btn.disabled = false; btn.textContent = btnText; } } });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (sending || done) return;
    var f = form.elements;
    var name = f['name'], phone = f['phone'], email = f['email'], zip = f['zip'];
    [name, phone, email, zip].forEach(function(i){ i.removeAttribute('aria-invalid'); });
    var bad = [];
    if (name.value.trim().length < 2) bad.push(name);
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) bad.push(phone);
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
    if (!/^(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/.test(zip.value.trim())) bad.push(zip);
    if (bad.length){
      bad.forEach(function(i){ i.setAttribute('aria-invalid', 'true'); });
      bad[0].focus();
      say('bad', 'Please check the marked fields: your name, a phone number with area code, and a ZIP or postal code.');
      return;
    }
    if (f['_honey'].value) { say('ok', 'Thank you.'); return; }
    if (Date.now() - loadedAt < 4000) { say('bad', 'That was quick. Please wait a few seconds and press send again.'); return; }

    var data = {
      name: name.value.trim(), phone: phone.value.trim(), email: email.value.trim(), zip: zip.value.trim(),
      household: f['household'].value, install: f['install'].value, notes: f['notes'].value.trim(),
      page: location.pathname,
      _subject: 'Walk-in tub with shower inquiry: walkintubwithshower.com',
      _template: 'table', _captcha: 'false'
    };
    sending = true; btn.disabled = true; btn.textContent = 'Sending...'; say('', '');
    fetch('https://formsubmit.co/ajax/' + dest(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r){
      return r.json().catch(function(){ return {}; });
    }).then(function(j){
      if (j && String(j.success) === 'true') {
        form.reset(); done = true; btn.textContent = 'Sent';
        say('ok', 'Thank you. Your request was sent, and a specialist from Aging Safely Baths will be in touch. In a hurry? Call ' + tel + '.');
      } else {
        say('warn', 'Sorry, we could not confirm that your request arrived. Please call ' + tel + ' so nothing slips through.');
      }
    }).catch(function(){
      say('bad', 'Your request did not go through. Check your connection and try again, or call ' + tel + '.');
    }).then(function(){
      // short cool-down so a double click cannot send the same request twice
      setTimeout(function(){ sending = false; if (!done) { btn.disabled = false; btn.textContent = btnText; } else { btn.textContent = 'Sent'; } }, 3000);
    });
  });
})();
