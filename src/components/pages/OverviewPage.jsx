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
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Items Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Total Items
                    </h4>
                    <p className="text-3xl font-bold text-slate-100">{totalItems}</p>
                </div>

                {/* Total Valuation Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Total Valuation
                    </h4>
                    <p className="text-3xl font-bold text-emerald-400">
                        KSh {Number(totalValuation).toFixed(2)}
                    </p>
                </div>

                {/* Low Stock Alerts Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Low Stock Alerts
                    </h4>
                    <p
                        className={`text-3xl font-bold ${
                            lowStockCount > 0 ? 'text-rose-400' : 'text-slate-100'
                        }`}
                    >
                        {lowStockCount}
                    </p>
                </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-100">Quick Actions</h3>
                    <p className="text-sm text-slate-400">
                        Manage stock items and update catalog quantities.
                    </p>
                </div>
                <button
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    onClick={() => navigate('/inventory')}
                >
                    + Manage Inventory
                </button>
            </div>
        </div>
    );
}