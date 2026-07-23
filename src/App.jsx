import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import Navigation Components
import Header from './components/navigation/Header';
import Navbar from './components/navigation/Navbar';

// Import Pages
import OverviewPage from './components/pages/OverviewPage';
import InventoryPage from './components/pages/InventoryPage';
import ProductsPage from './components/pages/ProductsPage';

// Import Seed Data
import { initialProducts } from './data/products';

import './App.css';

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
  const navigate = useNavigate();

  // 1. Read stored products from LocalStorage on initial load
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('agrovet_products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch (err) {
        console.error('Failed to parse saved products from localStorage:', err);
      }
    }
    return initialProducts;
  });

  // 2. Automatically save changes to LocalStorage whenever products update
  useEffect(() => {
    localStorage.setItem('agrovet_products', JSON.stringify(products));
  }, [products]);

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
                    setProducts={setProducts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
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
      <AuthProvider>
        <ProtectedRoute fallback={<AuthView />}>
          <MainDashboard />
        </ProtectedRoute>
      </AuthProvider>
  );
}