import { useState, useEffect } from "react";
import { Package, AlertTriangle, Clock, Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface StockItem {
  _id: string;
  name: string;
  quantity: number;
  expiry: string;
  batch: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const LOW_THRESHOLD = 20;

function getStatus(qty: number, expiry: string) {
  const daysUntilExpiry = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
  
  // Expired (<=0 days)
  if (daysUntilExpiry <= 0) return "expired";
  
  // Critical (1-30 days)
  if (daysUntilExpiry <= 30) {
    if (qty <= LOW_THRESHOLD) return "critical-low";
    return "critical";
  }
  
  // Warning (31-90 days)
  if (daysUntilExpiry <= 90) {
    if (qty <= LOW_THRESHOLD) return "warning-low";
    return "warning";
  }
  
  // Low stock but not expiring soon
  if (qty <= LOW_THRESHOLD) return "low-stock";
  
  // Good
  return "ok";
}

const statusStyles: Record<string, string> = {
  ok: "bg-success-green/10 text-success-green",
  "low-stock": "bg-warning-amber/10 text-warning-amber",
  warning: "bg-orange-500/10 text-orange-600",
  "warning-low": "bg-orange-500/15 text-orange-700 font-semibold",
  critical: "bg-red-500/15 text-red-600 font-semibold",
  "critical-low": "bg-red-500/20 text-red-700 font-bold",
  expired: "bg-red-600/25 text-red-800 font-bold border-2 border-red-600/50 blink-red",
};

const statusLabels: Record<string, string> = {
  ok: "In Stock",
  "low-stock": "Low Stock",
  warning: "⚠️ Expiring Soon",
  "warning-low": "⚠️ Low + Expiring",
  critical: "🔴 Critical Expiry",
  "critical-low": "🔴 Critical",
  expired: "🚨 EXPIRED",
};

const Stock = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", quantity: "", expiry: "", batch: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: "", expiry: "", batch: "" });

  // Fetch stock from API
  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await fetch(`${API_URL}/stock?flat=true`);
      const data = await response.json();
      setStock(data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const expired = stock.filter((s) => Math.ceil((new Date(s.expiry).getTime() - Date.now()) / 86400000) <= 0);
  const lowStock = stock.filter((s) => s.quantity <= LOW_THRESHOLD);
  const nearExpiry = stock.filter((s) => {
    const days = Math.ceil((new Date(s.expiry).getTime() - Date.now()) / 86400000);
    return days > 0 && days <= 90;
  });

  const addStock = async () => {
    if (!form.name || !form.quantity || !form.expiry) return;
    
    try {
      const response = await fetch(`${API_URL}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          quantity: Number(form.quantity),
          expiry: form.expiry,
          batch: form.batch || `B${Date.now().toString().slice(-6)}`,
        }),
      });
      
      if (response.ok) {
        await fetchStock();
        setForm({ name: "", quantity: "", expiry: "", batch: "" });
      }
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  const startEdit = (item: StockItem) => {
    setEditingId(item._id);
    setEditForm({ name: item.name, quantity: String(item.quantity), expiry: item.expiry, batch: item.batch });
  };

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/stock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          quantity: Number(editForm.quantity),
          expiry: editForm.expiry,
          batch: editForm.batch,
        }),
      });
      
      if (response.ok) {
        await fetchStock();
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/stock/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        await fetchStock();
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center text-muted-foreground">Loading stock data...</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Package className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Stock Management</h1>
      </div>

      {/* Expired Alert - Always at top if any exist */}
      {expired.length > 0 && (
        <div className="mb-6 rounded-xl border-2 border-red-600 bg-red-50 p-5 shadow-lg pulse-border">
          <div className="mb-3 flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <h3 className="font-heading text-lg font-bold">🚨 EXPIRED MEDICINES ({expired.length})</h3>
          </div>
          <div className="rounded-lg bg-white/70 p-3">
            <p className="mb-2 text-sm font-semibold text-red-800">⚠️ URGENT: Remove these medicines from stock immediately!</p>
            <ul className="space-y-1.5">
              {expired.map((s) => {
                const daysExpired = Math.abs(Math.ceil((new Date(s.expiry).getTime() - Date.now()) / 86400000));
                return (
                  <li key={s._id} className="flex items-center justify-between rounded bg-red-100/80 px-3 py-2 text-sm">
                    <span className="font-semibold text-red-900">{s.name} ({s.batch})</span>
                    <span className="font-bold text-red-600">Expired {daysExpired} {daysExpired === 1 ? 'day' : 'days'} ago - {s.expiry}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Summary Panels */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-warning-amber/30 bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-warning-amber">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-heading font-semibold">Low Stock ({lowStock.length})</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted-foreground">All medicines are well-stocked.</p>
          ) : (
            <ul className="space-y-1">
              {lowStock.map((s) => (
                <li key={s._id} className="text-sm text-muted-foreground">
                  {s.name} — <span className="font-medium text-warning-amber">{s.quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-warning-red/30 bg-card p-5 shadow-card">
          <div className="mb-3 flex items-center gap-2 text-destructive">
            <Clock className="h-5 w-5" />
            <h3 className="font-heading font-semibold">Near Expiry ({nearExpiry.length})</h3>
          </div>
          {nearExpiry.length === 0 ? (
            <p className="text-sm text-muted-foreground">No medicines near expiry.</p>
          ) : (
            <ul className="space-y-1">
              {nearExpiry.map((s) => (
                <li key={s._id} className="text-sm text-muted-foreground">
                  {s.name} — <span className="font-medium text-destructive">{s.expiry}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mb-8 rounded-xl border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-accent/50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Medicine</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Batch</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Quantity</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Expiry</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => {
                const status = getStatus(item.quantity, item.expiry);
                const isEditing = editingId === item._id;
                const daysUntilExpiry = Math.ceil((new Date(item.expiry).getTime() - Date.now()) / 86400000);
                const isExpired = daysUntilExpiry <= 0;
                return (
                  <tr key={item._id} className={`border-b last:border-0 ${isExpired ? 'blink-red' : ''}`}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {isEditing ? (
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded border bg-background px-2 py-1 text-sm" />
                      ) : item.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {isEditing ? (
                        <input value={editForm.batch} onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })} className="w-20 rounded border bg-background px-2 py-1 text-sm" />
                      ) : item.batch}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input type="number" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} className="w-20 rounded border bg-background px-2 py-1 text-sm" />
                      ) : item.quantity}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input type="date" value={editForm.expiry} onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })} className="rounded border bg-background px-2 py-1 text-sm" />
                      ) : item.expiry}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
                        {statusLabels[status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={() => saveEdit(item._id)} className="rounded p-1 text-success-green hover:bg-accent"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditingId(null)} className="rounded p-1 text-muted-foreground hover:bg-accent"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(item)} className="rounded p-1 text-primary hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteItem(item._id)} className="rounded p-1 text-destructive hover:bg-accent"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Form */}
      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Add / Update Stock</h3>
        <div className="grid gap-4 sm:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Medicine Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Paracetamol" className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantity</label>
            <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Expiry Date</label>
            <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Batch (optional)</label>
            <input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex items-end">
            <button onClick={addStock} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:shadow-card-hover disabled:opacity-50">
              <Plus className="h-4 w-4" /> Add Stock
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Same medicine can be added multiple times with different expiry dates.</p>
      </div>
    </div>
  );
};

export default Stock;
