import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminProducts() {
  const { data, mutate, error } = useSWR('/api/products', fetcher);
  if (error) return <div className="container">Unauthorized</div>;
  if (!data) return <div className="container">Loading...</div>;

  const remove = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    mutate();
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <Link href="/admin/products/new" className="button">
        New Product
      </Link>
      {data.map((p: any) => (
        <div key={p.id} className="card">
          <p>{p.name}</p>
          <Link href={`/admin/products/${p.id}`}>Edit</Link>
          <button className="button" onClick={() => remove(p.id)} style={{ marginLeft: '8px' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
