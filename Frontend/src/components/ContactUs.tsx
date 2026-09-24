import React, { useState } from 'react';

export const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thanks for reaching out! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-16">

            <div className="bg-gray-900 text-white py-16 mb-12 border-b-4 border-[#ff9900]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Get In <span className="text-[#ff9900]">Touch</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mx-auto max-w-2xl">
                        Have a question about your order, need supplement advice, or want to report an issue? Our support team is here to help you crush your goals.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Fill out the form and our team will get back to you within 24 hours. For immediate assistance regarding your supplements or orders, please reach out via phone or email.
                        </p>

                        <div className="space-y-6">

                            <div className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-[#ff9900] bg-orange-50 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Email Us</h4>
                                    <p className="text-gray-500">support@suplis.com</p>
                                </div>
                            </div>


                            <div className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-[#ff9900] bg-orange-50 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Call Us</h4>
                                    <p className="text-gray-500">+91 8882531764</p>
                                    <p className="text-sm text-gray-400 mt-1">Mon-Fri from 9am to 6pm</p>
                                </div>
                            </div>


                            <div className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="text-[#ff9900] bg-orange-50 p-3 rounded-lg mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Headquarters</h4>
                                    <p className="text-gray-500">Vyayamshala Gym, Plot No. 2, Swaroop Park, Lajpat Nagar, Sahibabad, Ghaziabad,<br /> Uttar Pradesh India (201005) </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                    placeholder="Order tracking, Product inquiry, etc."
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors resize-none"
                                    placeholder="How can we help you today?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#ff9900] hover:bg-orange-500 text-black font-bold text-lg py-3 rounded-lg transition-colors duration-200 mt-4"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;