/* ANIMATION KEY

data-splittext
data-fade-in
data-fade-list
data-fade-up
data-prevent-flicker = "true"
 
 */

///////////////////// REMOVE DATA PREVENT FLICKER / REGISTER PLUGINS ////////////////////

// If GSAP doesn't run show hidden elements with data-prevent-flicker = true on them

document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.gsap === "undefined")
    document.documentElement.classList.add("gsap-not-found");
  gsap.registerPlugin(ScrollTrigger, SplitText);
});
///////////////////// NAVBAR ANIMATION ////////////////

// select the navbar using data attribute
const navbar = document.querySelector('[data-animation="navbar"]');

// Scroll down 50px - used to apply initial styles to navbar (background color & box shadow)
/*ScrollTrigger.create({
    start: "top -50px",
    end: 99999,
    // call applyStyles function on navbar variable
    onEnter: () => applyStyles(navbar),
    // call removeStyles function on navbar variable
    onLeaveBack: () => removeStyles(navbar),
  });*/

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

// Function that applies styles to navbar.
// Since this navbar has a dark and light mode, different colors area applied based on dark or light mode. Check occurs in boxShadowColor and backgroundColor to determine if the light-mode class is applied.
/*function applyStyles(navbar) {
    // Variables that determine the style to be applied to the navbar.
    // Be sure to apply light-mode to the .navbar_wrapper. Done by setting a class attribute on the .navbar_wrapper in Webflow, leave value blank, attach to a property that allows user to enter light-mode into the property field in Webflow
    //const isLightMode = navbar.classList.contains("light-mode");
    const boxShadowColor = "rgba(255, 255, 255, 0.1)";
    //const backgroundColor = isLightMode
      //? "var(--background-color--primary)"
      //: "var(--background-color--alternate)";

    // GSAP method that actually applies the colors to the navbar
    gsap.to(navbar, {
      boxShadow: `0 4px 8px ${boxShadowColor}`,
      //backgroundColor: backgroundColor,
      duration: 0.3,
    });
  }*/

// function that removes the styles from the navbar. Occurs when scroll position is less than 50px from top of screen. See first scrollTrigger.
/* function removeStyles(navbar) {
    gsap.to(navbar, {
      boxShadow: "none",
      //backgroundColor: "transparent",
      duration: 0.3,
    });
  }*/

///////////////////// NAVBAR ANIMATION END ////////////////

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
      // make sure the element is visible before split
      gsap.set(el, { autoAlpha: 1 });

      // split + animate when split occurs
      SplitText.create(el, {
        type: "words, lines",
        autoSplit: true,
        mask: "lines",
        linesClass: "line",
        onSplit: (self) => {
          // `self.lines` is an array of <div class="line"> wrappers
          const tween = gsap.from(self.lines, {
            duration: 1.6,
            yPercent: 100,
            opacity: 0,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 50%",
              once: true, // only play once
              // markers: true,    // enable to debug trigger points
            },
          });
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
        // For elements with flicker prevention:
        // 1. First set visibility to 1 but opacity to 0 (makes it visible but transparent)
        // 2. Then animate from opacity 0 to 1
        tl.set(el, { visibility: "visible", opacity: 0 }).to(el, {
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
        // Make visible but keep opacity 0, then animate
        tl.set(el, { visibility: "visible", opacity: 0, y: distance }).to(el, {
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
        // First make the container visible
        tl.set(list, { visibility: "visible" });

        // Then animate children from hidden to visible with stagger
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
