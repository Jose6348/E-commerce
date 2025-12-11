import { useEffect, useState } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [error, setError] = useState('');

  const loadCart = async () => {
    const res = await fetch('/api/cart');
    if (res.status === 401) return setError('Please log in to view cart');
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (productId: number, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    loadCart();
  };

  const removeItem = async (productId: number) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    loadCart();
  };

  const total = cart?.items?.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0) || 0;

  return (
    <div className="container">
      <h1>Cart</h1>
      {error && <p>{error}</p>}
      {cart?.items?.map((item: any) => (
        <div key={item.id} className="card">
          <p>{item.product.name}</p>
          <p>${item.product.price.toFixed(2)}</p>
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={(e) => updateQty(item.productId, Number(e.target.value))}
          />
          <button className="button" onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}
