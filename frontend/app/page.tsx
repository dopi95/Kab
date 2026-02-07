import AnimatedHero from '@/components/AnimatedHero';

export default function Home() {
  return (
    <main>
      <AnimatedHero />
      
      <section id="about" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">About Section</h2>
      </section>
      <section id="services" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Services Section</h2>
      </section>
      <section id="portfolio" className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Portfolio Section</h2>
      </section>
      <section id="contact" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Section</h2>
      </section>
    </main>
  )
}