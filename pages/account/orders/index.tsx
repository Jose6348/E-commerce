import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrdersPage() {
  const { data, error } = useSWR('/api/orders', fetcher);
  if (error) return <div className="container">Login required</div>;
  if (!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h1>My Orders</h1>
      {data.map((order: any) => (
        <div key={order.id} className="card">
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <a href={`/account/orders/${order.id}`}>View</a>
        </div>
      ))}
    </div>
  );
}
