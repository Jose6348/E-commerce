import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminOrders() {
  const { data, error } = useSWR('/api/orders', fetcher);
  if (error) return <div className="container">Unauthorized</div>;
  if (!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h1>Orders</h1>
      {data.map((o: any) => (
        <div key={o.id} className="card">
          <p>Order #{o.id}</p>
          <p>Status: {o.status}</p>
          <Link href={`/admin/orders/${o.id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
