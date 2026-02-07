export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#171817] dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-32">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Kab Creative Lab
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Welcome to our creative space where innovation meets design. 
            We craft exceptional digital experiences.
          </p>
          <button className="bg-gradient-to-r from-[#A97E50] to-[#C4A86D] hover:shadow-xl text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
      
      {/* Placeholder sections for navigation */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Home Section</h2>
      </section>
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