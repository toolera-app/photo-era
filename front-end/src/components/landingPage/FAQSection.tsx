"use client";

import React from "react";
import { Accordion } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "What types of images can I use?",
      answer:
        "You can upload product photos, fashion items, and other visual content. Our AI works best with clear, high-resolution images.",
    },
    {
      question: "Difference between FashionEra & ProductEra??",
      answer:
        "FashionEra is designed for fashion and apparel products with model integration, while ProductEra focuses on general product photography and lifestyle scenes.",
    },
    {
      question: "How do credits work, and how many generations do I get per tool?",
      answer:
        "Each credit equals one generation. Credits can be used across both FashionEra and ProductEra. Credits never expire and the minimum recharge is ৳50.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "We operate on a credit-based system, not a subscription. You only pay for the credits you need, with no recurring charges or cancellation required.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            How easy is it to use{" "}
            <span className="text-blue-500">toolera.app</span> ?
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion
          variant="separated"
          radius="lg"
          chevron={<IconChevronDown size={20} />}
          classNames={{
            item: "faq-accordion-item",
            control: "faq-accordion-control",
            label: "faq-accordion-label",
            content: "faq-accordion-content",
            chevron: "faq-accordion-chevron",
          }}
          styles={{
            item: {
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              marginBottom: "1rem",
              "&[data-active]": {
                borderColor: "#d1d5db",
              },
            },
            control: {
              padding: "1.25rem 1.5rem",
              "&:hover": {
                backgroundColor: "#f9fafb",
              },
            },
            label: {
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
            },
            content: {
              padding: "0 1.5rem 1.25rem 1.5rem",
              color: "#6b7280",
              fontSize: "0.9375rem",
              lineHeight: "1.6",
            },
            chevron: {
              color: "#9ca3af",
              "&[data-rotate]": {
                transform: "rotate(180deg)",
              },
            },
          }}
        >
          {faqs.map((faq, index) => (
            <Accordion.Item key={index} value={`faq-${index}`}>
              <Accordion.Control>{faq.question}</Accordion.Control>
              <Accordion.Panel>{faq.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        {/* Need More Help Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Need more help?
          </h3>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Our support team is ready to answer any additional questions you might have.
          </p>
          <button className="px-8 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Contact
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
