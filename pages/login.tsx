import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e

      .preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(data.user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - ShopHub</title>
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'var(--surface-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-2xl)',
          padding: '3rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: 'var(--dark)'
            }}>
              Bem-vindo de Volta! 👋
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Faça login para continuar suas compras
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #ef4444'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg btn-block"
              style={{
                width: '100%',
                marginTop: '0.5rem',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              Não tem uma conta?{' '}
              <Link href="/register" style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'none'
              }}>
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            color: 'var(--gray-600)'
          }}>
            <strong>Demo Admin:</strong> admin@example.com / admin123
          </div>
        </div>
      </div>
    </>
  );
}
