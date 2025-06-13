// @ts-check
import { defineConfig } from "astro/config";
//import { imageService } from "@unpic/astro/service";

// https://astro.build/config
export default defineConfig({
  experimental: {
    responsiveImages: true,
  },
  // This is the URL of your live site. Astro uses this for generating canonical URLs and your sitemap.
  site: "https://www.caseylewisphotography.com",

  image: {
    experimentalLayout: "constrained",
    //service: imageService(),
  },

  // Optional: If your site is hosted in a subdirectory, specify the base path.
  // base: '/your-subdirectory/',

  // Optional: Control whether URLs have trailing slashes. Options are "always", "never", or "ignore".
  // trailingSlash: 'always',
});
