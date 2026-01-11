import Link from "next/link";
import { Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/logoDark.png"
                alt="Team holding frames"
                className="w-45 h-full object-cover"
              />
            </div>
            <p className="text-gray-700 font-mono text-sm max-w-xs">
             Together we learn more
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/running-projects"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Running Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/all-projects"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Apply for Investment
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  About Halal Invest
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Refunds and Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/account-deletion"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Account Deletion Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 mb-8">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-sm"
                >
                  Login
                </Link>
              </li>
            </ul>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Follow Us On</h3>
              <Link
                href="https://www.facebook.com/NirapadBusiness?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-emerald-700 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
