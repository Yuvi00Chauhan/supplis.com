import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const cleanPhone = formData.phone.trim();


        if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
            setError('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        setLoading(true);

        const fullPhoneNumber = cleanPhone ? `+91${cleanPhone}` : '';

        try {
            const response = await fetch('http://localhost:3000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName || '',
                    username: formData.username,
                    email: formData.email,
                    phone: fullPhoneNumber,
                    gender: formData.gender,
                    dob: formData.dob,
                    password: formData.password,
                    defaultTenantId: '4750fdd9-12a8-47a6-a508-5dd2d95da9cc',
                    authClientIds: [1],
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error?.message || data.message || 'Registration failed.');
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">

                <div className="flex flex-col items-center">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create a Suplis Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join to access premium supplements and manage your cart
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-100 text-center font-medium">
                        Account created successfully! Redirecting to login...
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* First & Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="johndoe"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Phone with Fixed India Flag Badge */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="inline-flex items-center gap-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 select-none">
                                        <img
                                            src="https://flagcdn.com/w20/in.png"
                                            alt="India"
                                            className="w-5 h-3.5 object-cover rounded-sm"
                                        />
                                        <span className="font-medium">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className="block w-full flex-1 rounded-r-md border border-gray-300 px-3 py-2 focus:border-[#ff9900] focus:outline-none"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            // Allows digits only
                                            const onlyNums = e.target.value.replace(/\D/g, '');
                                            setFormData({ ...formData, phone: onlyNums });
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Gender & DOB */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none bg-white"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-[#ff9900] px-4 py-2 font-bold text-black hover:bg-orange-500 focus:outline-none disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>

                        <div className="pt-4 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
                            <Link
                                to="/login"
                                className="inline-block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Sign In to Existing Account
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}