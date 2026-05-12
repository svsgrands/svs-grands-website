export default {
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Classic', value: 'classic' },
          { title: 'Standard', value: 'standard' },
          { title: 'Deluxe', value: 'deluxe' },
          { title: 'Superior', value: 'superior' },
          { title: 'Family Comfort', value: 'family-comfort' },
          { title: 'Exterior', value: 'exterior' },
        ],
      },
    },
    {
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Caption' },
            { name: 'isFeatured', type: 'boolean', title: 'Featured Image' },
          ],
        },
      ],
    },
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'videoFile', type: 'file' },
            { name: 'videoUrl', type: 'url', title: 'Video URL (Alternative to file)' },
            { name: 'poster', type: 'image', title: 'Video Poster' },
            { name: 'caption', type: 'string' },
          ],
        },
      ],
    },
  ],
}
