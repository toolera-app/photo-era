"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HowItWorkPage from "@/components/landingPage/HowItWorkPage";
import FashionEraSection from "@/components/landingPage/FashionEraSection";
import PricingSection from "@/components/landingPage/PricingSection";
import ServicesSection from "@/components/landingPage/ServicesSection";
import FAQSection from "@/components/landingPage/FAQSection";
import CTASection from "@/components/landingPage/CTASection";

const page = () => {
  return (
    <div>
      <Navbar />
      <main
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 24%, #FFFFFF 46%, #7CB6FE 79%, #1473E6 100%)",
        }}
      >
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <div className="text-center">
            {/* Subtitle Text */}
            <p className="text-gray-700 text-sm mb-8">
              Jani Na Ki diben but diyen kisu ekta, onlent wrote korar somoy pai
              nai bhai
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Create AI Visuals for Fashion &<br />
              Products — Instantly
            </h1>

            {/* Description */}
            <p className="text-gray-800 text-lg max-w-3xl mx-auto mb-8">
              Toolera.app is your AI creative studio. With{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                FashionEra
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                ProductEra
              </a>
              , transform simple product photos into styled model mockups and
              dynamic lifestyle scenes — no reshoots, no hassle.
            </p>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium inline-flex items-center space-x-2 shadow-lg">
              <span>Get started for free</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Facebook Profile Card Mockup */}
            <div className="mt-16 max-w-4xl mx-auto"></div>
          </div>
        </div>
      </main>
      {/* How it Works Section */}
      <HowItWorkPage />

      {/* FashionEra Section */}
      <FashionEraSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Services Section */}
      <ServicesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default page;