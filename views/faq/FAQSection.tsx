"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FAQSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-lime-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-3xl center sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card style={{ maxHeight: "20rem" }}>
                    <CardContent className="flex flex-col items-center justify-center p-2">
                      <span className="text-3xl font-semibold">
                        {index + 1}
                        ADFASDFASDF SDFADFASDf ADFASDfa
                      </span>
                      <span className="text-3xl font-semibold">
                        {index + 1}
                        ADFASDFASDF SDFADFASDf ADFASDfa
                      </span>
                      <span className="text-3xl font-semibold">
                        {index + 1}
                        ADFASDFASDF SDFADFASDf ADFASDfa
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
