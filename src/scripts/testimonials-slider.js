import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";

// Wait for DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // init Swiper:
  const swiper = new Swiper(".testimonials__slider-component.swiper", {
    // configure Swiper to use modules
    modules: [Navigation, Pagination],
    loop: true,
    slidesPerView: 2,
    spaceBetween: 16,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});
