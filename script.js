"use strict";
//# region start
// Destination
const cardDestination = document.querySelectorAll("[data-destination-card]");
const captionDestination = document.querySelectorAll(
  "[data-destination-caption]"
);
const controlDestination = document.querySelectorAll(
  "[data-destination-control]"
);
// Crew
const cardCrew = document.querySelectorAll("[data-crew-card]");
const captionCrew = document.querySelectorAll("[data-crew-caption]");
const controlCrew = document.querySelectorAll("[data-crew-control]");
// Tech
const cardTech = document.querySelectorAll("[data-tech-card]");
const captionTech = document.querySelectorAll("[data-tech-caption]");
const controlTech = document.querySelectorAll("[data-tech-control]");
// ============================={Navigation}
const menuOpen = document.querySelector("[data-menu-is-open]");
const menuOverlay = document.querySelector("[data-menu-overlay]");
const menuContet = document.querySelector("[data-menu-content]");
const menuLink = document.querySelector("[data-menu-link-mobile]");
const navPopUp = document.querySelector("[data-popup]");
// ==============================={Header}
const headers = document.querySelectorAll("[data-header]");
// ==========================================={Pictures}
const pictures = document.querySelectorAll("[data-picture]");
// ============================================================{Body}
const body = document.querySelectorAll("[data-body]");
// # region end

// #region start =============================================={Slider}
let current = 0;

