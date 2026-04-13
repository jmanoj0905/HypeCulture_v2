/**
 * Shoe image scraper using Playwright.
 * Visits product pages, grabs og:image or first product image, downloads to public/images/products/.
 *
 * Run: node scripts/scrape-images.js
 */

import { chromium } from 'playwright'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '../public/images/products')
fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const SHOES = [
  {
    id: 1, file: '1-air-jordan-1.jpg',
    urls: [
      'https://www.nike.com/t/air-jordan-1-retro-high-og-mens-shoes-KVpEM9a8/DZ5485-003',
      'https://www.kicksonfire.com/air-jordan-1-retro-high-og/',
    ],
    fallback: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80',
  },
  {
    id: 2, file: '2-yeezy-350.jpg',
    urls: [
      'https://www.adidas.com/us/yeezy-boost-350-v2-shoes/FZ5000.html',
    ],
    fallback: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  },
  {
    id: 3, file: '3-dunk-low-panda.jpg',
    urls: [
      'https://www.nike.com/t/dunk-low-retro-mens-shoes-jBrhbr/DD1391-100',
    ],
    fallback: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
  },
  {
    id: 4, file: '4-nb-550.jpg',
    urls: [
      'https://www.newbalance.com/pd/550/BB550WT1.html',
    ],
    fallback: 'https://images.unsplash.com/photo-1556048219-bb6978360b84?w=800&q=80',
  },
  {
    id: 5, file: '5-air-force-1.jpg',
    urls: [
      'https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr/CW2288-111',
    ],
    fallback: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  },
  {
    id: 6, file: '6-chuck-taylor.jpg',
    urls: [
      'https://www.converse.com/p/chuck-taylor-all-star/M9166C',
    ],
    fallback: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
  },
  {
    id: 7, file: '7-timberland-6inch.jpg',
    urls: [
      'https://www.timberland.com/en-us/c/mens-6-inch-boots',
    ],
    fallback: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80',
  },
  {
    id: 8, file: '8-ultra-boost.jpg',
    urls: [
      'https://www.adidas.com/us/ultraboost-22-shoes/GZ0127.html',
    ],
    fallback: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&q=80',
  },
  {
    id: 9, file: '9-vans-old-skool.jpg',
    urls: [
      'https://www.vans.com/en-us/shoes-c00081/old-skool-pvn000d3hy28',
    ],
    fallback: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
  },
  {
    id: 10, file: '10-air-max-90.jpg',
    urls: [
      'https://www.nike.com/t/air-max-90-mens-shoes-jBrhbr/CN8490-100',
    ],
    fallback: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
  },
  {
    id: 11, file: '11-dr-martens-1460.jpg',
    urls: [
      'https://www.drmartens.com/us/en_us/1460-smooth-leather-lace-up-boots/p/11822006',
    ],
    fallback: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
  },
  {
    id: 12, file: '12-asics-gel-kayano.jpg',
    urls: [
      'https://www.asics.com/us/en-us/gel-kayano-29/p/1011B440-004.html',
    ],
    fallback: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
  },
]

async function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const req = proto.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        // Follow redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          req.destroy()
          return download(res.headers.location, filepath).then(resolve).catch(reject)
        }
        if (res.statusCode !== 200) {
          req.destroy()
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        const file = fs.createWriteStream(filepath)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
        file.on('error', reject)
      },
    )
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

async function scrapeOgImage(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
    // Try og:image meta tag first
    const ogImage = await page.$eval(
      'meta[property="og:image"], meta[name="og:image"], meta[property="twitter:image"]',
      (el) => el.getAttribute('content'),
    ).catch(() => null)

    if (ogImage && ogImage.startsWith('http')) return ogImage

    // Fallback: first large product image
    const imgSrc = await page.$$eval(
      'img[src*="nike"], img[src*="adidas"], img[src*="static"], img[src*="cdn"], img[src*="media"]',
      (imgs) => {
        const big = imgs.filter(
          (img) => img.naturalWidth > 200 || parseInt(img.getAttribute('width') || '0') > 200,
        )
        return big[0]?.src || null
      },
    ).catch(() => null)

    return imgSrc || null
  } catch (e) {
    return null
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  })

  const page = await context.newPage()

  // Abort unnecessary resource types to speed up
  await page.route('**/*', (route) => {
    const type = route.request().resourceType()
    if (['font', 'media', 'websocket'].includes(type)) {
      route.abort()
    } else {
      route.continue()
    }
  })

  let successCount = 0

  for (const shoe of SHOES) {
    const filepath = path.join(OUTPUT_DIR, shoe.file)
    if (fs.existsSync(filepath)) {
      console.log(`  skipped ${shoe.file} (exists)`)
      successCount++
      continue
    }

    let imageUrl = null

    // Try scraping each product page
    for (const url of shoe.urls) {
      console.log(`  trying ${url}`)
      imageUrl = await scrapeOgImage(page, url)
      if (imageUrl) {
        console.log(`  found OG image: ${imageUrl.substring(0, 80)}...`)
        break
      }
    }

    // Fall back to Unsplash placeholder
    if (!imageUrl) {
      console.log(`  no image found -- using Unsplash fallback`)
      imageUrl = shoe.fallback
    }

    // Download
    try {
      await download(imageUrl, filepath)
      const stat = fs.statSync(filepath)
      if (stat.size < 5000) {
        // Too small -- probably an error page, use fallback
        fs.unlinkSync(filepath)
        await download(shoe.fallback, filepath)
      }
      console.log(`  saved ${shoe.file} (${Math.round(fs.statSync(filepath).size / 1024)}kb)`)
      successCount++
    } catch (e) {
      console.log(`  failed to download: ${e.message}`)
      try {
        await download(shoe.fallback, filepath)
        console.log(`  saved fallback for ${shoe.file}`)
        successCount++
      } catch {
        console.log(`  fallback also failed for ${shoe.file}`)
      }
    }

    // Small delay between requests
    await page.waitForTimeout(800)
  }

  await browser.close()
  console.log(`\ndone: ${successCount}/${SHOES.length} images saved to ${OUTPUT_DIR}`)
}

main().catch(console.error)
