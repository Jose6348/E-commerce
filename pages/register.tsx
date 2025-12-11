import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const data = await res.json();
      return setError(data.error || 'Register failed');
    }
    router.push('/');
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={submit} className="card">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="button" type="submit">
          Register
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
