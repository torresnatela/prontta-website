import { MetadataRoute } from 'next'
import { siteConfig, absoluteUrl } from '@/lib/site-config'

/**
 * robots.txt
 *
 * - Libera o site inteiro para indexação (exceto /api).
 * - Dá boas-vindas EXPLÍCITAS aos crawlers de IA (GPTBot, ClaudeBot,
 *   PerplexityBot, Google-Extended etc.) — queremos que a Prontta seja
 *   descoberta e citada por mecanismos de IA (AEO/GEO).
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: '/api/',
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
