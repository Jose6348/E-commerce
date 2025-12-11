import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NewProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: '',
    active: true,
  });

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) }),
    });
    if (res.ok) router.push('/admin/products');
  };

  return (
    <div className="container">
      <h1>New Product</h1>
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
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
        </label>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
          <option value={0}>Select category</option>
          {categories.map((c) => (
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
