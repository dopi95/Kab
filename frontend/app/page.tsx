import AnimatedHero from '@/components/AnimatedHero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import PortfolioSection from '@/components/PortfolioSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <AnimatedHero />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <FAQSection />
      <Footer />
    </main>
  )
}