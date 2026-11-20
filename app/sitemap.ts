import type { MetadataRoute } from 'next';
import { liveProducts } from '@/content/products';
import { site } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...liveProducts().map((p) => `/${p.slug}`), '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly', priority: p === '' ? 1 : 0.7 }));
}
