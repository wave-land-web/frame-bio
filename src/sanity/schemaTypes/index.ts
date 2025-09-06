import type { SchemaTypeDefinition } from 'sanity'
import contactForm from './contactForm'
import user from './user'
import blockContent from './blockContent'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, contactForm, blockContent],
}
