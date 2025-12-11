import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const router = useRouter();
  const [address, setAddress] = useState({ street: '', city: '', state: '', postal: '', country: '' });
  const [message, setMessage] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    if (!res.ok) {
      const data = await res.json();
      return setMessage(data.error || 'Checkout failed');
    }
    const order = await res.json();
    router.push(`/account/orders/${order.id}`);
  };

  return (
    <div className="container">
      <h1>Checkout</h1>
      <form onSubmit={submit} className="card">
        {(['street', 'city', 'state', 'postal', 'country'] as const).map((f) => (
          <div key={f} style={{ marginBottom: '8px' }}>
            <label>
              {f}
              <input
                style={{ width: '100%' }}
                value={(address as any)[f]}
                onChange={(e) => setAddress({ ...address, [f]: e.target.value })}
                required
              />
            </label>
          </div>
        ))}
        <button className="button" type="submit">
          Place Order
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
