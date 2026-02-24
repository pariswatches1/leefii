export * from './categories'

import { BLOG_ARTICLES_PART1 } from './articles-part1'
import { BLOG_ARTICLES_PART2 } from './articles-part2'
import { BLOG_ARTICLES_PART3 } from './articles-part3'
import { BlogArticle } from './categories'

const ALL_STATIC_ARTICLES: BlogArticle[] = [
  ...BLOG_ARTICLES_PART1,
  ...BLOG_ARTICLES_PART2,
  ...BLOG_ARTICLES_PART3,
]

export function getAllStaticArticles(): BlogArticle[] {
  return ALL_STATIC_ARTICLES
}

export function getStaticArticleBySlug(slug: string): BlogArticle | undefined {
  return ALL_STATIC_ARTICLES.find(a => a.slug === slug)
}

export function getArticlesByCategory(categorySlug: string): BlogArticle[] {
  return ALL_STATIC_ARTICLES.filter(a => a.category === categorySlug)
}

export function getAllStaticArticleSlugs(): string[] {
  return ALL_STATIC_ARTICLES.map(a => a.slug)
}
