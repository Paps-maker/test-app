import { useState } from 'react';

export default function InventoryPage({ products, setProducts, searchTerm, setSearchTerm }) {
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
            ...product,
            price: product.price ?? '',
            quantity: product.quantity ?? '',
            reorderLevel: product.reorderLevel ?? 5,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        if (!formData.name || formData.price === '') return;

        const parsedProduct = {
            ...formData,
            price: Number(formData.price) || 0,
            quantity: Number(formData.quantity) || 0,
            reorderLevel: Number(formData.reorderLevel) || 0,
        };

        if (editingProduct) {
            setProducts(
                products.map((p) => (p.id === editingProduct.id ? { ...parsedProduct, id: p.id } : p))
            );
        } else {
            const newEntry = {
                ...parsedProduct,
                id: Date.now(),
            };
            setProducts([...products, newEntry]);
        }
        closeModal();
    };

    const handleRestock = (id) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, quantity: (Number(p.quantity) || 0) + 5 } : p)));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter((p) => p.id !== id));
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
        <>
            <div
                className="inventory-toolbar"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                }}
            >
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by SKU, Name, or Category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: '1',
                        maxWidth: '400px',
                        padding: '0.6rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--card-bg)',
                        color: 'inherit',
                    }}
                />
                <button className="btn btn-primary" onClick={openAdd}>
                    + Add Product
                </button>
            </div>

            <div className="table-responsive">
                <table className="inventory-table">
                    <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Unit Price</th>
                        <th>Stock Qty</th>
                        <th>Reorder Level</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => {
                            const isLowStock = item.quantity <= item.reorderLevel;
                            return (
                                <tr key={item.id}>
                                    <td className="sku-cell">{item.sku}</td>
                                    <td className="name-cell">{item.name}</td>
                                    <td>
                                        <span className="category-tag">{item.category || 'General'}</span>
                                    </td>
                                    <td>
                                        KSh {Number(item.price || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td>
                      <span className={`qty-badge ${isLowStock ? 'low-stock' : 'normal-stock'}`}>
                        {item.quantity} {isLowStock && '(Low Stock)'}
                      </span>
                                    </td>
                                    <td>{item.reorderLevel}</td>
                                    <td className="actions-cell" style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-icon"
                                            title="Edit Item"
                                            onClick={() => openEdit(item)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn-icon"
                                            title="Restock (+5)"
                                            onClick={() => handleRestock(item.id)}
                                        >
                                            📦 Restock
                                        </button>
                                        <button
                                            className="btn-icon delete"
                                            title="Delete Item"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data" style={{ textAlign: 'center', padding: '2rem' }}>
                                No products found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSaveProduct}>
                            <div className="form-group">
                                <label>SKU</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. DAP Fertilizer 50kg"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Unit Price (KSh)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Qty</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Reorder Level</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        value={formData.reorderLevel}
                                        onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}