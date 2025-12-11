import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminOrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);
  const [status, setStatus] = useState('');
  if (error) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Unauthorized</div>;
  if (!data) return <div className="container" style={{ padding: '3rem 1.5rem' }}>Carregando...</div>;

  const updateStatus = async () => {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: data.id, status }),
    });
    mutate();
  };

  return (
    <div style={{ background: 'var(--surface-soft)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Pedido #{data.id}</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.35rem' }}>Cliente: {data.user.email}</p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--gray-700)' }}>Status atual:</span>
            <span style={{ background: 'var(--surface-soft)', border: '1px solid var(--gray-200)', padding: '0.35rem 0.75rem', borderRadius: '10px', fontWeight: 700 }}>{data.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select" style={{ maxWidth: '240px' }}>
              <option value="">Alterar status</option>
              {['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={updateStatus} style={{ boxShadow: 'var(--shadow-md)' }}>
              Atualizar
            </button>
          </div>
          <div style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.35rem' }}>Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            R$ {data.total.toFixed(2)}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '1rem' }}>Itens</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.items.map((item: any) => (
              <div key={item.id} style={{ background: 'var(--surface-soft)', borderRadius: '12px', padding: '0.9rem 1rem', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{item.product.name}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  Qty: {item.quantity} • Preço: R$ {item.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
