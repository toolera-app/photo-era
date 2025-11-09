"use client";

import React from "react";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";

const FashionEraSection = () => {
  // Sample slides data
  const slides = [
    {
      id: 1,
      mainImage:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
      inputImages: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
      ],
      prompt:
        "Prompt: a dummy prompt here for the product era model feature showcase...",
    },
    {
      id: 2,
      mainImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=600&fit=crop",
      inputImages: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      ],
      prompt:
        "Prompt: a dummy prompt here for the product era model feature showcase...",
    },
    {
      id: 3,
      mainImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
      inputImages: [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
      ],
      prompt:
        "Prompt: a dummy prompt here for the product era model feature showcase...",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Introducing <span className="text-green-600">FashionEra</span>
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Prompt, combine, Create
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Merge up to three images to make mockup new. combine disparate photo
            elements, or seamlessly blend objects, colors, and textures.
          </p>
        </div>

        {/* Mantine Carousel */}
        <div className="relative">
          <Carousel
            withIndicators
            styles={{
              control: {
                backgroundColor: "white",
                color: "#16a34a",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                "&[data-inactive]": {
                  opacity: 0,
                  cursor: "default",
                },
              },
              indicator: {
                width: 12,
                height: 12,
                backgroundColor: "#d1d5db",
                "&[data-active]": {
                  backgroundColor: "#16a34a",
                },
              },
            }}
          >
            {slides.map((slide) => (
              <Carousel.Slide key={slide.id}>
                <div className="grid md:grid-cols-2 gap-8 items-center pb-12">
                  {/* Left Side - Input Images */}
                  <div className="space-y-4">
                    {slide.inputImages.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-md text-sm font-medium text-gray-700 shadow-md z-10">
                          INPUT IMAGE
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-lg relative h-64">
                          <Image
                            src={image}
                            alt={`Input image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Side - Generated Image */}
                  <div className="relative">
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[600px]">
                      <Image
                        src={slide.mainImage}
                        alt="Generated fashion image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="text-center mt-6 mb-8">
                  <p className="text-gray-600 text-sm">{slide.prompt}</p>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium shadow-lg">
            Try FashionEra
          </button>
          <button className="px-8 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors font-medium border border-gray-300">
            See pricing
          </button>
        </div>
      </div>

      {/* Custom Carousel Styles */}
      <style jsx global>{`
        .fashion-era-carousel {
          padding-bottom: 50px;
        }

        @media (max-width: 768px) {
          .carousel-control {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FashionEraSection;
