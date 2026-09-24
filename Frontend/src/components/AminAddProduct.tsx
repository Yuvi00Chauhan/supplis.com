import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

export const AdminAddProduct: React.FC = () => {
    const { token, user } = useAuth();
    const productFormRef = useRef<HTMLDivElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [productMessage, setProductMessage] = useState('');
    const [isCouponSubmitting, setIsCouponSubmitting] = useState(false);
    const [couponMessage, setCouponMessage] = useState('');
    const [coupon, setCoupon] = useState({
        code: '',
        type: 'flat',
        value: '',
        minCartValue: '',
        expiryDate: '',
    });

    // State to hold the actual image file
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'Proteins',
        mrpInr: '',
        priceInr: '',
        description: ''
    });
    const [nutritionFacts, setNutritionFacts] = useState({
        servingSizeGrams: '',
        calories: '',
        proteinGrams: '',
        carbsGrams: '',
        fatGrams: '',
        bcaaGrams: '',
        eaaGrams: '',
    });
    const endpointMap: Record<string, string> = {
        Proteins: 'protein-products',
        'Pre-Workout': 'pre-workout-products',
        Creatine: 'creatine-products',
        Aminos: 'amino-products',
        Hydration: 'salt-products',
        Multivitamins: 'multivitamin-products',
        'Omega-3': 'omega-products',
        Vitamins: 'single-vitamin-products',
        'D3-K2': 'single-vitamin-products',
        'Weight Management': 'weight-management-products',
    };

    const loadProducts = async () => {
        if (!token) return;
        const endpointCategories = new Map<string, string[]>();
        Object.entries(endpointMap).forEach(([category, endpoint]) => {
            endpointCategories.set(endpoint, [...(endpointCategories.get(endpoint) || []), category]);
        });
        const results = await Promise.all(
            Array.from(endpointCategories.entries()).map(async ([endpoint, categories]) => {
                const response = await fetch(`http://localhost:3000/${endpoint}`);
                if (!response.ok) return [];
                const data = await response.json();
                return data.map((product: any) => {
                    let category = categories[0];
                    if (endpoint === 'single-vitamin-products') {
                        const searchable = `${product.name || ''} ${product.description || ''}`.toLowerCase();
                        category = searchable.includes('d3') || searchable.includes('k2') ? 'D3-K2' : 'Vitamins';
                    }
                    return {...product, adminCategory: category, endpoint};
                });
            }),
        );
        setProducts(results.flat());
    };

    useEffect(() => {
        void loadProducts();
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleAddCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !user?.roles.includes('Admin')) {
            setCouponMessage('Only an Admin can create coupon codes.');
            return;
        }
        setIsCouponSubmitting(true);
        setCouponMessage('');
        try {
            const expiryDate = coupon.expiryDate
                ? new Date(coupon.expiryDate).toISOString()
                : undefined;
            const response = await fetch('http://localhost:3001/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    code: coupon.code,
                    type: coupon.type,
                    value: Number(coupon.value),
                    minCartValue: coupon.minCartValue ? Number(coupon.minCartValue) : undefined,
                    expiryDate,
                }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = data.error?.message || data.message || data.error || 'Coupon could not be created.';
                throw new Error(typeof message === 'string' ? message : 'Coupon could not be created.');
            }
            setCouponMessage(`Coupon ${data.code} created successfully.`);
            setCoupon({ code: '', type: 'flat', value: '', minCartValue: '', expiryDate: '' });
        } catch (error) {
            setCouponMessage(error instanceof Error ? error.message : 'Coupon could not be created.');
        } finally {
            setIsCouponSubmitting(false);
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !user?.roles.some((role) => ['Admin', 'Manager'].includes(role))) {
            alert('You do not have permission to add products.');
            return;
        }
        if (!imageFile && !editingProductId) {
            alert("Please select a product image first!");
            return;
        }

        setIsSubmitting(true);

        try {
            let finalImageUrl = editingProductId
                ? products.find((product) => product.id === editingProductId)?.imageUrl
                : undefined;

            // --- 1. UPLOAD IMAGE TO SUPABASE STORAGE ---
            if (imageFile) {
            // Create a unique file name to prevent overwriting
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Map the form category to your exact Supabase folder names!
            let folderName = 'Proteins'; // Default fallback
            if (formData.category === 'Proteins') folderName = 'Proteins';
            if (formData.category === 'Pre-Workout') folderName = 'Preworkout';
            if (formData.category === 'Creatine') folderName = 'Creatines';
            if (formData.category === 'Aminos') folderName = 'Aminos';
            if (formData.category === 'Hydration') folderName = 'Hydration';
            if (formData.category === 'Multivitamins') folderName = 'Multivitamins';
            if (formData.category === 'Omega-3') folderName = 'Omega3';
            if (formData.category === 'Vitamins' || formData.category === 'D3-K2') folderName = 'Vitamins';
            if (formData.category === 'Weight Management') folderName = 'WeightManagement';

            // Create the dynamic file path based on the selected category
            const filePath = `${folderName}/${fileName}`;

            // Upload the file to your 'Supplies' bucket
            const { error: uploadError } = await supabase.storage
                .from('Supplies')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            // --- 2. GET THE PUBLIC URL ---
            const { data: urlData } = supabase.storage
                .from('Supplies')
                .getPublicUrl(filePath);

            finalImageUrl = urlData.publicUrl;
            }

            // --- 3. SAVE TO DATABASE ---
            const categoryIdMap: Record<string, string> = {
                Proteins: 'cat_prot',
                'Pre-Workout': 'cat_pw',
                Creatine: 'cat_crt',
                Aminos: 'cat_amino',
                Hydration: 'cat_salt',
                Multivitamins: 'cat_multi',
                'Omega-3': 'cat_omg',
                Vitamins: 'cat_vit',
                'D3-K2': 'cat_vit',
                'Weight Management': 'cat_wm',
            };
            const newProduct = {
                ...(editingProductId ? { id: editingProductId } : { id: `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }),
                name: formData.name,
                brand: formData.brand,
                categoryId: categoryIdMap[formData.category],
                mrpInr: Number(formData.mrpInr),
                priceInr: Number(formData.priceInr),
                description: formData.description,
                ...(finalImageUrl ? { imageUrl: finalImageUrl } : {}),
                nutritionFacts: Object.fromEntries(
                    Object.entries(nutritionFacts)
                        .filter(([, value]) => value !== '')
                        .map(([key, value]) => [key, Number(value)]),
                ),
            };

            const endpoint = endpointMap[formData.category];
            const response = await fetch(`http://localhost:3000/${endpoint}${editingProductId ? `/${editingProductId}` : ''}`, {
                method: editingProductId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const message = data.error?.message || data.message || data.error || 'Product could not be saved.';
                throw new Error(typeof message === 'string' ? message : 'Product could not be saved.');
            }

            alert(editingProductId ? `${formData.name} updated successfully.` : `Success! ${formData.name} added.`);

            // Reset form
            setFormData({ name: '', brand: '', category: 'Proteins', mrpInr: '', priceInr: '', description: '' });
            setNutritionFacts({
                servingSizeGrams: '',
                calories: '',
                proteinGrams: '',
                carbsGrams: '',
                fatGrams: '',
                bcaaGrams: '',
                eaaGrams: '',
            });
            setImageFile(null);
            setEditingProductId(null);
            await loadProducts();

            // Reset the file input visually in the DOM
            const fileInput = document.getElementById('productImage') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error: any) {
            console.error("Error uploading product:", error);
            alert("Error: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <div className="row justify-content-center align-items-stretch">
                    <div className="col-md-10 col-lg-8 order-1" ref={productFormRef}>
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-dark text-white p-4 border-0 rounded-top-4 d-flex justify-content-between align-items-center">
                                <h4 className="mb-0 fw-bold">Admin Panel</h4>
                                <span className="badge bg-warning text-dark">Add Product</span>
                            </div>

                            <div className="card-body p-4">
                                <form onSubmit={handleAddProduct}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                            className="form-control bg-light"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Product Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-control bg-light"
                                            placeholder="e.g. 100% Whey Protein Isolate"
                                            required={!editingProductId}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Category</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="form-select bg-light"
                                            disabled={!!editingProductId}
                                            required
                                        >
                                            <option value="Proteins">Proteins</option>
                                            <option value="Pre-Workout">Pre-Workout</option>
                                            <option value="Creatine">Creatine</option>
                                            <option value="Aminos">Aminos</option>
                                            <option value="Hydration">Hydration</option>
                                            <option value="Multivitamins">Multivitamins</option>
                                            <option value="Omega-3">Omega-3</option>
                                            <option value="Vitamins">Vitamins</option>
                                            <option value="D3-K2">D3-K2</option>
                                            <option value="Weight Management">Weight Management</option>
                                        </select>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">MRP (₹)</label>
                                            <input
                                                type="number"
                                                name="mrpInr"
                                                value={formData.mrpInr}
                                                onChange={handleInputChange}
                                                className="form-control bg-light"
                                                placeholder="e.g. 2999"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Selling Price (₹)</label>
                                            <input
                                                type="number"
                                                name="priceInr"
                                                value={formData.priceInr}
                                                onChange={handleInputChange}
                                                className="form-control bg-light"
                                                placeholder="e.g. 2199"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* File Upload Input */}
                                    <div className="mb-3 border p-3 rounded bg-light">
                                        <label className="form-label fw-bold">Upload Product Image</label>
                                        <input
                                            id="productImage"
                                            type="file"
                                            accept="image/png, image/jpeg, image/webp"
                                            onChange={handleFileChange}
                                            className="form-control"
                                            required={!editingProductId}
                                        />
                                        <small className="text-muted d-block mt-2">Recommended: Square image, max 2MB. Image will be sorted into category folders automatically.</small>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="form-control bg-light"
                                            rows={4}
                                            placeholder="Enter product details and benefits..."
                                            required
                                        />
                                    </div>

                                    <div className="mb-4 border p-3 rounded bg-light">
                                        <label className="form-label fw-bold">Nutrition Facts (optional)</label>
                                        <div className="row g-3">
                                            {[
                                                ['servingSizeGrams', 'Serving size (g)'],
                                                ['calories', 'Calories'],
                                                ['proteinGrams', 'Protein (g)'],
                                                ['carbsGrams', 'Carbohydrates (g)'],
                                                ['fatGrams', 'Fat (g)'],
                                                ['bcaaGrams', 'BCAA (g)'],
                                                ['eaaGrams', 'EAA (g)'],
                                            ].map(([name, label]) => (
                                                <div className="col-md-6" key={name}>
                                                    <label className="form-label">{label}</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        name={name}
                                                        value={nutritionFacts[name as keyof typeof nutritionFacts]}
                                                        onChange={(e) => setNutritionFacts((previous) => ({ ...previous, [name]: e.target.value }))}
                                                        className="form-control bg-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-warning w-100 fw-bold py-3"
                                        style={{ backgroundColor: '#ff9900', border: 'none' }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading to Supabase...
                                            </>
                                        ) : (
                                            editingProductId ? 'Update Product' : 'Add Product to Store'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-4 order-3">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-header bg-dark text-white p-4 rounded-top-4">
                                <h4 className="mb-0 fw-bold">Manage Products</h4>
                            </div>
                            <div className="card-body p-4">
                                {productMessage && <div className="alert alert-info">{productMessage}</div>}
                                <div className="btn-group flex-wrap mb-3" role="group" aria-label="Filter products by category">
                                    {['All', ...Object.keys(endpointMap)].map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            className={`btn ${selectedCategory === category ? 'btn-dark' : 'btn-outline-dark'}`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead><tr><th>Product</th><th>Category</th><th>Price</th><th className="text-end">Actions</th></tr></thead>
                                        <tbody>
                                            {products
                                                .filter((product) => selectedCategory === 'All' || product.adminCategory === selectedCategory)
                                                .map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.name}</td>
                                                    <td>{product.adminCategory}</td>
                                                    <td>₹{product.priceInr ?? '-'}</td>
                                                    <td className="text-end">
                                                        <button type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => {
                                                            setEditingProductId(product.id);
                                                            setFormData({ name: product.name || '', brand: product.brand || '', category: product.adminCategory, mrpInr: String(product.mrpInr || ''), priceInr: String(product.priceInr || ''), description: product.description || '' });
                                                            setNutritionFacts(product.nutritionFacts || { servingSizeGrams: '', calories: '', proteinGrams: '', carbsGrams: '', fatGrams: '', bcaaGrams: '', eaaGrams: '' });
                                                            productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        }}>Edit</button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={async () => {
                                                            if (!window.confirm(`Delete ${product.name}?`)) return;
                                                            const response = await fetch(`http://localhost:3000/${product.endpoint}/${product.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                                            if (!response.ok) { setProductMessage('Product could not be deleted.'); return; }
                                                            setProducts((current) => current.filter((item) => item.id !== product.id));
                                                        }}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="col-md-10 col-lg-8 order-2 mt-4">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-dark text-white p-3 border-0 rounded-top-4">
                                    <h4 className="mb-0 fw-bold">Create Coupon</h4>
                                    <small>Admin access only</small>
                                </div>
                                <div className="card-body p-3">
                                    <form onSubmit={handleAddCoupon}>
                                        <input className="form-control mb-2" placeholder="Coupon code" value={coupon.code} onChange={(e) => setCoupon({ ...coupon, code: e.target.value.toUpperCase() })} required />
                                        <div className="row g-2 mb-2">
                                            <div className="col-6">
                                                <select className="form-select" value={coupon.type} onChange={(e) => setCoupon({ ...coupon, type: e.target.value })}>
                                                    <option value="flat">Flat ₹</option>
                                                    <option value="percentage">Percentage %</option>
                                                </select>
                                            </div>
                                            <div className="col-6">
                                                <input type="number" min="0" className="form-control" placeholder="Discount value" value={coupon.value} onChange={(e) => setCoupon({ ...coupon, value: e.target.value })} required />
                                            </div>
                                        </div>
                                        <input type="number" min="0" className="form-control mb-2" placeholder="Minimum cart value (optional)" value={coupon.minCartValue} onChange={(e) => setCoupon({ ...coupon, minCartValue: e.target.value })} />
                                        <input type="datetime-local" className="form-control mb-2" value={coupon.expiryDate} onChange={(e) => setCoupon({ ...coupon, expiryDate: e.target.value })} />
                                        {couponMessage && <div className="alert alert-info py-2">{couponMessage}</div>}
                                        <button type="submit" disabled={isCouponSubmitting} className="btn btn-warning w-100 fw-bold py-2">
                                            {isCouponSubmitting ? 'Creating...' : 'Create Coupon'}
                                        </button>
                                    </form>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAddProduct;