import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Address {
    id: string;
    name?: string;
    street?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isDefault?: boolean;
    phone?: string;
}

export const Checkout: React.FC = () => {
    const { user, token, isAuthenticated } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Address State
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    });
    const [isSavingAddress, setIsSavingAddress] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const [loading, setLoading] = useState(false);
    const finalTotal = Math.max(0, cartTotal - discount);
    const getAddressLine = (address: Address) => address.street || address.addressLine1 || '';

    // 1. Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                if (!isAuthenticated || !token) return;

                const response = await fetch('http://localhost:3000/user-addresses', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error('Failed to load saved addresses');
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setAddresses(data);
                    if (data.length > 0) {
                        const defaultAddress = data.find((address: Address) => address.isDefault);
                        setSelectedAddressId((defaultAddress || data[0]).id);
                    }
                }
            } catch (err) {
                console.error('Failed to load addresses:', err);
            }
        };

        fetchAddresses();
    }, [isAuthenticated, token]);

    // Save New Address Function
    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingAddress(true);

        try {
            if (!isAuthenticated || !token) {
                navigate('/login', { replace: true, state: { from: { pathname: '/checkout' } } });
                return;
            }

            const response = await fetch('http://localhost:3000/user-addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newAddress),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to save address');
            }

            // Append new address to list and select it
            setAddresses([...addresses, data]);
            setSelectedAddressId(data.id);

            // Clear form fields
            setNewAddress({ name: '', street: '', city: '', state: '', zipCode: '', phone: '' });
            alert("Address saved successfully!");

        } catch (err: any) {
            alert(err.message || 'Failed to save address.');
        } finally {
            setIsSavingAddress(false);
        }
    };

    // 2. Validate Coupon
    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponSuccess('');
        if (!couponCode.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Invalid coupon');
            }

            setDiscount(data.discountAmount);
            setCouponSuccess(`Applied! You saved ₹${data.discountAmount}`);
        } catch (err: any) {
            setCouponError(err.message);
            setDiscount(0);
        }
    };

    // 3. Initiate Payment Flow
    const handleProceedToPay = async () => {
        if (!selectedAddressId) {
            alert('Please select or add a shipping address before proceeding.');
            return;
        }

        setLoading(true);

        try {
            if (!isAuthenticated || !token) {
                navigate('/login', { replace: true, state: { from: { pathname: '/checkout' } } });
                return;
            }

            const orderPayload = {
                addressId: selectedAddressId,
                items: cartItems,
                subtotal: cartTotal,
                discountAmount: discount,
                totalAmount: finalTotal,
                ...(discount > 0 ? { couponCode } : {}),
            };

            const orderRes = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderPayload),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) throw new Error(orderData.error?.message || 'Failed to create order');

            const payRes = await fetch('http://localhost:3002/payments/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: orderData.id,
                    amount: finalTotal,
                    currency: 'INR',
                    checkoutDetails: {
                        applicationOrderId: orderData.id,
                        addressId: selectedAddressId,
                        items: cartItems,
                        subtotal: cartTotal,
                        discountAmount: discount,
                        couponCode: discount > 0 ? couponCode : undefined,
                    },
                }),
            });
            const payData = await payRes.json();

            if (!payRes.ok) {
                throw new Error(
                    payData.error?.message ||
                    payData.message ||
                    'Failed to generate payment session',
                );
            }

            const options = {
                key: payData.keyId,
                amount: payData.amount,
                currency: payData.currency,
                name: 'Supplis Store',
                description: `Order #${orderData.id}`,
                order_id: payData.razorpayOrderId,
                handler: async function (response: any) {
                    const confirmRes = await fetch('http://localhost:3002/payments/confirm', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            paymentOrderId: payData.paymentOrderId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        }),
                    });
                    if (!confirmRes.ok) {
                        throw new Error('Payment completed but could not be recorded.');
                    }
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    clearCart();
                    navigate('/account');
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                theme: { color: '#0d6efd' },
            };

            if (typeof window.Razorpay !== 'function') {
                throw new Error(
                    'Payment checkout is unavailable. Please disable ad blockers or refresh the page.',
                );
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert(`Payment Failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (err: any) {
            alert(err.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Checkout</h2>
            <div className="row g-4">

                {/* Left Column: Address Selection & Creation */}
                <div className="col-md-7">
                    <div className="card p-4 shadow-sm h-100">
                        <h4 className="mb-4">1. Shipping Address</h4>

                        {/* Render saved addresses above the form IF they exist */}
                        {addresses.length > 0 && (
                            <div className="mb-4">
                                <h5 className="mb-3 text-secondary">Select a Saved Address</h5>
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`form-check mb-3 border p-3 rounded cursor-pointer ${selectedAddressId === addr.id ? 'border-primary bg-light' : ''}`}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <input
                                            className="form-check-input ms-1 mt-2"
                                            type="radio"
                                            name="address"
                                            id={addr.id}
                                            checked={selectedAddressId === addr.id}
                                            onChange={() => setSelectedAddressId(addr.id)}
                                        />
                                        <label className="form-check-label ms-3 w-100" htmlFor={addr.id} style={{ cursor: 'pointer' }}>
                                            {addr.name && <strong className="d-block mb-1 fs-5">{addr.name}</strong>}
                                            <span className={addr.name ? "d-block mb-1" : "d-block mb-1 fw-bold"}>
                                                {getAddressLine(addr)}
                                            </span>
                                            <span className="text-muted">{addr.city}, {addr.state} - {addr.zipCode}</span>
                                            <div className="text-muted mt-1"><small>Phone: {addr.phone}</small></div>
                                        </label>
                                    </div>
                                ))}
                                <hr className="mt-4 border-secondary opacity-25" />
                            </div>
                        )}

                        {/* Always display the form right underneath */}
                        <form onSubmit={handleSaveAddress} className="border p-4 rounded bg-light">
                            <h5 className="mb-3">
                                {addresses.length === 0 ? 'Add a Delivery Address' : 'Or Add a New Delivery Address'}
                            </h5>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted mb-1">Full Name</label>
                                <input type="text" className="form-control" required
                                       placeholder="e.g. John Doe"
                                       value={newAddress.name}
                                       onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted mb-1">Street Address</label>
                                <input type="text" className="form-control" required
                                       placeholder="House No, Building, Street"
                                       value={newAddress.street}
                                       onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                />
                            </div>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted mb-1">City</label>
                                    <input type="text" className="form-control" required
                                           value={newAddress.city}
                                           onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted mb-1">State</label>
                                    <input type="text" className="form-control" required
                                           value={newAddress.state}
                                           onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted mb-1">Zip Code</label>
                                    <input type="text" className="form-control" required
                                           value={newAddress.zipCode}
                                           onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small fw-bold text-muted mb-1">Phone Number</label>
                                    <input type="text" className="form-control" required
                                           value={newAddress.phone}
                                           onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-outline-primary w-100" disabled={isSavingAddress}>
                                {isSavingAddress ? 'Saving...' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order & Coupon Summary */}
                <div className="col-md-5">
                    <div className="card p-4 shadow-sm h-100">
                        <h4 className="mb-4">2. Order Summary</h4>

                        <div className="d-flex justify-content-between mb-3 text-muted">
                            <span>Subtotal ({cartItems.length} items):</span>
                            <span>₹{cartTotal}</span>
                        </div>

                        <div className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleApplyCoupon}
                                disabled={!couponCode || cartItems.length === 0}
                            >
                                Apply
                            </button>
                        </div>

                        <div style={{ minHeight: '24px' }}>
                            {couponError && <small className="text-danger">{couponError}</small>}
                            {couponSuccess && <small className="text-success">{couponSuccess}</small>}
                        </div>

                        {discount > 0 && (
                            <div className="d-flex justify-content-between text-success mb-3 fw-bold">
                                <span>Discount Applied:</span>
                                <span>-₹{discount}</span>
                            </div>
                        )}

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between fw-bold fs-4 mb-4">
                            <span>Total Payable:</span>
                            <span>₹{finalTotal}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg w-100"
                            onClick={handleProceedToPay}
                            disabled={loading || cartItems.length === 0 || !selectedAddressId}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...</span>
                            ) : (
                                `Proceed to Pay ₹${finalTotal}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;