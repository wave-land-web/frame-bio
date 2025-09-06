import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  projectId: '5tlvrew3',
  dataset: 'production',
  plugins: [structureTool({ structure })],
  schema,
  name: 'frame-bio',
})
