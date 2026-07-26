import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import Reusable Spinner Component
import { Spinner } from './components/Spinner';

// Import Global API Loading Context & Utility
import { ApiProvider } from './context/ApiContext';
import { apiFetch } from './context/apiFetch';

// Import Navigation Components
import Header from './components/navigation/Header';
import Navbar from './components/navigation/Navbar';

// Import Pages
import OverviewPage from './components/pages/OverviewPage';
import InventoryPage from './components/pages/InventoryPage';
import ProductsPage from './components/pages/ProductsPage';

import './App.css';

// Vite projects use import.meta.env, Create-React-App uses process.env
const BASE_DOMAIN = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const API_URL = `${BASE_DOMAIN}/api/products`;

// Auth Switch View (Login / Register Toggle)
function AuthView() {
    const [isSigningUp, setIsSigningUp] = useState(false);

    return isSigningUp ? (
        <SignUpForm onSwitchToLogin={() => setIsSigningUp(false)} />
    ) : (
        <LoginForm onSwitchToRegister={() => setIsSigningUp(true)} />
    );
}

// Main Dashboard Shell
function MainDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 1. Fetch products from Spring Boot Backend
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiFetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch products from backend server');
            }
            const data = await response.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            console.error('API Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            await fetchProducts();
        };
        loadProducts();
    }, [fetchProducts]);

    // 2. Add Product
    const handleAddProduct = async (newProduct) => {
        try {
            const response = await apiFetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                fetchProducts(); // Refresh list after creation
            }
        } catch (err) {
            console.error('Failed to add product:', err);
        }
    };

    // 3. Update Product
    const handleUpdateProduct = async (id, updatedProduct) => {
        try {
            const response = await apiFetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (response.ok) {
                fetchProducts(); // Refresh list after update
            }
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    };

    // 4. Delete Product
    const handleDeleteProduct = async (id) => {
        try {
            const response = await apiFetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts(); // Refresh list after deletion
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    if (loading) {
        return (
            <div className="inventory-container flex justify-center items-center min-h-[400px]">
                <Spinner text="Connecting to Spring Boot Backend..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="inventory-container text-center py-12">
                <p className="text-red-400 font-bold text-xl mb-2">Backend Connection Error</p>
                <p className="text-slate-400 text-sm mb-4">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="btn btn-primary"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="inventory-container">
            {/* Navigation Header & Bar */}
            <Header />
            <Navbar />

            {/* Dynamic Route-Based Page Rendering */}
            <Routes>
                <Route
                    path="/overview"
                    element={
                        <OverviewPage
                            products={products}
                            onNavigateToAdd={() => navigate('/inventory')}
                        />
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <InventoryPage
                            products={products}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onAddProduct={handleAddProduct}
                            onUpdateProduct={handleUpdateProduct}
                            onDeleteProduct={handleDeleteProduct}
                        />
                    }
                />

                <Route
                    path="/products"
                    element={<ProductsPage products={products} />}
                />

                {/* Redirect root URL "/" or unknown URLs to "/overview" */}
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <ApiProvider>
            <AuthProvider>
                <ProtectedRoute fallback={<AuthView />}>
                    <MainDashboard />
                </ProtectedRoute>
            </AuthProvider>
        </ApiProvider>
    );
}