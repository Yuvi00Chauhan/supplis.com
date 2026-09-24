import React from 'react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
    const featuresList = [
        {
            title: "100% Genuine Supplements",
            description: "We source directly from brands and authorized importers. Every tub comes with an authenticity seal and verifiable scratch code.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                </svg>
            )
        },
        {
            title: "Lightning Fast Delivery",
            description: "Your gains can't wait. We offer express shipping across India, ensuring your stack reaches your doorstep in record time.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4z"/>
                </svg>
            )
        },
        {
            title: "Wide Category Range",
            description: "From Whey Isolates and Creatine to niche Pre-Workouts and Plant Proteins. Everything you need to fuel your specific goal in one place.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-1z"/>
                </svg>
            )
        },
        {
            title: "Secure Payments",
            description: "Experience 100% safe and secure checkouts. We support all major UPI apps, credit/debit cards, and trusted digital wallets.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
            )
        },
        {
            title: "Easy Returns",
            description: "Got the wrong flavor? Damaged tub? Our hassle-free 7-day return and exchange policy guarantees your peace of mind.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                </svg>
            )
        },
        {
            title: "24/7 Expert Support",
            description: "Not sure which stack is right for you? Our certified fitness experts are available around the clock to guide your nutrition plan.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a6 6 0 1 1 12 0v6a2.5 2.5 0 0 1-2.5 2.5H9.366a1 1 0 0 1-.866.5h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 .866.5H11.5A1.5 1.5 0 0 0 13 12h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1V6a5 5 0 0 0-5-5z"/>
                </svg>
            )
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-16">

            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-16 border-b-4 border-[#ff9900]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Why Shop With <span className="text-[#ff9900]">Suplis?</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mx-auto max-w-2xl">
                        We are more than just an e-commerce store. We are your dedicated training partner, built with features designed to make your fitness journey seamless.
                    </p>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresList.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff9900] mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="bg-gray-900 text-white rounded-2xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#ff9900] opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#ff9900] opacity-10"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the Standard of Excellence</h2>
                        <p className="mb-8 text-gray-300 text-lg max-w-2xl mx-auto">
                            Join thousands of athletes who trust Suplis.com for their daily nutrition. Don't compromise on your health.
                        </p>
                        <Link
                            to="/categories"
                            className="inline-block bg-[#ff9900] hover:bg-orange-500 text-black font-bold text-lg px-10 py-4 rounded-lg transition-colors duration-200"
                        >
                            Explore Our Catalog
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};

