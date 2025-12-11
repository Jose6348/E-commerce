import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  bestSellers: Array<{
    product: { name: string };
    total: number;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'ADMIN') {
      router.push('/');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - ShopHub</title>
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: '100vh'
      }}>
        {/* Admin Header */}
        <div style={{
          background: 'var(--gradient-hero)',
          color: 'var(--dark)',
          padding: '2rem 0',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-lg)',
          borderBottom: '1px solid var(--gray-200)'
        }}>
          <div className="container">
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Admin</p>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              marginBottom: '0.25rem'
            }}>
              Painel Administrativo
            </h1>
            <p style={{ color: 'var(--gray-700)' }}>
              Gerencie produtos, pedidos e categorias com rapidez.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: '3rem' }}>
          {/* Quick Links */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <Link href="/admin/products" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'center'
              }} className="admin-card">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-dark)', margin: '0 auto 0.5rem' }}></div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Produtos</div>
              </div>
            </Link>

            <Link href="/admin/categories" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'center'
              }} className="admin-card">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-dark)', margin: '0 auto 0.5rem' }}></div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Categorias</div>
              </div>
            </Link>

            <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'center'
              }} className="admin-card">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-dark)', margin: '0 auto 0.5rem' }}></div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Pedidos</div>
              </div>
            </Link>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--gray-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'center'
              }} className="admin-card">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-dark)', margin: '0 auto 0.5rem' }}></div>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>Loja</div>
              </div>
            </Link>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner"></div>
              <p style={{ marginTop: '1rem' }}>Carregando estatísticas...</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: 'var(--secondary)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    Receita Total
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                </div>

                <div style={{
                  background: 'var(--primary-dark)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    Total de Pedidos
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                    {stats?.totalOrders || 0}
                  </div>
                </div>

                <div style={{
                  background: 'var(--accent-dark)',
                  color: 'white',
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                    Total de Clientes
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                    {stats?.totalCustomers || 0}
                  </div>
                </div>
              </div>

              {/* Best Sellers */}
              {stats?.bestSellers && stats.bestSellers.length > 0 && (
                <div style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--gray-200)'
                }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    color: 'var(--dark)'
                  }}>
                    Produtos mais vendidos
                  </h2>

                  <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left' }}>Produto</th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}>Unidades Vendidas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.bestSellers.map((item, index) => (
                          <tr key={index}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'inline-block' }}></span>
                                <span style={{ fontWeight: 600 }}>{item.product.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>
                              {item.total}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </>
  );
}
