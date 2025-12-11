import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  category: Category;
}

interface ProductDetailProps {
  product: Product | null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1>Produto não encontrado</h1>
        <button onClick={() => router.push('/products')} className="btn btn-primary">
          Ver Produtos
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

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity })
      });

      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/cart');
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao adicionar ao carrinho. Faça login primeiro.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao adicionar ao carrinho. Faça login primeiro.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Head>
        <title>{product.name} - ShopHub</title>
        <meta name="description" content={product.description} />
      </Head>

      <div style={{ background: 'var(--surface-soft)', minHeight: 'calc(100vh - 200px)', padding: '3rem 0' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '1.5rem', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <a href="/" style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>Home</a>
            <span style={{ margin: '0 0.5rem', color: 'var(--gray-400)' }}>→</span>
            <a href="/products" style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>Produtos</a>
            <span style={{ margin: '0 0.5rem', color: 'var(--gray-400)' }}>→</span>
            <a href={`/category/${product.category.slug}`} style={{ color: 'var(--gray-600)', textDecoration: 'none' }}>
              {product.category.name}
            </a>
            <span style={{ margin: '0 0.5rem', color: 'var(--gray-400)' }}>→</span>
            <span style={{ color: 'var(--dark)', fontWeight: 700 }}>{product.name}</span>
          </div>

          {/* Product Detail */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
              {/* Image */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  background: 'var(--surface-soft)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  minHeight: '420px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ fontSize: '1rem', color: 'var(--gray-500)', fontWeight: 600 }}>Imagem não disponível</div>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(255,255,255,0.92)', padding: '0.75rem 1rem', borderRadius: '14px', boxShadow: 'var(--shadow)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{product.category.name}</div>
                  <div style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>{formatPrice(product.price)}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>Entrega rápida • Cartão incluso</div>
                </div>
              </div>

              {/* Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.45rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>{product.category.name}</span>
                  <span style={{ background: 'var(--secondary-light)', color: 'var(--secondary-dark)', padding: '0.45rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>Entrega hoje</span>
                </div>

                <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--dark)', lineHeight: 1.2 }}>
                  {product.name}
                </h1>

                <div style={{ fontSize: '2.6rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {formatPrice(product.price)}
                </div>

                <p style={{ fontSize: '1.05rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>
                  {product.description}
                </p>

                {/* Stock Status */}
                <div style={{ marginTop: '0.5rem' }}>
                  {product.stock === 0 ? (
                    <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 700, textAlign: 'center' }}>
                      Produto esgotado
                    </div>
                  ) : product.stock <= 5 ? (
                    <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 700, textAlign: 'center' }}>
                      Últimas {product.stock} unidades
                    </div>
                  ) : (
                    <div style={{ background: '#d1fae5', color: '#065f46', padding: '0.9rem', borderRadius: 'var(--radius-md)', fontWeight: 700, textAlign: 'center' }}>
                      Em estoque ({product.stock} unidades)
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                    <label style={{ fontWeight: 700, color: 'var(--gray-700)' }}>Quantidade:</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '2px solid var(--gray-300)',
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1.25rem'
                        }}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                        style={{
                          width: '80px',
                          padding: '0.5rem',
                          textAlign: 'center',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          border: '2px solid var(--gray-300)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '2px solid var(--gray-300)',
                          background: 'white',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1.25rem'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    width: '100%',
                    background: product.stock === 0 ? 'var(--gray-300)' : 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    fontSize: '1.05rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    marginTop: '1rem',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  {isAdding ? 'Adicionando...' : product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                </button>

                {/* Trust / perks */}
                <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { text: 'Entrega expressa e agendada', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h13v9H3z"></path><path d="M16 8h5v6h-5z"></path><circle cx="7" cy="16" r="2"></circle><circle cx="17" cy="16" r="2"></circle></svg>
                    ) },
                    { text: 'Embalagem premium com laço', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9 4 9-4"></path><path d="M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8"></path><path d="M3 7l9 4 9-4-9-4-9 4z"></path></svg>
                    ) },
                    { text: 'Cartão personalizado incluso', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ) },
                    { text: 'Troca fácil em até 7 dias', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22-4l-4.64 4.36A9 9 0 006.51 15"></path></svg>
                    ) }
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'var(--surface-soft)', borderRadius: '12px', padding: '0.9rem 1rem', border: '1px solid var(--gray-200)', display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--gray-700)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--primary-dark)', display: 'inline-flex' }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* Share */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--gray-600)' }}>
                  <span style={{ fontWeight: 700 }}>Compartilhar:</span>
                  {['WhatsApp', 'E-mail', 'Link'].map((item) => (
                    <button key={item} className="btn btn-ghost" style={{ padding: '0.35rem 0.75rem', borderRadius: '10px', border: '1px solid var(--gray-200)', color: 'var(--dark)', cursor: 'pointer' }}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params?.slug as string },
      include: { category: true }
    });

    if (!product || !product.active) {
      return { props: { product: null } };
    }

    return {
      props: {
        product: JSON.parse(JSON.stringify(product))
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { props: { product: null } };
  }
};
