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
  total: number;
  paymentType?: string;
  discount?: number;
}

export const PrintableBill = React.forwardRef<HTMLDivElement, PrintableBillProps>(
  ({ billNumber, date, items, total, paymentType = "Cash", discount = 0 }, ref) => {
    const subtotal = total;
    const discountAmount = (subtotal * discount) / 100;
    const finalTotal = subtotal - discountAmount;

    return (
      <div ref={ref} className="print-content">
        {/* Print-specific styles */}
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

        <div className="max-w-3xl mx-auto bg-white p-8 text-black">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">💊 MagizhHealDesk</h1>
            <p className="text-sm text-gray-600">Pharmacy Management System</p>
            <p className="text-xs text-gray-500 mt-1">
              Address: 123 Pharmacy Street, Medical Plaza, City - 600001
            </p>
            <p className="text-xs text-gray-500">
              Phone: +91 9876543210 | Email: info@magizhHealDesk.com
            </p>
            <p className="text-xs text-gray-500">GSTIN: 33XXXXX1234X1ZX | Drug License: DL-12345</p>
          </div>

          {/* Bill Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Bill Number:</p>
              <p className="text-gray-900 font-mono text-lg">{billNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">Date & Time:</p>
              <p className="text-gray-900">
                {new Date(date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-700 text-xs">
                {new Date(date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-6 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-y-2 border-gray-800">
                <th className="text-left p-2 text-sm font-semibold text-gray-700">#</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-700">Medicine Name</th>
                <th className="text-left p-2 text-sm font-semibold text-gray-700">Batch</th>
                <th className="text-right p-2 text-sm font-semibold text-gray-700">Qty</th>
                <th className="text-right p-2 text-sm font-semibold text-gray-700">Price (₹)</th>
                <th className="text-right p-2 text-sm font-semibold text-gray-700">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="p-2 text-sm text-gray-700">{idx + 1}</td>
                  <td className="p-2 text-sm text-gray-900 font-medium">{item.medicine}</td>
                  <td className="p-2 text-sm text-gray-600">{item.batch}</td>
                  <td className="p-2 text-sm text-gray-700 text-right">{item.quantity}</td>
                  <td className="p-2 text-sm text-gray-700 text-right">{item.price.toFixed(2)}</td>
                  <td className="p-2 text-sm text-gray-900 font-medium text-right">
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Discount ({discount}%):</span>
                  <span className="text-red-600 font-medium">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-gray-800 mt-2">
                <span className="text-gray-900 font-bold text-lg">Total Amount:</span>
                <span className="text-gray-900 font-bold text-xl">₹{finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm mt-1">
                <span className="text-gray-600">Payment Mode:</span>
                <span className="text-gray-900 font-medium">{paymentType}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-4 mt-8">
            <div className="text-xs text-gray-600 space-y-1 mb-4">
              <p><strong>Terms & Conditions:</strong></p>
              <p>• Medicines once sold will not be taken back or exchanged</p>
              <p>• Please check expiry date before use</p>
              <p>• Keep medicines away from children</p>
              <p>• Store in a cool and dry place</p>
            </div>

            <div className="flex justify-between items-end mt-6">
              <div className="text-xs text-gray-500">
                <p>Thank you for your business!</p>
                <p className="mt-1">For queries: +91 9876543210</p>
              </div>
              <div className="text-center">
                <div className="border-t border-gray-400 pt-1 w-40">
                  <p className="text-xs text-gray-600">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 text-xs text-gray-400 border-t border-gray-200 pt-2">
            <p>This is a computer-generated bill and does not require a signature.</p>
            <p>Generated by MagizhHealDesk Pharmacy Management System</p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableBill.displayName = "PrintableBill";
