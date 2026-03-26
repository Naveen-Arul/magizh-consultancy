import { useEffect, useRef, useState } from "react";
import {
  BadgeIndianRupee,
  CreditCard,
  PackageCheck,
  Plus,
  Receipt,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
  subtotal: number;
  total: number;
  paymentType: string;
  discount: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const selectedMedicine = medicines.find((medicine) => medicine._id === medicineId);
  const price = selectedMedicine?.price ?? 0;
  const itemCount = items.length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: lastBill ? `Bill_${lastBill.billNumber}` : "Bill",
    onAfterPrint: () => {
      setItems([]);
      setNextId(1);
      setDiscount(0);
      setPaymentType("Cash");
    },
  });

  const addItem = () => {
    if (!medicineId || quantity < 1 || !price || !selectedMedicine) {
      return;
    }

    if (selectedMedicine.quantity < quantity) {
      alert(`Not enough stock. Only ${selectedMedicine.quantity} units available.`);
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
    setNextId((current) => current + 1);
    setMedicineId("");
    setQuantity(1);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const completeBilling = async () => {
    if (items.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

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

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.message}`);
        return;
      }

      const data = await response.json();
      const billNumber = data.billNumber || `BILL${Date.now()}`;
      const billData: CompletedBill = {
        billNumber,
        date: billDate,
        items: items.map((item) => ({
          medicine: item.medicine,
          batch: item.batch,
          quantity: item.quantity,
          price: item.price,
          id: item.id,
          medicineId: item.medicineId,
        })),
        subtotal,
        total,
        paymentType,
        discount,
      };

      setLastBill(billData);
      await fetchMedicines();
      setTimeout(() => {
        handlePrint();
      }, 120);
    } catch (error) {
      console.error("Error completing billing:", error);
      alert("Failed to complete billing");
    } finally {
      setIsSubmitting(false);
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
      <div className="mb-8 rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
              <Receipt className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Billing Console</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Build the bill, verify stock, and close the sale from a single screen with a live checkout summary.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card/80 p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <PackageCheck className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Lines</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{itemCount}</div>
            </div>
            <div className="rounded-xl border bg-card/80 p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <BadgeIndianRupee className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Subtotal</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{formatCurrency(subtotal)}</div>
            </div>
            <div className="rounded-xl border bg-card/80 p-4 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Available</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{medicines.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Add medicine</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a stock item, confirm quantity, and push it into the bill.
                </p>
              </div>
              <div className="rounded-full border bg-accent/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                Stock-aware entry
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Medicine</label>
                <select
                  value={medicineId}
                  onChange={(event) => setMedicineId(event.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select medicine</option>
                  {medicines.map((medicine) => (
                    <option key={medicine._id} value={medicine._id}>
                      {medicine.name} | Batch {medicine.batch} | Stock {medicine.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={selectedMedicine?.quantity || undefined}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Unit price</label>
                <input
                  readOnly
                  value={price ? formatCurrency(price) : "Auto-filled"}
                  className="w-full rounded-lg border bg-muted px-3 py-2.5 text-sm text-foreground"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
              <div className="rounded-xl border bg-accent/30 p-4">
                {selectedMedicine ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Batch</div>
                      <div className="mt-1 font-medium text-foreground">{selectedMedicine.batch}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Expiry</div>
                      <div className="mt-1 font-medium text-foreground">{selectedMedicine.expiry}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Stock</div>
                      <div className="mt-1 font-medium text-foreground">{selectedMedicine.quantity} units</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a medicine to preview its batch, expiry, and available stock before adding it.
                  </p>
                )}
              </div>

              <button
                onClick={addItem}
                disabled={!medicineId || !price}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add line item
              </button>
            </div>
          </section>

          <section className="rounded-2xl border bg-card shadow-card">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Bill items</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {itemCount === 0
                    ? "No medicines added yet."
                    : `${itemCount} line items across ${totalUnits} units.`}
                </p>
              </div>
              {discount > 0 && (
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                  Savings {formatCurrency(discountAmount)}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-accent/50 text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Item</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Batch</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Qty</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Unit price</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Line total</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12">
                        <div className="mx-auto max-w-md text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Receipt className="h-5 w-5" />
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">Bill is empty</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            Start by selecting a medicine above. Added items will appear here with pricing and running totals.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-4 py-4">
                          <div className="font-medium text-foreground">{item.medicine}</div>
                          <div className="text-xs text-muted-foreground">#{index + 1}</div>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{item.batch}</td>
                        <td className="px-4 py-4 text-foreground">{item.quantity}</td>
                        <td className="px-4 py-4 text-foreground">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-4 font-medium text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                            aria-label={`Remove ${item.medicine}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-card xl:sticky xl:top-24">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">Checkout summary</h2>
              <p className="text-sm text-muted-foreground">Finalize payment, discount, and print.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Payment type</label>
              <select
                value={paymentType}
                onChange={(event) => setPaymentType(event.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                onChange={(event) =>
                  setDiscount(Math.min(100, Math.max(0, Number(event.target.value) || 0)))
                }
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="rounded-xl border bg-accent/30 p-4">
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-emerald-700">-{formatCurrency(discountAmount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t pt-4">
                <span className="font-heading text-base font-semibold text-foreground">Grand total</span>
                <span className="font-heading text-2xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
              Stock will be deducted only after the bill is successfully saved. Printing opens the browser print dialog immediately after completion.
            </div>

            {lastBill && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Last bill</div>
                <div className="mt-1 font-mono text-sm text-foreground">{lastBill.billNumber}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {lastBill.items.length} items, {formatCurrency(lastBill.total)}
                </div>
              </div>
            )}

            <button
              onClick={completeBilling}
              disabled={items.length === 0 || isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Receipt className="h-4 w-4" />
              {isSubmitting ? "Saving bill..." : "Complete billing and print"}
            </button>
          </div>
        </aside>
      </div>

      {lastBill && (
        <div className="hidden">
          <PrintableBill
            ref={printRef}
            billNumber={lastBill.billNumber}
            date={lastBill.date}
            items={lastBill.items}
            subtotal={lastBill.subtotal}
            total={lastBill.total}
            paymentType={lastBill.paymentType}
            discount={lastBill.discount}
          />
        </div>
      )}
    </div>
  );
};

export default Billing;
