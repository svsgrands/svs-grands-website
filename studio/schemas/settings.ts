export default {
  name: 'settings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    {
      name: 'hotelName',
      title: 'Hotel Name',
      type: 'string',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Link',
      type: 'url',
    },
    {
      name: 'googleMaps',
      title: 'Google Maps Link',
      type: 'url',
    },
    {
      name: 'instagramLink',
      title: 'Instagram Link',
      type: 'url',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
    },
    {
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
    },
    {
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
    },
  ],
}
