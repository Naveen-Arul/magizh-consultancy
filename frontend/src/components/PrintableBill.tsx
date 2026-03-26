import React from "react";

interface BillItem {
  medicine: string;
  batch: string;
  quantity: number;
  price: number;
}

interface PrintableBillProps {
  billNumber: string;
  date: string;
  items: BillItem[];
  subtotal: number;
  total: number;
  paymentType?: string;
  discount?: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export const PrintableBill = React.forwardRef<HTMLDivElement, PrintableBillProps>(
  ({ billNumber, date, items, subtotal, total, paymentType = "Cash", discount = 0 }, ref) => {
    const discountAmount = subtotal - total;

    return (
      <div ref={ref} className="print-content">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-content, .print-content * {
              visibility: visible;
            }
            .print-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            @page {
              margin: 0.5cm;
              size: A4;
            }
          }
        `}</style>

        <div className="mx-auto max-w-3xl bg-white p-8 text-black">
          <div className="mb-6 border-b-2 border-slate-900 pb-4 text-center">
            <h1 className="mb-1 text-3xl font-bold text-slate-900">MagizhHealDesk</h1>
            <p className="text-sm text-slate-600">Pharmacy Management System</p>
            <p className="mt-1 text-xs text-slate-500">
              Address: 123 Pharmacy Street, Medical Plaza, City - 600001
            </p>
            <p className="text-xs text-slate-500">
              Phone: +91 9876543210 | Email: info@magizhhealdesk.com
            </p>
            <p className="text-xs text-slate-500">GSTIN: 33XXXXX1234X1ZX | Drug License: DL-12345</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-slate-700">Bill Number</p>
              <p className="font-mono text-lg text-slate-900">{billNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-700">Date and time</p>
              <p className="text-slate-900">
                {new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-slate-700">
                {new Date(date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          <table className="mb-6 w-full border-collapse">
            <thead>
              <tr className="border-y-2 border-slate-900 bg-slate-100">
                <th className="p-2 text-left text-sm font-semibold text-slate-700">#</th>
                <th className="p-2 text-left text-sm font-semibold text-slate-700">Medicine</th>
                <th className="p-2 text-left text-sm font-semibold text-slate-700">Batch</th>
                <th className="p-2 text-right text-sm font-semibold text-slate-700">Qty</th>
                <th className="p-2 text-right text-sm font-semibold text-slate-700">Price</th>
                <th className="p-2 text-right text-sm font-semibold text-slate-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.medicine}-${item.batch}-${index}`} className="border-b border-slate-300">
                  <td className="p-2 text-sm text-slate-700">{index + 1}</td>
                  <td className="p-2 text-sm font-medium text-slate-900">{item.medicine}</td>
                  <td className="p-2 text-sm text-slate-600">{item.batch}</td>
                  <td className="p-2 text-right text-sm text-slate-700">{item.quantity}</td>
                  <td className="p-2 text-right text-sm text-slate-700">{formatCurrency(item.price)}</td>
                  <td className="p-2 text-right text-sm font-medium text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-6 flex justify-end">
            <div className="w-72">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-slate-600">Discount ({discount}%)</span>
                  <span className="font-medium text-red-600">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t-2 border-slate-900 py-2">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <div className="mt-1 flex justify-between py-1 text-sm">
                <span className="text-slate-600">Payment Mode</span>
                <span className="font-medium text-slate-900">{paymentType}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-slate-300 pt-4">
            <div className="mb-4 space-y-1 text-xs text-slate-600">
              <p>
                <strong>Terms and Conditions:</strong>
              </p>
              <p>- Medicines once sold will not be taken back or exchanged</p>
              <p>- Please check expiry date before use</p>
              <p>- Keep medicines away from children</p>
              <p>- Store in a cool and dry place</p>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div className="text-xs text-slate-500">
                <p>Thank you for your business.</p>
                <p className="mt-1">For queries: +91 9876543210</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-t border-slate-400 pt-1">
                  <p className="text-xs text-slate-600">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-2 text-center text-xs text-slate-400">
            <p>This is a computer-generated bill and does not require a signature.</p>
            <p>Generated by MagizhHealDesk Pharmacy Management System</p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableBill.displayName = "PrintableBill";
