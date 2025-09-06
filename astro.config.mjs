// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import sanity from '@sanity/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { SITE_URL } from './src/consts'

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  adapter: netlify({
    imageCDN: false,
    cacheOnDemandPages: true,
  }),
  env: {
    schema: {
      PUBLIC_SANITY_STUDIO_PROJECT_ID: envField.string({
        context: 'client',
        access: 'public',
        default: '5tlvrew3',
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
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_AUDIENCE_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
    validateSecrets: true,
  },
  vite: {
    // @ts-expect-error: https://github.com/withastro/astro/issues/14030#issuecomment-3027129338
    plugins: [tailwindcss()],
  },

  integrations: [
    sanity({
      projectId: '5tlvrew3',
      dataset: 'production',
      useCdn: false,
      studioBasePath: '/admin',
      apiVersion: '2025-09-01',
    }),
    react(),
    sitemap({
      lastmod: new Date(),
      filter: (page) => page !== 'https://frame.bio/404/' && page !== 'https://frame.bio/success/',
    }),
  ],

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

  devToolbar: {
    enabled: true,
  },
})
