export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
    },
    {
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
    },
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'heroItem',
          fields: [
            { name: 'type', type: 'string', options: { list: ['image', 'video'] } },
            { name: 'image', type: 'image', hidden: ({ parent }: any) => parent?.type !== 'image' },
            { name: 'videoUrl', type: 'file', hidden: ({ parent }: any) => parent?.type !== 'video' },
            { name: 'fallbackImage', type: 'image', hidden: ({ parent }: any) => parent?.type !== 'video' },
          ],
        },
      ],
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    },
    {
      name: 'aboutContent',
      title: 'About Section Content',
      type: 'text',
    },
    {
      name: 'features',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'text' },
            { name: 'icon', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'seoTitle',
      title: 'Homepage SEO Title',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'Homepage SEO Description',
      type: 'text',
    },
    {
      name: 'offers',
      title: 'Special Offers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'text' },
            { name: 'image', type: 'image' },
            { name: 'ctaLabel', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'benefits',
      title: 'Why Choose Us / Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'text' },
            { name: 'icon', type: 'string', description: 'Icon name (e.g., star, heart)' },
          ],
        },
      ],
    },
  ],
}
