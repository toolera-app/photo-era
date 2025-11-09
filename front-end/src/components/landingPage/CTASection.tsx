"use client";

import React from "react";
import Image from "next/image";
import ctaBackground from "@/assets/images/cta-backgound.png";

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ctaBackground}
          alt="CTA Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Create Smarter?
        </h2>
        <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of creators transforming their product, fashion images
          with AI-powered tools.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 font-medium shadow-xl hover:shadow-2xl hover:scale-105 transform">
            Get started for free
          </button>
          <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 font-medium border border-white/30 shadow-xl">
            See pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
