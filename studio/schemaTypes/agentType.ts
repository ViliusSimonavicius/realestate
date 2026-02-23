import {defineField, defineType} from 'sanity'

export const agentType = defineType({
  name: 'agent',
  title: 'Broker',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Full Name' }),
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'text', title: 'Short Bio' }),
    defineField({
      name: 'phoneNumbers',
      type: 'array',
      title: 'Phone Numbers',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'email', type: 'string', title: 'Email Address' }),
  ],
})