import { Button } from "@/components/ui/button";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/herobg1.jpg"
          alt="Team holding frames"
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-gray-500/60" /> */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
          Nirapod Business
        </h1>
        <p className="text-white text-sm sm:text-base font-medium tracking-wider mb-4 uppercase">
          Together we learn more
        </p>

      </div>

      {/* Curved Bottom Edge */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div> */}
    </section>
  );
};

export default HeroSection;
