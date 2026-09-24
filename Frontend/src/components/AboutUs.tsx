import React from 'react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-16">

            <div className="bg-gray-900 text-white py-16 mb-16 border-b-4 border-[#ff9900]">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Fueling Your <span className="text-[#ff9900]">Fitness Journey</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mx-auto max-w-2xl">
                        At Suplis.com, we believe that achieving your peak physical potential starts with the right nutrition. We are on a mission to provide India with 100% authentic, premium sports nutrition.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 pb-8">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                            alt="Gym athlete tying shoes"
                            className="w-full rounded-xl shadow-lg object-cover"
                        />
                    </div>
                    <div className="order-1 md:order-2 md:px-8">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            The supplement market is unfortunately crowded with counterfeit products and misleading claims. Suplis.com was born out of a simple frustration: <strong className="text-gray-900">it shouldn't be this hard to find genuine protein and vitamins.</strong>
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We bypassed the middlemen to source directly from official brand manufacturers and authorized importers. Whether you're a professional bodybuilder, a weekend warrior, or just starting your health journey, we ensure that what you put into your body is safe, tested, and effective.
                        </p>
                    </div>
                </div>


                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3 text-gray-900">Why Choose Suplis?</h2>
                    <p className="text-gray-500">No compromises. Just results.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 pb-8">

                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center">
                        <div className="mb-5 flex justify-center text-[#ff9900]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                            </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">100% Authentic</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Every product is sourced directly from the brands or their official importers. We guarantee zero fakes.
                        </p>
                    </div>


                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center">
                        <div className="mb-5 flex justify-center text-[#ff9900]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm6 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm-3.5-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                                <path d="M2.5 0a.5.5 0 0 1 .5.5v1h10v-1a.5.5 0 0 1 1 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1v-1a.5.5 0 0 1 .5-.5zM1 3v1h14V3a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1zm14 2H1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"/>
                            </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Lab Tested</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            We prioritize brands that utilize third-party lab testing for purity, heavy metals, and protein profiling.
                        </p>
                    </div>


                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col items-center text-center">
                        <div className="mb-5 flex justify-center text-[#ff9900]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                            </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Fast & Secure Delivery</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your gains shouldn't wait. We process orders rapidly and partner with premium couriers for safe delivery.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900 text-white rounded-2xl p-10 md:p-16 text-center shadow-xl">
                    <h3 className="text-3xl font-bold mb-4">Ready to crush your goals?</h3>
                    <p className="mb-8 text-gray-300 text-lg">
                        Explore our wide range of premium proteins, pre-workouts, and essential vitamins.
                    </p>
                    <Link
                        to="/categories"
                        className="inline-block bg-[#ff9900] hover:bg-orange-500 text-black font-bold text-lg px-10 py-4 rounded-lg transition-colors duration-200"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;