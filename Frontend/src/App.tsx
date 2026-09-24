import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from "react-router-dom";

// Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { CategoriesIndex } from "./components/CategoriesIndex";
import { CategoryPage } from "./components/CategoriesPage";
import ProductDetail from "./components/ProductDetail";
import { getAllProducts } from "./services/productService";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import { Features } from "./components/Features";
import { FAQs } from "./components/FAQs";
import Account from "./components/Account";
import CartPage from "./components/CartPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Checkout from "./components/Checkout";
import AdminAddProduct from "./components/AminAddProduct";

// IMPORT CART & AUTH CONTEXTS
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// --- PROTECTED ROUTE GUARD ---
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-vh-100" />;
    if (!user || !user.roles.some((role) => ['Admin', 'Manager'].includes(role))) {
        return <Navigate to="/" replace />;
    }
    return children;
};

// --- PRODUCT DETAIL WRAPPER ---
function ProductDetailWrapper() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true); // Default to true on initial mount

    const { addToCart } = useCart();

    React.useEffect(() => {
        let isMounted = true;

        const loadProductData = async () => {
            // Only set loading to true if we are changing products and it isn't already loading
            if (!loading) setLoading(true);

            try {
                const all = await getAllProducts();
                if (isMounted) {
                    const found = all.find((p) => p.id === id);
                    setProduct(found || all[0]);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
                if (isMounted) setLoading(false);
            }
        };

        loadProductData();

        // Cleanup function prevents state updates on unmounted components
        return () => {
            isMounted = false;
        };
    }, [id]); // Only re-run if the product ID changes

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <ProductDetail
            product={product}
            onAddToCart={(productData: any, quantity: number) => {
                addToCart(productData, quantity);
                alert(`${quantity}x ${productData.name} added to your cart!`);
            }}
        />
    );
}

// --- MAIN APP COMPONENT ---
export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="d-flex flex-column min-vh-100 bg-light">
                        <Navbar />

                        <main className="flex-grow-1">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shopcategory" element={<CategoryPage />} />
                                <Route path="/categories" element={<CategoriesIndex />} />
                                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                                <Route path="/product/:id" element={<ProductDetailWrapper />} />
                                <Route path="/about" element={<AboutUs />} />
                                <Route path="/contact" element={<ContactUs />} />
                                <Route path="/features" element={<Features />} />
                                <Route path="/faqs" element={<FAQs />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/login" element={<LoginPage />} />

                                {/* --- PROTECTED ROUTES --- */}
                                <Route
                                    path="/account"
                                    element={
                                        <ProtectedRoute>
                                            <Account />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute>
                                            <Checkout />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <AdminRoute>
                                            <AdminAddProduct />
                                        </AdminRoute>
                                    }
                                />
                            </Routes>
                        </main>

                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}