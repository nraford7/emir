/* Preview password gate. Client-side only: it keeps casual visitors out, not a determined one. */
(function () {
  var KEY = 'emir-preview-ok';
  var HASH = '5431dda9a812a1ab2a7a8dd6aacd45ca23008377f3d49815acd85efcfd07dc4f'; // sha-256 of the password
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}
  if (location.protocol === 'file:') return; // local preview and render tools skip the gate

  var hide = document.createElement('style');
  hide.id = 'gate-hide';
  hide.textContent = 'body > *:not(#gate) { visibility: hidden !important; } body { overflow: hidden !important; }';
  document.head.appendChild(hide);

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  function build() {
    var gate = document.createElement('div');
    gate.id = 'gate';
    gate.innerHTML =
      '<style>' +
      '#gate { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 22px; background: #0E0C09; font-family: "Libre Franklin", "Helvetica Neue", Arial, sans-serif; }' +
      '#gate form { width: 100%; max-width: 340px; text-align: center; }' +
      '#gate .gate-mark { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 500; font-size: 64px; letter-spacing: 0; line-height: 1; color: #F5F3EF; margin-bottom: 14px; }' +
      '#gate .gate-note { font-size: 13px; color: #9A9188; margin-bottom: 28px; }' +
      '#gate input { width: 100%; min-height: 48px; padding: 0 16px; background: transparent; border: 1px solid rgba(201,169,110,0.4); color: #F5F3EF; font: inherit; font-size: 15px; text-align: center; letter-spacing: 0.08em; outline: none; }' +
      '#gate input:focus { border-color: #C9A96E; }' +
      '#gate button { margin-top: 14px; width: 100%; min-height: 48px; background: rgba(201,169,110,0.08); border: 1px solid #C9A96E; color: #C9A96E; font: inherit; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }' +
      '#gate button:hover { background: rgba(201,169,110,0.16); }' +
      '#gate .gate-err { min-height: 20px; margin-top: 14px; font-size: 13px; color: #C9A96E; }' +
      '</style>' +
      '<form autocomplete="off">' +
      '<div class="gate-mark">EMIR</div>' +
      '<p class="gate-note">Private preview. Enter the password to continue.</p>' +
      '<input type="password" aria-label="Password" autofocus>' +
      '<button type="submit">Enter</button>' +
      '<p class="gate-err" role="alert"></p>' +
      '</form>';
    document.body.appendChild(gate);
    var form = gate.querySelector('form'), input = gate.querySelector('input'), err = gate.querySelector('.gate-err');
    input.focus();
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      sha256(input.value.trim()).then(function (h) {
        if (h === HASH) {
          try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
          gate.remove();
          var s = document.getElementById('gate-hide'); if (s) s.remove();
        } else {
          err.textContent = 'That password is not right.';
          input.value = '';
          input.focus();
        }
      });
    });
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
