import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = location.state?.from?.pathname || '/account';

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Initial Authentication Request
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: 'webapp',
                    client_secret: 'secret',
                    username: formData.username.trim(), // Exact case matching for authId
                    password: formData.password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error?.message || data.message || 'Invalid username or password.');
            }

            let token = data.accessToken || data.access_token || data.token;

            // 2. Exchange Authorization Code for JWT Token if code is returned
            if (!token && data.code) {
                const tokenResponse = await fetch('http://localhost:3000/auth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: data.code,
                        clientId: 'webapp',
                    }),
                });

                const tokenData = await tokenResponse.json().catch(() => ({}));
                if (!tokenResponse.ok) {
                    throw new Error(tokenData.error?.message || tokenData.message || 'Failed to generate token.');
                }
                token = tokenData.accessToken || tokenData.access_token || tokenData.token;
            }

            // 3. Persist Token & Redirect User
            if (token) {
                const profile = await login(token);
                if (!profile) {
                    throw new Error('Unable to verify the signed-in user.');
                }
                navigate(from, { replace: true });
            } else {
                throw new Error('Authentication token missing from response.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">

                {/* Header Section */}
                <div className="flex flex-col items-center">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Sign In to Suplis
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Welcome back! Enter your details to continue.
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Username or Email</label>
                            <input
                                type="text"
                                required
                                placeholder="johndoe or john@example.com"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none focus:ring-[#ff9900]"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff9900] focus:outline-none focus:ring-[#ff9900]"
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
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    {/* Dedicated navigation button to Register Page */}
                    <div className="pt-4 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600 mb-3">Don't have an account yet?</p>
                        <Link
                            to="/register"
                            className="inline-block w-full text-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Create New Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}