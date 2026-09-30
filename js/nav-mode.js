/* Two entry points share one set of pages.
   index.html  = current public menu (Members, Private Office).
   index2.html = full menu (adds About and Insights); the choice is kept for the visit. */
(function () {
  var KEY = 'emir-full-nav', page = location.pathname.split('/').pop() || 'index.html';
  try {
    if (page === 'index2.html' || page === 'about.html' || page === 'insights.html' || page === 'publications.html') sessionStorage.setItem(KEY, '1');
    else if (page === 'index.html') sessionStorage.removeItem(KEY);
    if (sessionStorage.getItem(KEY) !== '1') return;
  } catch (e) { if (page !== 'index2.html') return; }
  document.documentElement.classList.add('full-nav');
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href="index.html"]').forEach(function (a) { a.setAttribute('href', 'index2.html'); });
  });
})();
