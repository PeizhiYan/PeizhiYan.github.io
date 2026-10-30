// Art Works: click a framed painting to see it large, still framed, on the wall.
// Shows the wall-size image at once, then swaps in the sharper copy from gallery/view/.
(function () {
  const artworks = Array.from(document.querySelectorAll(".artwork"));
  if (!artworks.length) return;

  const viewer = document.createElement("div");
  viewer.className = "viewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.innerHTML =
    '<button type="button" class="viewer-btn viewer-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="viewer-btn viewer-prev" aria-label="Previous painting">&#8592;</button>' +
    '<button type="button" class="viewer-btn viewer-next" aria-label="Next painting">&#8594;</button>' +
    '<figure class="viewer-art">' +
    '  <div class="frame"><div class="liner"><div class="viewer-img"><img alt="" /></div></div></div>' +
    '  <figcaption class="placard"><span class="placard-title"></span><span class="placard-year"></span></figcaption>' +
    "</figure>";
  document.body.appendChild(viewer);

  const art = viewer.querySelector(".viewer-art");
  const img = viewer.querySelector(".viewer-img img");
  const title = viewer.querySelector(".placard-title");
  const year = viewer.querySelector(".placard-year");
  let index = -1;
  let lastFocus = null;

  const show = function (i) {
    index = (i + artworks.length) % artworks.length;
    const work = artworks[index];
    const wallSrc = work.querySelector(".full").getAttribute("data-src");
    const viewSrc = wallSrc.replace("gallery/wall/", "gallery/view/");

    art.style.setProperty("--ar", work.style.getPropertyValue("--ar"));
    img.src = wallSrc;
    img.alt = work.querySelector(".placard-title").textContent;
    const sharp = new Image();
    sharp.onload = function () {
      if (artworks[index] === work) img.src = viewSrc;
    };
    sharp.src = viewSrc;

    title.textContent = work.querySelector(".placard-title").textContent;
    const y = work.querySelector(".placard-year");
    year.textContent = y ? y.textContent : "";
    year.hidden = !y;
  };

  const frame = viewer.querySelector(".viewer-art .frame");

  // Transform that puts the viewer's frame exactly over a painting's frame on the wall
  const wallTransform = function (work) {
    const from = work.querySelector(".frame").getBoundingClientRect();
    const to = frame.getBoundingClientRect();
    const onScreen = from.bottom > 0 && from.top < window.innerHeight;
    if (!onScreen || !to.width) return null;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return "translate(" + dx + "px, " + dy + "px) scale(" + from.width / to.width + ")";
  };

  const lift = function (i) {
    artworks.forEach(function (work, k) {
      work.classList.toggle("lifted", k === i);
    });
  };

  const open = function (i) {
    lastFocus = document.activeElement;
    show(i);
    viewer.hidden = false;
    document.documentElement.classList.add("viewer-open");

    // Start the frame where the painting hangs, then let it grow to the center
    const start = wallTransform(artworks[index]);
    frame.style.transition = "none";
    frame.style.transform = start || "scale(0.96)";
    lift(index);
    void frame.offsetWidth;
    frame.style.transition = "";
    frame.style.transform = "";
    viewer.classList.add("is-open");
    viewer.querySelector(".viewer-close").focus({ preventScroll: true });
  };

  const close = function () {
    const back = wallTransform(artworks[index]);
    frame.style.transform = back || "scale(0.96)";
    viewer.classList.remove("is-open");
    document.documentElement.classList.remove("viewer-open");
    setTimeout(function () {
      viewer.hidden = true;
      frame.style.transition = "none";
      frame.style.transform = "";
      lift(-1);
      void frame.offsetWidth;
      frame.style.transition = "";
    }, 350);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  artworks.forEach(function (work, i) {
    work.tabIndex = 0;
    work.setAttribute("role", "button");
    work.setAttribute("aria-label", "View " + work.querySelector(".placard-title").textContent);
    work.addEventListener("click", function () {
      open(i);
    });
    work.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(i);
      }
    });
  });

  viewer.querySelector(".viewer-close").addEventListener("click", close);
  const step = function (delta) {
    show(index + delta);
    lift(index);
  };

  viewer.querySelector(".viewer-prev").addEventListener("click", function () {
    step(-1);
  });
  viewer.querySelector(".viewer-next").addEventListener("click", function () {
    step(1);
  });

  // Click on the bare wall (not the painting or a button) closes the viewer,
  // unless that "click" was the end of a swipe
  let swiped = false;
  viewer.addEventListener("click", function (event) {
    if (swiped) {
      swiped = false;
      return;
    }
    if (event.target === viewer) close();
  });

  document.addEventListener("keydown", function (event) {
    if (viewer.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  });

  // Swipe left/right on touch screens
  let startX = null;
  viewer.addEventListener("pointerdown", function (event) {
    startX = event.clientX;
  });
  viewer.addEventListener("pointerup", function (event) {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    swiped = Math.abs(dx) > 50;
    if (swiped) step(dx < 0 ? 1 : -1);
  });

  // Same protection as the wall: no "Save image" menu
  viewer.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
})();
