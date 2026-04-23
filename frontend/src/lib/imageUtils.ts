export const PATH_MAP: Record<string, string> = {
  '/images/products/af1-low.jpg': '/images/products/5-air-force-1.jpg',
  '/images/products/nb550.jpg': '/images/products/4-nb-550.jpg',
  '/images/products/ub24.jpg': '/images/products/8-ultra-boost.jpg',
  '/images/products/kayano31.jpg': '/images/products/12-asics-gel-kayano.jpg',
  '/images/products/aj1-high.jpg': '/images/products/1-air-jordan-1.jpg',
  '/images/products/timb6in.jpg': '/images/products/7-timberland-6inch.jpg',
  '/images/products/dm1460.jpg': '/images/products/11-dr-martens-1460.jpg',
  '/images/products/vans-os.jpg': '/images/products/9-vans-old-skool.jpg',
  '/images/products/chuck-hi.jpg': '/images/products/6-chuck-taylor.jpg',
  '/images/products/harden8.jpg': '/images/products/2-yeezy-350.jpg',
  '/images/products/lebron21.jpg': '/images/products/3-dunk-low-panda.jpg',
  '/images/products/peg41.jpg': '/images/products/10-air-max-90.jpg',
  '/images/products/gel1130.jpg': '/images/products/4-nb-550.jpg',
  '/images/products/superstar.jpg': '/images/products/2-yeezy-350.jpg',
}

export function resolveImageUrl(url: string | undefined): string {
  if (!url) return ''
  return PATH_MAP[url] || url
}