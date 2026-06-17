/* beautifulista - Cookie-Consent + Google Analytics (GA4)
   Strenge Opt-in-Variante: GA4 wird erst NACH Einwilligung geladen.
   Vorher wird nichts an Google gesendet. */
(function () {
  var GA_ID = 'G-953X1N816M';
  var KEY = 'bf_consent'; // gespeicherter Wert: 'granted' | 'denied'

  function loadGA() {
    if (window.__bfGaLoaded) return;
    window.__bfGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function hideBanner() {
    var b = document.getElementById('bf-consent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function store(val) {
    try { localStorage.setItem(KEY, val); } catch (e) {}
  }

  function setConsent(val) {
    store(val);
    if (val === 'granted') loadGA();
    hideBanner();
  }

  function showBanner() {
    if (document.getElementById('bf-consent')) return;
    var div = document.createElement('div');
    div.id = 'bf-consent';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Cookie-Einwilligung');
    div.innerHTML =
      '<div class="bf-inner">' +
        '<p>Wir nutzen Cookies, um anonymisiert auszuwerten, wie unsere Website genutzt wird ' +
        '(Google Analytics) und sie laufend zu verbessern. Du entscheidest selbst. ' +
        'Mehr dazu in der <a href="datenschutz.html">Datenschutzerkl&auml;rung</a>.</p>' +
        '<div class="bf-btns">' +
          '<button type="button" class="bf-decline" id="bf-decline">Nur notwendige</button>' +
          '<button type="button" class="bf-accept" id="bf-accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(div);
    document.getElementById('bf-accept').addEventListener('click', function () { setConsent('granted'); });
    document.getElementById('bf-decline').addEventListener('click', function () { setConsent('denied'); });
  }

  // Erlaubt das erneute Oeffnen (Widerruf/Aenderung) per Link: onclick="bfOpenConsent()"
  window.bfOpenConsent = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    showBanner();
  };

  // Conversion-Klicks als GA4-Ereignisse zaehlbar machen: WhatsApp-Links (wa.me)
  // und Termin-Buchen-Links (termin.html), seitenweit. Feuert nur, wenn gtag
  // existiert -> also erst nach Cookie-Einwilligung (DSGVO-konform). Laeuft parallel
  // zum bestehenden Meta-Pixel-Tracking, ohne es anzufassen.
  function trackCtaClicks() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (typeof window.gtag !== 'function') return;
      if (t.closest('a[href*="wa.me"]')) {
        window.gtag('event', 'whatsapp_klick', {
          event_category: 'Conversion',
          event_label: location.pathname
        });
      } else if (t.closest('a[href*="termin.html"]')) {
        window.gtag('event', 'termin_klick', {
          event_category: 'Conversion',
          event_label: location.pathname
        });
      }
    }, true);
  }

  function init() {
    var c = null;
    try { c = localStorage.getItem(KEY); } catch (e) {}
    if (c === 'granted') { loadGA(); }
    else if (c === 'denied') { /* nichts laden */ }
    else { showBanner(); }
    trackCtaClicks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