const handleUpdateSlide = function (slider) {
  slider.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - current) * 100}%)`;
  });
};

const handleUpdateSlideY = function (slider) {
  slider.forEach((slide, index) => {
    slide.style.transform = `translateY(${(index - current) * 100}%)`;
  });
};

const handleUpdateDot = function (dots) {
  dots.forEach((dot, index) => {
    dot.classList.toggle("control--active", index === current);
  });
};

const changeSlide = function (slider, direction) {
  if (direction === "prev") {
    current = current > 0 ? current - 1 : slider.length - 1;
  } else if (direction === "next") {
    current = current < slider.length - 1 ? current + 1 : 0;
  }
  handleUpdateSlide(slider);
};

const initDot = function (dots, slider, control, isVertical) {
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute(control), 10);
      current = index;

      isVertical ? handleUpdateSlideY(slider) : handleUpdateSlide(slider);
      handleUpdateDot(dots);
    });
  });
};

const handleDotInit = () => {
  // Destination
  initDot(
    controlDestination,
    cardDestination,
    "data-destination-control",
    true
  );
  initDot(controlDestination, captionDestination, "data-destination-control");
  //   Crew
  initDot(controlCrew, cardCrew, "data-crew-control");
  initDot(controlCrew, captionCrew, "data-crew-control");
  //   Tech
  initDot(controlTech, cardTech, "data-tech-control", true);
  initDot(controlTech, captionTech, "data-tech-control");
};

const handleSliderInit = () => {
  // Destination
  handleUpdateSlideY(cardDestination);
  handleUpdateSlide(captionDestination);
  //   Crew
  handleUpdateSlide(cardCrew);
  handleUpdateSlide(captionCrew);
  //   Tech
  handleUpdateSlideY(cardTech);
  handleUpdateSlide(captionTech);
};

//#region end

// ============================================================================{Helpers}
const cList = {
  add: (el, cl) => el.classList.add(cl),
  rem: (el, cl) => el.classList.remove(cl),
  tog: (el, cl) => el.classList.toggle(cl),
};

const setTime = (func, time) => setTimeout(() => func(), time * 1000);

// # region start===================================================={Navigation}
let time = 0.7;
let linkTime = 0.92;
const isOpen = () => {
  cList.rem(menuOpen, "hide");
  setTime(() => {
    cList.add(menuOverlay, "show");
    cList.add(menuContet, "active--content");
  }, time);
  setTime(() => cList.add(menuLink, "show"), linkTime);
};

const isClosed = () => {
  cList.rem(menuOverlay, "show");
  cList.rem(menuLink, "show");
  cList.rem(menuContet, "active--content");
  setTime(() => cList.add(menuOpen, "hide"), time);
};
// ----------------------------------------------{Nav Links}

const handleLinks = (el, e, isMobile) => {
  const element = document.querySelectorAll(el);
  element.forEach((el) => cList.rem(el, "active--link"));
  cList.add(e, "active--link");

  isMobile
    ? localStorage.setItem("activeMobileLink", e.getAttribute("href"))
    : localStorage.setItem("activeDesktopLink", e.getAttribute("href"));
};

// ---------------------------------------------------------------{Nav active to local storage}
const handleLocalStorage = () => {
  // Restore the active link state for desktop
  const savedDesktopLink = localStorage.getItem("activeDesktopLink");
  if (savedDesktopLink) {
    const desktopLink = document.querySelector(
      `[data-links-tab][href="${savedDesktopLink}"]`
    );
    if (desktopLink) {
      handleLinks("[data-links-tab]", desktopLink);
    }
  }

  // Restore the active link state for mobile
  const savedMobileLink = localStorage.getItem("activeMobileLink");
  if (savedMobileLink) {
    const mobileLink = document.querySelector(
      `[data-links-mobile][href="${savedMobileLink}"]`
    );
    if (mobileLink) {
      handleLinks("[data-links-mobile]", mobileLink, true);
    }
  }
};

// ----------------------------------------------------------{Body init}

const handleMenuMobile = (e) => {
  const openMenu = e.target.closest("[data-open-menu]");
  const closeMenu = e.target.closest("[data-close-menu]");
  const overlay = e.target.closest("[data-menu-overlay]");
  if (openMenu) isOpen();
  if (closeMenu || overlay) isClosed();
};

const handleNavLinks = (e) => {
  const navLinksTab = e.target.closest("[data-links-tab]");
  const navLinksMobile = e.target.closest("[data-links-mobile]");

  if (navLinksTab) handleLinks("[data-links-tab]", navLinksTab);
  if (navLinksMobile) handleLinks("[data-links-mobile]", navLinksMobile, true);
};

const bodInit = (e) => {
  handleMenuMobile(e);
  handleNavLinks(e);
};

// #region end

// #region start ==========================================================={Intersection}
const handleMoveUp = function (entries) {
  entries.forEach((entry) => {
    entry.isIntersecting
      ? cList.rem(navPopUp, "show")
      : cList.add(navPopUp, "show");
  });
};

const optionsMoveup = {
  root: null,
  threshold: 0.7,
};

const observeMoveUp = new IntersectionObserver(handleMoveUp, optionsMoveup);

// -----------------------------------------------------------------------{LazyLoading}
const lazyLoadPicture = function (entries, observe) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const picture = entry.target;
    // Source
    const source = picture.querySelectorAll("source");
    source.forEach((source) => {
      const srcSet = source.dataset.srcset;
      if (source) source.srcset = srcSet;
    });

    const img = picture.querySelector("img");
    const imgSrc = img.dataset.src;

    if (img) {
      img.src = imgSrc;
      img.addEventListener("load", () => {
        const imgContainer = picture.parentNode;
        cList.rem(img, "lazy--img");
        cList.rem(imgContainer, "lazy__img--container");
      });
    }

    observe.unobserve(picture);
  });
};

const optionsLazy = {
  root: null,
  threshold: 0,
};

const lazyImageObserver = new IntersectionObserver(
  lazyLoadPicture,
  optionsLazy
);

// -----------------------------------------------------------------{Lazy Load Body}
const handleLazyBackground = function (entries, observe) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const body = entry.target;
    const mobileBg = body.getAttribute("data-bg-mobile");
    const tabletBg = body.getAttribute("data-bg-tablet");
    const desktopBg = body.getAttribute("data-bg-desktop");

    const isDesktop = window.innerWidth >= 1024;
    const isTablet = window.innerWidth >= 768;

    if (isDesktop) {
      body.style.backgroundImage = `linear-gradient(38deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${desktopBg})`;
    } else if (isTablet) {
      body.style.backgroundImage = `linear-gradient(38deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${tabletBg})`;
    } else {
      body.style.backgroundImage = `linear-gradient(38deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${mobileBg})`;
    }

    cList.rem(body, "body--lazy");

    observe.unobserve(body);
  });
};

const observeBackground = new IntersectionObserver(
  handleLazyBackground,
  optionsLazy
);

const IntersectionInit = () => {
  body.forEach((background) => observeBackground.observe(background));
  headers.forEach((head) => observeMoveUp.observe(head));
  pictures.forEach((picture) => lazyImageObserver.observe(picture));
};
// #region ends
//#region start============================================================{Events}
const handleDomInit = () => {
  IntersectionInit();
  document.body.addEventListener("click", bodInit);
  handleDotInit();
  handleSliderInit();
  handleLocalStorage();
};

document.addEventListener("DOMContentLoaded", handleDomInit);
// #region end
