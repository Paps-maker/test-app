import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="dashboard-nav" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
            <NavLink
                to="/overview"
                className={({ isActive }) => `btn-link ${isActive ? 'active' : ''}`}
            >
                📊 Overview
            </NavLink>

            <NavLink
                to="/inventory"
                className={({ isActive }) => `btn-link ${isActive ? 'active' : ''}`}
            >
                📋 Inventory List
            </NavLink>

            <NavLink
                to="/products"
                className={({ isActive }) => `btn-link ${isActive ? 'active' : ''}`}
            >
                🏷️ Products View
            </NavLink>
        </nav>
    );
}