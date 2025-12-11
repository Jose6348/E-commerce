import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        fetchCartCount();
      }
    }
  }, [router.pathname]);

  const fetchUser = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const count = data.cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      setUser(null);
      setCartCount(0);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header style={{
      background: 'var(--surface)',
      color: 'var(--dark)',
      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.04)'
    }}>
      <nav className="container" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            textDecoration: 'none',
            color: 'var(--dark)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              background: 'var(--gradient-primary)',
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.25rem',
              color: 'white',
              boxShadow: 'var(--shadow-sm)'
            }}>S</span>
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-lg" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
            <Link href="/products" className="nav-link" style={{
              color: 'var(--dark)',
              textDecoration: 'none',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-base)'
            }}>
              Produtos
            </Link>

            {user && user.role === 'ADMIN' && (
              <Link href="/admin" className="nav-link" style={{
                color: 'var(--accent-dark)',
                textDecoration: 'none',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                transition: 'all var(--transition-base)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                background: 'rgba(251, 191, 36, 0.08)'
              }}>
                Painel Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-md" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
            <Link href="/cart" style={{
              position: 'relative',
              color: 'var(--dark)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-base)'
            }} className="cart-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2L11 8H21L18 14H10L8 8H2L5 14H7L9 20H19L21 14" />
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
              </svg>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Carrinho</span>
              {cartCount > 0 && (
                <span style={{
                  background: 'var(--primary-dark)',
                  color: 'white',
                  borderRadius: '9999px',
                  minWidth: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0 0.4rem'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-sm">
                <Link href="/account/orders" style={{
                  color: 'var(--dark)',
                  textDecoration: 'none',
                  fontWeight: 500
                }}>
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{
                  background: 'transparent',
                  color: 'var(--primary-dark)',
                  border: '2px solid rgba(0,0,0,0.06)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)'
                }}>
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-sm">
                <Link href="/login">
                  <button className="btn btn-sm btn-ghost" style={{
                    background: 'transparent',
                    color: 'var(--dark)',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    fontSize: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}>
                    Entrar
                  </button>
                </Link>
                <Link href="/register">
                  <button className="btn btn-sm btn-primary" style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.4rem 1rem',
                    fontSize: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    Cadastrar
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--dark)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{
              color: 'var(--dark)',
              textDecoration: 'none',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500
            }}>
              Produtos
            </Link>
            {user && user.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} style={{
                color: 'var(--accent-dark)',
                textDecoration: 'none',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 500
              }}>
                Painel Admin
              </Link>
            )}
            {user ? (
              <>
                <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} style={{
                  color: 'var(--dark)',
                  textDecoration: 'none',
                  padding: '0.75rem'
                }}>
                  Minhas Compras
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{
                  background: 'transparent',
                  color: 'var(--dark)',
                  border: '2px solid rgba(0,0,0,0.06)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button style={{
                    width: '100%',
                    background: 'transparent',
                    color: 'var(--dark)',
                    border: '2px solid rgba(0,0,0,0.06)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}>
                    Entrar
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}>
                    Cadastrar
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .flex.items-center.gap-lg,
          .flex.items-center.gap-md {
            display: none !important;
          }
        }

        .nav-link:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .cart-link:hover {
          background: rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </header>
  );
}
