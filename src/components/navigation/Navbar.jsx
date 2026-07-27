import { NavLink } from 'react-router-dom';

export default function Navbar() {
    const linkClasses = ({ isActive }) =>
        `px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            isActive
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`;

    return (
        <nav className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-3 overflow-x-auto">
            <NavLink to="/overview" className={linkClasses}>
                📊 Overview
            </NavLink>

            <NavLink to="/inventory" className={linkClasses}>
                📋 Inventory List
            </NavLink>

            <NavLink to="/products" className={linkClasses}>
                🏷️ Products View
            </NavLink>
        </nav>
    );
}