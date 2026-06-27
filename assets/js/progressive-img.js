/**
 * Progressive Image Loading (blur-up)
 *
 * Each .progressive-img wrapper contains:
 *   <img class="thumb" src="thumbs/...">        ← low-res, loads immediately
 *   <img class="full"  data-src="full/...">      ← high-res, loaded on demand
 *
 * When the wrapper scrolls into view the full-res src is set.
 * Once loaded, the .loaded class fades it in over the blurry thumb.
 */
(function () {
  var wrappers = document.querySelectorAll('.progressive-img');
  if (!wrappers.length) return;

  function load(wrapper) {
    var full = wrapper.querySelector('.full');
    if (!full || full.src) return;           // already triggered
    full.onload = function () {
      full.classList.add('loaded');
    };
    full.src = full.getAttribute('data-src');
  }

  // Use IntersectionObserver when available (all modern browsers)
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          load(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });            // start loading 200px before visible

    wrappers.forEach(function (w) { observer.observe(w); });
  } else {
    // Fallback: load everything right away
    wrappers.forEach(load);
  }

  // Block right-click "Save image as…" on photo wrappers
  wrappers.forEach(function (w) {
    w.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  });
})();
