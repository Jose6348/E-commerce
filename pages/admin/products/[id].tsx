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
    <div className="container">
      <h1>Edit Product</h1>
      <form onSubmit={submit} className="card">
        {Object.entries(form).map(([key, value]) => (
          key !== 'active' ? (
            <input
              key={key}
              placeholder={key}
              value={value as any}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ) : null
        ))}
        <label>
          Active
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        </label>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="button" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const product = await prisma.product.findUnique({ where: { id: Number(params?.id) } });
  const categories = await prisma.category.findMany();
  return { props: { product: JSON.parse(JSON.stringify(product)), categories } };
};
