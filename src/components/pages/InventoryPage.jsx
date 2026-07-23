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
        <div className="inventory-container">
            {/* Toolbar */}
            <div className="inventory-toolbar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by SKU, Name, or Category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={openAdd}>
                    + Add Product
                </button>
            </div>

            {/* Table Container */}
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
                            const qty = item.stockQty ?? item.quantity ?? 0;
                            const price = item.unitPrice ?? item.price ?? 0;
                            const reorder = item.reorderLevel ?? 5;
                            const isLowStock = qty <= reorder;

                            return (
                                <tr key={item.id}>
                                    <td className="sku-cell">{item.sku}</td>
                                    <td className="name-cell">{item.name}</td>
                                    <td>
                      <span className="category-tag">
                        {item.category || 'General'}
                      </span>
                                    </td>
                                    <td className="name-cell">
                                        KSh {Number(price).toFixed(2)}
                                    </td>
                                    <td>
                      <span
                          className={`qty-badge ${
                              isLowStock ? 'low-stock' : 'normal-stock'
                          }`}
                      >
                        {qty} {isLowStock && '(Low Stock)'}
                      </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{reorder}</td>
                                    <td className="actions-cell">
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
                                            onClick={() => handleRestock(item)}
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
                            <td colSpan="7" className="no-data">
                                No products found matching your search criteria.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Product Modal Overlay */}
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
                                    onChange={(e) =>
                                        setFormData({ ...formData, sku: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. DAP Fertilizer 50kg"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Unit Price (KSh)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        required
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, quantity: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setFormData({ ...formData, reorderLevel: e.target.value })
                                        }
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
        </div>
    );
}