import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import HowItWorks from "@/components/HowItWorks";
import Customizer from "@/components/Customizer";
import WhyUs from "@/components/WhyUs";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <ShowcaseGallery />
        <HowItWorks />
        <Customizer />
        <WhyUs />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
