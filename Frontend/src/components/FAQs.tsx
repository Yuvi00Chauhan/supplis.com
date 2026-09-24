import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const FAQs: React.FC = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Are your supplements 100% authentic?",
            answer: "Absolutely. We bypass middlemen and source directly from official brands and authorized importers. Every product comes with an intact seal and a verifiable scratch code for you to check directly with the manufacturer."
        },
        {
            question: "How long does shipping take?",
            answer: "Orders are dispatched within 24 hours. Standard delivery takes 2-5 business days depending on your location in India. You will receive a tracking link via email and SMS as soon as your order ships."
        },
        {
            question: "What is your return and exchange policy?",
            answer: "We offer a 7-day return policy for items that are delivered damaged, tampered with, or incorrect. Because these are consumable goods, we cannot accept returns for opened or partially used products simply because you didn't like the flavor."
        },
        {
            question: "Do you offer Cash on Delivery (COD)?",
            answer: "Yes! We offer Cash on Delivery across most major pin codes in India. A small convenience fee may apply for COD orders, which will be calculated at checkout."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you can track it by logging into your Suplis.com account and visiting the 'My Orders' section. We also email you a direct tracking link from our courier partner."
        },
        {
            question: "The powder clumped up. Is it still safe to consume?",
            answer: "Yes, minor clumping is very common in pre-workouts and some amino acids due to ingredients like Citrulline and Glycerol absorbing moisture. It is 100% safe to consume. Just break the clumps with a spoon or shake it well."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-16">

            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-16 mb-12 border-b-4 border-[#ff9900]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Frequently Asked <span className="text-[#ff9900]">Questions</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mx-auto max-w-2xl">
                        Got questions? We've got answers. Find everything you need to know about our products, shipping, and returns right here.
                    </p>
                </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden mb-12">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border-b border-gray-100 last:border-b-0 ${openIndex === index ? 'bg-orange-50/30' : ''}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                            >
                                <span className={`font-bold text-lg ${openIndex === index ? 'text-[#ff9900]' : 'text-gray-900'}`}>
                                    {faq.question}
                                </span>

                                {/* Plus/Minus Icon */}
                                <span className="ml-4 text-gray-400 flex-shrink-0">
                                    {openIndex === index ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-[#ff9900]" viewBox="0 0 16 16">
                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {/* Expandable Answer */}
                            {openIndex === index && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in-down">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Call to Action: Contact Us */}
                <div className="text-center bg-gray-900 rounded-2xl p-8 md:p-12 shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
                    <p className="text-gray-300 mb-6">
                        Can't find the answer you're looking for? Our fitness experts are here to help you out.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-[#ff9900] hover:bg-orange-500 text-black font-bold px-8 py-3 rounded-lg transition-colors duration-200"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>

        </div>
    );
};

