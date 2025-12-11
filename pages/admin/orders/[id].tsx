import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);
  const [status, setStatus] = useState('');
  if (error) return <div className="container">Unauthorized</div>;
  if (!data) return <div className="container">Loading...</div>;

  const updateStatus = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: data.id, status }),
    });
    mutate();
  };

  return (
    <div className="container">
      <h1>Order #{data.id}</h1>
      <p>Customer: {data.user.email}</p>
      <p>Total: ${data.total.toFixed(2)}</p>
      <p>Status: {data.status}</p>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Change status</option>
        {['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button className="button" onClick={updateStatus}>
        Update
      </button>
      <h3>Items</h3>
      {data.items.map((item: any) => (
        <div key={item.id} className="card">
          <p>{item.product.name}</p>
          <p>Qty: {item.quantity}</p>
          <p>Price: ${item.price}</p>
        </div>
      ))}
    </div>
  );
}
