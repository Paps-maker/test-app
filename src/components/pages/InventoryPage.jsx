import { useState } from 'react';

export default function InventoryPage({
                                          products = [],
                                          searchTerm,
                                          setSearchTerm,
                                          onAddProduct,
                                          onUpdateProduct,
                                          onDeleteProduct,
                                      }) {
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: 'Fertilizers',
        price: '',
        quantity: '',
        reorderLevel: 5,
    });

    const openAdd = () => {
        setEditingProduct(null);
        setFormData({
            sku: 'AGRO-' + Math.floor(1000 + Math.random() * 9000),
            name: '',
            category: 'Fertilizers',
            price: '',
            quantity: 1,
            reorderLevel: 5,
        });
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku || '',
            name: product.name || '',
            category: product.category || 'General',
            price: product.unitPrice ?? product.price ?? '',
            quantity: product.stockQty ?? product.quantity ?? '',
            reorderLevel: product.reorderLevel ?? 5,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        if (!formData.name || formData.price === '') return;

        const payload = {
            sku: formData.sku,
            name: formData.name,
            category: formData.category,
            price: Number(formData.price) || 0,
            unitPrice: Number(formData.price) || 0,
            quantity: Number(formData.quantity) || 0,
            stockQty: Number(formData.quantity) || 0,
            reorderLevel: Number(formData.reorderLevel) || 0,
        };

        if (editingProduct) {
            await onUpdateProduct(editingProduct.id, payload);
        } else {
            await onAddProduct(payload);
        }
        closeModal();
    };

    const handleRestock = async (item) => {
        const currentQty = Number(item.stockQty ?? item.quantity ?? 0);
        const updatedQty = currentQty + 5;

        const payload = {
            ...item,
            quantity: updatedQty,
            stockQty: updatedQty,
            unitPrice: item.unitPrice ?? item.price ?? 0,
        };

        await onUpdateProduct(item.id, payload);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await onDeleteProduct(id);
        }
    };

    const filteredProducts = products.filter((p) => {
        const term = (searchTerm || '').toLowerCase();
        const nameMatch = (p.name || '').toLowerCase().includes(term);
        const skuMatch = (p.sku || '').toLowerCase().includes(term);
        const catMatch = (p.category || '').toLowerCase().includes(term);
        return nameMatch || skuMatch || catMatch;
    });

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <input
                    type="text"
                    className="w-full sm:w-auto flex-1 max-w-md px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Search by SKU, Name, or Category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    onClick={openAdd}
                >
                    + Add Product
                </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl shadow-lg">
                <table className="w-full text-left min-w-[720px] border-collapse">
                    <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/50">
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Name</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit Price</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Qty</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reorder Level</th>
                        <th className="px-5 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => {
                            const qty = item.stockQty ?? item.quantity ?? 0;
                            const price = item.unitPrice ?? item.price ?? 0;
                            const reorder = item.reorderLevel ?? 5;
                            const isLowStock = qty <= reorder;

                            return (
                                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-400">{item.sku}</td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-100">{item.name}</td>
                                    <td className="px-5 py-4 text-sm">
                                            <span className="inline-block px-2.5 py-1 text-xs text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded">
                                                {item.category || 'General'}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-slate-100">
                                        KSh {Number(price).toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                            <span
                                                className={`inline-block px-2.5 py-1 text-xs font-semibold rounded ${
                                                    isLowStock
                                                        ? 'text-red-300 bg-red-500/20 border border-red-500/30'
                                                        : 'text-slate-100'
                                                }`}
                                            >
                                                {qty} {isLowStock && '(Low Stock)'}
                                            </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{reorder}</td>
                                    <td className="px-5 py-4 text-sm text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/60 text-slate-200 text-xs font-medium rounded transition-colors"
                                                title="Edit Item"
                                                onClick={() => openEdit(item)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/60 text-slate-200 text-xs font-medium rounded transition-colors"
                                                title="Restock (+5)"
                                                onClick={() => handleRestock(item)}
                                            >
                                                📦 Restock
                                            </button>
                                            <button
                                                className="px-2.5 py-1.5 bg-slate-700/50 hover:bg-red-600 hover:border-red-600 border border-slate-600/60 text-slate-200 hover:text-white text-xs font-medium rounded transition-colors"
                                                title="Delete Item"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-slate-400 py-12 text-sm">
                                No products found matching your search criteria.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Product Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-xl p-6 sm:p-8 shadow-2xl">
                        <h2 className="text-xl font-bold text-slate-100 mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400">SKU</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.sku}
                                    onChange={(e) =>
                                        setFormData({ ...formData, sku: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. DAP Fertilizer 50kg"
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-slate-400">Category</label>
                                <select
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                >
                                    <option value="Fertilizers">Fertilizers</option>
                                    <option value="Seeds">Seeds</option>
                                    <option value="Pesticides">Pesticides / Fungicides</option>
                                    <option value="Animal Feeds">Animal Feeds & Supplements</option>
                                    <option value="Veterinary">Veterinary Care</option>
                                    <option value="Hardware">Tools & Hardware</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-slate-400">Unit Price (KSh)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-slate-400">Stock Qty</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.quantity}
                                        onChange={(e) =>
                                            setFormData({ ...formData, quantity: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-slate-400">Reorder Level</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={formData.reorderLevel}
                                        onChange={(e) =>
                                            setFormData({ ...formData, reorderLevel: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    className="px-5 py-2.5 bg-transparent border border-slate-700 hover:bg-slate-700/50 text-slate-200 font-semibold text-sm rounded-lg transition-colors"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow transition-colors"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}