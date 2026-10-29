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

  const updateActive = function () {
    const marker = window.innerHeight * 0.35;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let active = 0;
    sections.forEach(function (section, i) {
      if (section.getBoundingClientRect().top <= marker) active = i;
    });
    if (atBottom) active = sections.length - 1;
    links.forEach(function (link, i) {
      link.classList.toggle("active", i === active);
    });
    current.textContent = links[active].textContent;
  };

  updateActive();
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
})();
