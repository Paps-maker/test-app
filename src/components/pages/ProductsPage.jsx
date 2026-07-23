import { useState } from 'react';

export default function ProductsPage({ products }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Extract unique categories for filter tabs/dropdown
    const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

    // Filter products based on search term and category
    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="products-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Controls Bar: Search Input & Category Filter */}
            <div
                className="products-controls"
                style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--card-bg)',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                }}
            >
                <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: '1 1 250px',
                        padding: '0.6rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-main, #1a1a1a)',
                        color: 'inherit',
                    }}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-main, #1a1a1a)',
                        color: 'inherit',
                        cursor: 'pointer',
                    }}
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'var(--card-bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                    }}
                >
                    No products found matching your search.
                </div>
            ) : (
                <div
                    className="products-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="product-card"
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                <span
                    className="category-tag"
                    style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        background: 'var(--border)',
                        color: 'var(--text-muted)',
                    }}
                >
                  {p.category || 'General'}
                </span>
                                <h3 style={{ margin: '0.75rem 0 0.5rem' }}>{p.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                                    SKU: {p.sku}
                                </p>
                            </div>

                            <div
                                style={{
                                    marginTop: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
                                    KSh {p.price.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                </strong>
                                <span
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: p.quantity <= p.reorderLevel ? 'var(--danger)' : 'var(--success)',
                                    }}
                                >
                  Stock: {p.quantity}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}