import Image from "next/image";
import Navbar from "@/views/navbar/Navbar";
import HeroSection from "@/views/hero/HeroSection";
import StatisticsSection from "@/views/statistic/StatisticsSection";
import Footer from "@/views/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection/>
      <StatisticsSection/>
      <Footer/>
    </div>
  );
}
