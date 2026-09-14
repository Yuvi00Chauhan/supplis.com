import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AddAddressModal } from './AddAddress.tsx';

interface Order {
    id: string;
    createdAt?: string;
    createdOn?: string;
    totalAmount: number;
    status: string;
    description?: string;
}

interface Address {
    id: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
    phone?: string;
}

export const Account: React.FC = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated, loading, logout } = useAuth();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login', { replace: true, state: { from: { pathname: '/account' } } });
        }
    }, [loading, isAuthenticated, navigate]);

    // Function to re-fetch addresses after adding a new one via modal
    const fetchAddresses = async () => {
        if (!token) return;
        try {
            const addressResponse = await fetch('http://localhost:3000/user-addresses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (addressResponse.ok) {
                const addressData = await addressResponse.json();
                setAddresses(addressData);
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
        }
    };

    // Unified account data fetcher (Prevents ESLint set-state-in-effect errors)
    useEffect(() => {
        let isCancelled = false;

        if (!isAuthenticated || !token) {
            if (!loading) {
                setDataLoading(false);
            }
            return;
        }

        const loadAccountData = async () => {
            try {
                // 1. Fetch Orders from Order Service (Port 3001)
                const ordersResponse = await fetch('http://localhost:3001/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (ordersResponse.ok && !isCancelled) {
                    const ordersData = await ordersResponse.json();
                    setOrders(ordersData);
                }

                // 2. Fetch Addresses from Auth Service (Port 3000)
                const addressResponse = await fetch('http://localhost:3000/user-addresses', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (addressResponse.ok && !isCancelled) {
                    const addressData = await addressResponse.json();
                    setAddresses(addressData);
                }
            } catch (err) {
                console.error('Error loading account data:', err);
            } finally {
                if (!isCancelled) {
                    setDataLoading(false);
                }
            }
        };

        loadAccountData();

        return () => {
            isCancelled = true;
        };
    }, [isAuthenticated, token, loading]);

    const handleDeleteAddress = async (addressId: string) => {
        if (!token || !window.confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await fetch(`http://localhost:3000/user-addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
            } else {
                alert('Failed to delete address.');
            }
        } catch (err) {
            console.error('Error deleting address:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    if (loading || dataLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">Loading Account Details...</p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const latestOrder = orders.length > 0 ? orders[0] : null;

    return (
        <div className="bg-gray-50 min-h-screen pb-16 pt-8">
            <div className="max-w-7xl mx-auto px-4">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user.name}!</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="flex flex-col">
                                <li>
                                    <button
                                        onClick={() => setActiveTab('dashboard')}
                                        className={`w-full text-left px-6 py-4 font-medium transition-colors border-l-4 ${activeTab === 'dashboard' ? 'border-[#ff9900] bg-orange-50/50 text-[#ff9900]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full text-left px-6 py-4 font-medium transition-colors border-l-4 border-t border-t-gray-50 ${activeTab === 'orders' ? 'border-l-[#ff9900] bg-orange-50/50 text-[#ff9900]' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Order History
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('addresses')}
                                        className={`w-full text-left px-6 py-4 font-medium transition-colors border-l-4 border-t border-t-gray-50 ${activeTab === 'addresses' ? 'border-l-[#ff9900] bg-orange-50/50 text-[#ff9900]' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Saved Addresses
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className={`w-full text-left px-6 py-4 font-medium transition-colors border-l-4 border-t border-t-gray-50 ${activeTab === 'settings' ? 'border-l-[#ff9900] bg-orange-50/50 text-[#ff9900]' : 'border-l-transparent text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        Account Settings
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-6 py-4 font-medium text-red-500 hover:bg-red-50 transition-colors border-l-4 border-l-transparent border-t border-t-gray-50"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full md:w-3/4">

                        {/* --- DASHBOARD TAB --- */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6 animate-fade-in-down">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                                        <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-[#ff9900] mr-4 text-xl font-bold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl shadow-md text-white flex flex-col justify-center">
                                        <p className="text-gray-300 text-sm mb-1">Supplis Reward Points</p>
                                        <div className="flex items-end">
                                            <span className="text-4xl font-bold text-[#ff9900]">{user.rewardPoints ?? 0}</span>
                                            <span className="ml-2 mb-1 text-gray-400 text-sm">pts</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                        <button onClick={() => setActiveTab('orders')} className="text-sm text-[#ff9900] font-bold hover:underline">View All</button>
                                    </div>
                                    {latestOrder ? (
                                        <p className="text-gray-500 text-sm">
                                            Your latest order <strong className="text-gray-900">#{latestOrder.id.slice(0, 8)}</strong> is currently <strong className="text-[#ff9900]">{latestOrder.status}</strong>.
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No recent order activity found.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- ORDERS TAB --- */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-down">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Order History</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    {orders.length === 0 ? (
                                        <p className="p-6 text-gray-500 text-sm">No orders placed yet.</p>
                                    ) : (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                                <th className="p-4 font-medium">Order ID</th>
                                                <th className="p-4 font-medium">Date</th>
                                                <th className="p-4 font-medium">Summary</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium">Total</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-sm">
                                            {orders.map((order) => {
                                                const orderDate = order.createdAt || order.createdOn;
                                                return (
                                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="p-4 font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                                                        <td className="p-4 text-gray-500">
                                                            {orderDate ? new Date(orderDate).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="p-4 text-gray-700 truncate max-w-[200px]">
                                                            {order.description || 'Order Checkout'}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                order.status === 'Completed' || order.status === 'Delivered'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-orange-100 text-[#d98200]'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- ADDRESSES TAB --- */}
                        {activeTab === 'addresses' && (
                            <div className="space-y-6 animate-fade-in-down">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Shipping Addresses</h3>
                                        <button
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                                        >
                                            Add New
                                        </button>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <p className="text-gray-500 text-sm">No saved addresses found.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {addresses.map((address) => (
                                                <div key={address.id} className={`border-2 ${address.isDefault ? 'border-[#ff9900]' : 'border-gray-200'} rounded-xl p-5 relative`}>
                                                    {address.isDefault && (
                                                        <span className="absolute -top-3 left-4 bg-[#ff9900] text-black text-xs font-bold px-2 py-1 rounded">Default</span>
                                                    )}
                                                    <h4 className="font-bold text-gray-900 mb-2">{user.name}</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                        {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                                                        {address.city}, {address.state} - {address.zipCode}
                                                    </p>
                                                    <p className="text-gray-900 text-sm font-medium mb-4">Phone: {address.phone || user.phone}</p>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-sm font-bold text-red-500 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- SETTINGS TAB --- */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-down">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                                </div>
                                <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue={user.name}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                defaultValue={user.phone}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">To change your email, please contact support.</p>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-gray-100">
                                        <h4 className="font-bold text-gray-900 mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] focus:border-[#ff9900] outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="bg-[#ff9900] hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal for creating a new address */}
            <AddAddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressAdded={fetchAddresses}
            />
        </div>
    );
};

export default Account;