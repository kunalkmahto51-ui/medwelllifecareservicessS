
// Medwell Lifecare - Website JavaScript

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const backToTop = document.getElementById("backToTop");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Header shadow and back-to-top
  function updateScrollUI() {
    header.classList.toggle("scrolled", window.scrollY > 30);
    backToTop.classList.toggle("visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Scroll reveal animation
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // Active navigation link
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navItems.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    }, { rootMargin: "-30% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Product enquiry buttons
  document.querySelectorAll(".product-link").forEach(button => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product;
      const productSelect = document.getElementById("product");

      productSelect.value = productName;
      document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
      });

      setTimeout(() => {
        document.getElementById("fullName").focus({
          preventScroll: true
        });
      }, 500);
    });
  });

  // Enquiry form: opens visitor's email app
  const enquiryForm = document.getElementById("enquiryForm");

  enquiryForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) return;

    const name = document.getElementById("fullName").value.trim();
    const company = document.getElementById("company").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const product = document.getElementById("product").value;
    const message = document.getElementById("message").value.trim();

    const subject = "Medical Equipment Enquiry - " +
      (product || "General Requirement");

    const body = [
      "Hello Medwell Lifecare,",
      "",
      "I would like to enquire about medical equipment.",
      "",
      "Name: " + name,
      "Company / Hospital: " + (company || "Not specified"),
      "Email: " + email,
      "Phone: " + phone,
      "Product Category: " + (product || "Not specified"),
      "",
      "Requirements:",
      message,
      "",
      "Regards,",
      name
    ].join("\n");

    const mailto = "mailto:medwelllifecareservices@gmail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;
  });
});


/* =========================================
   MEDWELL LIFECARE
   REQUEST CATALOGUE POPUP
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const openBtn = document.getElementById("catalogueOpenBtn");
  const closeBtn = document.getElementById("catalogueCloseBtn");
  const backdrop = document.getElementById("catalogueBackdrop");
  const modal = document.getElementById("catalogueModal");
  const modalBox = modal?.querySelector(".catalogue-modal-box");
  const form = document.getElementById("catalogueRequestForm");

  if (!openBtn || !closeBtn || !backdrop || !modal || !form) {
    return;
  }

  let previousFocus = null;
  let previousOverflow = "";

  // OPEN POPUP
  function openCatalogue() {

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeBtn.focus();
  }

  // CLOSE POPUP
  function closeCatalogue() {

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = previousOverflow;

    if (previousFocus &&
        typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  // OPEN BUTTON CLICK
  openBtn.addEventListener("click", openCatalogue);

  // CLOSE BUTTON CLICK
  closeBtn.addEventListener("click", closeCatalogue);

  // CLICK OUTSIDE POPUP
  backdrop.addEventListener("click", closeCatalogue);

  // KEYBOARD ACCESSIBILITY
  document.addEventListener("keydown", function (event) {

    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeCatalogue();
      return;
    }

    if (event.key === "Tab") {

      const focusable = Array.from(
        modalBox.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
        )
      ).filter(function (element) {
        return element.getClientRects().length > 0;
      });

      if (!focusable.length) {
        event.preventDefault();
        modalBox.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey &&
          document.activeElement === first) {

        event.preventDefault();
        last.focus();

      } else if (!event.shiftKey &&
                 document.activeElement === last) {

        event.preventDefault();
        first.focus();
      }
    }
  });

  // FORM SUBMISSION
  // FormSubmit handles delivery.
  // Do not preventDefault here.

  form.addEventListener("submit", function () {

    const submitBtn = form.querySelector(".catalogue-submit");

    if (submitBtn && form.checkValidity()) {
      submitBtn.textContent = "Submitting Request...";
      submitBtn.style.opacity = "0.8";
    }

  });

});

/* =====================================================
   MEDWELL FEATURED PRODUCTS AUTO SLIDER
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const slider = document.getElementById("showcaseSlider");
  const viewport = document.getElementById("showcaseViewport");
  const track = document.getElementById("showcaseTrack");
  const prevBtn = document.getElementById("showcasePrev");
  const nextBtn = document.getElementById("showcaseNext");
  const dotsContainer = document.getElementById("showcaseDots");

  if (
    !slider ||
    !viewport ||
    !track ||
    !prevBtn ||
    !nextBtn ||
    !dotsContainer
  ) {
    return;
  }

  const cards = Array.from(
    track.querySelectorAll(".showcase-card")
  );

  if (!cards.length) return;

  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let currentIndex = 0;
  let visibleCards = 3;
  let maxIndex = 0;
  let autoTimer = null;

  function getVisibleCards() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  }

  function getStepWidth() {
    if (cards.length < 2) {
      return cards[0].getBoundingClientRect().width;
    }

    return (
      cards[1].getBoundingClientRect().left -
      cards[0].getBoundingClientRect().left
    );
  }

  function updateSlider() {

    visibleCards = getVisibleCards();
    maxIndex = Math.max(0, cards.length - visibleCards);

    currentIndex = Math.min(currentIndex, maxIndex);

    const offset = currentIndex * getStepWidth();

    track.style.transform = `translateX(-${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;

    dotsContainer.querySelectorAll(".showcase-dot")
      .forEach((dot, index) => {

        const isActive = index === currentIndex;

        dot.classList.toggle("active", isActive);
        dot.setAttribute(
          "aria-current",
          isActive ? "true" : "false"
        );

      });

  }

  function createDots() {

    visibleCards = getVisibleCards();
    maxIndex = Math.max(0, cards.length - visibleCards);

    dotsContainer.innerHTML = "";

    for (let i = 0; i <= maxIndex; i++) {

      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "showcase-dot";
      dot.setAttribute(
        "aria-label",
        `Show products starting at ${i + 1}`
      );

      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
        restartAutoSlide();
      });

      dotsContainer.appendChild(dot);

    }

    updateSlider();

  }

  function nextSlide() {
    currentIndex = currentIndex >= maxIndex
      ? 0
      : currentIndex + 1;

    updateSlider();
  }

  function previousSlide() {
    currentIndex = currentIndex <= 0
      ? maxIndex
      : currentIndex - 1;

    updateSlider();
  }

  function stopAutoSlide() {
    if (autoTimer !== null) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAutoSlide() {

    stopAutoSlide();

    if (
      motionPreference.matches ||
      document.hidden ||
      maxIndex === 0
    ) {
      return;
    }

    autoTimer = window.setInterval(() => {
      nextSlide();
    }, 3500);

  }

  function restartAutoSlide() {
    startAutoSlide();
  }

  prevBtn.addEventListener("click", () => {
    previousSlide();
    restartAutoSlide();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
  });

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  slider.addEventListener("focusin", stopAutoSlide);

  slider.addEventListener("focusout", event => {
    if (!slider.contains(event.relatedTarget)) {
      startAutoSlide();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoSlide();
    } else {
      startAutoSlide();
    }
  });

  window.addEventListener("resize", () => {
    createDots();
    startAutoSlide();
  });

  if (motionPreference.addEventListener) {
    motionPreference.addEventListener("change", () => {
      startAutoSlide();
    });
  }

  createDots();
  startAutoSlide();

});
