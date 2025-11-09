"use client";

import React from "react";
import { IconCheck, IconLock } from "@tabler/icons-react";

const PricingSection = () => {
  const features = [
    "1 credits = 1 Generation",
    "credits can be use on all model",
    "credits never expire",
    "Minimum recharge is ৳50",
  ];

  const benefits = [
    "Pay only for credits",
    "Use across Fashionera and Productera",
    "Priority support",
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Flexible, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the perfect plan to supercharge your visual content creation.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-10">
            {/* Card Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Toolera Ai Studio
              </h3>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-gray-900">৳50</span>
                <span className="text-gray-600 ml-2 text-sm">BDT</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <IconCheck className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium shadow-lg mb-4">
              Buy Credits with bKash
            </button>

            {/* Payment Info */}
            <p className="text-center text-sm text-gray-600 mb-8">
              Pay securely with bKash - instant credit delivery
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-8">
              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <IconCheck className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md border border-green-100">
              <IconLock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                100% Safe and Secure Payments with bKash
              </span>
            </div>

            {/* bKash Logo */}
            <div className="flex items-center justify-center">
              <div className="px-6 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-pink-600 font-bold text-xl">bKash</span>
                  <svg
                    className="w-6 h-6 text-pink-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-gray-700 text-sm font-medium">Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
