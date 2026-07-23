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
        <div className="products-wrapper">
            {/* Controls Bar */}
            <div className="inventory-toolbar">
                <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="search-input"
                    style={{ maxWidth: '200px' }}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="table-responsive">
                <table className="inventory-table">
                    <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Qty</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => {
                            const price = p.unitPrice ?? p.price ?? 0;
                            const stock = p.stockQty ?? p.quantity ?? 0;
                            const reorder = p.reorderLevel ?? 5;
                            const isLowStock = stock <= reorder;

                            return (
                                <tr key={p.id}>
                                    <td className="sku-cell">{p.sku}</td>
                                    <td className="name-cell">{p.name}</td>
                                    <td>
                      <span className="category-tag">
                        {p.category || 'General'}
                      </span>
                                    </td>
                                    <td className="name-cell">
                                        KSh {Number(price).toFixed(2)}
                                    </td>
                                    <td className="name-cell">{stock}</td>
                                    <td>
                      <span
                          className={`qty-badge ${
                              isLowStock ? 'low-stock' : 'normal-stock'
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
                            <td colSpan="6" className="no-data">
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