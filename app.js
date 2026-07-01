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
        // Fail quietly so direct local file opens never surface console noise.
      }
    });
  }

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-navigation");
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll("a")
    : [];
  const faqTriggers = document.querySelectorAll(".faq-item__trigger");
  const revealItems = document.querySelectorAll(".reveal");
  const yearNode = document.querySelector("#current-year");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const raf =
    window.requestAnimationFrame ||
    ((callback) => window.setTimeout(callback, 16));

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const setFaqState = (activeTrigger) => {
    const isExpanded =
      activeTrigger.getAttribute("aria-expanded") === "true";

    faqTriggers.forEach((item) => {
      const controls = item.getAttribute("aria-controls");
      const panel = controls ? document.getElementById(controls) : null;
      item.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.style.maxHeight = "0px";
        panel.setAttribute("hidden", "");
      }
    });

    if (!isExpanded) {
      const controls = activeTrigger.getAttribute("aria-controls");
      const panel = controls ? document.getElementById(controls) : null;
      activeTrigger.setAttribute("aria-expanded", "true");
      if (panel) {
        panel.removeAttribute("hidden");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    }
  };

  const initializeFaq = () => {
    faqTriggers.forEach((trigger) => {
      const controls = trigger.getAttribute("aria-controls");
      const panel = controls ? document.getElementById(controls) : null;

      if (!panel) {
        return;
      }

      if (trigger.getAttribute("aria-expanded") === "true") {
        panel.removeAttribute("hidden");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.style.maxHeight = "0px";
      }
    });
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".faq-item__trigger");

    if (!trigger) {
      return;
    }

    setFaqState(trigger);
  });

  if (header && menuToggle && mobileMenu) {
    const updateScrollState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      mobileMenu.classList.toggle("is-open", isOpen);
      header.classList.toggle("is-menu-open", isOpen);
      body.classList.toggle("menu-open", isOpen);
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
      if (window.innerWidth >= 1025) {
        closeMenu(false);
      }

      raf(() => {
        faqTriggers.forEach((trigger) => {
          if (trigger.getAttribute("aria-expanded") !== "true") {
            return;
          }

          const controls = trigger.getAttribute("aria-controls");
          const panel = controls ? document.getElementById(controls) : null;

          if (panel) {
            panel.style.maxHeight = `${panel.scrollHeight}px`;
          }
        });
      });
    });

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
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

  initializeFaq();
});
