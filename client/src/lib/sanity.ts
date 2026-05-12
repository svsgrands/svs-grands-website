import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'l7wtqsmy',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-05-11',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ Queries
export const ROOMS_QUERY = `*[_type == "room"] | order(price asc) {
  ...,
  "coverImage": coverImage.asset->url,
  "gallery": gallery[].asset->url
}`

export const PLACES_QUERY = `*[_type == "place"] | order(name asc) {
  ...,
  "featuredImage": featuredImage.asset->url,
  "gallery": gallery[].asset->url
}`

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  ...,
  "heroMedia": heroMedia[] {
    ...,
    "image": image.asset->url,
    "videoUrl": videoUrl.asset->url,
    "fallbackImage": fallbackImage.asset->url
  },
  "offers": offers[] {
    ...,
    "image": image.asset->url
  }
}`

export const SETTINGS_QUERY = `*[_type == "settings"][0] {
  ...,
  "logo": logo.asset->url
}`

export const GALLERY_QUERY = `*[_type == "gallery"] {
  category,
  images[] {
    "src": asset->url,
    "alt": caption,
    "type": "image"
  },
  videos[] {
    "src": videoFile.asset->url,
    "videoUrl": videoUrl,
    "poster": poster.asset->url,
    "alt": caption,
    "type": "video"
  }
}`
