import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://flow.addoxy.me',
      lastModified: new Date(),
    },
  ];
}
