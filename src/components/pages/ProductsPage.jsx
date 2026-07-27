import { useState } from 'react';

export default function ProductsPage({ products = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories safely
    const categories = [
        'All',
        ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    // Filter products based on search term and category
    const filteredProducts = products.filter((p) => {
        const name = p.name || '';
        const sku = p.sku || '';
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'All' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto flex-1 max-w-md px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
                <table className="w-full text-left min-w-[640px] border-collapse">
                    <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Qty</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                            const price = p.unitPrice ?? p.price ?? 0;
                            const stock = p.stockQty ?? p.quantity ?? 0;
                            const reorder = p.reorderLevel ?? 5;
                            const isLowStock = stock <= reorder;

                            return (
                                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-400">{p.sku}</td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-100">{p.name}</td>
                                    <td className="px-5 py-4 text-sm">
                                            <span className="inline-block px-2.5 py-1 text-xs text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded">
                                                {p.category || 'General'}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-100">
                                        KSh {Number(price).toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-100">{stock}</td>
                                    <td className="px-5 py-4 text-sm">
                                            <span
                                                className={`inline-block px-2.5 py-1 text-xs font-semibold rounded ${
                                                    isLowStock
                                                        ? 'text-red-300 bg-red-500/20 border border-red-500/30'
                                                        : 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30'
                                                }`}
                                            >
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-slate-400 py-12 text-sm">
                                No products found matching your criteria.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}