import React from "react";
import Image from "next/image";

const HeroSection = () => {
  return (
    /* the navbar is transparent over this section, so the image runs to the
       very top on every breakpoint - nothing is cropped, the header just
       floats above it */
    <section className="relative w-full overflow-hidden">
      <Image
        src="/images/herobg4.jpeg"
        alt="Nirapod Business"
        width={2560}
        height={1440}
        priority
        sizes="100vw"
        /* mobile: natural 16:9 height, entire image visible
           desktop: fills the viewport, cropped to taste */
        className="h-auto w-full lg:h-[100svh] lg:object-cover lg:object-center"
      />
    </section>
  );
};

export default HeroSection;
