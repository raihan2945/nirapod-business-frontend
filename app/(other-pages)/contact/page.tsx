import { Home, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <h2 className="text-3xl center sm:text-4xl lg:text-5xl font-bold">
            GET IN TOUCH WITH US
          </h2>
        </div>

        <div className="space-y-12">
          {/* Location */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <Home
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                Our Location
              </h2>
              <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                Utopia Symphony (6th Floor), House-08, Road-02, Block-J
                <br />
                Baridhara, Dhaka-1212, Bangladesh
              </p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <Phone
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                Phone Number
              </h2>
              <a
                href="tel:+8801923508508"
                className="text-base md:text-lg text-blue-700 hover:text-blue-800 transition-colors"
              >
                +8801923508508, 
              </a>
              <a
                href="tel:+8801818646587"
                className="ml-2 text-base md:text-lg text-blue-700 hover:text-blue-800 transition-colors"
              >
                 +8801818646587
              </a>
            </div>
          </div>

          {/* Email Address */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <Mail
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-900"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                Email Address
              </h2>
              <a
                href="mailto:nirapadbusiness@gmail.com"
                className="text-base md:text-lg text-blue-700 hover:text-blue-800 transition-colors break-all"
              >
                nirapadbusiness@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
