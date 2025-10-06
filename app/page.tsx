import Image from "next/image";
import Navbar from "@/views/navbar/Navbar";
import HeroSection from "@/views/hero/HeroSection";
import StatisticsSection from "@/views/statistic/StatisticsSection";
import Footer from "@/views/footer/Footer";
import FAQSection from "@/views/faq/FAQSection";
import FeedbackSection from "@/views/feedback/FeedbackSection";
import BlogSection from "@/views/blogs/BlogSection";
import NewsletterSection from "@/views/newsLetter/NewsLetterSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      {/* <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"> */}
      <StatisticsSection />
      <FAQSection />
      <FeedbackSection/>
      <BlogSection/>
      <NewsletterSection/>
      {/* </div>
      </section> */}
      <Footer />
    </div>
  );
}
