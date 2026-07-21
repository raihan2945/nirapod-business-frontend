import React from "react";
import { FileSearch, Wallet, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Pick a project",
    body: "Browse vetted Murabaha and Musharaka ventures. Every project lists its funding goal, expected return, duration and repayment schedule up front.",
  },
  {
    icon: Wallet,
    title: "Invest your share",
    body: "Top up your wallet and buy as many shares as you want, starting from ৳5,000. Your investment is reviewed and confirmed before it goes live.",
  },
  {
    icon: TrendingUp,
    title: "Receive repayments",
    body: "Track each scheduled repayment from your dashboard. Returns land straight in your wallet — withdraw them or reinvest in the next project.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Three steps from browsing to receiving your first repayment.
          </p>
        </div>

        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {steps.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="relative rounded-2xl border border-gray-100 bg-gray-50/60 p-8 transition hover:border-[#31AD5C]/30 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#31AD5C]/10">
                <Icon className="h-6 w-6 text-[#31AD5C]" />
              </div>

              <span className="mt-6 block text-sm font-semibold text-[#31AD5C]">
                Step {index + 1}
              </span>
              <h3 className="mt-1 text-xl font-semibold text-gray-900">
                {title}
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorksSection;
