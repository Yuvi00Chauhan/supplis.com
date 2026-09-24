import React, { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap';
import { useCart } from '../context/CartContext'; // 1. Import Cart Context

const SUPABASE_BASE_URL =
    import.meta.env.VITE_SUPABASE_URL || 'https://hboaizlxmcqlsefqqygi.supabase.co';

// Banner Carousel Images
const BANNER_IMAGES = [
    `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/bnr_4592669_o.webp`,
    `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/bnr_4592663_o.webp`,
    `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/bnr_4592665_o.webp`,
    `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/bnr_4592705_o.webp`,
    `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/bnr_4592667_o.webp`,
];

// Tiered Coupon Codes
const COUPONS = [
    { minSpend: '₹1,500', discount: '5% OFF', code: 'SUPLIS1500', badgeClass: 'bg-primary' },
    { minSpend: '₹2,500', discount: '10% OFF', code: 'SUPLIS2500', badgeClass: 'bg-success' },
    { minSpend: '₹3,500', discount: '15% OFF', code: 'SUPLIS3500', badgeClass: 'bg-warning text-dark' },
    { minSpend: '₹5,000', discount: '20% OFF', code: 'SUPLIS5000', badgeClass: 'bg-danger' },
];

// Featured Products with normalized data structure
const FEATURED_PRODUCTS = [
    {
        id: 'prod_creat_001',
        name: 'MB Micronized Creatine Monohydrate',
        priceInr: 1299,
        category: 'Creatine',
        imageUrl: `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/creatine.jpg`
    },
    {
        id: 'prod_pre_002',
        name: 'WrathX Pre-Workout Intense Formula',
        priceInr: 1500,
        category: 'Pre-Workout',
        imageUrl: `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/pre.jpg`
    },
    {
        id: 'prod_prot_003',
        name: '100% Whey Protein Isolate 2kg',
        priceInr: 5000,
        category: 'Proteins',
        imageUrl: `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/protein.jpg`
    },
    {
        id: 'prod_vita_004',
        name: 'Daily Multivitamin & Mineral Complex',
        priceInr: 700,
        category: 'Vitamins',
        imageUrl: `${SUPABASE_BASE_URL}/storage/v1/object/public/Supplies/HomePage/multivita.jpg`
    },
];

export const HomePage: React.FC = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // 2. Consume addToCart from CartContext
    const { addToCart } = useCart();

    useEffect(() => {
        const element = document.getElementById('carouselExampleAutoplaying');
        if (element) {
            const carousel = new bootstrap.Carousel(element, {
                interval: 3000,
                ride: 'carousel',
                touch: true,
            });

            return () => {
                carousel.dispose();
            };
        }
    }, []);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // 3. Handler to add product to cart
    const handleAddToCart = (product: typeof FEATURED_PRODUCTS[0]) => {
        addToCart(
            {
                id: product.id,
                name: product.name,
                priceInr: product.priceInr,
                imageUrl: product.imageUrl,
            },
            1
        );
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="bg-light">
            {/* 1. Hero Carousel */}
            <div
                id="carouselExampleAutoplaying"
                className="carousel slide"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    {BANNER_IMAGES.map((src, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? 'active' : ''}`}
                        >
                            <img
                                src={src}
                                className="d-block w-100"
                                alt={`Banner ${index + 1}`}
                                style={{ maxHeight: '450px', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                </button>

                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleAutoplaying"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* 2. Tiered Discount Coupons Section */}
            <section className="bg-dark text-white py-4 shadow-sm">
                <div className="container">
                    <div className="text-center mb-3">
                        <h4 className="fw-bold mb-1 text-warning">🏷️ Cart Value Discounts</h4>
                        <p className="text-secondary small m-0">Apply these codes at checkout to unlock instant extra savings!</p>
                    </div>

                    <div className="row g-3">
                        {COUPONS.map((coupon, idx) => (
                            <div key={idx} className="col-12 col-sm-6 col-md-3">
                                <div className="card bg-secondary-subtle border-0 h-100 text-center p-3 rounded-3 shadow-sm d-flex flex-column justify-content-between">
                                    <div>
                                        <span className={`badge ${coupon.badgeClass} mb-2 px-3 py-1 fw-bold`}>
                                            Spend {coupon.minSpend}
                                        </span>
                                        <h3 className="fw-bold text-dark my-1">{coupon.discount}</h3>
                                    </div>

                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleCopy(coupon.code)}
                                            className="btn btn-outline-dark btn-sm w-100 fw-bold text-uppercase"
                                        >
                                            {copiedCode === coupon.code ? '✓ COPIED!' : `CODE: ${coupon.code}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Trust Badges Bar */}
            <div className="bg-white py-3 shadow-sm border-bottom">
                <div className="container">
                    <div className="row text-center gy-2">
                        <div className="col-md-3 col-6">
                            <span className="fw-bold text-warning me-2">✔</span> 100% Authentic
                        </div>
                        <div className="col-md-3 col-6">
                            <span className="fw-bold text-warning me-2">🚀</span> Express Shipping
                        </div>
                        <div className="col-md-3 col-6">
                            <span className="fw-bold text-warning me-2">🛡️</span> Secure Payments
                        </div>
                        <div className="col-md-3 col-6">
                            <span className="fw-bold text-warning me-2">🔄</span> Easy Returns
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Trending Products Section */}
            <section className="container my-5 pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold m-0">Trending Products</h3>
                    <a href="/categories" className="text-warning text-decoration-none fw-bold">
                        View All →
                    </a>
                </div>

                <div className="row g-4">
                    {FEATURED_PRODUCTS.map((product) => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-3">
                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                                <div
                                    className="bg-white d-flex align-items-center justify-content-center p-3"
                                    style={{ height: '220px' }}
                                >
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Product+Image';
                                        }}
                                    />
                                </div>

                                <div className="card-body d-flex flex-column justify-content-between bg-white border-top">
                                    <div>
                                        <span className="badge bg-light text-dark border mb-2">
                                            {product.category}
                                        </span>
                                        <h6 className="card-title fw-semibold text-truncate" title={product.name}>
                                            {product.name}
                                        </h6>
                                    </div>

                                    <div className="mt-3 d-flex align-items-center justify-content-between">
                                        <span className="fw-bold fs-5 text-dark">₹{product.priceInr.toLocaleString('en-IN')}</span>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="btn btn-warning btn-sm fw-bold"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;