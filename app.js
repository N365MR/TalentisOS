document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.jsReady = "true";

  const canRegisterServiceWorker =
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  if (canRegisterServiceWorker) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("./service-worker.js");
      } catch (_error) {
        // Fail quietly so local file opens stay clean.
      }
    });
  }

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-navigation");
  const desktopNav = document.querySelector(".site-nav--desktop");
  const quickActions = document.querySelector(".site-header__quick-actions");
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll(".mobile-menu__link")
    : [];
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sections = document.querySelectorAll("[data-view-section]");
  const revealItems = document.querySelectorAll(".reveal");
  const yearNode = document.querySelector("#current-year");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const setActiveLink = (sectionId) => {
    sectionLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateViewportMode = () => {
    const isDesktop = window.innerWidth >= 1024;

    if (desktopNav) {
      desktopNav.style.display = isDesktop ? "flex" : "none";
    }

    if (quickActions) {
      quickActions.style.display = isDesktop ? "flex" : "none";
    }

    if (menuToggle) {
      menuToggle.style.display = isDesktop ? "none" : "inline-flex";
    }
  };

  updateViewportMode();
  window.addEventListener("resize", updateViewportMode);

  if (header) {
    const updateScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
  }

  if (menuToggle && mobileMenu) {
    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      mobileMenu.classList.toggle("is-open", isOpen);
      body.classList.toggle("menu-open", isOpen);
      if (header) {
        header.classList.toggle("is-menu-open", isOpen);
      }
    };

    const closeMenu = (restoreFocus = false) => {
      setMenuState(false);
      if (restoreFocus) {
        menuToggle.focus();
      }
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu(false);
      });
    });

    document.addEventListener("click", (event) => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (!isOpen) {
        return;
      }

      const clickedInsideMenu = event.target.closest("#mobile-navigation");
      const clickedToggle = event.target.closest(".menu-toggle");

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closeMenu(true);
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) {
        closeMenu(false);
      }
    });
  }

  if (sections.length > 0) {
    setActiveLink(sections[0].id);

    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visibleEntries[0]) {
            setActiveLink(visibleEntries[0].target.id);
          }
        },
        {
          threshold: [0.2, 0.45, 0.7],
          rootMargin: "-20% 0px -50% 0px",
        }
      );

      sections.forEach((section) => {
        sectionObserver.observe(section);
      });
    }
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }
});
