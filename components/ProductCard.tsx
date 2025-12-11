import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    setIsAdding(true);

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        if (onAddToCart) onAddToCart(product.id);

        // Trigger cart update event
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao adicionar ao carrinho');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Erro ao adicionar ao carrinho. Faça login primeiro.');
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div className="product-card" style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Success Badge */}
        {showSuccess && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--secondary)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem',
            fontWeight: 600,
            zIndex: 10,
            animation: 'slideIn 0.3s ease-out'
          }}>
            Adicionado
          </div>
        )}

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            zIndex: 10
          }}>
            ESGOTADO
          </div>
        )}

        {product.stock > 0 && product.stock <= 5 && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(245, 158, 11, 0.9)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            zIndex: 10
          }}>
            ÚLTIMAS UNIDADES
          </div>
        )}

        {/* Image */}
        <div style={{
          width: '100%',
          height: '250px',
          background: 'var(--surface-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform var(--transition-slow)'
              }}
              className="product-image"
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              background: 'var(--gray-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-600)',
              fontWeight: 700
            }}>
              IMG
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: '1.25rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Category */}
          {product.category && (
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--primary-dark)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              {product.category.name}
            </div>
          )}

          {/* Name */}
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--dark)',
            marginBottom: '0.5rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>

          {/* Description */}
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--gray-600)',
            marginBottom: '1rem',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>

          {/* Price and Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {formatPrice(product.price)}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              style={{
                background: product.stock === 0
                  ? 'var(--gray-300)'
                  : 'var(--gradient-primary)',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'all var(--transition-base)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              className="add-to-cart-btn"
            >
              {isAdding ? (
                <>
                  <span className="spinner" style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%'
                  }}></span>
                  <span>...</span>
                </>
              ) : (
                <>
                  {product.stock === 0 ? 'Esgotado' : 'Comprar'}
                </>
              )}
            </button>
          </div>

          {/* Stock Info */}
          <div style={{
            marginTop: '0.75rem',
            fontSize: '0.75rem',
            color: 'var(--gray-500)',
            textAlign: 'right'
          }}>
            {product.stock > 5 ? `${product.stock} em estoque` : product.stock > 0 ? `Apenas ${product.stock} restantes` : ''}
          </div>
        </div>

        <style jsx>{`
          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-xl);
          }

          .product-card:hover .product-image {
            transform: scale(1.1);
          }

          .add-to-cart-btn:hover:not(:disabled) {
            box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.4);
            transform: translateY(-2px);
          }

          .add-to-cart-btn:active:not(:disabled) {
            transform: translateY(0);
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .spinner {
            animation: spin 0.6s linear infinite;
          }
        `}</style>
      </div>
    </Link>
  );
}
