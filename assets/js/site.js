(function () {
  const body = document.body;
  const headerMode = body ? body.getAttribute("data-header") : null;
  const isProjectHeader = headerMode === "project";
  const basePath = (body && body.getAttribute("data-base")) || "";
  const homeHref = basePath + "index.html";

  // Navigation (in header) for project homepages
  const projectNav = `
    <nav id="site-nav" class="site-nav">
    </nav>
  `;

  // Navigation (in header) for homepage
  const fullNav = `
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav">
      <a href="${homeHref}">Home</a>
      <a href="${basePath}album.html">Album</a>
      <a href="${basePath}gallery.html">Art Works</a>
      <a href="${basePath}events.html">Events</a>
      <a href="${basePath}awards.html">Awards</a>
      <a class="lang-toggle" href="${basePath}index_cn.html">中文</a>
    </nav>
  `;

  const headerMarkup = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${homeHref}">
          <img src="${basePath}images/me.jpg" alt="Peizhi Yan" />
          <div>
            <span class="brand-name">Peizhi Yan</span>
            <span class="brand-sub">Ph.D. Computer Engineering</span>
          </div>
        </a>
        ${isProjectHeader ? projectNav : fullNav}
      </div>
    </header>
  `;

  const footerMarkup = `
    <footer class="site-footer">
      <div class="footer-links">
        <a href="https://www.linkedin.com/in/peizhi-yan/"><i class="fa fa-linkedin"></i> LinkedIn</a>
        <a href="https://github.com/PeizhiYan"><i class="fa fa-github"></i> GitHub</a>
        <a href="mailto:yan@auroratns.com"><i class="fa fa-envelope"></i> Email</a>
      </div>
      <div>© Matthew (Peizhi) Yan 2017–<span id="currentYear"></span></div>
    </footer>
  `;

  const headerEl = document.getElementById("site-header");
  if (headerEl) {
    headerEl.innerHTML = headerMarkup;
  }

  const footerEl = document.getElementById("site-footer");
  if (footerEl) {
    footerEl.innerHTML = footerMarkup;
  }

  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const current = window.location.pathname.split("/").pop() || "index.html";
  const langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    if (current === "index_cn.html") {
      langToggle.setAttribute("href", homeHref);
      langToggle.textContent = "English";
    } else {
      langToggle.setAttribute("href", basePath + "index_cn.html");
      langToggle.textContent = "中文";
    }
  }
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("#")[0];
    const linkName = linkPath.startsWith("/") ? linkPath.split("/").pop() : linkPath;
    if (linkName === current) {
      link.classList.add("active");
    }
  });

  const header = document.querySelector(".site-header");
  if (header) {
    const navToggle = header.querySelector(".nav-toggle");
    const nav = header.querySelector("#site-nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        const isOpen = header.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });

      // Close the menu when clicking outside on small screens
      document.addEventListener("click", function (event) {
        if (!header.classList.contains("nav-open")) return;
        if (!window.matchMedia("(max-width: 768px)").matches) return;
        if (!header.contains(event.target)) {
          header.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    const onScroll = function () {
      const shouldShrink = window.scrollY > 30;
      header.classList.toggle("shrink", shouldShrink);
      document.body.classList.toggle("header-shrink", shouldShrink);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
