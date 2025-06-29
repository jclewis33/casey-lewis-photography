/* ANIMATION KEY

data-splittext
data-fade-in
data-fade-list
data-fade-up
data-prevent-flicker = "true"
 
 */

///////////////////// REMOVE DATA PREVENT FLICKER / REGISTER PLUGINS ////////////////////

// Function to handle GSAP initialization
function initGSAP() {
  if (typeof window.gsap === "undefined") {
    console.warn("GSAP not found, adding gsap-not-found class");
    document.documentElement.classList.add("gsap-not-found");
    return false;
  }

  // Register plugins
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Immediately make flicker-prevention elements visible since GSAP is loaded
  const flickerElements = document.querySelectorAll(
    '[data-prevent-flicker="true"]'
  );
  flickerElements.forEach((element) => {
    element.style.visibility = "visible";
    element.style.opacity = "0"; // Start transparent for animations
  });

  return true;
}

// Check for GSAP as early as possible
document.addEventListener("DOMContentLoaded", () => {
  if (initGSAP()) {
    console.log("GSAP initialized successfully");
  }
});

// Failsafe: If GSAP still isn't loaded after 3 seconds, show content
setTimeout(() => {
  if (typeof window.gsap === "undefined") {
    console.warn("GSAP failed to load after timeout, showing content anyway");
    document.documentElement.classList.add("gsap-not-found");
  }
}, 3000);

///////////////////// NAVBAR ANIMATION ////////////////

// select the navbar using data attribute
const navbar = document.querySelector('[data-animation="navbar"]');

if (navbar && typeof gsap !== "undefined") {
  // Scroll down 100px - used to initially move the scrollbar off screen. Will bring the navbar back when scrolled back to the top.
  ScrollTrigger.create({
    start: "top -100px",
    end: 99999,
    // moves the navbar off screen when page scrolled down 100px
    onEnter: () => gsap.to(navbar, { y: "-100%", duration: 0.3 }),
    // moves the navbar back on screen when page scrolled back past the 100px mark
    onLeaveBack: () => gsap.to(navbar, { y: "0%", duration: 0.3 }),
  });

  // When scrolled past 100px mark. Uses self.direction to determine whether user is scrolling down the page or back up the page. Depending on direction, the navbar will move out of view or move into view.
  ScrollTrigger.create({
    start: "top -100px",
    end: 99999,
    onUpdate: (self) => {
      // When page is scrolled up, navbar moves into view
      if (self.direction === -1) {
        gsap.to(navbar, { y: "0%", duration: 0.3 });
        // When page is scrolled down, navbar is moved out of view. Also checks to see if scroll position is greater than 100px from the top of the page.
      } else if (self.direction === 1 && self.scroll() > 100) {
        gsap.to(navbar, { y: "-100%", duration: 0.3 });
      }
    },
  });
}

///////////////////// ANIMATION FUNCTIONS ////////////////

///////////////////// SPLITTEXT ANIMATION ////////////////

function initSplitText() {
  // Make sure to wait for fonts to load to avoid layout shifts
  document.fonts.ready.then(() => {
    // select all elements tagged for split-text
    const elems = gsap.utils.toArray(
      "[data-splittext], [data-split-text='true']"
    );

    elems.forEach((el) => {
      // Check if this element should prevent flicker
      const preventFlicker = el.getAttribute("data-prevent-flicker") === "true";

      if (preventFlicker) {
        // Element is already visible from initGSAP, start with opacity 0
        gsap.set(el, { opacity: 0 });
      } else {
        // make sure the element is visible before split
        gsap.set(el, { autoAlpha: 1 });
      }

      // split + animate when split occurs
      SplitText.create(el, {
        type: "words, lines",
        autoSplit: true,
        mask: "lines",
        linesClass: "line",
        onSplit: (self) => {
          // `self.lines` is an array of <div class="line"> wrappers
          const tween = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 50%",
              once: true, // only play once
              // markers: true,    // enable to debug trigger points
            },
          });

          if (preventFlicker) {
            // First make the container visible, then animate lines
            tween.set(el, { opacity: 1 }).from(self.lines, {
              duration: 1.6,
              yPercent: 100,
              opacity: 0,
              stagger: 0.1,
              ease: "expo.out",
            });
          } else {
            // Standard animation
            tween.from(self.lines, {
              duration: 1.6,
              yPercent: 100,
              opacity: 0,
              stagger: 0.1,
              ease: "expo.out",
            });
          }

          return tween; // return so SplitText knows about this tween
        },
      });
    });
  });
}

///////////////////// FADE-IN ANIMATION ////////////////

