import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Recruitment from "@/components/Recruitment";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/10 selection:text-primary">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Recruitment />
      <FAQ />
      <Footer />
    </main>
  );
}
