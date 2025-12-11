import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminProducts() {
  const { data, mutate, error } = useSWR('/api/products', fetcher);
  if (error) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Unauthorized</div>;
  if (!data) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Carregando...</div>;

  const remove = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    mutate();
  };

  return (
    <div style={{ background: 'var(--surface-soft)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin</p>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Produtos</h1>
          </div>
          <Link href="/admin/products/new">
            <button className="btn btn-primary" style={{ boxShadow: 'var(--shadow-md)' }}>+ Novo Produto</button>
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.map((p: any) => (
            <div key={p.id} style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '1rem 1.25rem',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--gray-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--surface-soft)', display: 'grid', placeItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--dark)' }}>PR</div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{p.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>Estoque: {p.stock} • R$ {p.price?.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/admin/products/${p.id}`}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 0.9rem' }}>Editar</button>
                </Link>
                <button className="btn btn-ghost" onClick={() => remove(p.id)} style={{ padding: '0.5rem 0.9rem', color: 'var(--error)', border: '1px solid var(--gray-200)' }}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
