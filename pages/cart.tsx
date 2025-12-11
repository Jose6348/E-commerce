import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
}

interface Cart {
  id: number;
  items: CartItem[];
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--gray-200)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>Carregando carrinho...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Carrinho - ShopHub</title>
      </Head>

      <div style={{
        background: 'var(--surface-soft)',
        minHeight: 'calc(100vh - 200px)',
        padding: '3rem 0'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--primary-dark)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Carrinho</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)' }}>
              Seu carrinho
            </h1>
            <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
              Revise itens, ajuste quantidades e finalize com entrega expressa.
            </p>
          </div>

          {!cart?.items || cart.items.length === 0 ? (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-2xl)',
              padding: '4rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                Seu carrinho está vazio
              </h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                Adicione produtos para começar suas compras!
              </p>
              <Link href="/products">
                <button className="btn btn-primary btn-lg" style={{
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  Ver Produtos
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '2rem'
            }}>
              {/* Cart Items */}
              <div>
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      boxShadow: 'var(--shadow)',
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr auto',
                      gap: '1.5rem',
                      alignItems: 'center',
                      border: '1px solid var(--gray-200)'
                    }}
                  >
                    {/* Image */}
                    <Link href={`/products/${item.product.slug}`}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'var(--surface-soft)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        cursor: 'pointer'
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
                          <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)', fontWeight: 700 }}>
                            IMG
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div>
                      <Link href={`/products/${item.product.slug}`} style={{
                        textDecoration: 'none'
                      }}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--dark)',
                          marginBottom: '0.5rem'
                        }}>
                          {item.product.name}
                        </h3>
                      </Link>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                          background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '1rem'
                      }}>
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid var(--gray-300)',
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 700,
                            opacity: item.quantity <= 1 ? 0.5 : 1
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          padding: '0.5rem 1rem',
                          fontWeight: 700,
                          fontSize: '1.125rem'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id || item.quantity >= item.product.stock}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid var(--gray-300)',
                            background: 'white',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 700,
                            opacity: item.quantity >= item.product.stock ? 0.5 : 1
                          }}
                        >
                          +
                        </button>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--gray-500)',
                          marginLeft: '0.5rem'
                        }}>
                          ({item.product.stock} disponíveis)
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary-dark)',
                          border: '1px solid var(--primary)',
                          padding: '0.75rem 1.25rem',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {updating === item.id ? 'Removendo...' : 'Remover'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'sticky',
                top: '100px',
                border: '1px solid var(--gray-200)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Resumo</h2>
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.75rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem' }}>
                    {cart.items.length} item(s)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>{formatPrice(calculateTotal())}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-600)' }}>
                  <span>Entrega</span>
                  <span style={{ fontWeight: 700 }}>Calculada no checkout</span>
                </div>

                <div style={{ height: '1px', background: 'var(--gray-200)', margin: '0.25rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                <Link href="/checkout">
                    <button className="btn btn-primary btn-lg btn-block" style={{ width: '100%', boxShadow: 'var(--shadow-lg)' }}>
                    Finalizar Compra
                  </button>
                </Link>

                <Link href="/products">
                  <button className="btn btn-outline btn-block" style={{ width: '100%' }}>
                    Continuar Comprando
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
