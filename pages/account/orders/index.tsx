import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string;
    };
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: '#f59e0b',
      PAID: '#3b82f6',
      SHIPPED: '#8b5cf6',
      COMPLETED: '#10b981',
      CANCELED: '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: 'Pendente',
      PAID: 'Pago',
      SHIPPED: 'Enviado',
      COMPLETED: 'Concluído',
      CANCELED: 'Cancelado'
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meus Pedidos - ShopHub</title>
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Pedidos</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)' }}>
              Meus pedidos
            </h1>
            <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>Acompanhe status, valores e detalhes de cada compra.</p>
          </div>

          {orders.length === 0 ? (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-2xl)',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Você ainda não fez nenhum pedido
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                Comece suas compras agora!
              </p>
              <Link href="/products">
                <button className="btn btn-primary btn-lg">
                  Ver Produtos
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                      background: 'var(--surface)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--gray-200)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid var(--gray-100)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                        Pedido #{order.id}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--surface-soft)',
                      border: `1px solid ${getStatusColor(order.status)}`,
                      color: 'var(--dark)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: 700
                    }}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    {order.items.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '0.75rem 0',
                          borderBottom: index < order.items.length - 1 ? '1px solid var(--gray-100)' : 'none'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: 'var(--gray-100)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-600)' }}>IMG</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                            {item.product.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                            Quantidade: {item.quantity} × {formatPrice(item.price)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '2px solid var(--gray-100)'
                  }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      Total do Pedido
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {formatPrice(order.total)}
                    </div>
                  </div>

                  <Link href={`/account/orders/${order.id}`}>
                    <button style={{
                      width: '100%',
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      transition: 'all var(--transition-base)'
                    }}>
                      Ver Detalhes
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
