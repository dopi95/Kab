import AnimatedHero from '@/components/AnimatedHero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <AnimatedHero />
      <AboutSection />
      <ServicesSection />
      
      <section id="portfolio" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Portfolio Section</h2>
      </section>

      <FAQSection />
      <Footer />
    </main>
  )
}