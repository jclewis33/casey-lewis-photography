//////////////////// FAQ Toggle ///////////////////
// This script creates an accordion functionality for FAQ sections using GSAP animation library

/**
 * FAQ Accordion Functionality
 * ---------------------------
 * This section handles the open/close toggle functionality for FAQ accordion sections.
 * It uses GSAP for smooth animations when expanding and collapsing content areas.
 *
 * Usage Instructions:
 * 1. Each FAQ item should have the class "faq_question-wrap"
 * 2. Inside each wrap, there should be:
 *    - An element with class "faq_content" (the content to show/hide)
 *    - An element with class "faq_plus-icon--vertical" (the + icon that rotates)
 * 3. To have an FAQ item open by default on page load, add the "open" class to its "faq_question-wrap"
 */

// Select all FAQ toggle elements using GSAP's utility function
const faqItems = gsap.utils.toArray(".faq__accordion");

// Iterate through each FAQ toggle element to set up functionality
faqItems.forEach((faq) => {
  // Select the corresponding content and icon elements for this specific FAQ item
  const faqQuestion = faq.querySelector(".faq__question-wrap");
  const faqContent = faq.querySelector(".faq__content");
  const faqIconWrapper = faq.querySelector(".faq__icon-wrapper");

  // NOTE: This line is commented out but kept for reference
  // If you need to adjust the transform origin of the icon animation, uncomment and modify
  //gsap.set(faqIcon, { transformOrigin: "50% 50%" });

  // Create a GSAP timeline for this FAQ section's animation
  // - paused: true - timeline doesn't play automatically
  // - reversed: true - timeline starts in the end state (closed)
  const tlFAQ = gsap
    .timeline({ paused: true, reversed: true })
    // Animate from height 0 to auto to create smooth accordion effect
    .fromTo(faqContent, { height: 0 }, { height: "auto" });

  // Add click event listener to toggle the FAQ open/closed
  faq.addEventListener("click", () => {
    // If timeline is reversed (closed), play it (open)
    // If timeline is not reversed (open), reverse it (close)
    tlFAQ.reversed() ? tlFAQ.play() : tlFAQ.reverse();

    // Toggle the "is-active" class on both the wrapper and icon elements
    // These classes can be used for additional styling changes in CSS
    faq.classList.toggle("is-active");
    faqIconWrapper.classList.toggle("is-active");
  });

  // Check if this FAQ item should be open by default (has "open" class)
  if (faq.classList.contains("open")) {
    // Add "is-active" classes to both the wrapper and icon
    faq.classList.add("is-active");
    faqIconWrapper.classList.add("is-active");

    // Play the timeline to open this FAQ item on page load
    tlFAQ.play();
  }
});
//////////////////// END FAQ Toggle ///////////////////
