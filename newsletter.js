/* beautifulista - Newsletter-Anmeldung (Footer, alle Seiten)
   Postet an das Brevo-DOI-Formular -> Brevo schickt die Bestaetigungsmail (Double-Opt-in).
   Honeypot + Client-Validierung gegen Spam/Fehleingaben. */
(function () {
  var ACTION = 'https://fe701642.sibforms.com/serve/MUIFAEkE3FT87GzP22jSMZvgLU02cSJu621UxTqtzUcA4T-_hXCQvRaiX-iYrhD6YN15zBAvJuOteAViCLrlrq_oVgq4crB5Nv64_Y7mMSVA8Pp9IWRYQGbhWOM07qbuMCtfh0uUZBx8uIroijI9sMTylBpAIdsmv9GCH3MPqgmlnL948DqbRJ4PzsTqtauPJJ9yvkGaEYN1Qsrk1g==';

  function build() {
    var footer = document.querySelector('footer.footer');
    if (!footer || document.getElementById('bf-news')) return;

    var sec = document.createElement('div');
    sec.id = 'bf-news';
    sec.className = 'bf-news';
    sec.innerHTML =
      '<div class="bf-news__inner">' +
        '<h2 class="bf-news__title">Bleib in Verbindung</h2>' +
        '<p class="bf-news__text">Hautwissen, Neues aus dem Institut und Angebote, die wirklich zu deiner Haut passen. Kein Spam, jederzeit abbestellbar.</p>' +
        '<form class="bf-news__form" id="bf-news-form" novalidate>' +
          '<div class="bf-news__row">' +
            '<input type="email" id="bf-news-email" name="EMAIL" required autocomplete="email" placeholder="Deine E-Mail-Adresse" aria-label="Deine E-Mail-Adresse">' +
            '<button type="submit" class="bf-news__btn" id="bf-news-btn">Anmelden</button>' +
          '</div>' +
          '<label class="bf-news__consent"><input type="checkbox" id="bf-news-consent" required> ' +
            '<span>Ich möchte den beautifulista-Newsletter erhalten und stimme der Verarbeitung meiner E-Mail-Adresse gemäß der <a href="datenschutz.html">Datenschutzerklärung</a> zu. Abmeldung jederzeit möglich.</span></label>' +
          '<input type="text" name="email_address_check" value="" tabindex="-1" autocomplete="off" class="bf-news__hp" aria-hidden="true">' +
        '</form>' +
        '<p class="bf-news__msg bf-news__msg--ok" id="bf-news-ok" role="status">Fast geschafft! Wir haben dir eine E-Mail geschickt. Bitte klick auf den Bestätigungslink darin, dann bist du dabei.</p>' +
        '<p class="bf-news__msg bf-news__msg--err" id="bf-news-err" role="alert"></p>' +
      '</div>';

    footer.insertBefore(sec, footer.firstChild);
    document.getElementById('bf-news-form').addEventListener('submit', onSubmit);
  }

  function onSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var email = document.getElementById('bf-news-email');
    var consent = document.getElementById('bf-news-consent');
    var hp = form.querySelector('[name="email_address_check"]');
    var ok = document.getElementById('bf-news-ok');
    var err = document.getElementById('bf-news-err');
    var btn = document.getElementById('bf-news-btn');

    ok.style.display = 'none';
    err.style.display = 'none';

    // Honeypot: ausgefuellt = Bot -> still abbrechen
    if (hp && hp.value) return;

    if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
      err.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
      err.style.display = 'block';
      email.focus();
      return;
    }
    if (!consent.checked) {
      err.textContent = 'Bitte bestätige die Einwilligung, um dich anzumelden.';
      err.style.display = 'block';
      return;
    }

    var body = 'EMAIL=' + encodeURIComponent(email.value) +
               '&email_address_check=' +
               '&locale=de';

    btn.disabled = true;
    btn.textContent = 'Wird gesendet...';

    fetch(ACTION, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body
    }).then(function () {
      form.style.display = 'none';
      ok.style.display = 'block';
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = 'Anmelden';
      err.textContent = 'Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.';
      err.style.display = 'block';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
