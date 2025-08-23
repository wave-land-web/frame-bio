// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { SITE_URL } from './src/consts'

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  env: {
    schema: {
      PUBLIC_SANITY_STUDIO_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
        default: 'vs47sslu',
      }),
      PUBLIC_SANITY_STUDIO_DATASET: envField.string({
        context: 'client',
        access: 'public',
        default: 'production',
      }),
      SANITY_STUDIO_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
    validateSecrets: true,
  },
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

  integrations: [
    sanity({
      projectId: 'vs47sslu',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
      apiVersion: '2025-08-01',
    }),
    react(),
  ],
})
