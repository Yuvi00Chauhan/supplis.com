import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../css/navbar.css";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    // Pull the real cart count from our global context
    const { cartItemCount } = useCart();
    const { user, isAuthenticated } = useAuth();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/ProductListing?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleAccountClick = (e: React.MouseEvent) => {
        setIsMobileMenuOpen(false);
        if (!isAuthenticated) {
            e.preventDefault();
            navigate('/login', { state: { from: { pathname: '/account' } } });
        }
    };

    return (
        <nav className="navbar">
            <div className="container-fluid d-flex align-items-center">
                {/* Brand Logo */}
                <NavLink id="navLogo" className="navbar-brand" to="/">
                    Suplis.com
                </NavLink>

                {/* Mobile Hamburger Toggle Button (Added ms-auto here to push it right) */}
                <div
                    className={`hamburger ms-auto ${isMobileMenuOpen ? "active" : ""}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation menu"
                >
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>

                {/* Navigation Links */}
                <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
                    <li className="navlink">
                        <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                            Home
                        </NavLink>
                    </li>
                    <li className="navlink">
                        <NavLink to="/categories" onClick={() => setIsMobileMenuOpen(false)}>
                            Categories
                        </NavLink>
                    </li>
                    <li className="navlink about">
                        <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                            About Us
                        </NavLink>
                    </li>
                    <li className="navlink">
                        <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                            Contact Us
                        </NavLink>
                    </li>
                    <li className="navlink" id="user">
                        {isAuthenticated && user ? (
                            <NavLink to="/account" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className="d-inline-flex align-items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                    </svg>
                                    {user.firstName || user.name || user.username}
                                </span>
                            </NavLink>
                        ) : (
                            <NavLink to="/login" state={{ from: { pathname: '/account' } }} onClick={handleAccountClick}>
                                Account
                            </NavLink>
                        )}
                    </li>
                </ul>

                {/* RIGHT SIDE: Search Bar & Desktop Cart
                    Added d-none d-md-flex to this wrapper so it completely vanishes on mobile! */}
                <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search supplements..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>

                    {/* Desktop Cart Link */}
                    <NavLink
                        to="/cart"
                        className="desktop-cart-link d-flex align-items-center text-white text-decoration-none hover-orange"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {/* Cart SVG Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                        Cart
                        {cartItemCount > 0 && (
                            <span className="ms-2 badge bg-warning text-dark rounded-pill">
                                {cartItemCount}
                            </span>
                        )}
                    </NavLink>
                </div>
            </div>

            {/* FLOATING MOBILE CART - Forced Inline Styles to guarantee position */}
            <div
                className="d-md-none"
                style={{
                    position: 'fixed',
                    bottom: '25px',
                    right: '25px',
                    zIndex: 9999
                }}
            >
                <NavLink
                    to="/cart"
                    className="shadow d-flex align-items-center justify-content-center"
                    style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ff9900', // Suplis Orange
                        borderRadius: '50%',
                        textDecoration: 'none',
                        position: 'relative'
                    }}
                >
                    {/* Dark Cart Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="black" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>

                    {/* Notification Badge */}
                    {cartItemCount > 0 && (
                        <span
                            className="badge bg-danger rounded-pill position-absolute"
                            style={{
                                top: '-4px',
                                right: '-4px',
                                fontSize: '12px',
                                border: '2px solid white'
                            }}
                        >
                            {cartItemCount}
                        </span>
                    )}
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;