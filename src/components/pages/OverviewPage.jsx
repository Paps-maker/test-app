import { useNavigate } from 'react-router-dom';

export default function OverviewPage({ products }) {
    const navigate = useNavigate();

    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.quantity <= p.reorderLevel).length;
    const totalValue = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="dashboard-overview">
            <div
                className="metrics-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                }}
            >
                <div
                    className="card"
                    style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                    }}
                >
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Total Items</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0' }}>
                        {totalProducts}
                    </p>
                </div>

                <div
                    className="card"
                    style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                    }}
                >
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Total Valuation</h3>
                    <p
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: '0.5rem 0 0',
                            color: 'var(--primary)',
                        }}
                    >
                        KSh {totalValue.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                <div
                    className="card"
                    style={{
                        padding: '1.5rem',
                        background: 'var(--card-bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                    }}
                >
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Low Stock Alerts</h3>
                    <p
                        style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: '0.5rem 0 0',
                            color: lowStockCount > 0 ? 'var(--danger)' : 'var(--success)',
                        }}
                    >
                        {lowStockCount}
                    </p>
                </div>
            </div>

            <div
                style={{
                    background: 'var(--card-bg)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Quick Actions</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/inventory')}>
                        + Add New Product
                    </button>
                </div>
            </div>
        </div>
    );
}