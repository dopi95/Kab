import AnimatedHero from '@/components/AnimatedHero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import FounderSection from '@/components/FounderSection';
import PortfolioSection from '@/components/PortfolioSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <AnimatedHero />
      <AboutSection />
      <ServicesSection />
      <FounderSection />
      <PortfolioSection />
      <FAQSection />
      <Footer />
    </main>
  )
}