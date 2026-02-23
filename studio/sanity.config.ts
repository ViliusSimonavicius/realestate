import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' // Pakeista iš deskTool
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'wesee-studio',

  projectId: 'xpy2a1hh', 
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})