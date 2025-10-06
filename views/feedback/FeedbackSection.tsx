"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import FeedbackCard from "./FeedbackCard";

const feedbacks = [
  {
    id: 1,
    name: "Adnan Shahariar",
    designation: "Mechanical Engineer (powerplant)",
    text: `ছোট মিনিমাম লেভেলের একটা বিনিয়োগ করেছি। কথা মতো ২৪ মাসের ৩ মাস পর রিটার্ন করেছে, ৪র্থ মাসে কিছু সমস্যার জন্য ফুল রিটার্ন করতে না পারলেও পরে যােগাযোগ করেছে। তাই আমার সামর্থ্য হলে আবার ইনভেস্ট করবো।`,
  },
  {
    id: 2,
    name: "Adnan Shahariar",
    designation: "Mechanical Engineer (powerplant)",
    text: `I am connected with this group since 1 year (approximately). I invest
          in 2 project. I have received the profit of the project in time. In
          this current situation halal business is very rare while Halal
          `,
  },
  {
    id: 3,
    name: "Adnan Shahariar",
    designation: "Mechanical Engineer (powerplant)",
    text: `I am connected with this group since 1 year (approximately). I invest
          in 2 project. I have received the profit of the project in time. In
          this current situation halal business is very rare while Halal
          Investment working with commitment. Specially Abu Bakar Siddique vai
          is very helpful person. I believe in their commitment. If we need any
          query we can ask them via what's app. Most of the time we get the
          reply within the day. I wish their success.`,
  },
];

export default function FeedbackSection() {
  return (
    <section className="py-8 sm:py-16 lg:py-20 bg-white-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h2 className="text-3xl center sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Investor Success Story
          </h2>
        </div>

        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent>
            {feedbacks.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <FeedbackCard index={index} data={item} />
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
