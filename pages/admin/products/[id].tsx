import { GetServerSideProps } from 'next';
import { prisma } from '../../../lib/prisma';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditProduct({ product, categories }: any) {
  const router = useRouter();
  const [form, setForm] = useState(product);

  useEffect(() => setForm(product), [product]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) }),
    });
    router.push('/admin/products');
  };

  return (
    <div style={{ background: 'var(--surface-soft)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Editar Produto</h1>
        </div>
        <form onSubmit={submit} style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {Object.entries(form).map(([key, value]) => (
            key !== 'active' ? (
              <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                <input
                  placeholder={key}
                  value={value as any}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="form-input"
                />
              </div>
            ) : null
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            Ativo
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          </label>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Categoria</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} className="form-select">
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-outline" type="button" onClick={() => router.back()}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" style={{ boxShadow: 'var(--shadow-md)' }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await prisma.product.findUnique({ where: { id: Number(params?.id) } });
  const categories = await prisma.category.findMany();
  return { props: { product: JSON.parse(JSON.stringify(product)), categories } };
};
