import {defineField, defineType} from 'sanity'

export const propertyType = defineType({
  name: 'property',
  title: 'Real Estate Property',
  type: 'document',
  // Sukuriame skirtukus, kad admin panelėje nebūtų vienas ilgas sąrašas
  groups: [
    { name: 'general', title: '1. General Info', default: true },
    { name: 'media', title: '2. Media & Gallery' },
    { name: 'specs', title: '3. Rooms & Specs' },
    { name: 'card', title: '4. Card Display' }, // Nustatymai kortelei (overlay)
  ],
  fields: [
    // --- BAZINĖ INFO ---
    defineField({ name: 'name', type: 'string', title: 'Property Name', group: 'general' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, group: 'general' }),
    defineField({ name: 'showOnHome', type: 'boolean', title: 'Show on Homepage?', initialValue: false, group: 'general' }),
    
    // NAUJA: Pridedame Location lauką čia
    defineField({ 
      name: 'location', 
      type: 'string', 
      title: 'Location / City', 
      group: 'general',
      description: 'Pvz.: Mayfair, London'
    }),

    defineField({
      name: 'status', type: 'string', title: 'Status', group: 'general',
      options: { list: ['Available', 'Reserved', 'Sold'], layout: 'radio' },
      initialValue: 'Available'
    }),
    defineField({ name: 'price', type: 'number', title: 'Price (£)', group: 'general' }),
    defineField({
      name: 'agents', type: 'array', title: 'Assigned Brokers', group: 'general',
      of: [{ type: 'reference', to: [{type: 'agent'}] }]
    }),
    defineField({ name: 'description', type: 'array', title: 'Detailed Description', of: [{type: 'block'}], group: 'general' }),

    // --- MEDIA ---
    defineField({ name: 'mainImage', type: 'image', title: 'Main Image', options: { hotspot: true }, group: 'media' }),
    defineField({
      name: 'gallery', type: 'array', title: 'Image Gallery', group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }], options: { layout: 'grid' }
    }),

    // --- KAMBARIAI IR SPECIFIKACIJOS ---
    defineField({ name: 'bedrooms', type: 'number', title: 'Total Bedrooms', group: 'specs' }),
    defineField({ name: 'bathrooms', type: 'number', title: 'Total Bathrooms', group: 'specs' }),
    defineField({ name: 'area', type: 'number', title: 'Total Area (sqm)', group: 'specs' }),
    defineField({
      name: 'rooms',
      type: 'array',
      title: 'Detailed Rooms',
      group: 'specs',
      description: 'Pridėkite atskirus kambarius, kad jie matytųsi objekto viduje',
      of: [{
        type: 'object',
        fields: [
          { name: 'roomName', type: 'string', title: 'Room Name (pvz. Master Bedroom)' },
          { name: 'size', type: 'number', title: 'Size in sq meters' }
        ],
        preview: {
          select: { title: 'roomName', subtitle: 'size' },
          prepare(selection) {
            const {title, subtitle} = selection
            return { title: title, subtitle: subtitle ? `${subtitle} sqm` : 'No size' }
          }
        }
      }]
    }),

    // --- KORTELĖS ATVAIZDAVIMAS ---
    defineField({
      name: 'cardDisplayType',
      type: 'string',
      title: 'What to show on the property card?',
      group: 'card',
      options: {
        list: [
          { title: 'Auto (Beds • Baths • Area)', value: 'auto' },
          { title: 'Custom Builder', value: 'custom' },
          { title: 'Hidden (Show nothing)', value: 'hidden' }
        ],
        layout: 'radio'
      },
      initialValue: 'auto'
    }),
    defineField({
      name: 'cardCustomBuilder',
      type: 'array',
      title: 'Custom Text Builder',
      group: 'card',
      description: 'Build your text: add dynamic values and static text blocks.',
      hidden: ({document}) => document?.cardDisplayType !== 'custom',
      of: [
        {
          type: 'object',
          name: 'dynamicField', // Kaladėlė: Dinaminė reikšmė
          title: 'Dynamic Value',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Select Field',
              options: {
                list: [
                  { title: 'Bedrooms (adds " Bed")', value: 'bedrooms' },
                  { title: 'Bathrooms (adds " Bath")', value: 'bathrooms' },
                  { title: 'Area (adds " sqm")', value: 'area' }
                ]
              }
            }
          ],
          preview: {
            select: { value: 'value' },
            prepare({value}) { return { title: `🔵 Dynamic: ${value}` } }
          }
        },
        {
          type: 'object',
          name: 'staticText', // Kaladėlė: Paprastas tekstas
          title: 'Custom Text',
          fields: [
            { name: 'text', type: 'string', title: 'Type your text (e.g. " • ")' }
          ],
          preview: {
            select: { text: 'text' },
            prepare({text}) { return { title: `✏️ Text: "${text}"` } }
          }
        }
      ]
    }) // <--- Pataisyta failo pabaiga
  ]
})