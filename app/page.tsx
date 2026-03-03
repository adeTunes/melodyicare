import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Recruitment from "@/components/Recruitment";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Recruitment />
      <Footer />
    </main>
  );
}
