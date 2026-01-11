"use client";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
// @ts-ignore - side-effect CSS import without type declarations
// import "./globals.css";
import Navbar from "@/views/navbar/Navbar";
import HeroSection from "@/views/hero/HeroSection";
import StatisticsSection from "@/views/statistic/StatisticsSection";
import Footer from "@/views/footer/Footer";
import FAQSection from "@/views/faq/FAQSection";
import FeedbackSection from "@/views/feedback/FeedbackSection";
import BlogSection from "@/views/blogs/BlogSection";
import NewsletterSection from "@/views/newsLetter/NewsLetterSection";
import ProjectSection from "@/views/projects/ProjectSection";

export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            // Optional: Customize AntD theme here
            colorPrimary: "#31AD5C",
            borderRadius: 4,
            colorPrimaryActive: "#31AD5C",
          },
        }}
      >
        <Navbar />
        <HeroSection />
        <StatisticsSection />
        <ProjectSection />
        <FAQSection />
        <FeedbackSection />
        <BlogSection />
        <NewsletterSection />
        <Footer />
      </ConfigProvider>
    </StyleProvider>
  );
}
