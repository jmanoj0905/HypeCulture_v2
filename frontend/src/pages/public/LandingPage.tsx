import { HeroSection } from '@components/sections/HeroSection'
import { MarqueeTicker } from '@components/sections/MarqueeTicker'
import { ChapterDrop } from '@components/sections/ChapterDrop'
import { FeaturedScroll } from '@components/sections/FeaturedScroll'
import { ChapterAuth } from '@components/sections/ChapterAuth'
import { CategoryGrid } from '@components/sections/CategoryGrid'
import { StatsCounter } from '@components/sections/StatsCounter'
import { ChapterSell } from '@components/sections/ChapterSell'
import { FooterSection } from '@components/sections/FooterSection'

export function LandingPage() {
  return (
    <main className="bg-void">
      <HeroSection />
      <MarqueeTicker />
      <ChapterDrop />
      <FeaturedScroll />
      <ChapterAuth />
      <CategoryGrid />
      <StatsCounter />
      <ChapterSell />
      <FooterSection />
    </main>
  )
}
