import { HeroSection } from '@components/sections/HeroSection'
import { FeaturedScroll } from '@components/sections/FeaturedScroll'
import { CategoryGrid } from '@components/sections/CategoryGrid'
import { FooterSection } from '@components/sections/FooterSection'

export function LandingPage() {
  return (
    <main className="bg-void">
      <HeroSection />
      <FeaturedScroll />
      <CategoryGrid />
      <FooterSection />
    </main>
  )
}
