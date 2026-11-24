import type { MetadataRoute } from 'next';
import { liveProducts } from '@/content/products';
import { site } from '@/content/site';
import { topicPath, topics } from '@/content/topics';
import { updated } from '@/content/updated';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', ...liveProducts().map((p) => `/${p.slug}`), ...topics.map(topicPath), '/solutions', '/industries', '/about', '/demo', '/privacy', '/terms'];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: updated[p || '/'] }));
}
