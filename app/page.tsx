import { Header, Footer } from '@/components/layout'
import {
  Hero,
  Doors,
  Stats,
  Compliance,
  HowItWorks,
  Programs,
  OtherFormats,
  PartnerChannel,
  LatestPosts,
  FinalCTA,
} from '@/components/sections'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Doors />
        <Stats />
        <Compliance />
        <HowItWorks />
        <Programs />
        <OtherFormats />
        <PartnerChannel />
        <LatestPosts />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
