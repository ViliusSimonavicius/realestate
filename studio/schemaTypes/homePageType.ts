import {defineField, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Section', default: true },
    { name: 'pricing', title: '2. Fee Calculator' },
    { name: 'portfolio', title: '3. Portfolio Section' },
    { name: 'contact', title: '4. Contact Section' },
  ],
  fields: [
    // --- HERO SECTION ---
    defineField({ 
      name: 'heroSubtitle', type: 'string', title: 'Top Subtitle', 
      group: 'hero', description: 'e.g.: London\'s Premier Real Estate' 
    }),
    defineField({ 
      name: 'heroTitleNormal', type: 'string', title: 'Title (Normal part)', 
      group: 'hero', description: 'e.g.: Curating' 
    }),
    defineField({ 
      name: 'heroTitleHighlight', type: 'string', title: 'Title (Highlighted/Italic)', 
      group: 'hero', description: 'e.g.: Extraordinary Lifestyles' 
    }),

    // --- PRICING SECTION ---
    defineField({ 
      name: 'pricingSubtitle', type: 'string', title: 'Subtitle', 
      group: 'pricing'
    }),
    defineField({ 
      name: 'pricingTitle', type: 'string', title: 'Main Heading', 
      group: 'pricing' 
    }),
    defineField({ 
      name: 'pricingDesc', type: 'text', title: 'Description', 
      group: 'pricing' 
    }),
    defineField({ 
      name: 'marketFeePercent', type: 'number', title: 'Market Standard Fee (%)', 
      group: 'pricing'
    }),
    defineField({ 
      name: 'oakFeePercent', type: 'number', title: 'Oak & Gold Fee (%)', 
      group: 'pricing' 
    }),
    defineField({ 
      name: 'oakFeeBase', type: 'number', title: 'Oak & Gold Base Fee (£)', 
      group: 'pricing'
    }),

    // --- PORTFOLIO SECTION ---
    defineField({ 
      name: 'portfolioTitle', type: 'string', title: 'Section Heading', 
      group: 'portfolio' 
    }),
    defineField({ 
      name: 'portfolioDesc', type: 'text', title: 'Section Description', 
      group: 'portfolio' 
    }),

    // --- CONTACT SECTION ---
    defineField({ 
      name: 'contactTitle', type: 'string', title: 'Heading', 
      group: 'contact' 
    }),
    defineField({ 
      name: 'contactDesc', type: 'text', title: 'Description', 
      group: 'contact' 
    }),
  ]
})