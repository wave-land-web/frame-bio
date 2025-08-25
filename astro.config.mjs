// @ts-check
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { SITE_URL } from './src/consts'

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  adapter: netlify({
    imageCDN: false,
    cacheOnDemandPages: true,
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    layout: 'constrained',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  prefetch: {
    prefetchAll: true,
  },

  experimental: {
    // Museo fonts are loaded via Typekit in the layout head
  },

})
