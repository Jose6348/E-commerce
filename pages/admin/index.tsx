import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data, error } = useSWR('/api/admin/stats', fetcher);
  if (error) return <div className="container">Unauthorized</div>;
  if (!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="card">Revenue: ${data.revenue.toFixed(2)}</div>
      <div className="card">Orders: {data.totalOrders}</div>
      <div className="card">Customers: {data.totalCustomers}</div>
      <div className="card">
        <h3>Best Sellers</h3>
        {data.bestProducts.map((b: any) => (
          <p key={b.product?.id}>
            {b.product?.name} - {b.quantity}
          </p>
        ))}
      </div>
      <Link href="/admin/products" className="button">
        Manage Products
      </Link>
      <Link href="/admin/orders" className="button" style={{ marginLeft: '8px' }}>
        Manage Orders
      </Link>
    </div>
  );
}
