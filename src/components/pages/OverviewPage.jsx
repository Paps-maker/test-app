import { useNavigate } from 'react-router-dom';

export default function OverviewPage({ products = [] }) {
    const navigate = useNavigate();

    const totalItems = products.length;

    const totalValuation = products.reduce((acc, p) => {
        const qty = Number(p.stockQty ?? p.quantity ?? 0);
        const price = Number(p.unitPrice ?? p.price ?? 0);
        return acc + qty * price;
    }, 0);

    const lowStockCount = products.filter((p) => {
        const qty = Number(p.stockQty ?? p.quantity ?? 0);
        const reorder = Number(p.reorderLevel ?? 5);
        return qty <= reorder;
    }).length;

    return (
        <div>
            <div className="metrics-grid">
                <div className="metric-card">
                    <h4>Total Items</h4>
                    <p>{totalItems}</p>
                </div>

                <div className="metric-card">
                    <h4>Total Valuation</h4>
                    <p className="text-success">
                        KSh {Number(totalValuation).toFixed(2)}
                    </p>
                </div>

                <div className="metric-card">
                    <h4>Low Stock Alerts</h4>
                    <p className={lowStockCount > 0 ? 'text-danger-light' : ''}>
                        {lowStockCount}
                    </p>
                </div>
            </div>

            <div className="metric-card quick-action-card">
                <div>
                    <h3>Quick Actions</h3>
                    <p>Manage stock items and update catalog quantities.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/inventory')}>
                    + Manage Inventory
                </button>
            </div>
        </div>
    );
}