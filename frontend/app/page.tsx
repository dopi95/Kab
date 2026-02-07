import AnimatedHero from '@/components/AnimatedHero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';

export default function Home() {
  return (
    <main>
      <AnimatedHero />
      <AboutSection />
      <ServicesSection />
      
      <section id="portfolio" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Portfolio Section</h2>
      </section>
      <section id="contact" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Section</h2>
      </section>
    </main>
  )
}