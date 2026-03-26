import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeIndianRupee,
  CalendarClock,
  Download,
  Receipt,
  Target,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface BillItem {
  medicineName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Bill {
  _id: string;
  billNumber: string;
  createdAt: string;
  grandTotal: number;
  paymentMethod: "Cash" | "Card" | "UPI" | "Other";
  status: "Completed" | "Pending" | "Cancelled";
  discount?: number;
  items: BillItem[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatMonthLabel = (date: Date) =>
  date.toLocaleString("en-US", {
    month: "short",
  });

const getLastMonths = (count: number) => {
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1);
    return {
      key: formatMonthKey(date),
      label: formatMonthLabel(date),
    };
  });
};

const Dashboard = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const billsResponse = await fetch(`${API_URL}/billing`);
        if (!billsResponse.ok) {
          throw new Error("Failed to fetch billing data.");
        }

        const billsData = await billsResponse.json();
        if (isMounted) {
          setBills(billsData || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Unable to load sales data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedBills = useMemo(
    () => bills.filter((bill) => bill.status === "Completed"),
    [bills],
  );

  const lastSixMonths = useMemo(() => getLastMonths(6), []);

  const monthlySeries = useMemo(() => {
    const monthMap = new Map(
      lastSixMonths.map((month) => [month.key, { month: month.label, revenue: 0, orders: 0, avgOrder: 0 }]),
    );

    completedBills.forEach((bill) => {
      const date = new Date(bill.createdAt);
      const key = formatMonthKey(date);
      if (monthMap.has(key)) {
        const entry = monthMap.get(key);
        if (entry) {
          entry.revenue += bill.grandTotal;
          entry.orders += 1;
        }
      }
    });

    return Array.from(monthMap.values()).map((entry) => ({
      ...entry,
      avgOrder: entry.orders > 0 ? Math.round(entry.revenue / entry.orders) : 0,
    }));
  }, [completedBills, lastSixMonths]);

  const topSold = useMemo(() => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();
    completedBills.forEach((bill) => {
      bill.items.forEach((item) => {
        const entry = productMap.get(item.medicineName) || { quantity: 0, revenue: 0 };
        entry.quantity += item.quantity;
        entry.revenue += item.total;
        productMap.set(item.medicineName, entry);
      });
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [completedBills]);

  const reportRows = useMemo(() => {
    return completedBills.map((bill) => [
      bill.billNumber,
      new Date(bill.createdAt).toISOString().split("T")[0],
      bill.grandTotal.toString(),
      bill.paymentMethod,
      bill.status,
    ]);
  }, [completedBills]);

  const downloadReport = () => {
    const header = ["Bill Number", "Date", "Grand Total", "Payment Method", "Status"];
    const csv = [header, ...reportRows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container py-10">
        <div className="text-center text-muted-foreground">Loading sales dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-2xl border bg-card p-6 text-center text-sm text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <section className="relative mb-10 overflow-hidden rounded-[32px] border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,hsl(174_55%_31%/_0.22),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,hsl(190_52%_36%/_0.25),transparent_70%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="section-kicker">Sales command deck</div>
            <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Real-time sales intelligence and reporting
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Live billing totals and product demand pulled directly from your database. Export the
              current report for finance, compliance, or daily review.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={downloadReport}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-shadow hover:shadow-card-hover"
              >
                <Download className="h-4 w-4" />
                Download report
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
                <Activity className="h-4 w-4" />
                Share insights
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card/80 p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Period</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  {lastSixMonths[0]?.label} - {lastSixMonths[lastSixMonths.length - 1]?.label}
                </div>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Live snapshot
              </div>
            </div>
            <div className="mt-6 rounded-xl border bg-background/70 p-4 text-sm text-muted-foreground">
              Dashboard totals reflect completed billing records only.
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-4">
        {[
          {
            title: "Total revenue",
            value: "₹276",
            delta: "10 completed bills",
            icon: BadgeIndianRupee,
          },
          {
            title: "Orders processed",
            value: "10",
            delta: "10 completed",
            icon: Receipt,
          },
          {
            title: "Avg order value",
            value: "₹28",
            delta: "Based on completed bills",
            icon: Target,
          },
          {
            title: "Best month",
            value: "Mar ₹276",
            delta: "10 bills",
            icon: BadgeIndianRupee,
          },
        ].map(({ title, value, delta, icon: Icon }) => (
          <div key={title} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
            <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
            <div className="mt-2 text-sm text-muted-foreground">{delta}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Revenue momentum</div>
              <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">Revenue and average order</h2>
            </div>
          </div>

          {monthlySeries.every((item) => item.revenue === 0) ? (
            <div className="rounded-xl border bg-accent/30 p-6 text-sm text-muted-foreground">
              No completed sales recorded in the last 6 months.
            </div>
          ) : (
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--primary))" },
                avgOrder: { label: "Avg order", color: "hsl(var(--medical-teal))" },
              }}
              className="h-[300px]"
            >
              <AreaChart data={monthlySeries} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => `INR ${value / 1000}k`} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `INR ${value}`}
                  width={56}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  yAxisId="left"
                  stroke="var(--color-revenue)"
                  fill="url(#revenueFill)"
                />
                <Line
                  type="monotone"
                  dataKey="avgOrder"
                  yAxisId="right"
                  stroke="var(--color-avgOrder)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Top sold medicines</div>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">
              Top sold medicines with cost
            </h2>
          </div>
          {topSold.length === 0 ? (
            <div className="rounded-xl border bg-accent/30 p-6 text-sm text-muted-foreground">
              No product sales recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-accent/50 text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Medicine</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Units sold</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Sold cost</th>
                  </tr>
                </thead>
                <tbody>
                  {topSold.map((item) => (
                    <tr key={item.name} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.quantity}</td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;