import { createClient } from '@sanity/client'
/**
 * astro:env is only available in Astro server-side code.
 */
import { PUBLIC_SANITY_STUDIO_DATASET, PUBLIC_SANITY_STUDIO_PROJECT_ID } from 'astro:env/client'
import { SANITY_STUDIO_SECRET_TOKEN } from 'astro:env/server'

export const sanityClient = createClient({
  projectId: PUBLIC_SANITY_STUDIO_PROJECT_ID,
  dataset: PUBLIC_SANITY_STUDIO_DATASET || 'production',
  token: SANITY_STUDIO_SECRET_TOKEN,
  useCdn: false,
  // Use current date for most recent API version
  apiVersion: '2025-08-01',
})

export default sanityClient
