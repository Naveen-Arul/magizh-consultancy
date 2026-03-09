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
  if (daysUntilExpiry <= 90 && qty <= LOW_THRESHOLD) return "critical";
  if (daysUntilExpiry <= 90) return "near-expiry";
  if (qty <= LOW_THRESHOLD) return "low-stock";
  return "ok";
}

const statusStyles: Record<string, string> = {
  ok: "bg-success-green/10 text-success-green",
  "low-stock": "bg-warning-amber/10 text-warning-amber",
  "near-expiry": "bg-warning-red/10 text-warning-red",
  critical: "bg-warning-red/15 text-warning-red",
};

const statusLabels: Record<string, string> = {
  ok: "In Stock",
  "low-stock": "Low Stock",
  "near-expiry": "Near Expiry",
  critical: "Critical",
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

  const lowStock = stock.filter((s) => s.quantity <= LOW_THRESHOLD);
  const nearExpiry = stock.filter((s) => Math.ceil((new Date(s.expiry).getTime() - Date.now()) / 86400000) <= 90);

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
                return (
                  <tr key={item._id} className="border-b last:border-0">
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
