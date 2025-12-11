import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminOrders() {
  const { data, error } = useSWR('/api/orders', fetcher);
  if (error) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Unauthorized</div>;
  if (!data) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Carregando...</div>;
  return (
    <div style={{ background: 'var(--surface-soft)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Pedidos</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.map((o: any) => (
            <div key={o.id} style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--gray-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Pedido #{o.id}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Status: {o.status}</div>
              </div>
              <Link href={`/admin/orders/${o.id}`}>
                <button className="btn btn-outline" style={{ padding: '0.5rem 0.9rem' }}>Ver</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
