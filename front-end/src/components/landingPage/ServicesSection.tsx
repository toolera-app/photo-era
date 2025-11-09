"use client";

import React from "react";
import { IconCheck } from "@tabler/icons-react";

const ServicesSection = () => {
  const services = [
    {
      title: "LLM Chatbot Development",
      description:
        "Build advanced LLM-powered chatbots that understand context, use tools, and deliver natural responses.",
      features: [
        "Prompt engineering",
        "Custom LLM fine-tuning",
        "RAG implementation",
        "Multi-lingual support",
        "Context-aware responses",
        "Enterprise data integration",
      ],
    },
    {
      title: "AI Agent Development",
      description:
        "Develop AI agents that can handle customer interactions, automate tasks, and provide personalized support.",
      features: [
        "Custom AI agent development",
        "Integration with CRM systems",
        "Automated task execution",
        "Multi-modal support",
        "Voice and text support",
        "Tool integration",
      ],
    },
    {
      title: "LLM Chatbot Development",
      description:
        "Build advanced LLM-powered chatbots that understand context, use tools, and deliver natural responses.",
      features: [
        "Prompt engineering",
        "Custom LLM fine-tuning",
        "RAG implementation",
        "Multi-lingual support",
        "Context-aware responses",
        "Enterprise data integration",
      ],
    },
    {
      title: "NLP & RAG Systems",
      description:
        "Build advanced LLM-powered chatbots that understand context, use tools, and deliver natural responses.",
      features: [
        "Prompt engineering",
        "Custom LLM fine-tuning",
        "RAG implementation",
        "Multi-lingual support",
        "Context-aware responses",
        "Enterprise data integration",
      ],
    },
    {
      title: "AI Content Creation",
      description:
        "Develop AI agents that can handle customer interactions, automate tasks, and provide personalized support.",
      features: [
        "Custom AI agent development",
        "Integration with CRM systems",
        "Automated task execution",
        "Multi-modal support",
        "Voice and text support",
        "Tool integration",
      ],
    },
    {
      title: "Anything Gen AI",
      description:
        "Build advanced LLM-powered chatbots that understand context, use tools, and deliver natural responses.",
      features: [
        "Prompt engineering",
        "Custom LLM fine-tuning",
        "RAG implementation",
        "Multi-lingual support",
        "Context-aware responses",
        "Enterprise data integration",
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Services We Offer
          </h2>
          <p className="text-gray-400 text-lg">
            Bhai ki text diben apu jani nah, tobe ekta kisu diyepl
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20"
            >
              {/* Service Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {service.title}
              </h3>

              {/* Service Description */}
              <p className="text-gray-400 text-sm mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start space-x-3"
                  >
                    <IconCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
