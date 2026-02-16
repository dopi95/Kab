import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Kab Creative Lab - Get in Touch for Creative Services',
  description: 'Contact Kab Creative Lab for professional video production, branding, and creative services in Addis Ababa, Ethiopia. Call +251 983 101 000 or email kab@kabcreativelab.com. ያግኙን - የቪዲዮ ምርት እና የምርት ስም አገልግሎቶች',
  keywords: 'contact Kab Creative Lab, video production inquiry, creative services Ethiopia, Addis Ababa agency contact, ያግኙን, የቪዲዮ ምርት',
  openGraph: {
    title: 'Contact Kab Creative Lab | Professional Creative Services Ethiopia',
    description: 'Get in touch with Kab Creative Lab for video production, branding, and creative solutions in Ethiopia',
    url: 'https://kabcreativelab.com/contact',
  },
};

export default function ContactPage() {
  return (
    <main className="pt-20">
      <ContactSection />
      <Footer />
    </main>
  );
}
