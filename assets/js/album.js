// Photo album: on wide screens the pages in #albumPages are bound into a book
// (pairs of pages become leaves that turn); otherwise they stay a swipeable row.
(function () {
  const holder = document.getElementById("albumPages");
  if (!holder) return;

  const stage = holder.parentElement;
  const pages = Array.from(holder.children);
  const prevBtn = document.getElementById("albumPrev");
  const nextBtn = document.getElementById("albumNext");
  const status = document.getElementById("albumStatus");
  const wide = window.matchMedia("(min-width: 820px)");
  const TURN_MS = 900;

  let book = null;
  let leaves = [];
  let current = 0; // number of turned leaves

  // ---------- Book (wide screens) ----------

  const renderBook = function (movingIndex) {
    leaves.forEach(function (leaf, i) {
      const turned = i < current;
      leaf.classList.toggle("flipped", turned);
      leaf.style.zIndex = i === movingIndex ? leaves.length + 1 : turned ? i + 1 : leaves.length - i;
    });
    if (movingIndex !== undefined) {
      setTimeout(function () {
        renderBook();
      }, TURN_MS);
    }
    book.classList.toggle("at-start", current === 0);
    book.classList.toggle("at-end", current === leaves.length);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === leaves.length;
    if (current === 0) status.textContent = "Open the album";
    else if (current === leaves.length) status.textContent = "The end";
    else status.textContent = "Pages " + (current * 2 - 1) + "–" + current * 2;
  };

  const turn = function (step) {
    const target = Math.min(Math.max(current + step, 0), leaves.length);
    if (target === current) return;
    const moving = step > 0 ? current : current - 1;
    current = target;
    renderBook(moving);
  };

  const buildBook = function () {
    book = document.createElement("div");
    book.className = "book";
    leaves = [];
    for (let i = 0; i < pages.length; i += 2) {
      const leaf = document.createElement("div");
      leaf.className = "leaf";
      const front = document.createElement("div");
      front.className = "face front";
      const back = document.createElement("div");
      back.className = "face back";
      pages[i].classList.add("side-right");
      front.appendChild(pages[i]);
      if (pages[i + 1]) {
        pages[i + 1].classList.add("side-left");
        back.appendChild(pages[i + 1]);
      }
      leaf.appendChild(front);
      leaf.appendChild(back);
      const index = leaves.length;
      leaf.addEventListener("click", function () {
        turn(index < current ? -1 : 1);
      });
      book.appendChild(leaf);
      leaves.push(leaf);
    }
    stage.insertBefore(book, holder);
    stage.classList.add("is-book");
    renderBook();
  };

  const unbindBook = function () {
    pages.forEach(function (page) {
      page.classList.remove("side-left", "side-right");
      holder.appendChild(page);
    });
    book.remove();
    book = null;
    leaves = [];
    stage.classList.remove("is-book");
  };

  // ---------- Swipeable row (narrow screens) ----------

  const rowIndex = function () {
    const step = pages[1].offsetLeft - pages[0].offsetLeft;
    return Math.round(holder.scrollLeft / step);
  };

  const renderRow = function () {
    const i = rowIndex();
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === pages.length - 1;
    status.textContent = i === 0 ? "Swipe to open" : i + " / " + (pages.length - 2);
    if (i === pages.length - 1) status.textContent = "The end";
  };

  const slide = function (step) {
    const i = Math.min(Math.max(rowIndex() + step, 0), pages.length - 1);
    holder.scrollTo({ left: pages[i].offsetLeft - pages[0].offsetLeft, behavior: "smooth" });
  };

  holder.addEventListener("scroll", function () {
    if (!book) renderRow();
  }, { passive: true });

  // ---------- Shared controls ----------

  prevBtn.addEventListener("click", function () {
    book ? turn(-1) : slide(-1);
  });
  nextBtn.addEventListener("click", function () {
    book ? turn(1) : slide(1);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") book ? turn(1) : slide(1);
    if (event.key === "ArrowLeft") book ? turn(-1) : slide(-1);
  });

  const applyMode = function () {
    if (wide.matches && !book) buildBook();
    else if (!wide.matches && book) unbindBook();
    if (!book) renderRow();
  };

  wide.addEventListener("change", applyMode);
  applyMode();
})();
