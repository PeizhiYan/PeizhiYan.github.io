(function () {
  const headerMarkup = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <img src="images/me.jpg" alt="Peizhi Yan" />
          <div>
            <span class="brand-name">Peizhi Yan</span>
            <span class="brand-sub">Ph.D. Computer Engineering</span>
          </div>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="site-nav">
          <a href="index.html">Home</a>
          <a href="album.html">Album</a>
          <a href="gallery.html">Art Works</a>
          <a href="events.html">Events</a>
          <a href="awards.html">Awards</a>
          <a class="lang-toggle" href="index_cn.html">中文</a>
        </nav>
      </div>
    </header>
  `;

  const footerMarkup = `
    <footer class="site-footer">
      <div class="footer-links">
        <a href="https://www.linkedin.com/in/peizhi-yan/">LinkedIn</a>
        <a href="https://github.com/PeizhiYan">GitHub</a>
        <a href="mailto:yan@auroratns.com">Email</a>
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
      langToggle.setAttribute("href", "index.html");
      langToggle.textContent = "English";
    } else {
      langToggle.setAttribute("href", "index_cn.html");
      langToggle.textContent = "中文";
    }
  }
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("#")[0];
    if (linkPath === current) {
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
