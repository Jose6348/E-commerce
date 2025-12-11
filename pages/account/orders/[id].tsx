import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface OrderDetailProps {
  order: {
    id: number;
    total: number;
    status: string;
    createdAt: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal: string;
      country: string;
    };
    items: Array<{
      id: number;
      quantity: number;
      price: number;
      product: {
        name: string;
        imageUrl: string;
        slug: string;
      };
    }>;
  } | null;
}

export default function OrderDetailPage({ order }: OrderDetailProps) {
  const router = useRouter();

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Pedido não encontrado</h1>
        <button onClick={() => router.back()} className="btn btn-primary">
          Voltar
        </button>
      </div>
    );
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  return (
    <>
      <Head>
        <title>Pedido #{order.id} - ShopHub</title>
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Back Button */}
          <Link href="/account/orders" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            marginBottom: '2rem',
            fontWeight: 700
          }}>
            ← Voltar para Meus Pedidos
          </Link>

          {/* Header */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  marginBottom: '0.5rem',
                  color: 'var(--dark)'
                }}>
                  Pedido <span className="gradient-text">#{order.id}</span>
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Realizado em {formatDate(order.createdAt)}
                </p>
              </div>

              <div style={{
                background: 'var(--surface-soft)',
                border: `1px solid ${getStatusColor(order.status)}`,
                color: 'var(--dark)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                fontSize: '1rem',
                fontWeight: 700
              }}>
                {getStatusText(order.status)}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem'
          }}>
            {/* Items */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              gridColumn: '1 / -1',
              border: '1px solid var(--gray-200)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: 'var(--dark)'
              }}>
                Itens do Pedido
              </h2>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--gray-200)'
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--radius-lg)',
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
                      <span style={{ fontSize: '2rem' }}>📦</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <Link href={`/products/${item.product.slug}`} style={{
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      color: 'var(--dark)',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      {item.product.name}
                    </Link>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Quantidade: {item.quantity}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Preço unitário: {formatPrice(item.price)}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--primary)'
                  }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '2px solid var(--gray-200)'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Total do Pedido
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {formatPrice(order.total)}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: 'var(--dark)'
              }}>
                📍 Endereço de Entrega
              </h2>
              <div style={{
                background: 'var(--gray-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                lineHeight: '1.8'
              }}>
                <div>{order.address.street}</div>
                <div>{order.address.city}, {order.address.state}</div>
                <div>CEP: {order.address.postal}</div>
                <div>{order.address.country}</div>
              </div>
            </div>

            {/* Order Status */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1rem',
                color: 'var(--dark)'
              }}>
                📦 Status da Entrega
              </h2>
              <div style={{
                background: 'var(--gray-50)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: getStatusColor(order.status)
                  }}></div>
                  <span style={{ fontWeight: 600 }}>{getStatusText(order.status)}</span>
                </div>
                <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 1.5rem' }}>
                  {order.status === 'PENDING' && 'Aguardando confirmação do pagamento'}
                  {order.status === 'PAID' && 'Pagamento confirmado! Preparando para envio'}
                  {order.status === 'SHIPPED' && 'Pedido enviado e a caminho'}
                  {order.status === 'COMPLETED' && 'Pedido entregue com sucesso!'}
                  {order.status === 'CANCELED' && 'Pedido cancelado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(params?.id as string) },
      include: {
        address: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true,
                slug: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return { props: { order: null } };
    }

    return {
      props: {
        order: JSON.parse(JSON.stringify(order))
      }
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      props: {
        order: null
      }
    };
  }
};
