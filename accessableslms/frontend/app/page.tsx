// app/page.tsx
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className={'min-h-screen bg-gradient-to-be from-blue-50 to-white dark:from-gray-900 dark:to-black'}>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </div>
  );
}