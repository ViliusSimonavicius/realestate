import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Navigation Menu',
      description: 'Add and manage links for the header menu.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Label (e.g., Portfolio)' },
            { name: 'url', type: 'string', title: 'Path (e.g., /properties or /#contact)' }
          ],
          preview: {
            select: { title: 'title', subtitle: 'url' }
          }
        }
      ]
    })
  ]
})