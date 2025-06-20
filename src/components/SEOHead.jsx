import { useEffect } from 'react'
import { generateMetaTags, getPageSEO } from '../utils/seo'

export default function SEOHead({ 
  page = 'home',
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}) {
  useEffect(() => {
    const pageSEO = getPageSEO(page)
    const metaTags = generateMetaTags({
      title: title || pageSEO.title,
      description: description || pageSEO.description,
      keywords: keywords || pageSEO.keywords,
      image,
      url,
      type
    })

    document.title = metaTags.title

    const updateMetaTag = (property, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (isProperty) {
          meta.setAttribute('property', property)
        } else {
          meta.setAttribute('name', property)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    updateMetaTag('description', metaTags.description)
    updateMetaTag('keywords', metaTags.keywords)
    
    updateMetaTag('og:title', metaTags.openGraph.title, true)
    updateMetaTag('og:description', metaTags.openGraph.description, true)
    updateMetaTag('og:image', metaTags.openGraph.image, true)
    updateMetaTag('og:url', metaTags.openGraph.url, true)
    updateMetaTag('og:type', metaTags.openGraph.type, true)
    updateMetaTag('og:site_name', metaTags.openGraph.siteName, true)
    
    updateMetaTag('twitter:card', metaTags.twitter.card)
    updateMetaTag('twitter:title', metaTags.twitter.title)
    updateMetaTag('twitter:description', metaTags.twitter.description)
    updateMetaTag('twitter:image', metaTags.twitter.image)
    updateMetaTag('twitter:creator', metaTags.twitter.creator)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', metaTags.canonical)

  }, [page, title, description, keywords, image, url, type])

  return null
}