import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calens',
    id: 'calens.com',
    short_name: 'Calens',
    description: 'See it. Schedule it.',
    start_url: '/',
    display: 'standalone',
    background_color: '#131313',
    theme_color: '#131313',
    icons: [],
  }
}
