import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'xpy2a1hh',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-02-23',
})