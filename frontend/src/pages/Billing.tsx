import { useState, useEffect, useRef } from "react";
import { Receipt, Plus, Trash2, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PrintableBill } from "../components/PrintableBill";

interface Medicine {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  batch: string;
  expiry: string;
}

interface BillItem {
  id: number;
  medicineId: string;
  medicine: string;
  quantity: number;
  price: number;
  batch: string;
}

interface CompletedBill {
  billNumber: string;
  date: string;
  items: BillItem[];
  total: number;
  paymentType: string;
  discount: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Billing = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<BillItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [lastBill, setLastBill] = useState<CompletedBill | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(`${API_URL}/medicines`);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMedicine = medicines.find((m) => m._id === medicineId);
  const price = selectedMedicine?.price ?? 0;

  const addItem = () => {
    if (!medicineId || quantity < 1 || !price || !selectedMedicine) return;
    
    if (selectedMedicine.quantity < quantity) {
      alert(`Not enough stock! Only ${selectedMedicine.quantity} available.`);
      return;
    }
    
    setItems((prev) => [
      ...prev,
      {
        id: nextId,
        medicineId: selectedMedicine._id,
        medicine: selectedMedicine.name,
        quantity,
        price,
        batch: selectedMedicine.batch,
      },
    ]);
    setNextId((n) => n + 1);
    setMedicineId("");
    setQuantity(1);
  };

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: lastBill ? `Bill_${lastBill.billNumber}` : "Bill",
    onAfterPrint: () => {
      // Clear form after printing
      setItems([]);
      setNextId(1);
      setDiscount(0);
      setPaymentType("Cash");
    },
  });

  const completeBilling = async () => {
    if (items.length === 0) return;

    try {
      const billDate = new Date().toISOString();
      const response = await fetch(`${API_URL}/billing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            medicineId: item.medicineId,
            medicine: item.medicine,
            quantity: item.quantity,
            price: item.price,
            batch: item.batch,
          })),
          total,
          paymentType,
          discount,
          date: billDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const billNumber = data.billNumber || `BILL${Date.now()}`;
        
        // Store bill data for printing (using current items before clearing)
        const billData = {
          billNumber,
          date: billDate,
          items: items.map(item => ({
            medicine: item.medicine,
            batch: item.batch,
            quantity: item.quantity,
            price: item.price,
            id: item.id,
            medicineId: item.medicineId,
          })),
          total,
          paymentType,
          discount,
        };
        
        setLastBill(billData);
        await fetchMedicines(); // Refresh stock quantities
        
        // Trigger print after state update (form will be cleared after printing)
        setTimeout(() => {
          handlePrint();
        }, 100);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Error completing billing:", error);
      alert("Failed to complete billing");
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center text-muted-foreground">Loading medicines...</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Receipt className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Billing</h1>
      </div>

      {/* Form */}
      <div className="mb-8 grid gap-4 rounded-xl border bg-card p-6 shadow-card sm:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Medicine</label>
          <select
            value={medicineId}
            onChange={(e) => setMedicineId(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select medicine</option>
            {medicines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} (Stock: {m.quantity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Price (₹) — auto</label>
          <input
            readOnly
            value={price || "—"}
            className="w-full rounded-lg border bg-muted px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={addItem}
            disabled={!medicineId || !price}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-card-hover disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {/* Payment Details */}
      {items.length > 0 && (
        <div className="mb-4 grid gap-4 rounded-xl border bg-card p-6 shadow-card sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Online">Online Banking</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Discount (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
              <div className="text-xs text-muted-foreground">Total Amount</div>
              <div className="text-lg font-bold text-primary">₹{total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Table */}
      <div className="rounded-xl border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-accent/50 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">S.No</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Medicine</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Batch</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No items added yet
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{item.medicine}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.batch}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3 font-medium">₹{item.price * item.quantity}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="border-t-2 border-border">
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-right text-sm text-muted-foreground">
                    Subtotal
                  </td>
                  <td className="px-4 py-2 font-medium text-foreground">₹{subtotal.toFixed(2)}</td>
                  <td />
                </tr>
                {discount > 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-right text-sm text-muted-foreground">
                      Discount ({discount}%)
                    </td>
                    <td className="px-4 py-2 font-medium text-destructive">-₹{discountAmount.toFixed(2)}</td>
                    <td />
                  </tr>
                )}
                <tr className="bg-primary/10">
                  <td colSpan={5} className="px-4 py-3 text-right font-heading font-semibold text-foreground">
                    Grand Total
                  </td>
                  <td className="px-4 py-3 font-heading font-bold text-primary text-lg">₹{total.toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={completeBilling}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-card-hover"
          >
            <Receipt className="h-4 w-4" /> Complete Billing & Print
          </button>
        </div>
      )}

      {/* Hidden Printable Bill Component */}
      {lastBill && (
        <div style={{ display: "none" }}>
          <PrintableBill
            ref={printRef}
            billNumber={lastBill.billNumber}
            date={lastBill.date}
            items={lastBill.items}
            total={lastBill.total}
            paymentType={lastBill.paymentType}
            discount={lastBill.discount}
          />
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        ℹ️ Stock quantity will be reduced automatically after billing.
      </p>
    </div>
  );
};

export default Billing;
