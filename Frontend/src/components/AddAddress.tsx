import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressAdded: () => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onAddressAdded }) => {
    const { token } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        isDefault: false,
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const response = await fetch('http://localhost:3000/user-addresses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save address. Please check your inputs.');
            }

            onAddressAdded();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-down">

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Add New Shipping Address</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 font-bold text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Name of the person receiving the order"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Address Line 1 *
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            required
                            placeholder="Street address, house number"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                            Address Line 2
                        </label>
                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Apartment, suite, unit, landmark"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                required
                                placeholder="e.g. New Delhi"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                name="state"
                                required
                                placeholder="e.g. Delhi"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                ZIP / Postal Code *
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                required
                                placeholder="110001"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="10-digit mobile"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#ff9900] outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center pt-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 font-medium cursor-pointer">
                            Set as default shipping address
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 text-sm font-bold text-black bg-[#ff9900] hover:bg-orange-500 disabled:opacity-50 rounded-lg transition-colors"
                        >
                            {submitting ? 'Saving...' : 'Save Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};