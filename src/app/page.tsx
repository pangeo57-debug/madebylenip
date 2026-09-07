import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import PreorderSection from "@/components/PreorderSection";
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
        <WhyUs />
        <PreorderSection />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
