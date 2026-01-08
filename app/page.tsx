import { Header, Footer } from '@/components/layout'
import { Hero, Services, Telesaude, HowItWorks, Benefits, CTA } from '@/components/sections'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Telesaude />
        <HowItWorks />
        <Benefits />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

