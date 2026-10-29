// Left-side section rail: one tick per <section id> in <main>; hover to reveal labels.
(function () {
  const sections = Array.from(document.querySelectorAll("main > section[id]"));
  if (sections.length < 2) return;

  const rail = document.createElement("nav");
  rail.className = "section-rail";
  rail.setAttribute("aria-label", "Page sections");

  const links = sections.map(function (section) {
    const heading = section.querySelector("h2");
    const label = section.getAttribute("data-nav-label") || (heading ? heading.textContent.trim() : section.id);
    const link = document.createElement("a");
    link.href = "#" + section.id;
    link.innerHTML = '<span class="rail-tick"></span><span class="rail-label"></span>';
    link.querySelector(".rail-label").textContent = label;
    rail.appendChild(link);
    return link;
  });

  // Name of the current section, shown only in the compact bottom bar
  const current = document.createElement("span");
  current.className = "rail-current";
  current.setAttribute("aria-hidden", "true");
  rail.insertBefore(current, rail.firstChild);

  document.body.appendChild(rail);
  document.body.classList.add("has-section-rail");

  let scrubIndex = null; // section picked by dragging along the bottom bar

  const setActive = function (active) {
    links.forEach(function (link, i) {
      link.classList.toggle("active", i === active);
    });
    current.textContent = links[active].textContent;
  };

  const updateActive = function () {
    if (scrubIndex !== null) return setActive(scrubIndex);
    const marker = window.innerHeight * 0.35;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let active = 0;
    sections.forEach(function (section, i) {
      if (section.getBoundingClientRect().top <= marker) active = i;
    });
    if (atBottom) active = sections.length - 1;
    setActive(active);
  };

  // Compact bottom bar: press and slide along the dots to scrub through sections
  const compact = window.matchMedia("(max-width: 1179px)");

  const nearestLink = function (x) {
    let best = 0;
    let bestDist = Infinity;
    links.forEach(function (link, i) {
      const r = link.getBoundingClientRect();
      const d = Math.abs(x - (r.left + r.width / 2));
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const scrubTo = function (x) {
    const i = nearestLink(x);
    if (i === scrubIndex) return;
    scrubIndex = i;
    sections[i].scrollIntoView({ block: "start", behavior: "instant" });
    setActive(i);
  };

  const endScrub = function () {
    if (scrubIndex === null) return;
    rail.classList.remove("scrubbing");
    scrubIndex = null;
  };

  rail.addEventListener("pointerdown", function (event) {
    if (!compact.matches) return;
    event.preventDefault();
    rail.setPointerCapture(event.pointerId);
    rail.classList.add("scrubbing");
    scrubIndex = -1;
    scrubTo(event.clientX);
  });
  rail.addEventListener("pointermove", function (event) {
    if (scrubIndex !== null) scrubTo(event.clientX);
  });
  rail.addEventListener("pointerup", endScrub);
  rail.addEventListener("pointercancel", endScrub);
  rail.addEventListener("click", function (event) {
    if (compact.matches) event.preventDefault(); // already handled on pointerdown
  });

  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
})();
