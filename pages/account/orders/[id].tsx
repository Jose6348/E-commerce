import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);
  if (error) return <div className="container">Login required</div>;
  if (!data) return <div className="container">Loading...</div>;
  return (
    <div className="container">
      <h1>Order #{data.id}</h1>
      <p>Status: {data.status}</p>
      <p>Total: ${data.total.toFixed(2)}</p>
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