function initFadeIn() {
  const elems = gsap.utils.toArray("[data-fade-in], [data-fade='in']");
  elems.forEach((el) => {
    try {
      // Get custom duration if specified
      const duration = parseFloat(el.getAttribute("data-duration")) || 0.5;

      // Check if we should prevent flicker
      const preventFlicker = el.getAttribute("data-prevent-flicker") === "true";

      // Create timeline with common ScrollTrigger settings
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none none",
        },
      });

      if (preventFlicker) {
        // Element is already visible from initGSAP, just animate opacity
        tl.to(el, {
          opacity: 1,
          duration: duration,
        });
      } else {
        // Standard fromTo for elements without flicker prevention
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: duration });
      }
    } catch (err) {
      console.warn("Error initializing fade-in for element:", el, err);
    }
  });
}

///////////////////// FADE-UP ANIMATION ////////////////

function initFadeUp() {
  const elems = gsap.utils.toArray("[data-fade-up], [data-fade='up']");
  elems.forEach((el) => {
    try {
      // Get custom values if specified
      const duration = parseFloat(el.getAttribute("data-duration")) || 0.5;
      const distance = parseFloat(el.getAttribute("data-distance")) || 20;

      // Check if we should prevent flicker
      const preventFlicker = el.getAttribute("data-prevent-flicker") === "true";

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none none",
        },
      });

      if (preventFlicker) {
        // Element is already visible, set initial animation state and animate
        tl.set(el, { y: distance }).to(el, {
          opacity: 1,
          y: 0,
          duration: duration,
        });
      } else {
        // Standard fromTo for elements without flicker prevention
        tl.fromTo(
          el,
          { opacity: 0, y: distance },
          { opacity: 1, y: 0, duration: duration }
        );
      }
    } catch (err) {
      console.warn("Error initializing fade-up for element:", el, err);
    }
  });
}

///////////////////// FADE-LIST ANIMATION ////////////////

function initFadeList() {
  gsap.utils.toArray("[data-fade-list]").forEach((list) => {
    try {
      // Get custom values if specified
      const duration = parseFloat(list.getAttribute("data-duration")) || 0.5;
      const stagger = parseFloat(list.getAttribute("data-stagger")) || 0.2;

      // Check if we should prevent flicker
      const preventFlicker =
        list.getAttribute("data-prevent-flicker") === "true";

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: list,
          start: "top 75%",
          end: "bottom 50%",
          toggleActions: "play none none none",
        },
      });

      if (preventFlicker) {
        // List is already visible, animate children
        tl.fromTo(
          list.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: duration, stagger: stagger }
        );
      } else {
        // Standard fromTo for elements without flicker prevention
        tl.fromTo(
          list.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: duration, stagger: stagger }
        );
      }
    } catch (err) {
      console.warn("Error initializing fade-list for element:", list, err);
    }
  });
}

///////////////////// MANUAL SCROLLTRIGGER REFRESH ////////////////

// Manual ScrollTrigger refresh setup - more efficient approach
function initManualRefresh() {
  const refreshElements = gsap.utils.toArray("[data-refresh]");
  refreshElements.forEach((refreshElement) => {
    try {
      const id = refreshElement.id;
      const message = id
        ? `${id} has refreshed`
        : "section refreshed - no ID added";

      // Create a one-time refresh trigger
      ScrollTrigger.create({
        trigger: refreshElement,
        start: "top bottom",
        onEnter: function () {
          console.log(message);
          ScrollTrigger.refresh();

          // Optional: if you only want each refresh to happen once
          // Uncomment this if you want the refresh to only happen once per element
          // this.kill();
        },
        // Mark this ScrollTrigger for easy reference
        id: `refresh-${id || Math.random().toString(36).substr(2, 9)}`,
      });
    } catch (err) {
      console.warn(
        "Error setting up refresh for element:",
        refreshElement,
        err
      );
    }
  });
}

///////////////////// MASTER INIT FUNCTION ////////////////

// Master init function
function initScrollAnimations() {
  // Check if GSAP is available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not available, skipping animation initialization");
    return;
  }

  // Only kill animation ScrollTriggers, preserve pins and other ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => {
    const triggerEl = trigger.vars.trigger;
    if (
      triggerEl &&
      triggerEl.matches(
        "[data-fade-in], [data-fade-up], [data-fade-list], [data-fade], [data-splittext], [data-split-text]"
      )
    ) {
      trigger.kill();
    }
  });

  // Initialize all animations
  initSplitText();
  initFadeIn();
  initFadeUp();
  initFadeList();
  initManualRefresh();

  // Final refresh to make sure everything is calculated correctly
  ScrollTrigger.refresh();
}

// Initialize on page load
window.addEventListener("load", () => {
  initScrollAnimations();
  console.log("Scroll animations initialized");
});
