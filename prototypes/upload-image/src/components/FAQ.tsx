"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do your products come in pairs?",
    answer: "All our earpads, sweat covers, magnet plates, earbuds hooks, earbuds tips, and shell covers come in pairs. Our headbands, controller skins, and mousepads come as a single unit.",
  },
  {
    question: "Why is there no blue strip on the cooling gel earpads I received?",
    answer: "Our cooling gel earpads don't physically have a blue strip. The blue strip shown in product pictures is just a visual representation of the cooling gel inside the earpads to help customers understand what's inside.",
  },
  {
    question: "Will replacing my stock ear pads with Wicked Cushions affect the sound quality of my headphones, especially in terms of bass or noise cancellation?",
    answer: "In some cases our earpads will cause a difference in noise cancellation or audio quality, however our customers have not expressed any concern over this generally. If you are unhappy with the change, please feel free to contact us.",
  },
  {
    question: "I can't find my exact headphone model among your products. How can I find out if you make earpads for my headphones?",
    answer: "If you cannot find your specific headphone model by searching on our site, please contact us using the form on the right, and our team will help you ASAP.",
  },
  {
    question: "How long is the warranty?",
    answer: "We provide a no questions asked 365 day guarantee. We will replace your product for free if you have any issues!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center font-display text-3xl mb-12">FREQUENTLY ASKED QUESTIONS</h2>
        <p className="text-center text-gray-500 mb-8">Please read our FAQs page to find out more.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-2xl text-[#ff6633]">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

